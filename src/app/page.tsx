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
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-sand-50 to-warm-50 border border-sand-200 rounded-2xl p-8 md:p-12 mb-8">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <BoltIcon className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-brand-600">Capital Intelligence Platform</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-warm-900 mb-3">
              MPV Capital Intelligence
            </h1>
            <p className="text-base text-warm-500 max-w-2xl mb-6">
              Navigate capital markets data by investor type and industry vertical. Search, filter, and match the right capital sources for any deal.
            </p>

            {/* Quick Search */}
            <div className="relative max-w-xl">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-warm-400" />
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
                className="w-full bg-base border border-sand-300 rounded-xl text-warm-900 text-sm py-3.5 pl-12 pr-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 placeholder:text-warm-400 transition-all shadow-soft"
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
            <h2 className="text-lg font-semibold text-warm-900 flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-brand-500" />
              Browse by Capital Provider
            </h2>
            <Link href="/browse" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
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
                  className="group bg-base border border-sand-200 rounded-xl px-4 py-3.5 hover:border-brand-300 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-8 rounded-full flex-shrink-0"
                      style={{ backgroundColor: type.color }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-warm-800 group-hover:text-brand-700 transition-colors truncate">
                        {type.name}
                      </h3>
                      <p className="text-xs text-warm-400 mt-0.5">
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
            <h2 className="text-lg font-semibold text-warm-900 flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-sage-500" />
              Browse by Industry
            </h2>
            <Link href="/browse" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
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
                  className="group bg-base border border-sand-200 rounded-xl px-3.5 py-3 hover:border-sage-300 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-1.5 h-6 rounded-full flex-shrink-0"
                      style={{ backgroundColor: industry.color }}
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-medium text-warm-800 group-hover:text-sage-700 transition-colors truncate">
                        {industry.name}
                      </h3>
                      <p className="text-2xs text-warm-400">{count.toLocaleString()}</p>
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
          <div className="bg-base border border-sand-200 rounded-xl p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-warm-900 mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-brand-500" />
              Relationship Pipeline
            </h3>
            <div className="space-y-2">
              {data?.firmsByCrmStatus.sort((a, b) => b.count - a.count).map(({ status, count }) => {
                const config = CRM_STATUS_CONFIG[status];
                const total = data?.totalFirms || 1;
                const pct = ((count / total) * 100).toFixed(0);
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-warm-500 truncate">{config?.label || status}</div>
                    <div className="flex-1 h-2 bg-sand-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: config?.color || '#7c6f5e',
                        }}
                      />
                    </div>
                    <div className="w-8 text-xs text-warm-500 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-base border border-sand-200 rounded-xl p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-warm-900 mb-4 flex items-center gap-2">
              <ChartBarSquareIcon className="h-4 w-4 text-brand-500" />
              Recent Activity
            </h3>
            {data?.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-warm-700 truncate">
                        <span className="text-brand-600 font-medium">{activity.action}</span>
                        {activity.firmName && <span className="text-warm-400"> · {activity.firmName}</span>}
                      </p>
                      {activity.details && (
                        <p className="text-warm-400 truncate mt-0.5">{activity.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-warm-400">No recent activity</p>
            )}
          </div>

          {/* Geographic Distribution */}
          <div className="bg-base border border-sand-200 rounded-xl p-5 shadow-soft">
            <h3 className="text-sm font-semibold text-warm-900 mb-4 flex items-center gap-2">
              <UserGroupIcon className="h-4 w-4 text-sage-500" />
              Geographic Distribution
            </h3>
            {data?.firmsByGeography && data.firmsByGeography.length > 0 ? (
              <div className="space-y-2">
                {data.firmsByGeography.slice(0, 10).map((geo, i) => {
                  const total = data?.totalFirms || 1;
                  const pct = ((geo.count / total) * 100).toFixed(0);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-warm-500 truncate">
                        {geo.state ? `${geo.state}, ${geo.country}` : geo.country}
                      </div>
                      <div className="flex-1 h-2 bg-sand-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sage-400 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="w-8 text-xs text-warm-500 text-right">{geo.count}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-warm-400">No geographic data available</p>
            )}
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mt-8 mb-4">
          <h2 className="text-lg font-semibold text-warm-900 mb-4">Quick Queries</h2>
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
                className="flex items-center gap-3 bg-base border border-sand-200 rounded-lg px-4 py-3 text-sm text-warm-500 hover:text-warm-800 hover:border-brand-300 hover:shadow-card transition-all group"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-warm-400 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
                <span className="truncate">{q}</span>
                <ArrowRightIcon className="h-3.5 w-3.5 ml-auto text-warm-400 group-hover:text-brand-500 flex-shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
