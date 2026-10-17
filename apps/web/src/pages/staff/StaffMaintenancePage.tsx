import { useState } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Search,
  MapPin,
  Camera,
  CalendarClock,
  ClipboardCheck,
  Plus,
  User,
  Repeat,
  XCircle,
} from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, useToast } from '@shared-ui';
import type { MaintenanceStatus } from '@campusstay/constants';

/**
 * Bảo trì & kiểm tra phòng (Staff) — docs/BUSINESS_FLOWS.md F5.
 * Handle Maintenance Requests · Schedule Room Inspections · Inspect Room / Equipment · Record Maintenance Follow-ups.
 * Trạng thái theo State Diagram yêu cầu sửa chữa.
 */

type TabKey = 'tickets' | 'inspections' | 'schedules';

interface Ticket {
  id: string;
  title: string;
  room: string;
  source: 'STUDENT' | 'PERIODIC';
  reporter: string;
  created: string;
  status: MaintenanceStatus;
  technician?: string;
  scheduledAt?: string;
  photos: number;
  log: string[];
}

const TECHNICIANS = ['Lê Văn Tài — Điện lạnh', 'Phạm Hùng — Điện', 'Nguyễn Thành Đạt — Nước', 'Vũ Quốc Bảo — Mạng'];

const TICKETS: Ticket[] = [
  { id: 'TK-10501', title: 'Rò rỉ nước trần WC', room: 'B108', source: 'STUDENT', reporter: 'Đỗ Minh Quân', created: '17/10 06:40', status: 'SENT', photos: 3, log: ['Sinh viên gửi yêu cầu'] },
  { id: 'TK-10499', title: 'Mất điện toàn tầng 3', room: 'Tòa D — tầng 3', source: 'STUDENT', reporter: 'Bảo vệ ca đêm', created: '17/10 05:15', status: 'PENDING', photos: 1, log: ['Tạo yêu cầu', 'Đã tiếp nhận'] },
  { id: 'TK-10490', title: 'Bảo dưỡng máy lạnh tầng 2 Tòa A', room: 'Tòa A — tầng 2', source: 'PERIODIC', reporter: 'Hệ thống (lịch định kỳ)', created: '16/10 00:00', status: 'APPROVED', photos: 0, log: ['Tạo tự động theo lịch đã duyệt', 'Đã duyệt'] },
  { id: 'TK-10482', title: 'Máy lạnh chảy nước, không mát', room: 'A204', source: 'STUDENT', reporter: 'Nguyễn Thị Mai Anh', created: '15/10 21:10', status: 'SCHEDULED', technician: TECHNICIANS[0], scheduledAt: '18/10 09:00', photos: 2, log: ['Sinh viên gửi yêu cầu', 'Phân loại: điện lạnh', 'Đã duyệt', 'Lên lịch kiểm tra 18/10 09:00'] },
  { id: 'TK-10478', title: 'Wi-Fi chập chờn buổi tối', room: 'C305', source: 'STUDENT', reporter: 'Lê Thị Hồng Nhung', created: '16/10 22:05', status: 'PROCESSING', photos: 0, log: ['Sinh viên gửi yêu cầu', 'Đang phân loại'] },
  { id: 'TK-10466', title: 'Bình nóng lạnh không nóng', room: 'D402', source: 'STUDENT', reporter: 'Trương Gia Bảo', created: '16/10 07:20', status: 'IN_PROGRESS', technician: TECHNICIANS[2], scheduledAt: '17/10 08:00', photos: 1, log: ['Sinh viên gửi yêu cầu', 'Đã duyệt', 'KTV bắt đầu sửa'] },
  { id: 'TK-10377', title: 'Bóng đèn nhà tắm bị cháy', room: 'A204', source: 'STUDENT', reporter: 'Nguyễn Thị Mai Anh', created: '08/10 19:02', status: 'RESOLVED', technician: TECHNICIANS[1], photos: 1, log: ['Đã thay bóng LED — chờ sinh viên xác nhận'] },
  { id: 'TK-10290', title: 'Ổ cắm bàn học lỏng', room: 'A204', source: 'STUDENT', reporter: 'Nguyễn Thị Mai Anh', created: '01/10 20:15', status: 'CLOSED', technician: TECHNICIANS[1], photos: 0, log: ['Sinh viên xác nhận hoàn tất'] },
];

