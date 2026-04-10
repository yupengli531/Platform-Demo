'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAppStore } from '@/store/useAppStore';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const { toggleSidebar, globalSearch, setGlobalSearch } = useAppStore();
  const [searchInput, setSearchInput] = useState(globalSearch);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setGlobalSearch(value);
      }, 350);
    },
    [setGlobalSearch],
  );

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setGlobalSearch(searchInput);
      }
    },
    [searchInput, setGlobalSearch],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center border-b border-sand-200 bg-base/95 backdrop-blur-sm">
      <div className="flex w-full items-center gap-4 px-4 lg:px-6">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="rounded-md p-2 text-warm-600 transition-colors hover:bg-sand-100 hover:text-warm-900 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>

        {/* Logo / App name */}
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-soft">
            <span className="text-sm font-bold text-white">M</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold leading-tight text-warm-900">
              MPV Capital{' '}
              <span className="text-brand-600">Intelligence</span>
            </h1>
          </div>
        </div>

        {/* Desktop search */}
        <div className="mx-4 hidden max-w-xl flex-1 md:block">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search firms, contacts, deals..."
              className="w-full rounded-lg border border-sand-300 bg-sand-50 py-2 pl-10 pr-4 text-sm text-warm-900 placeholder-warm-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30 focus:bg-base"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Spacer for mobile */}
        <div className="flex-1 md:hidden" />

        {/* Mobile search toggle */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          className="rounded-md p-2 text-warm-600 transition-colors hover:bg-sand-100 hover:text-warm-900 md:hidden"
          aria-label="Toggle search"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notification bell */}
          <button
            type="button"
            className="relative rounded-md p-2 text-warm-500 transition-colors hover:bg-sand-100 hover:text-warm-700"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500" />
          </button>

          {/* User menu */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-md p-1.5 text-warm-500 transition-colors hover:bg-sand-100 hover:text-warm-700"
            aria-label="User menu"
          >
            <UserCircleIcon className="h-6 w-6" />
            <span className="hidden text-sm font-medium text-warm-700 lg:block">Account</span>
          </button>
        </div>
      </div>

      {/* Mobile search bar (expanded) */}
      {mobileSearchOpen && (
        <div className="absolute left-0 top-16 w-full border-b border-sand-200 bg-base p-3 md:hidden">
          <div className="relative">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search firms, contacts, deals..."
              autoFocus
              className="w-full rounded-lg border border-sand-300 bg-sand-50 py-2 pl-10 pr-4 text-sm text-warm-900 placeholder-warm-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/30"
            />
          </div>
        </div>
      )}
    </header>
  );
}
