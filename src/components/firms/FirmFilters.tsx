'use client';

import { useState } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import {
  INVESTMENT_STAGES,
  DEAL_TYPES,
  US_STATES,
  CRM_STATUS_CONFIG,
  PRIORITY_CONFIG,
  DATA_CONFIDENCE_CONFIG,
} from '@/lib/constants';

interface FirmFiltersProps {
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
  activeFilterCount: number;
  className?: string;
}

export interface FilterValues {
  states: string[];
  countries: string[];
  crmStatuses: string[];
  priorities: string[];
  stagePreferences: string[];
  dealTypePreferences: string[];
  dataConfidence: string[];
  minAum: string;
  maxAum: string;
  minCheckSize: string;
  maxCheckSize: string;
  minScore: string;
  maxScore: string;
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France',
  'Switzerland', 'Israel', 'China', 'Japan', 'Australia',
  'Singapore', 'United Arab Emirates', 'Brazil', 'India', 'South Korea',
];

function FilterSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-sand-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-1 text-sm font-medium text-warm-700 hover:text-warm-900 transition-colors"
      >
        {title}
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4 text-warm-400" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-warm-400" />
        )}
      </button>
      {isOpen && <div className="pb-3 px-1">{children}</div>}
    </div>
  );
}

function MultiSelect({
  options,
  selected,
  onChange,
  renderOption,
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  renderOption?: (option: string) => React.ReactNode;
}) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggle(option)}
          className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
            selected.includes(option)
              ? 'border-brand-400 bg-brand-50 text-brand-700'
              : 'border-sand-200 bg-sand-50 text-warm-500 hover:text-warm-700 hover:border-sand-300'
          }`}
        >
          {renderOption ? renderOption(option) : option}
        </button>
      ))}
    </div>
  );
}

function RangeInput({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  placeholder,
  prefix = '$',
}: {
  label: string;
  minValue: string;
  maxValue: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="text-xs text-warm-400 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-warm-400">{prefix}</span>
          )}
          <input
            type="number"
            value={minValue}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder={placeholder || 'Min'}
            className={`w-full bg-base border border-sand-200 rounded-md text-xs text-warm-800 py-1.5 ${prefix ? 'pl-6' : 'pl-2.5'} pr-2.5 focus:outline-none focus:border-brand-500 placeholder:text-warm-400`}
          />
        </div>
        <span className="text-warm-400 text-xs">to</span>
        <div className="relative flex-1">
          {prefix && (
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-warm-400">{prefix}</span>
          )}
          <input
            type="number"
            value={maxValue}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder={placeholder || 'Max'}
            className={`w-full bg-base border border-sand-200 rounded-md text-xs text-warm-800 py-1.5 ${prefix ? 'pl-6' : 'pl-2.5'} pr-2.5 focus:outline-none focus:border-brand-500 placeholder:text-warm-400`}
          />
        </div>
      </div>
    </div>
  );
}

export default function FirmFilters({
  onApply,
  onClear,
  activeFilterCount,
  className = '',
}: FirmFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    states: [],
    countries: [],
    crmStatuses: [],
    priorities: [],
    stagePreferences: [],
    dealTypePreferences: [],
    dataConfidence: [],
    minAum: '',
    maxAum: '',
    minCheckSize: '',
    maxCheckSize: '',
    minScore: '',
    maxScore: '',
  });

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    setFilters({
      states: [],
      countries: [],
      crmStatuses: [],
      priorities: [],
      stagePreferences: [],
      dealTypePreferences: [],
      dataConfidence: [],
      minAum: '',
      maxAum: '',
      minCheckSize: '',
      maxCheckSize: '',
      minScore: '',
      maxScore: '',
    });
    onClear();
  };

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-base border border-sand-300 rounded-lg text-sm text-warm-600 hover:text-warm-900 hover:border-sand-400 transition-colors"
      >
        <FunnelIcon className="h-4 w-4" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-brand-600 dark:bg-brand-800 text-white text-2xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-base border border-sand-200 rounded-xl shadow-panel z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b border-sand-200">
            <h3 className="text-sm font-semibold text-warm-900">Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-warm-400 hover:text-warm-700 transition-colors">
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-0">
            <FilterSection title="Geography" defaultOpen>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-warm-400 mb-1.5 block">Country</label>
                  <MultiSelect
                    options={COUNTRIES}
                    selected={filters.countries}
                    onChange={(countries) => setFilters({ ...filters, countries })}
                  />
                </div>
                <div>
                  <label className="text-xs text-warm-400 mb-1.5 block">State (US)</label>
                  <MultiSelect
                    options={[...US_STATES].slice(0, 15)}
                    selected={filters.states}
                    onChange={(states) => setFilters({ ...filters, states })}
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Financial Metrics">
              <div className="space-y-3">
                <RangeInput
                  label="AUM (Assets Under Management)"
                  minValue={filters.minAum}
                  maxValue={filters.maxAum}
                  onMinChange={(v) => setFilters({ ...filters, minAum: v })}
                  onMaxChange={(v) => setFilters({ ...filters, maxAum: v })}
                />
                <RangeInput
                  label="Check Size"
                  minValue={filters.minCheckSize}
                  maxValue={filters.maxCheckSize}
                  onMinChange={(v) => setFilters({ ...filters, minCheckSize: v })}
                  onMaxChange={(v) => setFilters({ ...filters, maxCheckSize: v })}
                />
              </div>
            </FilterSection>

            <FilterSection title="CRM Status">
              <MultiSelect
                options={Object.keys(CRM_STATUS_CONFIG)}
                selected={filters.crmStatuses}
                onChange={(crmStatuses) => setFilters({ ...filters, crmStatuses })}
                renderOption={(option) => CRM_STATUS_CONFIG[option]?.label || option}
              />
            </FilterSection>

            <FilterSection title="Priority">
              <MultiSelect
                options={Object.keys(PRIORITY_CONFIG)}
                selected={filters.priorities}
                onChange={(priorities) => setFilters({ ...filters, priorities })}
                renderOption={(option) => PRIORITY_CONFIG[option]?.label || option}
              />
            </FilterSection>

            <FilterSection title="Stage Preferences">
              <MultiSelect
                options={[...INVESTMENT_STAGES]}
                selected={filters.stagePreferences}
                onChange={(stagePreferences) => setFilters({ ...filters, stagePreferences })}
              />
            </FilterSection>

            <FilterSection title="Deal Type">
              <MultiSelect
                options={[...DEAL_TYPES]}
                selected={filters.dealTypePreferences}
                onChange={(dealTypePreferences) => setFilters({ ...filters, dealTypePreferences })}
              />
            </FilterSection>

            <FilterSection title="Data Confidence">
              <MultiSelect
                options={Object.keys(DATA_CONFIDENCE_CONFIG)}
                selected={filters.dataConfidence}
                onChange={(dataConfidence) => setFilters({ ...filters, dataConfidence })}
                renderOption={(option) => DATA_CONFIDENCE_CONFIG[option]?.label || option}
              />
            </FilterSection>

            <FilterSection title="Internal Score">
              <RangeInput
                label="Score Range (1-100)"
                minValue={filters.minScore}
                maxValue={filters.maxScore}
                onMinChange={(v) => setFilters({ ...filters, minScore: v })}
                onMaxChange={(v) => setFilters({ ...filters, maxScore: v })}
                prefix=""
                placeholder="0"
              />
            </FilterSection>
          </div>

          <div className="flex items-center gap-2 p-4 border-t border-sand-200">
            <button
              onClick={handleClear}
              className="flex-1 px-3 py-2 text-sm text-warm-500 hover:text-warm-800 border border-sand-200 rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 dark:bg-brand-800 dark:hover:bg-brand-900 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
