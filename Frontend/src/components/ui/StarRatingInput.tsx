import { cn } from '@/utils/cn';

interface Props {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
}

export function StarRatingInput({ value, onChange, disabled, label = 'امتیاز' }: Props) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-200">{label}</span>
      <div role="radiogroup" aria-label={label} className="inline-flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === value}
              aria-label={`${star} ستاره`}
              onClick={() => onChange(star)}
              disabled={disabled}
              className={cn(
                'rounded-md p-0.5 transition-transform',
                'hover:scale-110 active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100',
              )}
            >
              <svg
                viewBox="0 0 20 20"
                className={cn('h-6 w-6 transition-colors', active ? 'text-accent-400' : 'text-ink-700')}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 15l-5.3 2.6 1-5.8L1.5 7.7l5.9-.9z" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
