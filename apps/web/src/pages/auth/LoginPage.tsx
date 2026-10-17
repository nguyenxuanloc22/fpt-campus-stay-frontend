import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { ROLES, type Role, APP_ROUTES } from '@campusstay/constants';
import { LoginHeroPanel } from './components/LoginHeroPanel';
import { StudentLoginForm } from './components/StudentLoginForm';
import { StaffLoginForm } from './components/StaffLoginForm';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithRole } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');

  const executeLogin = (role: Role) => {
    loginWithRole(role);
    if (role === ROLES.STUDENT) navigate(APP_ROUTES.STUDENT.NOTIFICATIONS);
    else if (role === ROLES.STAFF) navigate(APP_ROUTES.STAFF.DASHBOARD);
    else if (role === ROLES.MANAGER) navigate(APP_ROUTES.MANAGER.DASHBOARD);
    else if (role === ROLES.ADMIN) navigate(APP_ROUTES.ADMIN.DASHBOARD);
  };

  const handleStaffLogin = (input: string) => {
    const lower = input.trim().toLowerCase();
    if (lower.includes('admin')) executeLogin(ROLES.ADMIN);
    else if (lower.includes('manager')) executeLogin(ROLES.MANAGER);
    else if (lower.includes('student')) executeLogin(ROLES.STUDENT);
    else executeLogin(ROLES.STAFF);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-100 font-sans">
      {/* Left Column: Hero Panel */}
      <LoginHeroPanel />

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-[44%] bg-white flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative">
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Top Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#F26F21] flex items-center justify-center font-black text-white text-sm shadow-md">
              FPT
            </div>
            <div>
              <div className="text-slate-900 font-bold text-base leading-tight">FPT CampusStay</div>
              <div className="text-slate-400 text-xs">Dormitory Management System</div>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h2>
            <p className="text-xs text-slate-400">Please log in with your assigned account.</p>
          </div>

          {/* Tab Switcher: [ Student ] and [ Staff / Admin ] */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('student')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'student'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                activeTab === 'staff'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Staff / Admin</span>
            </button>
          </div>

          {/* Form Content */}
          {activeTab === 'student' ? (
            <StudentLoginForm onLogin={() => executeLogin(ROLES.STUDENT)} />
          ) : (
            <StaffLoginForm onLogin={handleStaffLogin} />
          )}

          {/* Quick Demo Switcher for Grading Committee */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-400">Demo Role:</span>
            <button type="button" onClick={() => executeLogin(ROLES.STUDENT)} className="px-2 py-0.5 rounded bg-slate-100 hover:bg-orange-100 hover:text-[#F26F21]">Student</button>
            <button type="button" onClick={() => executeLogin(ROLES.STAFF)} className="px-2 py-0.5 rounded bg-slate-100 hover:bg-orange-100 hover:text-[#F26F21]">Staff</button>
            <button type="button" onClick={() => executeLogin(ROLES.MANAGER)} className="px-2 py-0.5 rounded bg-slate-100 hover:bg-orange-100 hover:text-[#F26F21]">Manager</button>
            <button type="button" onClick={() => executeLogin(ROLES.ADMIN)} className="px-2 py-0.5 rounded bg-slate-100 hover:bg-orange-100 hover:text-[#F26F21]">Admin</button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 mt-6">
          © 2026 FPT University • CampusStay v2.4.1
        </div>

        {/* Floating Help Button (?) */}
        <button
          type="button"
          title="Trợ giúp"
          onClick={() => alert('CampusStay KTX Tân Uyên - Hotline hỗ trợ: (0274) 7300 999')}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-xl z-50 transition"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
