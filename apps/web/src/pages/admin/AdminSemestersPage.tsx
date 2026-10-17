import { useState } from 'react';
import { Plus, Calendar, Pencil, Lock, Unlock, CalendarRange, CheckCircle2, Clock, Copy } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, StatusBadge, AppButton, Modal, ProgressBar, useToast } from '@shared-ui';

type SemStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'DRAFT';

interface Semester {
  code: string;
  name: string;
  start: string;
  end: string;
  regOpen: string;
  regClose: string;
  checkin: string;
  status: SemStatus;
  regLocked: boolean;
  applications: number;
  residents: number;
  progress: number;
}

const SEMESTERS: Semester[] = [
  { code: 'SP27', name: 'Spring 2027', start: '04/01/2027', end: '30/04/2027', regOpen: '14/10/2026', regClose: '15/11/2026', checkin: '02/01/2027 – 05/01/2027', status: 'UPCOMING', regLocked: false, applications: 1284, residents: 0, progress: 0 },
  { code: 'FA26', name: 'Fall 2026', start: '01/09/2026', end: '31/12/2026', regOpen: '01/08/2026', regClose: '25/08/2026', checkin: '28/08/2026 – 31/08/2026', status: 'ACTIVE', regLocked: true, applications: 1356, residents: 1075, progress: 38 },
  { code: 'SU26', name: 'Summer 2026', start: '05/05/2026', end: '25/08/2026', regOpen: '01/04/2026', regClose: '25/04/2026', checkin: '03/05/2026 – 05/05/2026', status: 'COMPLETED', regLocked: true, applications: 712, residents: 658, progress: 100 },
  { code: 'SP26', name: 'Spring 2026', start: '05/01/2026', end: '30/04/2026', regOpen: '15/10/2025', regClose: '20/11/2025', checkin: '03/01/2026 – 05/01/2026', status: 'COMPLETED', regLocked: true, applications: 1198, residents: 1051, progress: 100 },
  { code: 'SU27', name: 'Summer 2027', start: '05/05/2027', end: '25/08/2027', regOpen: '—', regClose: '—', checkin: '—', status: 'DRAFT', regLocked: true, applications: 0, residents: 0, progress: 0 },
];

const MILESTONES = [
  { d: '14/10', t: 'Mở cổng đăng ký', done: true },
  { d: '01/11', t: 'Hạn gia hạn giữ phòng', done: false },
  { d: '15/11', t: 'Đóng cổng đăng ký', done: false },
  { d: '25/11', t: 'Engine đợt 1', done: false },
  { d: '02/12', t: 'Engine đợt 2', done: false },
  { d: '20/12', t: 'Hạn thanh toán', done: false },
  { d: '02/01', t: 'Check-in', done: false },
];

