// =============================================================================
// MPV Capital Intelligence Platform - Constants & Taxonomy
// Industry-standard classifications for capital markets
// =============================================================================

// ---- Institution Type Taxonomy ----
// Based on standard capital markets classifications used by
// PitchBook, Preqin, Bloomberg, and Capital IQ

export const INSTITUTION_TYPES = [
  {
    name: 'Investors',
    slug: 'investors',
    description: 'Broad category of active investors across asset classes',
    iconName: 'TrendingUpIcon',
    color: '#4c6ef5',
    displayOrder: 1,
  },
  {
    name: 'Family Offices',
    slug: 'family-offices',
    description: 'Single and multi-family offices managing private wealth with direct investment capabilities',
    iconName: 'HomeIcon',
    color: '#7c3aed',
    displayOrder: 2,
  },
  {
    name: 'Hedge Funds',
    slug: 'hedge-funds',
    description: 'Alternative investment funds employing diverse strategies including long/short equity, event-driven, macro, and quantitative',
    iconName: 'ChartBarIcon',
    color: '#059669',
    displayOrder: 3,
  },
  {
    name: 'Investment Banks',
    slug: 'investment-banks',
    description: 'Full-service and boutique investment banks providing M&A advisory, capital markets, and principal investing',
    iconName: 'BuildingOffice2Icon',
    color: '#0284c7',
    displayOrder: 4,
  },
  {
    name: 'Banks',
    slug: 'banks',
    description: 'Commercial and regional banks providing lending, credit facilities, and structured finance',
    iconName: 'BuildingLibraryIcon',
    color: '#0891b2',
    displayOrder: 5,
  },
  {
    name: 'Private Equity',
    slug: 'private-equity',
    description: 'Private equity firms executing leveraged buyouts, growth equity, and recapitalizations across the middle market and large cap',
    iconName: 'BriefcaseIcon',
    color: '#dc2626',
    displayOrder: 6,
  },
  {
    name: 'Independent Sponsors',
    slug: 'independent-sponsors',
    description: 'Fundless sponsors and independent deal professionals sourcing and executing proprietary transactions',
    iconName: 'UserGroupIcon',
    color: '#d97706',
    displayOrder: 7,
  },
  {
    name: 'Venture Capital',
    slug: 'venture-capital',
    description: 'Venture capital firms investing in early-stage through growth-stage companies across technology and innovation sectors',
    iconName: 'RocketLaunchIcon',
    color: '#7c3aed',
    displayOrder: 8,
  },
  {
    name: 'Institutional Investors',
    slug: 'institutional-investors',
    description: 'Pension funds, sovereign wealth funds, endowments, and insurance companies allocating to alternative assets',
    iconName: 'BuildingOfficeIcon',
    color: '#475569',
    displayOrder: 9,
  },
  {
    name: 'Search Funds',
    slug: 'search-funds',
    description: 'Entrepreneurship-through-acquisition vehicles seeking to acquire and operate a single company',
    iconName: 'MagnifyingGlassIcon',
    color: '#ea580c',
    displayOrder: 10,
  },
  {
    name: 'Allocators',
    slug: 'allocators',
    description: 'Fund-of-funds, consultants, and gatekeepers allocating capital to GPs and alternative investment managers',
    iconName: 'ArrowsPointingOutIcon',
    color: '#4338ca',
    displayOrder: 11,
  },
  {
    name: 'Private Investors',
    slug: 'private-investors',
    description: 'High-net-worth and ultra-high-net-worth individuals making direct investments and co-investments',
    iconName: 'UserIcon',
    color: '#be185d',
    displayOrder: 12,
  },
  {
    name: 'Angel Investors',
    slug: 'angel-investors',
    description: 'Individual accredited investors providing early-stage capital, typically pre-seed through Series A',
    iconName: 'SparklesIcon',
    color: '#fbbf24',
    displayOrder: 13,
  },
] as const;

// ---- Industry Taxonomy ----
// Based on GICS (Global Industry Classification Standard) used by MSCI and S&P,
// extended with sector-specific verticals relevant to capital markets deal flow

