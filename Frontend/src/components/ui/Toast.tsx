import type { ToastItem } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

const ICONS: Record<ToastItem['type'], JSX.Element> = {
  success: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M6.5 10.5l2.5 2.5 4.5-5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 6v5M10 14h.01" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M10 3l8 14H2L10 3Z" />
      <path d="M10 8v4M10 15h.01" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 9v5M10 6h.01" />
    </svg>
  ),
};

const STYLES: Record<ToastItem['type'], string> = {
  success: 'border-moss-500/40 bg-moss-500/10 text-moss-200',
  error: 'border-copper-500/40 bg-copper-500/10 text-copper-200',
  warning: 'border-accent-500/40 bg-accent-500/10 text-accent-200',
  info: 'border-ink-600/60 bg-ink-800/80 text-ink-200',
};

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex w-full items-start gap-2.5 rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-lg',
        'animate-fade-up',
        STYLES[toast.type],
      )}
    >
      <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
      <p className="flex-1 text-sm leading-6">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="بستن"
        className="shrink-0 rounded-md p-1 text-current opacity-60 transition-opacity hover:opacity-100"
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
    </div>
  );
}
