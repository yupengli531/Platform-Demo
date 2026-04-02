/**
 * Database Seed Script
 * Seeds institution types, industries, firms, contacts, and transactions
 * with real capital markets data (57 firms including Sequoia, Blackstone, KKR, etc.)
 *
 * Usage: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const INSTITUTION_TYPES = [
  { name: 'Investors', slug: 'investors', description: 'Broad category of active investors across asset classes', iconName: 'TrendingUpIcon', color: '#4c6ef5', displayOrder: 1 },
  { name: 'Family Offices', slug: 'family-offices', description: 'Single and multi-family offices managing private wealth with direct investment capabilities', iconName: 'HomeIcon', color: '#7c3aed', displayOrder: 2 },
  { name: 'Hedge Funds', slug: 'hedge-funds', description: 'Alternative investment funds employing diverse strategies including long/short equity, event-driven, macro, and quantitative', iconName: 'ChartBarIcon', color: '#059669', displayOrder: 3 },
  { name: 'Investment Banks', slug: 'investment-banks', description: 'Full-service and boutique investment banks providing M&A advisory, capital markets, and principal investing', iconName: 'BuildingOffice2Icon', color: '#0284c7', displayOrder: 4 },
  { name: 'Banks', slug: 'banks', description: 'Commercial and regional banks providing lending, credit facilities, and structured finance', iconName: 'BuildingLibraryIcon', color: '#0891b2', displayOrder: 5 },
  { name: 'Private Equity', slug: 'private-equity', description: 'Private equity firms executing leveraged buyouts, growth equity, and recapitalizations', iconName: 'BriefcaseIcon', color: '#dc2626', displayOrder: 6 },
  { name: 'Independent Sponsors', slug: 'independent-sponsors', description: 'Fundless sponsors and independent deal professionals sourcing proprietary transactions', iconName: 'UserGroupIcon', color: '#d97706', displayOrder: 7 },
  { name: 'Venture Capital', slug: 'venture-capital', description: 'Venture capital firms investing in early-stage through growth-stage companies', iconName: 'RocketLaunchIcon', color: '#7c3aed', displayOrder: 8 },
  { name: 'Institutional Investors', slug: 'institutional-investors', description: 'Pension funds, sovereign wealth funds, endowments, and insurance companies', iconName: 'BuildingOfficeIcon', color: '#475569', displayOrder: 9 },
  { name: 'Search Funds', slug: 'search-funds', description: 'Entrepreneurship-through-acquisition vehicles seeking to acquire and operate a single company', iconName: 'MagnifyingGlassIcon', color: '#ea580c', displayOrder: 10 },
  { name: 'Allocators', slug: 'allocators', description: 'Fund-of-funds, consultants, and gatekeepers allocating capital to GPs and alternative investment managers', iconName: 'ArrowsPointingOutIcon', color: '#4338ca', displayOrder: 11 },
  { name: 'Private Investors', slug: 'private-investors', description: 'High-net-worth and ultra-high-net-worth individuals making direct investments', iconName: 'UserIcon', color: '#be185d', displayOrder: 12 },
  { name: 'Angel Investors', slug: 'angel-investors', description: 'Individual accredited investors providing early-stage capital', iconName: 'SparklesIcon', color: '#fbbf24', displayOrder: 13 },
];

const INDUSTRIES = [
  { name: 'Technology', slug: 'technology', color: '#3b82f6', displayOrder: 1, subSectors: ['Enterprise Software', 'Hardware', 'IT Services', 'Semiconductors', 'IoT', 'Cybersecurity', 'Cloud Infrastructure'] },
  { name: 'Software / SaaS', slug: 'software-saas', color: '#6366f1', displayOrder: 2, subSectors: ['Vertical SaaS', 'Horizontal SaaS', 'Developer Tools', 'Productivity', 'PLG', 'Infrastructure Software'] },
  { name: 'AI / Machine Learning', slug: 'ai-ml', color: '#8b5cf6', displayOrder: 3, subSectors: ['Generative AI', 'MLOps', 'NLP', 'Computer Vision', 'Robotics', 'AI Infrastructure', 'Applied AI'] },
  { name: 'Healthcare', slug: 'healthcare', color: '#ef4444', displayOrder: 4, subSectors: ['Health IT', 'Medical Devices', 'Healthcare Services', 'Diagnostics', 'Telehealth', 'Value-Based Care', 'Behavioral Health'] },
  { name: 'Biotech / Life Sciences', slug: 'biotech-life-sciences', color: '#10b981', displayOrder: 5, subSectors: ['Therapeutics', 'Genomics', 'Drug Discovery', 'CRO/CDMO', 'Lab Equipment', 'Cell & Gene Therapy'] },
  { name: 'Fintech', slug: 'fintech', color: '#06b6d4', displayOrder: 6, subSectors: ['Payments', 'Lending', 'Insurtech', 'Wealthtech', 'Regtech', 'Banking-as-a-Service', 'Embedded Finance'] },
  { name: 'Real Estate', slug: 'real-estate', color: '#78716c', displayOrder: 7, subSectors: ['Commercial', 'Residential', 'Industrial', 'Multifamily', 'PropTech', 'REITs', 'Real Estate Services', 'Self-Storage'] },
  { name: 'Consumer', slug: 'consumer', color: '#f97316', displayOrder: 8, subSectors: ['CPG', 'DTC Brands', 'Consumer Services', 'Luxury', 'Personal Care', 'Home & Garden'] },
  { name: 'Food & Beverage', slug: 'food-beverage', color: '#84cc16', displayOrder: 9, subSectors: ['Restaurants', 'CPG Food', 'Beverage', 'Food Tech', 'Agriculture Tech', 'Food Distribution'] },
  { name: 'Gaming', slug: 'gaming', color: '#a855f7', displayOrder: 10, subSectors: ['Mobile Gaming', 'PC/Console', 'Esports', 'Gaming Infrastructure', 'Metaverse', 'Game Studios'] },
  { name: 'Media / Entertainment', slug: 'media-entertainment', color: '#ec4899', displayOrder: 11, subSectors: ['Streaming', 'Content Production', 'Digital Media', 'Music', 'Live Events', 'Advertising'] },
  { name: 'Industrials', slug: 'industrials', color: '#64748b', displayOrder: 12, subSectors: ['Aerospace & Defense', 'Machinery', 'Industrial Services', 'Building Products', 'Electrical Equipment', 'Specialty Chemicals'] },
  { name: 'Energy', slug: 'energy', color: '#eab308', displayOrder: 13, subSectors: ['Oil & Gas', 'Utilities', 'Energy Services', 'Midstream', 'Power Generation', 'Nuclear'] },
  { name: 'Infrastructure', slug: 'infrastructure', color: '#71717a', displayOrder: 14, subSectors: ['Data Centers', 'Telecom Infrastructure', 'Transportation Infrastructure', 'Water', 'Public Infrastructure', 'Digital Infrastructure'] },
  { name: 'Financial Services', slug: 'financial-services', color: '#0d9488', displayOrder: 15, subSectors: ['Asset Management', 'Insurance', 'Specialty Finance', 'Capital Markets', 'Wealth Management', 'Private Credit'] },
  { name: 'Transportation / Logistics', slug: 'transportation-logistics', color: '#0369a1', displayOrder: 16, subSectors: ['Freight & Shipping', 'Last-Mile Delivery', 'Supply Chain Tech', 'Fleet Management', 'Rail', 'Maritime'] },
  { name: 'Telecom', slug: 'telecom', color: '#7c3aed', displayOrder: 17, subSectors: ['Wireless', 'Broadband', '5G', 'Fiber', 'Satellite', 'Unified Communications'] },
  { name: 'Hospitality', slug: 'hospitality', color: '#be123c', displayOrder: 18, subSectors: ['Hotels & Resorts', 'Travel Tech', 'Vacation Rentals', 'Restaurant Tech', 'Cruise', 'Tourism'] },
  { name: 'Sports', slug: 'sports', color: '#ca8a04', displayOrder: 19, subSectors: ['Professional Sports', 'Sports Tech', 'Fitness & Wellness', 'Sports Media', 'Sports Betting', 'Esports'] },
  { name: 'Education', slug: 'education', color: '#2563eb', displayOrder: 20, subSectors: ['EdTech', 'Higher Education', 'K-12', 'Workforce Training', 'Online Learning', 'Education Services'] },
  { name: 'Agriculture', slug: 'agriculture', color: '#65a30d', displayOrder: 21, subSectors: ['AgTech', 'Crop Sciences', 'Animal Health', 'Precision Agriculture', 'Farm Equipment', 'Agricultural Services'] },
  { name: 'Manufacturing', slug: 'manufacturing', color: '#475569', displayOrder: 22, subSectors: ['Advanced Manufacturing', 'Contract Manufacturing', 'Additive Manufacturing', 'Automation', 'Quality Control'] },
  { name: 'Cannabis', slug: 'cannabis', color: '#16a34a', displayOrder: 23, subSectors: ['Cultivation', 'Processing', 'Retail/Dispensary', 'Ancillary Services', 'CBD', 'Cannabis Tech'] },
  { name: 'Crypto / Blockchain', slug: 'crypto-blockchain', color: '#f59e0b', displayOrder: 24, subSectors: ['DeFi', 'NFTs', 'Blockchain Infrastructure', 'Exchanges', 'Web3', 'Digital Assets', 'Custody'] },
  { name: 'Defense / Government', slug: 'defense-government', color: '#1e3a5f', displayOrder: 25, subSectors: ['Defense Technology', 'Government IT', 'Intelligence', 'Public Safety', 'Space & Satellite', 'GovTech'] },
  { name: 'Retail / E-commerce', slug: 'retail-ecommerce', color: '#db2777', displayOrder: 26, subSectors: ['E-commerce', 'Marketplaces', 'Retail Tech', 'Brick & Mortar', 'Omnichannel', 'Quick Commerce'] },
  { name: 'Cleantech / Climate', slug: 'cleantech-climate', color: '#059669', displayOrder: 27, subSectors: ['Solar', 'Wind', 'Battery/Storage', 'Carbon Capture', 'EV Infrastructure', 'Hydrogen', 'Sustainability'] },
  { name: 'Insurance', slug: 'insurance', color: '#0e7490', displayOrder: 28, subSectors: ['P&C', 'Life & Health', 'Specialty Lines', 'Reinsurance', 'MGA/MGU', 'Claims Tech'] },
  { name: 'Legal', slug: 'legal', color: '#4b5563', displayOrder: 29, subSectors: ['Legal Tech', 'Law Firm Services', 'Compliance', 'Contract Management', 'Legal Process Outsourcing'] },
  { name: 'Human Capital', slug: 'human-capital', color: '#9333ea', displayOrder: 30, subSectors: ['HR Tech', 'Staffing', 'Recruiting', 'Payroll', 'Benefits', 'Workforce Management'] },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').trim();
}

interface SeedFirm {
  id: string;
  name: string;
  legalName: string | null;
  description: string | null;
  website: string | null;
  headquartersCity: string | null;
  headquartersState: string | null;
  headquartersCountry: string | null;
  geographicFocus: string[];
  minCheckSizeCents: number | null;
  maxCheckSizeCents: number | null;
  stagePreferences: string[];
  dealTypePreferences: string[];
  yearFounded: number | null;
  crmStatus: string;
  internalScore: number;
  internalNotes: string | null;
}

interface SeedContact {
  id: string;
  firmId: string;
  firstName: string;
  lastName: string;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  isPrimaryContact: boolean;
  department: string | null;
  notes: string | null;
}

interface SeedDeal {
  id: string;
  firmId: string;
  transactionName: string;
  targetCompany: string | null;
  transactionType: string;
  dealSizeCents: number | null;
  announcedDate: string;
  stage: string | null;
  sector: string | null;
  status: string;
  sourceUrl: string | null;
}

interface SeedData {
  firms: SeedFirm[];
  firmInstitutionTypes: { firmId: string; slug: string }[];
  firmIndustries: { firmId: string; slug: string; isPrimary: boolean }[];
  contacts: SeedContact[];
  deals: SeedDeal[];
}

async function main() {
  console.log('🏦 Seeding MPV Capital Intelligence database...\n');

  // Load seed data from JSON
  const seedDataPath = path.join(__dirname, 'seed_data.json');
  const seedData: SeedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

  // ==================== CLEAR EXISTING DATA ====================
  console.log('🗑️  Clearing existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.sourceLink.deleteMany();
  await prisma.firmTag.deleteMany();
  await prisma.firmSubSector.deleteMany();
  await prisma.firmIndustry.deleteMany();
  await prisma.firmInstitutionType.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.firm.deleteMany();
  await prisma.subSector.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.institutionType.deleteMany();
  console.log('  Done.\n');

  // ==================== SEED INSTITUTION TYPES ====================
  console.log('📋 Creating institution types...');
  const itMap = new Map<string, string>();
  for (const type of INSTITUTION_TYPES) {
    const created = await prisma.institutionType.create({ data: type });
    itMap.set(type.slug, created.id);
    console.log(`  ✓ ${type.name}`);
  }

  // ==================== SEED INDUSTRIES ====================
  console.log('\n🏭 Creating industries and sub-sectors...');
  const indMap = new Map<string, string>();
  for (const industry of INDUSTRIES) {
    const { subSectors, ...industryData } = industry;
    const created = await prisma.industry.create({ data: industryData });
    indMap.set(industry.slug, created.id);
    console.log(`  ✓ ${industry.name}`);

    if (subSectors) {
      for (const subSectorName of subSectors) {
        const subSlug = `${industry.slug}-${slugify(subSectorName)}`;
        await prisma.subSector.create({
          data: { name: subSectorName, slug: subSlug, industryId: created.id },
        });
      }
    }
  }

  // ==================== SEED FIRMS ====================
  console.log(`\n🏢 Creating ${seedData.firms.length} firms...`);
  const firmIds = new Set<string>();
  for (const firm of seedData.firms) {
    try {
      await prisma.firm.create({
        data: {
          id: firm.id,
          name: firm.name,
          legalName: firm.legalName || null,
          description: firm.description || null,
          website: firm.website || null,
          headquartersCity: firm.headquartersCity || null,
          headquartersState: firm.headquartersState || null,
          headquartersCountry: firm.headquartersCountry || null,
          geographicFocus: firm.geographicFocus || [],
          minCheckSizeCents: firm.minCheckSizeCents ? BigInt(firm.minCheckSizeCents) : null,
          maxCheckSizeCents: firm.maxCheckSizeCents ? BigInt(firm.maxCheckSizeCents) : null,
          stagePreferences: firm.stagePreferences || [],
          dealTypePreferences: firm.dealTypePreferences || [],
          yearFounded: firm.yearFounded || null,
          crmStatus: firm.crmStatus as 'PROSPECT',
          internalScore: firm.internalScore,
          internalNotes: firm.internalNotes || null,
          priority: firm.internalScore >= 90 ? 'HIGH' : firm.internalScore >= 70 ? 'MEDIUM' : 'LOW',
          dataSource: 'Liquidity AI Seed Data',
          dataConfidence: 'HIGH',
        },
      });
      firmIds.add(firm.id);
      console.log(`  ✓ ${firm.name}`);
    } catch (e) {
      console.error(`  ✗ Failed: ${firm.name}`, (e as Error).message?.substring(0, 100));
    }
  }

  // ==================== SEED FIRM-INSTITUTION TYPE JUNCTIONS ====================
  console.log(`\n🔗 Creating institution type associations...`);
  const seenFIT = new Set<string>();
  let fitCount = 0;
  for (const j of seedData.firmInstitutionTypes) {
    const key = `${j.firmId}:${j.slug}`;
    if (seenFIT.has(key)) continue;
    seenFIT.add(key);

    const typeId = itMap.get(j.slug);
    if (!typeId || !firmIds.has(j.firmId)) continue;

    try {
      await prisma.firmInstitutionType.create({
        data: {
          firmId: j.firmId,
          institutionTypeId: typeId,
          isPrimary: fitCount === 0,
        },
      });
      fitCount++;
    } catch {
      // Skip duplicates
    }
  }
  console.log(`  ✓ ${fitCount} associations created`);

  // ==================== SEED FIRM-INDUSTRY JUNCTIONS ====================
  console.log(`\n🔗 Creating industry associations...`);
  const seenFI = new Set<string>();
  let fiCount = 0;
  for (const j of seedData.firmIndustries) {
    const key = `${j.firmId}:${j.slug}`;
    if (seenFI.has(key)) continue;
    seenFI.add(key);

    const industryId = indMap.get(j.slug);
    if (!industryId || !firmIds.has(j.firmId)) continue;

    try {
      await prisma.firmIndustry.create({
        data: {
          firmId: j.firmId,
          industryId: industryId,
          isPrimary: j.isPrimary,
        },
      });
      fiCount++;
    } catch {
      // Skip duplicates
    }
  }
  console.log(`  ✓ ${fiCount} associations created`);

  // ==================== SEED CONTACTS ====================
  console.log(`\n👤 Creating ${seedData.contacts.length} contacts...`);
  let contactCount = 0;
  for (const c of seedData.contacts) {
    if (!firmIds.has(c.firmId)) continue;
    try {
      await prisma.contact.create({
        data: {
          id: c.id,
          firmId: c.firmId,
          firstName: c.firstName,
          lastName: c.lastName,
          title: c.title || null,
          email: c.email || null,
          phone: c.phone || null,
          linkedinUrl: c.linkedinUrl || null,
          isPrimaryContact: c.isPrimaryContact,
          department: c.department || null,
          notes: c.notes || null,
        },
      });
      contactCount++;
    } catch {
      // Skip duplicates
    }
  }
  console.log(`  ✓ ${contactCount} contacts created`);

  // ==================== SEED DEALS AS TRANSACTIONS ====================
  console.log(`\n💼 Creating ${seedData.deals.length} transactions...`);
  let dealCount = 0;
  for (const d of seedData.deals) {
    if (!firmIds.has(d.firmId)) continue;
    try {
      await prisma.transaction.create({
        data: {
          id: d.id,
          firmId: d.firmId,
          transactionName: d.transactionName,
          targetCompany: d.targetCompany || null,
          transactionType: d.transactionType as 'OTHER',
          dealSizeCents: d.dealSizeCents ? BigInt(d.dealSizeCents) : null,
          announcedDate: new Date(d.announcedDate),
          stage: d.stage || null,
          sector: d.sector || null,
          status: d.status as 'ANNOUNCED',
          sourceUrl: d.sourceUrl || null,
        },
      });
      dealCount++;
    } catch (e) {
      console.error(`  ✗ Failed deal: ${d.transactionName}`, (e as Error).message?.substring(0, 100));
    }
  }
  console.log(`  ✓ ${dealCount} transactions created`);

  // ==================== LOG ACTIVITY ====================
  console.log('\n📝 Creating activity logs...');
  for (const firmId of firmIds) {
    await prisma.activityLog.create({
      data: {
        firmId,
        action: 'CREATED',
        entityType: 'firm',
        entityId: firmId,
        details: 'Imported from Liquidity AI seed data',
      },
    });
  }
  console.log(`  ✓ ${firmIds.size} activity logs created`);

  // ==================== SUMMARY ====================
  console.log('\n' + '='.repeat(50));
  console.log('✅ Seed completed successfully!');
  console.log('='.repeat(50));
  console.log(`   ${INSTITUTION_TYPES.length} institution types`);
  console.log(`   ${INDUSTRIES.length} industries`);
  console.log(`   ${INDUSTRIES.reduce((sum, i) => sum + (i.subSectors?.length || 0), 0)} sub-sectors`);
  console.log(`   ${firmIds.size} firms`);
  console.log(`   ${contactCount} contacts`);
  console.log(`   ${fitCount} institution type associations`);
  console.log(`   ${fiCount} industry associations`);
  console.log(`   ${dealCount} transactions`);
  console.log('\n🚀 Start the app: npm run dev\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
