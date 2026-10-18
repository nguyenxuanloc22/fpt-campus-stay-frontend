// ──────────────────────────────────────────────
//  dashboardMockData.ts — Staff Dashboard Mock Data
//  Strongly-typed, centralised data for the Staff Dashboard.
// ──────────────────────────────────────────────

import { APP_ROUTES } from '@campusstay/constants';

import { t } from '@shared-ui';
/* ────────── Type definitions ────────── */

export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM';

export interface Building {
  code: string;
  gender: 'Female' | 'Male';
  beds: number;
  used: number;
  maintenance: number;
}

export interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  priority: TaskPriority;
  route: string;
  ctaLabel: string;
}

export interface CheckinRecord {
  time: string;
  name: string;
  studentId: string;
  room: string;
  type: 'IN' | 'OUT';
}

export interface ActivityEntry {
  who: string;
  action: string;
  timestamp: string;
}

export interface StaffProfile {
  name: string;
  roleBadge: string;
  campus: string;
  shift: string;
}

/* ────────── Staff Profile ────────── */

export const STAFF_PROFILE: StaffProfile = {
  name: 'Trần Văn Cường',
  roleBadge: 'Residence Life Staff',
  campus: t('FPT University HCMC / Tan Uyen'),
  shift: '07:30 – 17:00',
};

/* ────────── Buildings ────────── */

export const BUILDINGS: Building[] = [
  { code: 'A', gender: 'Female', beds: 288, used: 271, maintenance: 4 },
  { code: 'B', gender: 'Male', beds: 312, used: 298, maintenance: 6 },
  { code: 'C', gender: 'Female', beds: 320, used: 276, maintenance: 2 },
  { code: 'D', gender: 'Male', beds: 280, used: 230, maintenance: 3 },
];

/* ────────── Dynamic Stats (derived) ────────── */

export const totalBeds = BUILDINGS.reduce((sum, b) => sum + b.beds, 0);
export const occupiedBeds = BUILDINGS.reduce((sum, b) => sum + b.used, 0);
export const availableBeds = totalBeds - occupiedBeds;
export const occupancyRate = ((occupiedBeds / totalBeds) * 100).toFixed(1);

export const pendingApplications = 18;
export const activeTickets = 23;
export const todayCheckIn = 12;
export const todayCheckOut = 4;

/* ────────── Priority Action Items ────────── */

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'act-001',
    title: t('TK-10499: power outage on floor 3, Building D'),
    subtitle: t('0.9 hours past SLA — handle immediately'),
    priority: 'URGENT',
    route: APP_ROUTES.STAFF.MAINTENANCE,
    ctaLabel: t('Handle'),
  },
  {
    id: 'act-002',
    title: t('Allocation proposal BR-SP27-02 has 6 conflicts'),
    subtitle: t('Review & adjust before sending to the manager'),
    priority: 'HIGH',
    route: APP_ROUTES.STAFF.ASSIGNMENT,
    ctaLabel: t('Adjust'),
  },
  {
    id: 'act-003',
    title: t('4 flagged applications need review'),
    subtitle: t('Academic records to reconcile / special reasons'),
    priority: 'HIGH',
    route: APP_ROUTES.STAFF.APPLICATIONS,
    ctaLabel: t('Review'),
  },
  {
    id: 'act-004',
    title: t('3 check-out reports awaiting verification'),
    subtitle: t('Compare with the check-in reports'),
    priority: 'MEDIUM',
    route: APP_ROUTES.STAFF.CHECKIN_OUT,
    ctaLabel: t('Verify'),
  },
  {
    id: 'act-005',
    title: t('5 approved maintenance requests waiting for inspection scheduling'),
    subtitle: t('Room inspections need to be scheduled this week'),
    priority: 'MEDIUM',
    route: APP_ROUTES.STAFF.MAINTENANCE,
    ctaLabel: t('Schedule'),
  },
];

/* ────────── Recent Check-in / Check-out (max 5) ────────── */

export const RECENT_CHECKINS: CheckinRecord[] = [
  { time: '08:30', name: 'Lê Thị Hồng Nhung', studentId: 'SE190112', room: 'C305-G2', type: 'IN' },
  { time: '09:00', name: 'Đỗ Minh Quân', studentId: 'SE190455', room: 'B210-G4', type: 'IN' },
  { time: '09:30', name: 'Phan Thùy Dung', studentId: 'GD190087', room: 'A115-G1', type: 'IN' },
  { time: '10:30', name: 'Trương Gia Bảo', studentId: 'AI180990', room: 'D402-G2', type: 'OUT' },
  { time: '14:30', name: 'Hồ Tấn Phát', studentId: 'SE170321', room: 'B312-G3', type: 'OUT' },
];

/* ────────── Recent Activity ────────── */

export const RECENT_ACTIVITY: ActivityEntry[] = [
  { who: 'Nguyễn Thu Hà', action: t('approved application APP-SP27-004801'), timestamp: t('5 minutes ago') },
  { who: 'Lê Văn Tài', action: t('updated maintenance request TK-10482 to "Processing"'), timestamp: t('18 minutes ago') },
  { who: t('System'), action: t('recorded a VietQR payment of 285.000 ₫ from SE171234'), timestamp: t('32 minutes ago') },
  { who: 'Trần Văn Cường', action: t('completed check-in for SE190087 (A115)'), timestamp: t('1 hour ago') },
];
