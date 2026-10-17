import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { ROLES, type Role, APP_ROUTES } from '@campusstay/constants';
import { LoginHeroPanel } from './components/LoginHeroPanel';

/**
 * F0 — Đăng nhập bằng Google (Context Diagram): chỉ chấp nhận tài khoản @fpt.edu.vn,
 * Backend ánh xạ email → vai trò. Khối "Chế độ demo" chỉ hiển thị khi VITE_DEMO_MODE khác 'false'.
 */

const HOME: Record<Role, string> = {
  [ROLES.STUDENT]: APP_ROUTES.STUDENT.DASHBOARD,
  [ROLES.STAFF]: APP_ROUTES.STAFF.DASHBOARD,
  [ROLES.MANAGER]: APP_ROUTES.MANAGER.DASHBOARD,
  [ROLES.ADMIN]: APP_ROUTES.ADMIN.DASHBOARD,
};

const DEMO_ROLES: { role: Role; label: string }[] = [
  { role: ROLES.STUDENT, label: 'Sinh viên' },
  { role: ROLES.STAFF, label: 'Cán bộ KTX' },
  { role: ROLES.MANAGER, label: 'Trưởng ban' },
  { role: ROLES.ADMIN, label: 'Quản trị viên' },
];

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRole } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const login = (role: Role) => {
    loginWithRole(role);
    navigate(HOME[role]);
  };

  const googleLogin = () => {
    setLoading(true);
    // Bản thật: chuyển hướng tới Google OAuth (hd=fpt.edu.vn); Backend trả JWT kèm vai trò.
    window.setTimeout(() => login(ROLES.STUDENT), 600);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-100 font-sans">
      <LoginHeroPanel />

      <div className="w-full lg:w-[44%] bg-white flex flex-col justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#F26F21] flex items-center justify-center font-black text-white text-sm shadow-md">FPT</div>
            <div>
              <div className="text-slate-900 font-bold text-base leading-tight">FPT CampusStay</div>
              <div className="text-slate-400 text-xs">Hệ thống quản lý Ký túc xá Tân Uyên</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Đăng nhập</h2>
            <p className="text-xs text-slate-500">Dành cho sinh viên, cán bộ KTX và quản trị viên FPT University.</p>
          </div>

          <button
            type="button"
            onClick={googleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[#F26F21] bg-white hover:bg-orange-50/50 text-slate-800 font-bold text-sm transition-all shadow-xs disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
            <span>Đăng nhập với Google</span>
          </button>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Chỉ chấp nhận tài khoản <strong>@fpt.edu.vn</strong>. Vai trò (sinh viên / cán bộ / trưởng ban / quản trị) được xác định tự động
              theo tài khoản. Dữ liệu cá nhân được xử lý theo Nghị định 13/2023/NĐ-CP.
            </span>
          </div>

          {DEMO_MODE && (
            <div className="mt-8 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 text-center mb-2">Chế độ demo — chọn vai trò</div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ROLES.map((d) => (
                  <button
                    key={d.role}
                    type="button"
                    onClick={() => login(d.role)}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-orange-100 hover:text-[#F26F21] text-xs font-semibold text-slate-600"
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-400 mt-6">© 2026 FPT University · CampusStay</div>

        <button
          type="button"
          aria-label="Trợ giúp"
          onClick={() => setHelpOpen((v) => !v)}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl z-50"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        {helpOpen && (
          <div className="fixed bottom-20 right-6 z-50 w-64 p-4 rounded-xl bg-white border border-slate-200 shadow-lg text-xs text-slate-700">
            <div className="font-bold text-slate-800 mb-1">Cần hỗ trợ đăng nhập?</div>
            Liên hệ Văn phòng KTX Tân Uyên: 0274 3 789 001 hoặc email ktx.tanuyen@fpt.edu.vn.
          </div>
        )}
      </div>
    </div>
  );
}
