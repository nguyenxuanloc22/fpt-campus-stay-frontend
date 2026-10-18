import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { PERSONAL_NOTIFICATIONS } from '@features/notifications/personalNotifications';
import { APP_ROUTES } from '@campusstay/constants';
import { useDismiss } from './useDismiss';

/** Chuông thông báo cá nhân (kết quả xếp phòng, lời mời đổi phòng, hóa đơn sắp đến hạn…). */
export function NotificationBell() {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.role);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() => (role ? PERSONAL_NOTIFICATIONS[role] : []));
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const unread = items.filter((i) => i.unread).length;

  useEffect(() => setItems(role ? PERSONAL_NOTIFICATIONS[role] : []), [role]);

  const openItem = (id: string, to: string) => {
    setItems((all) => all.map((i) => (i.id === id ? { ...i, unread: false } : i)));
    setOpen(false);
    navigate(to);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={`Thông báo cá nhân${unread ? `, ${unread} chưa đọc` : ''}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="relative w-touch h-touch rounded-control hover:bg-surface-sunken flex items-center justify-center text-ink-muted hover:text-ink"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute top-2 right-2 min-w-4 h-4 px-1 rounded-full bg-brand-ink text-white text-label leading-4 font-semibold" aria-hidden="true">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] bg-surface rounded-card border border-line shadow-overlay overflow-hidden z-40">
          <div className="px-4 py-2 border-b border-line flex items-center justify-between gap-2">
            <h2 className="text-body font-semibold text-ink">Thông báo của bạn</h2>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => setItems((all) => all.map((i) => ({ ...i, unread: false })))}
                className="min-h-touch px-2 rounded-control text-label font-semibold text-brand-ink hover:bg-brand-soft"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto divide-y divide-line">
            {items.map((n) => (
              <li key={n.id}>
                <button type="button" onClick={() => openItem(n.id, n.to)} className="w-full px-4 py-3 text-left hover:bg-surface-muted flex gap-3">
                  <span className={clsx('mt-2 w-2 h-2 rounded-full shrink-0', n.unread ? 'bg-brand' : 'bg-transparent')} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className={clsx('block text-body text-ink', n.unread ? 'font-semibold' : 'font-normal')}>
                      {n.unread && <span className="sr-only">Chưa đọc: </span>}
                      {n.title}
                    </span>
                    <span className="block text-label text-ink-muted mt-1">{n.body}</span>
                    <span className="block text-label text-ink-subtle mt-1">{n.time}</span>
                  </span>
                </button>
              </li>
            ))}
            {items.length === 0 && <li className="px-4 py-8 text-center text-body text-ink-muted">Bạn chưa có thông báo mới.</li>}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(APP_ROUTES.COMMON.NOTIFICATIONS);
            }}
            className="w-full min-h-touch px-4 text-body font-semibold text-ink-muted hover:bg-surface-muted hover:text-ink border-t border-line"
          >
            Xem thông báo chung
          </button>
        </div>
      )}
    </div>
  );
}
