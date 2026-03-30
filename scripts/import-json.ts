/**
 * JSON Import Script for MPV Capital Intelligence Platform
 *
 * Imports firm data from JSON files into the production database.
 * Supports structured JSON with nested contacts, transactions, and classifications.
 *
 * Usage:
 *   npm run import:json -- --file path/to/firms.json
 *   npm run import:json -- --file path/to/firms.json --dry-run
 *   npm run import:json -- --file path/to/firms.json --skip-existing
 *
 * Expected JSON format:
 * [
 *   {
 *     "name": "Firm Name",
 *     "description": "...",
 *     "website": "https://...",
 *     "headquartersCity": "New York",
 *     "headquartersState": "New York",
 *     "headquartersCountry": "United States",
 *     "aum": 500000000,                      // in dollars
 *     "minCheckSize": 5000000,                // in dollars
 *     "maxCheckSize": 50000000,               // in dollars
 *     "institutionTypes": ["Private Equity", "Family Offices"],
 *     "industries": ["Technology", "Healthcare"],
 *     "stagePreferences": ["Growth Equity", "Buyout"],
 *     "dealTypePreferences": ["Equity", "Mezzanine"],
 *     "geographicFocus": ["North America"],
 *     "yearFounded": 2005,
 *     "numberOfEmployees": 50,
 *     "contacts": [
 *       {
 *         "firstName": "John",
 *         "lastName": "Smith",
 *         "title": "Managing Director",
 *         "email": "jsmith@firm.com",
 *         "phone": "+1-212-555-0100",
 *         "isPrimary": true
 *       }
 *     ],
 *     "transactions": [
 *       {
 *         "name": "Acquisition of TargetCo",
 *         "targetCompany": "TargetCo Inc.",
 *         "type": "ACQUISITION",
 *         "role": "Lead",
 *         "dealSize": 150000000,
 *         "industry": "Technology",
 *         "closedDate": "2024-06-15",
 *         "status": "COMPLETED"
 *       }
 *     ],
 *     "tags": ["growth-focused", "technology-specialist"],
 *     "crmStatus": "PROSPECT",
 *     "internalScore": 85,
 *     "priority": "HIGH",
 *     "notes": "Strong relationship with Partner X"
 *   }
 * ]
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface FirmInput {
  name: string;
  legalName?: string;
  description?: string;
  website?: string;
  linkedinUrl?: string;
  headquartersCity?: string;
  headquartersState?: string;
  headquartersCountry?: string;
  headquartersRegion?: string;
  aum?: number;
  fundSize?: number;
  minCheckSize?: number;
  maxCheckSize?: number;
  minRevenue?: number;
  maxRevenue?: number;
  minEbitda?: number;
  maxEbitda?: number;
  targetEvLow?: number;
  targetEvHigh?: number;
  institutionTypes?: string[];
  industries?: string[];
  stagePreferences?: string[];
  dealTypePreferences?: string[];
  geographicFocus?: string[];
  investmentHorizon?: string;
  yearFounded?: number;
  numberOfEmployees?: number;
  numberOfPartners?: number;
  activePortfolioSize?: number;
  totalDealsCompleted?: number;
  currentFundNumber?: number;
  currentFundYear?: number;
  contacts?: ContactInput[];
  transactions?: TransactionInput[];
  tags?: string[];
  crmStatus?: string;
  internalScore?: number;
  priority?: string;
  notes?: string;
  dataSource?: string;
  sourceLinks?: { url: string; title?: string; type?: string }[];
}

interface ContactInput {
  firstName: string;
  lastName: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  isPrimary?: boolean;
  seniority?: string;
}

interface TransactionInput {
  name: string;
  targetCompany?: string;
  type: string;
  role?: string;
  dealSize?: number;
  investment?: number;
  industry?: string;
  stage?: string;
  geography?: string;
  announcedDate?: string;
  closedDate?: string;
  status?: string;
  description?: string;
  sourceUrl?: string;
}

function toCents(dollars: number | undefined | null): bigint | null {
  if (dollars === undefined || dollars === null) return null;
  return BigInt(Math.round(dollars * 100));
}

async function importJSON(filePath: string, dryRun: boolean, skipExisting: boolean) {
  console.log('🏦 MPV Capital Intelligence - JSON Import\n');
  console.log(`📁 File: ${filePath}`);
  console.log(`🔧 Mode: ${dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`);
  console.log(`⚙️  Skip existing: ${skipExisting}\n`);

  const content = fs.readFileSync(filePath, 'utf-8');
  let records: FirmInput[];

  try {
    const parsed = JSON.parse(content);
    records = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    console.error('❌ Invalid JSON file');
    process.exit(1);
  }

  console.log(`📊 Found ${records.length} firm records\n`);

  // Load taxonomy
  const institutionTypes = await prisma.institutionType.findMany();
  const industries = await prisma.industry.findMany();
  const typeMap = new Map<string, string>();
  const indMap = new Map<string, string>();

  institutionTypes.forEach((t) => {
    typeMap.set(t.name.toLowerCase(), t.id);
    typeMap.set(t.slug, t.id);
  });
  industries.forEach((i) => {
    indMap.set(i.name.toLowerCase(), i.id);
    indMap.set(i.slug, i.id);
  });

  let created = 0;
  let skipped = 0;
  let errors = 0;
  let contactsCreated = 0;
  let transactionsCreated = 0;

  for (let i = 0; i < records.length; i++) {
    const input = records[i];

    if (!input.name) {
      console.log(`  ⚠️  Record ${i + 1}: Skipped (no name)`);
      skipped++;
      continue;
    }

    if (skipExisting) {
      const existing = await prisma.firm.findFirst({ where: { name: input.name, isActive: true } });
      if (existing) {
        console.log(`  ⏭️  Record ${i + 1}: Skipped "${input.name}" (exists)`);
        skipped++;
        continue;
      }
    }

    if (dryRun) {
      console.log(`  📝 Record ${i + 1}: Would create "${input.name}"`);
      created++;
      continue;
    }

    try {
      const firm = await prisma.firm.create({
        data: {
          name: input.name,
          legalName: input.legalName || null,
          description: input.description || null,
          website: input.website || null,
          linkedinUrl: input.linkedinUrl || null,
          headquartersCity: input.headquartersCity || null,
          headquartersState: input.headquartersState || null,
          headquartersCountry: input.headquartersCountry || null,
          headquartersRegion: input.headquartersRegion || null,
          aumCents: toCents(input.aum),
          totalFundSizeCents: toCents(input.fundSize),
          minCheckSizeCents: toCents(input.minCheckSize),
          maxCheckSizeCents: toCents(input.maxCheckSize),
          minRevenueCents: toCents(input.minRevenue),
          maxRevenueCents: toCents(input.maxRevenue),
          minEbitdaCents: toCents(input.minEbitda),
          maxEbitdaCents: toCents(input.maxEbitda),
          targetEvRangeLowCents: toCents(input.targetEvLow),
          targetEvRangeHighCents: toCents(input.targetEvHigh),
          stagePreferences: input.stagePreferences || [],
          dealTypePreferences: input.dealTypePreferences || [],
          geographicFocus: input.geographicFocus || [],
          investmentHorizon: input.investmentHorizon || null,
          yearFounded: input.yearFounded || null,
          numberOfEmployees: input.numberOfEmployees || null,
          numberOfPartners: input.numberOfPartners || null,
          activePortfolioSize: input.activePortfolioSize || null,
          totalDealsCompleted: input.totalDealsCompleted || null,
          currentFundNumber: input.currentFundNumber || null,
          currentFundYear: input.currentFundYear || null,
          crmStatus: (input.crmStatus || 'PROSPECT') as 'PROSPECT',
          internalScore: input.internalScore || null,
          internalNotes: input.notes || null,
          priority: (input.priority || 'MEDIUM') as 'MEDIUM',
          dataSource: input.dataSource || `JSON Import: ${path.basename(filePath)}`,
          dataConfidence: 'MEDIUM',
        },
      });

      // Institution types
      if (input.institutionTypes) {
        for (let j = 0; j < input.institutionTypes.length; j++) {
          const typeId = typeMap.get(input.institutionTypes[j].toLowerCase());
          if (typeId) {
            await prisma.firmInstitutionType.create({
              data: { firmId: firm.id, institutionTypeId: typeId, isPrimary: j === 0 },
            });
          }
        }
      }

      // Industries
      if (input.industries) {
        for (let j = 0; j < input.industries.length; j++) {
          const indId = indMap.get(input.industries[j].toLowerCase());
          if (indId) {
            await prisma.firmIndustry.create({
              data: { firmId: firm.id, industryId: indId, isPrimary: j === 0 },
            });
          }
        }
      }

      // Contacts
      if (input.contacts) {
        for (const contact of input.contacts) {
          await prisma.contact.create({
            data: {
              firmId: firm.id,
              firstName: contact.firstName,
              lastName: contact.lastName,
              title: contact.title || null,
              email: contact.email || null,
              phone: contact.phone || null,
              linkedinUrl: contact.linkedinUrl || null,
              isPrimaryContact: contact.isPrimary || false,
              seniority: contact.seniority as 'PARTNER' | undefined,
            },
          });
          contactsCreated++;
        }
      }

      // Transactions
      if (input.transactions) {
        for (const tx of input.transactions) {
          await prisma.transaction.create({
            data: {
              firmId: firm.id,
              transactionName: tx.name,
              targetCompany: tx.targetCompany || null,
              transactionType: (tx.type || 'OTHER') as 'OTHER',
              role: tx.role || null,
              dealSizeCents: toCents(tx.dealSize),
              investmentCents: toCents(tx.investment),
              industry: tx.industry || null,
              stage: tx.stage || null,
              geography: tx.geography || null,
              announcedDate: tx.announcedDate ? new Date(tx.announcedDate) : null,
              closedDate: tx.closedDate ? new Date(tx.closedDate) : null,
              status: (tx.status || 'COMPLETED') as 'COMPLETED',
              description: tx.description || null,
              sourceUrl: tx.sourceUrl || null,
            },
          });
          transactionsCreated++;
        }
      }

      // Tags
      if (input.tags) {
        for (const tagName of input.tags) {
          const slug = tagName.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
          const tag = await prisma.tag.upsert({
            where: { slug },
            update: {},
            create: { name: tagName, slug },
          });
          await prisma.firmTag.create({
            data: { firmId: firm.id, tagId: tag.id },
          });
        }
      }

      // Source links
      if (input.sourceLinks) {
        for (const link of input.sourceLinks) {
          await prisma.sourceLink.create({
            data: {
              firmId: firm.id,
              url: link.url,
              title: link.title || null,
              sourceType: (link.type || 'OTHER') as 'OTHER',
            },
          });
        }
      }

      // Log activity
      await prisma.activityLog.create({
        data: {
          firmId: firm.id,
          action: 'CREATED',
          entityType: 'firm',
          entityId: firm.id,
          details: `Imported from JSON: ${path.basename(filePath)}`,
        },
      });

      console.log(`  ✓ Record ${i + 1}: Created "${input.name}"`);
      created++;
    } catch (error) {
      console.error(`  ✗ Record ${i + 1}: Error creating "${input.name}":`, error);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary');
  console.log('='.repeat(50));
  console.log(`  Total records:    ${records.length}`);
  console.log(`  Firms created:    ${created}`);
  console.log(`  Contacts created: ${contactsCreated}`);
  console.log(`  Transactions:     ${transactionsCreated}`);
  console.log(`  Skipped:          ${skipped}`);
  console.log(`  Errors:           ${errors}`);

  if (dryRun) {
    console.log('\n🔍 DRY RUN - no data written. Remove --dry-run to import.');
  }
}

const args = process.argv.slice(2);
const fileIndex = args.indexOf('--file');
const filePath = fileIndex >= 0 ? args[fileIndex + 1] : null;
const dryRun = args.includes('--dry-run');
const skipExisting = args.includes('--skip-existing');

if (!filePath) {
  console.error('Usage: npm run import:json -- --file <path> [--dry-run] [--skip-existing]');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

importJSON(filePath, dryRun, skipExisting)
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
