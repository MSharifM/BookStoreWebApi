import { Link } from 'react-router-dom';
import { Logo } from '@/components/branding/Logo';

const COLUMNS: Array<{ title: string; links: Array<{ to: string; label: string }> }> = [
  {
    title: 'کتاب‌سرا',
    links: [
      { to: '/about', label: 'درباره ما' },
      { to: '/contact', label: 'تماس با ما' },
      { to: '/careers', label: 'فرصت‌های شغلی' },
    ],
  },
  {
    title: 'خرید',
    links: [
      { to: '/guide', label: 'راهنمای خرید' },
      { to: '/shipping', label: 'روش‌های ارسال' },
      { to: '/returns', label: 'بازگشت کالا' },
    ],
  },
  {
    title: 'پشتیبانی',
    links: [
      { to: '/support', label: 'مرکز پشتیبانی' },
      { to: '/faq', label: 'سؤالات متداول' },
      { to: '/contact', label: 'ارتباط با ما' },
    ],
  },
  {
    title: 'قوانین',
    links: [
      { to: '/terms', label: 'قوانین و مقررات' },
      { to: '/privacy', label: 'حریم خصوصی' },
      { to: '/cookies', label: 'کوکی‌ها' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-800/80 bg-ink-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-7 text-ink-400">
              کتاب‌سرا، خانه‌ی کتاب‌دوستان. گزیده‌ای از بهترین ناشران ایرانی و
              کلاسیک‌های جهانی، آماده‌ی ارسال به سراسر کشور.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-bold text-ink-100">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-xs text-ink-400 transition-colors hover:text-accent-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-ink-800/60 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>© ۱۴۰۳ کتاب‌سرا · تمامی حقوق محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            ساخته‌شده با
            <span className="text-accent-400" aria-hidden="true">♥</span>
            برای کتاب‌دوستان
          </p>
        </div>
      </div>
    </footer>
  );
}