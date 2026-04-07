#!/usr/bin/env python3
"""
Dynamic SQL seed parser for Platform-Demo.

Parses ALL columns from the SQL INSERT statements generically,
so adding new columns to the SQL won't require parser changes.
Maps SQL fields → Prisma schema fields with type conversions.
"""
import re, json, sys

sql = open('/tmp/seed_sample_data.sql', 'r').read()


# ===========================================================================
# GENERIC SQL INSERT PARSER
# ===========================================================================

def parse_sql_value(raw: str):
    """Parse a single SQL value token into a Python object."""
    raw = raw.strip()
    # Remove casts
    raw = re.sub(r"'::(jsonb|date|text)$", "'", raw)
    raw = re.sub(r"::(jsonb|date|text)$", "", raw)
    if raw == 'NULL':
        return None
    if raw.startswith("'") and raw.endswith("'"):
        inner = raw[1:-1].replace("''", "'")
        # Try JSON parse for arrays/objects
        if inner.startswith('[') or inner.startswith('{'):
            try:
                return json.loads(inner)
            except json.JSONDecodeError:
                pass
        return inner
    # Boolean
    if raw.lower() == 'true':
        return True
    if raw.lower() == 'false':
        return False
    # Numeric
    try:
        if '.' in raw:
            return float(raw)
        return int(raw)
    except ValueError:
        return raw


def tokenize_values_row(row_str: str) -> list:
    """Split a VALUES row into individual tokens, respecting quotes and parens."""
    tokens = []
    i = 0
    current = ''
    in_string = False
    paren_depth = 0

    while i < len(row_str):
        c = row_str[i]
        if c == "'" and not in_string:
            in_string = True
            current += c
        elif c == "'" and in_string:
            if i + 1 < len(row_str) and row_str[i + 1] == "'":
                current += "''"
                i += 2
                continue
            else:
                in_string = False
                current += c
        elif c == '(' and not in_string:
            paren_depth += 1
            current += c
        elif c == ')' and not in_string:
            paren_depth -= 1
            current += c
        elif c == ',' and not in_string and paren_depth == 0:
            tokens.append(current.strip())
            current = ''
        else:
            current += c
        i += 1
    if current.strip():
        tokens.append(current.strip())
    return tokens


def parse_insert_block(sql_text: str, table_name: str) -> list[dict]:
    """
    Generically parse all INSERT INTO <table_name> blocks.
    Returns list of dicts with column names as keys.
    """
    results = []
    # Find all INSERT blocks for this table
    pattern = rf"INSERT INTO {re.escape(table_name)}\s*\(\s*([\s\S]*?)\)\s*VALUES\s*([\s\S]*?)(?=ON CONFLICT|INSERT INTO|$)"
    for match in re.finditer(pattern, sql_text):
        cols_raw = match.group(1)
        values_raw = match.group(2)

        # Parse column names
        columns = [c.strip() for c in cols_raw.split(',')]

        # Split into individual row strings
        # Each row is (...), possibly spanning multiple lines
        row_strs = []
        depth = 0
        current_row = ''
        for char in values_raw:
            if char == '(':
                depth += 1
                if depth == 1:
                    current_row = ''
                    continue
                else:
                    current_row += char
            elif char == ')':
                depth -= 1
                if depth == 0:
                    row_strs.append(current_row)
                else:
                    current_row += char
            elif depth > 0:
                current_row += char

        for row_str in row_strs:
            tokens = tokenize_values_row(row_str)
            if len(tokens) != len(columns):
                # Try to handle subquery tokens like (SELECT ...)
                pass
            row = {}
            for idx, col in enumerate(columns):
                if idx < len(tokens):
                    row[col] = parse_sql_value(tokens[idx])
                else:
                    row[col] = None
            results.append(row)

    return results


# ===========================================================================
# PARSE ALL TABLES
# ===========================================================================

raw_firms = parse_insert_block(sql, 'firms')
raw_contacts = parse_insert_block(sql, 'contacts')
raw_funds = parse_insert_block(sql, 'funds')
raw_deals = parse_insert_block(sql, 'deals')

print(f"Parsed: {len(raw_firms)} firms, {len(raw_contacts)} contacts, {len(raw_funds)} funds, {len(raw_deals)} deals", file=sys.stderr)


# ===========================================================================
# PARSE JUNCTION TABLES (use regex since they have subqueries)
# ===========================================================================

firm_investor_types = []
for m in re.finditer(
    r"\('(a1b2c3d4[^']+)',\s*\(SELECT id FROM investor_categories WHERE slug = '([^']+)'\)\)",
    sql
):
    firm_investor_types.append({'firmId': m.group(1), 'slug': m.group(2)})

