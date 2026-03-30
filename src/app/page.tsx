'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import FirmStats from '@/components/firms/FirmStats';
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ChartBarSquareIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { INSTITUTION_TYPES, INDUSTRIES, CRM_STATUS_CONFIG } from '@/lib/constants';

interface DashboardData {
  totalFirms: number;
  totalContacts: number;
  totalTransactions: number;
  firmsByInstitutionType: { name: string; slug: string; count: number; color: string | null }[];
  firmsByIndustry: { name: string; slug: string; count: number; color: string | null }[];
  firmsByCrmStatus: { status: string; count: number }[];
  firmsByGeography: { country: string; state: string | null; count: number }[];
  recentActivity: { id: string; action: string; entityType: string; details: string | null; createdAt: string; firmName: string | null }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-brand-950/30 to-navy-950 border border-navy-700/30 rounded-2xl p-8 md:p-12 mb-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxZTI5M2IiIGZpbGwtb3BhY2l0eT0iMC4xNSI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6TTAgMzR2LTJoMnYySD16Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <BoltIcon className="h-5 w-5 text-gold-400" />
              <span className="text-sm font-medium text-gold-400">Capital Intelligence Platform</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              MPV Capital Intelligence
            </h1>
            <p className="text-base text-slate-400 max-w-2xl mb-6">
              Navigate capital markets data by investor type and industry vertical. Search, filter, and match the right capital sources for any deal.
            </p>

            {/* Quick Search */}
            <div className="relative max-w-xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search firms, contacts, or transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/browse?search=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="w-full bg-navy-900/80 border border-navy-700/50 rounded-xl text-white text-sm py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 placeholder:text-slate-600 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-8">
          <FirmStats
            totalFirms={data?.totalFirms || 0}
            totalContacts={data?.totalContacts || 0}
            totalTransactions={data?.totalTransactions || 0}
          />
        </div>

        {/* Quick Access: Institution Types */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-brand-400" />
              Browse by Capital Provider
            </h2>
            <Link href="/browse" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View All <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {INSTITUTION_TYPES.map((type) => {
              const count = data?.firmsByInstitutionType.find((f) => f.slug === type.slug)?.count || 0;
              return (
                <Link
                  key={type.slug}
                  href={`/browse?institutionType=${type.slug}`}
                  className="group bg-navy-950/60 border border-navy-700/30 rounded-xl px-4 py-3.5 hover:border-brand-500/30 hover:bg-navy-900/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: type.color }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors truncate">
                        {type.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {count.toLocaleString()} {count === 1 ? 'firm' : 'firms'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Access: Top Industries */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-emerald-400" />
              Browse by Industry
            </h2>
            <Link href="/browse" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View All <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {INDUSTRIES.slice(0, 18).map((industry) => {
              const count = data?.firmsByIndustry.find((f) => f.slug === industry.slug)?.count || 0;
              return (
                <Link
                  key={industry.slug}
                  href={`/browse?industry=${industry.slug}`}
                  className="group bg-navy-950/60 border border-navy-700/30 rounded-xl px-3.5 py-3 hover:border-emerald-500/20 hover:bg-navy-900/60 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-1.5 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: industry.color }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                        {industry.name}
                      </h3>
                      <p className="text-2xs text-slate-500">{count.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Grid: CRM Pipeline + Recent Activity + Geography */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CRM Pipeline */}
          <div className="bg-navy-950/80 border border-navy-700/30 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-gold-400" />
              Relationship Pipeline
            </h3>
            <div className="space-y-2">
              {data?.firmsByCrmStatus.sort((a, b) => b.count - a.count).map(({ status, count }) => {
                const config = CRM_STATUS_CONFIG[status];
                const total = data?.totalFirms || 1;
                const pct = ((count / total) * 100).toFixed(0);
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-slate-400 truncate">{config?.label || status}</div>
                    <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: config?.color || '#64748b',
                        }}
                      />
                    </div>
                    <div className="w-8 text-xs text-slate-500 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-navy-950/80 border border-navy-700/30 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ChartBarSquareIcon className="h-4 w-4 text-brand-400" />
              Recent Activity
            </h3>
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-slate-300 truncate">
                        <span className="text-brand-400 font-medium">{activity.action}</span>
                        {activity.firmName && <span className="text-slate-500"> · {activity.firmName}</span>}
                      </p>
                      {activity.details && (
                        <p className="text-slate-600 truncate mt-0.5">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent activity</p>
            )}
          </div>

          {/* Geographic Distribution */}
          <div className="bg-navy-950/80 border border-navy-700/30 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <UserGroupIcon className="h-4 w-4 text-emerald-400" />
              Geographic Distribution
            </h3>
            {data?.firmsByGeography && data.firmsByGeography.length > 0 ? (
              <div className="space-y-2">
                {data.firmsByGeography.slice(0, 10).map((geo, i) => {
                  const total = data?.totalFirms || 1;
                  const pct = ((geo.count / total) * 100).toFixed(0);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-slate-400 truncate">
                        {geo.state ? `${geo.state}, ${geo.country}` : geo.country}
                      </div>
                      <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500/60 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="w-8 text-xs text-slate-500 text-right">{geo.count}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No geographic data available</p>
            )}
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Queries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { q: 'Family offices investing in gaming', href: '/browse?institutionType=family-offices&industry=gaming' },
              { q: 'Banks active in real estate', href: '/browse?institutionType=banks&industry=real-estate' },
              { q: 'Hedge funds in special situations', href: '/browse?institutionType=hedge-funds&stage=Special+Situations' },
              { q: 'PE firms focused on healthcare', href: '/browse?institutionType=private-equity&industry=healthcare' },
              { q: 'VCs investing in AI/ML', href: '/browse?institutionType=venture-capital&industry=ai-machine-learning' },
              { q: 'Investment banks in technology', href: '/browse?institutionType=investment-banks&industry=technology' },
            ].map(({ q, href }) => (
              <Link
                key={q}
                href={href}
                className="flex items-center gap-3 bg-navy-950/40 border border-navy-700/20 rounded-lg px-4 py-3 text-sm text-slate-400 hover:text-white hover:border-brand-500/30 hover:bg-navy-900/40 transition-all group"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-600 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
                <span className="truncate">{q}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 ml-auto text-slate-700 group-hover:text-brand-400 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
