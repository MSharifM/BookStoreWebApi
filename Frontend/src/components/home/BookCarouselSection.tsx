import { useApi } from '@/hooks/useApi';
import { useInView } from '@/hooks/useInView';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SectionShell } from '@/components/common/SectionShell';
import { Carousel } from '@/components/common/Carousel';
import { BookCard } from '@/components/book/BookCard';
import { BookCardSkeletonGrid } from '@/components/book/BookCardSkeleton';
import { TTL } from '@/utils/cache';
import type { BookSummaryResponse } from '@/types/home';

interface Props {
  /** Unique cache key. */
  cacheKey: string;
  /** Section title. */
  title: string;
  subtitle?: string;
  /** Service call to fetch the books. */
  fetcher: () => Promise<BookSummaryResponse[]>;
  /** Optional "see all" target. If omitted, the button is hidden. */
  seeAllHref?: string;
  /** Optional error message override. */
  errorMessage?: string;
  /** Optional icon element. */
  icon?: React.ReactNode;
}

export function BookCarouselSection({
  cacheKey,
  title,
  subtitle,
  fetcher,
  seeAllHref,
  errorMessage,
  icon,
}: Props) {
  const { ref, inView } = useInView<HTMLElement>();
  const { data, isLoading, error, refetch } = useApi(cacheKey, fetcher, {
    ttl: TTL.home,
    enabled: inView,
  });

  const books = data ?? [];

  return (
    <section ref={ref} aria-label={title} className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel={seeAllHref ? 'مشاهده همه' : undefined}
        actionTo={seeAllHref}
        icon={icon}
      />

      <SectionShell
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && books.length === 0}
        emptyMessage="کتابی برای نمایش در این بخش نیست."
        errorMessage={errorMessage ?? 'دریافت این بخش با مشکل مواجه شد.'}
        onRetry={refetch}
        skeleton={
          <div className="flex gap-3 overflow-hidden">
            <BookCardSkeletonGrid count={5} />
          </div>
        }
      >
        <Carousel ariaLabel={title}>
          {books.map((book) => (
            <div
              key={book.bookId}
              className="w-[44%] shrink-0 snap-start sm:w-[32%] md:w-[24%] lg:w-[19.2%]"
            >
              <BookCard book={book} />
            </div>
          ))}
        </Carousel>
      </SectionShell>
    </section>
  );
}