firm_industries = []
for m in re.finditer(
    r"\('(a1b2c3d4[^']+)',\s*\(SELECT id FROM industry_verticals WHERE slug = '([^']+)'\),\s*(true|false)\)",
    sql
):
    firm_industries.append({
        'firmId': m.group(1),
        'slug': m.group(2),
        'isPrimary': m.group(3) == 'true',
    })

print(f"Parsed: {len(firm_investor_types)} investor type junctions, {len(firm_industries)} industry junctions", file=sys.stderr)


# ===========================================================================
# AUM RANGE → CENTS CONVERSION
# ===========================================================================

def aum_range_to_cents(aum_range: str | None) -> int | None:
    """Convert aum_range text like '$10B+', '$1B-5B', '$500M-1B' to cents (use midpoint or lower bound)."""
    if not aum_range:
        return None
    s = aum_range.strip()

    def parse_value(v: str) -> int | None:
        v = v.strip().lstrip('$').rstrip('+').strip()
        if not v:
            return None
        multiplier = 1
        if v.endswith('T') or v.endswith('t'):
            multiplier = 1_000_000_000_000
            v = v[:-1]
        elif v.endswith('B') or v.endswith('b'):
            multiplier = 1_000_000_000
            v = v[:-1]
        elif v.endswith('M') or v.endswith('m'):
            multiplier = 1_000_000
            v = v[:-1]
        elif v.endswith('K') or v.endswith('k'):
            multiplier = 1_000
            v = v[:-1]
        try:
            return int(float(v) * multiplier * 100)  # Convert to cents
        except ValueError:
            return None

    # Handle ranges like "$1B-5B"
    parts = re.split(r'[-–]', s)
    if len(parts) == 2:
        low = parse_value(parts[0])
        high = parse_value(parts[1])
        # If high has no unit, inherit from context
        if high is not None and low is not None:
            return low  # Use lower bound
        return low or high

    return parse_value(s)


# ===========================================================================
# COMPUTE FUND SIZE PER FIRM (sum of fund sizes)
# ===========================================================================

fund_size_by_firm: dict[str, float] = {}
for fund in raw_funds:
    fid = fund.get('firm_id')
    size = fund.get('fund_size')
    if fid and size:
        fund_size_by_firm[fid] = fund_size_by_firm.get(fid, 0) + float(size)


# ===========================================================================
# MAP FIRMS TO PRISMA SCHEMA
# ===========================================================================

CRM_MAP = {
    'active': 'ACTIVE_RELATIONSHIP',
    'prospect': 'PROSPECT',
    'contacted': 'CONTACTED',
    'inactive': 'DORMANT',
}

def extract_linkedin(source_links) -> str | None:
    """Extract LinkedIn URL from source_links JSONB array."""
    if isinstance(source_links, list):
        for link in source_links:
            if isinstance(link, str) and 'linkedin.com' in link:
                return link
    return None


firms = []
for raw in raw_firms:
    firm_id = raw.get('id')

    # Parse AUM
    aum_cents = aum_range_to_cents(raw.get('aum_range'))

    # Fund size from funds table
    total_fund_cents = None
    if firm_id in fund_size_by_firm:
        total_fund_cents = int(fund_size_by_firm[firm_id] * 100)

    # Check sizes (stored as dollars in SQL, convert to cents)
    check_min = raw.get('check_size_min')
    check_max = raw.get('check_size_max')
    min_check_cents = int(float(check_min) * 100) if check_min is not None else None
    max_check_cents = int(float(check_max) * 100) if check_max is not None else None

    # LinkedIn from source_links
    linkedin_url = extract_linkedin(raw.get('source_links'))

    # Geographic focus
    geo = raw.get('geography_focus', [])
    if isinstance(geo, str):
        try:
            geo = json.loads(geo)
        except:
            geo = [geo] if geo else []

    # Stage preferences
    stages = raw.get('stage_preferences', [])
    if isinstance(stages, str):
        try:
            stages = json.loads(stages)
        except:
            stages = [stages] if stages else []

    # Deal type preferences
    deal_types = raw.get('deal_type_preferences', [])
    if isinstance(deal_types, str):
        try:
            deal_types = json.loads(deal_types)
        except:
            deal_types = [deal_types] if deal_types else []

    firms.append({
        'id': firm_id,
        'name': raw.get('firm_name', ''),
        'legalName': raw.get('legal_name'),
        'description': raw.get('description') or None,
        'website': raw.get('website') or None,
        'linkedinUrl': linkedin_url,
        'headquartersCity': raw.get('hq_city') or None,
        'headquartersState': raw.get('hq_state') or None,
        'headquartersCountry': raw.get('hq_country') or None,
        'geographicFocus': geo if isinstance(geo, list) else [],
        'aumCents': aum_cents,
        'totalFundSizeCents': total_fund_cents,
        'minCheckSizeCents': min_check_cents,
        'maxCheckSizeCents': max_check_cents,
        'stagePreferences': stages if isinstance(stages, list) else [],
        'dealTypePreferences': deal_types if isinstance(deal_types, list) else [],
        'yearFounded': raw.get('year_founded'),
        'crmStatus': CRM_MAP.get(raw.get('crm_status', 'prospect'), 'PROSPECT'),
        'internalScore': raw.get('internal_score', 50),
        'internalNotes': raw.get('notes') or None,
    })


