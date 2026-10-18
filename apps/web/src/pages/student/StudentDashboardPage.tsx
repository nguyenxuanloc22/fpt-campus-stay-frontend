import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, BedDouble, CalendarCheck, CreditCard, FileSignature, Lock, Users, Wrench, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { ActionList, Greeting, JourneySteps, NoticeList, type ActionItem, type JourneyStep } from '@features/dashboard';
import { AppButton, SectionCard, STATUS_TONE_CLASS, daysUntil, formatDaysLeft } from '@shared-ui';

/**
 * Tổng quan sinh viên (ưu tiên từ trên xuống): lời chào + trạng thái chỗ ở → việc cần làm → hành trình
 * → phòng của tôi → lối tắt → thông báo. Dữ liệu mẫu lấy theo các trang Phòng của tôi / Check-in / Hóa đơn.
 */

const R = APP_ROUTES.STUDENT;

const ROOM = { code: 'A204', bed: 'G1', building: 'Tòa A', type: 'Phòng 4 người' };
const ROOMMATES = ['Võ Thị Bảo Ngọc', 'Phạm Ngọc Hân', 'Trần Khánh Linh'];
const CHECKIN_OPENS = '08:00 02/01/2027';

const JOURNEY: JourneyStep[] = [
  { label: 'Đăng ký', date: '16/10/2026', state: 'done' },
  { label: 'Đặt cọc', date: '16/10/2026', state: 'done' },
  { label: 'Xếp phòng', date: '25/11/2026', state: 'done' },
  { label: 'Ký hợp đồng', state: 'current' },
  { label: 'Check-in', date: '02/01 – 05/01/2027', state: 'todo' },
];

const SHORTCUTS: { label: string; to: string; icon: LucideIcon }[] = [
  { label: 'Báo hỏng', to: `${R.APPLICATION_NEW}?type=MAINTENANCE`, icon: Wrench },
  { label: 'Hóa đơn', to: R.INVOICES, icon: CreditCard },
  { label: 'Đổi phòng', to: `${R.APPLICATION_NEW}?type=ROOM_CHANGE`, icon: ArrowLeftRight },
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
    <SectionCard title="Phòng của tôi" actions={<Link to={R.MY_ROOM} className={LINK}>Xem chi tiết</Link>}>
      <dl className="grid grid-cols-2 gap-4">
        <div>
          <dt className="text-label text-ink-muted">Phòng</dt>
          <dd className="text-section font-semibold text-ink">{ROOM.code}</dd>
          <dd className="text-label text-ink-muted">
            {ROOM.building} · {ROOM.type}
          </dd>
        </div>
        <div>
          <dt className="text-label text-ink-muted">Giường</dt>
          <dd className="text-section font-semibold text-ink">{ROOM.bed}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-label text-ink-muted flex items-center gap-1">
            <Users className="w-4 h-4" aria-hidden="true" /> Bạn cùng phòng
          </dt>
          <dd className="text-body text-ink mt-1">{ROOMMATES.join(', ')}</dd>
        </div>
      </dl>
      <div className="mt-4 pt-4 border-t border-line">
        <AppButton variant="outline" className="w-full" disabled aria-describedby="checkin-reason" leftIcon={<Lock className="w-4 h-4" />}>
          Check-in
        </AppButton>
        <p id="checkin-reason" className="text-label text-ink-muted mt-2 text-center">
          Mở từ {CHECKIN_OPENS}
        </p>
      </div>
    </SectionCard>
  );
}

function Shortcuts() {
  return (
    <SectionCard title="Lối tắt">
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
      title: 'Phản hồi lời mời đổi phòng',
      meta: 'Đặng Minh Thư (A115) muốn đổi phòng với bạn',
      badge: deadlineBadge('19/10/2026'),
      action: { label: 'Phản hồi', onClick: () => navigate(R.APPLICATIONS) },
    },
    {
      id: 'invoice',
      icon: CreditCard,
      title: 'Phí phòng Fall 2026 — đợt 2',
      meta: '2.600.000 ₫ · hạn 24/10/2026',
      badge: deadlineBadge('24/10/2026'),
      action: { label: 'Thanh toán', onClick: () => navigate(R.INVOICES), primary: true },
    },
    {
      id: 'contract',
      icon: FileSignature,
      title: 'Ký hợp đồng Spring 2027',
      meta: 'HD-KTX-1102 · cần ký trước khi check-in',
      badge: deadlineBadge('02/01/2027'),
      action: { label: 'Ký hợp đồng', onClick: () => navigate(R.MY_ROOM) },
    },
  ];

  return (
    <div className="space-y-6">
      <Greeting
        name={user?.name}
        chip={
          <span className={clsx('inline-flex items-center gap-1 px-3 py-1 rounded-full text-label font-semibold', STATUS_TONE_CLASS.success)}>
            <BedDouble className="w-4 h-4" aria-hidden="true" />
            Đang ở KTX · {ROOM.code}-{ROOM.bed}
          </span>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Việc cần làm" subtitle="Xếp theo hạn gần nhất" noPadding>
            <ActionList
              items={todos.slice(0, 3)}
              empty={{ title: 'Bạn đã xong hết việc', description: 'Khi có hóa đơn hay hợp đồng cần xử lý, chúng sẽ hiện ở đây.' }}
            />
          </SectionCard>

          <SectionCard title="Hành trình lưu trú Spring 2027">
            <JourneySteps steps={JOURNEY} />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <MyRoomCard />
          <Shortcuts />
        </div>
      </div>

      <SectionCard
        title="Thông báo"
        actions={
          <Link to={APP_ROUTES.COMMON.NOTIFICATIONS} className={LINK}>
            Xem tất cả
          </Link>
        }
        noPadding
      >
        <NoticeList limit={3} onViewAll={() => navigate(APP_ROUTES.COMMON.NOTIFICATIONS)} />
      </SectionCard>
    </div>
  );
}
