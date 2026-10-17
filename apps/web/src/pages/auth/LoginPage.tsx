import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Shield, UserCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { ROLES, type Role, ROLE_LABELS, APP_ROUTES } from '@campusstay/constants';
import { AppButton } from '@shared-ui/components/AppButton';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRole } = useAuthStore();
  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('123');

  const resolveRole = (input: string): Role => {
    const lower = input.trim().toLowerCase();
    if (lower.includes('admin')) return ROLES.ADMIN;
    if (lower.includes('manager')) return ROLES.MANAGER;
    if (lower.includes('staff')) return ROLES.STAFF;
    return ROLES.STUDENT;
  };

  const executeLogin = (role: Role) => {
    loginWithRole(role);
    if (role === ROLES.STUDENT) navigate(APP_ROUTES.STUDENT.DASHBOARD);
    else if (role === ROLES.STAFF) navigate(APP_ROUTES.STAFF.DASHBOARD);
    else if (role === ROLES.MANAGER) navigate(APP_ROUTES.MANAGER.DASHBOARD);
    else if (role === ROLES.ADMIN) navigate(APP_ROUTES.ADMIN.DASHBOARD);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = resolveRole(username);
    executeLogin(role);
  };

  const handleQuickLogin = (role: Role) => {
    setUsername(role.toLowerCase());
    setPassword('123');
    executeLogin(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#F26F21] mb-6 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#FFF2EA] text-[#F26F21] rounded-2xl flex items-center justify-center shadow-inner mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1A365D]">CampusStay FPT</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Đăng nhập KTX FPT University Tân Uyên</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Tài khoản (admin / manager / staff / student)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin, manager, staff, hoặc student"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123"
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent transition"
              required
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            💡 <strong>Mật khẩu demo:</strong> <code>123</code> (nhập <code>admin</code>, <code>manager</code>, <code>staff</code> hoặc <code>student</code>)
          </div>

          <AppButton type="submit" className="w-full mt-2" size="lg">
            Đăng nhập hệ thống
          </AppButton>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
            <KeyRound className="w-3.5 h-3.5 text-[#F26F21]" />
            <span>ĐĂNG NHẬP 1 CHẠM THEO VAI TRÒ</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ROLES) as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickLogin(r)}
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