export const INDUSTRIES = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Broad technology sector including hardware, software, IT services, and semiconductors',
    iconName: 'CpuChipIcon',
    color: '#3b82f6',
    displayOrder: 1,
    subSectors: ['Enterprise Software', 'Hardware', 'IT Services', 'Semiconductors', 'IoT', 'Cybersecurity', 'Cloud Infrastructure'],
  },
  {
    name: 'Software / SaaS',
    slug: 'software-saas',
    description: 'Software companies with recurring revenue models including SaaS, PaaS, and subscription software',
    iconName: 'CodeBracketIcon',
    color: '#6366f1',
    displayOrder: 2,
    subSectors: ['Vertical SaaS', 'Horizontal SaaS', 'Developer Tools', 'Productivity', 'PLG', 'Infrastructure Software'],
  },
  {
    name: 'AI / Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Artificial intelligence, machine learning, NLP, computer vision, and generative AI companies',
    iconName: 'SparklesIcon',
    color: '#8b5cf6',
    displayOrder: 3,
    subSectors: ['Generative AI', 'MLOps', 'NLP', 'Computer Vision', 'Robotics', 'AI Infrastructure', 'Applied AI'],
  },
  {
    name: 'Healthcare',
    slug: 'healthcare',
    description: 'Healthcare services, health IT, medical devices, and healthcare infrastructure',
    iconName: 'HeartIcon',
    color: '#ef4444',
    displayOrder: 4,
    subSectors: ['Health IT', 'Medical Devices', 'Healthcare Services', 'Diagnostics', 'Telehealth', 'Value-Based Care', 'Behavioral Health'],
  },
  {
    name: 'Biotech / Life Sciences',
    slug: 'biotech-life-sciences',
    description: 'Biotechnology, pharmaceuticals, genomics, and life sciences tools and services',
    iconName: 'BeakerIcon',
    color: '#10b981',
    displayOrder: 5,
    subSectors: ['Therapeutics', 'Genomics', 'Drug Discovery', 'CRO/CDMO', 'Lab Equipment', 'Cell & Gene Therapy'],
  },
  {
    name: 'Fintech',
    slug: 'fintech',
    description: 'Financial technology including payments, lending, insurtech, and banking infrastructure',
    iconName: 'CreditCardIcon',
    color: '#06b6d4',
    displayOrder: 6,
    subSectors: ['Payments', 'Lending', 'Insurtech', 'Wealthtech', 'Regtech', 'Banking-as-a-Service', 'Embedded Finance'],
  },
  {
    name: 'Real Estate',
    slug: 'real-estate',
    description: 'Commercial real estate, REITs, proptech, and real estate services',
    iconName: 'HomeModernIcon',
    color: '#78716c',
    displayOrder: 7,
    subSectors: ['Commercial', 'Residential', 'Industrial', 'Multifamily', 'PropTech', 'REITs', 'Real Estate Services', 'Self-Storage'],
  },
  {
    name: 'Consumer',
    slug: 'consumer',
    description: 'Consumer products, brands, DTC, and consumer services',
    iconName: 'ShoppingBagIcon',
    color: '#f97316',
    displayOrder: 8,
    subSectors: ['CPG', 'DTC Brands', 'Consumer Services', 'Luxury', 'Personal Care', 'Home & Garden'],
  },
  {
    name: 'Food & Beverage',
    slug: 'food-beverage',
    description: 'Food production, restaurants, beverage companies, and food technology',
    iconName: 'CakeIcon',
    color: '#84cc16',
    displayOrder: 9,
    subSectors: ['Restaurants', 'CPG Food', 'Beverage', 'Food Tech', 'Agriculture Tech', 'Food Distribution'],
  },
  {
    name: 'Gaming',
    slug: 'gaming',
    description: 'Video gaming, esports, gaming infrastructure, and interactive entertainment',
    iconName: 'PuzzlePieceIcon',
    color: '#a855f7',
    displayOrder: 10,
    subSectors: ['Mobile Gaming', 'PC/Console', 'Esports', 'Gaming Infrastructure', 'Metaverse', 'Game Studios'],
  },
  {
    name: 'Media / Entertainment',
    slug: 'media-entertainment',
    description: 'Media companies, content creation, streaming, digital media, and entertainment',
    iconName: 'FilmIcon',
    color: '#ec4899',
    displayOrder: 11,
    subSectors: ['Streaming', 'Content Production', 'Digital Media', 'Music', 'Live Events', 'Advertising'],
  },
  {
    name: 'Industrials',
    slug: 'industrials',
    description: 'Industrial manufacturing, machinery, aerospace & defense, and industrial services',
    iconName: 'WrenchScrewdriverIcon',
    color: '#64748b',
    displayOrder: 12,
    subSectors: ['Aerospace & Defense', 'Machinery', 'Industrial Services', 'Building Products', 'Electrical Equipment', 'Specialty Chemicals'],
  },
  {
    name: 'Energy',
    slug: 'energy',
    description: 'Oil & gas, utilities, energy services, and traditional energy infrastructure',
    iconName: 'BoltIcon',
    color: '#eab308',
    displayOrder: 13,
    subSectors: ['Oil & Gas', 'Utilities', 'Energy Services', 'Midstream', 'Power Generation', 'Nuclear'],
  },
  {
    name: 'Infrastructure',
    slug: 'infrastructure',
    description: 'Physical and digital infrastructure including telecom towers, data centers, and transportation',
    iconName: 'ServerStackIcon',
    color: '#71717a',
    displayOrder: 14,
    subSectors: ['Data Centers', 'Telecom Infrastructure', 'Transportation Infrastructure', 'Water', 'Public Infrastructure', 'Digital Infrastructure'],
  },
  {
    name: 'Financial Services',
    slug: 'financial-services',
    description: 'Banks, insurance, asset management, and specialty finance companies',
    iconName: 'BanknotesIcon',
    color: '#0d9488',
    displayOrder: 15,
    subSectors: ['Asset Management', 'Insurance', 'Specialty Finance', 'Capital Markets', 'Wealth Management', 'Private Credit'],
  },
  {
    name: 'Transportation / Logistics',
    slug: 'transportation-logistics',
    description: 'Freight, shipping, supply chain, last-mile delivery, and transportation services',
    iconName: 'TruckIcon',
    color: '#0369a1',
    displayOrder: 16,
    subSectors: ['Freight & Shipping', 'Last-Mile Delivery', 'Supply Chain Tech', 'Fleet Management', 'Rail', 'Maritime'],
  },
  {
    name: 'Telecom',
    slug: 'telecom',
    description: 'Telecommunications services, 5G, broadband, and communications infrastructure',
    iconName: 'SignalIcon',
    color: '#7c3aed',
    displayOrder: 17,
    subSectors: ['Wireless', 'Broadband', '5G', 'Fiber', 'Satellite', 'Unified Communications'],
  },
  {
    name: 'Hospitality',
    slug: 'hospitality',
    description: 'Hotels, resorts, travel, and hospitality services',
    iconName: 'GlobeAltIcon',
    color: '#be123c',
    displayOrder: 18,
    subSectors: ['Hotels & Resorts', 'Travel Tech', 'Vacation Rentals', 'Restaurant Tech', 'Cruise', 'Tourism'],
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Professional sports, sports tech, fitness, and sports media',
    iconName: 'TrophyIcon',
    color: '#ca8a04',
    displayOrder: 19,
    subSectors: ['Professional Sports', 'Sports Tech', 'Fitness & Wellness', 'Sports Media', 'Sports Betting', 'Esports'],
  },
  {
    name: 'Education',
    slug: 'education',
    description: 'EdTech, higher education, workforce training, and education services',
    iconName: 'AcademicCapIcon',
    color: '#2563eb',
    displayOrder: 20,
    subSectors: ['EdTech', 'Higher Education', 'K-12', 'Workforce Training', 'Online Learning', 'Education Services'],
  },
  {
    name: 'Agriculture',
    slug: 'agriculture',
    description: 'Agriculture, agtech, farming, and agricultural services',
    iconName: 'SunIcon',
    color: '#65a30d',
    displayOrder: 21,
    subSectors: ['AgTech', 'Crop Sciences', 'Animal Health', 'Precision Agriculture', 'Farm Equipment', 'Agricultural Services'],
  },
  {
    name: 'Manufacturing',
    slug: 'manufacturing',
    description: 'Advanced manufacturing, contract manufacturing, and industrial production',
    iconName: 'CogIcon',
    color: '#475569',
    displayOrder: 22,
    subSectors: ['Advanced Manufacturing', 'Contract Manufacturing', 'Additive Manufacturing', 'Automation', 'Quality Control'],
  },
  {
    name: 'Cannabis',
    slug: 'cannabis',
    description: 'Legal cannabis cultivation, processing, retail, and ancillary services',
    iconName: 'SparklesIcon',
    color: '#16a34a',
    displayOrder: 23,
    subSectors: ['Cultivation', 'Processing', 'Retail/Dispensary', 'Ancillary Services', 'CBD', 'Cannabis Tech'],
  },
  {
    name: 'Crypto / Blockchain',
    slug: 'crypto-blockchain',
    description: 'Cryptocurrency, blockchain technology, DeFi, and Web3',
    iconName: 'CubeTransparentIcon',
    color: '#f59e0b',
    displayOrder: 24,
    subSectors: ['DeFi', 'NFTs', 'Blockchain Infrastructure', 'Exchanges', 'Web3', 'Digital Assets', 'Custody'],
  },
  {
    name: 'Defense / Government',
    slug: 'defense-government',
    description: 'Defense contractors, government services, and public sector technology',
    iconName: 'ShieldCheckIcon',
    color: '#1e3a5f',
    displayOrder: 25,
    subSectors: ['Defense Technology', 'Government IT', 'Intelligence', 'Public Safety', 'Space & Satellite', 'GovTech'],
  },
  {
    name: 'Retail / E-commerce',
    slug: 'retail-ecommerce',
    description: 'Retail, e-commerce platforms, marketplaces, and retail technology',
    iconName: 'ShoppingCartIcon',
    color: '#db2777',
    displayOrder: 26,
    subSectors: ['E-commerce', 'Marketplaces', 'Retail Tech', 'Brick & Mortar', 'Omnichannel', 'Quick Commerce'],
  },
  {
    name: 'Cleantech / Climate',
    slug: 'cleantech-climate',
    description: 'Clean energy, climate tech, carbon capture, and sustainability',
    iconName: 'GlobeAmericasIcon',
    color: '#059669',
    displayOrder: 27,
    subSectors: ['Solar', 'Wind', 'Battery/Storage', 'Carbon Capture', 'EV Infrastructure', 'Hydrogen', 'Sustainability'],
  },
  {
    name: 'Insurance',
    slug: 'insurance',
    description: 'Property & casualty, life, health, and specialty insurance',
    iconName: 'ShieldExclamationIcon',
    color: '#0e7490',
    displayOrder: 28,
    subSectors: ['P&C', 'Life & Health', 'Specialty Lines', 'Reinsurance', 'MGA/MGU', 'Claims Tech'],
  },
  {
    name: 'Legal',
    slug: 'legal',
    description: 'Legal technology, law firm services, and legal process outsourcing',
    iconName: 'ScaleIcon',
    color: '#4b5563',
    displayOrder: 29,
    subSectors: ['Legal Tech', 'Law Firm Services', 'Compliance', 'Contract Management', 'Legal Process Outsourcing'],
  },
  {
    name: 'Human Capital',
    slug: 'human-capital',
    description: 'HR technology, staffing, recruiting, and workforce management',
    iconName: 'UsersIcon',
    color: '#9333ea',
    displayOrder: 30,
    subSectors: ['HR Tech', 'Staffing', 'Recruiting', 'Payroll', 'Benefits', 'Workforce Management'],
  },
] as const;

