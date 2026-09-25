import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { authService } from '@/services/authService';
import { normalizeRegisterError, type NormalizedAuthError } from '@/utils/errors';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateUserName,
} from '@/utils/validation';

interface FieldErrors {
  userName?: string;
  email?: string;
  password?: string;
  rePassword?: string;
}

export function RegisterForm() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<NormalizedAuthError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  function clearFieldError(key: keyof FieldErrors) {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setFormError(null);

    const nextErrors: FieldErrors = {};
    const userNameErr = validateUserName(userName);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(password, rePassword);

    if (userNameErr) nextErrors.userName = userNameErr;
    if (emailErr) nextErrors.email = emailErr;
    if (passwordErr) nextErrors.password = passwordErr;
    if (confirmErr) nextErrors.rePassword = confirmErr;

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register({
        userName: userName.trim(),
        email: email.trim(),
        password,
        rePassword,
      });

      navigate('/login', {
        replace: true,
        state: { message: 'ثبت نام با موفقیت انجام شد. حالا وارد شوید.' },
      });
    } catch (err) {
      const normalized = normalizeRegisterError(err);
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
          به کتاب‌سرا بپیوند!
        </div>

        <header className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-50 sm:text-[28px]">
            ساخت حساب کاربری
          </h1>
          <p className="mt-2 text-sm leading-7 text-ink-300">
            چند قدم کوچک تا شروع سفر کتاب‌خوانی‌ات فاصله داری.
          </p>
        </header>

        {formError && (
          <div className="mb-5">
            <Alert variant={formError.kind === 'duplicate' ? 'warning' : 'error'}>
              {formError.message}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="نام کاربری"
            name="userName"
            type="text"
            autoComplete="username"
            autoFocus
            placeholder="username"
            dir="ltr"
            required
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              clearFieldError('userName');
            }}
            error={fieldErrors.userName}
            disabled={isSubmitting}
            className="text-start"
            hint="فقط حروف انگلیسی، اعداد و _"
          />

          <Input
            label="ایمیل"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            dir="ltr"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            error={fieldErrors.email}
            disabled={isSubmitting}
            className="text-start"
          />

          <PasswordInput
            label="رمز عبور"
            name="password"
            autoComplete="new-password"
            placeholder="حداقل ۶ کاراکتر"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError('password');
              if (fieldErrors.rePassword) clearFieldError('rePassword');
            }}
            error={fieldErrors.password}
            disabled={isSubmitting}
          />

          <PasswordInput
            label="تکرار رمز عبور"
            name="rePassword"
            autoComplete="new-password"
            placeholder="رمز عبور را دوباره وارد کن"
            required
            value={rePassword}
            onChange={(e) => {
              setRePassword(e.target.value);
              clearFieldError('rePassword');
            }}
            error={fieldErrors.rePassword}
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="mt-2"
          >
            {isSubmitting ? 'داریم ثبت‌نامت می‌کنیم…' : 'ساخت حساب کاربری'}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink-700" />
          <span className="text-xs font-medium text-ink-500">یا</span>
          <span className="h-px flex-1 bg-ink-700" />
        </div>

        <p className="text-center text-sm text-ink-300">
          قبلاً ثبت‌نام کرده‌ای؟{' '}
          <Link
            to="/login"
            className="rounded font-semibold text-accent-300 underline-offset-4 transition-colors hover:text-accent-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-800"
          >
            وارد شو
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