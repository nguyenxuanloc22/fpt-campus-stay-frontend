import { NavLink } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { STUDENT_TABS } from './navigation';
import { t } from '@shared-ui';

const TAB = 'flex-1 min-h-touch flex flex-col items-center justify-center gap-1 text-label transition-colors';

/** Thanh tab dưới đáy cho sinh viên trên mobile (<= 640px), chừa vùng an toàn của máy. */
export function StudentTabBar({ onMore }: { onMore: () => void }) {
  return (
    <nav
      aria-label={t('Quick navigation')}
      className="sm:hidden fixed inset-x-0 bottom-0 z-30 bg-surface border-t border-line pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-tabbar">
        {STUDENT_TABS.map((t) => (
          <li key={t.to} className="flex-1 flex">
            <NavLink
              to={t.to}
              end
              className={({ isActive }) => clsx(TAB, isActive ? 'text-brand-ink font-semibold' : 'text-ink-muted hover:text-ink')}
            >
              <t.icon className="w-5 h-5" aria-hidden="true" />
              {t.label}
            </NavLink>
          </li>
        ))}
        <li className="flex-1 flex">
          <button type="button" onClick={onMore} className={clsx(TAB, 'text-ink-muted hover:text-ink')} aria-haspopup="dialog">
            <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
            {t('More')}
          </button>
        </li>
      </ul>
    </nav>
  );
}
