import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Cpu, ShieldAlert, Users } from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES, ROLE_LABELS, type Role } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { EmptyState, SectionCard, StatusBadge, STATUS_TONE_CLASS, t } from '@shared-ui';
import { Greeting } from '@features/dashboard';
import { SEMESTERS } from './AdminSemestersPage';
import { OWNER_META, currentWeekOf, formatDate, phaseDates, phaseStatus, useSemesterTimeline } from '@features/semesters';
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
  { name: t('Google OAuth (sign-in)'), status: 'ok' },
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
      {t('System status:')} {ok ? t('stable') : t('{0} services responding slowly', { 0: slow.length })}
    </Link>
  );
}

function SemesterCard() {
  const active = SEMESTERS.find((s) => s.status === 'ACTIVE');
  const upcoming = SEMESTERS.find((s) => s.status === 'UPCOMING');
  const { cycleStart, phases } = useSemesterTimeline();
  const week = currentWeekOf(cycleStart);
  // Giai đoạn đang chạy + các giai đoạn sắp tới của chu trình 16 tuần
  const nextPhases = [...phases]
    .sort((a, b) => a.startWeek - b.startWeek)
    .filter((p) => phaseStatus(cycleStart, p) !== 'done')
    .slice(0, 5);

  return (
    <SectionCard title={t('Current semester')} actions={<Link to={R.SEMESTERS} className={LINK}>{t('Semester settings')}</Link>}>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {active && (
          <div>
            <dt className="text-label text-ink-muted">{t('In progress')}</dt>
            <dd className="text-section font-semibold text-ink">{active.name}</dd>
            <dd className="text-label text-ink-muted">
              {active.start} – {active.end} · {active.residents.toLocaleString('vi-VN')} {t('students in residence')}
            </dd>
          </div>
        )}
        {upcoming && (
          <div>
            <dt className="text-label text-ink-muted">{t('Next term ·')} {upcoming.regLocked ? t('registration closed') : t('registration open')}</dt>
            <dd className="text-section font-semibold text-ink">{upcoming.name}</dd>
            <dd className="text-label text-ink-muted">
              {t('Registration')} {upcoming.regOpen} – {upcoming.regClose} · {upcoming.applications.toLocaleString('vi-VN')} {t('applications')}
            </dd>
          </div>
        )}
      </dl>
      <h3 className="text-body font-semibold text-ink mt-6 mb-2">
        {t('16-week cycle')}
        {week && <span className="ml-2 font-normal text-ink-muted">· {t('currently week {0} of 16', { 0: week })}</span>}
      </h3>
      <ol className="divide-y divide-line border-y border-line">
        {nextPhases.map((p) => {
          const { start, end } = phaseDates(cycleStart, p);
          const active = phaseStatus(cycleStart, p) === 'active';
          return (
            <li key={p.id} className="flex items-center gap-3 py-2">
              <span className={clsx('w-2.5 h-2.5 rounded-full shrink-0', OWNER_META[p.owner].dot)} aria-hidden="true" />
              <span className="w-28 shrink-0 text-label text-ink-muted tabular-nums">
                {formatDate(start)} – {formatDate(end)}
              </span>
              <span className={clsx('flex-1 text-body', active ? 'font-semibold text-ink' : 'text-ink')}>{t(p.title)}</span>
              {active && <span className={clsx('px-2 py-0.5 rounded-full text-label font-semibold', STATUS_TONE_CLASS.info)}>{t('In progress')}</span>}
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}

function EngineCard() {
  const last = RUNS[0];
  return (
    <SectionCard title={t('Allocation engine')} actions={<Link to={R.ALLOCATION_ENGINE} className={LINK}>{t('Open engine')}</Link>}>
      {!last ? (
        <EmptyState icon={<Cpu className="w-8 h-8" />} title={t('No runs yet')} description={t('Run the engine after registration closes to create an allocation proposal.')} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-section font-semibold text-ink">{last.id}</span>
            <StatusBadge status={last.status} />
          </div>
          <p className="text-label text-ink-muted mt-1">
            {t('Latest run')} {last.when} · {last.type}
          </p>
          <dl className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <dt className="text-label text-ink-muted">{t('Applications placed')}</dt>
              <dd className="text-2xl font-bold text-ink">{last.total.toLocaleString('vi-VN')}</dd>
            </div>
            <div>
              <dt className="text-label text-ink-muted">{t('Conflicts')}</dt>
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
    ...draftSemesters.map((s) => ({ id: s.code, text: t('{0}: registration and check-in dates not set', { 0: s.name }), to: R.SEMESTERS })),
    ...(staffNoMfa.length ? [{ id: 'mfa', text: t('{0} staff accounts have not enabled two-factor authentication', { 0: staffNoMfa.length }), to: R.USERS }] : []),
  ];

  return (
    <SectionCard title={t('Configuration check')} subtitle={issues.length ? t('{0} items to complete', { 0: issues.length }) : undefined} noPadding>
      {issues.length === 0 ? (
        <div className="p-4 sm:p-6">
          <EmptyState icon={<CheckCircle2 className="w-8 h-8" />} title={t('Configuration complete')} description={t('Semesters, eligibility rules, pricing and accounts have no missing items.')} />
        </div>
      ) : (
        <ul className="divide-y divide-line">
          {issues.map((i) => (
            <li key={i.id} className="flex items-center gap-3 px-4 sm:px-6 py-3">
              <ShieldAlert className="w-5 h-5 text-pending shrink-0" aria-hidden="true" />
              <span className="flex-1 text-body text-ink">{i.text}</span>
              <Link to={i.to} className={LINK} aria-label={t('Edit: {0}', { 0: i.text })}>
                {t('Edit')}
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
    <SectionCard title={t('Accounts')} actions={<Link to={R.USERS} className={LINK}>{t('Manage')}</Link>}>
      <dl className="grid grid-cols-2 gap-4">
        {ROLE_ORDER.map((role) => (
          <div key={role}>
            <dt className="text-label text-ink-muted">{t(ROLE_LABELS[role])}</dt>
            <dd className="text-2xl font-bold text-ink">{ACCOUNTS.filter((a) => a.role === role).length}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line">
        <span className={clsx('inline-flex items-center gap-1 px-3 py-1 rounded-full text-label font-semibold', STATUS_TONE_CLASS[locked ? 'danger' : 'neutral'])}>
          <Users className="w-4 h-4" aria-hidden="true" /> {locked} {t('locked accounts')}
        </span>
        <span className={clsx('inline-flex items-center px-3 py-1 rounded-full text-label font-semibold', STATUS_TONE_CLASS.neutral)}>{inactive} {t('inactive')}</span>
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
