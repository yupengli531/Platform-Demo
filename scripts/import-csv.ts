/**
 * CSV Import Script for MPV Capital Intelligence Platform
 *
 * Imports firm data from CSV files into the production database.
 * Handles mapping to institution types, industries, contacts, and transactions.
 *
 * Usage:
 *   npm run import:csv -- --file path/to/firms.csv
 *   npm run import:csv -- --file path/to/firms.csv --dry-run
 *   npm run import:csv -- --file path/to/firms.csv --skip-existing
 *
 * Expected CSV columns (flexible - maps to best match):
 *   Required: firm_name OR name OR company_name
 *   Optional: All other fields (see COLUMN_MAPPINGS below)
 *
 * The importer will:
 *   1. Parse the CSV file
 *   2. Map columns to database fields
 *   3. Match institution types and industries by name
 *   4. Create firm records with proper associations
 *   5. Create contacts if contact columns are present
 *   6. Log results and any unmapped data
 */

import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Column name mappings - maps common CSV headers to our schema
const COLUMN_MAPPINGS: Record<string, string> = {
  // Firm name variants
  'firm_name': 'name',
  'firm name': 'name',
  'company_name': 'name',
  'company name': 'name',
  'company': 'name',
  'name': 'name',
  'organization': 'name',
  'fund_name': 'name',
  'fund name': 'name',

  // Legal name
  'legal_name': 'legalName',
  'legal name': 'legalName',

  // Description
  'description': 'description',
  'about': 'description',
  'overview': 'description',
  'summary': 'description',
  'bio': 'description',

  // Website
  'website': 'website',
  'url': 'website',
  'web': 'website',
  'homepage': 'website',

  // LinkedIn
  'linkedin': 'linkedinUrl',
  'linkedin_url': 'linkedinUrl',
  'linkedin url': 'linkedinUrl',

  // Location
  'city': 'headquartersCity',
  'headquarters_city': 'headquartersCity',
  'hq_city': 'headquartersCity',
  'hq city': 'headquartersCity',
  'state': 'headquartersState',
  'headquarters_state': 'headquartersState',
  'hq_state': 'headquartersState',
  'hq state': 'headquartersState',
  'province': 'headquartersState',
  'country': 'headquartersCountry',
  'headquarters_country': 'headquartersCountry',
  'hq_country': 'headquartersCountry',
  'hq country': 'headquartersCountry',
  'region': 'headquartersRegion',

  // Financial
  'aum': 'aumDollars',
  'assets_under_management': 'aumDollars',
  'assets under management': 'aumDollars',
  'fund_size': 'totalFundSizeDollars',
  'fund size': 'totalFundSizeDollars',
  'total_fund_size': 'totalFundSizeDollars',
  'min_check_size': 'minCheckSizeDollars',
  'min check size': 'minCheckSizeDollars',
  'minimum_investment': 'minCheckSizeDollars',
  'minimum investment': 'minCheckSizeDollars',
  'max_check_size': 'maxCheckSizeDollars',
  'max check size': 'maxCheckSizeDollars',
  'maximum_investment': 'maxCheckSizeDollars',
  'maximum investment': 'maxCheckSizeDollars',
  'check_size': 'checkSizeRange',
  'check size': 'checkSizeRange',

  // Classification
  'type': 'institutionType',
  'firm_type': 'institutionType',
  'firm type': 'institutionType',
  'investor_type': 'institutionType',
  'investor type': 'institutionType',
  'institution_type': 'institutionType',
  'institution type': 'institutionType',
  'category': 'institutionType',

  'industry': 'industry',
  'industries': 'industry',
  'sector': 'industry',
  'sectors': 'industry',
  'industry_focus': 'industry',
  'industry focus': 'industry',
  'sector_focus': 'industry',
  'sector focus': 'industry',
  'vertical': 'industry',
  'verticals': 'industry',

  // Preferences
  'stage': 'stagePreferences',
  'stage_preference': 'stagePreferences',
  'stage preference': 'stagePreferences',
  'stages': 'stagePreferences',
  'investment_stage': 'stagePreferences',
  'investment stage': 'stagePreferences',
  'deal_type': 'dealTypePreferences',
  'deal type': 'dealTypePreferences',
  'deal_types': 'dealTypePreferences',

  'geographic_focus': 'geographicFocus',
  'geographic focus': 'geographicFocus',
  'geography': 'geographicFocus',
  'investment_horizon': 'investmentHorizon',
  'investment horizon': 'investmentHorizon',

  // Operational
  'year_founded': 'yearFounded',
  'year founded': 'yearFounded',
  'founded': 'yearFounded',
  'founded_year': 'yearFounded',
  'employees': 'numberOfEmployees',
  'number_of_employees': 'numberOfEmployees',
  'headcount': 'numberOfEmployees',
  'partners': 'numberOfPartners',
  'portfolio_size': 'activePortfolioSize',
  'portfolio size': 'activePortfolioSize',
  'active_portfolio': 'activePortfolioSize',

  // Contacts
  'contact_name': 'contactName',
  'contact name': 'contactName',
  'key_contact': 'contactName',
  'key contact': 'contactName',
  'primary_contact': 'contactName',
  'contact_first_name': 'contactFirstName',
  'contact first name': 'contactFirstName',
  'first_name': 'contactFirstName',
  'first name': 'contactFirstName',
  'contact_last_name': 'contactLastName',
  'contact last name': 'contactLastName',
  'last_name': 'contactLastName',
  'last name': 'contactLastName',
  'contact_title': 'contactTitle',
  'contact title': 'contactTitle',
  'title': 'contactTitle',
  'contact_email': 'contactEmail',
  'contact email': 'contactEmail',
  'email': 'contactEmail',
  'contact_phone': 'contactPhone',
  'contact phone': 'contactPhone',
  'phone': 'contactPhone',

  // CRM
  'status': 'crmStatus',
  'crm_status': 'crmStatus',
  'relationship_status': 'crmStatus',
  'score': 'internalScore',
  'internal_score': 'internalScore',
  'priority': 'priority',
  'notes': 'internalNotes',
  'internal_notes': 'internalNotes',

  // Data source
  'source': 'dataSource',
  'data_source': 'dataSource',
};

