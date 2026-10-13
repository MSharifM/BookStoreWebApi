import { cn } from '@/utils/cn';
import { toPersianDigits } from '@/utils/format';

interface Props {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

const SIZES: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const TEXT: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function Stars({ value, size = 'md', showValue = false, className }: Props) {
  if (!value || value <= 0) return null;
  const safe = Math.max(0, Math.min(5, value));

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, safe - i));
          return <StarIcon key={i} fill={fill} className={SIZES[size]} />;
        })}
      </span>
      {showValue && (
        <span className={cn('font-bold text-ink-200 fa-num', TEXT[size])}>
          {toPersianDigits(safe.toFixed(1))}
        </span>
      )}
      <span className="sr-only">امتیاز {toPersianDigits(safe.toFixed(1))} از ۵</span>
    </span>
  );
}

function StarIcon({ fill, className }: { fill: number; className: string }) {
  return (
    <span className={cn('relative inline-block shrink-0', className)}>
      <svg viewBox="0 0 20 20" className={cn('absolute inset-0 text-ink-700')} fill="currentColor">
        <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9z" />
      </svg>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${fill * 100}%` }}
      >
        <svg viewBox="0 0 20 20" className={cn('h-full w-full text-accent-400')} fill="currentColor">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      </span>
    </span>
  );
}
