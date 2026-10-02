import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionTo,
  icon,
}: Props) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-ink-50 sm:text-2xl">
          {icon && <span className="text-accent-400">{icon}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs leading-6 text-ink-400 sm:text-sm">{subtitle}</p>
        )}
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-accent-300 transition-colors hover:bg-accent-500/10 hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
        >
          {actionLabel}
          <span className="ms-1" aria-hidden="true">←</span>
        </Link>
      )}
    </div>
  );
}