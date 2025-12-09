// src/app/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore'
import { getProfile } from '@/api/authApi';

import ProtectedRoute from '@/components/common/protectedRoute';
import DashboardLayout from '@/app/routes/dashboard.layout';
import LoginPage from '@/app/routes/auth/LoginPage';
import ReservationsPage from './app/routes/reservations/ReservationsPage';
import EmployeesPage from './app/routes/employees/EmployeesPage';

// Lazy-load pages for better performance
const OrdersPage = lazy(() => import('@/app/routes/orders/OrdersPage'));
// const ReservationsPage = lazy(() => import('./routes/reservations/ReservationsPage'));
// const MenuPage = lazy(() => import('./routes/menu/MenuPage'));
// const EmployeesPage = lazy(() => import('./routes/employees/EmployeesPage'));
// const UsersPage = lazy(() => import('./routes/users/UsersPage'));

// Optional: Ensure user profile is loaded on app start if tokens exist
function AuthLoader() {
  const { tokens, user, login } = useAuthStore();

  useEffect(() => {
    if (tokens && !user) {
      getProfile(tokens.accessToken)
        .then(() => {
          // Re-use login action to set user (tokens already stored)
          login(tokens);
        })
        .catch(() => {
          useAuthStore.getState().logout();
        });
    }
  }, [tokens, user, login]);

  return null;
}

// Redirect logic for root path
function RootRedirect() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/orders" replace /> : <Navigate to="/login" replace />;
}

// Loading fallback component
function PageLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-600 animate-pulse">Loading page...</div>
    </div>
  );
}

// 404 page
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
      >
        Go Back
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthLoader /> {/* Loads profile if tokens exist but user missing */}

      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default redirect based on auth state */}
          <Route index element={<RootRedirect />} />

          {/* Dashboard Pages */}
          <Route
            path="orders"
            element={
              <Suspense fallback={<PageLoading />}>
                <OrdersPage />
              </Suspense>
            }
          />
          <Route
            path="reservations"
            element={
              <Suspense fallback={<PageLoading />}>
                <ReservationsPage />
              </Suspense>
            }
          />
          <Route
            path="menu"
            element={
              <Suspense fallback={<PageLoading />}>
                <OrdersPage />
              </Suspense>
            }
          />
          <Route
            path="employees"
            element={
              <Suspense fallback={<PageLoading />}>
                <EmployeesPage />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<PageLoading />}>
                <OrdersPage />
              </Suspense>
            }
          />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}