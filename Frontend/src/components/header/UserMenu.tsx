import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { useClickOutside } from '@/hooks/useClickOutside';
import { userService } from '@/services/userService';
import { SafeImage } from '@/components/common/SafeImage';
import { TTL } from '@/utils/cache';
import { cn } from '@/utils/cn';

const MENU_ITEMS: Array<{ to: string; label: string; icon: string }> = [
  { to: '/profile', label: 'پنل کاربری', icon: '🧭' },
  { to: '/profile/account', label: 'اطلاعات حساب', icon: '👤' },
  { to: '/orders', label: 'سفارش‌ها', icon: '📦' },
  { to: '/addresses', label: 'آدرس‌ها', icon: '📍' },
  { to: '/favorites', label: 'علاقه‌مندی‌ها', icon: '❤️' },
  { to: '/profile/change-password', label: 'تغییر رمز عبور', icon: '🔐' },
];

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: summary } = useApi(
    isAuthenticated ? 'user:summary' : null,
    () => userService.getSummaryInfo(),
    { ttl: TTL.userScoped, enabled: isAuthenticated },
  );

  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="rounded-lg px-3 py-1.5 text-sm font-semibold text-ink-200 transition-colors hover:bg-ink-800 hover:text-ink-50"
        >
          ورود
        </Link>
        <Link
          to="/register"
          className="hidden rounded-lg bg-accent-500 px-3 py-1.5 text-sm font-bold text-ink-950 transition-colors hover:bg-accent-400 sm:inline-flex"
        >
          ثبت‌نام
        </Link>
      </div>
    );
  }

  const displayName = summary?.userName || user?.userName || 'کاربر';

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          'flex items-center gap-2 rounded-xl border border-ink-700/80 bg-ink-900/60 p-1 ps-2 transition-colors',
          'hover:border-ink-600 hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
        )}
      >
        <span className="hidden max-w-[100px] truncate text-xs font-semibold text-ink-200 sm:inline">
          {displayName}
        </span>
        <SafeImage
          src={summary?.imagePath}
          alt={displayName}
          className="h-8 w-8 shrink-0 rounded-lg"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 w-56 animate-fade-in overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/95 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-lg"
        >
          <ul className="py-1">
            {MENU_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink-200 transition-colors hover:bg-ink-800 hover:text-ink-50"
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 border-t border-ink-800 px-3 py-2.5 text-sm text-copper-200 transition-colors hover:bg-copper-500/10"
          >
            <span aria-hidden="true">↩️</span>
            خروج از حساب
          </button>
        </div>
      )}
    </div>
  );
}