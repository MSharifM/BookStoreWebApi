import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDebounce } from '@/hooks/useDebounce';
import { bookService } from '@/services/bookService';
import { SafeImage } from '@/components/common/SafeImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice } from '@/utils/format';
import { TTL } from '@/utils/cache';
import { cn } from '@/utils/cn';

export function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query.trim(), 350);
  const enabled = debounced.length >= 2;

  const { data, isLoading, error } = useApi(
    enabled ? `search:${debounced}` : null,
    () => bookService.searchByName(debounced),
    { ttl: TTL.search, enabled },
  );

  const results = data ?? [];
  const showDropdown = open && enabled;

  const outsideRef = useClickOutside<HTMLDivElement>(() => setOpen(false), showDropdown);

  useEffect(() => {
    if (enabled) setOpen(true);
  }, [enabled, debounced]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/books?Name=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  return (
    <div ref={outsideRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="header-search" className="sr-only">
          جست‌وجوی کتاب
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-ink-500"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </span>
          <input
            id="header-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => enabled && setOpen(true)}
            placeholder="جست‌وجوی کتاب، نویسنده یا ناشر…"
            className={cn(
              'h-10 w-full rounded-xl border border-ink-700/80 bg-ink-900/60 ps-9 pe-3 text-sm text-ink-50',
              'placeholder:text-ink-500 transition-colors',
              'hover:border-ink-600 focus:border-accent-500/70 focus:bg-ink-900 focus:outline-none focus:ring-4 focus:ring-accent-500/15',
            )}
            aria-autocomplete="list"
            aria-controls="search-suggestions"
            aria-expanded={showDropdown}
          />
        </div>
      </form>

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className={cn(
            'absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur-lg',
            'animate-fade-in',
          )}
        >
          {isLoading && (
            <div className="space-y-2 p-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-10" rounded="md" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="p-4 text-center text-xs text-copper-200">
              جست‌وجو با مشکل مواجه شد.
            </div>
          )}

          {!isLoading && !error && results.length === 0 && (
            <div className="p-6 text-center text-sm text-ink-400">
              نتیجه‌ای پیدا نشد.
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <>
              <ul className="max-h-80 overflow-y-auto py-1">
                {results.slice(0, 6).map((item) => (
                  <li key={item.bookId}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        navigate(`/books/${item.bookId}`);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-right transition-colors hover:bg-ink-800"
                    >
                      <SafeImage
                        src={item.imagePath}
                        alt={item.bookName}
                        className="h-14 w-10 shrink-0 rounded-md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-100">
                          {item.bookName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-400">
                          {item.publisherName}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-bold text-accent-300 fa-num">
                        {formatPrice(item.price)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => {
                  navigate(`/books?Name=${encodeURIComponent(debounced)}`);
                  setOpen(false);
                }}
                className="block w-full border-t border-ink-800 bg-ink-900/60 px-3 py-2.5 text-center text-xs font-semibold text-accent-300 transition-colors hover:bg-accent-500/10 hover:text-accent-200"
              >
                مشاهده‌ی همه‌ی نتایج
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}