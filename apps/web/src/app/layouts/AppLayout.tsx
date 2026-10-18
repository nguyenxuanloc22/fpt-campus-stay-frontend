import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ImportantAnnouncementsModal } from './ImportantAnnouncementsModal';

const COLLAPSE_KEY = 'campusstay_sidebar_collapsed';

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
};

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1');
      } catch {
        /* bỏ qua khi trình duyệt chặn storage */
      }
      return !c;
    });

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <Sidebar collapsed={collapsed} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onToggleSidebar={toggle} />
        <main className="flex-1 p-5 md:p-7 max-w-[1400px] mx-auto w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <ImportantAnnouncementsModal />
    </div>
  );
}
