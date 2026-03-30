'use client';

import { type ReactNode } from 'react';
import clsx from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    'bg-zinc-700/50 text-zinc-200 border-zinc-600/50',
  success:
    'bg-emerald-900/40 text-emerald-400 border-emerald-700/40',
  warning:
    'bg-amber-900/40 text-amber-400 border-amber-700/40',
  danger:
    'bg-red-900/40 text-red-400 border-red-700/40',
  info:
    'bg-blue-900/40 text-blue-400 border-blue-700/40',
  neutral:
    'bg-zinc-800/60 text-zinc-400 border-zinc-700/40',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5 leading-tight',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-2.5 py-1',
};

export function Badge({
  variant = 'default',
  size = 'md',
  color,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded border whitespace-nowrap',
        !color && variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      style={
        color
          ? {
              backgroundColor: `${color}1a`,
              color,
              borderColor: `${color}40`,
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
