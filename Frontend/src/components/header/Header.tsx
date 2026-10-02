import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/branding/Logo';
import { SearchBox } from './SearchBox';
import { UserMenu } from './UserMenu';
import { CartPreview } from './CartPreview';
import { cn } from '@/utils/cn';

const NAV_LINKS = [
  { to: '/', label: 'خانه' },
  { to: '/books', label: 'کتاب‌ها' },
  { to: '/books?SortBy=1', label: 'جدیدترین' },
  { to: '/books?SortBy=4', label: 'محبوب‌ترین' },
  { to: '/books?SortBy=5', label: 'پرفروش‌ترین' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/80 bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link
          to="/"
          aria-label="کتاب‌سرا، صفحه‌ی اصلی"
          className="shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="ناوبری اصلی">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-ink-800/70 text-accent-200'
                    : 'text-ink-300 hover:bg-ink-800/50 hover:text-ink-100',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 md:block">
          <SearchBox />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CartPreview />
          <UserMenu />

          <button
            type="button"
            aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700/80 bg-ink-900/60 text-ink-300 transition-colors hover:border-ink-600 hover:text-ink-100 md:hidden"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search — always visible below header on small screens */}
      <div className="border-t border-ink-800/60 px-4 py-2.5 md:hidden">
        <SearchBox />
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav
          aria-label="ناوبری موبایل"
          className="animate-fade-in border-t border-ink-800/60 bg-ink-950/95 px-4 py-3 md:hidden"
        >
          <ul className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-ink-800/70 text-accent-200'
                        : 'bg-ink-900/40 text-ink-300 hover:bg-ink-800/60 hover:text-ink-100',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}