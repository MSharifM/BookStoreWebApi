import { BookSortBy } from '@/types/home';
import { cn } from '@/utils/cn';

const OPTIONS: Array<{ value: BookSortBy; label: string }> = [
  { value: BookSortBy.Newest, label: 'جدیدترین' },
  { value: BookSortBy.Cheapest, label: 'ارزان‌ترین' },
  { value: BookSortBy.MostExpensive, label: 'گران‌ترین' },
  { value: BookSortBy.Popular, label: 'محبوب‌ترین' },
  { value: BookSortBy.BestSelling, label: 'پرفروش‌ترین' },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value: BookSortBy;
  onChange: (v: BookSortBy) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-by" className="text-xs text-ink-400 whitespace-nowrap">
        ترتیب:
      </label>
      <select
        id="sort-by"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as BookSortBy)}
        className={cn(
          'h-9 cursor-pointer rounded-lg border border-ink-700 bg-ink-900/60 ps-3 pe-8 text-xs font-medium text-ink-100',
          'transition-colors hover:border-ink-600 focus:border-accent-500/70 focus:outline-none focus:ring-2 focus:ring-accent-500/20',
        )}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-ink-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
