import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// =============================================================================
// MPV Capital Intelligence Platform - Utility Functions
// =============================================================================

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Debounce a function call. Returns a debounced version that delays invocation
 * until after `delay` milliseconds have elapsed since the last call.
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

/**
 * Format a date string or Date object into a human-readable format.
 * Supports multiple output styles for different UI contexts.
 */
export function formatDate(
  date: string | Date | null | undefined,
  style: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string {
  if (!date) return '—';

  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) return '—';

  switch (style) {
    case 'short':
      return d.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
      });

    case 'medium':
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    case 'long':
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

    case 'relative': {
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHr = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHr / 24);
      const diffWeek = Math.floor(diffDay / 7);
      const diffMonth = Math.floor(diffDay / 30);
      const diffYear = Math.floor(diffDay / 365);

      if (diffSec < 60) return 'just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      if (diffHr < 24) return `${diffHr}h ago`;
      if (diffDay < 7) return `${diffDay}d ago`;
      if (diffWeek < 5) return `${diffWeek}w ago`;
      if (diffMonth < 12) return `${diffMonth}mo ago`;
      return `${diffYear}y ago`;
    }

    default:
      return d.toLocaleDateString('en-US');
  }
}

/**
 * Format a number for display in financial contexts.
 * Supports currency formatting, compact notation, and percentage display.
 */
export function formatNumber(
  value: number | bigint | null | undefined,
  style: 'standard' | 'compact' | 'currency' | 'currencyCompact' | 'percent' | 'integer' = 'standard'
): string {
  if (value === null || value === undefined) return '—';

  const num = typeof value === 'bigint' ? Number(value) : value;

  switch (style) {
    case 'standard':
      return new Intl.NumberFormat('en-US').format(num);

    case 'compact':
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num);

    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);

    case 'currencyCompact':
      if (Math.abs(num) >= 1_000_000_000) {
        return `$${(num / 1_000_000_000).toFixed(1)}B`;
      }
      if (Math.abs(num) >= 1_000_000) {
        return `$${(num / 1_000_000).toFixed(1)}M`;
      }
      if (Math.abs(num) >= 1_000) {
        return `$${(num / 1_000).toFixed(0)}K`;
      }
      return `$${num.toFixed(0)}`;

    case 'percent':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(num);

    case 'integer':
      return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: 0,
      }).format(num);

    default:
      return new Intl.NumberFormat('en-US').format(num);
  }
}

/**
 * Format cents (stored as bigint in database) into a dollar display string.
 * Financial values are stored in cents to avoid floating point issues.
 */
export function formatCents(
  cents: bigint | number | null | undefined,
  style: 'currency' | 'currencyCompact' = 'currencyCompact'
): string {
  if (cents === null || cents === undefined) return '—';
  const dollars = Number(cents) / 100;
  return formatNumber(dollars, style);
}

/**
 * Truncate text to a specified length, appending an ellipsis if needed.
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength).trimEnd();
  return `${truncated}...`;
}

/**
 * Extract initials from a name string.
 * Handles single names, multi-word names, and special characters.
 */
