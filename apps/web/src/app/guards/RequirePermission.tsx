import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermission } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';
import type { Permission } from '@campusstay/permissions';

interface RequirePermissionProps {
  permission: Permission;
  children: React.ReactNode;
}

export function RequirePermission({ permission, children }: RequirePermissionProps) {
  const { can } = usePermission();

  if (!can(permission)) {
    return <Navigate to={APP_ROUTES.AUTH.FORBIDDEN} replace />;
  }

  return <>{children}</>;
}
