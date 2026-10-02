import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Props {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  skeleton: ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
  className?: string;
}

export function SectionShell({
  isLoading,
  error,
  isEmpty,
  skeleton,
  emptyMessage = 'فعلاً چیزی برای نمایش نیست.',
  errorMessage = 'دریافت اطلاعات با مشکل مواجه شد.',
  onRetry,
  children,
  className,
}: Props) {
  if (isLoading) {
    return <div className={cn('animate-fade-in', className)}>{skeleton}</div>;
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl border border-copper-500/30 bg-copper-500/5 px-6 py-10 text-center',
          className,
        )}
      >
        <p className="text-sm text-copper-200">{errorMessage}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-copper-500/40 px-3 py-1.5 text-xs font-semibold text-copper-200 transition-colors hover:bg-copper-500/10"
          >
            تلاش دوباره
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl border border-ink-700/60 bg-ink-900/40 px-6 py-10 text-center text-sm text-ink-400',
          className,
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  return <>{children}</>;
}