import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Cpu, ShieldAlert, Users } from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES, ROLE_LABELS, type Role } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { EmptyState, SectionCard, StatusBadge, STATUS_TONE_CLASS } from '@shared-ui';
import { Greeting } from '@features/dashboard';
import { SEMESTERS, MILESTONES } from './AdminSemestersPage';
import { RUNS } from './AdminAllocationEnginePage';
import { ACCOUNTS } from './AdminUsersPage';

/**
 * Tổng quan Quản trị viên (từ trên xuống): lời chào + chip tình trạng hệ thống → học kỳ & mốc sắp tới
 * → engine xếp phòng → kiểm tra cấu hình → tài khoản theo vai trò.
 * Dữ liệu lấy từ các trang Học kỳ, Engine xếp phòng, Tài khoản & vai trò.
 */

const R = APP_ROUTES.ADMIN;
const LINK = 'min-h-touch inline-flex items-center text-body font-semibold text-brand-ink hover:underline';

/** Health-check dịch vụ — chỉ tóm tắt thành một chip nhỏ (Admin không cần chỉ số hạ tầng chi tiết). */
const SERVICES = [
  { name: 'API Gateway', status: 'ok' },
  { name: 'Google OAuth (đăng nhập)', status: 'ok' },
  { name: 'Allocation Engine', status: 'ok' },
  { name: 'Payment Webhook (VietQR)', status: 'warn' },
  { name: 'SIS Sync Worker', status: 'ok' },
  { name: 'Notification Service', status: 'ok' },
  { name: 'PostgreSQL Primary', status: 'ok' },
  { name: 'Gmail API (email)', status: 'ok' },
];

const ROLE_ORDER: Role[] = ['STUDENT', 'STAFF', 'MANAGER', 'ADMIN'];

function SystemChip() {
  const slow = SERVICES.filter((s) => s.status !== 'ok');
  const ok = slow.length === 0;
  return (
    <Link
      to={R.INTEGRATIONS}
      title={ok ? undefined : slow.map((s) => s.name).join(', ')}
      className={clsx(
        'inline-flex items-center gap-1 min-h-8 px-3 rounded-full text-label font-semibold hover:underline',
        STATUS_TONE_CLASS[ok ? 'success' : 'pending']
      )}
    >
      {ok ? <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> : <AlertTriangle className="w-4 h-4" aria-hidden="true" />}
      Tình trạng hệ thống: {ok ? 'ổn định' : `${slow.length} dịch vụ phản hồi chậm`}
    </Link>
  );
}

