import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';

export function NotificationHeader() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Brand & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#F26F21] text-white flex items-center justify-center font-black text-xs shadow-xs">
            FPT
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 leading-tight">CampusStay</div>
            <div className="text-[10px] text-slate-400">Student Dormitory Portal</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition">Trang chủ</Link>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800">Thông báo</span>
        </div>
      </div>

      {/* Center: Campus Badge */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] font-bold text-slate-700">
        <span className="w-2 h-2 rounded-full bg-[#F26F21]" />
        <span>CAMPUS: FPT TÂN UYÊN</span>
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(APP_ROUTES.STUDENT.DASHBOARD)}
          className="px-3.5 py-1.5 rounded-lg bg-[#F26F21] hover:bg-[#D95A12] text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
        >
          <span>Vào Cổng KTX</span>
          <span>&gt;</span>
        </button>

        {/* Bell with red badge */}
        <div className="relative">
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200/80 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2">
          <div className="w-8 h-8 rounded-full bg-[#F26F21] text-white text-xs font-bold flex items-center justify-center shadow-xs">
            MA
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {user?.name || 'Nguyễn Thị Mai Anh'}
            </div>
            <div className="text-[10px] text-slate-400">
              {user?.studentId || 'SE171234'} • Sinh viên
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