export function AdminSemestersPage() {
  const { show, toastNode } = useToast();
  const [items, setItems] = useState(SEMESTERS);
  const [editing, setEditing] = useState<Semester | null>(null);
  const [creating, setCreating] = useState(false);

  const toggleLock = (code: string) => {
    setItems((all) => all.map((s) => (s.code === code ? { ...s, regLocked: !s.regLocked } : s)));
    const s = items.find((x) => x.code === code);
    show(s?.regLocked ? `Đã mở cổng đăng ký ${s.name}` : `Đã khóa cổng đăng ký ${s?.name}`, 'info');
  };

  const active = items.find((s) => s.status === 'ACTIVE');
  const upcoming = items.find((s) => s.status === 'UPCOMING');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cấu Hình Kỳ Học"
        description="Quản lý học kỳ lưu trú, thời gian mở cổng đăng ký, check-in và các mốc vận hành"
        actions={<AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreating(true)}>Tạo học kỳ</AppButton>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Học kỳ đang vận hành" value={active?.name ?? '—'} icon={Calendar} tone="emerald" hint={`Tuần 7/16`} />
        <StatCard label="Đang mở đăng ký" value={upcoming?.name ?? '—'} icon={CalendarRange} tone="orange" hint={`${upcoming?.applications.toLocaleString('vi-VN')} đơn`} />
        <StatCard label="Ngày còn lại" value="29 ngày" icon={Clock} tone="amber" hint="đến khi đóng cổng" />
        <StatCard label="Học kỳ đã hoàn tất" value={items.filter((s) => s.status === 'COMPLETED').length} icon={CheckCircle2} tone="navy" />
      </div>

      {upcoming && (
        <SectionCard title={`Tiến trình ${upcoming.name}`} subtitle="Các mốc thời gian được dùng bởi engine xếp phòng và hệ thống thông báo tự động">
          <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {MILESTONES.map((m) => (
              <li key={m.t} className={clsx('p-3 rounded-xl border text-center', m.done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200')}>
                <div className={clsx('text-sm font-bold', m.done ? 'text-emerald-700' : 'text-[#1A365D]')}>{m.d}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{m.t}</div>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((s) => (
          <div key={s.code} className={clsx('bg-white p-5 rounded-2xl border shadow-xs', s.status === 'ACTIVE' ? 'border-emerald-300' : s.status === 'UPCOMING' ? 'border-orange-300' : 'border-slate-200')}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-800">{s.name}</h3>
                  <span className="text-[10px] font-bold text-slate-400">{s.code}</span>
                </div>
                <div className="text-xs text-slate-500">{s.start} – {s.end}</div>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-4">
              <div className="p-2.5 rounded-lg bg-slate-50"><div className="text-slate-400">Cổng đăng ký</div><div className="font-semibold">{s.regOpen} – {s.regClose}</div></div>
              <div className="p-2.5 rounded-lg bg-slate-50"><div className="text-slate-400">Check-in</div><div className="font-semibold">{s.checkin}</div></div>
              <div className="p-2.5 rounded-lg bg-slate-50"><div className="text-slate-400">Số đơn</div><div className="font-semibold">{s.applications.toLocaleString('vi-VN')}</div></div>
              <div className="p-2.5 rounded-lg bg-slate-50"><div className="text-slate-400">Lưu trú</div><div className="font-semibold">{s.residents.toLocaleString('vi-VN')}</div></div>
            </div>
            {s.status === 'ACTIVE' && (
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>Tiến độ học kỳ</span><span>{s.progress}%</span></div>
                <ProgressBar value={s.progress} tone="emerald" />
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <AppButton size="sm" variant="outline" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => setEditing(s)} disabled={s.status === 'COMPLETED'}>Chỉnh sửa</AppButton>
              {(s.status === 'UPCOMING' || s.status === 'DRAFT') && (
                <AppButton size="sm" variant={s.regLocked ? 'primary' : 'outline'} leftIcon={s.regLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} onClick={() => toggleLock(s.code)}>
                  {s.regLocked ? 'Mở cổng đăng ký' : 'Khóa cổng đăng ký'}
                </AppButton>
              )}
              <AppButton size="sm" variant="ghost" leftIcon={<Copy className="w-3.5 h-3.5" />} onClick={() => show(`Đã nhân bản cấu hình ${s.name}`, 'info')}>Nhân bản</AppButton>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!editing || creating}
        onClose={() => { setEditing(null); setCreating(false); }}
        size="lg"
        title={creating ? 'Tạo học kỳ mới' : `Chỉnh sửa ${editing?.name}`}
        footer={
          <>
            <AppButton variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Hủy</AppButton>
            <AppButton onClick={() => { show(creating ? 'Đã tạo học kỳ (bản nháp)' : 'Đã lưu cấu hình học kỳ'); setEditing(null); setCreating(false); }}>Lưu</AppButton>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div><label className="block font-semibold text-slate-700 mb-1">Mã học kỳ</label><input defaultValue={editing?.code ?? 'FA27'} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Tên hiển thị</label><input defaultValue={editing?.name ?? 'Fall 2027'} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Ngày bắt đầu lưu trú</label><input type="date" defaultValue="2027-09-01" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Ngày kết thúc</label><input type="date" defaultValue="2027-12-31" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Mở cổng đăng ký</label><input type="datetime-local" defaultValue="2027-08-01T08:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Đóng cổng đăng ký</label><input type="datetime-local" defaultValue="2027-08-25T23:59" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Thời hạn giữ chỗ chờ đóng cọc (phút)</label><input type="number" defaultValue={15} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Ngày chạy xếp phòng vòng 1</label><input type="datetime-local" defaultValue="2027-08-27T03:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Ngày mở vòng 2 & lấp chỗ</label><input type="datetime-local" defaultValue="2027-09-03T03:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Hạn thanh toán hóa đơn phí phòng</label><input type="date" defaultValue="2027-08-28" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Mở khung check-in</label><input type="datetime-local" defaultValue="2027-08-29T08:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <div><label className="block font-semibold text-slate-700 mb-1">Đóng khung check-in (sau đó hủy no-show)</label><input type="datetime-local" defaultValue="2027-09-01T20:00" className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
          <label className="sm:col-span-2 flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[#F26F21]" /> Gửi email mời đăng ký khi cửa sổ mở</label>
          <label className="sm:col-span-2 flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[#F26F21]" /> Giữ phòng cũ cho sinh viên đang ở khi đăng ký kỳ tiếp theo</label>
          <p className="sm:col-span-2 text-[11px] text-slate-500">Các mốc trên là đầu vào cho tác vụ tự động của hệ thống: mở/đóng cửa sổ, nhả giữ chỗ, xếp phòng, vòng 2, hủy no-show.</p>
        </div>
      </Modal>

      {toastNode}
    </div>
  );
}
