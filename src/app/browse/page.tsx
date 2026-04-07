'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import InvestorTypeTabs from '@/components/navigation/InvestorTypeTabs';
import IndustryTabs from '@/components/navigation/IndustryTabs';
import FirmGrid from '@/components/firms/FirmGrid';
import FirmFilters, { FilterValues } from '@/components/firms/FirmFilters';
import FirmStats from '@/components/firms/FirmStats';
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 24,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  // State from URL params
  const [activeInstitutionType, setActiveInstitutionType] = useState(searchParams.get('institutionType') || '');
  const [activeIndustry, setActiveIndustry] = useState(searchParams.get('industry') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Tab counts
  const [institutionTypeCounts, setInstitutionTypeCounts] = useState<Record<string, number>>({});
  const [industryCounts, setIndustryCounts] = useState<Record<string, number>>({});

  // Stats
  const [stats, setStats] = useState({ totalFirms: 0, totalContacts: 0, totalTransactions: 0 });

  // Fetch tab counts on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/institution-types').then((r) => r.json()),
      fetch('/api/industries').then((r) => r.json()),
      fetch('/api/analytics').then((r) => r.json()),
    ]).then(([types, industries, analytics]) => {
      const typeCounts: Record<string, number> = {};
      types.forEach((t: { slug: string; firmCount: number }) => {
        typeCounts[t.slug] = t.firmCount;
      });
      setInstitutionTypeCounts(typeCounts);

      const indCounts: Record<string, number> = {};
      industries.forEach((i: { slug: string; firmCount: number }) => {
        indCounts[i.slug] = i.firmCount;
      });
      setIndustryCounts(indCounts);

      setStats({
        totalFirms: analytics.totalFirms || 0,
        totalContacts: analytics.totalContacts || 0,
        totalTransactions: analytics.totalTransactions || 0,
      });
    }).catch(console.error);
  }, []);

  // Fetch firms when filters change
  const fetchFirms = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (activeInstitutionType) params.set('institutionTypes', activeInstitutionType);
      if (activeIndustry) params.set('industries', activeIndustry);
      params.set('page', page.toString());
      params.set('pageSize', '24');
      params.set('sortBy', 'name');
      params.set('sortOrder', 'asc');

      // Apply additional filters
      if (activeFilters) {
        if (activeFilters.states.length > 0) params.set('states', activeFilters.states.join(','));
        if (activeFilters.countries.length > 0) params.set('countries', activeFilters.countries.join(','));
        if (activeFilters.crmStatuses.length > 0) params.set('crmStatuses', activeFilters.crmStatuses.join(','));
        if (activeFilters.priorities.length > 0) params.set('priorities', activeFilters.priorities.join(','));
        if (activeFilters.stagePreferences.length > 0) params.set('stagePreferences', activeFilters.stagePreferences.join(','));
        if (activeFilters.dealTypePreferences.length > 0) params.set('dealTypePreferences', activeFilters.dealTypePreferences.join(','));
        if (activeFilters.dataConfidence.length > 0) params.set('dataConfidence', activeFilters.dataConfidence.join(','));
        if (activeFilters.minAum) params.set('minAum', activeFilters.minAum);
        if (activeFilters.maxAum) params.set('maxAum', activeFilters.maxAum);
        if (activeFilters.minCheckSize) params.set('minCheckSize', activeFilters.minCheckSize);
        if (activeFilters.maxCheckSize) params.set('maxCheckSize', activeFilters.maxCheckSize);
        if (activeFilters.minScore) params.set('minScore', activeFilters.minScore);
        if (activeFilters.maxScore) params.set('maxScore', activeFilters.maxScore);
      }

      const res = await fetch(`/api/firms?${params.toString()}`);
      const data = await res.json();
      setFirms(data.data || []);
      setPagination(data.pagination || { page: 1, pageSize: 24, total: 0, totalPages: 0, hasMore: false });
    } catch (error) {
      console.error('Error fetching firms:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeInstitutionType, activeIndustry, activeFilters]);

  useEffect(() => {
    fetchFirms(1);
  }, [fetchFirms]);

  // Update URL when tabs change
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeInstitutionType) params.set('institutionType', activeInstitutionType);
    if (activeIndustry) params.set('industry', activeIndustry);
    if (searchQuery) params.set('search', searchQuery);
    router.replace(`/browse?${params.toString()}`, { scroll: false });
  }, [activeInstitutionType, activeIndustry, searchQuery, router]);

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters);
    // Count active filters
    let count = 0;
    if (filters.states.length) count++;
    if (filters.countries.length) count++;
    if (filters.crmStatuses.length) count++;
    if (filters.priorities.length) count++;
    if (filters.stagePreferences.length) count++;
    if (filters.dealTypePreferences.length) count++;
    if (filters.dataConfidence.length) count++;
    if (filters.minAum || filters.maxAum) count++;
    if (filters.minCheckSize || filters.maxCheckSize) count++;
    if (filters.minScore || filters.maxScore) count++;
    setActiveFilterCount(count);
  };

  const handleClearFilters = () => {
    setActiveFilters(null);
    setActiveFilterCount(0);
  };

  const handleExport = async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeInstitutionType) params.set('institutionTypes', activeInstitutionType);
    if (activeIndustry) params.set('industries', activeIndustry);

    const res = await fetch(`/api/export?${params.toString()}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capital-intelligence-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div>
          <FirmStats
            totalFirms={stats.totalFirms}
            totalContacts={stats.totalContacts}
            totalTransactions={stats.totalTransactions}
          />
        </div>

        {/* Primary Navigation: Institution Type Tabs */}
        <div className="overflow-hidden">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Capital Provider Type
          </h2>
          <InvestorTypeTabs
            counts={institutionTypeCounts}
            activeSlug={activeInstitutionType}
            onTabChange={(slug) => setActiveInstitutionType(slug === activeInstitutionType ? '' : slug)}
          />
        </div>

        {/* Secondary Navigation: Industry Tabs */}
        <div className="overflow-hidden">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Industry / Sector
          </h2>
          <IndustryTabs
            counts={industryCounts}
            activeSlug={activeIndustry}
            onTabChange={(slug) => setActiveIndustry(slug === activeIndustry ? '' : slug)}
          />
        </div>

        {/* Search + Filter Bar */}
        <div className="relative z-20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by firm name, contact, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900/60 border border-navy-700/50 rounded-lg text-white text-sm py-2.5 pl-10 pr-4 focus:outline-none focus:border-brand-500/50 placeholder:text-slate-600 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <FirmFilters
                  onApply={handleApplyFilters}
                  onClear={handleClearFilters}
                  activeFilterCount={activeFilterCount}
                />
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-sm text-slate-300 hover:text-white hover:border-navy-600 transition-colors"
                title="Export to CSV"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={() => fetchFirms(1)}
                className="flex items-center gap-2 px-3 py-2 bg-navy-800/50 border border-navy-700/50 rounded-lg text-sm text-slate-300 hover:text-white hover:border-navy-600 transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(activeInstitutionType || activeIndustry || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-slate-500">Active:</span>
              {activeInstitutionType && (
                <button
                  onClick={() => setActiveInstitutionType('')}
                  className="text-xs px-2.5 py-1 rounded-full bg-brand-500/15 text-brand-300 border border-brand-500/20 hover:bg-brand-500/25 transition-colors flex items-center gap-1"
                >
                  {activeInstitutionType.replace(/-/g, ' ')}
                  <span className="text-brand-500">&times;</span>
                </button>
              )}
              {activeIndustry && (
                <button
                  onClick={() => setActiveIndustry('')}
                  className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors flex items-center gap-1"
                >
                  {activeIndustry.replace(/-/g, ' ')}
                  <span className="text-emerald-500">&times;</span>
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-500/15 text-slate-300 border border-slate-500/20 hover:bg-slate-500/25 transition-colors flex items-center gap-1"
                >
                  &ldquo;{searchQuery}&rdquo;
                  <span className="text-slate-500">&times;</span>
                </button>
              )}
              <button
                onClick={() => {
                  setActiveInstitutionType('');
                  setActiveIndustry('');
                  setSearchQuery('');
                  handleClearFilters();
                }}
                className="text-xs text-slate-500 hover:text-white transition-colors ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Firm Results */}
        <FirmGrid
          firms={firms}
          loading={loading}
          emptyMessage={
            activeInstitutionType || activeIndustry || searchQuery
              ? 'No firms match your current filters. Try adjusting your criteria.'
              : 'No firms in the database yet. Import your data to get started.'
          }
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => fetchFirms(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm text-slate-400 bg-navy-800/50 border border-navy-700/50 rounded-lg hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchFirms(pageNum)}
                    className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                      pageNum === pagination.page
                        ? 'bg-brand-600 text-white font-medium'
                        : 'text-slate-400 hover:text-white hover:bg-navy-800/50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => fetchFirms(pagination.page + 1)}
              disabled={!pagination.hasMore}
              className="px-3 py-2 text-sm text-slate-400 bg-navy-800/50 border border-navy-700/50 rounded-lg hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
        </div>
      </AppShell>
    }>
      <BrowseContent />
    </Suspense>
  );
}
