import { Link } from 'react-router-dom';

export function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl py-12 text-center">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-500/25 bg-accent-500/10 px-3 py-1.5 text-xs font-semibold text-accent-200">
        🚧 در حال ساخت
      </p>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-50 sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-7 text-ink-300">
        {description ?? 'این بخش به‌زودی در دسترس خواهد بود.'}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-accent-400"
      >
        بازگشت به صفحه‌ی اصلی
      </Link>
    </div>
  );
}