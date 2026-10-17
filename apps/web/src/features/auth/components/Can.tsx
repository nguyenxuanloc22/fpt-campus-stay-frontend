import React from 'react';
import type { Permission } from '@campusstay/permissions';
import { usePermission } from '../hooks/usePermission';

export interface CanProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { can } = usePermission();
  if (!can(permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
