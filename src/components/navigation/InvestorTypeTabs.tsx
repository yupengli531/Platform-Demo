'use client';

import { useRef, useCallback } from 'react';
import { INSTITUTION_TYPES } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import clsx from 'clsx';

interface InvestorTypeTabsProps {
  counts: Record<string, number>;
  className?: string;
  activeSlug?: string;
  onTabChange?: (slug: string) => void;
}

export default function InvestorTypeTabs({ counts, className, activeSlug: externalSlug, onTabChange }: InvestorTypeTabsProps) {
  const { filters, setFilter } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSlug = externalSlug !== undefined ? (externalSlug || null) : filters.institutionType;

  const totalCount = Object.values(counts).reduce((sum, c) => sum + c, 0);

  const handleTabClick = useCallback(
    (slug: string | null) => {
      if (onTabChange) {
        onTabChange(slug || '');
      } else {
        setFilter('institutionType', slug);
      }
    },
    [setFilter, onTabChange],
  );

  const formatCount = (n: number): string => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toLocaleString();
  };

  return (
    <div className={clsx('relative', className)}>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-1 overflow-x-auto pb-px"
        role="tablist"
        aria-label="Filter by institution type"
      >
        {/* All tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeSlug === null}
          onClick={() => handleTabClick(null)}
          className={clsx(
            'relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors',
            activeSlug === null
              ? 'text-gold-400'
              : 'text-navy-400 hover:bg-navy-800/40 hover:text-navy-200',
          )}
        >
          All
          <span
            className={clsx(
              'rounded-full px-2 py-0.5 text-xs tabular-nums',
              activeSlug === null
                ? 'bg-gold-500/15 text-gold-400'
                : 'bg-navy-800 text-navy-400',
            )}
          >
            {formatCount(totalCount)}
          </span>
          {activeSlug === null && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gold-400" />
          )}
        </button>

        {INSTITUTION_TYPES.map((type) => {
          const isActive = activeSlug === type.slug;
          const count = counts[type.slug] ?? 0;
          return (
            <button
              key={type.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabClick(type.slug)}
              className={clsx(
                'relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-gold-400'
                  : 'text-navy-400 hover:bg-navy-800/40 hover:text-navy-200',
              )}
            >
              {type.name}
              <span
                className={clsx(
                  'rounded-full px-2 py-0.5 text-xs tabular-nums',
                  isActive
                    ? 'bg-gold-500/15 text-gold-400'
                    : 'bg-navy-800 text-navy-400',
                )}
              >
                {formatCount(count)}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gold-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom border */}
      <div className="border-b border-navy-800/60" />
    </div>
  );
}
