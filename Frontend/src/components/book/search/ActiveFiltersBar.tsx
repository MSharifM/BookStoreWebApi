import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/format';
import type { ParsedFilters } from '@/hooks/useBookSearch';
import type { Entity } from '@/types/search';

interface Props {
  filters: ParsedFilters;
  categoryEntities: Entity[];
  publisherEntities: Entity[];
  authorEntities: Entity[];
  onRemoveCategory: (id: number) => void;
  onRemovePublisher: (id: number) => void;
  onRemoveAuthor: (id: number) => void;
  onClearPrice: () => void;
  onToggleExist: () => void;
  onClearName: () => void;
  onClearIsbn: () => void;
  onClearAll: () => void;
}

export function ActiveFiltersBar({
  filters,
  categoryEntities,
  publisherEntities,
  authorEntities,
  onRemoveCategory,
  onRemovePublisher,
  onRemoveAuthor,
  onClearPrice,
  onToggleExist,
  onClearName,
  onClearIsbn,
  onClearAll,
}: Props) {
  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];

  if (filters.Name)
    chips.push({ key: 'name', label: `نام: ${filters.Name}`, onRemove: onClearName });
  if (filters.ISBN)
    chips.push({ key: 'isbn', label: `شابک: ${filters.ISBN}`, onRemove: onClearIsbn });
  if (filters.FromPrice || filters.ToPrice) {
    const label = filters.FromPrice && filters.ToPrice
      ? `قیمت: ${formatPrice(filters.FromPrice)} — ${formatPrice(filters.ToPrice)}`
      : filters.FromPrice
        ? `از ${formatPrice(filters.FromPrice)}`
        : `تا ${formatPrice(filters.ToPrice!)}`;
    chips.push({ key: 'price', label, onRemove: onClearPrice });
  }
  if (!filters.IsExist) {
    chips.push({ key: 'exist', label: 'فقط ناموجودها', onRemove: onToggleExist });
  }
  for (const id of filters.CategoryIds) {
    const entity = categoryEntities.find((e) => e.id === id);
    chips.push({
      key: `cat-${id}`,
      label: `دسته: ${entity?.name ?? `#${id}`}`,
      onRemove: () => onRemoveCategory(id),
    });
  }
  for (const id of filters.PublisherIds) {
    const entity = publisherEntities.find((e) => e.id === id);
    chips.push({
      key: `pub-${id}`,
      label: `ناشر: ${entity?.name ?? `#${id}`}`,
      onRemove: () => onRemovePublisher(id),
    });
  }
  for (const id of filters.AuthorIds) {
    const entity = authorEntities.find((e) => e.id === id);
    chips.push({
      key: `auth-${id}`,
      label: `فرد: ${entity?.name ?? `#${id}`}`,
      onRemove: () => onRemoveAuthor(id),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-900/60 px-2.5 py-1 text-xs text-ink-200',
          )}
        >
          <span className="truncate max-w-[240px]">{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`حذف ${chip.label}`}
            className="rounded-full p-0.5 text-ink-400 transition-colors hover:text-copper-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="rounded-full px-2.5 py-1 text-xs font-semibold text-accent-300 transition-colors hover:text-accent-200"
      >
        پاک کردن همه
      </button>
      <Link
        to="/"
        className="ms-auto hidden text-xs text-ink-500 transition-colors hover:text-ink-300 sm:inline"
      >
        ← بازگشت به خانه
      </Link>
    </div>
  );
}