const COLUMNS: { label: string; statuses: MaintenanceStatus[]; dot: string }[] = [
  { label: 'Mới tiếp nhận', statuses: ['SENT', 'PENDING'], dot: 'bg-amber-500' },
  { label: 'Phân loại & duyệt', statuses: ['PROCESSING', 'APPROVED'], dot: 'bg-purple-500' },
  { label: 'Đã lên lịch / đang sửa', statuses: ['SCHEDULED', 'IN_PROGRESS'], dot: 'bg-blue-500' },
  { label: 'Hoàn tất', statuses: ['RESOLVED', 'CLOSED'], dot: 'bg-emerald-500' },
];

const STATUS_LABEL: Record<MaintenanceStatus, string> = {
  SENT: 'Mới gửi', PENDING: 'Đã tiếp nhận', PROCESSING: 'Đang phân loại', APPROVED: 'Đã duyệt', SCHEDULED: 'Đã lên lịch',
  IN_PROGRESS: 'Đang sửa', RESOLVED: 'Chờ SV xác nhận', CLOSED: 'Đã đóng', CANCELLED: 'Đã hủy',
};

const EQUIPMENT = ['Máy lạnh', 'Bình nóng lạnh', 'Hệ thống điện', 'Ống nước / WC', 'Cửa & khóa', 'Đèn chiếu sáng'];

const SCHEDULES = [
  { id: 'PM-2026-11', title: 'Bảo dưỡng máy lạnh toàn bộ Tòa C', when: '04/11 – 08/11/2026', status: 'PENDING_APPROVAL' },
  { id: 'PM-2026-10', title: 'Vệ sinh bồn chứa nước Tòa A', when: '19/10/2026', status: 'APPROVED' },
  { id: 'PM-2026-09', title: 'Kiểm tra hệ thống PCCC Tòa B', when: '04/11/2026', status: 'APPROVED' },
];

