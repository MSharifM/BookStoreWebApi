import { formatRating } from '@/utils/format';
import { cn } from '@/utils/cn';

export function Rating({
  value,
  size = 'sm',
  className,
}: {
  value: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  // rate = 0 یعنی «بدون نظر» → هیچی نشون نده
  if (!value || value <= 0) return null;

  const starSize = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';
  const textSize = size === 'md' ? 'text-sm' : 'text-xs';

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={cn(starSize, 'text-accent-400')}
        aria-hidden="true"
      >
        <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9z" />
      </svg>
      <span className={cn('font-semibold text-ink-200 fa-num', textSize)}>
        {formatRating(value)}
      </span>
    </span>
  );
}