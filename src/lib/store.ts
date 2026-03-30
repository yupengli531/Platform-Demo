import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CrmStatus, FilterState, BrowseViewMode } from './types';

// =============================================================================
// MPV Capital Intelligence Platform - Zustand Store
// =============================================================================

// ---- Tab Definitions ----

export type AppTab =
  | 'dashboard'
  | 'browse'
  | 'search'
  | 'saved'
  | 'pipeline'
  | 'analytics'
  | 'settings';

// ---- Store Shape ----

interface AppState {
  // Filter state
  filters: FilterState;

  // View mode
  viewMode: BrowseViewMode['mode'];

  // Sidebar
  sidebarOpen: boolean;

  // Active tab
  activeTab: AppTab;

  // Filter panel expanded state
  filterPanelOpen: boolean;

  // Selected firm IDs (for bulk operations)
  selectedFirmIds: Set<string>;

  // Actions: Filters
  setInstitutionType: (value: string | null) => void;
  setIndustry: (value: string | null) => void;
  setSearch: (value: string) => void;
  setGeography: (value: string | null) => void;
  setCrmStatus: (value: CrmStatus | null) => void;
  setCheckSizeRange: (min: number | null, max: number | null) => void;
  setStage: (value: string | null) => void;
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  toggleSortOrder: () => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
  setFilters: (filters: Partial<FilterState>) => void;

  // Actions: View
  setViewMode: (mode: BrowseViewMode['mode']) => void;

  // Actions: Sidebar
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Actions: Tab
  setActiveTab: (tab: AppTab) => void;

  // Actions: Filter panel
  setFilterPanelOpen: (open: boolean) => void;
  toggleFilterPanel: () => void;

  // Actions: Selection
  selectFirm: (id: string) => void;
  deselectFirm: (id: string) => void;
  toggleFirmSelection: (id: string) => void;
  selectAllFirms: (ids: string[]) => void;
  clearSelection: () => void;
}

// ---- Default Filter State ----

const DEFAULT_FILTERS: FilterState = {
  institutionType: null,
  industry: null,
  search: '',
  geography: null,
  crmStatus: null,
  minCheckSize: null,
  maxCheckSize: null,
  stage: null,
  sortBy: 'internalScore',
  sortOrder: 'desc',
  page: 1,
  pageSize: 25,
};

