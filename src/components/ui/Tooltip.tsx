'use client';

import {
  type ReactNode,
  type ReactElement,
  useState,
  useRef,
  useCallback,
  cloneElement,
  isValidElement,
} from 'react';
import clsx from 'clsx';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  position?: TooltipPosition;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-zinc-800 border-x-transparent border-b-transparent',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800 border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-zinc-800 border-y-transparent border-r-transparent',
  right:
    'right-full top-1/2 -translate-y-1/2 border-r-zinc-800 border-y-transparent border-l-transparent',
};

export function Tooltip({
  content,
  children,
  position = 'top',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 150);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  }, []);

  if (!isValidElement(children)) return children;

  return (
    <span className="relative inline-flex">
      {cloneElement(children as ReactElement<Record<string, unknown>>, {
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
      })}
      {visible && (
        <span
          role="tooltip"
          className={clsx(
            'absolute z-50 whitespace-nowrap rounded-md bg-zinc-800 px-2.5 py-1.5',
            'text-xs font-medium text-zinc-200 shadow-lg border border-zinc-700/50',
            'pointer-events-none animate-in fade-in duration-150',
            positionStyles[position],
          )}
        >
          {content}
          <span
            className={clsx(
              'absolute border-4',
              arrowStyles[position],
            )}
          />
        </span>
      )}
    </span>
  );
}
