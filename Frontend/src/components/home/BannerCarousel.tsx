import { useEffect, useRef, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { homeService } from '@/services/homeService';
import { resolveImageUrl } from '@/utils/image';
import { Skeleton } from '@/components/ui/Skeleton';
import { SectionShell } from '@/components/common/SectionShell';
import { TTL } from '@/utils/cache';
import { cn } from '@/utils/cn';

const AUTOPLAY_MS = 6000;

export function BannerCarousel() {
  const { data, isLoading, error, refetch } = useApi(
    'home:banners',
    () => homeService.getBanners(),
    { ttl: TTL.banner },
  );

  const banners = data ?? [];
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (banners.length <= 1 || isHovering) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [banners.length, isHovering]);

  const goTo = (i: number) => setIndex(((i % banners.length) + banners.length) % banners.length);

  return (
    <section aria-label="بنرها" className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6">
      <SectionShell
        isLoading={isLoading}
        error={error}
        isEmpty={!isLoading && banners.length === 0}
        emptyMessage="فعلاً بنری برای نمایش وجود ندارد."
        errorMessage="دریافت بنرها با مشکل مواجه شد."
        onRetry={refetch}
        skeleton={<Skeleton className="aspect-[16/6] w-full sm:aspect-[16/5] lg:aspect-[16/4]" rounded="2xl" />}
      >
        {banners.length > 0 && (
          <div
            className="group relative overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-900"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(delta) > 40) goTo(index + (delta > 0 ? -1 : 1));
              touchStartX.current = null;
            }}
          >
            <div className="relative aspect-[16/6] w-full sm:aspect-[16/5] lg:aspect-[16/4]">
              {banners.map((banner, i) => (
                <a
                  key={`${banner.imageName}-${i}`}
                  href={banner.url}
                  className={cn(
                    'absolute inset-0 block transition-opacity duration-500',
                    i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
                  )}
                  aria-hidden={i !== index}
                  tabIndex={i === index ? 0 : -1}
                >
                  <img
                    src={resolveImageUrl(banner.imageName)}
                    alt={`بنر ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="h-full w-full object-cover"
                  />
                  {/* گرادیان تیره برای خوانایی */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent" />
                </a>
              ))}
            </div>

            {banners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="بنر قبلی"
                  className="absolute start-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-700/60 bg-ink-950/60 text-ink-100 backdrop-blur-md transition-all hover:bg-accent-500 hover:text-ink-950"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="بنر بعدی"
                  className="absolute end-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ink-700/60 bg-ink-950/60 text-ink-100 backdrop-blur-md transition-all hover:bg-accent-500 hover:text-ink-950"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
                </button>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`رفتن به بنر ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        'h-1.5 rounded-full transition-all',
                        i === index ? 'w-6 bg-accent-400' : 'w-1.5 bg-ink-300/60 hover:bg-ink-200',
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </SectionShell>
    </section>
  );
}