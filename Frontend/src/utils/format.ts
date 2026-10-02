const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(value: number): string {
  return toPersianDigits(value.toLocaleString('en-US'));
}

export function formatPrice(value: number): string {
  return `${formatNumber(value)} تومان`;
}

export function formatRating(rate: number): string {
  return toPersianDigits(rate.toFixed(1));
}