import { Link, useParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { bookService } from '@/services/bookService';
import { BookGallery } from '@/components/book/detail/BookGallery';
import { BookMainInfo } from '@/components/book/detail/BookMainInfo';
import { BookPurchasePanel } from '@/components/book/detail/BookPurchasePanel';
import { FavoriteButton } from '@/components/book/detail/FavoriteButton';
import { BookSpecifications } from '@/components/book/detail/BookSpecifications';
import { BookDescription } from '@/components/book/detail/BookDescription';
import { SimilarBooks } from '@/components/book/detail/SimilarBooks';
import { Reviews } from '@/components/book/detail/Reviews';
import { BookDetailSkeleton } from '@/components/book/detail/BookDetailSkeleton';

export default function BookDetailPage() {
  const { bookId: bookIdParam } = useParams<{ bookId: string }>();
  const bookId = Number(bookIdParam);
  const isValidId = Number.isFinite(bookId) && bookId > 0;

  const { data: book, isLoading, error, refetch } = useApi(
    isValidId ? `book:${bookId}` : null,
    () => bookService.getBookDetail(bookId),
    { enabled: isValidId },
  );

  if (!isValidId) return <NotFoundState />;
  if (isLoading) return <BookDetailSkeleton />;
  if (error) {
    if (isNotFoundError(error)) return <NotFoundState />;
    return <ErrorState onRetry={refetch} />;
  }
  if (!book) return <NotFoundState />;

  return (
    <article className="space-y-10">
      <nav aria-label="مسیر" className="text-xs text-ink-500">
        <Link to="/" className="transition-colors hover:text-accent-300">خانه</Link>
        <span className="mx-1.5" aria-hidden="true">/</span>
        <Link to="/books" className="transition-colors hover:text-accent-300">کتاب‌ها</Link>
        <span className="mx-1.5" aria-hidden="true">/</span>
        <span className="text-ink-400">{book.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-8">
        <BookGallery images={book.bookImages ?? []} name={book.name} />

        <div className="space-y-6">
          <BookMainInfo book={book} />

          <div className="flex items-stretch gap-2">
            <div className="flex-1">
              <BookPurchasePanel bookId={bookId} book={book} />
            </div>
            <div className="hidden lg:block">
              <FavoriteButton bookId={bookId} />
            </div>
          </div>

          <div className="lg:hidden">
            <FavoriteButton bookId={bookId} />
          </div>
        </div>
      </div>

      <BookSpecifications book={book} />
      <BookDescription description={book.description} />
      <SimilarBooks bookId={bookId} />
      <Reviews bookId={bookId} />
    </article>
  );
}

function isNotFoundError(err: unknown): boolean {
  if (typeof err !== 'object' || err === null) return false;
  const axiosErr = err as { response?: { status?: number } };
  return axiosErr.response?.status === 404;
}

function NotFoundState() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-ink-800/70 text-ink-400">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 5h5.5A2.5 2.5 0 0 1 12 7.5V19a1.5 1.5 0 0 0-1.5-1.5H4z" />
          <path d="M20 5h-5.5A2.5 2.5 0 0 0 12 7.5V19a1.5 1.5 0 0 1 1.5-1.5H20z" />
          <path d="M3 3l18 18" />
        </svg>
      </div>
      <h1 className="text-xl font-extrabold text-ink-50">کتاب پیدا نشد</h1>
      <p className="mt-3 text-sm leading-7 text-ink-400">
        کتابی که دنبالش هستید وجود ندارد یا حذف شده است.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-accent-500 px-4 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-accent-400"
      >
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-xl font-extrabold text-ink-50">خطا در دریافت اطلاعات</h1>
      <p className="mt-3 text-sm leading-7 text-ink-400">
        متأسفانه نتوانستیم اطلاعات کتاب را دریافت کنیم. لطفاً دوباره تلاش کنید.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex rounded-xl bg-accent-500 px-4 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-accent-400"
      >
        تلاش دوباره
      </button>
    </div>
  );
}
