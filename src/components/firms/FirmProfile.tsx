'use client';

import { useState } from 'react';
import { formatCentsToUSD, formatCheckSizeRange, CRM_STATUS_CONFIG, PRIORITY_CONFIG, DATA_CONFIDENCE_CONFIG } from '@/lib/constants';
import {
  GlobeAltIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  ClockIcon,
  TagIcon,
  LinkIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface FirmProfileProps {
  firm: {
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
    aumCents: string | null;
    totalFundSizeCents: string | null;
    minCheckSizeCents: string | null;
    maxCheckSizeCents: string | null;
    minRevenueCents: string | null;
    maxRevenueCents: string | null;
    minEbitdaCents: string | null;
    maxEbitdaCents: string | null;
    targetEvRangeLowCents: string | null;
    targetEvRangeHighCents: string | null;
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
    crmStatus: string;
    relationshipOwner: string | null;
    lastContactDate: string | null;
    nextFollowUpDate: string | null;
    internalScore: number | null;
    internalNotes: string | null;
    priority: string;
    dataSource: string | null;
    dataConfidence: string;
    lastVerifiedAt: string | null;
    lastEnrichedAt: string | null;
    createdAt: string;
    updatedAt: string;
    institutionTypes: { institutionType: { name: string; slug: string; color: string | null }; isPrimary: boolean }[];
    industries: { industry: { name: string; slug: string; color: string | null }; isPrimary: boolean }[];
    contacts: {
      id: string;
      firstName: string;
      lastName: string;
      title: string | null;
      email: string | null;
      phone: string | null;
      linkedinUrl: string | null;
      isPrimaryContact: boolean;
      seniority: string | null;
      relationshipScore: number | null;
    }[];
    transactions: {
      id: string;
      transactionName: string;
      targetCompany: string | null;
      transactionType: string;
      role: string | null;
      dealSizeCents: string | null;
      industry: string | null;
      closedDate: string | null;
      status: string;
    }[];
    tags: { tag: { name: string; slug: string; color: string | null } }[];
    sourceLinks: {
      id: string;
      url: string;
      title: string | null;
      sourceType: string;
    }[];
    activityLogs: {
      id: string;
      action: string;
      details: string | null;
      createdAt: string;
    }[];
    _count: { contacts: number; transactions: number; tags: number; sourceLinks: number };
  };
}

type TabId = 'overview' | 'contacts' | 'transactions' | 'sources' | 'activity';

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: BuildingOfficeIcon },
  { id: 'contacts', label: 'Contacts', icon: UserGroupIcon },
  { id: 'transactions', label: 'Transactions', icon: DocumentTextIcon },
  { id: 'sources', label: 'Sources', icon: LinkIcon },
  { id: 'activity', label: 'Activity', icon: ClockIcon },
];

