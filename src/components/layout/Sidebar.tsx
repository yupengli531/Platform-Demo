'use client';

import { useState } from 'react';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
  Squares2X2Icon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { INSTITUTION_TYPES } from '@/lib/constants';
import { useAppStore } from '@/store/useAppStore';
import clsx from 'clsx';

const NAV_LINKS = [
  { label: 'Dashboard', icon: HomeIcon, href: '/', id: 'dashboard' },
  { label: 'Browse All', icon: Squares2X2Icon, href: '/browse', id: 'browse' },
  { label: 'Saved Searches', icon: BookmarkIcon, href: '/saved', id: 'saved' },
  { label: 'Recent', icon: ClockIcon, href: '/recent', id: 'recent' },
  { label: 'Export', icon: ArrowDownTrayIcon, href: '/export', id: 'export' },
] as const;

export default function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    filters,
    setFilter,
  } = useAppStore();
  const [typesExpanded, setTypesExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState<string>('dashboard');

  const handleTypeFilter = (slug: string) => {
    setFilter('institutionType', filters.institutionType === slug ? null : slug);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-navy-800/60 bg-surface-primary transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Sidebar header (mobile close) */}
        <div className="flex h-16 items-center justify-between border-b border-navy-800/60 px-4 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold-500 to-gold-600">
              <span className="text-sm font-bold text-navy-950">M</span>
            </div>
            <span className="text-sm font-semibold text-white">
              MPV Capital <span className="text-gold-400">Intelligence</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1.5 text-navy-400 hover:bg-navy-800 hover:text-white"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Quick links */}
          <div className="space-y-0.5">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activeNav === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => setActiveNav(link.id)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-navy-800/80 text-gold-400'
                      : 'text-navy-300 hover:bg-navy-800/50 hover:text-white',
                  )}
                >
                  <Icon
                    className={clsx(
                      'h-4.5 w-4.5 shrink-0',
                      isActive ? 'text-gold-400' : 'text-navy-400',
                    )}
                    style={{ width: 18, height: 18 }}
                  />
                  {link.label}
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-navy-800/60" />

          {/* Institution type filters */}
          <div>
            <button
              type="button"
              onClick={() => setTypesExpanded(!typesExpanded)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider text-navy-400 transition-colors hover:text-navy-200"
            >
              <FunnelIcon className="h-3.5 w-3.5" />
              Institution Types
              {typesExpanded ? (
                <ChevronDownIcon className="ml-auto h-3.5 w-3.5" />
              ) : (
                <ChevronRightIcon className="ml-auto h-3.5 w-3.5" />
              )}
            </button>

            <div
              className={clsx(
                'overflow-hidden transition-all duration-300 ease-in-out',
                typesExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              <div className="mt-1 space-y-0.5 pl-1">
                {/* All types option */}
                <button
                  type="button"
                  onClick={() => setFilter('institutionType', null)}
                  className={clsx(
                    'flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                    filters.institutionType === null
                      ? 'bg-navy-800/60 font-medium text-gold-400'
                      : 'text-navy-300 hover:bg-navy-800/40 hover:text-white',
                  )}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: '#94a3b8' }}
                  />
                  All Types
                </button>

                {INSTITUTION_TYPES.map((type) => {
                  const isActive = filters.institutionType === type.slug;
                  return (
                    <button
                      key={type.slug}
                      type="button"
                      onClick={() => handleTypeFilter(type.slug)}
                      className={clsx(
                        'flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-navy-800/60 font-medium text-gold-400'
                          : 'text-navy-300 hover:bg-navy-800/40 hover:text-white',
                      )}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      {type.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-navy-800/60 px-4 py-3">
          <p className="text-2xs text-navy-500">
            Platform v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
