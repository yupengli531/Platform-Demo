// =============================================================================
// MPV Capital Intelligence Platform - TypeScript Type Definitions
// All types aligned with Prisma schema for production use
// =============================================================================

// ---- Enums (mirroring Prisma enums for client-side use) ----

export type CrmStatus =
  | 'PROSPECT'
  | 'CONTACTED'
  | 'MEETING_SCHEDULED'
  | 'IN_DISCUSSION'
  | 'ACTIVE_RELATIONSHIP'
  | 'DORMANT'
  | 'DO_NOT_CONTACT'
  | 'FORMER_CLIENT'
  | 'CLIENT';

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type DataConfidence = 'VERIFIED' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';

export type Seniority =
  | 'C_SUITE'
  | 'PARTNER'
  | 'MANAGING_DIRECTOR'
  | 'DIRECTOR'
  | 'VICE_PRESIDENT'
  | 'ASSOCIATE'
  | 'ANALYST'
  | 'OTHER';

export type TransactionType =
  | 'ACQUISITION'
  | 'MERGER'
  | 'INVESTMENT_EQUITY'
  | 'INVESTMENT_DEBT'
  | 'LEVERAGED_BUYOUT'
  | 'MANAGEMENT_BUYOUT'
  | 'GROWTH_EQUITY'
  | 'VENTURE_CAPITAL'
  | 'SEED_FUNDING'
  | 'IPO'
  | 'SECONDARY'
  | 'RECAPITALIZATION'
  | 'RESTRUCTURING'
  | 'REAL_ESTATE'
  | 'CREDIT_FACILITY'
  | 'MEZZANINE'
  | 'SPECIAL_SITUATIONS'
  | 'CO_INVESTMENT'
  | 'FUND_OF_FUNDS'
  | 'OTHER';

export type DealStatus =
  | 'RUMORED'
  | 'ANNOUNCED'
  | 'PENDING'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'WITHDRAWN';

export type SourceType =
  | 'SEC_FILING'
  | 'PRESS_RELEASE'
  | 'NEWS_ARTICLE'
  | 'COMPANY_WEBSITE'
  | 'PITCHBOOK'
  | 'CRUNCHBASE'
  | 'PREQIN'
  | 'BLOOMBERG'
  | 'CAPITAL_IQ'
  | 'LINKEDIN'
  | 'INTERNAL'
  | 'OTHER';

// ---- Core Entity Types ----

export interface Firm {
  id: string;
  name: string;
  legalName: string | null;
  description: string | null;
  website: string | null;
  linkedinUrl: string | null;
  logoUrl: string | null;

  headquartersCity: string | null;
  headquartersState: string | null;
  headquartersCountry: string | null;
  headquartersRegion: string | null;

  aumCents: bigint | null;
  totalFundSizeCents: bigint | null;
  minCheckSizeCents: bigint | null;
  maxCheckSizeCents: bigint | null;
  minRevenueCents: bigint | null;
  maxRevenueCents: bigint | null;
  minEbitdaCents: bigint | null;
  maxEbitdaCents: bigint | null;
  targetEvRangeLowCents: bigint | null;
  targetEvRangeHighCents: bigint | null;

  stagePreferences: string[];
  dealTypePreferences: string[];
  geographicFocus: string[];
  investmentHorizon: string | null;

  yearFounded: number | null;
  numberOfEmployees: number | null;
  numberOfPartners: number | null;
  activePortfolioSize: number | null;
  totalDealsCompleted: number | null;
  currentFundNumber: number | null;
  currentFundYear: number | null;

  crmStatus: CrmStatus;
  relationshipOwner: string | null;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  internalScore: number | null;
  internalNotes: string | null;
  priority: Priority;

  dataSource: string | null;
  dataConfidence: DataConfidence;
  lastVerifiedAt: string | null;
  lastEnrichedAt: string | null;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations (populated when included)
  institutionTypes?: FirmInstitutionType[];
  industries?: FirmIndustry[];
  contacts?: Contact[];
  transactions?: Transaction[];
  tags?: FirmTag[];
  sourceLinks?: SourceLink[];
}

