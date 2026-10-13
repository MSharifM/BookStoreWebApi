import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}

export function FilterSection({ title, children, defaultOpen = true, badge }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink-800/60 py-3 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-sm font-bold text-ink-100 transition-colors hover:text-accent-200"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge ? (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-extrabold text-ink-950 fa-num">
              {badge}
            </span>
          ) : null}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}
