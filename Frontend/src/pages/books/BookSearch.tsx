import { useEffect, useMemo, useRef, useState } from 'react';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useEntityCache } from '@/hooks/useEntityCache';
import { useApi } from '@/hooks/useApi';
import { homeService } from '@/services/homeService';
import { BookCard } from '@/components/book/BookCard';
import { BookCardSkeleton } from '@/components/book/BookCardSkeleton';
import { SearchFilters } from '@/components/book/search/SearchFilters';
import { ActiveFiltersBar } from '@/components/book/search/ActiveFiltersBar';
import { SortDropdown } from '@/components/book/search/SortDropdown';
import { TTL } from '@/utils/cache';
import { toPersianDigits } from '@/utils/format';
import { cn } from '@/utils/cn';
import {
  AUTHORS_CACHE_KEY,
  PUBLISHERS_CACHE_KEY,
  type Entity,
} from '@/types/search';

export default function BookSearchPage() {
  const search = useBookSearch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // دسته‌بندی‌ها برای نام‌گذاری chipها
  const { data: categories } = useApi(
    'home:categories',
    () => homeService.getCategories(),
    { ttl: TTL.home },
  );

  const categoryEntities: Entity[] = useMemo(
    () =>
      (categories ?? []).map((c) => ({
        id: c.category.categoryId,
        name: c.category.categoryName,
        image: '',
      })),
    [categories],
  );

  // ناشران و افراد انتخاب‌شده (برای persistence و نمایش chip)
  const publisherCache = useEntityCache(PUBLISHERS_CACHE_KEY);
  const authorCache = useEntityCache(AUTHORS_CACHE_KEY);

  // همگام‌سازی کش با URL
  useEffect(() => {
    publisherCache.replace(search.filters.PublisherIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.filters.PublisherIds.join(',')]);

  useEffect(() => {
    authorCache.replace(search.filters.AuthorIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.filters.AuthorIds.join(',')]);

  const publisherEntities = publisherCache.entities;
  const authorEntities = authorCache.entities;

  function handlePublishersChange(next: Entity[]) {
    publisherCache.persist(next);
    search.updateParam('PublisherIds', next.map((e) => String(e.id)));
  }

  function handleAuthorsChange(next: Entity[]) {
    authorCache.persist(next);
    search.updateParam('AuthorIds', next.map((e) => String(e.id)));
  }

  const { ref: sentinelRef, inView } = useSentinel();
  useEffect(() => {
    if (inView) void search.loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
      {/* سایدبار دسکتاپ */}
      <aside className="hidden lg:block lg:w-72 lg:shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-ink-700/70 bg-ink-900/50 p-4">
          <SearchFilters
			  filters={search.filters}
			  inputs={{
				name: search.inputs.name,
				setName: search.inputs.setName,
				isbn: search.inputs.isbn,
				setIsbn: search.inputs.setIsbn,
				fromPrice: search.inputs.fromPrice,
				setFromPrice: search.inputs.setFromPrice,
				toPrice: search.inputs.toPrice,
				setToPrice: search.inputs.setToPrice,
			  }}
			  priceError={search.priceError}
			  publisherEntities={publisherEntities}
			  authorEntities={authorEntities}
			  onToggleCategory={search.toggleCategory}
			  onPublishersChange={handlePublishersChange}
			  onAuthorsChange={handleAuthorsChange}
			  onIsExistChange={search.setIsExist}
			  onClearAll={search.clearAll}
			/>
        </div>
      </aside>

      {/* محتوا */}
      <section className="min-w-0 flex-1">
        {/* Topbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-ink-700/70 bg-ink-900/40 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-1.5 text-xs font-semibold text-ink-200 transition-colors hover:border-accent-500/50 hover:text-accent-200 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16" /></svg>
            فیلترها
            {activeFilterCount(search.filters) > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-extrabold text-ink-950 fa-num">
                {toPersianDigits(activeFilterCount(search.filters))}
              </span>
            )}
          </button>

          <p className="hidden text-xs text-ink-400 sm:block">
            {search.initialLoading
              ? 'در حال جست‌وجو…'
              : `${toPersianDigits(search.books.length)} نتیجه`}
          </p>

          <div className="ms-auto">
            <SortDropdown value={search.filters.SortBy} onChange={search.setSortBy} />
          </div>
        </div>

        {/* Chips */}
        <div className="mb-4">
          <ActiveFiltersBar
            filters={search.filters}
            categoryEntities={categoryEntities}
            publisherEntities={publisherEntities}
            authorEntities={authorEntities}
            onRemoveCategory={search.toggleCategory}
            onRemovePublisher={search.togglePublisher}
            onRemoveAuthor={search.toggleAuthor}
            onClearPrice={() => {
              search.inputs.setFromPrice('');
              search.inputs.setToPrice('');
              search.updateParam('FromPrice', null);
              search.updateParam('ToPrice', null);
            }}
            onToggleExist={() => search.setIsExist(!search.filters.IsExist)}
            onClearName={() => {
              search.inputs.setName('');
              search.updateParam('Name', null);
            }}
            onClearIsbn={() => {
              search.inputs.setIsbn('');
              search.updateParam('ISBN', null);
            }}
            onClearAll={search.clearAll}
          />
        </div>

        {/* نتایج */}
        {search.initialLoading ? (
          <Grid>
            {Array.from({ length: 10 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </Grid>
        ) : search.initialError ? (
          <ErrorBlock
            message="جست‌وجو با مشکل مواجه شد. لطفاً دوباره تلاش کنید."
            onRetry={() => window.location.reload()}
          />
        ) : search.books.length === 0 ? (
          <EmptyBlock onClear={search.clearAll} />
        ) : (
          <>
            <Grid>
              {search.books.map((book) => (
                <BookCard key={book.bookId} book={book} />
              ))}
            </Grid>

            {/* Sentinel */}
            {search.hasMore && (
              <div ref={sentinelRef} className="mt-6 flex justify-center">
                {search.loadMoreError ? (
                  <div className="text-center">
                    <p className="mb-2 text-xs text-copper-200">
                      دریافت نتایج بیشتر ناموفق بود.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        search.retryLoadMore();
                        void search.loadMore();
                      }}
                      className="rounded-lg border border-copper-500/40 px-3 py-1.5 text-xs font-semibold text-copper-200 hover:bg-copper-500/10"
                    >
                      تلاش دوباره
                    </button>
                  </div>
                ) : search.loadingMore ? (
                  <div className="flex items-center gap-2 text-xs text-ink-400">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-600 border-t-accent-400" />
                    در حال بارگذاری…
                  </div>
                ) : (
                  <span className="h-6" />
                )}
              </div>
            )}

            {!search.hasMore && search.books.length > 0 && (
              <p className="mt-6 text-center text-xs text-ink-500">
                به پایان نتایج رسیدید.
              </p>
            )}
          </>
        )}
      </section>

      {/* Drawer موبایل */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="فیلترها"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col bg-ink-950 shadow-2xl animate-fade-in">
            <header className="flex items-center justify-between border-b border-ink-800 p-4">
              <h2 className="text-sm font-bold text-ink-100">فیلترها</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="بستن"
                className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-4">
			<SearchFilters
			  filters={search.filters}
			  inputs={{
				name: search.inputs.name,
				setName: search.inputs.setName,
				isbn: search.inputs.isbn,
				setIsbn: search.inputs.setIsbn,
				fromPrice: search.inputs.fromPrice,
				setFromPrice: search.inputs.setFromPrice,
				toPrice: search.inputs.toPrice,
				setToPrice: search.inputs.setToPrice,
			  }}
			  priceError={search.priceError}
			  publisherEntities={publisherEntities}
			  authorEntities={authorEntities}
			  onToggleCategory={search.toggleCategory}
			  onPublishersChange={handlePublishersChange}
			  onAuthorsChange={handleAuthorsChange}
			  onIsExistChange={search.setIsExist}
			  onClearAll={search.clearAll}
			/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
      {children}
    </div>
  );
}

function ErrorBlock({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-copper-500/30 bg-copper-500/5 px-6 py-12 text-center">
      <p className="text-sm text-copper-200">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-copper-500/40 px-3 py-1.5 text-xs font-semibold text-copper-200 hover:bg-copper-500/10"
      >
        تلاش دوباره
      </button>
    </div>
  );
}

function EmptyBlock({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-700/70 bg-ink-900/40 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-800 text-ink-500">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-ink-100">نتیجه‌ای پیدا نشد</h3>
      <p className="max-w-sm text-sm leading-7 text-ink-400">
        کتابی با فیلترهای فعلی پیدا نشد. می‌توانید فیلترها را حذف کنید یا عبارت
        دیگری جست‌وجو کنید.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-2 rounded-xl bg-accent-500 px-4 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-accent-400"
      >
        حذف همه‌ی فیلترها
      </button>
    </div>
  );
}

function activeFilterCount(f: {
  Name: string;
  ISBN: string;
  FromPrice?: number;
  ToPrice?: number;
  IsExist: boolean;
  CategoryIds: number[];
  PublisherIds: number[];
  AuthorIds: number[];
}): number {
  return (
    (f.Name ? 1 : 0) +
    (f.ISBN ? 1 : 0) +
    (f.FromPrice || f.ToPrice ? 1 : 0) +
    (!f.IsExist ? 1 : 0) +
    f.CategoryIds.length +
    f.PublisherIds.length +
    f.AuthorIds.length
  );
}

/** IntersectionObserver روی یک sentinel. */
function useSentinel() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setInView(Boolean(entry?.isIntersecting));
      },
      { rootMargin: '400px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  void cn;
  return { ref, inView };
}
