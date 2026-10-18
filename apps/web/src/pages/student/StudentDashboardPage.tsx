import { useNavigate } from 'react-router-dom';
import {
  Check,
  BadgeCheck,
  IdCard,
  Mail,
  BedDouble,
  Wallet,
  GraduationCap,
  FilePlus2,
  Wrench,
  CreditCard,
  ClipboardList,
  CalendarCheck,
  CalendarClock,
  Wallet2,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';
import { SectionCard, formatVnd } from '@shared-ui';
import { LatestNewsCard, QuickMenuCard, TaskListCard, WelcomeSection, type InfoTile, type QuickItem, type TaskItem } from '@features/dashboard';

/** Tổng quan sinh viên — thẻ thông tin, tin mới nhất, menu nhanh và việc cần làm (bố cục tham khảo FAP). */

const R = APP_ROUTES.STUDENT;
const NEW_APP = (type: string) => `${R.APPLICATION_NEW}?type=${type}`;

const QUICK: QuickItem[] = [
  { label: 'Gửi đơn', to: R.APPLICATION_NEW, icon: FilePlus2, tone: 'bg-orange-100 text-orange-600' },
  { label: 'Báo hỏng', to: NEW_APP('MAINTENANCE'), icon: Wrench, tone: 'bg-rose-100 text-rose-600' },
  { label: 'Hóa đơn', to: R.INVOICES, icon: CreditCard, tone: 'bg-emerald-100 text-emerald-600' },
  { label: 'Phòng của tôi', to: R.MY_ROOM, icon: BedDouble, tone: 'bg-sky-100 text-sky-600' },
  { label: 'Đăng ký lưu trú', to: R.REGISTRATION, icon: ClipboardList, tone: 'bg-violet-100 text-violet-600' },
  { label: 'Check-in/out', to: R.CHECKIN, icon: CalendarCheck, tone: 'bg-teal-100 text-teal-600' },
  { label: 'Gia hạn đóng tiền', to: NEW_APP('PAYMENT_EXTENSION'), icon: CalendarClock, tone: 'bg-amber-100 text-amber-600' },
  { label: 'Hoàn tiền', to: NEW_APP('REFUND'), icon: Wallet2, tone: 'bg-lime-100 text-lime-700' },
];

const TODO: TaskItem[] = [
  { title: 'Ký hợp đồng Spring 2027', desc: 'HD-KTX-1102 · cần ký trước khi check-in', to: R.MY_ROOM, cta: 'Ký ngay', dot: 'bg-[#F26F21]' },
  { title: 'Phản hồi lời mời hoán đổi phòng', desc: 'Đặng Minh Thư (A115) · hạn 19/10 23:59', to: R.APPLICATIONS, cta: 'Xem', dot: 'bg-violet-500' },
  { title: 'Thanh toán phí phòng Fall 2026 — đợt 2', desc: '2.600.000 ₫ · hạn 24/10/2026', to: R.INVOICES, cta: 'Thanh toán', dot: 'bg-emerald-500' },
];

const TRACK = [
  { label: 'Nộp đơn & đóng cọc', date: '16/10/2026', done: true },
  { label: 'Xếp phòng', date: '25/11/2026', done: true },
  { label: 'Ký hợp đồng', date: 'Đang chờ bạn', current: true },
  { label: 'Check-in', date: '02/01 – 05/01/2027' },
];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const tiles: InfoTile[] = [
    { label: 'Trạng thái lưu trú', value: 'Đang ở KTX', icon: BadgeCheck, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Mã sinh viên', value: user?.studentId ?? '—', icon: IdCard, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Email', value: user?.email ?? '—', icon: Mail, tone: 'bg-sky-50 text-sky-600' },
    { label: 'Phòng · Giường', value: 'A204 · G1 (Tòa A)', icon: BedDouble, tone: 'bg-violet-50 text-violet-600' },
    { label: 'Cần thanh toán', value: formatVnd(2600000), icon: Wallet, tone: 'bg-rose-50 text-rose-600' },
    { label: 'Chuyên ngành', value: user?.major ?? '—', icon: GraduationCap, tone: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={user?.name}
        subtitle="Học kỳ Fall 2026 · KTX FPT Tân Uyên"
        actions={[
          { label: 'Phòng của tôi', onClick: () => navigate(R.MY_ROOM) },
          { label: 'Gửi đơn', onClick: () => navigate(R.APPLICATION_NEW) },
        ]}
        tiles={tiles}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <LatestNewsCard />

          <SectionCard title="Tiến trình đơn Spring 2027">
            <ol className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRACK.map((s, i) => (
                <li key={s.label} className="relative flex gap-2.5">
                  <span
                    className={clsx(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold',
                      s.done ? 'bg-emerald-500 text-white' : s.current ? 'bg-[#F26F21] text-white ring-4 ring-orange-100' : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {s.done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <div>
                    <div className={clsx('text-sm font-bold', s.current ? 'text-[#F26F21]' : 'text-slate-800')}>{s.label}</div>
                    <div className="text-xs text-slate-500">{s.date}</div>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <QuickMenuCard items={QUICK} />
          <TaskListCard title="Việc cần làm" items={TODO} footer={{ label: 'Xem đơn của tôi', to: R.APPLICATIONS, icon: FileText }} />
        </div>
      </div>
    </div>
  );
}
