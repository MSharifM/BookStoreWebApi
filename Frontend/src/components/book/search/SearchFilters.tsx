import { useApi } from '@/hooks/useApi';
import { homeService } from '@/services/homeService';
import { bookService } from '@/services/bookService';
import { FilterSection } from './FilterSection';
import { PriceRangeInput } from './PriceRangeInput';
import { MultiEntitySearch } from './MultiEntitySearch';
import { Skeleton } from '@/components/ui/Skeleton';
import { TTL } from '@/utils/cache';
import { toPersianDigits } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Entity } from '@/types/search';
import type { ParsedFilters } from '@/hooks/useBookSearch';

interface Props {
  filters: ParsedFilters;
  inputs: {
    name: string;
    setName: (v: string) => void;
    isbn: string;
    setIsbn: (v: string) => void;
    fromPrice: string;
    setFromPrice: (v: string) => void;
    toPrice: string;
    setToPrice: (v: string) => void;
  };
  priceError: 'from' | 'to' | 'range' | null;
  publisherEntities: Entity[];
  authorEntities: Entity[];
  onToggleCategory: (id: number) => void;
  onPublishersChange: (next: Entity[]) => void;
  onAuthorsChange: (next: Entity[]) => void;
  onIsExistChange: (v: boolean) => void;
  onClearAll: () => void;
}

export function SearchFilters({
  filters,
  inputs,
  priceError,
  publisherEntities,
  authorEntities,
  onToggleCategory,
  onPublishersChange,
  onAuthorsChange,
  onIsExistChange,
  onClearAll,
}: Props) {
  const { data: categories, isLoading: catLoading, error: catError } = useApi(
    'home:categories',
    () => homeService.getCategories(),
    { ttl: TTL.home },
  );

  const publisherSearchFn = async (name: string): Promise<Entity[]> => {
    const items = await bookService.searchPublishers(name);
    return items.map((p) => ({
      id: p.publisherId,
      name: p.publisherName,
      image: p.publisherImage,
    }));
  };

  const authorSearchFn = async (name: string): Promise<Entity[]> => {
    const items = await bookService.searchAuthors(name);
    return items.map((a) => ({
      id: a.authorId,
      name: a.authorName,
      image: a.imageName,
    }));
  };

  return (
    <div className="space-y-1">
      {/* جست‌وجوی متنی */}
      <FilterSection title="جست‌وجوی متنی">
        <div className="space-y-2">
          <TextField
            id="filter-name"
            label="نام کتاب"
            value={inputs.name}
            onChange={inputs.setName}
            placeholder="مثلاً: صد سال تنهایی"
          />
          <TextField
            id="filter-isbn"
            label="شابک"
            value={inputs.isbn}
            onChange={inputs.setIsbn}
            placeholder="978-..."
            dir="ltr"
          />
        </div>
      </FilterSection>

      {/* دسته‌بندی‌ها */}
      <FilterSection title="دسته‌بندی‌ها" badge={filters.CategoryIds.length || undefined}>
        {catLoading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-3/4" />)}
          </div>
        ) : catError ? (
          <p className="text-xs text-copper-200">دریافت دسته‌بندی‌ها ناموفق بود.</p>
        ) : (
          <div className="max-h-56 space-y-1 overflow-y-auto pe-1">
            {categories?.map((item) => {
              const checked = filters.CategoryIds.includes(item.category.categoryId);
              return (
                <CheckRow
                  key={item.category.categoryId}
                  id={`cat-${item.category.categoryId}`}
                  label={item.category.categoryName}
                  hint={`${toPersianDigits(item.countBooks)} کتاب`}
                  checked={checked}
                  onChange={() => onToggleCategory(item.category.categoryId)}
                />
              );
            })}
          </div>
        )}
      </FilterSection>

      {/* قیمت */}
      <FilterSection
        title="محدوده‌ی قیمت"
        badge={filters.FromPrice || filters.ToPrice ? 1 : undefined}
      >
        <PriceRangeInput
          fromValue={inputs.fromPrice}
          toValue={inputs.toPrice}
          onFromChange={inputs.setFromPrice}
          onToChange={inputs.setToPrice}
          error={priceError}
        />
      </FilterSection>

      {/* موجودی */}
      <FilterSection title="موجودی">
        <CheckRow
          id="filter-isexist"
          label="فقط کتاب‌های موجود"
          checked={filters.IsExist}
          onChange={() => onIsExistChange(!filters.IsExist)}
        />
      </FilterSection>

      {/* ناشران */}
      <FilterSection title="ناشران" badge={publisherEntities.length || undefined}>
        <MultiEntitySearch
          label=""
          searchInputId="filter-publishers-search"
          placeholder="جست‌وجوی ناشر…"
          searchFn={publisherSearchFn}
          selected={publisherEntities}
          onChange={onPublishersChange}
          emptyHint="ناشری پیدا نشد."
        />
      </FilterSection>

      {/* افراد */}
      <FilterSection
        title="نویسنده، مترجم یا ویراستار"
        badge={authorEntities.length || undefined}
      >
        <MultiEntitySearch
          label=""
          searchInputId="filter-authors-search"
          placeholder="نام فرد را وارد کنید…"
          searchFn={authorSearchFn}
          selected={authorEntities}
          onChange={onAuthorsChange}
          emptyHint="فردی پیدا نشد."
        />
      </FilterSection>

      <div className="pt-3">
        <button
          type="button"
          onClick={onClearAll}
          className="w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3 py-2 text-xs font-semibold text-ink-200 transition-colors hover:border-copper-500/40 hover:bg-copper-500/10 hover:text-copper-200"
        >
          حذف همه‌ی فیلترها
        </button>
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  dir = 'rtl',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dir?: 'rtl' | 'ltr';
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-ink-300">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className={cn(
          'h-9 w-full rounded-lg border border-ink-700 bg-ink-900/60 px-2.5 text-xs text-ink-50',
          'placeholder:text-ink-500 transition-colors',
          'hover:border-ink-600 focus:border-accent-500/70 focus:outline-none focus:ring-2 focus:ring-accent-500/20',
        )}
      />
    </div>
  );
}

function CheckRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 text-xs transition-colors',
        checked ? 'bg-accent-500/10 text-accent-200' : 'text-ink-300 hover:bg-ink-800/50',
      )}
    >
      <span className="relative inline-flex h-4 w-4 shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className={cn(
            'peer h-4 w-4 cursor-pointer appearance-none rounded border border-ink-600 bg-ink-900/60',
            'transition-all',
            'checked:border-accent-500 checked:bg-accent-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
          )}
        />
        <svg viewBox="0 0 16 16" className="pointer-events-none absolute inset-0 m-auto h-2.5 w-2.5 scale-75 text-ink-950 opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" />
        </svg>
      </span>
      <span className="flex-1 truncate">{label}</span>
      {hint && <span className="shrink-0 text-[10px] text-ink-500 fa-num">{hint}</span>}
    </label>
  );
}
