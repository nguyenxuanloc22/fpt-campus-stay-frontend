import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Building,
  BedDouble,
  CreditCard,
  Wrench,
  CalendarCheck,
  Bell,
  Layers,
  CheckSquare,
  Repeat,
  Megaphone,
  ShieldCheck,
  BarChart3,
  Calendar,
  Sliders,
  DollarSign,
  Cpu,
  Link,
  FileText,
  Users,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { ROLES, APP_ROUTES } from '@campusstay/constants';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

/** Điều hướng theo sitemap trong docs/ARCHITECTURE.md §5. Hồ sơ sinh viên mở từ avatar ở Header. */
const NAV: Record<string, NavItem[]> = {
  [ROLES.STUDENT]: [
    { label: 'Tổng quan', to: APP_ROUTES.STUDENT.DASHBOARD, icon: LayoutDashboard },
    { label: 'Đăng ký lưu trú', to: APP_ROUTES.STUDENT.REGISTRATION, icon: ClipboardList },
    { label: 'Tra cứu phòng', to: APP_ROUTES.STUDENT.ROOMS, icon: Building },
    { label: 'Phòng của tôi', to: APP_ROUTES.STUDENT.MY_ROOM, icon: BedDouble },
    { label: 'Hóa đơn & thanh toán', to: APP_ROUTES.STUDENT.INVOICES, icon: CreditCard },
    { label: 'Yêu cầu', to: APP_ROUTES.STUDENT.REQUESTS, icon: Wrench },
    { label: 'Check-in / Check-out', to: APP_ROUTES.STUDENT.CHECKIN, icon: CalendarCheck },
    { label: 'Thông báo', to: APP_ROUTES.STUDENT.NOTIFICATIONS, icon: Bell },
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

export function Sidebar() {
  const role = useAuthStore((state) => state.user?.role);
  const navItems = (role && NAV[role]) || [];

  return (
    <aside className="w-64 flexbg-white border-r border-slate-200/80 flex-col shrink-0 h-[calc(100vh-3.5rem)] sticky top-14">
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Điều hướng chính">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all',
                isActive
                  ? 'bg-[#FFF2EA] text-[#F26F21] shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200/60 bg-slate-50/50 text-[11px] text-slate-400 text-center font-medium">
        FPT University Tân Uyên © 2026
      </div>
    </aside>
  );
}
