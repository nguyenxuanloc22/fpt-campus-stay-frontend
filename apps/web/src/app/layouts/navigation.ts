import {
  LayoutDashboard,
  Megaphone,
  ClipboardList,
  BedDouble,
  CalendarCheck,
  FilePlus2,
  FileText,
  CreditCard,
  Layers,
  CheckSquare,
  Repeat,
  Wrench,
  ShieldCheck,
  BarChart3,
  Calendar,
  Sliders,
  DollarSign,
  Cpu,
  Link as LinkIcon,
  Users,
  Building,
  History,
  Send,
  type LucideIcon,
} from 'lucide-react';
import { ROLES, APP_ROUTES, type Role } from '@campusstay/constants';

/** Cấu hình điều hướng theo vai trò — dùng chung cho Sidebar, menu “Thêm” và thanh tab mobile. */

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export interface NavGroup {
  /** Không có tiêu đề → các mục hiển thị như mục cấp 1 */
  title?: string;
  items: NavItem[];
}

const S = APP_ROUTES.STUDENT;
const ST = APP_ROUTES.STAFF;
const M = APP_ROUTES.MANAGER;
const A = APP_ROUTES.ADMIN;

const overview = (to: string): NavGroup => ({ items: [{ label: 'Tổng quan', to, icon: LayoutDashboard }] });
const other = (...extra: NavItem[]): NavGroup => ({
  title: 'Khác',
  items: [...extra, { label: 'Thông báo chung', to: APP_ROUTES.COMMON.NOTIFICATIONS, icon: Megaphone }],
});

export const NAV: Record<Role, NavGroup[]> = {
  [ROLES.STUDENT]: [
    overview(S.DASHBOARD),
    {
      title: 'Lưu trú',
      items: [
        { label: 'Đăng ký lưu trú', to: S.REGISTRATION, icon: ClipboardList },
        { label: 'Phòng của tôi', to: S.MY_ROOM, icon: BedDouble },
        { label: 'Check-in/out', to: S.CHECKIN, icon: CalendarCheck },
      ],
    },
    {
      title: 'Đơn từ',
      items: [
        { label: 'Gửi đơn', to: S.APPLICATION_NEW, icon: FilePlus2 },
        { label: 'Đơn của tôi', to: S.APPLICATIONS, icon: FileText },
      ],
    },
    { title: 'Tài chính', items: [{ label: 'Hóa đơn & thanh toán', to: S.INVOICES, icon: CreditCard }] },
    other(),
  ],
  [ROLES.STAFF]: [
    overview(ST.DASHBOARD),
    {
      title: 'Hồ sơ & xếp phòng',
      items: [
        { label: 'Thẩm định hồ sơ', to: ST.APPLICATIONS, icon: CheckSquare },
        { label: 'Xếp phòng', to: ST.ASSIGNMENT, icon: Building },
        { label: 'Đổi phòng', to: ST.ROOM_CHANGES, icon: Repeat },
      ],
    },
    { items: [{ label: 'Phòng & giường', to: ST.INVENTORY, icon: Layers }] },
    { items: [{ label: 'Check-in/out', to: ST.CHECKIN_OUT, icon: CalendarCheck }] },
    { items: [{ label: 'Bảo trì & kiểm tra', to: ST.MAINTENANCE, icon: Wrench }] },
    other({ label: 'Gửi thông báo', to: ST.BROADCAST, icon: Send }),
  ],
  [ROLES.MANAGER]: [
    overview(M.DASHBOARD),
    {
      title: 'Phê duyệt',
      items: [
        { label: 'Trung tâm phê duyệt', to: M.APPROVALS, icon: ShieldCheck },
        { label: 'Duyệt xếp phòng', to: M.ASSIGNMENT_APPROVAL, icon: CheckSquare },
      ],
    },
    { items: [{ label: 'Báo cáo', to: M.REPORTS, icon: BarChart3 }] },
    other(),
  ],
  [ROLES.ADMIN]: [
    overview(A.DASHBOARD),
    {
      title: 'Cấu hình',
      items: [
        { label: 'Học kỳ', to: A.SEMESTERS, icon: Calendar },
        { label: 'Luật điều kiện', to: A.RULES, icon: Sliders },
        { label: 'Loại phòng & giá', to: A.PRICING, icon: DollarSign },
        { label: 'Engine xếp phòng', to: A.ALLOCATION_ENGINE, icon: Cpu },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        { label: 'Tài khoản & vai trò', to: A.USERS, icon: Users },
        { label: 'Tích hợp', to: A.INTEGRATIONS, icon: LinkIcon },
        { label: 'Nhật ký thay đổi', to: A.AUDIT_LOGS, icon: History },
      ],
    },
    { items: [{ label: 'Báo cáo', to: A.REPORTS, icon: BarChart3 }] },
    other(),
  ],
};

/** Thanh tab dưới đáy cho sinh viên trên mobile (<= 640px); mục thứ 5 “Thêm” mở menu đầy đủ. */
export const STUDENT_TABS: NavItem[] = [
  { label: 'Tổng quan', to: S.DASHBOARD, icon: LayoutDashboard },
  { label: 'Phòng', to: S.MY_ROOM, icon: BedDouble },
  { label: 'Hóa đơn', to: S.INVOICES, icon: CreditCard },
  { label: 'Đơn', to: S.APPLICATIONS, icon: FileText },
];

const SEGMENT_LABEL: Record<string, string> = {
  student: 'Sinh viên',
  staff: 'Cán bộ KTX',
  manager: 'Trưởng ban',
  admin: 'Quản trị',
  dashboard: 'Tổng quan',
  registration: 'Đăng ký lưu trú',
  'my-room': 'Phòng của tôi',
  new: 'Gửi đơn',
  invoices: 'Hóa đơn & thanh toán',
  checkin: 'Check-in/out',
  notifications: 'Thông báo chung',
  profile: 'Hồ sơ cá nhân',
  inventory: 'Phòng & giường',
  assignment: 'Xếp phòng',
  'room-changes': 'Đổi phòng',
  'checkin-out': 'Check-in/out',
  maintenance: 'Bảo trì & kiểm tra',
  broadcast: 'Gửi thông báo',
  approvals: 'Trung tâm phê duyệt',
  'assignment-approval': 'Duyệt xếp phòng',
  reports: 'Báo cáo',
  semesters: 'Học kỳ',
  rules: 'Luật điều kiện',
  pricing: 'Loại phòng & giá',
  'allocation-engine': 'Engine xếp phòng',
  integrations: 'Tích hợp',
  users: 'Tài khoản & vai trò',
  'audit-logs': 'Nhật ký thay đổi',
};

/** Đường dẫn → nhãn breadcrumb (ví dụ /student/applications/new → Sinh viên › Đơn từ › Gửi đơn). */
export function breadcrumbOf(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((s, i) => {
    if (s === 'applications') {
      if (segments[0] === 'staff') return 'Thẩm định hồ sơ';
      return i === segments.length - 1 ? 'Đơn của tôi' : 'Đơn từ';
    }
    return SEGMENT_LABEL[s] ?? s;
  });
}