export interface FirmSummary {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  headquartersCity: string | null;
  headquartersState: string | null;
  headquartersCountry: string | null;
  aumCents: bigint | null;
  minCheckSizeCents: bigint | null;
  maxCheckSizeCents: bigint | null;
  stagePreferences: string[];
  dealTypePreferences: string[];
  crmStatus: CrmStatus;
  internalScore: number | null;
  priority: Priority;
  dataConfidence: DataConfidence;
  institutionTypes: { institutionType: InstitutionType; isPrimary: boolean }[];
  industries: { industry: Industry; isPrimary: boolean }[];
  tags: { tag: Tag }[];
  _count: {
    contacts: number;
    transactions: number;
  };
}

// ---- Classification Types ----

export interface InstitutionType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number;
  iconName: string | null;
  color: string | null;
  isActive: boolean;
  _count?: { firms: number };
}

export interface FirmInstitutionType {
  id: string;
  firmId: string;
  institutionTypeId: string;
  isPrimary: boolean;
  confidence: DataConfidence;
  institutionType: InstitutionType;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  displayOrder: number;
  iconName: string | null;
  color: string | null;
  isActive: boolean;
  children?: Industry[];
  subSectors?: SubSector[];
  _count?: { firms: number };
}

export interface SubSector {
  id: string;
  name: string;
  slug: string;
  industryId: string;
  description: string | null;
  isActive: boolean;
}

export interface FirmIndustry {
  id: string;
  firmId: string;
  industryId: string;
  isPrimary: boolean;
  confidence: DataConfidence;
  industry: Industry;
}

// ---- Contacts ----

export interface Contact {
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
  seniority: Seniority | null;
  lastContactDate: string | null;
  relationshipScore: number | null;
  notes: string | null;
  isActive: boolean;
}

// ---- Transactions ----

export interface Transaction {
  id: string;
  firmId: string;
  transactionName: string;
  targetCompany: string | null;
  transactionType: TransactionType;
  role: string | null;
  dealSizeCents: bigint | null;
  investmentCents: bigint | null;
  industry: string | null;
  sector: string | null;
  stage: string | null;
  geography: string | null;
  announcedDate: string | null;
  closedDate: string | null;
  status: DealStatus;
  description: string | null;
  sourceUrl: string | null;
}

// ---- Tags ----

export interface Tag {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  color: string | null;
}

export interface FirmTag {
  id: string;
  firmId: string;
  tagId: string;
  tag: Tag;
}

// ---- Source Links ----

export interface SourceLink {
  id: string;
  firmId: string;
  url: string;
  title: string | null;
  sourceType: SourceType;
  description: string | null;
  accessedAt: string | null;
}

// ---- API Request/Response Types ----

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface FirmFilters {
  search?: string;
  institutionTypes?: string[];
  industries?: string[];
  geographies?: string[];
  states?: string[];
  countries?: string[];
  crmStatuses?: CrmStatus[];
  priorities?: Priority[];
  stagePreferences?: string[];
  dealTypePreferences?: string[];
  minAum?: number;
  maxAum?: number;
  minCheckSize?: number;
  maxCheckSize?: number;
  minScore?: number;
  maxScore?: number;
  dataConfidence?: DataConfidence[];
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  totalFirms: number;
  totalContacts: number;
  totalTransactions: number;
  firmsByInstitutionType: { name: string; slug: string; count: number; color: string | null }[];
  firmsByIndustry: { name: string; slug: string; count: number; color: string | null }[];
  firmsByCrmStatus: { status: CrmStatus; count: number }[];
  firmsByGeography: { country: string; state: string | null; count: number }[];
  recentActivity: {
    id: string;
    action: string;
    entityType: string;
    details: string | null;
    createdAt: string;
    firmName: string | null;
  }[];
  topFirmsByScore: FirmSummary[];
}

export interface SearchResult {
  type: 'firm' | 'contact' | 'transaction';
  id: string;
  title: string;
  subtitle: string;
  description: string | null;
  url: string;
  relevance: number;
}

// ---- UI State Types ----

export interface FilterState {
  institutionType: string | null;
  industry: string | null;
  search: string;
  geography: string | null;
  crmStatus: CrmStatus | null;
  minCheckSize: number | null;
  maxCheckSize: number | null;
  stage: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface BrowseViewMode {
  mode: 'grid' | 'table' | 'list';
}
