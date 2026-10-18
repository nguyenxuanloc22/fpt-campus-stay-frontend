import type { Role } from '@campusstay/constants';
import { APP_ROUTES } from '@campusstay/constants';

/**
 * Thông báo cá nhân (chuông trên Header): chỉ những gì liên quan trực tiếp tới người dùng
 * hoặc phòng của họ. Khác với “Thông báo chung” là thông báo hệ thống gửi diện rộng.
 */
export interface PersonalNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  to: string;
  unread: boolean;
}

export const PERSONAL_NOTIFICATIONS: Record<Role, PersonalNotification[]> = {
  STUDENT: [
    { id: 'p1', title: 'Đã xếp phòng Spring 2027', body: 'Phòng A204 · Giường G1. Vui lòng ký hợp đồng trước khi check-in.', time: '2 giờ trước', to: APP_ROUTES.STUDENT.MY_ROOM, unread: true },
    { id: 'p2', title: 'Lời mời hoán đổi phòng', body: 'Đặng Minh Thư (A115) muốn hoán đổi phòng với bạn.', time: '5 giờ trước', to: APP_ROUTES.STUDENT.APPLICATIONS, unread: true },
    { id: 'p3', title: 'Hóa đơn sắp đến hạn', body: 'Phí phòng Fall 2026 — đợt 2: 2.400.000 ₫, hạn 24/10/2026.', time: 'Hôm qua', to: APP_ROUTES.STUDENT.INVOICES, unread: true },
    { id: 'p4', title: 'Lịch sửa máy lạnh phòng A204', body: 'Kỹ thuật viên đến kiểm tra lúc 09:00 ngày 18/10.', time: '16/10', to: APP_ROUTES.STUDENT.APPLICATIONS, unread: false },
  ],
  STAFF: [
    { id: 's1', title: 'Đề xuất xếp phòng có 6 xung đột', body: 'BR-SP27-02 cần rà soát trước khi gửi Manager.', time: '1 giờ trước', to: APP_ROUTES.STAFF.ASSIGNMENT, unread: true },
    { id: 's2', title: 'Ticket vượt SLA', body: 'TK-10499 — Mất điện tầng 3 Tòa D.', time: '3 giờ trước', to: APP_ROUTES.STAFF.MAINTENANCE, unread: true },
  ],
  MANAGER: [
    { id: 'm1', title: 'Đề xuất BR-SP27-02 chờ duyệt', body: '342 phân bổ, Staff đã xử lý hết xung đột.', time: '30 phút trước', to: APP_ROUTES.MANAGER.ASSIGNMENT_APPROVAL, unread: true },
    { id: 'm2', title: '3 đơn đăng ký được chuyển lên', body: 'Cần quyết định trong 24 giờ.', time: '5 giờ trước', to: APP_ROUTES.MANAGER.APPROVALS, unread: true },
  ],
  ADMIN: [
    { id: 'a1', title: 'VietQR phản hồi chậm', body: 'Tỷ lệ lỗi webhook 2,4% trong 1 giờ qua.', time: '20 phút trước', to: APP_ROUTES.ADMIN.INTEGRATIONS, unread: true },
  ],
};
