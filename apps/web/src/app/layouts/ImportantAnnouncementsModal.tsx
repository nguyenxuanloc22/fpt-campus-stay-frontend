import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing, ChevronLeft, ChevronRight, ExternalLink, Pin, X } from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { ANNOUNCEMENTS, ANNOUNCEMENT_CATEGORY_LABEL } from '@features/notifications/systemAnnouncements';
import { APP_ROUTES } from '@campusstay/constants';
import { AppButton, t } from '@shared-ui';

const NAV_BTN = 'w-touch h-touch sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-control border border-line-control bg-surface text-ink hover:bg-surface-muted disabled:opacity-40';

const DISMISS_KEY = 'campusstay_important_dismissed';

const readDismissed = (): string | null => {
  try {
    return sessionStorage.getItem(DISMISS_KEY);
  } catch {
    return null;
  }
};

/**
 * Popup "Thông báo quan trọng" hiện ngay sau khi đăng nhập (mọi vai trò).
 * Lấy các thông báo hệ thống được ghim (`important`). Tick "Không hiển thị lại" sẽ ẩn trong phiên đăng nhập hiện tại.
 */
export function ImportantAnnouncementsModal() {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const pinned = ANNOUNCEMENTS.filter((a) => a.important);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [dontShow, setDontShow] = useState(false);

  useEffect(() => {
    if (token && pinned.length > 0 && readDismissed() !== token) {
      setOpen(true);
      setIndex(0);
      setDontShow(false);
    }
  }, [token, pinned.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const current = pinned[index];
  if (!open || !current || !token) return null;

  const close = () => {
    if (dontShow) {
      try {
        sessionStorage.setItem(DISMISS_KEY, token);
      } catch {
        /* bỏ qua khi trình duyệt chặn storage */
      }
    }
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-ink/50" role="dialog" aria-modal="true" aria-labelledby="important-title">
      <div className="w-full sm:max-w-2xl bg-surface rounded-t-card sm:rounded-card shadow-overlay overflow-hidden flex flex-col max-h-[90dvh]">
        <div className="flex items-start gap-3 px-4 sm:px-6 py-4 border-b border-line">
          <BellRing className="w-5 h-5 mt-1 text-brand shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <h2 id="important-title" className="text-section font-semibold text-ink">{t('Important announcements')}</h2>
            <p className="text-label text-ink-muted flex items-center gap-1">
              <Pin className="w-3 h-3" aria-hidden="true" /> {pinned.length} {t('pinned announcements')}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="-mr-2 w-touch h-touch shrink-0 inline-flex items-center justify-center rounded-control text-ink-muted hover:bg-surface-sunken hover:text-ink"
            aria-label={t('Close announcement')}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-4 overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-label">
            <span className="px-2 py-0.5 rounded-full bg-danger-soft text-danger font-semibold">{t('Important')}</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-sunken text-ink-muted font-semibold">{ANNOUNCEMENT_CATEGORY_LABEL[current.category]}</span>
            <span className="text-ink-muted">{current.source} · {current.date}</span>
          </div>
          <h3 className="text-section font-semibold text-ink mb-3">{current.title}</h3>
          <div className="rounded-control bg-surface-muted border border-line p-4 text-body text-ink leading-relaxed whitespace-pre-line">{current.body}</div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(APP_ROUTES.COMMON.NOTIFICATIONS);
            }}
            className="mt-3 min-h-touch inline-flex items-center gap-1 text-body font-semibold text-brand-ink hover:underline"
          >
            {t('View details')} <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 sm:px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-line">
          <label className="flex items-center gap-2 min-h-touch text-body text-ink-muted cursor-pointer select-none">
            <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} className="w-5 h-5 accent-brand-ink" />
            {t('Don\'t show again during this session')}
          </label>
          <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-2">
            {pinned.length > 1 && (
              <>
                <button type="button" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className={NAV_BTN} aria-label={t('Previous announcement')}>
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-label text-ink-muted tabular-nums">{index + 1}/{pinned.length}</span>
                <button type="button" disabled={index === pinned.length - 1} onClick={() => setIndex((i) => i + 1)} className={NAV_BTN} aria-label={t('Next announcement')}>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </>
            )}
            <AppButton className="flex-1 sm:flex-none" onClick={close}>
              {t('Got it')}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
}