// ---- Stage Taxonomy ----
// Standard investment stages used across the capital markets industry

export const INVESTMENT_STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Growth Equity',
  'Late Stage',
  'Buyout',
  'Leveraged Buyout',
  'Management Buyout',
  'Recapitalization',
  'Turnaround',
  'Distressed',
  'Special Situations',
  'Secondaries',
  'Mezzanine',
  'Venture Debt',
  'Senior Debt',
  'Subordinated Debt',
  'Bridge Financing',
  'Pre-IPO',
  'PIPE',
  'Co-Investment',
] as const;

// ---- Deal Type Taxonomy ----

export const DEAL_TYPES = [
  'Equity',
  'Debt',
  'Mezzanine',
  'Convertible Note',
  'SAFE',
  'Revenue-Based Financing',
  'Asset-Based Lending',
  'Senior Secured',
  'Subordinated',
  'Unitranche',
  'First Lien',
  'Second Lien',
  'Preferred Equity',
  'Common Equity',
  'Structured Equity',
  'Real Estate Debt',
  'Real Estate Equity',
  'Infrastructure Debt',
  'Project Finance',
  'Trade Finance',
  'Factoring',
  'Leasing',
] as const;

// ---- Geography Regions ----

export const GEOGRAPHIC_REGIONS = [
  'North America',
  'United States',
  'Canada',
  'Europe',
  'Western Europe',
  'Eastern Europe',
  'Nordic',
  'UK & Ireland',
  'DACH',
  'Asia Pacific',
  'Greater China',
  'Southeast Asia',
  'Japan',
  'South Korea',
  'India',
  'Australia & New Zealand',
  'Middle East',
  'GCC',
  'Israel',
  'Africa',
  'Sub-Saharan Africa',
  'North Africa',
  'Latin America',
  'Brazil',
  'Mexico',
  'Global',
] as const;

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
] as const;

