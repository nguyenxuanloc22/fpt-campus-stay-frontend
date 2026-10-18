import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, ChevronRight, LogOut, Lock, MapPin, Menu, Settings, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { PERSONAL_NOTIFICATIONS } from '@features/notifications/personalNotifications';
import { ROLE_LABELS, APP_ROUTES } from '@campusstay/constants';
import { Modal, AppButton, useToast } from '@shared-ui';

const BREADCRUMB_LABELS: Record<string, string> = {
  student: 'Sinh viên',
  staff: 'Cán bộ',
  manager: 'Quản lý',
  admin: 'Quản trị',
  dashboard: 'Tổng quan',
  registration: 'Đăng ký lưu trú',
  'my-room': 'Phòng của tôi',
  new: 'Gửi đơn',
  invoices: 'Hóa đơn',
  applications: 'Đơn từ',
  checkin: 'Check-in / Check-out',
  notifications: 'Thông báo chung',
  profile: 'Hồ sơ cá nhân',
  inventory: 'Phòng & giường',
  assignment: 'Xếp phòng',
  'room-changes': 'Đổi phòng',
  'checkin-out': 'Check-in / Check-out',
  maintenance: 'Bảo trì & kiểm tra',
  broadcast: 'Gửi thông báo',
  approvals: 'Phê duyệt',
  'assignment-approval': 'Duyệt xếp phòng',
  reports: 'Báo cáo',
  semesters: 'Kỳ học',
  rules: 'Luật điều kiện',
  pricing: 'Loại phòng & giá',
  'allocation-engine': 'Engine xếp phòng',
  integrations: 'Tích hợp',
  users: 'Người dùng',
  'audit-logs': 'Nhật ký kiểm toán',
};

/** Đóng popover khi bấm ra ngoài hoặc nhấn Esc. */
function useDismiss<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);
  return ref;
}

const initialsOf = (name: string) =>
  name.split(' ').filter(Boolean).map((w) => w[0]).slice(-2).join('').toUpperCase();