export function StaffMaintenancePage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('tickets');
  const [tickets, setTickets] = useState(TICKETS);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [tech, setTech] = useState(TECHNICIANS[0]!);
  const [when, setWhen] = useState('2026-10-18T09:00');
  const [followUp, setFollowUp] = useState('');
  const [inspecting, setInspecting] = useState<Ticket | null>(null);
  const [equipment, setEquipment] = useState<Record<string, boolean>>({});
  const [proposeOpen, setProposeOpen] = useState(false);

  const filtered = tickets.filter((t) => !query || `${t.id} ${t.title} ${t.room}`.toLowerCase().includes(query.toLowerCase()));
  const inspections = tickets.filter((t) => t.status === 'SCHEDULED');

  const move = (t: Ticket, status: MaintenanceStatus, logLine: string, patch: Partial<Ticket> = {}) => {
    setTickets((all) => all.map((x) => (x.id === t.id ? { ...x, ...patch, status, log: [...x.log, logLine] } : x)));
    setDetail(null);
    show(`${t.id}: ${logLine}`);
  };

  const finishInspection = () => {
    if (!inspecting) return;
    const broken = Object.entries(equipment).filter(([, bad]) => bad).map(([k]) => k);
    if (broken.length) {
      move(inspecting, 'IN_PROGRESS', `Kiểm tra: cần sửa ${broken.join(', ')} — bắt đầu sửa chữa`);
    } else {
      move(inspecting, 'RESOLVED', 'Kiểm tra: thiết bị hoạt động bình thường — ghi nhận theo dõi');
    }
    setInspecting(null);
    setEquipment({});
  };

  const actions = (t: Ticket) => {
    switch (t.status) {
      case 'SENT':
      case 'PENDING':
        return <AppButton size="sm" onClick={() => move(t, 'PROCESSING', 'Cán bộ tiếp nhận & phân loại')}>Tiếp nhận & phân loại</AppButton>;
      case 'PROCESSING':
        return (
          <div className="flex gap-2">
            <AppButton size="sm" variant="outline" leftIcon={<XCircle className="w-3.5 h-3.5" />} onClick={() => move(t, 'CANCELLED', 'Hủy: yêu cầu không hợp lệ')}>Không hợp lệ</AppButton>
            <AppButton size="sm" onClick={() => move(t, 'APPROVED', 'Yêu cầu hợp lệ — đã duyệt')}>Duyệt</AppButton>
          </div>
        );
      case 'APPROVED':
        return (
          <div className="space-y-2">
            <select value={tech} onChange={(e) => setTech(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white">
              {TECHNICIANS.map((x) => <option key={x}>{x}</option>)}
            </select>
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" />
            <AppButton size="sm" className="w-full" leftIcon={<CalendarClock className="w-3.5 h-3.5" />} onClick={() => move(t, 'SCHEDULED', `Lên lịch kiểm tra ${when.replace('T', ' ')} — ${tech}`, { technician: tech, scheduledAt: when.replace('T', ' ') })}>
              Lên lịch kiểm tra
            </AppButton>
          </div>
        );
      case 'SCHEDULED':
        return <AppButton size="sm" leftIcon={<ClipboardCheck className="w-3.5 h-3.5" />} onClick={() => { setDetail(null); setInspecting(t); }}>Kiểm tra phòng / thiết bị</AppButton>;
      case 'IN_PROGRESS':
        return (
          <div className="space-y-2">
            <textarea value={followUp} onChange={(e) => setFollowUp(e.target.value)} rows={2} placeholder="Ghi nhận kết quả sửa chữa…" className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" />
            <AppButton size="sm" className="w-full" disabled={!followUp} onClick={() => { move(t, 'RESOLVED', `Ghi nhận theo dõi: ${followUp}`); setFollowUp(''); }}>Đã sửa xong</AppButton>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bảo trì & kiểm tra phòng"
        description="Tiếp nhận yêu cầu, lên lịch kiểm tra, sửa chữa và ghi nhận theo dõi"
        actions={<AppButton size="sm" variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setProposeOpen(true)}>Đề xuất lịch định kỳ</AppButton>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Mới tiếp nhận" value={tickets.filter((t) => t.status === 'SENT' || t.status === 'PENDING').length} icon={AlertTriangle} tone="amber" />
        <StatCard label="Lịch kiểm tra sắp tới" value={inspections.length} icon={CalendarClock} tone="blue" />
        <StatCard label="Đang sửa" value={tickets.filter((t) => t.status === 'IN_PROGRESS').length} icon={Wrench} tone="purple" />
        <StatCard label="Chờ SV xác nhận" value={tickets.filter((t) => t.status === 'RESOLVED').length} icon={CheckCircle2} tone="emerald" />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'tickets', label: 'Yêu cầu sửa chữa', count: tickets.filter((t) => t.status !== 'CLOSED' && t.status !== 'CANCELLED').length },
          { value: 'inspections', label: 'Lịch kiểm tra phòng', count: inspections.length },
          { value: 'schedules', label: 'Bảo trì định kỳ', count: SCHEDULES.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'tickets' && (
        <>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm mã, tiêu đề, phòng…" className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((c) => {
              const col = filtered.filter((t) => c.statuses.includes(t.status));
              return (
                <div key={c.label} className="bg-slate-100/70 rounded-2xl p-3">
                  <div className="flex items-center justify-between px-1 mb-3">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-700"><span className={clsx('w-2 h-2 rounded-full', c.dot)} />{c.label}</span>
                    <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full">{col.length}</span>
                  </div>
                  <div className="space-y-2.5">
                    {col.map((t) => (
                      <button key={t.id} type="button" onClick={() => setDetail(t)} className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-[#F26F21] transition">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-400">{t.id}</span>
                          <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded', t.source === 'PERIODIC' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600')}>
                            {t.source === 'PERIODIC' ? 'Định kỳ' : 'SV báo'}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800">{t.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{t.room}</div>
                        <div className="mt-2"><StatusBadge status={t.status} customLabel={STATUS_LABEL[t.status]} /></div>
                      </button>
                    ))}
                    {col.length === 0 && <div className="text-center text-[11px] text-slate-400 py-6">Trống</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'inspections' && (
        <SectionCard title="Lịch kiểm tra phòng / thiết bị" noPadding>
          <ul className="divide-y divide-slate-100">
            {inspections.map((t) => (
              <li key={t.id} className="px-5 py-3.5 flex flex-col md:flex-row md:items-center gap-3 text-xs">
                <div className="w-12 h-12 rounded-xl bg-[#EBF2FB] text-[#1A365D] flex items-center justify-center shrink-0"><CalendarClock className="w-5 h-5" /></div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{t.room} — {t.title}</div>
                  <div className="text-slate-500">{t.scheduledAt} · {t.technician}</div>
                </div>
                <AppButton size="sm" leftIcon={<ClipboardCheck className="w-3.5 h-3.5" />} onClick={() => setInspecting(t)}>Kiểm tra</AppButton>
              </li>
            ))}
            {inspections.length === 0 && <li className="py-10 text-center text-xs text-slate-400">Chưa có lịch kiểm tra.</li>}
          </ul>
        </SectionCard>
      )}

      {tab === 'schedules' && (
        <SectionCard title="Lịch bảo trì định kỳ" subtitle="Manager phê duyệt; hệ thống tự tạo yêu cầu khi đến lịch" noPadding>
          <ul className="divide-y divide-slate-100">
            {SCHEDULES.map((s) => (
              <li key={s.id} className="px-5 py-3.5 flex items-center gap-3 text-xs">
                <Repeat className="w-4 h-4 text-purple-600" />
                <div className="flex-1"><div className="font-bold text-slate-800">{s.title}</div><div className="text-slate-500">{s.id} · {s.when}</div></div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <Modal open={!!detail} onClose={() => setDetail(null)} size="lg" title={detail?.title ?? ''} subtitle={detail ? `${detail.id} · ${detail.room} · ${detail.created}` : ''}>
        {detail && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-3">
              <StatusBadge status={detail.status} customLabel={STATUS_LABEL[detail.status]} />
              <div className="flex items-center gap-2"><Avatar name={detail.reporter} size="xs" />{detail.reporter}</div>
              {detail.technician && <div className="flex items-center gap-2 text-slate-600"><User className="w-3.5 h-3.5" />{detail.technician}</div>}
              {detail.photos > 0 && (
                <div className="flex gap-2">{Array.from({ length: detail.photos }).map((_, i) => <div key={i} className="w-14 h-14 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400"><Camera className="w-4 h-4" /></div>)}</div>
              )}
              <ol className="border-l border-slate-200 ml-1 space-y-2">
                {detail.log.map((l) => <li key={l} className="pl-3 text-slate-600 flex gap-1.5"><Clock className="w-3 h-3 mt-0.5 shrink-0" />{l}</li>)}
              </ol>
            </div>
            <div>
              <div className="font-bold text-slate-700 mb-2">Bước tiếp theo</div>
              {actions(detail) ?? <p className="text-slate-500">Không còn thao tác cho cán bộ.</p>}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!inspecting}
        onClose={() => setInspecting(null)}
        title={inspecting ? `Kiểm tra ${inspecting.room}` : ''}
        subtitle="Đánh dấu thiết bị cần sửa"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setInspecting(null)}>Hủy</AppButton>
            <AppButton onClick={finishInspection}>Lưu kết quả kiểm tra</AppButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          {EQUIPMENT.map((e) => (
            <label key={e} className={clsx('flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer', equipment[e] ? 'border-rose-300 bg-rose-50 text-rose-800' : 'border-slate-200')}>
              <input type="checkbox" checked={!!equipment[e]} onChange={(ev) => setEquipment({ ...equipment, [e]: ev.target.checked })} className="accent-rose-600" />
              {e} — cần sửa
            </label>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-3">Không có thiết bị cần sửa → yêu cầu chuyển “Chờ SV xác nhận”. Có → chuyển “Đang sửa”.</p>
      </Modal>

      <Modal
        open={proposeOpen}
        onClose={() => setProposeOpen(false)}
        title="Đề xuất lịch bảo trì định kỳ"
        subtitle="Gửi Manager phê duyệt"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setProposeOpen(false)}>Hủy</AppButton>
            <AppButton onClick={() => { setProposeOpen(false); show('Đã gửi đề xuất lịch bảo trì cho Manager'); }}>Gửi đề xuất</AppButton>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <input placeholder="Nội dung, VD: Bảo dưỡng máy lạnh Tòa D" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" defaultValue="2026-11-10" className="px-3 py-2 border border-slate-200 rounded-lg" />
            <select className="px-3 py-2 border border-slate-200 rounded-lg bg-white"><option>Một lần</option><option>Hằng tháng</option><option>Mỗi học kỳ</option></select>
          </div>
          <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"><option>Toàn KTX</option><option>Tòa A</option><option>Tòa B</option><option>Tòa C</option><option>Tòa D</option></select>
        </div>
      </Modal>

      {toastNode}
    </div>
  );
}
