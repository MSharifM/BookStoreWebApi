import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'error' | 'warning' | 'info' | 'success';

export interface AlertProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  role?: 'alert' | 'status';
}

const styles: Record<Variant, string> = {
  error: 'border-copper-500/40 bg-copper-500/10 text-copper-200',
  warning: 'border-accent-500/40 bg-accent-500/10 text-accent-100',
  info: 'border-ink-600/60 bg-ink-800/60 text-ink-200',
  success: 'border-moss-500/40 bg-moss-500/10 text-moss-200',
};

const icons: Record<Variant, ReactNode> = {
  error: (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 6v5" />
      <circle cx="10" cy="14" r="0.5" fill="currentColor" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10 3l8 14H2L10 3Z" />
      <path d="M10 8v4" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5" />
      <circle cx="10" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" />
    </svg>
  ),
};

export function Alert({ variant = 'error', children, className, role = 'alert' }: AlertProps) {
  return (
    <div
      role={role}
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm animate-fade-in',
        styles[variant],
        className,
      )}
    >
      <span className="mt-0.5">{icons[variant]}</span>
      <div className="flex-1 leading-7">{children}</div>
    </div>
  );
}