// ---- CRM Status Labels ----

export const CRM_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  PROSPECT: { label: 'Prospect', color: '#94a3b8', bgColor: '#1e293b' },
  CONTACTED: { label: 'Contacted', color: '#60a5fa', bgColor: '#1e3a5f' },
  MEETING_SCHEDULED: { label: 'Meeting Scheduled', color: '#a78bfa', bgColor: '#2e1065' },
  IN_DISCUSSION: { label: 'In Discussion', color: '#fbbf24', bgColor: '#451a03' },
  ACTIVE_RELATIONSHIP: { label: 'Active Relationship', color: '#34d399', bgColor: '#064e3b' },
  DORMANT: { label: 'Dormant', color: '#64748b', bgColor: '#1e293b' },
  DO_NOT_CONTACT: { label: 'Do Not Contact', color: '#f87171', bgColor: '#450a0a' },
  FORMER_CLIENT: { label: 'Former Client', color: '#fb923c', bgColor: '#431407' },
  CLIENT: { label: 'Client', color: '#22d3ee', bgColor: '#083344' },
};

// ---- Priority Config ----

export const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  CRITICAL: { label: 'Critical', color: '#ef4444' },
  HIGH: { label: 'High', color: '#f59e0b' },
  MEDIUM: { label: 'Medium', color: '#3b82f6' },
  LOW: { label: 'Low', color: '#64748b' },
};

