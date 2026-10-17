export const PERMISSIONS = [
  // Application
  'application:create',
  'application:view_own',
  'application:cancel_own',
  'application:review',
  'application:approve_exception',

  // Inventory
  'inventory:view_public',
  'inventory:manage',
  'inventory:configure',

  // Assignment
  'assignment:view_own',
  'assignment:manual',
  'assignment:run_batch',
  'assignment:approve_batch',

  // Contract
  'contract:view_own',
  'contract:sign_own',
  'contract:manage_all',

  // Invoice
  'invoice:view_own',
  'invoice:pay_vietqr',
  'invoice:manage',
  'invoice:reconcile',

  // Maintenance
  'maintenance:create_own',
  'maintenance:view_own',
  'maintenance:process',

  // Inspection
  'inspection:conduct',

  // Broadcast
  'broadcast:send',

  // Reports
  'report:operational',
  'report:financial',

  // System Config
  'config:system',
  'integration:manage',
  'user:manage',
  'audit:view',
] as const;

export type Permission = (typeof PERMISSIONS)[number];
