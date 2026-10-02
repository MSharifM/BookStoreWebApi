import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Props {
  children: ReactNode;
  ariaLabel?: string;
  itemWidthClass?: string;
  className?: string;
}

/**
 * Horizontal scroll-snap carousel with RTL-aware prev/next buttons.
 * Mobile: swipe only. Desktop: swipe + arrow buttons.
 */
export function Carousel({
  children,
  ariaLabel = 'کاروسل',
  itemWidthClass,
  className,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isRTL = document.documentElement.dir === 'rtl';
    const scroll = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(scroll > 4);
    setCanNext(scroll < max - 4);
    // in RTL, scrollLeft is negative; abs handles both
    void isRTL;
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    const isRTL = document.documentElement.dir === 'rtl';
    const sign = isRTL ? -1 : 1;
    el.scrollBy({ left: sign * dir * amount, behavior: 'smooth' });
  };

  return (
    <div className={cn('group/carousel relative', className)}>
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        className={cn(
          'flex gap-3 overflow-x-auto scroll-smooth pb-2',
          'snap-x snap-mandatory scroll-px-1',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          itemWidthClass,
        )}
      >
        {children}
      </div>

      <ArrowButton
        side="start"
        disabled={!canPrev}
        onClick={() => scrollByDir(-1)}
        label="قبلی"
      />
      <ArrowButton
        side="end"
        disabled={!canNext}
        onClick={() => scrollByDir(1)}
        label="بعدی"
      />
    </div>
  );
}

function ArrowButton({
  side,
  disabled,
  onClick,
  label,
}: {
  side: 'start' | 'end';
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'hidden md:flex absolute top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center',
        'rounded-full border border-ink-700 bg-ink-900/90 text-ink-100 shadow-lg backdrop-blur-md',
        'opacity-0 transition-all duration-200 group-hover/carousel:opacity-100',
        'hover:bg-accent-500 hover:text-ink-950 hover:border-accent-500',
        'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        'disabled:cursor-not-allowed disabled:opacity-0',
        side === 'start' ? 'start-0 -translate-x-1/2' : 'end-0 translate-x-1/2',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {side === 'start' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}