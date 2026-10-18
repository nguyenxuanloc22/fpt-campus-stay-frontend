import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, BedDouble, CalendarCheck, CreditCard, FileSignature, Lock, Users, Wrench, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { ActionList, Greeting, JourneySteps, NoticeList, type ActionItem, type JourneyStep } from '@features/dashboard';
import { AppButton, SectionCard, STATUS_TONE_CLASS, daysUntil, formatDaysLeft, t } from '@shared-ui';

/**
 * Tổng quan sinh viên (ưu tiên từ trên xuống): lời chào + trạng thái chỗ ở → việc cần làm → hành trình
 * → phòng của tôi → lối tắt → thông báo. Dữ liệu mẫu lấy theo các trang Phòng của tôi / Check-in / Hóa đơn.
 */

const R = APP_ROUTES.STUDENT;

const ROOM = { code: 'A204', bed: 'G1', building: t('Building A'), type: t('4-person room') };
const ROOMMATES = ['Võ Thị Bảo Ngọc', 'Phạm Ngọc Hân', 'Trần Khánh Linh'];
const CHECKIN_OPENS = '08:00 02/01/2027';

const JOURNEY: JourneyStep[] = [
  { label: t('Registration'), date: '16/10/2026', state: 'done' },
  { label: t('Deposit'), date: '16/10/2026', state: 'done' },
  { label: t('Allocation'), date: '25/11/2026', state: 'done' },
  { label: t('Sign contract'), state: 'current' },
  { label: 'Check-in', date: '02/01 – 05/01/2027', state: 'todo' },
];

const SHORTCUTS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: t('Report a fault'), to: `${R.APPLICATION_NEW}?type=MAINTENANCE`, icon: Wrench },
  { label: t('Invoice'), to: R.INVOICES, icon: CreditCard },
  { label: t('Room changes'), to: `${R.APPLICATION_NEW}?type=ROOM_CHANGE`, icon: ArrowLeftRight },
  { label: 'Check-in', to: R.CHECKIN, icon: CalendarCheck },
];

const LINK = 'min-h-touch inline-flex items-center text-body font-semibold text-brand-ink hover:underline';

/** Hạn → chip: quá hạn đỏ, còn hạn vàng (chờ) */
const deadlineBadge = (due: string) => {
  const days = daysUntil(due);
  return { label: formatDaysLeft(days), tone: days < 0 ? ('danger' as const) : ('pending' as const) };
};

function MyRoomCard() {
  return (
    <SectionCard title={t('My room')} actions={<Link to={R.MY_ROOM} className={LINK}>{t('View details')}</Link>}>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-label text-ink-muted">{t('Room')}</dt>
          <dd className="text-section font-semibold text-ink">{ROOM.code}</dd>
          <dd className="text-label text-ink-muted">
            {ROOM.building} · {ROOM.type}
          </dd>
        </div>
        <div>
          <dt className="text-label text-ink-muted">{t('Bed')}</dt>
          <dd className="text-section font-semibold text-ink">{ROOM.bed}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-label text-ink-muted flex items-center gap-1">
            <Users className="w-4 h-4" aria-hidden="true" /> {t('Roommates')}
          </dt>
          <dd className="text-body text-ink mt-1">{ROOMMATES.join(', ')}</dd>
        </div>
      </dl>
      <div className="mt-4 pt-4 border-t border-line">
        <AppButton variant="outline" className="w-full" disabled aria-describedby="checkin-reason" leftIcon={<Lock className="w-4 h-4" />}>
          Check-in
        </AppButton>
        <p id="checkin-reason" className="text-label text-ink-muted mt-2 text-center">
          {t('Opens from')} {CHECKIN_OPENS}
        </p>
      </div>
    </SectionCard>
  );
}

function Shortcuts() {
  return (
    <SectionCard title={t('Shortcuts')}>
      <ul className="grid grid-cols-4 lg:grid-cols-2 gap-2">
        {SHORTCUTS.map((s) => (
          <li key={s.label}>
            <Link
              to={s.to}
              className="flex flex-col items-center justify-center gap-2 min-h-20 px-1 py-3 rounded-control border border-line text-center text-label font-medium text-ink hover:bg-surface-muted active:bg-surface-sunken"
            >
              <s.icon className="w-5 h-5 text-ink-muted" aria-hidden="true" />
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Tối đa 3 việc, xếp theo hạn gần nhất; chỉ “Thanh toán” là nút chính
  const todos: ActionItem[] = [
    {
      id: 'swap',
      icon: ArrowLeftRight,
      title: t('Respond to a room swap invitation'),
      meta: t('Đặng Minh Thư (A115) wants to swap rooms with you'),
      badge: deadlineBadge('19/10/2026'),
      action: { label: t('Respond'), onClick: () => navigate(R.APPLICATIONS) },
    },
    {
      id: 'invoice',
      icon: CreditCard,
      title: t('Fall 2026 room fee — installment 2'),
      meta: t('2.600.000 ₫ · due 24/10/2026'),
      badge: deadlineBadge('24/10/2026'),
      action: { label: t('Payment'), onClick: () => navigate(R.INVOICES), primary: true },
    },
    {
      id: 'contract',
      icon: FileSignature,
      title: t('Sign the Spring 2027 contract'),
      meta: t('HD-KTX-1102 · must be signed before check-in'),
      badge: deadlineBadge('02/01/2027'),
      action: { label: t('Sign contract'), onClick: () => navigate(R.MY_ROOM) },
    },
  ];

  return (
    <div className="space-y-6">
      <Greeting
        name={user?.name}
        chip={
          <span className={clsx('inline-flex items-center gap-1 px-3 py-1 rounded-full text-label font-semibold', STATUS_TONE_CLASS.success)}>
            <BedDouble className="w-4 h-4" aria-hidden="true" />
            {t('Living in the dormitory ·')} {ROOM.code}-{ROOM.bed}
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title={t('To do')} subtitle={t('Sorted by nearest deadline')} noPadding>
            <ActionList
              items={todos.slice(0, 3)}
              empty={{ title: t('You\'re all caught up'), description: t('Invoices or contracts that need action will appear here.') }}
            />
          </SectionCard>

          <SectionCard title={t('Spring 2027 accommodation journey')}>
            <JourneySteps steps={JOURNEY} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <MyRoomCard />
          <Shortcuts />
        </div>
      </div>

      <SectionCard
        title={t('Announcement')}
        actions={
          <Link to={APP_ROUTES.COMMON.NOTIFICATIONS} className={LINK}>
            {t('View all')}
          </Link>
        }
        noPadding
      >
        <NoticeList limit={3} onViewAll={() => navigate(APP_ROUTES.COMMON.NOTIFICATIONS)} />
      </SectionCard>
    </div>
  );
}
