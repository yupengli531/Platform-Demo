import { type ReactNode } from 'react';
import clsx from 'clsx';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 text-zinc-600 [&>svg]:h-12 [&>svg]:w-12">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-zinc-300">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-zinc-500">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={clsx(
            'mt-5 inline-flex items-center rounded-md border border-zinc-700/60 bg-zinc-800/60',
            'px-3.5 py-2 text-sm font-medium text-zinc-200',
            'hover:bg-zinc-700/60 transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900',
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