function SemesterCard() {
  const active = SEMESTERS.find((s) => s.status === 'ACTIVE');
  const upcoming = SEMESTERS.find((s) => s.status === 'UPCOMING');
  const nextMilestones = MILESTONES.filter((m) => !m.done).slice(0, 5);

  return (
    <SectionCard title="Học kỳ đang vận hành" actions={<Link to={R.SEMESTERS} className={LINK}>Cấu hình học kỳ</Link>}>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {active && (
          <div>
            <dt className="text-label text-ink-muted">Đang diễn ra</dt>
            <dd className="text-section font-semibold text-ink">{active.name}</dd>
            <dd className="text-label text-ink-muted">
              {active.start} – {active.end} · {active.residents.toLocaleString('vi-VN')} sinh viên đang ở
            </dd>
          </div>
        )}
        {upcoming && (
          <div>
            <dt className="text-label text-ink-muted">Kỳ tới · {upcoming.regLocked ? 'đã khóa đăng ký' : 'đang mở đăng ký'}</dt>
            <dd className="text-section font-semibold text-ink">{upcoming.name}</dd>
            <dd className="text-label text-ink-muted">
              Đăng ký {upcoming.regOpen} – {upcoming.regClose} · {upcoming.applications.toLocaleString('vi-VN')} đơn
            </dd>
          </div>
        )}
      </dl>
      <h3 className="text-body font-semibold text-ink mt-6 mb-2">Mốc sắp tới</h3>
      <ol className="divide-y divide-line border-y border-line">
        {nextMilestones.map((m) => (
          <li key={m.t} className="flex items-center gap-3 py-2">
            <span className="w-14 shrink-0 text-body font-semibold text-ink tabular-nums">{m.d}</span>
            <span className="text-body text-ink">{m.t}</span>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}

function EngineCard() {
  const last = RUNS[0];
  return (
    <SectionCard title="Engine xếp phòng" actions={<Link to={R.ALLOCATION_ENGINE} className={LINK}>Mở engine</Link>}>
      {!last ? (
        <EmptyState icon={<Cpu className="w-8 h-8" />} title="Chưa có lần chạy nào" description="Chạy engine sau khi đóng cổng đăng ký để tạo đề xuất xếp phòng." />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-section font-semibold text-ink">{last.id}</span>
            <StatusBadge status={last.status} />
          </div>
          <p className="text-label text-ink-muted mt-1">
            Lần chạy gần nhất {last.when} · {last.type}
          </p>
          <dl className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <dt className="text-label text-ink-muted">Đơn đã xếp</dt>
              <dd className="text-2xl font-bold text-ink">{last.total.toLocaleString('vi-VN')}</dd>
            </div>
            <div>
              <dt className="text-label text-ink-muted">Xung đột</dt>
              <dd className={clsx('text-2xl font-bold', last.conflicts ? 'text-danger' : 'text-ink')}>{last.conflicts}</dd>
            </div>
          </dl>
        </>
      )}
    </SectionCard>
  );
}

function ConfigCheckCard() {
  // Mục còn thiếu suy ra từ dữ liệu sẵn có: học kỳ nháp chưa có lịch, tài khoản cán bộ chưa bật xác thực 2 lớp
  const draftSemesters = SEMESTERS.filter((s) => s.status === 'DRAFT' && (s.regOpen === '—' || s.checkin === '—'));
  const staffNoMfa = ACCOUNTS.filter((a) => a.role !== 'STUDENT' && a.status === 'ACTIVE' && !a.mfa);
  const issues = [
    ...draftSemesters.map((s) => ({ id: s.code, text: `${s.name}: chưa đặt lịch đăng ký và check-in`, to: R.SEMESTERS })),
    ...(staffNoMfa.length ? [{ id: 'mfa', text: `${staffNoMfa.length} tài khoản cán bộ chưa bật xác thực 2 lớp`, to: R.USERS }] : []),
  ];

  return (
    <SectionCard title="Kiểm tra cấu hình" subtitle={issues.length ? `${issues.length} mục cần bổ sung` : undefined} noPadding>
      {issues.length === 0 ? (
        <div className="p-4 sm:p-6">
          <EmptyState icon={<CheckCircle2 className="w-8 h-8" />} title="Cấu hình đã đầy đủ" description="Học kỳ, luật điều kiện, giá phòng và tài khoản không còn mục thiếu." />
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {issues.map((i) => (
            <li key={i.id} className="flex items-center gap-3 px-4 sm:px-6 py-3">
              <ShieldAlert className="w-5 h-5 text-pending shrink-0" aria-hidden="true" />
              <span className="flex-1 text-body text-ink">{i.text}</span>
              <Link to={i.to} className={LINK} aria-label={`Sửa: ${i.text}`}>
                Sửa
              </Link>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function AccountsCard() {
  const locked = ACCOUNTS.filter((a) => a.status === 'LOCKED').length;
  const inactive = ACCOUNTS.filter((a) => a.status === 'INACTIVE').length;
  return (
    <SectionCard title="Tài khoản" actions={<Link to={R.USERS} className={LINK}>Quản lý</Link>}>
      <dl className="grid grid-cols-2 gap-4">
        {ROLE_ORDER.map((role) => (
          <div key={role}>
            <dt className="text-label text-ink-muted">{ROLE_LABELS[role]}</dt>
            <dd className="text-2xl font-bold text-ink">{ACCOUNTS.filter((a) => a.role === role).length}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line">
        <span className={clsx('inline-flex items-center gap-1 px-3 py-1 rounded-full text-label font-semibold', STATUS_TONE_CLASS[locked ? 'danger' : 'neutral'])}>
          <Users className="w-4 h-4" aria-hidden="true" /> {locked} tài khoản bị khóa
        </span>
        <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-label font-semibold', STATUS_TONE_CLASS.neutral)}>{inactive} ngừng hoạt động</span>
      </div>
    </SectionCard>
  );
}

export function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <Greeting name={user?.name} chip={<SystemChip />} />

      {/* Thứ tự DOM = thứ tự ưu tiên trên mobile: học kỳ → engine → cấu hình → tài khoản */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <SemesterCard />
        </div>
        <EngineCard />
        <div className="lg:col-span-2">
          <ConfigCheckCard />
        </div>
        <AccountsCard />
      </div>
    </div>
  );
}
