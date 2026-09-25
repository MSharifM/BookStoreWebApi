import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6">
      <div className="text-center">
        <p className="fa-num text-5xl font-extrabold text-accent-400">۴۰۴</p>
        <p className="mt-3 text-sm text-ink-300">
          صفحه‌ای که دنبالش بودید پیدا نشد.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-accent-400"
        >
          بازگشت به صفحه‌ی اصلی
        </Link>
      </div>
    </div>
  );
}