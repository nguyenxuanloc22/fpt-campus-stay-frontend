import {
  Building2,
  CalendarCheck,
  FileText,
  CreditCard,
  Wrench,
  ArrowRight,
  ArrowLeftRight,
  PenLine,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Megaphone,
  ChevronRight,
  ClipboardList,
  Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';
import { StatusBadge, AppButton, StatCard, SectionCard } from '@shared-ui';

/** Tổng quan sinh viên — tóm tắt Track Request Status & View Notifications. */

const R = APP_ROUTES.STUDENT;

/** Tiến trình đơn Spring 2027 theo State Diagram đơn đăng ký */
const APPLICATION_TRACK = [
  { label: 'Nộp đơn & đóng cọc', date: '16/10/2026', done: true },
  { label: 'Chờ xếp phòng', date: 'Processing', done: true },
  { label: 'Đã xếp phòng', date: '25/11/2026', done: true },
  { label: 'Ký hợp đồng', date: 'Đang chờ bạn', current: true },
  { label: 'Check-in', date: '02/01 – 05/01/2027' },
];

const TODO = [
  { icon: PenLine, title: 'Ký hợp đồng Spring 2027', desc: 'HD-KTX-1102 · cần ký trước khi check-in', to: R.MY_ROOM, cta: 'Ký ngay', tone: 'orange' },
  { icon: ArrowLeftRight, title: 'Lời mời hoán đổi phòng', desc: 'Đặng Minh Thư (A115) · hạn 19/10 23:59', to: R.REQUESTS, cta: 'Phản hồi', tone: 'purple' },
  { icon: CreditCard, title: 'Hóa đơn phí phòng Fall 2026 — đợt 2', desc: '2.400.000 ₫ · hạn 24/10/2026', to: R.INVOICES, cta: 'Thanh toán', tone: 'amber' },
];

const UPCOMING = [
  { day: '19', month: 'T10', title: 'Cắt nước vệ sinh bồn chứa Tòa A', time: '08:00 – 14:00', place: 'Tòa A', tone: 'blue' },
  { day: '24', month: 'T10', title: 'Hạn thanh toán phí phòng đợt 2', time: 'Trước 23:59', place: 'VietQR', tone: 'rose' },
  { day: '28', month: 'T10', title: 'Bảo dưỡng máy lạnh tầng 2', time: '08:00 – 11:00', place: 'Phòng A204', tone: 'blue' },
  { day: '02', month: 'T1', title: 'Mở khung check-in Spring 2027', time: '08:00', place: 'Sảnh Tòa A', tone: 'orange' },
];

const ANNOUNCEMENTS = [
  { title: 'Lịch cắt nước bảo trì bồn chứa Tòa A ngày 19/10', date: '16/10/2026', category: 'Bảo trì', isNew: true },
  { title: 'Kết quả xếp phòng vòng 1 học kỳ Spring 2027', date: '25/11/2026', category: 'Xếp phòng', isNew: true },
  { title: 'Nhắc nhở quy định giờ giới nghiêm 23:00', date: '10/10/2026', category: 'Nội quy', isNew: false },
];

const TONE: Record<string, string> = {
  orange: 'bg-orange-50 text-[#F26F21] border-orange-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
};

const QUICK = [
  { label: 'Đăng ký lưu trú', icon: ClipboardList, to: R.REGISTRATION },
  { label: 'Phòng của tôi', icon: Building2, to: R.MY_ROOM },
  { label: 'Báo hỏng', icon: Wrench, to: R.REQUESTS },
  { label: 'Đổi phòng', icon: ArrowLeftRight, to: R.REQUESTS },
  { label: 'Hóa đơn', icon: CreditCard, to: R.INVOICES },
  { label: 'Check-in / out', icon: CalendarCheck, to: R.CHECKIN },
];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#1A365D] to-[#2A4D7E] text-white p-6 md:p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-white/10 text-orange-300 rounded-full text-xs font-semibold mb-3">
            Học kỳ Fall 2026 · KTX FPT University Tân Uyên
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Xin chào, {user?.name}!</h1>
          <p className="text-slate-200 text-sm mb-6">Bạn có {TODO.length} việc cần làm. Đơn đăng ký Spring 2027 đã được xếp phòng.</p>
          <AppButton onClick={() => navigate(R.MY_ROOM)} rightIcon={<ArrowRight className="w-4 h-4" />}>Xem phòng Spring 2027</AppButton>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Phòng hiện tại" value="A204 · G1" icon={Building2} tone="orange" hint="Tòa A (Nữ) · Tầng 2" />
        <StatCard label="Đơn Spring 2027" value="Đã xếp phòng" icon={FileText} tone="emerald" hint="APP-SP27-004812" />
        <StatCard label="Cần thanh toán" value="2.400.000 ₫" icon={CreditCard} tone="amber" hint="Hạn 24/10/2026" />
        <StatCard label="Yêu cầu đang xử lý" value="2" icon={Wrench} tone="blue" hint="1 báo hỏng · 1 đổi phòng" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Việc cần làm" noPadding>
            <ul className="divide-y divide-slate-100">
              {TODO.map((t) => (
                <li key={t.title} className="px-5 py-3.5 flex items-center gap-3">
                  <div className={clsx('w-10 h-10 rounded-xl border flex items-center justify-center shrink-0', TONE[t.tone])}><t.icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800">{t.title}</div>
                    <div className="text-[11px] text-slate-500">{t.desc}</div>
                  </div>
                  <AppButton size="sm" variant="outline" onClick={() => navigate(t.to)}>{t.cta}</AppButton>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Tiến trình đơn đăng ký Spring 2027" actions={<StatusBadge status="ASSIGNED" />}>
            <ol className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {APPLICATION_TRACK.map((s, i) => (
                <li key={s.label} className="flex sm:flex-col items-start gap-3 sm:gap-2">
                  <div className="flex items-center gap-2 w-full">
                    {s.done ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    ) : s.current ? (
                      <span className="w-6 h-6 rounded-full border-2 border-[#F26F21] bg-orange-50 flex items-center justify-center shrink-0"><span className="w-2 h-2 rounded-full bg-[#F26F21] animate-pulse" /></span>
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                    )}
                    {i < APPLICATION_TRACK.length - 1 && <div className={clsx('hidden sm:block h-0.5 flex-1', s.done ? 'bg-emerald-300' : 'bg-slate-200')} />}
                  </div>
                  <div>
                    <div className={clsx('text-xs font-semibold', s.current ? 'text-[#F26F21]' : 'text-slate-800')}>{s.label}</div>
                    <div className="text-[11px] text-slate-500">{s.date}</div>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="Truy cập nhanh">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {QUICK.map((q) => (
                <button key={q.label} type="button" onClick={() => navigate(q.to)} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-[#FFF2EA] hover:border-orange-200 text-center transition">
                  <q.icon className="w-5 h-5 text-[#F26F21] mx-auto mb-1.5" />
                  <div className="text-[11px] font-semibold text-slate-700">{q.label}</div>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Sắp diễn ra">
            <ul className="space-y-3">
              {UPCOMING.map((e) => (
                <li key={e.title} className="flex gap-3">
                  <div className={clsx('w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0', TONE[e.tone])}>
                    <span className="text-base font-bold leading-none">{e.day}</span>
                    <span className="text-[10px] font-semibold">{e.month}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-800">{e.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{e.place}</div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title={<span className="flex items-center gap-2"><Megaphone className="w-4 h-4 text-[#F26F21]" />Thông báo mới</span>} noPadding>
            <ul className="divide-y divide-slate-100">
              {ANNOUNCEMENTS.map((a) => (
                <li key={a.title}>
                  <button type="button" onClick={() => navigate(R.NOTIFICATIONS)} className="w-full px-5 py-3 text-left hover:bg-slate-50 flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase text-[#1A365D] bg-[#EBF2FB] px-1.5 py-0.5 rounded">{a.category}</span>
                        {a.isNew && <span className="w-1.5 h-1.5 rounded-full bg-[#F26F21]" />}
                      </div>
                      <div className="text-xs font-medium text-slate-800">{a.title}</div>
                      <div className="text-[11px] text-slate-400">{a.date}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 mt-1" />
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="rounded-2xl p-5 bg-[#1A365D] text-white text-xs space-y-2">
            <div className="text-sm font-bold mb-2">Liên hệ Ban quản lý KTX</div>
            <div className="flex justify-between"><span className="text-slate-300">Văn phòng KTX</span><span className="font-semibold flex items-center gap-1"><Phone className="w-3 h-3" />0274 3 789 001</span></div>
            <div className="flex justify-between"><span className="text-slate-300">Bảo vệ 24/7</span><span className="font-semibold flex items-center gap-1"><Phone className="w-3 h-3" />0274 3 789 115</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
