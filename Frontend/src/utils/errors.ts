import axios, { type AxiosError } from 'axios';
import type { ApiErrorBody } from '@/types/api';

export type AuthErrorKind =
  | 'validation'
  | 'invalid-credentials'
  | 'locked'
  | 'duplicate'
  | 'network'
  | 'timeout'
  | 'server'
  | 'session-expired'
  | 'unknown';

export interface NormalizedAuthError {
  kind: AuthErrorKind;
  message: string;
  fieldErrors?: Record<string, string>;
}

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

const MESSAGES: Record<AuthErrorKind, string> = {
  validation: 'لطفاً فیلدهای مشخص‌شده را بررسی کنید و دوباره تلاش کنید.',
  'invalid-credentials': 'ایمیل/نام کاربری یا رمز عبور اشتباه است.',
  locked: 'حساب کاربری شما قفل شده است. لطفاً با پشتیبانی تماس بگیرید.',
  duplicate: 'این اطلاعات قبلاً ثبت شده است.',
  network: 'ارتباط با سرور برقرار نشد. اتصال اینترنت خود را بررسی کنید.',
  timeout: 'پاسخی از سرور دریافت نشد. لطفاً دوباره تلاش کنید.',
  server: 'خطایی در سرور رخ داد. لطفاً لحظه‌ای دیگر دوباره تلاش کنید.',
  'session-expired': 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.',
  unknown: 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
};

const FIELD_ALIASES: Record<string, string> = {
  usernameoremail: 'userNameOrEmail',
  username: 'userName',
  email: 'email',
  password: 'password',
  repassword: 'rePassword',
  confirmpassword: 'rePassword',
};

function normalizeFieldKey(raw: string): string {
  return FIELD_ALIASES[raw.toLowerCase()] ?? raw;
}

function flattenFieldErrors(
  errors?: Record<string, string[]>,
): Record<string, string> | undefined {
  if (!errors) return undefined;
  const out: Record<string, string> = {};
  for (const [rawKey, messages] of Object.entries(errors)) {
    if (messages?.length) out[normalizeFieldKey(rawKey)] = messages[0];
  }
  return Object.keys(out).length ? out : undefined;
}

/** ---------- Login ---------- */
export function normalizeLoginError(error: unknown): NormalizedAuthError {
  if (error instanceof AuthServiceError) {
    return {
      kind: 'invalid-credentials',
      message: error.message || MESSAGES['invalid-credentials'],
    };
  }
  if (!axios.isAxiosError(error)) {
    return { kind: 'unknown', message: MESSAGES.unknown };
  }
  const axiosErr = error as AxiosError<ApiErrorBody>;
  if (!axiosErr.response) {
    if (axiosErr.code === 'ECONNABORTED') {
      return { kind: 'timeout', message: MESSAGES.timeout };
    }
    return { kind: 'network', message: MESSAGES.network };
  }
  const { status, data } = axiosErr.response;
  const backendMessage = data?.errorMessage || data?.message;

  if (status === 400 || status === 422) {
    return {
      kind: 'validation',
      message: backendMessage || MESSAGES.validation,
      fieldErrors: flattenFieldErrors(data?.errors),
    };
  }
  if (status === 401) {
    return {
      kind: 'invalid-credentials',
      message: backendMessage || MESSAGES['invalid-credentials'],
    };
  }
  if (status === 403 || status === 423) {
    return { kind: 'locked', message: backendMessage || MESSAGES.locked };
  }
  if (status >= 500) {
    return { kind: 'server', message: MESSAGES.server };
  }
  return { kind: 'unknown', message: backendMessage || MESSAGES.unknown };
}

/** ---------- Register ---------- */

/**
 * Heuristics to classify a duplicate-account message coming from the backend.
 * Keeps the exact backend message so the user sees "ایمیل قبلاً ثبت شده است".
 */
function classifyDuplicate(message: string | null | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes('duplicate') ||
    m.includes('already') ||
    m.includes('exists') ||
    m.includes('تکراری') ||
    m.includes('قبلاً') ||
    m.includes('قبلا') ||
    m.includes('ثبت شده') ||
    m.includes('استفاده شده')
  );
}

export function normalizeRegisterError(error: unknown): NormalizedAuthError {
  // Business-level error thrown by authService when isSuccess === false
  if (error instanceof AuthServiceError) {
    const message = error.message || MESSAGES.validation;
    return {
      kind: classifyDuplicate(message) ? 'duplicate' : 'validation',
      message,
    };
  }

  if (!axios.isAxiosError(error)) {
    return { kind: 'unknown', message: MESSAGES.unknown };
  }

  const axiosErr = error as AxiosError<ApiErrorBody>;

  if (!axiosErr.response) {
    if (axiosErr.code === 'ECONNABORTED') {
      return { kind: 'timeout', message: MESSAGES.timeout };
    }
    return { kind: 'network', message: MESSAGES.network };
  }

  const { status, data } = axiosErr.response;
  const backendMessage = data?.errorMessage || data?.message;

  if (status === 400 || status === 422) {
    const fieldErrors = flattenFieldErrors(data?.errors);
    const isDuplicate = classifyDuplicate(backendMessage);
    return {
      kind: isDuplicate ? 'duplicate' : 'validation',
      message: backendMessage || MESSAGES.validation,
      fieldErrors,
    };
  }
  if (status === 409) {
    return { kind: 'duplicate', message: backendMessage || MESSAGES.duplicate };
  }
  if (status >= 500) {
    return { kind: 'server', message: MESSAGES.server };
  }
  return { kind: 'unknown', message: backendMessage || MESSAGES.unknown };
}