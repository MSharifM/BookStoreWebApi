import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <section className="max-w-2xl">
      <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-500/25 bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-200">
        📚 کتاب‌سرا
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-50 sm:text-4xl">
        {isAuthenticated ? 'خوش برگشتی 👋' : 'به کتاب‌سرا خوش اومدی 👋'}
      </h1>
      <p className="mt-4 text-[15px] leading-8 text-ink-300">
        {isAuthenticated
          ? `${
              user?.fullName ? `${user.fullName} جان، ` : ''
            }خوشحالیم که دوباره اینجایی. قفسه‌های کتاب به‌زودی همین‌جا نمایش داده می‌شن.`
          : 'قفسه‌های کتاب به‌زودی همین‌جا نمایش داده می‌شن. یه فنجون چای بریز و آماده باش!'}
      </p>
    </section>
  );
}