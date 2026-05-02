import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useSocket } from '@/hooks/useSocket';
import { useAppSelector } from '@/hooks/store';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ProductsPage from '@/pages/products/ProductsPage';
import CategoriesPage from '@/pages/categories/CategoriesPage';
import OrdersPage from '@/pages/orders/OrdersPage';
import UsersPage from '@/pages/users/UsersPage';
import ReviewsPage from '@/pages/reviews/ReviewsPage';
import BlogsPage from '@/pages/blogs/BlogsPage';
import PartnersPage from '@/pages/partners/PartnersPage';
import IndustriesPage from '@/pages/industries/IndustriesPage';
import ProductRequestsPage from '@/pages/product-requests/ProductRequestsPage';
import SettingsPage from '@/pages/settings/SettingsPage';

function AdminOnly({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  useSocket();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/product-requests" element={<ProductRequestsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/products" element={<AdminOnly><ProductsPage /></AdminOnly>} />
        <Route path="/categories" element={<AdminOnly><CategoriesPage /></AdminOnly>} />
        <Route path="/users" element={<AdminOnly><UsersPage /></AdminOnly>} />
        <Route path="/blogs" element={<AdminOnly><BlogsPage /></AdminOnly>} />
        <Route path="/partners" element={<AdminOnly><PartnersPage /></AdminOnly>} />
        <Route path="/industries" element={<AdminOnly><IndustriesPage /></AdminOnly>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
