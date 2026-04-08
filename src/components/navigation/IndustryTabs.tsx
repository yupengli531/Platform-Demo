'use client';

import { useRef, useState, useCallback } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { INDUSTRIES } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import clsx from 'clsx';

interface IndustryTabsProps {
  counts: Record<string, number>;
  className?: string;
  activeSlug?: string;
  onTabChange?: (slug: string) => void;
}

export default function IndustryTabs({ counts, className, activeSlug: externalSlug, onTabChange }: IndustryTabsProps) {
  const { filters, setFilter } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeSlug = externalSlug !== undefined ? (externalSlug || null) : filters.industry;

  const totalCount = Object.values(counts).reduce((sum, c) => sum + c, 0);

  const handleTabClick = useCallback(
    (slug: string | null) => {
      if (onTabChange) {
        onTabChange(slug || '');
      } else {
        setFilter('industry', slug);
      }
      setMobileOpen(false);
    },
    [setFilter, onTabChange],
  );

  const formatCount = (n: number): string => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toLocaleString();
  };

  const activeIndustry = INDUSTRIES.find((ind) => ind.slug === activeSlug);
  const activeLabel = activeIndustry ? activeIndustry.name : 'All Industries';

  return (
    <div className={clsx('relative', className)}>
      {/* Mobile dropdown trigger */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-sand-300 bg-white px-3 py-2 text-sm text-warm-800 transition-colors hover:border-sand-400"
        >
          <div className="flex items-center gap-2">
            {activeIndustry && (
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: activeIndustry.color }}
              />
            )}
            {activeLabel}
          </div>
          <ChevronDownIcon
            className={clsx(
              'h-4 w-4 text-warm-400 transition-transform',
              mobileOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-80 overflow-y-auto rounded-lg border border-sand-200 bg-white shadow-panel">
            <button
              type="button"
              onClick={() => handleTabClick(null)}
              className={clsx(
                'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                activeSlug === null
                  ? 'bg-brand-50 font-medium text-brand-700'
                  : 'text-warm-600 hover:bg-sand-50',
              )}
            >
              All Industries
              <span className="ml-auto text-xs tabular-nums text-warm-400">
                {formatCount(totalCount)}
              </span>
            </button>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.slug}
                type="button"
                onClick={() => handleTabClick(ind.slug)}
                className={clsx(
                  'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                  activeSlug === ind.slug
                    ? 'bg-brand-50 font-medium text-brand-700'
                    : 'text-warm-600 hover:bg-sand-50',
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ind.color }}
                />
                {ind.name}
                <span className="ml-auto text-xs tabular-nums text-warm-400">
                  {formatCount(counts[ind.slug] ?? 0)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop scrollable tabs */}
      <div className="hidden md:block">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-1 overflow-x-auto pb-px"
          role="tablist"
          aria-label="Filter by industry"
        >
          {/* All Industries tab */}
          <button
            type="button"
            role="tab"
            aria-selected={activeSlug === null}
            onClick={() => handleTabClick(null)}
            className={clsx(
              'relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium transition-colors',
              activeSlug === null
                ? 'text-sage-700'
                : 'text-warm-400 hover:bg-sand-100 hover:text-warm-700',
            )}
          >
            All Industries
            <span
              className={clsx(
                'rounded-full px-1.5 py-0.5 text-xs tabular-nums',
                activeSlug === null
                  ? 'bg-sage-100 text-sage-700'
                  : 'bg-sand-100 text-warm-400',
              )}
            >
              {formatCount(totalCount)}
            </span>
            {activeSlug === null && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-sage-500" />
            )}
          </button>

          {INDUSTRIES.map((ind) => {
            const isActive = activeSlug === ind.slug;
            const count = counts[ind.slug] ?? 0;
            return (
              <button
                key={ind.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(ind.slug)}
                className={clsx(
                  'relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-sage-700'
                    : 'text-warm-400 hover:bg-sand-100 hover:text-warm-700',
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: ind.color }}
                />
                {ind.name}
                <span
                  className={clsx(
                    'rounded-full px-1.5 py-0.5 text-xs tabular-nums',
                    isActive
                      ? 'bg-sage-100 text-sage-700'
                      : 'bg-sand-100 text-warm-400',
                  )}
                >
                  {formatCount(count)}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-sage-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom border */}
        <div className="border-b border-sand-200" />
      </div>
    </div>
  );
}