export function getInitials(name: string | null | undefined, maxInitials: number = 2): string {
  if (!name) return '';

  const cleaned = name.replace(/[^a-zA-Z\s]/g, '').trim();
  if (!cleaned) return '';

  const words = cleaned.split(/\s+/).filter(Boolean);

  if (words.length === 0) return '';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  return words
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Parse URL query parameters into a typed object.
 * Handles arrays (comma-separated), numbers, booleans, and null values.
 */
export function parseQueryParams(searchParams: URLSearchParams): Record<string, string | string[] | number | boolean | null> {
  const params: Record<string, string | string[] | number | boolean | null> = {};

  searchParams.forEach((value, key) => {
    if (value === '' || value === 'null') {
      params[key] = null;
      return;
    }

    if (value === 'true') {
      params[key] = true;
      return;
    }

    if (value === 'false') {
      params[key] = false;
      return;
    }

    if (value.includes(',')) {
      params[key] = value.split(',').map((v) => v.trim()).filter(Boolean);
      return;
    }

    const numVal = Number(value);
    if (!isNaN(numVal) && value.trim() !== '') {
      params[key] = numVal;
      return;
    }

    params[key] = value;
  });

  return params;
}

/**
 * Build a URL query string from a params object.
 * Filters out null, undefined, empty strings, and default values.
 */
export function buildQueryString(
  params: Record<string, string | string[] | number | boolean | null | undefined>,
  defaults?: Record<string, unknown>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    if (defaults && key in defaults && value === defaults[key]) return;

    if (Array.isArray(value)) {
      const filtered = value.filter(Boolean);
      if (filtered.length > 0) {
        searchParams.set(key, filtered.join(','));
      }
      return;
    }

    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Convert a CRM status enum value to a human-readable label.
 */
export function formatCrmStatus(status: string): string {
  const labels: Record<string, string> = {
    PROSPECT: 'Prospect',
    CONTACTED: 'Contacted',
    MEETING_SCHEDULED: 'Meeting Scheduled',
    IN_DISCUSSION: 'In Discussion',
    ACTIVE_RELATIONSHIP: 'Active Relationship',
    DORMANT: 'Dormant',
    DO_NOT_CONTACT: 'Do Not Contact',
    FORMER_CLIENT: 'Former Client',
    CLIENT: 'Client',
  };
  return labels[status] ?? status;
}

/**
 * Convert a priority enum value to a display object with label and color class.
 */
export function getPriorityDisplay(priority: string): { label: string; colorClass: string } {
  const map: Record<string, { label: string; colorClass: string }> = {
    CRITICAL: { label: 'Critical', colorClass: 'text-red-400 bg-red-400/10' },
    HIGH: { label: 'High', colorClass: 'text-orange-400 bg-orange-400/10' },
    MEDIUM: { label: 'Medium', colorClass: 'text-yellow-400 bg-yellow-400/10' },
    LOW: { label: 'Low', colorClass: 'text-slate-400 bg-slate-400/10' },
  };
  return map[priority] ?? { label: priority, colorClass: 'text-slate-400 bg-slate-400/10' };
}

/**
 * Convert a data confidence enum to a display object.
 */
export function getConfidenceDisplay(confidence: string): { label: string; colorClass: string } {
  const map: Record<string, { label: string; colorClass: string }> = {
    VERIFIED: { label: 'Verified', colorClass: 'text-emerald-400 bg-emerald-400/10' },
    HIGH: { label: 'High', colorClass: 'text-blue-400 bg-blue-400/10' },
    MEDIUM: { label: 'Medium', colorClass: 'text-yellow-400 bg-yellow-400/10' },
    LOW: { label: 'Low', colorClass: 'text-orange-400 bg-orange-400/10' },
    UNVERIFIED: { label: 'Unverified', colorClass: 'text-slate-500 bg-slate-500/10' },
  };
  return map[confidence] ?? { label: confidence, colorClass: 'text-slate-500 bg-slate-500/10' };
}

/**
 * Generate a consistent color for an entity based on its name or ID.
 * Useful for avatars and tags when no explicit color is assigned.
 */
export function getEntityColor(identifier: string): string {
  const colors = [
    'bg-blue-500/20 text-blue-400',
    'bg-emerald-500/20 text-emerald-400',
    'bg-violet-500/20 text-violet-400',
    'bg-amber-500/20 text-amber-400',
    'bg-rose-500/20 text-rose-400',
    'bg-cyan-500/20 text-cyan-400',
    'bg-indigo-500/20 text-indigo-400',
    'bg-teal-500/20 text-teal-400',
    'bg-pink-500/20 text-pink-400',
    'bg-sky-500/20 text-sky-400',
  ];

  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Sleep for a specified number of milliseconds.
 * Useful for staggered animations and rate limiting.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number within a min/max range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
