import type { Role } from '@campusstay/constants';
import { APP_ROUTES } from '@campusstay/constants';
import { t } from '@shared-ui';

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
    { id: 'p1', title: t('Room assigned for Spring 2027'), body: t('Room A204 · Bed G1. Please sign your contract before check-in.'), time: t('2 hours ago'), to: APP_ROUTES.STUDENT.MY_ROOM, unread: true },
    { id: 'p2', title: t('Room swap invitation'), body: t('Đặng Minh Thư (A115) wants to swap rooms with you.'), time: t('5 hours ago'), to: APP_ROUTES.STUDENT.APPLICATIONS, unread: true },
    { id: 'p3', title: t('Invoice due soon'), body: t('Fall 2026 room fee — installment 2: 2.400.000 ₫, due 24/10/2026.'), time: t('Yesterday'), to: APP_ROUTES.STUDENT.INVOICES, unread: true },
    { id: 'p4', title: t('Air conditioner repair scheduled for room A204'), body: t('A technician will inspect it at 09:00 on 18/10.'), time: '16/10', to: APP_ROUTES.STUDENT.APPLICATIONS, unread: false },
  ],
  STAFF: [
    { id: 's1', title: t('Allocation proposal has 6 conflicts'), body: t('BR-SP27-02 needs review before it is sent to the manager.'), time: t('1 hour ago'), to: APP_ROUTES.STAFF.ASSIGNMENT, unread: true },
    { id: 's2', title: t('Maintenance request past SLA'), body: t('TK-10499 — Power outage on floor 3, Building D.'), time: t('3 hours ago'), to: APP_ROUTES.STAFF.MAINTENANCE, unread: true },
  ],
  MANAGER: [
    { id: 'm1', title: t('Proposal BR-SP27-02 awaiting approval'), body: t('342 allocations, staff resolved all conflicts.'), time: t('30 minutes ago'), to: APP_ROUTES.MANAGER.ASSIGNMENT_APPROVAL, unread: true },
    { id: 'm2', title: t('3 applications escalated'), body: t('Decision needed within 24 hours.'), time: t('5 hours ago'), to: APP_ROUTES.MANAGER.APPROVALS, unread: true },
  ],
  ADMIN: [
    { id: 'a1', title: t('VietQR responding slowly'), body: t('Webhook error rate 2.4% over the last hour.'), time: t('20 minutes ago'), to: APP_ROUTES.ADMIN.INTEGRATIONS, unread: true },
  ],
};
