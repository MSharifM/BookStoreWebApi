import { Link } from 'react-router-dom';
import { Rating } from '@/components/ui/Rating';
import { SafeImage } from '@/components/common/SafeImage';
import { formatPrice } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { BookSummaryResponse } from '@/types/home';

interface Props {
  book: BookSummaryResponse;
  /** Optional override for future discount support. */
  className?: string;
}

export function BookCard({ book, className }: Props) {
  const isOutOfStock = book.stockQuantity <= 0;

  return (
    <Link
      to={`/books/${book.bookId}`}
      aria-label={book.name}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900/50',
        'transition-all duration-200 ease-out',
        'hover:-translate-y-0.5 hover:border-accent-500/40 hover:bg-ink-900 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950',
        className,
      )}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-ink-800">
        <SafeImage
          src={book.bookImage}
          alt={book.name}
          className="h-full w-full"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink-950/70 backdrop-blur-[2px]">
            <span className="rounded-full border border-copper-500/40 bg-copper-500/20 px-3 py-1 text-xs font-bold text-copper-200">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-6 text-ink-50 transition-colors group-hover:text-accent-200">
          {book.name}
        </h3>
        <p className="line-clamp-1 text-xs text-ink-400">{book.authorNames}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Rating value={book.rate} />
          <span className="text-[11px] text-ink-500 fa-num">
            {book.publicationYear}
          </span>
        </div>

        <div className="mt-1 border-t border-ink-800 pt-2">
          <p className={cn('text-sm font-extrabold', isOutOfStock ? 'text-ink-500' : 'text-accent-300')}>
            <span className="fa-num">{formatPrice(book.price)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}