import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { bookService } from '@/services/bookService';
import { Carousel } from '@/components/common/Carousel';
import { BookCard } from '@/components/book/BookCard';
import { BookCardSkeletonGrid } from '@/components/book/BookCardSkeleton';
import { SectionHeader } from '@/components/common/SectionHeader';
import { TTL } from '@/utils/cache';
import type { BookSummaryResponse } from '@/types/home';

export function SimilarBooks({ bookId }: { bookId: number }) {
  const { data, isLoading, error, refetch } = useApi(
    `similar:${bookId}`,
    () => bookService.getSimilarBooks(bookId),
    { ttl: TTL.home },
  );

  const similar: BookSummaryResponse[] = (data ?? []).filter(
    (b) => b.bookId !== bookId,
  );

  if (!isLoading && !error && similar.length === 0) return null;

  return (
    <section aria-labelledby="similar-title">
      <SectionHeader title="کتاب‌های مشابه" subtitle="شاید این‌ها را هم دوست داشته باشی" />

      {isLoading ? (
        <div className="flex gap-3 overflow-hidden">
          <BookCardSkeletonGrid count={5} />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-copper-500/30 bg-copper-500/5 px-6 py-8 text-center">
          <p className="text-sm text-copper-200">دریافت کتاب‌های مشابه با مشکل مواجه شد.</p>
          <button
            type="button"
            onClick={refetch}
            className="rounded-lg border border-copper-500/40 px-3 py-1.5 text-xs font-semibold text-copper-200 hover:bg-copper-500/10"
          >
            تلاش دوباره
          </button>
        </div>
      ) : (
        <Carousel ariaLabel="کتاب‌های مشابه">
          {similar.map((book) => (
            <div key={book.bookId} className="w-[44%] shrink-0 snap-start sm:w-[32%] md:w-[24%] lg:w-[19.2%]">
              <BookCard book={book} />
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
}
