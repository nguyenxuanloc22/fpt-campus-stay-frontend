// ──────────────────────────────────────────────
//  dashboardMockData.ts — Staff Dashboard Mock Data
//  Strongly-typed, centralised data for the Staff Dashboard.
// ──────────────────────────────────────────────

import { APP_ROUTES } from '@campusstay/constants';

/* ────────── Type definitions ────────── */

export type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM';

export interface Building {
  code: string;
  gender: 'Nữ' | 'Nam';
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
  campus: 'FPT University HCMC / Tân Uyên',
  shift: '07:30 – 17:00',
};

/* ────────── Buildings ────────── */

export const BUILDINGS: Building[] = [
  { code: 'A', gender: 'Nữ', beds: 288, used: 271, maintenance: 4 },
  { code: 'B', gender: 'Nam', beds: 312, used: 298, maintenance: 6 },
  { code: 'C', gender: 'Nữ', beds: 320, used: 276, maintenance: 2 },
  { code: 'D', gender: 'Nam', beds: 280, used: 230, maintenance: 3 },
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
    title: 'Ticket TK-10499: Mất điện tầng 3 Tòa D',
    subtitle: 'Đã vượt SLA 0.9 giờ — Cần xử lý ngay lập tức',
    priority: 'URGENT',
    route: APP_ROUTES.STAFF.MAINTENANCE,
    ctaLabel: 'Xử lý',
  },
  {
    id: 'act-002',
    title: 'Đề xuất xếp phòng BR-SP27-02 có 6 xung đột',
    subtitle: 'Rà soát & điều chỉnh trước khi gửi Manager',
    priority: 'HIGH',
    route: APP_ROUTES.STAFF.ASSIGNMENT,
    ctaLabel: 'Điều chỉnh',
  },
  {
    id: 'act-003',
    title: '4 đơn đăng ký bị gắn cờ cần rà soát',
    subtitle: 'Hồ sơ đào tạo cần đối soát / lý do đặc biệt',
    priority: 'HIGH',
    route: APP_ROUTES.STAFF.APPLICATIONS,
    ctaLabel: 'Rà soát',
  },
  {
    id: 'act-004',
    title: '3 biên bản trả phòng chờ xác minh',
    subtitle: 'Đối chiếu với biên bản nhận phòng',
    priority: 'MEDIUM',
    route: APP_ROUTES.STAFF.CHECKIN_OUT,
    ctaLabel: 'Xác minh',
  },
  {
    id: 'act-005',
    title: '5 ticket bảo trì đã duyệt chờ lên lịch kiểm tra',
    subtitle: 'Cần xếp lịch kiểm tra phòng trong tuần',
    priority: 'MEDIUM',
    route: APP_ROUTES.STAFF.MAINTENANCE,
    ctaLabel: 'Lên lịch',
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
  { who: 'Nguyễn Thu Hà', action: 'đã duyệt đơn APP-SP27-004801', timestamp: '5 phút trước' },
  { who: 'Lê Văn Tài', action: 'cập nhật ticket TK-10482 sang "Đang xử lý"', timestamp: '18 phút trước' },
  { who: 'Hệ thống', action: 'ghi nhận thanh toán VietQR 285.000 ₫ từ SE171234', timestamp: '32 phút trước' },
  { who: 'Trần Văn Cường', action: 'hoàn tất check-in cho SE190087 (A115)', timestamp: '1 giờ trước' },
];
