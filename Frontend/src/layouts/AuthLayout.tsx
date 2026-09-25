import { Link, Outlet } from 'react-router-dom';
import { Logo } from '@/components/branding/Logo';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-ink-950">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* پنل برند — فقط دسکتاپ */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          {/* هاله‌ی برنجی از بالا */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 left-1/3 h-[500px] w-[500px] animate-glow rounded-full bg-accent-500/15 blur-3xl"
          />
          {/* هاله‌ی مسی از پایین */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-copper-500/10 blur-3xl"
          />

          {/* خطوط تزئینی نازک — مثل قفسه‌های چوبی */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent, transparent 120px, #d1a447 120px, #d1a447 121px)',
            }}
          />

          {/* لوگو */}
          <div className="relative z-10">
            <Link
              to="/"
              aria-label="کتاب‌سرا، صفحه‌ی اصلی"
              className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/25"
            >
              <Logo variant="light" />
            </Link>
          </div>

          {/* وسط */}
          <div className="relative z-10 max-w-xl">
            <ReadingIllustration className="mb-6 h-52 w-full max-w-md animate-float" />

            <h1 className="text-[30px] font-extrabold leading-[1.5] tracking-tight text-ink-50 xl:text-[38px]">
              چراغ‌ها روشنه،
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-accent-300">کتاب‌ها منتظرتَن.</span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 right-0 z-0 h-3 w-full rounded-full bg-accent-500/25"
                />
              </span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-8 text-ink-300">
              بیش از ۱۲٬۰۰۰ عنوان کتاب دست‌چین‌شده از ناشران مستقل ایرانی و
              کلاسیک‌های جهانی — آماده‌ی ارسال به درِ خانه‌ی شما.
            </p>

            {/* پیل‌های اطلاع‌رسانی */}
            <div className="mt-8 flex flex-wrap gap-2">
              <Pill icon={<SparkleIcon />} tone="brass">
                ۱۲۰ کتاب جدید این هفته
              </Pill>
              <Pill icon={<TruckIcon />} tone="moss">
                ارسال سریع به سراسر کشور
              </Pill>
              <Pill icon={<HeartIcon />} tone="copper">
                رضایت ۹۸٪ خوانندگان
              </Pill>
            </div>
          </div>

          {/* فوتر */}
          <div className="relative z-10 flex items-center justify-between text-xs text-ink-500">
            <span>© ۱۴۰۳ کتاب‌سرا</span>
            <span className="inline-flex items-center gap-1.5">
              ساخته‌شده با
              <HeartFilledIcon className="h-3.5 w-3.5 text-accent-400" />
              برای کتاب‌دوست‌ها
            </span>
          </div>
        </aside>

        {/* پنل فرم */}
        <main className="relative flex min-h-screen flex-col bg-ink-950">
          {/* هاله‌ی برنجی پشت فرم */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-500/5 blur-3xl"
          />
          {/* الگوی نقطه‌ای طلایی ملایم */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 dot-pattern opacity-70"
          />

          {/* هدر موبایل */}
          <header className="relative z-10 flex items-center justify-between px-5 py-5 lg:hidden">
            <Link
              to="/"
              aria-label="کتاب‌سرا، صفحه‌ی اصلی"
              className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-500/25"
            >
              <Logo />
            </Link>
            <Link
              to="/register"
              className="rounded-lg px-2 py-1 text-sm font-semibold text-accent-300 transition-colors hover:text-accent-200"
            >
              ثبت‌نام
            </Link>
          </header>

          <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-6 sm:px-6 lg:px-12 lg:py-12">
            <Outlet />
          </div>

          <footer className="relative z-10 px-5 py-5 text-center text-xs text-ink-500 lg:hidden">
            © ۱۴۰۳ کتاب‌سرا · تمامی حقوق محفوظ است.
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ---------- زیرکامپوننت‌ها ---------- */

function Pill({
  children,
  icon,
  tone = 'brass',
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  tone?: 'brass' | 'moss' | 'copper';
}) {
  const tones = {
    brass: 'bg-ink-900/70 text-accent-200 ring-accent-500/25',
    moss: 'bg-ink-900/70 text-moss-300 ring-moss-500/25',
    copper: 'bg-ink-900/70 text-copper-300 ring-copper-500/25',
  } as const;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 backdrop-blur-sm ${tones[tone]}`}
    >
      <span className="inline-flex h-3.5 w-3.5 items-center justify-center">{icon}</span>
      {children}
    </span>
  );
}

function ReadingIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* هاله‌ی نور برنجی */}
      <circle cx="330" cy="60" r="52" fill="#d1a447" opacity="0.06" />
      <circle cx="330" cy="60" r="36" fill="#d1a447" opacity="0.12" />
      <circle cx="330" cy="60" r="20" fill="#e0b95f" opacity="0.35" />

      {/* جرقه‌های طلایی */}
      <path
        d="M56 44 l2.2 -8.5 l2.2 8.5 l8.5 2.2 l-8.5 2.2 l-2.2 8.5 l-2.2 -8.5 l-8.5 -2.2 z"
        fill="#d1a447"
        opacity="0.75"
      />
      <path
        d="M366 152 l1.6 -6 l1.6 6 l6 1.6 l-6 1.6 l-1.6 6 l-1.6 -6 l-6 -1.6 z"
        fill="#c1653d"
        opacity="0.5"
      />

      {/* استک کتاب */}
      {/* کتاب پایین - مسی */}
      <rect x="50" y="182" width="244" height="34" rx="8" fill="#9c4d2e" />
      <rect x="50" y="182" width="244" height="9" rx="4" fill="#7a3b23" />
      <rect x="64" y="194" width="72" height="16" rx="3" fill="#f0c9a8" opacity="0.7" />

      {/* کتاب وسط - برنجی */}
      <rect x="70" y="150" width="212" height="32" rx="8" fill="#b78a35" />
      <rect x="70" y="150" width="212" height="9" rx="4" fill="#986d28" />
      <rect x="84" y="162" width="62" height="14" rx="3" fill="#fbf4dc" opacity="0.85" />

      {/* کتاب خزه‌ای - کمی کج */}
      <g transform="rotate(-2 175 120)">
        <rect x="90" y="120" width="182" height="30" rx="8" fill="#456345" />
        <rect x="90" y="120" width="182" height="8" rx="4" fill="#334a33" />
        <rect x="104" y="130" width="52" height="14" rx="3" fill="#c4d4c0" opacity="0.8" />
      </g>

      {/* کتاب کرم روی همه */}
      <g transform="rotate(1.5 190 92)">
        <rect
          x="116"
          y="90"
          width="152"
          height="30"
          rx="8"
          fill="#efe7d6"
          stroke="#a89878"
          strokeWidth="1.5"
        />
        <rect x="116" y="90" width="152" height="7" rx="3" fill="#d4c7ab" />
        <rect x="132" y="100" width="62" height="12" rx="3" fill="#9c4d2e" opacity="0.35" />
      </g>

      {/* نشانک کتاب */}
      <path d="M232 120 L232 152 L242 145 L252 152 L252 120 Z" fill="#c1653d" />

      {/* نقطه‌های شناور */}
      <circle cx="102" cy="204" r="3" fill="#d1a447" opacity="0.6" />
      <circle cx="324" cy="204" r="4" fill="#c1653d" opacity="0.5" />
      <circle cx="152" cy="224" r="2.5" fill="#7a9a78" opacity="0.6" />
    </svg>
  );
}

/* ---------- آیکن‌ها ---------- */

function SparkleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M8 1.5l1.4 4.1L13.5 7l-4.1 1.4L8 12.5 6.6 8.4 2.5 7l4.1-1.4z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M1.5 4h8v7h-8z" />
      <path d="M9.5 6.5h3l2 2v2.5h-5" />
      <circle cx="4" cy="12.5" r="1.4" />
      <circle cx="11.5" cy="12.5" r="1.4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M8 13.5S2.5 10.2 2.5 6.6A2.6 2.6 0 0 1 8 5.2a2.6 2.6 0 0 1 5.5 1.4c0 3.6-5.5 6.9-5.5 6.9Z" />
    </svg>
  );
}

function HeartFilledIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z" />
    </svg>
  );
}