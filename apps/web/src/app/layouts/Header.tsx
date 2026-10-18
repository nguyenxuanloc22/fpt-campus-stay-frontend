import { Fragment } from 'react';
import { ChevronRight, MapPin, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { t } from '@shared-ui';
import { breadcrumbOf } from './navigation';
import { LanguageSwitcher, ThemeToggle } from './header/PreferenceControls';
import { NotificationBell } from './header/NotificationBell';
import { UserMenu } from './header/UserMenu';

/**
 * Header: nút mở menu (chỉ dưới 1024px), breadcrumb (tiêu đề trang nằm ở h1 trong nội dung — chỉ hiện một lần),
 * nhãn cơ sở, chuông thông báo, tài khoản.
 */
export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { pathname } = useLocation();
  const isStudent = useAuthStore((s) => s.user?.role === 'STUDENT');
  const crumbs = breadcrumbOf(pathname);

  return (
    <header className="h-header bg-surface border-b border-line px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={t('Open navigation menu')}
          // Sinh viên trên mobile dùng thanh tab dưới đáy (tab “Thêm”)
          className={clsx(
            'w-touch h-touch -ml-2 rounded-control items-center justify-center text-ink-muted hover:bg-surface-sunken hover:text-ink lg:hidden',
            isStudent ? 'hidden sm:inline-flex' : 'inline-flex'
          )}
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <span className="text-body font-bold text-ink sm:hidden">CampusStay</span>
        <nav aria-label="Breadcrumb" className="hidden sm:block min-w-0">
          <ol className="flex items-center gap-1 text-label text-ink-muted">
            {crumbs.map((c, i) => (
              <Fragment key={`${c}-${i}`}>
                {i > 0 && (
                  <li aria-hidden="true">
                    <ChevronRight className="w-3 h-3" />
                  </li>
                )}
                <li className="whitespace-nowrap" aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                  <span className={clsx(i === crumbs.length - 1 && 'text-ink font-medium')}>{c}</span>
                </li>
              </Fragment>
            ))}
          </ol>
        </nav>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <span className="hidden xl:inline-flex items-center gap-1 text-label text-ink-muted">
          <MapPin className="w-4 h-4" aria-hidden="true" /> {t('Tan Uyen campus')}
        </span>
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