// Parse dollar amounts (handles "$1.5B", "$200M", "$50K", "$1,000,000", etc.)
function parseDollarAmount(value: string | undefined | null): bigint | null {
  if (!value || value.trim() === '' || value === 'N/A' || value === '-') return null;

  let cleaned = value.replace(/[$,\s]/g, '').trim();
  let multiplier = 1;

  if (cleaned.endsWith('B') || cleaned.endsWith('b')) {
    multiplier = 1_000_000_000;
    cleaned = cleaned.slice(0, -1);
  } else if (cleaned.endsWith('M') || cleaned.endsWith('m')) {
    multiplier = 1_000_000;
    cleaned = cleaned.slice(0, -1);
  } else if (cleaned.endsWith('K') || cleaned.endsWith('k')) {
    multiplier = 1_000;
    cleaned = cleaned.slice(0, -1);
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) return null;

  // Convert to cents
  return BigInt(Math.round(num * multiplier * 100));
}

// Parse check size range ("$5M - $50M" or "$5M-$50M")
function parseCheckSizeRange(value: string | undefined | null): { min: bigint | null; max: bigint | null } {
  if (!value) return { min: null, max: null };

  const parts = value.split(/[-–—]/).map((s) => s.trim());
  if (parts.length === 2) {
    return { min: parseDollarAmount(parts[0]), max: parseDollarAmount(parts[1]) };
  }
  return { min: null, max: null };
}

// Parse multi-value fields (semicolon or comma separated)
function parseMultiValue(value: string | undefined | null): string[] {
  if (!value) return [];
  return value.split(/[;|]/).map((s) => s.trim()).filter(Boolean);
}

