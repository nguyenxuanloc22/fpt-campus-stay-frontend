
import { t } from '@shared-ui';/**
 * Thông báo hệ thống (Thông báo chung) — do Quản trị viên cấu hình hoặc Ban quản lý KTX gửi.
 * Thông báo có `important: true` được ghim và hiện thành popup ngay sau khi đăng nhập.
 */

export type AnnouncementCategory = 'DORM' | 'MAINTENANCE' | 'FINANCE' | 'SYSTEM';

export interface Announcement {
  id: string;
  category: AnnouncementCategory;
  title: string;
  body: string;
  source: string;
  date: string;
  important?: boolean;
}

export const ANNOUNCEMENT_CATEGORY_LABEL: Record<AnnouncementCategory, string> = {
  DORM: t('Dormitory info'),
  MAINTENANCE: t('Maintenance'),
  FINANCE: t('Finance notice'),
  SYSTEM: t('System'),
};

/** Màu nhấn theo danh mục (badge, chip lọc) — nền cam trắng, mỗi danh mục một sắc nhẹ. */
export const ANNOUNCEMENT_CATEGORY_TONE: Record<AnnouncementCategory, string> = {
  DORM: 'bg-orange-100 text-orange-700',
  MAINTENANCE: 'bg-sky-100 text-sky-700',
  FINANCE: 'bg-emerald-100 text-emerald-700',
  SYSTEM: 'bg-violet-100 text-violet-700',
};

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'n1',
    category: 'DORM',
    important: true,
    title: t('NOTICE: Spring 2027 accommodation registration is open'),
    body:
      t('Dear students,\n\nThe Dormitory Management Board announces that Spring 2027 accommodation registration is open from 14/10/2026 to 15/11/2026.\n') +
      t('Register under “Room registration”, choose a room type and pay the deposit via VietQR to hold your place.\n') +
      t('Current residents keep priority for their current room if they register before 01/11/2026.\n\n') +
      t('Best regards,\nDormitory Management Board, FPT University Tan Uyen'),
    source: t('Dormitory Management Board'),
    date: '14/10/2026 08:00',
  },
  {
    id: 'n2',
    category: 'MAINTENANCE',
    title: t('Water supply suspended in Building A on 19/10/2026'),
    body: t('Scheduled tank cleaning from 08:00 to 14:00. Building A residents, please store water in advance.'),
    source: t('Dormitory Management Board'),
    date: '16/10/2026 14:00',
  },
  {
    id: 'n3',
    category: 'FINANCE',
    title: t('Fall 2026 room fee due date — installment 2'),
    body: t('Payment is due on 24/10/2026 via VietQR. Students facing difficulties may submit a “Payment deadline extension” request under Requests at least 3 days before the due date.'),
    source: t('Dormitory Management Board'),
    date: '15/10/2026 09:00',
  },
  {
    id: 'n4',
    category: 'MAINTENANCE',
    title: t('Dormitory-wide Wi-Fi upgrade on the night of 21/10'),
    body: t('Network outage from 22:00 on 21/10 to 06:00 on 22/10 to install new equipment.'),
    source: t('Dormitory Management Board'),
    date: '12/10/2026 10:00',
  },
  {
    id: 'n5',
    category: 'SYSTEM',
    title: t('Room price update for Spring 2027'),
    body: t('2-person room 8.500.000 ₫/term, 4-person room 5.200.000 ₫/term, 6-person room 3.600.000 ₫/term. Deposit: 20% of the first term fee plus a 500.000 ₫ utility deposit.'),
    source: t('System administration'),
    date: '10/10/2026 09:00',
  },
  {
    id: 'n6',
    category: 'DORM',
    title: t('Reminder: curfew and visitor registration'),
    body: t('Curfew is 23:00. Visitors must register at the security desk, show their ID card and leave the dormitory before 21:00.'),
    source: t('Dormitory Management Board'),
    date: '10/10/2026 15:30',
  },
  {
    id: 'n7',
    category: 'SYSTEM',
    title: t('CampusStay system maintenance 02:00 – 03:00 on 20/10'),
    body: t('The system will be offline for an upgrade. VietQR payments made during this time will be reconciled once service resumes.'),
    source: t('System administration'),
    date: '09/10/2026 17:00',
  },
];
