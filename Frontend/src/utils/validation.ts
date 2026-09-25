const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,32}$/;

export function validateEmailOrUsername(value: string): string | null {
  const v = value.trim();
  if (!v) return 'لطفاً ایمیل یا نام کاربری خود را وارد کنید.';
  if (v.includes('@') && !EMAIL_REGEX.test(v)) {
    return 'لطفاً یک ایمیل معتبر وارد کنید.';
  }
  if (v.length < 3) return 'این فیلد خیلی کوتاه است.';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'لطفاً رمز عبور خود را وارد کنید.';
  if (value.length < 6) return 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
  return null;
}

/* ---------- Register ---------- */

export function validateUserName(value: string): string | null {
  const v = value.trim();
  if (!v) return 'لطفاً نام کاربری را وارد کنید.';
  if (!USERNAME_REGEX.test(v)) {
    return 'نام کاربری باید ۳ تا ۳۲ کاراکتر و شامل حروف انگلیسی، اعداد یا _ باشد.';
  }
  return null;
}

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return 'لطفاً ایمیل خود را وارد کنید.';
  if (!EMAIL_REGEX.test(v)) return 'لطفاً یک ایمیل معتبر وارد کنید.';
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirm: string,
): string | null {
  if (!confirm) return 'لطفاً تکرار رمز عبور را وارد کنید.';
  if (password !== confirm) return 'رمزهای عبور با هم مطابقت ندارند.';
  return null;
}