// ---- Store ----

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      filters: { ...DEFAULT_FILTERS },
      viewMode: 'grid',
      sidebarOpen: true,
      activeTab: 'dashboard',
      filterPanelOpen: false,
      selectedFirmIds: new Set<string>(),

      // Filter actions
      setInstitutionType: (value) =>
        set(
          (state) => ({
            filters: { ...state.filters, institutionType: value, page: 1 },
          }),
          false,
          'filters/setInstitutionType'
        ),

      setIndustry: (value) =>
        set(
          (state) => ({
            filters: { ...state.filters, industry: value, page: 1 },
          }),
          false,
          'filters/setIndustry'
        ),

      setSearch: (value) =>
        set(
          (state) => ({
            filters: { ...state.filters, search: value, page: 1 },
          }),
          false,
          'filters/setSearch'
        ),

      setGeography: (value) =>
        set(
          (state) => ({
            filters: { ...state.filters, geography: value, page: 1 },
          }),
          false,
          'filters/setGeography'
        ),

      setCrmStatus: (value) =>
        set(
          (state) => ({
            filters: { ...state.filters, crmStatus: value, page: 1 },
          }),
          false,
          'filters/setCrmStatus'
        ),

      setCheckSizeRange: (min, max) =>
        set(
          (state) => ({
            filters: {
              ...state.filters,
              minCheckSize: min,
              maxCheckSize: max,
              page: 1,
            },
          }),
          false,
          'filters/setCheckSizeRange'
        ),

      setStage: (value) =>
        set(
          (state) => ({
            filters: { ...state.filters, stage: value, page: 1 },
          }),
          false,
          'filters/setStage'
        ),

      setSortBy: (field) =>
        set(
          (state) => ({
            filters: { ...state.filters, sortBy: field, page: 1 },
          }),
          false,
          'filters/setSortBy'
        ),

      setSortOrder: (order) =>
        set(
          (state) => ({
            filters: { ...state.filters, sortOrder: order, page: 1 },
          }),
          false,
          'filters/setSortOrder'
        ),

      toggleSortOrder: () =>
        set(
          (state) => ({
            filters: {
              ...state.filters,
              sortOrder: state.filters.sortOrder === 'asc' ? 'desc' : 'asc',
              page: 1,
            },
          }),
          false,
          'filters/toggleSortOrder'
        ),

      setPage: (page) =>
        set(
          (state) => ({
            filters: { ...state.filters, page },
          }),
          false,
          'filters/setPage'
        ),

      setPageSize: (size) =>
        set(
          (state) => ({
            filters: { ...state.filters, pageSize: size, page: 1 },
          }),
          false,
          'filters/setPageSize'
        ),

      resetFilters: () =>
        set(
          { filters: { ...DEFAULT_FILTERS } },
          false,
          'filters/reset'
        ),

      setFilters: (partial) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...partial, page: 1 },
          }),
          false,
          'filters/setMultiple'
        ),

      // View actions
      setViewMode: (mode) =>
        set({ viewMode: mode }, false, 'view/setMode'),

      // Sidebar actions
      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }, false, 'sidebar/setOpen'),

      toggleSidebar: () =>
        set(
          (state) => ({ sidebarOpen: !state.sidebarOpen }),
          false,
          'sidebar/toggle'
        ),

      // Tab actions
      setActiveTab: (tab) =>
        set({ activeTab: tab }, false, 'tab/setActive'),

      // Filter panel actions
      setFilterPanelOpen: (open) =>
        set({ filterPanelOpen: open }, false, 'filterPanel/setOpen'),

      toggleFilterPanel: () =>
        set(
          (state) => ({ filterPanelOpen: !state.filterPanelOpen }),
          false,
          'filterPanel/toggle'
        ),

      // Selection actions
      selectFirm: (id) =>
        set(
          (state) => {
            const next = new Set(state.selectedFirmIds);
            next.add(id);
            return { selectedFirmIds: next };
          },
          false,
          'selection/selectFirm'
        ),

      deselectFirm: (id) =>
        set(
          (state) => {
            const next = new Set(state.selectedFirmIds);
            next.delete(id);
            return { selectedFirmIds: next };
          },
          false,
          'selection/deselectFirm'
        ),

      toggleFirmSelection: (id) =>
        set(
          (state) => {
            const next = new Set(state.selectedFirmIds);
            if (next.has(id)) {
              next.delete(id);
            } else {
              next.add(id);
            }
            return { selectedFirmIds: next };
          },
          false,
          'selection/toggleFirm'
        ),

      selectAllFirms: (ids) =>
        set(
          { selectedFirmIds: new Set(ids) },
          false,
          'selection/selectAll'
        ),

      clearSelection: () =>
        set(
          { selectedFirmIds: new Set<string>() },
          false,
          'selection/clear'
        ),
    }),
    { name: 'MPVCapitalStore' }
  )
);

// ---- Derived Selectors ----

export const selectFilters = (state: AppState) => state.filters;
export const selectViewMode = (state: AppState) => state.viewMode;
export const selectActiveTab = (state: AppState) => state.activeTab;
export const selectSidebarOpen = (state: AppState) => state.sidebarOpen;
export const selectSelectedCount = (state: AppState) => state.selectedFirmIds.size;
export const selectHasActiveFilters = (state: AppState) => {
  const f = state.filters;
  return !!(
    f.institutionType ||
    f.industry ||
    f.search ||
    f.geography ||
    f.crmStatus ||
    f.minCheckSize !== null ||
    f.maxCheckSize !== null ||
    f.stage
  );
};
