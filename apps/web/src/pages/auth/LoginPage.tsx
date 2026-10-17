import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, UserCheck, KeyRound } from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { ROLES, type Role, ROLE_LABELS, APP_ROUTES } from '@campusstay/constants';
import { AppButton } from '@shared-ui/components/AppButton';

export function LoginPage() {
  const navigate = useNavigate();
  const { switchRole } = useAuthStore();
  const [email, setEmail] = useState('locnx.se@fpt.edu.vn');
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES.STUDENT);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    if (selectedRole === ROLES.STUDENT) navigate(APP_ROUTES.STUDENT.DASHBOARD);
    else if (selectedRole === ROLES.STAFF) navigate(APP_ROUTES.STAFF.DASHBOARD);
    else if (selectedRole === ROLES.MANAGER) navigate(APP_ROUTES.MANAGER.DASHBOARD);
    else if (selectedRole === ROLES.ADMIN) navigate(APP_ROUTES.ADMIN.DASHBOARD);
  };

  const handleRoleQuickSelect = (role: Role) => {
    setSelectedRole(role);
    switchRole(role);
    if (role === ROLES.STUDENT) navigate(APP_ROUTES.STUDENT.DASHBOARD);
    else if (role === ROLES.STAFF) navigate(APP_ROUTES.STAFF.DASHBOARD);
    else if (role === ROLES.MANAGER) navigate(APP_ROUTES.MANAGER.DASHBOARD);
    else if (role === ROLES.ADMIN) navigate(APP_ROUTES.ADMIN.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-orange-50/30 to-blue-50/30 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#FFF2EA] text-[#F26F21] rounded-2xl flex items-center justify-center shadow-inner mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A365D]">CampusStay FPT</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Ký túc xá FPT University Tân Uyên (Bình Dương)
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email trường (@fpt.edu.vn)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Mật khẩu
            </label>
            <input
              type="password"
              defaultValue="••••••••"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent transition"
              required
            />
          </div>

          <AppButton type="submit" className="w-full mt-2" size="lg">
            Đăng nhập hệ thống
          </AppButton>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
            <KeyRound className="w-3.5 h-3.5 text-[#F26F21]" />
            <span>CHỌN VAI TRÒ DEMO (HỘI ĐỒNG CHẤM ĐỒ ÁN)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROLES) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleQuickSelect(r)}
                className="flex items-center gap-2 p-2.5 text-left rounded-lg border border-slate-200 hover:border-[#F26F21] hover:bg-[#FFF2EA]/50 text-slate-700 transition group text-xs font-medium"
              >
                <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-[#F26F21] group-hover:text-white flex items-center justify-center text-slate-600 transition-colors">
                  {r === ROLES.STUDENT && <UserCheck className="w-3.5 h-3.5" />}
                  {r === ROLES.STAFF && <Building2 className="w-3.5 h-3.5" />}
                  {r === ROLES.MANAGER && <Shield className="w-3.5 h-3.5" />}
                  {r === ROLES.ADMIN && <KeyRound className="w-3.5 h-3.5" />}
                </div>
                <span>{ROLE_LABELS[r]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
