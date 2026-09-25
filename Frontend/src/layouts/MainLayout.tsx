import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/branding/Logo';
import { useAuth } from '@/hooks/useAuth';

export default function MainLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink-50">
      <header className="border-b border-ink-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
          <Link to="/" aria-label="کتاب‌سرا، صفحه‌ی اصلی">
            <Logo />
          </Link>
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
            >
              خروج
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-100"
            >
              ورود
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">
        <Outlet />
      </main>
    </div>
  );
}