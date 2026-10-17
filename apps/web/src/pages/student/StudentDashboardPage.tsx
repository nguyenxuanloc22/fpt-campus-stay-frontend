import { ArrowRight, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES } from '@campusstay/constants';
import { StatusBadge, AppButton, SectionCard } from '@shared-ui';

/** Tổng quan sinh viên — chỉ những thông tin cần xử lý và trạng thái quan trọng. */

const R = APP_ROUTES.STUDENT;

const SUMMARY = [
  { label: 'Phòng hiện tại', value: 'A204 · Giường G1', hint: 'Tòa A · Phòng 4 người', to: R.MY_ROOM },
  { label: 'Đơn Spring 2027', value: 'Đã xếp phòng', hint: 'Chờ ký hợp đồng', to: R.MY_ROOM },
  { label: 'Cần thanh toán', value: '2.400.000 ₫', hint: 'Hạn 24/10/2026', to: R.INVOICES },
];

const TODO = [
  { title: 'Ký hợp đồng Spring 2027', desc: 'HD-KTX-1102 · cần ký trước khi check-in', to: R.MY_ROOM, cta: 'Ký ngay' },
  { title: 'Phản hồi lời mời hoán đổi phòng', desc: 'Đặng Minh Thư (A115) · hạn 19/10 23:59', to: R.REQUESTS, cta: 'Xem' },
  { title: 'Thanh toán phí phòng Fall 2026 — đợt 2', desc: '2.400.000 ₫ · hạn 24/10/2026', to: R.INVOICES, cta: 'Thanh toán' },
];

const TRACK = [
  { label: 'Nộp đơn & đóng cọc', date: '16/10/2026', done: true },
  { label: 'Xếp phòng', date: '25/11/2026', done: true },
  { label: 'Ký hợp đồng', date: 'Đang chờ bạn', current: true },
  { label: 'Check-in', date: '02/01 – 05/01/2027' },
];

const NOTICES = [
  { title: 'Mở cửa sổ đăng ký lưu trú học kỳ Spring 2027', date: '14/10/2026' },
  { title: 'Tạm ngưng cấp nước Tòa A ngày 19/10/2026', date: '16/10/2026' },
  { title: 'Nâng cấp Wi-Fi toàn khu KTX đêm 21/10', date: '12/10/2026' },
];

export function StudentDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">Học kỳ Fall 2026 · KTX FPT Tân Uyên</p>
          <h1 className="text-2xl font-bold text-slate-900">Xin chào, {user?.name}</h1>
        </div>
        <AppButton variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate(R.MY_ROOM)}>Phòng của tôi</AppButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SUMMARY.map((s) => (
          <button key={s.label} type="button" onClick={() => navigate(s.to)} className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition">
            <div className="text-xs font-medium text-slate-500">{s.label}</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.hint}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Việc cần làm" noPadding>
            <ul className="divide-y divide-slate-100">
              {TODO.map((t) => (
                <li key={t.title} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                  </div>
                  <AppButton size="sm" variant="outline" onClick={() => navigate(t.to)}>{t.cta}</AppButton>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Tiến trình đơn Spring 2027" actions={<StatusBadge status="ASSIGNED" />}>
            <ol className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRACK.map((s) => (
                <li key={s.label} className="flex gap-2.5">
                  <span
                    className={clsx(
                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs',
                      s.done ? 'bg-slate-900 text-white' : s.current ? 'border-2 border-[#F26F21] text-[#F26F21]' : 'border-2 border-slate-200'
                    )}
                  >
                    {s.done && <Check className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <div className={clsx('text-sm font-semibold', s.current ? 'text-[#F26F21]' : 'text-slate-900')}>{s.label}</div>
                    <div className="text-xs text-slate-500">{s.date}</div>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>

        <SectionCard
          title="Thông báo chung"
          actions={<button type="button" onClick={() => navigate(APP_ROUTES.COMMON.NOTIFICATIONS)} className="text-xs font-semibold text-slate-500 hover:text-slate-900">Xem tất cả</button>}
          noPadding
        >
          <ul className="divide-y divide-slate-100">
            {NOTICES.map((n) => (
              <li key={n.title}>
                <button type="button" onClick={() => navigate(APP_ROUTES.COMMON.NOTIFICATIONS)} className="w-full px-5 py-3.5 text-left hover:bg-slate-50 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-900 leading-snug">{n.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{n.date}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
