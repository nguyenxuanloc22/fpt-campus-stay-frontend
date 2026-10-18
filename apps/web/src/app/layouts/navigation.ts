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
  Settings2,
  Server,
  FolderKanban,
  MessagesSquare,
  type LucideIcon,
} from 'lucide-react';
import { ROLES, APP_ROUTES, type Role } from '@campusstay/constants';
import { t } from '@shared-ui';

/** Cấu hình điều hướng theo vai trò — dùng chung cho Sidebar, ngăn kéo mobile và thanh tab sinh viên. */

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

/** Mục cấp 1: một trang, hoặc một nhóm sổ xuống chứa các trang con */
export type NavEntry = NavItem | { label: string; icon: LucideIcon; children: NavItem[] };

export const isGroup = (e: NavEntry): e is Extract<NavEntry, { children: NavItem[] }> => 'children' in e;

const S = APP_ROUTES.STUDENT;
const ST = APP_ROUTES.STAFF;
const M = APP_ROUTES.MANAGER;
const A = APP_ROUTES.ADMIN;

const overview = (to: string): NavItem => ({ label: t('Overview'), to, icon: LayoutDashboard });
const announcements: NavItem = { label: t('Announcements'), to: APP_ROUTES.COMMON.NOTIFICATIONS, icon: Megaphone };

export const NAV: Record<Role, NavEntry[]> = {
  [ROLES.STUDENT]: [
    overview(S.DASHBOARD),
    {
      label: t('Accommodation'),
      icon: BedDouble,
      children: [
        { label: t('Room registration'), to: S.REGISTRATION, icon: ClipboardList },
        { label: t('My room'), to: S.MY_ROOM, icon: BedDouble },
        { label: t('Check-in/out'), to: S.CHECKIN, icon: CalendarCheck },
      ],
    },
    {
      label: t('Requests'),
      icon: FileText,
      children: [
        { label: t('Submit a request'), to: S.APPLICATION_NEW, icon: FilePlus2 },
        { label: t('My requests'), to: S.APPLICATIONS, icon: FileText },
      ],
    },
    { label: t('Invoices & payments'), to: S.INVOICES, icon: CreditCard },
    announcements,
  ],
  [ROLES.STAFF]: [
    overview(ST.DASHBOARD),
    {
      label: t('Applications & allocation'),
      icon: FolderKanban,
      children: [
        { label: t('Application review'), to: ST.APPLICATIONS, icon: CheckSquare },
        { label: t('Room allocation'), to: ST.ASSIGNMENT, icon: Building },
        { label: t('Room changes'), to: ST.ROOM_CHANGES, icon: Repeat },
      ],
    },
    { label: t('Rooms & beds'), to: ST.INVENTORY, icon: Layers },
    { label: t('Check-in/out'), to: ST.CHECKIN_OUT, icon: CalendarCheck },
    { label: t('Maintenance & inspection'), to: ST.MAINTENANCE, icon: Wrench },
    {
      label: t('Communication'),
      icon: MessagesSquare,
      children: [{ label: t('Send announcement'), to: ST.BROADCAST, icon: Send }, announcements],
    },
  ],
  [ROLES.MANAGER]: [
    overview(M.DASHBOARD),
    {
      label: t('Approvals'),
      icon: ShieldCheck,
      children: [
        { label: t('Approval center'), to: M.APPROVALS, icon: ShieldCheck },
        { label: t('Allocation approval'), to: M.ASSIGNMENT_APPROVAL, icon: CheckSquare },
      ],
    },
    { label: t('Reports'), to: M.REPORTS, icon: BarChart3 },
    announcements,
  ],
  [ROLES.ADMIN]: [
    overview(A.DASHBOARD),
    {
      label: t('Configuration'),
      icon: Settings2,
      children: [
        { label: t('Semesters & timeline'), to: A.SEMESTERS, icon: Calendar },
        { label: t('Eligibility rules'), to: A.RULES, icon: Sliders },
        { label: t('Room types & pricing'), to: A.PRICING, icon: DollarSign },
        { label: t('Allocation engine'), to: A.ALLOCATION_ENGINE, icon: Cpu },
      ],
    },
    {
      label: t('System'),
      icon: Server,
      children: [
        { label: t('Accounts & roles'), to: A.USERS, icon: Users },
        { label: t('Integrations'), to: A.INTEGRATIONS, icon: LinkIcon },
        { label: t('Change log'), to: A.AUDIT_LOGS, icon: History },
      ],
    },
    { label: t('Reports'), to: A.REPORTS, icon: BarChart3 },
    announcements,
  ],
};

/** Thanh tab dưới đáy cho sinh viên trên mobile (<= 640px); mục thứ 5 “More” mở menu đầy đủ. */
export const STUDENT_TABS: NavItem[] = [
  { label: t('Overview'), to: S.DASHBOARD, icon: LayoutDashboard },
  { label: t('Room'), to: S.MY_ROOM, icon: BedDouble },
  { label: t('Invoices'), to: S.INVOICES, icon: CreditCard },
  { label: t('Requests'), to: S.APPLICATIONS, icon: FileText },
];

const SEGMENT_LABEL: Record<string, string> = {
  student: t('Student'),
  staff: t('Dormitory staff'),
  manager: t('Dormitory manager'),
  admin: t('Administration'),
  dashboard: t('Overview'),
  registration: t('Room registration'),
  'my-room': t('My room'),
  new: t('Submit a request'),
  invoices: t('Invoices & payments'),
  checkin: t('Check-in/out'),
  notifications: t('Announcements'),
  profile: t('Profile'),
  inventory: t('Rooms & beds'),
  assignment: t('Room allocation'),
  'room-changes': t('Room changes'),
  'checkin-out': t('Check-in/out'),
  maintenance: t('Maintenance & inspection'),
  broadcast: t('Send announcement'),
  approvals: t('Approval center'),
  'assignment-approval': t('Allocation approval'),
  reports: t('Reports'),
  semesters: t('Semesters & timeline'),
  rules: t('Eligibility rules'),
  pricing: t('Room types & pricing'),
  'allocation-engine': t('Allocation engine'),
  integrations: t('Integrations'),
  users: t('Accounts & roles'),
  'audit-logs': t('Change log'),
};

/** Đường dẫn → nhãn breadcrumb (ví dụ /student/applications/new → Student › Requests › Submit a request). */
export function breadcrumbOf(pathname: string): string[] {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((s, i) => {
    if (s === 'applications') {
      if (segments[0] === 'staff') return t('Application review');
      return i === segments.length - 1 ? t('My requests') : t('Requests');
    }
    return SEGMENT_LABEL[s] ?? s;
  });
}
