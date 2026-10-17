import { ROLES, type Role } from '@campusstay/constants';
import type { Permission } from './permissions';

/**
 * Ma trận phân quyền — nguồn sự thật duy nhất ở Frontend.
 * Mọi thay đổi phải cập nhật đồng thời docs/PERMISSION_MATRIX.md.
 */
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
    'room_change:create_own',
    'room_change:respond_invitation',
    'checkin:self',
    'maintenance:create_own',
    'maintenance:view_own',
    'maintenance:view_schedule',
    'notification:view_own',
  ],
  [ROLES.STAFF]: [
    'inventory:view_public',
    'inventory:manage',
    'application:review',
    'assignment:adjust_proposal',
    'contract:manage_all',
    'invoice:manage',
    'room_change:verify',
    'checkin:process_manual',
    'checkout:verify',
    'maintenance:process',
    'inspection:conduct',
    'broadcast:send',
  ],
  [ROLES.MANAGER]: [
    'inventory:view_public',
    'application:approve_exception',
    'assignment:approve_batch',
    'contract:manage_all',
    'room_change:approve',
    'maintenance:approve_schedule',
    'report:operational',
    'report:financial',
  ],
  [ROLES.ADMIN]: [
    'inventory:view_public',
    'inventory:configure',
    'assignment:configure_engine',
    'assignment:monitor_engine',
    'invoice:reconcile',
    'report:operational',
    'report:financial',
    'config:system',
    'integration:manage',
    'user:manage',
    'audit:view',
  ],
};
