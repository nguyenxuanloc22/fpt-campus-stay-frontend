import { Link } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';

export function HomeHeader() {
  const { isAuthenticated, user } = useAuthStore();

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return APP_ROUTES.ADMIN.DASHBOARD;
    if (user.role === 'MANAGER') return APP_ROUTES.MANAGER.DASHBOARD;
    if (user.role === 'STAFF') return APP_ROUTES.STAFF.DASHBOARD;
    return APP_ROUTES.STUDENT.DASHBOARD;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F26F21] flex items-center justify-center font-black text-white text-base tracking-wider shadow-md">
            FPT
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-tight">CampusStay</div>
            <div className="text-slate-400 text-xs">KTX Tân Uyên • Bình Dương</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#hero" className="hover:text-white transition">Trang chủ</a>
          <a href="#rooms" className="hover:text-white transition">Loại phòng</a>
          <a href="#amenities" className="hover:text-white transition">Tiện ích</a>
          <a href="#process" className="hover:text-white transition">Quy trình</a>
          <a href="#contact" className="hover:text-white transition">Liên hệ</a>
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to={getDashboardRoute()}
              className="px-5 py-2.5 rounded-full bg-[#F26F21] hover:bg-[#D95A12] text-white text-sm font-semibold transition shadow-md"
            >
              Vào Cổng {user?.role} →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-full border border-[#F26F21] text-[#F26F21] hover:bg-[#F26F21] hover:text-white text-sm font-semibold transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-full bg-[#F26F21] hover:bg-[#D95A12] text-white text-sm font-semibold transition shadow-md shadow-orange-500/20"
              >
                Đăng ký ngay
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
