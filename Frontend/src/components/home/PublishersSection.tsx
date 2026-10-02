import { Link } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { useInView } from '@/hooks/useInView';
import { homeService } from '@/services/homeService';
import { SectionHeader } from '@/components/common/SectionHeader';
import { SectionShell } from '@/components/common/SectionShell';
import { SafeImage } from '@/components/common/SafeImage';
import { Skeleton } from '@/components/ui/Skeleton';
import { TTL } from '@/utils/cache';

export function PublishersSection() {
  const { ref, inView } = useInView<HTMLElement>();
  const { data, isLoading, error, refetch } = useApi(
    'home:publishers',
    () => homeService.getBestSellingPublishers(),
    { ttl: TTL.home, enabled: inView },
  );

  const publishers = data ?? [];

  return (
    <section ref={ref} aria-label="ناشران برتر" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <SectionHeader
        title="ناشران برتر"
        subtitle="انتشاراتی‌هایی که بیشترین اعتماد را به دست آورده‌اند"
      />

      <SectionShell
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && publishers.length === 0}
        emptyMessage="ناشری برای نمایش نیست."
        errorMessage="دریافت ناشران برتر با مشکل مواجه شد."
        onRetry={refetch}
        skeleton={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" rounded="2xl" />
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {publishers.map((p) => (
            <Link
              key={p.publisherId}
              to={`/books?PublisherId=${p.publisherId}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-700/70 bg-ink-900/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500/40 hover:bg-ink-900"
            >
              <SafeImage
                src={p.publisherImage}
                alt={p.publisherName}
                className="h-20 w-20 rounded-full border border-ink-700/60 bg-ink-800"
                imgClassName="object-contain p-2"
              />
              <p className="line-clamp-2 text-center text-xs font-bold text-ink-100 transition-colors group-hover:text-accent-200">
                {p.publisherName}
              </p>
            </Link>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}