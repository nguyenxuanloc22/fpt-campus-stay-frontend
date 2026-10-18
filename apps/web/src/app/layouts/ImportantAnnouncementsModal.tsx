import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing, ChevronLeft, ChevronRight, ExternalLink, Pin, X } from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { ANNOUNCEMENTS, ANNOUNCEMENT_CATEGORY_LABEL } from '@features/notifications/systemAnnouncements';
import { APP_ROUTES } from '@campusstay/constants';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="important-title">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#F26F21] to-[#FF9A4D] text-white">
          <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h2 id="important-title" className="text-lg font-extrabold leading-tight">Thông báo quan trọng</h2>
            <p className="text-xs text-white/85 flex items-center gap-1">
              <Pin className="w-3 h-3" /> {pinned.length} thông báo đã ghim
            </p>
          </div>
          <button type="button" onClick={close} className="p-2 rounded-lg hover:bg-white/15" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#C2410C] font-bold">{ANNOUNCEMENT_CATEGORY_LABEL[current.category]}</span>
            <span className="text-slate-500">{current.source} · {current.date}</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 mb-3">{current.title}</h3>
          <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line">{current.body}</div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate(APP_ROUTES.COMMON.NOTIFICATIONS);
            }}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#F26F21] hover:underline"
          >
            Chi tiết <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} className="w-4 h-4 accent-[#F26F21]" />
            Không hiển thị lại trong phiên đăng nhập này
          </label>
          <div className="ml-auto flex items-center gap-2">
            {pinned.length > 1 && (
              <>
                <button type="button" disabled={index === 0} onClick={() => setIndex((i) => i - 1)} className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40" aria-label="Thông báo trước">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-500 tabular-nums">{index + 1}/{pinned.length}</span>
                <button type="button" disabled={index === pinned.length - 1} onClick={() => setIndex((i) => i + 1)} className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-40" aria-label="Thông báo sau">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            <button type="button" onClick={close} className="px-5 py-2 rounded-xl bg-[#F26F21] hover:bg-[#D95F17] text-white text-sm font-bold shadow-sm">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
