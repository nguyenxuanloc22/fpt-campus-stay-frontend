import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { usePreferences } from '@shared-ui';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { StudentTabBar } from './StudentTabBar';
import { ImportantAnnouncementsModal } from './ImportantAnnouncementsModal';

const COLLAPSE_KEY = 'campusstay_sidebar_collapsed';

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
};

const saveCollapsed = (value: boolean) => {
  try {
    localStorage.setItem(COLLAPSE_KEY, value ? '1' : '0');
  } catch {
    /* bỏ qua khi trình duyệt chặn storage */
  }
};

export function AppLayout() {
  const isStudent = useAuthStore((s) => s.user?.role === 'STUDENT');
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const theme = usePreferences((s) => s.theme);

  // Chế độ sáng/tối chỉ áp cho khu vực ứng dụng (trang công khai giữ giao diện sáng)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  const toggleCollapse = () => {
    saveCollapsed(!collapsed);
    setCollapsed(!collapsed);
  };
  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="min-h-dvh bg-page flex">
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} mobileOpen={mobileNavOpen} onCloseMobile={closeMobileNav} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header onToggleSidebar={openMobileNav} />
        <main
          id="main"
          className={clsx(
            'flex-1 w-full max-w-content mx-auto px-4 py-6 sm:px-6 lg:px-8',
            // Chừa chỗ cho thanh tab dưới đáy của sinh viên trên mobile
            isStudent && 'pb-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom)+1.5rem)] sm:pb-6'
          )}
        >
          <Outlet />
        </main>
      </div>
      {isStudent && <StudentTabBar onMore={openMobileNav} />}
      <ImportantAnnouncementsModal />
    </div>
  );
}
