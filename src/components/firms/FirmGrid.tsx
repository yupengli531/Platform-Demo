'use client';

import { useState } from 'react';
import FirmCard from './FirmCard';
import {
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { formatCentsToUSD, CRM_STATUS_CONFIG } from '@/lib/constants';
import Link from 'next/link';

interface FirmData {
  id: string;
  name: string;
  description: string | null;
  headquartersCity: string | null;
  headquartersState: string | null;
  headquartersCountry: string | null;
  aumCents: string | null;
  minCheckSizeCents: string | null;
  maxCheckSizeCents: string | null;
  stagePreferences: string[];
  dealTypePreferences: string[];
  crmStatus: string;
  internalScore: number | null;
  priority: string;
  institutionTypes: { institutionType: { name: string; slug: string; color: string | null }; isPrimary: boolean }[];
  industries: { industry: { name: string; slug: string; color: string | null }; isPrimary: boolean }[];
  tags: { tag: { name: string; slug: string; color: string | null } }[];
  _count: { contacts: number; transactions: number };
}

interface FirmGridProps {
  firms: FirmData[];
  loading?: boolean;
  emptyMessage?: string;
  defaultViewMode?: 'grid' | 'table' | 'list';
}

function SkeletonCard() {
  return (
    <div className="bg-navy-950/80 border border-navy-700/30 rounded-xl p-5 animate-pulse">
      <div className="h-5 bg-navy-800 rounded w-3/4 mb-3" />
      <div className="h-3 bg-navy-800 rounded w-1/2 mb-3" />
      <div className="flex gap-1.5 mb-3">
        <div className="h-5 bg-navy-800 rounded w-20" />
        <div className="h-5 bg-navy-800 rounded w-16" />
      </div>
      <div className="h-3 bg-navy-800 rounded w-full mb-2" />
      <div className="h-3 bg-navy-800 rounded w-2/3 mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="h-12 bg-navy-800 rounded" />
        <div className="h-12 bg-navy-800 rounded" />
      </div>
      <div className="flex justify-between pt-3 border-t border-navy-700/30">
        <div className="h-3 bg-navy-800 rounded w-16" />
        <div className="h-3 bg-navy-800 rounded w-12" />
      </div>
    </div>
  );
}

export default function FirmGrid({
  firms,
  loading = false,
  emptyMessage = 'No firms found matching your criteria.',
  defaultViewMode = 'grid',
}: FirmGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'list'>(defaultViewMode);

  if (loading) {
    return (
      <div>
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} count={0} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (firms.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy-800/50 mb-4">
          <Squares2X2Icon className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">No Results</h3>
        <p className="text-slate-500 max-w-md mx-auto">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} count={firms.length} />

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          {firms.map((firm) => (
            <FirmCard key={firm.id} {...firm} />
          ))}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Firm</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">AUM</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Check Size</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Score</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Deals</th>
              </tr>
            </thead>
            <tbody>
              {firms.map((firm) => {
                const crmConfig = CRM_STATUS_CONFIG[firm.crmStatus] || CRM_STATUS_CONFIG.PROSPECT;
                return (
                  <tr key={firm.id} className="border-b border-navy-800/50 hover:bg-navy-900/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link href={`/firms/${firm.id}`} className="text-white font-medium hover:text-brand-400 transition-colors">
                        {firm.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {firm.institutionTypes.slice(0, 2).map(({ institutionType: it }) => (
                          <span
                            key={it.slug}
                            className="text-2xs px-1.5 py-0.5 rounded"
                            style={{ color: it.color || '#94a3b8', backgroundColor: `${it.color || '#94a3b8'}15` }}
                          >
                            {it.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {firm.industries.slice(0, 2).map((i) => i.industry.name).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {[firm.headquartersCity, firm.headquartersState].filter(Boolean).join(', ')}
                    </td>
                    <td className="py-3 px-4 text-right text-gold-400 font-medium text-xs">
                      {firm.aumCents ? formatCentsToUSD(Number(firm.aumCents)) : '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-white text-xs">
                      {firm.minCheckSizeCents || firm.maxCheckSizeCents
                        ? `${formatCentsToUSD(Number(firm.minCheckSizeCents))} – ${formatCentsToUSD(Number(firm.maxCheckSizeCents))}`
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {firm.internalScore !== null ? (
                        <span className="text-xs font-medium text-slate-300">{firm.internalScore}</span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className="text-2xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color: crmConfig.color, backgroundColor: crmConfig.bgColor }}
                      >
                        {crmConfig.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400 text-xs">
                      {firm._count.transactions}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="mt-4 space-y-2">
          {firms.map((firm) => {
            const crmConfig = CRM_STATUS_CONFIG[firm.crmStatus] || CRM_STATUS_CONFIG.PROSPECT;
            return (
              <Link key={firm.id} href={`/firms/${firm.id}`} className="block group">
                <div className="flex items-center gap-4 bg-navy-950/60 border border-navy-700/30 rounded-lg px-4 py-3 hover:border-brand-500/30 hover:bg-navy-900/60 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white group-hover:text-brand-400 truncate">
                        {firm.name}
                      </h4>
                      <span
                        className="text-2xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ color: crmConfig.color, backgroundColor: crmConfig.bgColor }}
                      >
                        {crmConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      {firm.institutionTypes.slice(0, 2).map(({ institutionType: it }) => (
                        <span key={it.slug} style={{ color: it.color || undefined }}>{it.name}</span>
                      ))}
                      <span>·</span>
                      <span>{[firm.headquartersCity, firm.headquartersState].filter(Boolean).join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    {firm.aumCents && (
                      <div className="text-right">
                        <div className="text-2xs text-slate-500">AUM</div>
                        <div className="text-sm font-semibold text-gold-400">{formatCentsToUSD(Number(firm.aumCents))}</div>
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-2xs text-slate-500">Contacts</div>
                      <div className="text-sm text-white">{firm._count.contacts}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xs text-slate-500">Deals</div>
                      <div className="text-sm text-white">{firm._count.transactions}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ViewModeToggle({
  viewMode,
  setViewMode,
  count,
}: {
  viewMode: 'grid' | 'table' | 'list';
  setViewMode: (mode: 'grid' | 'table' | 'list') => void;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-400">
        <span className="text-white font-semibold">{count.toLocaleString()}</span> results
      </p>
      <div className="flex items-center gap-1 bg-navy-800/50 rounded-lg p-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Grid view"
        >
          <Squares2X2Icon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="Table view"
        >
          <TableCellsIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
          title="List view"
        >
          <ListBulletIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
