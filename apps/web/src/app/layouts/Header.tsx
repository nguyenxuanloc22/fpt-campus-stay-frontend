import { LogOut, ArrowRightLeft, Bell, ChevronRight } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import { ROLES, type Role, ROLE_LABELS, APP_ROUTES } from '@campusstay/constants';

/** Map pathname segments to Vietnamese breadcrumb labels. */
const BREADCRUMB_LABELS: Record<string, string> = {
  student: 'Sinh viên',
  staff: 'Cán bộ',
  manager: 'Quản lý',
  admin: 'Quản trị',
  dashboard: 'Tổng quan',
  registration: 'Đăng ký KTX',
  rooms: 'Tòa & Phòng',
  roommates: 'Bạn cùng phòng',
  contract: 'Hợp đồng số',
  invoices: 'Hóa đơn',
  requests: 'Yêu cầu',
  checkin: 'Check-in',
  notifications: 'Thông báo',
  profile: 'Hồ sơ',
  inventory: 'Tồn kho phòng',
  applications: 'Duyệt đơn',
  'room-assignment': 'Xếp phòng',
  'room-transfers': 'Đổi phòng',
  'checkin-out': 'Check-in/out',
  inspections: 'Kiểm tra phòng',
  maintenance: 'Bảo trì',
  broadcast: 'Phát thông báo',
  exceptions: 'Ngoại lệ',
  'batch-approval': 'Duyệt xếp phòng',
  reports: 'Báo cáo',
  'staff-performance': 'Hiệu suất',
  semesters: 'Cấu hình kỳ',
  rules: 'Luật điều kiện',
  pricing: 'Bảng giá',
  'allocation-engine': 'Engine xếp phòng',
  'batch-runs': 'Batch runs',
  integrations: 'Tích hợp',
  users: 'Người dùng',
  finance: 'Tài chính',
  'audit-logs': 'Audit Logs',
};

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, idx) => ({
    label: BREADCRUMB_LABELS[seg] || seg,
    path: '/' + segments.slice(0, idx + 1).join('/'),
    isLast: idx === segments.length - 1,
  }));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();
}

export function Header() {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuthStore();
  const breadcrumbs = useBreadcrumbs();

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.AUTH.LOGIN);
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as Role;
    switchRole(newRole);
    if (newRole === ROLES.STUDENT) navigate(APP_ROUTES.STUDENT.DASHBOARD);
    else if (newRole === ROLES.STAFF) navigate(APP_ROUTES.STAFF.DASHBOARD);
    else if (newRole === ROLES.MANAGER) navigate(APP_ROUTES.MANAGER.DASHBOARD);
    else if (newRole === ROLES.ADMIN) navigate(APP_ROUTES.ADMIN.DASHBOARD);
  };

  const initials = user?.name ? getInitials(user.name) : '??';

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Brand + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#F26F21] text-white flex items-center justify-center font-black text-[10px] shadow-xs">
            FPT
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-sm text-[#1A365D] group-hover:text-[#F26F21] transition leading-tight">
              CampusStay FPT
            </span>
            <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-100 text-[#F26F21]">
              Tân Uyên
            </span>
          </div>
        </Link>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 pl-3 border-l border-slate-200 text-xs text-slate-500 min-w-0">
            <Link to="/" className="hover:text-slate-800 transition shrink-0">Trang chủ</Link>
            {breadcrumbs.map((crumb) => (
              <span key={crumb.path} className="flex items-center gap-1 min-w-0">
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
                {crumb.isLast ? (
                  <span className="font-semibold text-slate-800 truncate">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-slate-800 transition truncate">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Campus Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[10px] font-bold text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F26F21]" />
          <span>FPT TÂN UYÊN</span>
        </div>

        {/* Quick Role Switcher */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
          <ArrowRightLeft className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400 font-medium">Demo:</span>
          <select
            value={user?.role || ROLES.STUDENT}
            onChange={handleSwitch}
            className="bg-transparent font-semibold text-[#F26F21] focus:outline-none cursor-pointer text-[11px]"
          >
            {(Object.keys(ROLES) as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => navigate(APP_ROUTES.STUDENT.NOTIFICATIONS)}
          className="relative w-8 h-8 rounded-lg border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-500 transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#F26F21] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
            {initials}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-[11px] font-bold text-slate-800 leading-tight truncate max-w-[140px]">
              {user?.name}
            </div>
            <div className="text-[10px] text-slate-400">
              {user?.role ? ROLE_LABELS[user.role] : ''}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title="Đăng xuất"
          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
