import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useInView } from '@/hooks/useInView';
import { homeService } from '@/services/homeService';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SectionShell } from '@/components/common/SectionShell';
import { Skeleton } from '@/components/ui/Skeleton';
import { TTL } from '@/utils/cache';
import { formatNumber } from '@/utils/format';

export function CategoriesSection() {
  const { ref, inView } = useInView<HTMLElement>();

  const { data, isLoading, error, refetch } = useApi(
    'home:categories',
    () => homeService.getCategories(),
    { ttl: TTL.home, enabled: inView },
  );

  const categories = data ?? [];

  return (
    <section ref={ref} aria-label="دسته‌بندی‌ها" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader
        title="دسته‌بندی‌ها"
        subtitle="کتاب‌ها را بر اساس علاقه‌ی خود مرور کن"
      />

      <SectionShell
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && categories.length === 0}
        emptyMessage="دسته‌بندی‌ای برای نمایش نیست."
        errorMessage="دریافت دسته‌بندی‌ها با مشکل مواجه شد."
        onRetry={refetch}
        skeleton={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" rounded="2xl" />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((item) => (
            <Link
              key={item.category.categoryId}
              to={`/books?CategoryIds=${item.category.categoryId}`}
              className="group relative overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500/40 hover:bg-ink-900"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300 transition-colors group-hover:bg-accent-500 group-hover:text-ink-950">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 5h5.5A2.5 2.5 0 0 1 12 7.5V19a1.5 1.5 0 0 0-1.5-1.5H4z" />
                  <path d="M20 5h-5.5A2.5 2.5 0 0 0 12 7.5V19a1.5 1.5 0 0 1 1.5-1.5H20z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-ink-100 transition-colors group-hover:text-accent-200">
                {item.category.categoryName}
              </p>
              <p className="mt-1 text-[11px] text-ink-500 fa-num">
                {formatNumber(item.countBooks)} کتاب
              </p>
            </Link>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}