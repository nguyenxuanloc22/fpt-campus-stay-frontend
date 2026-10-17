import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, HelpCircle, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { ROLES, type Role, APP_ROUTES } from '@campusstay/constants';
import { LoginHeroPanel } from './components/LoginHeroPanel';

/**
 * F0 — Đăng nhập.
 * Sinh viên: Google / FEID (tài khoản @fpt.edu.vn). Cán bộ, trưởng ban, quản trị: tài khoản được cấp.
 */

const HOME: Record<Role, string> = {
  [ROLES.STUDENT]: APP_ROUTES.STUDENT.DASHBOARD,
  [ROLES.STAFF]: APP_ROUTES.STAFF.DASHBOARD,
  [ROLES.MANAGER]: APP_ROUTES.MANAGER.DASHBOARD,
  [ROLES.ADMIN]: APP_ROUTES.ADMIN.DASHBOARD,
};

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
  const { loginWithCredentials, loginWithStudentSso } = useAuthStore();
  const [tab, setTab] = useState<'student' | 'staff'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);

  const goHome = () => {
    const role = useAuthStore.getState().user?.role;
    if (role) navigate(HOME[role]);
  };

  const studentSso = () => {
    loginWithStudentSso();
    goHome();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginWithCredentials(username, password)) {
      setError('Tài khoản hoặc mật khẩu không đúng.');
      return;
    }
    goHome();
  };

  const ssoButton = 'w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-[#F26F21] bg-white hover:bg-orange-50/50 text-slate-800 font-bold text-sm transition';

  return (
    <div className="min-h-screen flex w-full bg-slate-100 font-sans">
      <LoginHeroPanel />

      <div className="w-full lg:w-[44%] bg-white flex flex-col justify-center p-6 sm:p-12 lg:p-16 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#F26F21] flex items-center justify-center font-black text-white text-sm shadow-md">FPT</div>
            <div>
              <div className="text-slate-900 font-bold text-lg leading-tight">FPT CampusStay</div>
              <div className="text-slate-400 text-xs">Dormitory Management System</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h2>
            <p className="text-sm text-slate-400">Please log in with your assigned account.</p>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-6" role="tablist">
            {(
              [
                ['student', 'Student', User],
                ['staff', 'Staff / Admin', Shield],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => { setTab(key); setError(''); }}
                className={clsx(
                  'flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition',
                  tab === key ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="min-h-[290px]">
            {tab === 'student' ? (
              <div className="space-y-4">
                <button type="button" onClick={studentSso} className={ssoButton}>
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </button>
                <button type="button" onClick={studentSso} className={ssoButton}>
                  <span className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-500 to-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">FE</span>
                  <span>Sign in with FEID</span>
                </button>
                <p className="text-xs text-slate-400 text-center pt-2 leading-relaxed">
                  FPT University students sign in using their official student credentials.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="login-account" className="block text-sm font-semibold text-slate-700 mb-1.5">Account</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-account"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setError(''); }}
                      placeholder="Enter your username"
                      autoComplete="username"
                      required
                      className="w-full pl-10 pr-3.5 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F26F21] focus:border-transparent"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-xs text-rose-600"><AlertCircle className="w-4 h-4" />{error}</div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300 accent-[#F26F21]" />
                    Remember me
                  </label>
                  <button type="button" onClick={() => setHelpOpen(true)} className="text-[#F26F21] hover:underline font-medium">Forgot password?</button>
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-xl bg-[#F26F21] hover:bg-[#D95A12] text-white font-bold text-sm shadow-md shadow-orange-500/20 transition">
                  Sign In
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="text-center text-xs text-slate-300 mt-6">© 2026 FPT University · CampusStay</div>

        <button
          type="button"
          aria-label="Trợ giúp"
          onClick={() => setHelpOpen((v) => !v)}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl z-50"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        {helpOpen && (
          <div className="fixed bottom-20 right-6 z-50 w-72 p-4 rounded-xl bg-white border border-slate-200 shadow-lg text-xs text-slate-700">
            <div className="font-bold text-slate-800 mb-1">Cần hỗ trợ đăng nhập?</div>
            Sinh viên dùng tài khoản @fpt.edu.vn. Cán bộ quên mật khẩu vui lòng liên hệ Phòng CNTT hoặc Văn phòng KTX: 0274 3 789 001.
          </div>
        )}
      </div>
    </div>
  );
}
