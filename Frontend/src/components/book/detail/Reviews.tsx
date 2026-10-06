import { useCallback, useEffect, useRef, useState } from 'react';
import { reviewService } from '@/services/reviewService';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ReviewResponse } from '@/types/review';

const PAGE_SIZE = 7;

export function Reviews({ bookId }: { bookId: number }) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loadedPages, setLoadedPages] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialError, setInitialError] = useState<unknown>(null);
  const [loadMoreError, setLoadMoreError] = useState<unknown>(null);

  // برای جلوگیری از race condition وقتی bookId سریع تغییر می‌کنه
  const requestTokenRef = useRef(0);

  const fetchPage = useCallback(
    async (p: number) => {
      return reviewService.getBookReviews(bookId, p);
    },
    [bookId],
  );

  /** بازخوانی همه‌ی صفحاتِ بارگذاری‌شده و جایگزینی کامل لیست. */
  const refreshLoadedReviews = useCallback(async () => {
    if (loadedPages <= 0) return;
    try {
      const pages = Array.from({ length: loadedPages }, (_, i) => i + 1);
      const results = await Promise.all(pages.map((p) => fetchPage(p)));
      setReviews(results.flat());
    } catch {
      // در صورت خطا، لیست فعلی دست‌نخورده می‌مونه
    }
  }, [loadedPages, fetchPage]);

  // بارگذاری اولیه / وقتی bookId عوض می‌شه
  useEffect(() => {
    const token = ++requestTokenRef.current;

    setReviews([]);
    setLoadedPages(0);
    setHasMore(true);
    setInitialError(null);
    setLoadMoreError(null);
    setIsInitialLoading(true);

    fetchPage(1)
      .then((data) => {
        if (token !== requestTokenRef.current) return;
        setReviews(data);
        setLoadedPages(1);
        setHasMore(data.length === PAGE_SIZE);
      })
      .catch((err) => {
        if (token !== requestTokenRef.current) return;
        setInitialError(err);
      })
      .finally(() => {
        if (token !== requestTokenRef.current) return;
        setIsInitialLoading(false);
      });
  }, [bookId, fetchPage]);

  async function handleLoadMore() {
    if (isLoadingMore || !hasMore) return;
    setLoadMoreError(null);
    setIsLoadingMore(true);
    const nextPage = loadedPages + 1;
    try {
      const data = await fetchPage(nextPage);
      setReviews((prev) => [...prev, ...data]);
      setLoadedPages(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setLoadMoreError(err);
    } finally {
      setIsLoadingMore(false);
    }
  }

  /** بعد از ثبت نظر جدید: بازخوانی کامل از صفحه ۱. */
  async function handleReviewAdded() {
    const token = ++requestTokenRef.current;
    setIsInitialLoading(true);
    setInitialError(null);
    setLoadMoreError(null);
    try {
      const data = await fetchPage(1);
      if (token !== requestTokenRef.current) return;
      setReviews(data);
      setLoadedPages(1);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      if (token !== requestTokenRef.current) return;
      setInitialError(err);
    } finally {
      if (token === requestTokenRef.current) setIsInitialLoading(false);
    }
  }

  return (
    <section aria-labelledby="reviews-title">
      <h2
        id="reviews-title"
        className="mb-4 text-lg font-extrabold tracking-tight text-ink-50 sm:text-xl"
      >
        نظرات خوانندگان
      </h2>

      <div className="space-y-4">
        <ReviewForm bookId={bookId} onSuccess={handleReviewAdded} />

        {isInitialLoading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-ink-700/70 bg-ink-900/40 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Skeleton className="h-10 w-10" rounded="full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!isInitialLoading && initialError && (
          <div className="rounded-2xl border border-copper-500/30 bg-copper-500/5 px-6 py-8 text-center text-sm text-copper-200">
            دریافت نظرات با مشکل مواجه شد.
          </div>
        )}

        {!isInitialLoading && !initialError && reviews.length === 0 && (
          <div className="rounded-2xl border border-ink-700/70 bg-ink-900/40 px-6 py-10 text-center">
            <p className="text-sm text-ink-400">
              هنوز نظری برای این کتاب ثبت نشده. اولین نفر باش!
            </p>
          </div>
        )}

        {!isInitialLoading && reviews.length > 0 && (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard
                key={review.reviewId}
                review={review}
                onRefetch={refreshLoadedReviews}
              />
            ))}
          </div>
        )}

        {!isInitialLoading && hasMore && reviews.length > 0 && (
          <div className="pt-2">
            {loadMoreError && (
              <p className="mb-2 text-center text-xs text-copper-200">
                دریافت نظرات بیشتر ناموفق بود.
              </p>
            )}
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="mx-auto flex items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-sm font-semibold text-ink-200 transition-colors hover:border-accent-500/50 hover:bg-accent-500/10 hover:text-accent-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? 'در حال بارگذاری…' : 'نمایش نظرات بیشتر'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}