// Map CRM status strings to enum values
function mapCrmStatus(value: string | undefined | null): string {
  if (!value) return 'PROSPECT';
  const normalized = value.toUpperCase().replace(/[\s-]+/g, '_');
  const validStatuses = [
    'PROSPECT', 'CONTACTED', 'MEETING_SCHEDULED', 'IN_DISCUSSION',
    'ACTIVE_RELATIONSHIP', 'DORMANT', 'DO_NOT_CONTACT', 'FORMER_CLIENT', 'CLIENT',
  ];
  if (validStatuses.includes(normalized)) return normalized;

  // Fuzzy mapping
  if (normalized.includes('ACTIVE') || normalized.includes('CLIENT')) return 'ACTIVE_RELATIONSHIP';
  if (normalized.includes('CONTACT')) return 'CONTACTED';
  if (normalized.includes('MEET')) return 'MEETING_SCHEDULED';
  if (normalized.includes('DISCUSS') || normalized.includes('TALK')) return 'IN_DISCUSSION';
  if (normalized.includes('DORMANT') || normalized.includes('INACTIVE')) return 'DORMANT';
  return 'PROSPECT';
}

// Map priority strings
function mapPriority(value: string | undefined | null): string {
  if (!value) return 'MEDIUM';
  const normalized = value.toUpperCase().trim();
  if (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(normalized)) return normalized;
  return 'MEDIUM';
}

interface ParsedRow {
  [key: string]: string | undefined;
}