# ===========================================================================
# MAP CONTACTS
# ===========================================================================

contacts = []
for raw in raw_contacts:
    contacts.append({
        'id': raw.get('id'),
        'firmId': raw.get('firm_id'),
        'firstName': raw.get('first_name', ''),
        'lastName': raw.get('last_name', ''),
        'title': raw.get('title') or None,
        'email': raw.get('email') or None,
        'phone': raw.get('phone') or None,
        'linkedinUrl': raw.get('linkedin_url') or None,
        'isPrimaryContact': bool(raw.get('is_primary', False)),
        'department': raw.get('department') or None,
        'notes': raw.get('notes') or None,
    })


# ===========================================================================
# MAP DEALS → TRANSACTIONS
# ===========================================================================

DEAL_TYPE_MAP = {
    'venture': 'VENTURE_CAPITAL',
    'buyout': 'LEVERAGED_BUYOUT',
    'ipo': 'IPO',
    'direct-listing': 'OTHER',
    'crypto': 'OTHER',
    'growth': 'GROWTH_EQUITY',
    'debt': 'INVESTMENT_DEBT',
    'secondary': 'SECONDARY',
    'merger': 'MERGER',
    'acquisition': 'ACQUISITION',
}

STATUS_MAP = {
    'announced': 'ANNOUNCED',
    'closed': 'COMPLETED',
    'rumored': 'RUMORED',
}

deals = []
for raw in raw_deals:
    deal_size = raw.get('deal_size')
    deal_size_cents = int(float(deal_size) * 100) if deal_size is not None else None

    deal_date = raw.get('deal_date')
    if deal_date and isinstance(deal_date, str):
        # Remove ::date cast if present
        deal_date = deal_date.replace('::date', '').strip("'")

    deals.append({
        'id': raw.get('id'),
        'firmId': raw.get('firm_id'),
        'transactionName': raw.get('deal_name', ''),
        'targetCompany': raw.get('target_company') or None,
        'transactionType': DEAL_TYPE_MAP.get(raw.get('deal_type', ''), 'OTHER'),
        'dealSizeCents': deal_size_cents,
        'announcedDate': str(deal_date) if deal_date else None,
        'stage': raw.get('stage') or None,
        'sector': raw.get('sector') or None,
        'status': STATUS_MAP.get(raw.get('status', 'announced'), 'ANNOUNCED'),
        'sourceUrl': raw.get('source_url') or None,
    })


# ===========================================================================
# OUTPUT
# ===========================================================================

output = {
    'firms': firms,
    'firmInstitutionTypes': firm_investor_types,
    'firmIndustries': firm_industries,
    'contacts': contacts,
    'deals': deals,
}

# Validation
print(f"\nFinal counts:", file=sys.stderr)
print(f"  Firms: {len(firms)}", file=sys.stderr)
print(f"  Firms with AUM: {sum(1 for f in firms if f['aumCents'])}", file=sys.stderr)
print(f"  Firms with fund size: {sum(1 for f in firms if f['totalFundSizeCents'])}", file=sys.stderr)
print(f"  Firms with check size: {sum(1 for f in firms if f['minCheckSizeCents'] or f['maxCheckSizeCents'])}", file=sys.stderr)
print(f"  Firms with LinkedIn: {sum(1 for f in firms if f['linkedinUrl'])}", file=sys.stderr)
print(f"  Contacts: {len(contacts)}", file=sys.stderr)
print(f"  Deals: {len(deals)}", file=sys.stderr)
print(f"  Institution type junctions: {len(firm_investor_types)}", file=sys.stderr)
print(f"  Industry junctions: {len(firm_industries)}", file=sys.stderr)

json.dump(output, sys.stdout, indent=2)
