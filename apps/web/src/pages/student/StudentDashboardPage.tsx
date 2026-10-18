import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronRight,
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
  Pin,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';
import { SectionCard, formatVnd } from '@shared-ui';
import {
  ANNOUNCEMENTS,
  ANNOUNCEMENT_CATEGORY_LABEL,
  ANNOUNCEMENT_CATEGORY_TONE,
  type AnnouncementCategory,
} from '@features/notifications/systemAnnouncements';

/** Tổng quan sinh viên — thẻ thông tin, tin mới nhất, menu nhanh và việc cần làm (bố cục tham khảo FAP). */

const R = APP_ROUTES.STUDENT;
const NEW_APP = (type: string) => `${R.APPLICATION_NEW}?type=${type}`;

interface InfoTile {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
}

interface QuickItem {
  label: string;
  to: string;
  icon: LucideIcon;
  tone: string;
}

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

const TODO = [
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

type NewsFilter = 'ALL' | AnnouncementCategory;
const NEWS_FILTERS: NewsFilter[] = ['ALL', 'DORM', 'FINANCE', 'MAINTENANCE', 'SYSTEM'];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [filter, setFilter] = useState<NewsFilter>('ALL');

  const news = ANNOUNCEMENTS.filter((a) => filter === 'ALL' || a.category === filter).slice(0, 5);

  const tiles: InfoTile[] = [
    { label: 'Trạng thái lưu trú', value: 'Đang ở KTX', icon: BadgeCheck, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Mã sinh viên', value: user?.studentId ?? '—', icon: IdCard, tone: 'bg-orange-50 text-orange-600' },
    { label: 'Email', value: user?.email ?? '—', icon: Mail, tone: 'bg-sky-50 text-sky-600' },
    { label: 'Phòng · Giường', value: 'A204 · G1 (Tòa A)', icon: BedDouble, tone: 'bg-violet-50 text-violet-600' },
    { label: 'Cần thanh toán', value: formatVnd(2600000), icon: Wallet, tone: 'bg-rose-50 text-rose-600' },
    { label: 'Chuyên ngành', value: user?.major ?? '—', icon: GraduationCap, tone: 'bg-amber-50 text-amber-600' },
  ];

  const initials = (user?.name ?? 'SV').split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className="space-y-6">
      {/* Thẻ chào mừng */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(280px,360px)_1fr] gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F26F21] via-[#F7823A] to-[#FFB067] text-white p-6 shadow-lg shadow-orange-500/20">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-6 bottom-[-30px] w-24 h-24 rounded-full bg-white/10" />
          <div className="relative flex items-center gap-4">
            <span className="w-16 h-16 rounded-2xl bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-xl font-black">{initials}</span>
            <div className="min-w-0">
              <p className="text-sm text-white/85 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Xin chào,</p>
              <h1 className="text-xl font-extrabold leading-tight truncate">{user?.name}</h1>
              <p className="text-xs text-white/80 mt-0.5">Học kỳ Fall 2026 · KTX FPT Tân Uyên</p>
            </div>
          </div>
          <div className="relative mt-6 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => navigate(R.MY_ROOM)} className="px-3 py-2 rounded-xl bg-white text-[#F26F21] text-sm font-bold hover:bg-orange-50">Phòng của tôi</button>
            <button type="button" onClick={() => navigate(R.APPLICATION_NEW)} className="px-3 py-2 rounded-xl bg-white/15 ring-1 ring-white/40 text-sm font-bold hover:bg-white/25">Gửi đơn</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
              <span className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', t.tone)}>
                <t.icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t.label}</div>
                <div className="text-sm font-bold text-slate-800 truncate" title={t.value}>{t.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Tin mới nhất */}
          <SectionCard
            title="Tin mới nhất"
            actions={
              <button type="button" onClick={() => navigate(APP_ROUTES.COMMON.NOTIFICATIONS)} className="text-xs font-bold text-[#F26F21] hover:underline flex items-center gap-0.5">
                Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
            noPadding
          >
            <div className="px-5 pt-1 pb-3 flex gap-1.5 flex-wrap border-b border-slate-100">
              {NEWS_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={clsx('px-3 py-1 rounded-full text-xs font-bold border transition', filter === f ? 'bg-[#F26F21] text-white border-[#F26F21]' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300')}
                >
                  {f === 'ALL' ? 'Tất cả' : ANNOUNCEMENT_CATEGORY_LABEL[f]}
                </button>
              ))}
            </div>
            <ul className="divide-y divide-slate-100">
              {news.map((n) => (
                <li key={n.id}>
                  <button type="button" onClick={() => navigate(APP_ROUTES.COMMON.NOTIFICATIONS)} className="w-full px-5 py-3.5 text-left hover:bg-orange-50/40 flex items-start gap-3">
                    <span className="w-12 shrink-0 text-center rounded-xl border border-slate-200 py-1">
                      <span className="block text-base font-extrabold text-slate-800 leading-none">{n.date.slice(0, 2)}</span>
                      <span className="block text-[10px] text-slate-400">Th{Number(n.date.slice(3, 5))}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', ANNOUNCEMENT_CATEGORY_TONE[n.category])}>{ANNOUNCEMENT_CATEGORY_LABEL[n.category]}</span>
                        {n.important && <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700"><Pin className="w-2.5 h-2.5" />Quan trọng</span>}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 leading-snug">{n.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{n.body}</div>
                    </div>
                  </button>
                </li>
              ))}
              {news.length === 0 && <li className="px-5 py-6 text-center text-xs text-slate-400">Chưa có tin trong danh mục này.</li>}
            </ul>
          </SectionCard>

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
          {/* Menu nhanh */}
          <SectionCard title="Menu nhanh">
            <div className="grid grid-cols-4 gap-2">
              {QUICK.map((q) => (
                <button key={q.label} type="button" onClick={() => navigate(q.to)} className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 text-center">
                  <span className={clsx('w-11 h-11 rounded-xl flex items-center justify-center transition group-hover:scale-105', q.tone)}>
                    <q.icon className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 leading-tight">{q.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Việc cần làm" actions={<span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#C2410C] text-[11px] font-bold">{TODO.length}</span>} noPadding>
            <ul className="divide-y divide-slate-100">
              {TODO.map((t) => (
                <li key={t.title}>
                  <button type="button" onClick={() => navigate(t.to)} className="w-full px-5 py-3.5 flex items-center gap-3 text-left hover:bg-slate-50">
                    <span className={clsx('w-2 h-2 rounded-full shrink-0', t.dot)} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-800">{t.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                    </div>
                    <span className="text-xs font-bold text-[#F26F21] shrink-0">{t.cta}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => navigate(R.APPLICATIONS)} className="w-full px-5 py-3 border-t border-slate-100 text-xs font-bold text-slate-500 hover:text-[#F26F21] flex items-center justify-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Xem đơn của tôi
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
