/**
 * Danh mục quyền theo định dạng `resource:action`.
 * Bám sát Use Case Diagram v2 (docs/diagrams/usecase-diagram-v2.webp) — mỗi quyền ứng với tối thiểu một use case.
 * Use case của actor System chạy bằng tác vụ nền ở Backend nên không có quyền tương ứng.
 */
export const PERMISSIONS = [
  // Đơn đăng ký (UC: Submit Dormitory Application / Review / Approve-Reject)
  'application:create',
  'application:view_own',
  'application:cancel_own',
  'application:review',
  'application:approve_exception',

  // Phòng & giường (UC: Update Room & Bed Status, Configure Room & Bed)
  'inventory:view_public',
  'inventory:manage',
  'inventory:configure',

  // Xếp phòng (UC: Review/Adjust Proposal / Review-Approve Proposal / Configure & Monitor Engine)
  'assignment:view_own',
  'assignment:adjust_proposal',
  'assignment:approve_batch',
  'assignment:configure_engine',
  'assignment:monitor_engine',

  // Hợp đồng lưu trú
  'contract:view_own',
  'contract:sign_own',
  'contract:manage_all',

  // Hóa đơn & thanh toán (UC: View Payment / Pay Deposit / Pay Invoice)
  'invoice:view_own',
  'invoice:pay_vietqr',
  'invoice:manage',
  'invoice:reconcile',

  // Đổi phòng (UC: Submit Room Change / Mutual Swap / Respond / Approve-Reject)
  'room_change:create_own',
  'room_change:respond_invitation',
  'room_change:verify',
  'room_change:approve',

  // Check-in / Check-out (UC: Self Check-in/out, Process Manual/Late Check-in, Verify Room Condition at Check-out)
  'checkin:self',
  'checkin:process_manual',
  'checkout:verify',

  // Bảo trì & kiểm tra phòng
  'maintenance:create_own',
  'maintenance:view_own',
  'maintenance:view_schedule',
  'maintenance:process',
  'maintenance:approve_schedule',
  'inspection:conduct',

  // Thông báo
  'notification:view_own',
  'broadcast:send',

  // Báo cáo
  'report:operational',
  'report:financial',

  // Cấu hình & quản trị
  'config:system',
  'integration:manage',
  'user:manage',
  'audit:view',
] as const;

export type Permission = (typeof PERMISSIONS)[number];
