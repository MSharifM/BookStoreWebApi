import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className="surface-card p-8">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-moss-500/25 bg-moss-500/10 px-3 py-1.5 text-xs font-semibold text-moss-300">
          🔐 بازیابی رمز
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-50 sm:text-[28px]">
          رمزت رو فراموش کردی؟
        </h1>
        <p className="mt-2 text-sm leading-7 text-ink-300">
          نگران نباش! به‌زودی می‌تونی از طریق ایمیل یا شماره‌ی موبایل، رمز
          عبورت رو بازنشانی کنی.
        </p>
        <p className="mt-6 text-sm text-ink-300">
          رمزت رو یادت اومد؟{' '}
          <Link
            to="/login"
            className="font-semibold text-accent-300 underline-offset-4 hover:text-accent-200 hover:underline"
          >
            بازگشت به ورود
          </Link>
        </p>
      </div>
    </div>
  );
}