async function importCSV(filePath: string, dryRun: boolean, skipExisting: boolean) {
  console.log('🏦 MPV Capital Intelligence - CSV Import\n');
  console.log(`📁 File: ${filePath}`);
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE IMPORT'}`);
  console.log(`⚙️  Skip existing: ${skipExisting}\n`);

  // Read and parse CSV
  const content = fs.readFileSync(filePath, 'utf-8');
  const records: ParsedRow[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relaxColumnCount: true,
  });

  console.log(`📊 Found ${records.length} rows\n`);

  if (records.length === 0) {
    console.log('⚠️  No data found in CSV file');
    return;
  }

  // Map column headers
  const sampleRow = records[0];
  const csvColumns = Object.keys(sampleRow);
  console.log('📋 Detected columns:');
  const columnMap: Record<string, string> = {};
  const unmappedColumns: string[] = [];

  for (const col of csvColumns) {
    const normalized = col.toLowerCase().trim();
    if (COLUMN_MAPPINGS[normalized]) {
      columnMap[col] = COLUMN_MAPPINGS[normalized];
      console.log(`  ✓ "${col}" → ${COLUMN_MAPPINGS[normalized]}`);
    } else {
      unmappedColumns.push(col);
      console.log(`  ✗ "${col}" (unmapped - will be stored in notes)`);
    }
  }

  // Load taxonomy for matching
  const institutionTypes = await prisma.institutionType.findMany();
  const industries = await prisma.industry.findMany();

  const institutionTypeMap = new Map(institutionTypes.map((t) => [t.name.toLowerCase(), t.id]));
  const industryMap = new Map(industries.map((i) => [i.name.toLowerCase(), i.id]));

  // Add slug-based lookups
  institutionTypes.forEach((t) => institutionTypeMap.set(t.slug, t.id));
  industries.forEach((i) => industryMap.set(i.slug, i.id));

  // Add common aliases
  const typeAliases: Record<string, string> = {
    'pe': 'private-equity', 'vc': 'venture-capital', 'hf': 'hedge-funds',
    'ib': 'investment-banks', 'fo': 'family-offices', 'lp': 'institutional-investors',
    'angel': 'angel-investors', 'search': 'search-funds',
    'private equity': 'private-equity', 'venture capital': 'venture-capital',
    'hedge fund': 'hedge-funds', 'investment bank': 'investment-banks',
    'family office': 'family-offices',
  };

  // Stats
  let created = 0;
  let skipped = 0;
  let errors = 0;
  const unmatchedTypes = new Set<string>();
  const unmatchedIndustries = new Set<string>();

  // Process each row
  for (let i = 0; i < records.length; i++) {
    const row = records[i];

    // Get mapped values
    const getValue = (field: string): string | undefined => {
      for (const [csvCol, mappedField] of Object.entries(columnMap)) {
        if (mappedField === field) return row[csvCol]?.trim();
      }
      return undefined;
    };

    const name = getValue('name');
    if (!name) {
      console.log(`  ⚠️  Row ${i + 2}: Skipped (no firm name)`);
      skipped++;
      continue;
    }

    // Check if firm exists
    if (skipExisting) {
      const existing = await prisma.firm.findFirst({ where: { name, isActive: true } });
      if (existing) {
        console.log(`  ⏭️  Row ${i + 2}: Skipped "${name}" (already exists)`);
        skipped++;
        continue;
      }
    }

    try {
      // Parse financial data
      const aumCents = parseDollarAmount(getValue('aumDollars'));
      const totalFundSizeCents = parseDollarAmount(getValue('totalFundSizeDollars'));
      let minCheckSizeCents = parseDollarAmount(getValue('minCheckSizeDollars'));
      let maxCheckSizeCents = parseDollarAmount(getValue('maxCheckSizeDollars'));

      // Parse check size range if individual min/max not available
      if (!minCheckSizeCents && !maxCheckSizeCents) {
        const range = parseCheckSizeRange(getValue('checkSizeRange'));
        minCheckSizeCents = range.min;
        maxCheckSizeCents = range.max;
      }

      // Parse year
      const yearStr = getValue('yearFounded');
      const yearFounded = yearStr ? parseInt(yearStr) : null;

      // Parse employees
      const empStr = getValue('numberOfEmployees');
      const numberOfEmployees = empStr ? parseInt(empStr.replace(/[^0-9]/g, '')) : null;

      // Parse partners
      const partStr = getValue('numberOfPartners');
      const numberOfPartners = partStr ? parseInt(partStr.replace(/[^0-9]/g, '')) : null;

      // Parse score
      const scoreStr = getValue('internalScore');
      const internalScore = scoreStr ? Math.min(100, Math.max(0, parseInt(scoreStr))) : null;

      // Build unmapped data as notes supplement
      const unmappedData: string[] = [];
      for (const col of unmappedColumns) {
        if (row[col]?.trim()) {
          unmappedData.push(`${col}: ${row[col]}`);
        }
      }
      const existingNotes = getValue('internalNotes') || '';
      const supplementNotes = unmappedData.length > 0
        ? `${existingNotes}\n\n--- Imported Data ---\n${unmappedData.join('\n')}`
        : existingNotes;

      if (dryRun) {
        console.log(`  📝 Row ${i + 2}: Would create "${name}"`);
        created++;
        continue;
      }

      // Create the firm
      const firm = await prisma.firm.create({
        data: {
          name,
          legalName: getValue('legalName') || null,
          description: getValue('description') || null,
          website: getValue('website') || null,
          linkedinUrl: getValue('linkedinUrl') || null,
          headquartersCity: getValue('headquartersCity') || null,
          headquartersState: getValue('headquartersState') || null,
          headquartersCountry: getValue('headquartersCountry') || null,
          headquartersRegion: getValue('headquartersRegion') || null,
          aumCents,
          totalFundSizeCents,
          minCheckSizeCents,
          maxCheckSizeCents,
          stagePreferences: parseMultiValue(getValue('stagePreferences')),
          dealTypePreferences: parseMultiValue(getValue('dealTypePreferences')),
          geographicFocus: parseMultiValue(getValue('geographicFocus')),
          investmentHorizon: getValue('investmentHorizon') || null,
          yearFounded: yearFounded && yearFounded > 1800 && yearFounded <= new Date().getFullYear() ? yearFounded : null,
          numberOfEmployees: numberOfEmployees && numberOfEmployees > 0 ? numberOfEmployees : null,
          numberOfPartners: numberOfPartners && numberOfPartners > 0 ? numberOfPartners : null,
          activePortfolioSize: getValue('activePortfolioSize') ? parseInt(getValue('activePortfolioSize')!) : null,
          crmStatus: mapCrmStatus(getValue('crmStatus')) as 'PROSPECT',
          internalScore,
          internalNotes: supplementNotes.trim() || null,
          priority: mapPriority(getValue('priority')) as 'MEDIUM',
          dataSource: getValue('dataSource') || `CSV Import: ${path.basename(filePath)}`,
          dataConfidence: 'MEDIUM',
        },
      });

      // Map institution types
      const typeValue = getValue('institutionType');
      if (typeValue) {
        const typeNames = parseMultiValue(typeValue);
        for (let j = 0; j < typeNames.length; j++) {
          const typeName = typeNames[j].toLowerCase();
          const typeId = institutionTypeMap.get(typeName)
            || institutionTypeMap.get(typeAliases[typeName] || '');

          if (typeId) {
            await prisma.firmInstitutionType.create({
              data: { firmId: firm.id, institutionTypeId: typeId, isPrimary: j === 0 },
            });
          } else {
            unmatchedTypes.add(typeNames[j]);
          }
        }
      }

      // Map industries
      const industryValue = getValue('industry');
      if (industryValue) {
        const industryNames = parseMultiValue(industryValue);
        for (let j = 0; j < industryNames.length; j++) {
          const indName = industryNames[j].toLowerCase();
          const indId = industryMap.get(indName);

          if (indId) {
            await prisma.firmIndustry.create({
              data: { firmId: firm.id, industryId: indId, isPrimary: j === 0 },
            });
          } else {
            unmatchedIndustries.add(industryNames[j]);
          }
        }
      }

      // Create contact if contact fields present
      const contactFirstName = getValue('contactFirstName');
      const contactLastName = getValue('contactLastName');
      const contactName = getValue('contactName');

      if (contactFirstName && contactLastName) {
        await prisma.contact.create({
          data: {
            firmId: firm.id,
            firstName: contactFirstName,
            lastName: contactLastName,
            title: getValue('contactTitle') || null,
            email: getValue('contactEmail') || null,
            phone: getValue('contactPhone') || null,
            isPrimaryContact: true,
          },
        });
      } else if (contactName) {
        const parts = contactName.split(/\s+/);
        const firstName = parts[0] || contactName;
        const lastName = parts.slice(1).join(' ') || '';
        await prisma.contact.create({
          data: {
            firmId: firm.id,
            firstName,
            lastName: lastName || 'Unknown',
            title: getValue('contactTitle') || null,
            email: getValue('contactEmail') || null,
            phone: getValue('contactPhone') || null,
            isPrimaryContact: true,
          },
        });
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          firmId: firm.id,
          action: 'CREATED',
          entityType: 'firm',
          entityId: firm.id,
          details: `Imported from CSV: ${path.basename(filePath)}`,
        },
      });

      console.log(`  ✓ Row ${i + 2}: Created "${name}"`);
      created++;
    } catch (error) {
      console.error(`  ✗ Row ${i + 2}: Error creating "${name}":`, error);
      errors++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary');
  console.log('='.repeat(50));
  console.log(`  Total rows:     ${records.length}`);
  console.log(`  Created:        ${created}`);
  console.log(`  Skipped:        ${skipped}`);
  console.log(`  Errors:         ${errors}`);

  if (unmatchedTypes.size > 0) {
    console.log(`\n⚠️  Unmatched institution types (${unmatchedTypes.size}):`);
    unmatchedTypes.forEach((t) => console.log(`    - "${t}"`));
  }

  if (unmatchedIndustries.size > 0) {
    console.log(`\n⚠️  Unmatched industries (${unmatchedIndustries.size}):`);
    unmatchedIndustries.forEach((i) => console.log(`    - "${i}"`));
  }

  if (dryRun) {
    console.log('\n🔍 This was a DRY RUN. No data was written to the database.');
    console.log('   Run without --dry-run to import for real.');
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const filePath = fileIndex >= 0 ? args[fileIndex + 1] : null;
const dryRun = args.includes('--dry-run');
const skipExisting = args.includes('--skip-existing');

if (!filePath) {
  console.error('Usage: npm run import:csv -- --file <path> [--dry-run] [--skip-existing]');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

importCSV(filePath, dryRun, skipExisting)
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
