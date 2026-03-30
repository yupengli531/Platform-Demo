'use client';

import {
  type ReactNode,
  type ButtonHTMLAttributes,
  type ElementType,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Spinner } from '@/components/ui/Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children?: ReactNode;
  className?: string;
  as?: ElementType;
}

type ButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

const variantStyles: Record<ButtonVariant, string> = {
  primary: clsx(
    'bg-blue-600 text-white border-blue-500/50',
    'hover:bg-blue-500 active:bg-blue-700',
    'focus-visible:ring-blue-500/40',
  ),
  secondary: clsx(
    'bg-zinc-700/60 text-zinc-200 border-zinc-600/50',
    'hover:bg-zinc-600/60 active:bg-zinc-700/80',
    'focus-visible:ring-zinc-500/40',
  ),
  ghost: clsx(
    'bg-transparent text-zinc-400 border-transparent',
    'hover:bg-zinc-800 hover:text-zinc-200',
    'focus-visible:ring-zinc-500/40',
  ),
  danger: clsx(
    'bg-red-600/80 text-white border-red-500/50',
    'hover:bg-red-500/80 active:bg-red-700/80',
    'focus-visible:ring-red-500/40',
  ),
  gold: clsx(
    'bg-amber-600/90 text-white border-amber-500/50',
    'hover:bg-amber-500/90 active:bg-amber-700/90',
    'focus-visible:ring-amber-500/40',
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconPosition = 'left',
      children,
      className,
      as,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const Component = as ?? 'button';
    const isDisabled = disabled || loading;

    return (
      <Component
        ref={ref}
        type={Component === 'button' ? type : undefined}
        disabled={isDisabled}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-md border',
          'transition-colors duration-150 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...rest}
      >
        {loading && (
          <Spinner size="sm" color="currentColor" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        )}
      </Component>
    );
  },
);
