import { useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { NAV, type NavItem } from './navigation';

interface SidebarProps {
  /** Màn lớn: thu gọn còn icon */
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Màn nhỏ: ngăn kéo trượt từ trái */
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function Item({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.to}
      end
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 min-h-touch rounded-control text-body transition-colors',
          collapsed ? 'justify-center' : 'px-3',
          isActive ? 'bg-brand-soft text-brand-ink font-semibold' : 'text-ink-muted hover:bg-surface-sunken hover:text-ink'
        )
      }
    >
      <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
    </NavLink>
  );
}

function NavContent({ collapsed }: { collapsed: boolean }) {
  const role = useAuthStore((state) => state.user?.role);
  const groups = role ? NAV[role] : [];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4" aria-label="Điều hướng chính">
      {groups.map((g, i) => (
        <div key={g.title ?? i}>
          {g.title &&
            (collapsed ? (
              <div className="mx-2 mb-2 border-t border-line" aria-hidden="true" />
            ) : (
              <div className="px-3 pb-1 text-label font-medium text-ink-muted">{g.title}</div>
            ))}
          <div className="space-y-1">
            {g.items.map((item) => (
              <Item key={item.to} item={item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand({ compact }: { compact: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 min-w-0 rounded-control" aria-label="CampusStay — về trang chủ">
      <span className="w-10 h-10 rounded-control bg-brand-ink text-white flex items-center justify-center font-black text-label shrink-0" aria-hidden="true">
        FPT
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block text-body font-bold text-ink leading-tight">CampusStay</span>
          <span className="block text-label text-ink-muted">KTX FPT University</span>
        </span>
      )}
    </Link>
  );
}

/**
 * Sidebar: cố định từ 1024px (thu gọn được); dưới 1024px là ngăn kéo mở bằng nút menu trên Header
 * (sinh viên trên mobile mở bằng tab “Thêm”).
 */
export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const { pathname } = useLocation();

  // Đóng ngăn kéo khi chuyển trang
  useEffect(() => onCloseMobile(), [pathname, onCloseMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseMobile();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, onCloseMobile]);

  return (
    <>
      <aside
        className={clsx(
          'hidden lg:flex flex-col shrink-0 h-dvh sticky top-0 bg-surface border-r border-line z-20',
          collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
        )}
      >
        <div className={clsx('h-header shrink-0 flex items-center border-b border-line', collapsed ? 'justify-center' : 'px-4')}>
          <Brand compact={collapsed} />
        </div>
        <NavContent collapsed={collapsed} />
        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
            className={clsx(
              'w-full flex items-center gap-3 min-h-touch rounded-control text-body text-ink-muted hover:bg-surface-sunken hover:text-ink',
              collapsed ? 'justify-center' : 'px-3'
            )}
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" aria-hidden="true" /> : <PanelLeftClose className="w-5 h-5" aria-hidden="true" />}
            {!collapsed && 'Thu gọn'}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
          <div className="absolute inset-0 bg-ink/50" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-sidebar max-w-[85vw] bg-surface flex flex-col pb-[env(safe-area-inset-bottom)]">
            <div className="h-header shrink-0 flex items-center justify-between px-4 border-b border-line">
              <Brand compact={false} />
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Đóng menu"
                className="w-touch h-touch inline-flex items-center justify-center rounded-control text-ink-muted hover:bg-surface-sunken"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <NavContent collapsed={false} />
          </aside>
        </div>
      )}
    </>
  );
}