// ---- Data Confidence Config ----

export const DATA_CONFIDENCE_CONFIG: Record<string, { label: string; color: string }> = {
  VERIFIED: { label: 'Verified', color: '#22c55e' },
  HIGH: { label: 'High', color: '#3b82f6' },
  MEDIUM: { label: 'Medium', color: '#f59e0b' },
  LOW: { label: 'Low', color: '#f97316' },
  UNVERIFIED: { label: 'Unverified', color: '#ef4444' },
};

// ---- Formatting Helpers ----

export function formatCentsToUSD(cents: bigint | number | null | undefined): string {
  if (cents === null || cents === undefined) return 'N/A';
  const dollars = Number(cents) / 100;
  if (dollars >= 1_000_000_000) {
    return `$${(dollars / 1_000_000_000).toFixed(1)}B`;
  }
  if (dollars >= 1_000_000) {
    return `$${(dollars / 1_000_000).toFixed(1)}M`;
  }
  if (dollars >= 1_000) {
    return `$${(dollars / 1_000).toFixed(0)}K`;
  }
  return `$${dollars.toLocaleString()}`;
}

export function formatCheckSizeRange(
  minCents: bigint | number | null | undefined,
  maxCents: bigint | number | null | undefined
): string {
  const min = formatCentsToUSD(minCents);
  const max = formatCentsToUSD(maxCents);
  if (min === 'N/A' && max === 'N/A') return 'N/A';
  if (min === 'N/A') return `Up to ${max}`;
  if (max === 'N/A') return `${min}+`;
  return `${min} – ${max}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
