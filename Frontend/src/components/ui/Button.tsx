import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/30 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 ' +
  'active:scale-[0.985]';

const variants: Record<Variant, string> = {
  // دکمه‌ی برنجی با متن تیره — کنتراست بالا روی پس‌زمینه‌ی دارک
  primary:
    'bg-accent-500 text-ink-950 hover:bg-accent-400 shadow-brass hover:-translate-y-0.5 hover:shadow-[0_8px_28px_-6px_rgba(209,164,71,0.5)]',
  secondary:
    'bg-ink-800 text-ink-100 border border-ink-700 hover:border-ink-600 hover:bg-ink-700',
  ghost: 'text-ink-200 hover:bg-ink-800',
};

const sizes: Record<Size, string> = {
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {isLoading && <Spinner />}
      <span>{children}</span>
    </button>
  );
});