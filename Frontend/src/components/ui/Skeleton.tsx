import { cn } from '@/utils/cn';

export function Skeleton({
  className,
  rounded = 'md',
}: {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}) {
  const roundedClass = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[rounded];

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-ink-800/60',
        roundedClass,
        'after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_1.6s_infinite]',
        "after:bg-gradient-to-r after:from-transparent after:via-ink-700/40 after:to-transparent",
        className,
      )}
    />
  );
}