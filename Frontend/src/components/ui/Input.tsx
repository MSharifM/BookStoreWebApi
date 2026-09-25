import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  id?: string;
  error?: string | null;
  hint?: string;
  dir?: 'ltr' | 'rtl' | 'auto';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, error, hint, className, required, dir, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const hasError = Boolean(error);
  const describedBy = hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-200">
        {label}
        {required && (
          <span className="ms-0.5 text-accent-400" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        ref={ref}
        id={inputId}
        required={required}
        dir={dir}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={cn(
          'block w-full rounded-xl border bg-ink-900/60 px-3.5 py-3 text-base text-ink-50',
          'placeholder:text-ink-500',
          'transition-[border-color,box-shadow,background-color] duration-150 ease-out',
          'focus:outline-none focus:ring-4',
          hasError
            ? 'border-copper-500/70 focus:border-copper-400 focus:ring-copper-500/20'
            : 'border-ink-700 hover:border-ink-600 focus:border-accent-500/70 focus:bg-ink-900 focus:ring-accent-500/15',
          'disabled:cursor-not-allowed disabled:bg-ink-900/40 disabled:text-ink-500',
          className,
        )}
        {...rest}
      />
      {hasError ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-1.5 animate-fade-in text-xs font-medium text-copper-300"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});