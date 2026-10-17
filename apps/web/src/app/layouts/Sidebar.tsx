import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  BedDouble,
  CreditCard,
  Wrench,
  CalendarCheck,
  Megaphone,
  Layers,
  CheckSquare,
  Repeat,
  ShieldCheck,
  BarChart3,
  Calendar,
  Sliders,
  DollarSign,
  Cpu,
  Link,
  FileText,
  Users,
  Building,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { ROLES, APP_ROUTES } from '@campusstay/constants';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** Điều hướng theo sitemap (docs/ARCHITECTURE.md §5). Hồ sơ mở từ menu tài khoản trên Header. */
const NAV: Record<string, NavItem[]> = {
  [ROLES.STUDENT]: [
    { label: 'Tổng quan', to: APP_ROUTES.STUDENT.DASHBOARD, icon: LayoutDashboard },
    { label: 'Đăng ký lưu trú', to: APP_ROUTES.STUDENT.REGISTRATION, icon: ClipboardList },
    { label: 'Phòng của tôi', to: APP_ROUTES.STUDENT.MY_ROOM, icon: BedDouble },
    { label: 'Hóa đơn & thanh toán', to: APP_ROUTES.STUDENT.INVOICES, icon: CreditCard },
    { label: 'Yêu cầu', to: APP_ROUTES.STUDENT.REQUESTS, icon: Wrench },
    { label: 'Check-in / Check-out', to: APP_ROUTES.STUDENT.CHECKIN, icon: CalendarCheck },
  ],
  [ROLES.STAFF]: [
    { label: 'Tổng quan', to: APP_ROUTES.STAFF.DASHBOARD, icon: LayoutDashboard },
    { label: 'Phòng & giường', to: APP_ROUTES.STAFF.INVENTORY, icon: Layers },
    { label: 'Đơn đăng ký', to: APP_ROUTES.STAFF.APPLICATIONS, icon: CheckSquare },
    { label: 'Xếp phòng', to: APP_ROUTES.STAFF.ASSIGNMENT, icon: Building },
    { label: 'Đổi phòng', to: APP_ROUTES.STAFF.ROOM_CHANGES, icon: Repeat },
    { label: 'Check-in / Check-out', to: APP_ROUTES.STAFF.CHECKIN_OUT, icon: CalendarCheck },
    { label: 'Bảo trì & kiểm tra', to: APP_ROUTES.STAFF.MAINTENANCE, icon: Wrench },
    { label: 'Gửi thông báo', to: APP_ROUTES.STAFF.BROADCAST, icon: Megaphone },
  ],
  [ROLES.MANAGER]: [
    { label: 'Tổng quan vận hành', to: APP_ROUTES.MANAGER.DASHBOARD, icon: LayoutDashboard },
    { label: 'Trung tâm phê duyệt', to: APP_ROUTES.MANAGER.APPROVALS, icon: ShieldCheck },
    { label: 'Duyệt xếp phòng', to: APP_ROUTES.MANAGER.ASSIGNMENT_APPROVAL, icon: CheckSquare },
    { label: 'Báo cáo', to: APP_ROUTES.MANAGER.REPORTS, icon: BarChart3 },
  ],
  [ROLES.ADMIN]: [
    { label: 'Tổng quan hệ thống', to: APP_ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
    { label: 'Kỳ học', to: APP_ROUTES.ADMIN.SEMESTERS, icon: Calendar },
    { label: 'Luật điều kiện', to: APP_ROUTES.ADMIN.RULES, icon: Sliders },
    { label: 'Loại phòng & giá', to: APP_ROUTES.ADMIN.PRICING, icon: DollarSign },
    { label: 'Engine xếp phòng', to: APP_ROUTES.ADMIN.ALLOCATION_ENGINE, icon: Cpu },
    { label: 'Tích hợp', to: APP_ROUTES.ADMIN.INTEGRATIONS, icon: Link },
    { label: 'Người dùng & vai trò', to: APP_ROUTES.ADMIN.USERS, icon: Users },
    { label: 'Báo cáo', to: APP_ROUTES.ADMIN.REPORTS, icon: BarChart3 },
    { label: 'Nhật ký kiểm toán', to: APP_ROUTES.ADMIN.AUDIT_LOGS, icon: FileText },
  ],
};

const COMMON_NAV: NavItem = { label: 'Thông báo chung', to: APP_ROUTES.COMMON.NOTIFICATIONS, icon: Megaphone };
const STORAGE_KEY = 'campusstay_sidebar_collapsed';

const readCollapsed = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

function Item({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        clsx(
          'relative flex items-center gap-3 rounded-xl text-sm font-medium transition',
          collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 py-2.5',
          isActive ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !collapsed && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#F26F21]" />}
          <item.icon className={clsx('w-[18px] h-[18px] shrink-0', isActive && 'text-[#F26F21]')} />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const role = useAuthStore((state) => state.user?.role);
  const navItems = (role && NAV[role]) || [];
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    } catch {
      /* bộ nhớ trình duyệt không khả dụng — bỏ qua */
    }
  }, [collapsed]);

  return (
    <aside
      className={clsx(
        'bg-white border-r border-slate-200 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 transition-[width] duration-200',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Điều hướng chính">
        {!collapsed && <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Chức năng</div>}
        {navItems.map((item) => <Item key={item.to} item={item} collapsed={collapsed} />)}
      </nav>
      <div className="px-3 py-3 border-t border-slate-200 space-y-1">
        <Item item={COMMON_NAV} collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
          className={clsx(
            'flex items-center gap-3 rounded-xl text-sm text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition',
            collapsed ? 'justify-center h-10 w-10 mx-auto' : 'w-full px-3 py-2.5'
          )}
        >
          {collapsed ? <PanelLeftOpen className="w-[18px] h-[18px]" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Thu gọn</span>}
        </button>
      </div>
    </aside>
  );
}
