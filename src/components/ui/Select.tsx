'use client';

import { type SelectHTMLAttributes, forwardRef, useId } from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, options, value, onChange, placeholder, error, className, id, ...rest },
    ref,
  ) {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
      <div className={clsx('flex flex-col gap-1.5', className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-zinc-400"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={clsx(
              'w-full appearance-none rounded-md border bg-zinc-800/60 text-sm text-zinc-100',
              'pl-3 pr-9 py-2',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-zinc-900',
              error
                ? 'border-red-500/60 focus:ring-red-500/40'
                : 'border-zinc-700/60 focus:border-blue-500/60 focus:ring-blue-500/40',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              !value && 'text-zinc-500',
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="text-xs text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
