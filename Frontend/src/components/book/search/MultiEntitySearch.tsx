import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SafeImage } from '@/components/common/SafeImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/utils/cn';
import type { Entity } from '@/types/search';

interface Props {
  label: string;
  placeholder: string;
  searchInputId: string;
  searchFn: (name: string) => Promise<Entity[]>;
  selected: Entity[];
  onChange: (next: Entity[]) => void;
  emptyHint?: string;
}

export function MultiEntitySearch({
  label,
  placeholder,
  searchInputId,
  searchFn,
  selected,
  onChange,
  emptyHint = 'نتیجه‌ای پیدا نشد.',
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const debounced = useDebounce(query.trim(), 350);
  const enabled = debounced.length >= 2;

  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);

  useEffect(() => {
    if (!enabled) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    searchFn(debounced)
      .then((items) => {
        if (cancelled) return;
        setResults(items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced, enabled, searchFn]);

  const selectedIds = useMemo(
    () => new Set(selected.map((s) => s.id)),
    [selected],
  );

  const toggle = useCallback(
    (item: Entity) => {
      if (selectedIds.has(item.id)) {
        onChange(selected.filter((s) => s.id !== item.id));
      } else {
        onChange([...selected, item]);
      }
    },
    [selected, selectedIds, onChange],
  );

  return (
    <div ref={ref} className="relative">
      <label
        htmlFor={searchInputId}
        className="mb-1.5 block text-sm font-medium text-ink-200"
      >
        {label}
      </label>

      {selected.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {selected.map((item) => (
            <li
              key={item.id}
              className="inline-flex items-center gap-1 rounded-full border border-accent-500/40 bg-accent-500/10 px-2 py-0.5 text-xs text-accent-200"
            >
              <span className="max-w-[140px] truncate">{item.name}</span>
              <button
                type="button"
                onClick={() => onChange(selected.filter((s) => s.id !== item.id))}
                aria-label={`حذف ${item.name}`}
                className="rounded-full p-0.5 text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
              >
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        id={searchInputId}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.trim().length >= 2 && setOpen(true)}
        placeholder={placeholder}
        className={cn(
          'h-9 w-full rounded-lg border border-ink-700 bg-ink-900/60 px-2.5 text-xs text-ink-50',
          'placeholder:text-ink-500 transition-colors',
          'hover:border-ink-600 focus:border-accent-500/70 focus:outline-none focus:ring-2 focus:ring-accent-500/20',
        )}
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open && enabled}
      />

      {open && enabled && (
        <div className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-64 overflow-y-auto rounded-xl border border-ink-700 bg-ink-900/98 shadow-2xl backdrop-blur-lg animate-fade-in">
          {isLoading && (
            <div className="space-y-2 p-2">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" rounded="md" />
                  <Skeleton className="h-3 flex-1" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && error && (
            <p className="p-3 text-center text-xs text-copper-200">
              دریافت نتایج ناموفق بود.
            </p>
          )}
          {!isLoading && !error && results.length === 0 && (
            <p className="p-3 text-center text-xs text-ink-400">{emptyHint}</p>
          )}
          {!isLoading && !error && results.length > 0 && (
            <ul className="py-1">
              {results.map((item) => {
                const checked = selectedIds.has(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(item)}
                      className={cn(
                        'flex w-full items-center gap-2 px-2.5 py-1.5 text-right transition-colors',
                        checked ? 'bg-accent-500/10' : 'hover:bg-ink-800',
                      )}
                    >
                      <span className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                        checked
                          ? 'border-accent-500 bg-accent-500 text-ink-950'
                          : 'border-ink-600',
                      )}>
                        {checked && (
                          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8.5l3 3 7-7" /></svg>
                        )}
                      </span>
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="h-8 w-8 shrink-0 rounded-md"
                      />
                      <span className="min-w-0 flex-1 truncate text-xs text-ink-100">
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
