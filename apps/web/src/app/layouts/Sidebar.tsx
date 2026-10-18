import { Link, NavLink } from 'react-router-dom';
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
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { ROLES, APP_ROUTES } from '@campusstay/constants';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const INFO_GROUP = (dashboard: string): NavGroup => ({
  title: 'Thông tin',
  items: [
    { label: 'Tổng quan', to: dashboard, icon: LayoutDashboard },
    { label: 'Thông báo chung', to: APP_ROUTES.COMMON.NOTIFICATIONS, icon: Megaphone },
  ],
});

/** Điều hướng theo nhóm chức năng (docs/ARCHITECTURE.md §5). */
const NAV: Record<string, NavGroup[]> = {
  [ROLES.STUDENT]: [
    INFO_GROUP(APP_ROUTES.STUDENT.DASHBOARD),
    {
      title: 'Lưu trú',
      items: [
        { label: 'Đăng ký lưu trú', to: APP_ROUTES.STUDENT.REGISTRATION, icon: ClipboardList },
        { label: 'Phòng của tôi', to: APP_ROUTES.STUDENT.MY_ROOM, icon: BedDouble },
        { label: 'Check-in / Check-out', to: APP_ROUTES.STUDENT.CHECKIN, icon: CalendarCheck },
      ],
    },
    {
      title: 'Đơn từ',
      items: [
        { label: 'Gửi đơn', to: APP_ROUTES.STUDENT.APPLICATION_NEW, icon: FilePlus2 },
        { label: 'Đơn của tôi', to: APP_ROUTES.STUDENT.APPLICATIONS, icon: FileText },
      ],
    },
    {
      title: 'Tài chính',
      items: [{ label: 'Hóa đơn & thanh toán', to: APP_ROUTES.STUDENT.INVOICES, icon: CreditCard }],
    },
  ],
  [ROLES.STAFF]: [
    INFO_GROUP(APP_ROUTES.STAFF.DASHBOARD),
    {
      title: 'Phòng & lưu trú',
      items: [
        { label: 'Phòng & giường', to: APP_ROUTES.STAFF.INVENTORY, icon: Layers },
        { label: 'Xếp phòng', to: APP_ROUTES.STAFF.ASSIGNMENT, icon: Building },
        { label: 'Check-in / Check-out', to: APP_ROUTES.STAFF.CHECKIN_OUT, icon: CalendarCheck },
      ],
    },
    {
      title: 'Đơn từ',
      items: [
        { label: 'Đơn đăng ký', to: APP_ROUTES.STAFF.APPLICATIONS, icon: CheckSquare },
        { label: 'Đổi phòng', to: APP_ROUTES.STAFF.ROOM_CHANGES, icon: Repeat },
      ],
    },
    {
      title: 'Vận hành',
      items: [
        { label: 'Bảo trì & kiểm tra', to: APP_ROUTES.STAFF.MAINTENANCE, icon: Wrench },
        { label: 'Gửi thông báo', to: APP_ROUTES.STAFF.BROADCAST, icon: Megaphone },
      ],
    },
  ],
  [ROLES.MANAGER]: [
    INFO_GROUP(APP_ROUTES.MANAGER.DASHBOARD),
    {
      title: 'Phê duyệt',
      items: [
        { label: 'Trung tâm phê duyệt', to: APP_ROUTES.MANAGER.APPROVALS, icon: ShieldCheck },
        { label: 'Duyệt xếp phòng', to: APP_ROUTES.MANAGER.ASSIGNMENT_APPROVAL, icon: CheckSquare },
      ],
    },
    { title: 'Báo cáo', items: [{ label: 'Báo cáo vận hành', to: APP_ROUTES.MANAGER.REPORTS, icon: BarChart3 }] },
  ],
  [ROLES.ADMIN]: [
    INFO_GROUP(APP_ROUTES.ADMIN.DASHBOARD),
    {
      title: 'Cấu hình',
      items: [
        { label: 'Kỳ học', to: APP_ROUTES.ADMIN.SEMESTERS, icon: Calendar },
        { label: 'Luật điều kiện', to: APP_ROUTES.ADMIN.RULES, icon: Sliders },
        { label: 'Loại phòng & giá', to: APP_ROUTES.ADMIN.PRICING, icon: DollarSign },
        { label: 'Engine xếp phòng', to: APP_ROUTES.ADMIN.ALLOCATION_ENGINE, icon: Cpu },
      ],
    },
    {
      title: 'Hệ thống',
      items: [
        { label: 'Người dùng & vai trò', to: APP_ROUTES.ADMIN.USERS, icon: Users },
        { label: 'Tích hợp', to: APP_ROUTES.ADMIN.INTEGRATIONS, icon: LinkIcon },
        { label: 'Nhật ký kiểm toán', to: APP_ROUTES.ADMIN.AUDIT_LOGS, icon: History },
      ],
    },
    { title: 'Báo cáo', items: [{ label: 'Báo cáo', to: APP_ROUTES.ADMIN.REPORTS, icon: BarChart3 }] },
  ],
};

function Item({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
      end
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        clsx(
          'group flex items-center gap-3 rounded-xl transition',
          collapsed ? 'justify-center p-1.5' : 'px-2 py-1.5',
          isActive ? 'bg-orange-50' : 'hover:bg-slate-50'
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={clsx(
              'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition',
              isActive ? 'bg-[#F26F21] text-white shadow-sm shadow-orange-500/30' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#F26F21]'
            )}
          >
            <item.icon className="w-[18px] h-[18px]" />
          </span>
          {!collapsed && (
            <span className={clsx('text-sm font-semibold truncate', isActive ? 'text-[#F26F21]' : 'text-slate-700')}>{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const role = useAuthStore((state) => state.user?.role);
  const groups = (role && NAV[role]) || [];

  return (
    <aside
      className={clsx(
        'bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0 transition-[width] duration-200 z-20',
        collapsed ? 'w-[76px]' : 'w-[264px]'
      )}
    >
      <Link to="/" className="h-16 shrink-0 flex items-center gap-3 px-4 border-b border-slate-200">
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26F21] to-[#FF9A4D] text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0">FPT</span>
        {!collapsed && (
          <span className="min-w-0">
            <span className="block text-sm font-extrabold text-slate-900 leading-tight">CampusStay</span>
            <span className="block text-[11px] font-semibold text-[#F26F21] tracking-wide">FPT UNIVERSITY</span>
          </span>
        )}
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5" aria-label="Điều hướng chính">
        {groups.map((g) => (
          <div key={g.title}>
            {collapsed ? (
              <div className="mx-3 mb-2 border-t border-slate-200" />
            ) : (
              <div className="px-2 pb-2 mb-1 border-b border-slate-100 text-[11px] font-bold uppercase tracking-[0.12em] text-[#F26F21]">{g.title}</div>
            )}
            <div className="space-y-0.5">
              {g.items.map((item) => <Item key={item.to} item={item} collapsed={collapsed} />)}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-400">© 2026 FPT University · Tân Uyên</div>
      )}
    </aside>
  );
}
