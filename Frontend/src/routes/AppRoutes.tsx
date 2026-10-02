import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import MainLayout from '@/layouts/MainLayout';
import ForgotPasswordPage from '@/pages/auth/ForgotPassword';
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import BookDetailPage from '@/pages/books/BookDetail';
import BookSearchPage from '@/pages/books/BookSearch';
import CartPage from '@/pages/cart/Cart';
import FavoritesPage from '@/pages/favorites/Favorites';
import HomePage from '@/pages/home/Home';
import NotFoundPage from '@/pages/NotFound';
import AddressesPage from '@/pages/profile/Addresses';
import ChangePasswordPage from '@/pages/profile/ChangePassword';
import OrdersPage from '@/pages/profile/Orders';
import ProfilePage from '@/pages/profile/Profile';
import StaticPage from '@/pages/static/StaticPage';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth pages */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>
      </Route>

      {/* Public bookstore */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BookSearchPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />

        {/* Static footer pages */}
        {[
          '/about', '/contact', '/careers',
          '/guide', '/shipping', '/returns',
          '/support', '/faq',
          '/terms', '/privacy', '/cookies',
        ].map((path) => (
          <Route key={path} path={path} element={<StaticPage />} />
        ))}
      </Route>

      {/* Authenticated user area */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/checkout" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/addresses" element={<AddressesPage />} />

          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/account" element={<ProfilePage />} />
            <Route path="/profile/change-password" element={<ChangePasswordPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}