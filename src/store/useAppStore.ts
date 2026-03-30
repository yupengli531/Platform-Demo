import { create } from 'zustand';
import type { FilterState } from '@/lib/types';

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Filters
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;

  // Global search
  globalSearch: string;
  setGlobalSearch: (search: string) => void;

  // View mode
  viewMode: 'grid' | 'table' | 'list';
  setViewMode: (mode: 'grid' | 'table' | 'list') => void;
}

const defaultFilters: FilterState = {
  institutionType: null,
  industry: null,
  search: '',
  geography: null,
  crmStatus: null,
  minCheckSize: null,
  maxCheckSize: null,
  stage: null,
  sortBy: 'name',
  sortOrder: 'asc',
  page: 1,
  pageSize: 25,
};

export const useAppStore = create<AppState>((set) => ({
  // Sidebar
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Filters
  filters: { ...defaultFilters },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key !== 'page' ? 1 : (value as number) },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  // Global search
  globalSearch: '',
  setGlobalSearch: (search) => set({ globalSearch: search }),

  // View mode
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),
}));
