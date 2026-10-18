import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { t } from '@shared-ui';
import { NAV, isGroup, type NavEntry, type NavItem } from './navigation';

interface SidebarProps {
  /** Màn lớn: thu gọn còn icon */
  collapsed: boolean;
  onToggleCollapse: () => void;
  /** Màn nhỏ: ngăn kéo trượt từ trái */
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ROW = 'flex items-center gap-3 min-h-touch rounded-control text-body transition-colors';
const IDLE = 'text-ink-muted hover:bg-surface-sunken hover:text-ink';
const ACTIVE = 'bg-brand-soft text-brand-ink font-semibold';

function Item({ item, collapsed, nested = false }: { item: NavItem; collapsed: boolean; nested?: boolean }) {
  return (
    <NavLink
      to={item.to}
      end
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) => clsx(ROW, collapsed ? 'justify-center' : nested ? 'pl-3 pr-3' : 'px-3', isActive ? ACTIVE : IDLE)}
    >
      {nested && !collapsed ? (
        <span className="w-5 flex justify-center shrink-0" aria-hidden="true">
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
        </span>
      ) : (
        <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
      )}
      {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
    </NavLink>
  );
}

/** Nhóm sổ xuống: bấm để hiện / ẩn các trang con. Tự mở khi đang ở một trang con. */
function Group({ entry, collapsed }: { entry: Extract<NavEntry, { children: NavItem[] }>; collapsed: boolean }) {
  const { pathname } = useLocation();
  const containsActive = entry.children.some((c) => pathname === c.to);
  const [open, setOpen] = useState(containsActive);
  const panelId = useId();

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  // Thu gọn: hiện thẳng icon các trang con, ngăn cách bằng một vạch
  if (collapsed) {
    return (
      <div className="space-y-1">
        <div className="mx-2 my-2 border-t border-line" aria-hidden="true" />
        {entry.children.map((c) => (
          <Item key={c.to} item={c} collapsed />
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={clsx(ROW, 'w-full px-3', containsActive && !open ? ACTIVE : IDLE, containsActive && 'text-ink')}
      >
        <entry.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left whitespace-nowrap">{entry.label}</span>
        <ChevronDown className={clsx('w-4 h-4 shrink-0 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className="ml-5 pl-2 mt-1 space-y-1 border-l border-line">
          {entry.children.map((c) => (
            <Item key={c.to} item={c} collapsed={false} nested />
          ))}
        </div>
      )}
    </div>
  );
}

function NavContent({ collapsed }: { collapsed: boolean }) {
  const role = useAuthStore((state) => state.user?.role);
  const entries = role ? NAV[role] : [];

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label={t('Main navigation')}>
      {entries.map((e) => (isGroup(e) ? <Group key={e.label} entry={e} collapsed={collapsed} /> : <Item key={e.to} item={e} collapsed={collapsed} />))}
    </nav>
  );
}

function Brand({ compact }: { compact: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 min-w-0 rounded-control" aria-label={t('CampusStay — go to home page')}>
      <span className="w-10 h-10 rounded-control bg-brand-fill text-white flex items-center justify-center font-black text-label shrink-0" aria-hidden="true">
        FPT
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block text-body font-bold text-ink leading-tight">CampusStay</span>
          <span className="block text-label text-ink-muted">{t('FPT University Dormitory')}</span>
        </span>
      )}
    </Link>
  );
}

/**
 * Sidebar: cố định từ 1024px (thu gọn được); dưới 1024px là ngăn kéo mở bằng nút menu trên Header
 * (sinh viên trên mobile mở bằng tab “More”).
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
      <aside className={clsx('hidden lg:flex flex-col shrink-0 h-dvh sticky top-0 bg-surface border-r border-line z-20', collapsed ? 'w-sidebar-collapsed' : 'w-sidebar')}>
        <div className={clsx('h-header shrink-0 flex items-center border-b border-line', collapsed ? 'justify-center' : 'px-4')}>
          <Brand compact={collapsed} />
        </div>
        <NavContent collapsed={collapsed} />
        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? t('Expand navigation') : t('Collapse navigation')}
            className={clsx(ROW, 'w-full', IDLE, collapsed ? 'justify-center' : 'px-3')}
          >
            {collapsed ? <PanelLeftOpen className="w-5 h-5" aria-hidden="true" /> : <PanelLeftClose className="w-5 h-5" aria-hidden="true" />}
            {!collapsed && t('Collapse')}
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t('Navigation menu')}>
          <div className="absolute inset-0 bg-ink/50" onClick={onCloseMobile} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-sidebar max-w-[85vw] bg-surface flex flex-col pb-[env(safe-area-inset-bottom)]">
            <div className="h-header shrink-0 flex items-center justify-between px-4 border-b border-line">
              <Brand compact={false} />
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label={t('Close menu')}
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
