/**
 * Database Seed Script
 * Seeds the institution types and industry taxonomy.
 * Does NOT create fake firm data - this only initializes the classification system.
 *
 * Usage: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';

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
  { name: 'AI / Machine Learning', slug: 'ai-machine-learning', color: '#8b5cf6', displayOrder: 3, subSectors: ['Generative AI', 'MLOps', 'NLP', 'Computer Vision', 'Robotics', 'AI Infrastructure', 'Applied AI'] },
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

async function main() {
  console.log('🏦 Seeding MPV Capital Intelligence database...\n');

  // Seed Institution Types
  console.log('📋 Creating institution types...');
  for (const type of INSTITUTION_TYPES) {
    await prisma.institutionType.upsert({
      where: { slug: type.slug },
      update: { ...type },
      create: { ...type },
    });
    console.log(`  ✓ ${type.name}`);
  }

  // Seed Industries with Sub-Sectors
  console.log('\n🏭 Creating industries and sub-sectors...');
  for (const industry of INDUSTRIES) {
    const { subSectors, ...industryData } = industry;

    const created = await prisma.industry.upsert({
      where: { slug: industry.slug },
      update: { ...industryData },
      create: { ...industryData },
    });
    console.log(`  ✓ ${industry.name}`);

    // Create sub-sectors
    if (subSectors) {
      for (const subSectorName of subSectors) {
        const subSlug = `${industry.slug}-${slugify(subSectorName)}`;
        await prisma.subSector.upsert({
          where: { slug: subSlug },
          update: { name: subSectorName, industryId: created.id },
          create: { name: subSectorName, slug: subSlug, industryId: created.id },
        });
      }
    }
  }

  console.log('\n✅ Seed completed successfully!');
  console.log(`   ${INSTITUTION_TYPES.length} institution types`);
  console.log(`   ${INDUSTRIES.length} industries`);
  console.log(`   ${INDUSTRIES.reduce((sum, i) => sum + (i.subSectors?.length || 0), 0)} sub-sectors`);
  console.log('\n📌 Next steps:');
  console.log('   1. Import your firm data: npm run import:csv -- --file data/firms.csv');
  console.log('   2. Or import JSON: npm run import:json -- --file data/firms.json');
  console.log('   3. Start the app: npm run dev\n');
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
