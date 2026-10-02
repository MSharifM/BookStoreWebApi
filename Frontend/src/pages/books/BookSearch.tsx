import { useSearchParams } from 'react-router-dom';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';

export default function BookSearchPage() {
  const [params] = useSearchParams();
  const query = params.toString();

  return (
    <PlaceholderPage
      title="نتایج جست‌وجو"
      description={
        query
          ? `فیلترهای اعمال‌شده: ${query} — صفحه‌ی نتایج به‌زودی پیاده‌سازی می‌شود.`
          : 'صفحه‌ی جست‌وجوی کتاب به‌زودی پیاده‌سازی می‌شود.'
      }
    />
  );
}