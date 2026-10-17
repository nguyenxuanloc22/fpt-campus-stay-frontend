import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