function NotificationBell() {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.user?.role);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() => (role ? PERSONAL_NOTIFICATIONS[role] : []));
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));
  const unread = items.filter((i) => i.unread).length;

  useEffect(() => setItems(role ? PERSONAL_NOTIFICATIONS[role] : []), [role]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={`Thông báo cá nhân${unread ? `, ${unread} chưa đọc` : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F26F21] ring-2 ring-white" />}
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-40">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Thông báo của bạn</span>
            {unread > 0 && (
              <button type="button" onClick={() => setItems((all) => all.map((i) => ({ ...i, unread: false })))} className="text-xs font-semibold text-[#F26F21]">
                Đánh dấu đã đọc
              </button>
            )}
          </div>
          <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {items.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    setItems((all) => all.map((i) => (i.id === n.id ? { ...i, unread: false } : i)));
                    setOpen(false);
                    navigate(n.to);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 flex gap-3"
                >
                  <span className={clsx('mt-1.5 w-2 h-2 rounded-full shrink-0', n.unread ? 'bg-[#F26F21]' : 'bg-transparent')} />
                  <span className="min-w-0">
                    <span className={clsx('block text-xs text-slate-900', n.unread ? 'font-bold' : 'font-medium')}>{n.title}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{n.body}</span>
                    <span className="block text-[11px] text-slate-400 mt-1">{n.time}</span>
                  </span>
                </button>
              </li>
            ))}
            {items.length === 0 && <li className="px-4 py-8 text-center text-xs text-slate-400">Không có thông báo mới</li>}
          </ul>
          <button
            type="button"
            onClick={() => { setOpen(false); navigate(APP_ROUTES.COMMON.NOTIFICATIONS); }}
            className="w-full px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 border-t border-slate-100"
          >
            Xem thông báo chung
          </button>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { show, toastNode } = useToast();
  const [open, setOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const ref = useDismiss<HTMLDivElement>(open, () => setOpen(false));

  if (!user) return null;
  const subtitle = `${user.studentId ? `${user.studentId} · ` : ''}${ROLE_LABELS[user.role]}`;
  const initials = initialsOf(user.name);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const pwValid = pw.current.length > 0 && pw.next.length >= 6 && pw.next === pw.confirm;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200"
      >
        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F26F21] to-[#FF9A4D] text-white text-xs font-bold flex items-center justify-center">{initials}</span>
        <span className="hidden md:block text-left">
          <span className="block text-sm font-bold text-slate-900 leading-tight max-w-[180px] truncate">{user.name}</span>
          <span className="block text-[11px] text-slate-500">{subtitle}</span>
        </span>
        <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-40">
          <div className="px-4 py-4 flex items-center gap-3 bg-slate-50/70 border-b border-slate-100">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F26F21] to-[#FF9A4D] text-white text-sm font-bold flex items-center justify-center shrink-0">{initials}</span>
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-900 truncate">{user.name}</div>
              <div className="text-xs text-slate-500">{subtitle}</div>
              <div className="text-[10px] font-bold text-[#F26F21] mt-0.5 tracking-wide">CAMPUS: FPT TÂN UYÊN</div>
            </div>
          </div>
          <div className="py-1.5">
            <button type="button" onClick={() => go(APP_ROUTES.COMMON.PROFILE)} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50">
              <UserIcon className="w-4 h-4 text-slate-400" /> Hồ sơ cá nhân
            </button>
            <button type="button" onClick={() => { setOpen(false); setPwOpen(true); }} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50">
              <Lock className="w-4 h-4 text-slate-400" /> Đổi mật khẩu
            </button>
            <button type="button" onClick={() => go(`${APP_ROUTES.COMMON.PROFILE}?tab=settings`)} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-slate-700 hover:bg-slate-50">
              <Settings className="w-4 h-4 text-slate-400" /> Cài đặt hệ thống
            </button>
          </div>
          <div className="border-t border-slate-100 py-1.5">
            <button
              type="button"
              onClick={() => { logout(); navigate(APP_ROUTES.AUTH.LOGIN); }}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        </div>
      )}

      <Modal
        open={pwOpen}
        onClose={() => setPwOpen(false)}
        size="sm"
        title="Đổi mật khẩu"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setPwOpen(false)}>Hủy</AppButton>
            <AppButton disabled={!pwValid} onClick={() => { setPwOpen(false); setPw({ current: '', next: '', confirm: '' }); show('Đã đổi mật khẩu'); }}>Lưu</AppButton>
          </>
        }
      >
        {user.role === 'STUDENT' ? (
          <p className="text-sm text-slate-600">Sinh viên đăng nhập bằng Google / FEID. Vui lòng đổi mật khẩu tại hệ thống tài khoản của FPT University.</p>
        ) : (
          <div className="space-y-3 text-sm">
            {(
              [
                ['current', 'Mật khẩu hiện tại'],
                ['next', 'Mật khẩu mới (tối thiểu 6 ký tự)'],
                ['confirm', 'Nhập lại mật khẩu mới'],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="block">
                <span className="block text-xs font-semibold text-slate-600 mb-1">{label}</span>
                <input type="password" value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </label>
            ))}
            {pw.confirm && pw.next !== pw.confirm && <p className="text-xs text-rose-600">Mật khẩu nhập lại không khớp.</p>}
          </div>
        )}
      </Modal>
      {toastNode}
    </div>
  );
}

export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = segments
    .filter((s) => !['student', 'staff', 'manager', 'admin'].includes(s))
    .map((s) => (s === 'applications' && segments[0] === 'staff' ? 'Đơn đăng ký' : BREADCRUMB_LABELS[s] ?? s));
  const isStudentAppList = segments[0] === 'student' && segments[segments.length - 1] === 'applications';
  const title = isStudentAppList ? 'Đơn của tôi' : crumbs[crumbs.length - 1] ?? 'Tổng quan';

  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Thu gọn / mở rộng thanh điều hướng"
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-orange-50 hover:text-[#F26F21] text-slate-600 flex items-center justify-center"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <div className="text-base font-bold text-slate-900 truncate">{title}</div>
          {crumbs.length > 1 && (
            <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-[11px] text-slate-400">
              {crumbs.map((c, i) => (
                <span key={c} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3" />}
                  {c}
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
          <MapPin className="w-4 h-4 text-[#F26F21]" /> Cơ sở Tân Uyên (Bình Dương)
        </span>
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
