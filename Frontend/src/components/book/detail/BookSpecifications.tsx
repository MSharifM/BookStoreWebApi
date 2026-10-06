import type { BookDetailResponse } from '@/types/book';
import { toPersianDigits } from '@/utils/format';

export function BookSpecifications({ book }: { book: BookDetailResponse }) {
  const specs: Array<{ label: string; value: string }> = [
    { label: 'سال انتشار', value: toPersianDigits(book.publicationYear) },
    { label: 'شابک', value: book.isbn },
    { label: 'تعداد صفحات', value: toPersianDigits(book.countPages) },
    { label: 'زبان', value: book.language },
    { label: 'وزن', value: `${toPersianDigits(book.weightGram)} گرم` },
    { label: 'ناشر', value: book.publisherName },
  ].filter((s) => s.value && s.value.trim() !== '');

  if (specs.length === 0) return null;

  return (
    <section aria-labelledby="specs-title">
      <h2
        id="specs-title"
        className="mb-4 text-lg font-extrabold tracking-tight text-ink-50 sm:text-xl"
      >
        مشخصات کتاب
      </h2>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-2xl border border-ink-700/70 bg-ink-900/40 p-5 sm:grid-cols-2">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-3 border-b border-ink-800/60 pb-3 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <dt className="text-xs text-ink-500">{spec.label}</dt>
            <dd className="text-sm font-medium text-ink-100 fa-num">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
