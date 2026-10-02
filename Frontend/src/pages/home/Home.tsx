import { BannerCarousel } from '@/components/home/BannerCarousel';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { BookCarouselSection } from '@/components/home/BookCarouselSection';
import { PublishersSection } from '@/components/home/PublishersSection';
import { homeService } from '@/services/homeService';
import { BookSortBy } from '@/types/home';

export default function HomePage() {
  return (
    <div className="-mx-4 sm:-mx-6">
      <BannerCarousel />
      <CategoriesSection />

      <BookCarouselSection
        cacheKey="home:newest"
        title="جدیدترین‌ها"
        subtitle="تازه‌های نشر را اول از همه ببین"
        fetcher={homeService.getNewestBooks}
        seeAllHref={`/books?SortBy=${BookSortBy.Newest}`}
        icon={<SparkleIcon />}
      />

      <BookCarouselSection
        cacheKey="home:popular"
        title="محبوب‌ترین‌ها"
        subtitle="کتاب‌هایی که خوانندگان بیشترین توجه را به آن‌ها داشته‌اند"
        fetcher={homeService.getPopularBooks}
        seeAllHref={`/books?SortBy=${BookSortBy.Popular}`}
        icon={<FireIcon />}
      />

      <BookCarouselSection
        cacheKey="home:bestsellers"
        title="پرفروش‌ترین‌ها"
        subtitle="پرفروش‌ترین کتاب‌های این فصل"
        fetcher={homeService.getBestSellingBooks}
        seeAllHref={`/books?SortBy=${BookSortBy.BestSelling}`}
        icon={<TrophyIcon />}
      />

      <BookCarouselSection
        cacheKey="home:most-discount"
        title="تخفیف‌دارها"
        subtitle="فرصت‌های ویژه‌ی خرید"
        fetcher={homeService.getMostDiscountedBooks}
        icon={<TagIcon />}
        // توجه: وقتی بک‌اند Enum جدیدی برای "MostDiscount" اضافه کرد،
        // فقط کافیست این مقدار را اینجا تنظیم کنیم. تا آن زمان، هیچ
        // مقدار نادرستی به بک‌اند فرستاده نمی‌شود.
        // seeAllHref={`/books?SortBy=${BookSortBy.MostDiscount}`}
      />

      <PublishersSection />
    </div>
  );
}

/* ---------- آیکن‌های ساده ---------- */
function SparkleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M8 1.5l1.4 4.1L13.5 7l-4.1 1.4L8 12.5 6.6 8.4 2.5 7l4.1-1.4z" />
    </svg>
  );
}
function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2c.5 3 2.5 4.5 4 6.5C17.8 10.5 19 12.3 19 15a7 7 0 1 1-14 0c0-2.5 1.2-4 2.5-5.5C9 8 10 6.5 10 4c.5.7 1 1.6 1 3 .7-.8 1-2 1-5z" />
    </svg>
  );
}
function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M17 5h3v2a3 3 0 0 1-3 3" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3" />
      <path d="M9 18h6M12 14v4" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1-.6-1.4V4.6A1.6 1.6 0 0 1 4.4 3H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}