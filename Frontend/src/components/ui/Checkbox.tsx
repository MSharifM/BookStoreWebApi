import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string;
  id?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, className, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'inline-flex cursor-pointer select-none items-center gap-2 text-sm text-ink-300',
        'transition-colors hover:text-ink-200',
        className,
      )}
    >
      <span className="relative inline-flex h-4 w-4 shrink-0">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            'peer h-4 w-4 cursor-pointer appearance-none rounded-md border border-ink-600 bg-ink-900/60',
            'transition-all duration-150',
            'checked:border-accent-500 checked:bg-accent-500',
            'hover:border-ink-500 checked:hover:border-accent-400 checked:hover:bg-accent-400',
            'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/25',
          )}
          {...rest}
        />
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none absolute inset-0 m-auto h-3 w-3 scale-75 text-ink-950 opacity-0 transition-all duration-150 peer-checked:scale-100 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
});