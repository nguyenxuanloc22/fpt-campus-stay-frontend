import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

import { t } from '@shared-ui';
export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left side: FPT CampusStay Logo */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-[#F26522] flex items-center justify-center font-black text-white text-base tracking-wider shadow-sm transition-transform group-hover:scale-105">
            FPT
          </div>
          <div>
            <div className="text-[#1A365D] font-bold text-lg leading-tight group-hover:text-[#F26522] transition-colors">
              FPT CampusStay
            </div>
            <div className="text-slate-500 text-xs">{t('Tan Uyen Dormitory • Binh Duong')}</div>
          </div>
        </Link>

        {/* Right side: Single standard primary button redirecting directly to /login */}
        <div className="flex items-center">
          <Link
            to="/login"
            className="px-6 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#d95314] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm inline-flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('Sign in')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
