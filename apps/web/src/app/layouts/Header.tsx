import { Building2, LogOut, UserCircle2, ArrowRightLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import { ROLES, type Role, ROLE_LABELS, APP_ROUTES } from '@campusstay/constants';

export function Header() {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuthStore();

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

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-[#FFF2EA] text-[#F26F21] group-hover:bg-[#F26F21] group-hover:text-white transition flex items-center justify-center font-bold">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-base text-[#1A365D] group-hover:text-[#F26F21] transition">CampusStay FPT</span>
          <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-[#F26F21]">
            Tân Uyên
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        {/* Quick Role Switcher for committee demo */}
        <div className="hidden md:flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-medium">Demo Role:</span>
          <select
            value={user?.role || ROLES.STUDENT}
            onChange={handleSwitch}
            className="bg-transparent font-semibold text-[#F26F21] focus:outline-none cursor-pointer"
          >
            {(Object.keys(ROLES) as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <UserCircle2 className="w-8 h-8 text-slate-400" />
          <div className="text-left hidden lg:block">
            <div className="text-xs font-bold text-slate-800">{user?.name}</div>
            <div className="text-[11px] text-slate-500">{user?.role ? ROLE_LABELS[user.role] : ''}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Đăng xuất"
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
