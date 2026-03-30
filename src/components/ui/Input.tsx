'use client';

import {
  type ReactNode,
  type InputHTMLAttributes,
  forwardRef,
  useId,
} from 'react';
import clsx from 'clsx';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, icon, className, id, ...rest }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className={clsx('flex flex-col gap-1.5', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-400"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 [&>svg]:h-4 [&>svg]:w-4">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-md border bg-zinc-800/60 text-sm text-zinc-100 placeholder-zinc-500',
              'px-3 py-2',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-zinc-900',
              icon && 'pl-9',
              error
                ? 'border-red-500/60 focus:ring-red-500/40'
                : 'border-zinc-700/60 focus:border-blue-500/60 focus:ring-blue-500/40',
              'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
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
