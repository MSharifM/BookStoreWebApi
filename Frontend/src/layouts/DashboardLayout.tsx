import { Outlet } from 'react-router-dom';

/**
 * Placeholder for user/publisher/admin panels. Will be replaced with a
 * proper dashboard shell later.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-ink-50">
      <main className="mx-auto w-full max-w-6xl px-5 py-10">
        <Outlet />
      </main>
    </div>
  );
}