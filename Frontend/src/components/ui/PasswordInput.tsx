import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string;
  id?: string;
  error?: string | null;
  hint?: string;
  action?: ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label, id, error, hint, className, required, action, ...rest }, ref) {
    const reactId = useId();
    const inputId = id ?? reactId;
    const [visible, setVisible] = useState(false);
    const hasError = Boolean(error);
    const describedBy = hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className="w-full">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor={inputId} className="block text-sm font-medium text-ink-200">
            {label}
            {required && (
              <span className="ms-0.5 text-accent-400" aria-hidden="true">
                *
              </span>
            )}
          </label>
          {action}
        </div>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              'block w-full rounded-xl border bg-ink-900/60 py-3 ps-3.5 pe-11 text-base text-ink-50',
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
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'پنهان‌کردن رمز عبور' : 'نمایش رمز عبور'}
            aria-pressed={visible}
            tabIndex={0}
            className={cn(
              'absolute end-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-400',
              'transition-colors hover:text-accent-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-900',
            )}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
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
  },
);

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a17.4 17.4 0 0 1-3.3 3.9" />
      <path d="M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.7-1.1" />
      <path d="M9.9 9.9A3 3 0 0 0 14.1 14.1" />
    </svg>
  );
}