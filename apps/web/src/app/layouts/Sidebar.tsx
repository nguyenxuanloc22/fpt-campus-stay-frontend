import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Building,
  Users,
  FileText,
  CreditCard,
  Wrench,
  CalendarCheck,
  Bell,
  User,
  Layers,
  CheckSquare,
  Repeat,
  Megaphone,
  ShieldAlert,
  BarChart3,
  Award,
  Calendar,
  Sliders,
  DollarSign,
  Cpu,
  History,
  Link,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { ROLES, APP_ROUTES } from '@campusstay/constants';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function Sidebar() {
  const role = useAuthStore((state) => state.user?.role);

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case ROLES.STUDENT:
        return [
          { label: 'Tổng quan', to: APP_ROUTES.STUDENT.DASHBOARD, icon: LayoutDashboard },
          { label: 'Đăng ký KTX', to: APP_ROUTES.STUDENT.REGISTRATION, icon: ClipboardList },
          { label: 'Tòa & Phòng', to: APP_ROUTES.STUDENT.ROOMS, icon: Building },
          { label: 'Bạn cùng phòng', to: APP_ROUTES.STUDENT.ROOMMATES, icon: Users },
          { label: 'Hợp đồng số', to: APP_ROUTES.STUDENT.CONTRACT, icon: FileText },
          { label: 'Hóa đơn & VietQR', to: APP_ROUTES.STUDENT.INVOICES, icon: CreditCard },
          { label: 'Báo hỏng / Đổi phòng', to: APP_ROUTES.STUDENT.REQUESTS, icon: Wrench },
          { label: 'Check-in / Check-out', to: APP_ROUTES.STUDENT.CHECKIN, icon: CalendarCheck },
          { label: 'Thông báo', to: APP_ROUTES.STUDENT.NOTIFICATIONS, icon: Bell },
          { label: 'Hồ sơ cá nhân', to: APP_ROUTES.STUDENT.PROFILE, icon: User },
        ];
      case ROLES.STAFF:
        return [
          { label: 'Staff Dashboard', to: APP_ROUTES.STAFF.DASHBOARD, icon: LayoutDashboard },
          { label: 'Tồn kho phòng', to: APP_ROUTES.STAFF.INVENTORY, icon: Layers },
          { label: 'Duyệt đơn đăng ký', to: APP_ROUTES.STAFF.APPLICATIONS, icon: CheckSquare },
          { label: 'Xếp phòng thủ công', to: APP_ROUTES.STAFF.ROOM_ASSIGNMENT, icon: Building },
          { label: 'Yêu cầu đổi phòng', to: APP_ROUTES.STAFF.ROOM_TRANSFERS, icon: Repeat },
          { label: 'Check-in / Check-out', to: APP_ROUTES.STAFF.CHECKIN_OUT, icon: CalendarCheck },
          { label: 'Kiểm tra phòng', to: APP_ROUTES.STAFF.INSPECTIONS, icon: ClipboardList },
          { label: 'Xử lý bảo trì', to: APP_ROUTES.STAFF.MAINTENANCE, icon: Wrench },
          { label: 'Phát thông báo', to: APP_ROUTES.STAFF.BROADCAST, icon: Megaphone },
        ];
      case ROLES.MANAGER:
        return [
          { label: 'Manager Dashboard', to: APP_ROUTES.MANAGER.DASHBOARD, icon: LayoutDashboard },
          { label: 'Duyệt đơn ngoại lệ', to: APP_ROUTES.MANAGER.EXCEPTIONS, icon: ShieldAlert },
          { label: 'Duyệt xếp phòng', to: APP_ROUTES.MANAGER.BATCH_APPROVAL, icon: CheckSquare },
          { label: 'Báo cáo công suất', to: APP_ROUTES.MANAGER.REPORTS, icon: BarChart3 },
          { label: 'Hiệu suất Staff', to: APP_ROUTES.MANAGER.STAFF_PERFORMANCE, icon: Award },
        ];
      case ROLES.ADMIN:
        return [
          { label: 'Admin Dashboard', to: APP_ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
          { label: 'Cấu hình kỳ học', to: APP_ROUTES.ADMIN.SEMESTERS, icon: Calendar },
          { label: 'Luật điều kiện', to: APP_ROUTES.ADMIN.RULES, icon: Sliders },
          { label: 'Bảng giá phòng', to: APP_ROUTES.ADMIN.PRICING, icon: DollarSign },
          { label: 'Engine xếp phòng', to: APP_ROUTES.ADMIN.ALLOCATION_ENGINE, icon: Cpu },
          { label: 'Giám sát Batch runs', to: APP_ROUTES.ADMIN.BATCH_RUNS, icon: History },
          { label: 'Tích hợp SIS & VietQR', to: APP_ROUTES.ADMIN.INTEGRATIONS, icon: Link },
          { label: 'Người dùng & Role', to: APP_ROUTES.ADMIN.USERS, icon: ShieldCheck },
          { label: 'Báo cáo tài chính', to: APP_ROUTES.ADMIN.FINANCE, icon: BarChart3 },
          { label: 'Audit Logs', to: APP_ROUTES.ADMIN.AUDIT_LOGS, icon: FileText },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
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
      </div>
      <div className="p-4 border-t border-slate-200/60 bg-slate-50/50 text-[11px] text-slate-400 text-center font-medium">
        FPT University Tân Uyên © 2026
      </div>
    </aside>
  );
}
