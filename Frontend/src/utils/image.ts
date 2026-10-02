const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const MEDIA_BASE = API_BASE.replace(/\/api\/?$/, '');

export function resolveImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${MEDIA_BASE}${clean}`;
}