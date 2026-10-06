import { Link } from 'react-router-dom';
import { Stars } from '@/components/ui/Stars';
import type { AuthorDto, BookDetailResponse } from '@/types/book';

export function BookMainInfo({ book }: { book: BookDetailResponse }) {
  const writers = book.writers?.filter((w) => w?.name) ?? [];
  const editors = book.editors?.filter((e) => e?.name) ?? [];
  const translators = book.translators?.filter((t) => t?.name) ?? [];
  const categories = book.category?.filter(Boolean) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold leading-[1.5] text-ink-50 sm:text-3xl">
        {book.name}
      </h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Stars value={book.rate} size="md" showValue />
        <span className="text-xs text-ink-500 fa-num">
          سال انتشار: {book.publicationYear}
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {writers.length > 0 && (
          <InfoRow label="نویسنده">
            <AuthorLinks authors={writers} paramKey="WriterIds" />
          </InfoRow>
        )}

        {translators.length > 0 && (
          <InfoRow label="مترجم">
            <AuthorLinks authors={translators} paramKey="TranslatorIds" />
          </InfoRow>
        )}

        {editors.length > 0 && (
          <InfoRow label="ویراستار">
            <AuthorLinks authors={editors} paramKey="EditorIds" />
          </InfoRow>
        )}

        <InfoRow label="ناشر">
          <Link
            to={`/books?PublisherIds=${book.publisherId}`}
            className="rounded font-medium text-accent-300 underline-offset-4 transition-colors hover:text-accent-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            {book.publisherName}
          </Link>
        </InfoRow>

        {book.isbn && <InfoRow label="شابک">{book.isbn}</InfoRow>}
      </dl>

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-ink-400">دسته‌بندی:</span>
          {categories.map((cat) => (
            <Link
              key={cat.categoryId}
              to={`/books?CategoryIds=${cat.categoryId}`}
              className="rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 text-xs text-ink-200 transition-colors hover:border-accent-500/50 hover:bg-accent-500/10 hover:text-accent-200"
            >
              {cat.categoryName}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/** رندر لیست نویسنده/مترجم/ویراستار به‌صورت لینک‌های تکی. */
function AuthorLinks({
  authors,
  paramKey,
}: {
  authors: AuthorDto[];
  paramKey: 'WriterIds' | 'EditorIds' | 'TranslatorIds';
}) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1 gap-y-0.5">
      {authors.map((author, i) => (
        <span key={author.id} className="inline-flex items-baseline">
          <Link
            to={`/books?${paramKey}=${author.id}`}
            className="rounded font-medium text-accent-300 underline-offset-4 transition-colors hover:text-accent-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            {author.name}
          </Link>
          {i < authors.length - 1 && (
            <span className="text-ink-500" aria-hidden="true">
              ،
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <dt className="shrink-0 text-xs text-ink-500">{label}:</dt>
      <dd className="min-w-0 text-sm font-medium text-ink-200">{children}</dd>
    </div>
  );
}