export default function FirmProfile({ firm }: FirmProfileProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const location = [firm.headquartersCity, firm.headquartersState, firm.headquartersCountry]
    .filter(Boolean)
    .join(', ');

  const crmConfig = CRM_STATUS_CONFIG[firm.crmStatus] || CRM_STATUS_CONFIG.PROSPECT;
  const priorityConfig = PRIORITY_CONFIG[firm.priority] || PRIORITY_CONFIG.MEDIUM;
  const confidenceConfig = DATA_CONFIDENCE_CONFIG[firm.dataConfidence] || DATA_CONFIDENCE_CONFIG.MEDIUM;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-50 via-sand-50 to-warm-50 border border-sand-200 rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Logo / Avatar */}
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl font-bold text-warm-900 flex-shrink-0">
            {firm.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-warm-900">{firm.name}</h1>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ color: crmConfig.color, backgroundColor: crmConfig.bgColor }}
              >
                {crmConfig.label}
              </span>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full border"
                style={{ color: priorityConfig.color, borderColor: `${priorityConfig.color}40` }}
              >
                {priorityConfig.label} Priority
              </span>
            </div>

            {firm.legalName && firm.legalName !== firm.name && (
              <p className="text-sm text-warm-500 mb-2">{firm.legalName}</p>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-warm-500 mb-4">
              {location && (
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              )}
              {firm.yearFounded && (
                <div className="flex items-center gap-1.5">
                  <CalendarDaysIcon className="h-4 w-4" />
                  <span>Founded {firm.yearFounded}</span>
                </div>
              )}
              {firm.numberOfEmployees && (
                <div className="flex items-center gap-1.5">
                  <UsersIcon className="h-4 w-4" />
                  <span>{firm.numberOfEmployees} employees</span>
                </div>
              )}
              {firm.website && (
                <a
                  href={firm.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <GlobeAltIcon className="h-4 w-4" />
                  <span>Website</span>
                  <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              )}
              {firm.linkedinUrl && (
                <a
                  href={firm.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>LinkedIn</span>
                  <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* Institution Type & Industry Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {firm.institutionTypes.map(({ institutionType: it, isPrimary }) => (
                <span
                  key={it.slug}
                  className="text-xs font-medium px-2.5 py-1 rounded-lg"
                  style={{
                    color: it.color || '#94a3b8',
                    backgroundColor: `${it.color || '#94a3b8'}15`,
                    border: `1px solid ${it.color || '#94a3b8'}30`,
                  }}
                >
                  {it.name}{isPrimary ? ' (Primary)' : ''}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {firm.industries.map(({ industry: ind }) => (
                <span
                  key={ind.slug}
                  className="text-xs text-warm-600 px-2 py-0.5 rounded-md bg-sand-100 border border-sand-200"
                >
                  {ind.name}
                </span>
              ))}
            </div>
          </div>

          {/* Score */}
          {firm.internalScore !== null && (
            <div className="flex-shrink-0 text-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#1e293b" strokeWidth="6" />
                  <circle
                    cx="36" cy="36" r="30" fill="none"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(firm.internalScore / 100) * 188.5} 188.5`}
                    stroke={
                      firm.internalScore >= 80 ? '#22c55e' :
                      firm.internalScore >= 60 ? '#f59e0b' :
                      firm.internalScore >= 40 ? '#3b82f6' : '#64748b'
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-warm-900">{firm.internalScore}</span>
                </div>
              </div>
              <p className="text-2xs text-warm-400 mt-1">Internal Score</p>
            </div>
          )}
        </div>

        {/* Description */}
        {firm.description && (
          <p className="text-sm text-warm-600 leading-relaxed mt-4 border-t border-sand-200 pt-4">
            {firm.description}
          </p>
        )}
      </div>

      {/* Financial Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <MetricCard label="AUM" value={formatCentsToUSD(Number(firm.aumCents))} highlight />
        <MetricCard label="Fund Size" value={formatCentsToUSD(Number(firm.totalFundSizeCents))} />
        <MetricCard label="Check Size" value={formatCheckSizeRange(Number(firm.minCheckSizeCents), Number(firm.maxCheckSizeCents))} />
        <MetricCard label="EV Range" value={formatCheckSizeRange(Number(firm.targetEvRangeLowCents), Number(firm.targetEvRangeHighCents))} />
        <MetricCard label="EBITDA Req." value={formatCheckSizeRange(Number(firm.minEbitdaCents), Number(firm.maxEbitdaCents))} />
        <MetricCard label="Revenue Req." value={formatCheckSizeRange(Number(firm.minRevenueCents), Number(firm.maxRevenueCents))} />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-sand-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = tab.id === 'contacts' ? firm._count.contacts
            : tab.id === 'transactions' ? firm._count.transactions
            : tab.id === 'sources' ? firm._count.sourceLinks
            : tab.id === 'activity' ? firm.activityLogs.length
            : undefined;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-warm-500 hover:text-warm-900 hover:border-sand-400'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {count !== undefined && (
                <span className="text-2xs bg-sand-100 text-warm-500 px-1.5 py-0.5 rounded-full">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab firm={firm} />}
      {activeTab === 'contacts' && <ContactsTab contacts={firm.contacts} />}
      {activeTab === 'transactions' && <TransactionsTab transactions={firm.transactions} />}
      {activeTab === 'sources' && <SourcesTab sources={firm.sourceLinks} />}
      {activeTab === 'activity' && <ActivityTab logs={firm.activityLogs} />}

      {/* CRM & Data Quality Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* CRM Status */}
        <div className="bg-white border border-sand-200 rounded-xl shadow-soft p-5">
          <h3 className="text-sm font-semibold text-warm-900 mb-4 flex items-center gap-2">
            <StarIcon className="h-4 w-4 text-brand-500" />
            Relationship Management
          </h3>
          <div className="space-y-3 text-sm">
            <InfoRow label="Status" value={crmConfig.label} color={crmConfig.color} />
            <InfoRow label="Priority" value={priorityConfig.label} color={priorityConfig.color} />
            <InfoRow label="Relationship Owner" value={firm.relationshipOwner || '—'} />
            <InfoRow label="Last Contact" value={firm.lastContactDate ? new Date(firm.lastContactDate).toLocaleDateString() : '—'} />
            <InfoRow label="Next Follow-Up" value={firm.nextFollowUpDate ? new Date(firm.nextFollowUpDate).toLocaleDateString() : '—'} />
            {firm.internalNotes && (
              <div className="pt-2 border-t border-sand-200">
                <p className="text-xs text-warm-400 mb-1">Internal Notes</p>
                <p className="text-xs text-warm-600 leading-relaxed">{firm.internalNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Quality */}
        <div className="bg-white border border-sand-200 rounded-xl shadow-soft p-5">
          <h3 className="text-sm font-semibold text-warm-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="h-4 w-4 text-brand-600" />
            Data Quality
          </h3>
          <div className="space-y-3 text-sm">
            <InfoRow label="Confidence" value={confidenceConfig.label} color={confidenceConfig.color} />
            <InfoRow label="Data Source" value={firm.dataSource || '—'} />
            <InfoRow label="Last Verified" value={firm.lastVerifiedAt ? new Date(firm.lastVerifiedAt).toLocaleDateString() : 'Never'} />
            <InfoRow label="Last Enriched" value={firm.lastEnrichedAt ? new Date(firm.lastEnrichedAt).toLocaleDateString() : 'Never'} />
            <InfoRow label="Created" value={new Date(firm.createdAt).toLocaleDateString()} />
            <InfoRow label="Updated" value={new Date(firm.updatedAt).toLocaleDateString()} />
          </div>
        </div>
      </div>

      {/* Tags */}
      {firm.tags.length > 0 && (
        <div className="mt-6 bg-white border border-sand-200 rounded-xl shadow-soft p-5">
          <h3 className="text-sm font-semibold text-warm-900 mb-3 flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-warm-500" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {firm.tags.map(({ tag }) => (
              <span
                key={tag.slug}
                className="text-xs px-2.5 py-1 rounded-full border border-sand-200 text-warm-600 bg-sand-100/50"
                style={tag.color ? { color: tag.color, borderColor: `${tag.color}30` } : undefined}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Sub-components ----

function MetricCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white border border-sand-200 rounded-xl shadow-soft px-4 py-3">
      <div className="text-2xs text-warm-400 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-sm font-semibold ${highlight ? 'text-brand-700' : 'text-warm-900'}`}>
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-warm-400">{label}</span>
      <span className="text-xs font-medium" style={color ? { color } : { color: '#e2e8f0' }}>
        {value}
      </span>
    </div>
  );
}

function OverviewTab({ firm }: { firm: FirmProfileProps['firm'] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Investment Focus */}
      <div className="bg-white border border-sand-200 rounded-xl shadow-soft p-5">
        <h3 className="text-sm font-semibold text-warm-900 mb-4">Investment Focus</h3>
        <div className="space-y-4">
          {firm.stagePreferences.length > 0 && (
            <div>
              <p className="text-xs text-warm-400 mb-2">Stage Preferences</p>
              <div className="flex flex-wrap gap-1.5">
                {firm.stagePreferences.map((stage) => (
                  <span key={stage} className="text-xs text-brand-700 px-2 py-0.5 rounded-md bg-brand-50 border border-brand-200">
                    {stage}
                  </span>
                ))}
              </div>
            </div>
          )}
          {firm.dealTypePreferences.length > 0 && (
            <div>
              <p className="text-xs text-warm-400 mb-2">Deal Types</p>
              <div className="flex flex-wrap gap-1.5">
                {firm.dealTypePreferences.map((deal) => (
                  <span key={deal} className="text-xs text-warm-600 px-2 py-0.5 rounded-md bg-sand-100 border border-sand-200">
                    {deal}
                  </span>
                ))}
              </div>
            </div>
          )}
          {firm.geographicFocus.length > 0 && (
            <div>
              <p className="text-xs text-warm-400 mb-2">Geographic Focus</p>
              <div className="flex flex-wrap gap-1.5">
                {firm.geographicFocus.map((geo) => (
                  <span key={geo} className="text-xs text-warm-600 px-2 py-0.5 rounded-md bg-sand-100 border border-sand-200">
                    {geo}
                  </span>
                ))}
              </div>
            </div>
          )}
          {firm.investmentHorizon && (
            <div>
              <p className="text-xs text-warm-400 mb-1">Investment Horizon</p>
              <p className="text-sm text-warm-900">{firm.investmentHorizon}</p>
            </div>
          )}
        </div>
      </div>

      {/* Firm Details */}
      <div className="bg-white border border-sand-200 rounded-xl shadow-soft p-5">
        <h3 className="text-sm font-semibold text-warm-900 mb-4">Firm Details</h3>
        <div className="space-y-3">
          <InfoRow label="Partners" value={firm.numberOfPartners?.toString() || '—'} />
          <InfoRow label="Active Portfolio" value={firm.activePortfolioSize?.toString() || '—'} />
          <InfoRow label="Total Deals" value={firm.totalDealsCompleted?.toString() || '—'} />
          <InfoRow label="Current Fund" value={firm.currentFundNumber ? `Fund ${firm.currentFundNumber} (${firm.currentFundYear || '—'})` : '—'} />
          <InfoRow label="Region" value={firm.headquartersRegion || '—'} />
        </div>
      </div>
    </div>
  );
}

function ContactsTab({ contacts }: { contacts: FirmProfileProps['firm']['contacts'] }) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="h-10 w-10 text-warm-300 mx-auto mb-3" />
        <p className="text-warm-500">No contacts recorded</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sand-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Name</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Title</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Email</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Phone</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">LinkedIn</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b border-sand-100 hover:bg-sand-50 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-warm-900 font-medium">{contact.firstName} {contact.lastName}</span>
                  {contact.isPrimaryContact && (
                    <span className="text-2xs px-1.5 py-0.5 rounded bg-gold-500/20 text-brand-700 font-medium">Primary</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-warm-500">{contact.title || '—'}</td>
              <td className="py-3 px-4">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    <EnvelopeIcon className="h-3.5 w-3.5" />
                    {contact.email}
                  </a>
                ) : '—'}
              </td>
              <td className="py-3 px-4">
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="text-warm-600 flex items-center gap-1">
                    <PhoneIcon className="h-3.5 w-3.5" />
                    {contact.phone}
                  </a>
                ) : '—'}
              </td>
              <td className="py-3 px-4">
                {contact.linkedinUrl ? (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <LinkIcon className="h-3.5 w-3.5" />
                    <span className="text-xs">Profile</span>
                    <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                  </a>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransactionsTab({ transactions }: { transactions: FirmProfileProps['firm']['transactions'] }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="h-10 w-10 text-warm-300 mx-auto mb-3" />
        <p className="text-warm-500">No transactions recorded</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sand-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Transaction</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Target</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Type</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Role</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Deal Size</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Industry</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Date</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-sand-100 hover:bg-sand-50 transition-colors">
              <td className="py-3 px-4 text-warm-900 font-medium">{tx.transactionName}</td>
              <td className="py-3 px-4 text-warm-500">{tx.targetCompany || '—'}</td>
              <td className="py-3 px-4">
                <span className="text-xs text-brand-700 px-2 py-0.5 rounded-md bg-brand-50">
                  {tx.transactionType.replace(/_/g, ' ')}
                </span>
              </td>
              <td className="py-3 px-4 text-warm-500">{tx.role || '—'}</td>
              <td className="py-3 px-4 text-right text-brand-700 font-medium">
                {tx.dealSizeCents ? formatCentsToUSD(Number(tx.dealSizeCents)) : '—'}
              </td>
              <td className="py-3 px-4 text-warm-500 text-xs">{tx.industry || '—'}</td>
              <td className="py-3 px-4 text-warm-500 text-xs">
                {tx.closedDate ? new Date(tx.closedDate).toLocaleDateString() : '—'}
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`text-2xs px-2 py-0.5 rounded-full font-medium ${
                  tx.status === 'COMPLETED' ? 'text-green-400 bg-green-500/10' :
                  tx.status === 'PENDING' ? 'text-yellow-400 bg-yellow-500/10' :
                  tx.status === 'ANNOUNCED' ? 'text-blue-400 bg-blue-500/10' :
                  'text-warm-500 bg-warm-500/10'
                }`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourcesTab({ sources }: { sources: FirmProfileProps['firm']['sourceLinks'] }) {
  if (sources.length === 0) {
    return (
      <div className="text-center py-12">
        <LinkIcon className="h-10 w-10 text-warm-300 mx-auto mb-3" />
        <p className="text-warm-500">No source links recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sources.map((source) => (
        <div key={source.id} className="flex items-center gap-3 bg-sand-50 border border-sand-200 rounded-lg px-4 py-3">
          <LinkIcon className="h-4 w-4 text-warm-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-600 hover:text-brand-700 truncate block"
            >
              {source.title || source.url}
            </a>
          </div>
          <span className="text-2xs text-warm-400 px-2 py-0.5 rounded bg-sand-100">
            {source.sourceType.replace(/_/g, ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}

function ActivityTab({ logs }: { logs: FirmProfileProps['firm']['activityLogs'] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <ClockIcon className="h-10 w-10 text-warm-300 mx-auto mb-3" />
        <p className="text-warm-500">No activity recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-3 text-sm">
          <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
          <div>
            <p className="text-warm-600">
              <span className="text-xs font-medium text-brand-600 uppercase">{log.action}</span>
              {log.details && <span className="text-warm-500"> — {log.details}</span>}
            </p>
            <p className="text-xs text-warm-300 mt-0.5">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
