import { cn } from '@/utils/cn';

interface LogoProps {
  variant?: 'default' | 'light';
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ variant = 'default', showWordmark = true, className }: LogoProps) {
  const textColor = variant === 'light' ? 'text-ink-50' : 'text-ink-100';

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-2xl',
          'bg-gradient-to-br from-accent-400 via-accent-500 to-accent-700 text-ink-950',
          'shadow-brass',
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 7.5v10" />
          <path d="M4 5.5h5.5A2.5 2.5 0 0 1 12 7v10.5a1.5 1.5 0 0 0-1.5-1.5H4z" />
          <path d="M20 5.5h-5.5A2.5 2.5 0 0 0 12 7v10.5a1.5 1.5 0 0 1 1.5-1.5H20z" />
        </svg>
        <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-copper-400 ring-2 ring-ink-900" />
      </span>
      {showWordmark && (
        <span className={cn('text-xl font-bold tracking-tight', textColor)}>
          کتاب<span className="text-accent-400">‌سرا</span>
        </span>
      )}
    </span>
  );
}