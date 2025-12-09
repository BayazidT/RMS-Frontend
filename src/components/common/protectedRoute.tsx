// src/components/common/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';  // ← Import ReactNode
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;  // ← Correct type (no more error)
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, tokens, user } = useAuthStore();
  const location = useLocation();

  const isLoadingProfile = tokens && !user;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}