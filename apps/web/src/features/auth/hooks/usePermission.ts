import { useAuthStore } from '../stores/auth.store';
import { can, canAny, canAll, type Permission } from '@campusstay/permissions';

export function usePermission() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  return {
    role,
    user,
    can: (permission: Permission) => can(role, permission),
    canAny: (permissions: Permission[]) => canAny(role, permissions),
    canAll: (permissions: Permission[]) => canAll(role, permissions),
  };
}
