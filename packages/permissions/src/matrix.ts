import { ROLES, type Role } from '@campusstay/constants';
import type { Permission } from './permissions';

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  [ROLES.STUDENT]: [
    'application:create',
    'application:view_own',
    'application:cancel_own',
    'inventory:view_public',
    'assignment:view_own',
    'contract:view_own',
    'contract:sign_own',
    'invoice:view_own',
    'invoice:pay_vietqr',
    'maintenance:create_own',
    'maintenance:view_own',
  ],
  [ROLES.STAFF]: [
    'inventory:view_public',
    'inventory:manage',
    'application:review',
    'assignment:manual',
    'contract:manage_all',
    'invoice:manage',
    'maintenance:process',
    'inspection:conduct',
    'broadcast:send',
  ],
  [ROLES.MANAGER]: [
    'inventory:view_public',
    'application:approve_exception',
    'assignment:approve_batch',
    'contract:manage_all',
    'report:operational',
  ],
  [ROLES.ADMIN]: [
    'inventory:view_public',
    'inventory:configure',
    'assignment:run_batch',
    'invoice:reconcile',
    'report:operational',
    'report:financial',
    'config:system',
    'integration:manage',
    'user:manage',
    'audit:view',
  ],
};
