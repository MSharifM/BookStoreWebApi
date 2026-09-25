import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAuth } from '@/hooks/useAuth';
import { normalizeLoginError, type NormalizedAuthError } from '@/utils/errors';
import { validateEmailOrUsername, validatePassword } from '@/utils/validation';

interface FieldErrors {
  userNameOrEmail?: string;
  password?: string;
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<NormalizedAuthError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  // 🔵 پیام موفقیتی که از صفحه‌ی ثبت‌نام آمده (بعد از navigate با state)
  const [successMessage] = useState<string | null>(
    () => (location.state as { message?: string } | null)?.message ?? null,
  );

  // 🔵 پاک‌کردن state از history تا رفرش دوباره پیام رو نشون نده
  useEffect(() => {
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);

    const nextErrors: FieldErrors = {};
    const emailError = validateEmailOrUsername(userNameOrEmail);
    const passwordError = validatePassword(password);
    if (emailError) nextErrors.userNameOrEmail = emailError;
    if (passwordError) nextErrors.password = passwordError;

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ userNameOrEmail: userNameOrEmail.trim(), password }, rememberMe);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const normalized = normalizeLoginError(err);
      setFormError(normalized);
      if (normalized.fieldErrors) {
        setFieldErrors((prev) => ({ ...prev, ...normalized.fieldErrors }));
      }
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  }

  function triggerShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 340);
  }

  return (
    <div className="w-full max-w-md animate-fade-up">
      <div className={`surface-card p-6 sm:p-8 ${shake ? 'animate-shake' : ''}`}>
        {/* پیل خوش‌آمدگویی */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent-500/25 bg-accent-500/10 px-3 py-1.5 text-xs font-semibold text-accent-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-accent-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
          </span>
          سلام، خوش برگشتی!
        </div>

        {/* 🟢 پیام موفقیت ثبت‌نام — اینجا اضافه شد */}
        {successMessage && (
          <div className="mb-5">
            <Alert variant="success">{successMessage}</Alert>
          </div>
        )}

        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-50 sm:text-[28px]">
            ورود به حساب کاربری
          </h1>
          <p className="mt-2 text-sm leading-7 text-ink-300">
            برای دیدن سفارش‌ها، علاقه‌مندی‌ها و ادامه‌ی خرید وارد شو.
          </p>
        </header>

        {formError && (
          <div className="mb-5">
            <Alert variant={formError.kind === 'locked' ? 'warning' : 'error'}>
              {formError.message}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="ایمیل یا نام کاربری"
            name="userNameOrEmail"
            type="text"
            autoComplete="username"
            autoFocus
            placeholder="you@example.com"
            dir="ltr"
            required
            value={userNameOrEmail}
            onChange={(e) => {
              setUserNameOrEmail(e.target.value);
              if (fieldErrors.userNameOrEmail) {
                setFieldErrors((p) => ({ ...p, userNameOrEmail: undefined }));
              }
            }}
            error={fieldErrors.userNameOrEmail}
            disabled={isSubmitting}
            className="text-start"
          />

          <PasswordInput
            label="رمز عبور"
            name="password"
            autoComplete="current-password"
            placeholder="رمز عبورت رو وارد کن"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password) {
                setFieldErrors((p) => ({ ...p, password: undefined }));
              }
            }}
            error={fieldErrors.password}
            disabled={isSubmitting}
            action={
              <Link
                to="/forgot-password"
                className="rounded text-xs font-semibold text-accent-300 transition-colors hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
              >
                فراموشش کردی؟
              </Link>
            }
          />

          <div className="pt-1">
            <Checkbox
              label="یادت باشه من"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? 'داریم وارد می‌شیم…' : 'ورود به کتاب‌سرا'}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink-700" />
          <span className="text-xs font-medium text-ink-500">یا</span>
          <span className="h-px flex-1 bg-ink-700" />
        </div>

        <p className="text-center text-sm text-ink-300">
          تازه‌وارد شدی؟{' '}
          <Link
            to="/register"
            className="rounded font-semibold text-accent-300 underline-offset-4 transition-colors hover:text-accent-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
          >
            همین حالا ثبت‌نام کن
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs leading-6 text-ink-500">
        با ادامه، شما{' '}
        <a href="/terms" className="underline-offset-4 hover:text-ink-300 hover:underline">
          شرایط استفاده
        </a>{' '}
        و{' '}
        <a href="/privacy" className="underline-offset-4 hover:text-ink-300 hover:underline">
          سیاست حریم خصوصی
        </a>{' '}
        را می‌پذیرید.
      </p>
    </div>
  );
}