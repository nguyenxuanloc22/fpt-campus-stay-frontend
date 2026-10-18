import { useState } from 'react';
import { ChevronDown, LogOut, Lock, Settings, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { ROLE_LABELS, APP_ROUTES } from '@campusstay/constants';
import { Modal, AppButton, useToast } from '@shared-ui';
import { useDismiss } from './useDismiss';

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

const PASSWORD_FIELDS = [
  ['current', 'Mật khẩu hiện tại'],
  ['next', 'Mật khẩu mới (tối thiểu 6 ký tự)'],
  ['confirm', 'Nhập lại mật khẩu mới'],
] as const;

const MENU_ITEM = 'w-full min-h-touch px-4 flex items-center gap-3 text-body text-ink hover:bg-surface-muted';

/** Menu tài khoản: hồ sơ, đổi mật khẩu, cài đặt, đăng xuất. */
export function UserMenu() {
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
  const pwValid = pw.current.length > 0 && pw.next.length >= 6 && pw.next === pw.confirm;

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 min-h-touch pl-1 pr-2 rounded-control hover:bg-surface-sunken"
      >
        <span className="w-9 h-9 rounded-full bg-surface-sunken border border-line text-ink text-label font-bold flex items-center justify-center" aria-hidden="true">
          {initials}
        </span>
        <span className="sr-only md:hidden">{user.name}</span>
        <span className="hidden md:block text-left max-w-48">
          <span className="block text-body font-semibold text-ink leading-tight truncate" title={user.name}>{user.name}</span>
          <span className="block text-label text-ink-muted">{subtitle}</span>
        </span>
        <ChevronDown className={clsx('w-4 h-4 text-ink-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-surface rounded-card border border-line shadow-overlay overflow-hidden z-40">
          <div className="px-4 py-4 border-b border-line">
            <div className="text-body font-semibold text-ink break-words">{user.name}</div>
            <div className="text-label text-ink-muted mt-1 break-all">{user.email}</div>
            <div className="text-label text-ink-muted">{subtitle}</div>
          </div>
          <div className="py-1">
            <button type="button" onClick={() => go(APP_ROUTES.COMMON.PROFILE)} className={MENU_ITEM}>
              <UserIcon className="w-5 h-5 text-ink-muted" aria-hidden="true" /> Hồ sơ cá nhân
            </button>
            <button type="button" onClick={() => { setOpen(false); setPwOpen(true); }} className={MENU_ITEM}>
              <Lock className="w-5 h-5 text-ink-muted" aria-hidden="true" /> Đổi mật khẩu
            </button>
            <button type="button" onClick={() => go(`${APP_ROUTES.COMMON.PROFILE}?tab=settings`)} className={MENU_ITEM}>
              <Settings className="w-5 h-5 text-ink-muted" aria-hidden="true" /> Cài đặt
            </button>
          </div>
          <div className="border-t border-line py-1">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate(APP_ROUTES.AUTH.LOGIN);
              }}
              className="w-full min-h-touch px-4 flex items-center gap-3 text-body font-semibold text-danger hover:bg-danger-soft"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" /> Đăng xuất
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
            <AppButton
              disabled={!pwValid}
              onClick={() => {
                setPwOpen(false);
                setPw({ current: '', next: '', confirm: '' });
                show('Đã đổi mật khẩu');
              }}
            >
              Lưu mật khẩu
            </AppButton>
          </>
        }
      >
        {user.role === 'STUDENT' ? (
          <p className="text-body text-ink-muted">Sinh viên đăng nhập bằng Google / FEID. Hãy đổi mật khẩu tại hệ thống tài khoản của FPT University.</p>
        ) : (
          <div className="space-y-3">
            {PASSWORD_FIELDS.map(([k, label]) => (
              <label key={k} className="block">
                <span className="block text-label font-semibold text-ink mb-1">{label}</span>
                <input type="password" value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} className="field" />
              </label>
            ))}
            {pw.confirm && pw.next !== pw.confirm && (
              <p role="alert" className="text-label text-danger">
                Mật khẩu nhập lại chưa khớp. Hãy nhập lại giống ô “Mật khẩu mới”.
              </p>
            )}
          </div>
        )}
      </Modal>
      {toastNode}
    </div>
  );
}
