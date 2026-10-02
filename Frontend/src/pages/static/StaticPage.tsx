import { useLocation } from 'react-router-dom';
import { PlaceholderPage } from '@/components/common/PlaceholderPage';

const TITLES: Record<string, string> = {
  '/about': 'درباره ما',
  '/contact': 'تماس با ما',
  '/careers': 'فرصت‌های شغلی',
  '/guide': 'راهنمای خرید',
  '/shipping': 'روش‌های ارسال',
  '/returns': 'بازگشت کالا',
  '/support': 'مرکز پشتیبانی',
  '/faq': 'سؤالات متداول',
  '/terms': 'قوانین و مقررات',
  '/privacy': 'حریم خصوصی',
  '/cookies': 'کوکی‌ها',
};

export default function StaticPage() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? 'صفحه';
  return <PlaceholderPage title={title} description="محتوای این صفحه به‌زودی اضافه می‌شود." />;
}