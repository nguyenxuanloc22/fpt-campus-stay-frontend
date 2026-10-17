import { useState } from 'react';
import { Check, X, FileText, ArrowLeftRight, Repeat, ShieldCheck, CheckCircle2, AlertTriangle, MessageSquare, CalendarClock, Users } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, useToast } from '@shared-ui';

/**
 * Trung tâm phê duyệt (Manager) — Use Case v2:
 * Approve / Reject Dormitory Applications · Approve / Reject Room Change Requests · Approve Periodic Maintenance Schedules.
 */

type TabKey = 'applications' | 'room-changes' | 'schedules';
type Decision = 'PENDING' | 'APPROVED' | 'REJECTED';

interface AppItem {
  code: string;
  name: string;
  studentId: string;
  roomType: string;
  flag: string;
  staffNote: string;
  staff: string;
  docs: string[];
  decision: Decision;
}

interface ChangeItem {
  id: string;
  kind: 'SWAP' | 'MOVE';
  a: { name: string; room: string };
  b?: { name: string; room: string };
  reason: string;
  verified: boolean;
  warnings: string[];
  decision: Decision;
}

interface ScheduleItem {
  id: string;
  title: string;
  scope: string;
  when: string;
  repeat: string;
  impact: string;
  proposer: string;
  decision: Decision;
}

const APPS: AppItem[] = [
  { code: 'APP-SP27-004760', name: 'Trương Gia Bảo', studentId: 'AI180990', roomType: '2 giường', flag: 'Còn nợ hóa đơn điện nước 405.000 ₫ (đang tranh chấp chỉ số công tơ)', staffNote: 'Chỉ số công tơ tháng 9 bị ghi nhầm, đã xác nhận với tổ kỹ thuật. Đề xuất chấp thuận.', staff: 'Trần Văn Cường', docs: ['bien-ban-doi-chieu-cong-to.pdf'], decision: 'PENDING' },
  { code: 'APP-SP27-004809', name: 'Đỗ Minh Quân', studentId: 'SE190455', roomType: '4 giường máy lạnh', flag: 'Hồ sơ đào tạo cập nhật sinh viên học lại — Quyết định 1123/QĐ-FPTU hợp lệ', staffNote: 'Quyết định học lại số 1123/QĐ-FPTU hợp lệ, dữ liệu đã đối soát. Đề xuất chấp thuận.', staff: 'Nguyễn Thu Hà', docs: ['quyet-dinh-hoc-lai.pdf'], decision: 'PENDING' },
  { code: 'APP-SP27-004771', name: 'Mai Khánh Vy', studentId: 'SS190234', roomType: '4 giường máy lạnh', flag: 'Yêu cầu ưu tiên tầng thấp vì lý do sức khỏe', staffNote: 'Có chỉ định của bác sĩ. Đề xuất chấp thuận và ghi chú cho engine ưu tiên tầng 1.', staff: 'Lê Minh Khoa', docs: ['chi-dinh-bac-si.pdf'], decision: 'PENDING' },
];

const CHANGES: ChangeItem[] = [
  { id: 'RC-2026-0231', kind: 'SWAP', a: { name: 'Nguyễn Thị Mai Anh', room: 'A204-G1' }, b: { name: 'Võ Thị Bảo Ngọc', room: 'A310-G2' }, reason: 'Muốn ở cùng phòng bạn cùng lớp để học nhóm.', verified: true, warnings: [], decision: 'PENDING' },
  { id: 'RC-2026-0229', kind: 'SWAP', a: { name: 'Đỗ Minh Quân', room: 'B210-G4' }, b: { name: 'Lý Gia Huy', room: 'B105-G1' }, reason: 'Muốn ở gần bạn cùng quê.', verified: true, warnings: ['Lý Gia Huy còn hóa đơn quá hạn 120.000 ₫'], decision: 'PENDING' },
];

const SCHEDULES: ScheduleItem[] = [
  { id: 'PM-2026-11', title: 'Bảo dưỡng máy lạnh toàn bộ Tòa C', scope: 'Tòa C · 80 phòng', when: '04/11 – 08/11/2026, 08:00 – 11:00', repeat: 'Mỗi học kỳ', impact: 'Kỹ thuật viên vào phòng, tắt máy lạnh 30 phút/phòng', proposer: 'Lê Văn Tài', decision: 'PENDING' },
  { id: 'PM-2026-12', title: 'Kiểm tra định kỳ bình nóng lạnh Tòa B', scope: 'Tòa B · 64 phòng', when: '15/11/2026, 13:30 – 17:00', repeat: 'Hằng quý', impact: 'Ngắt nước nóng 1 giờ', proposer: 'Nguyễn Thành Đạt', decision: 'PENDING' },
];

type Pending = { type: TabKey; id: string; title: string; action: 'APPROVED' | 'REJECTED' };

export function ManagerApprovalsPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('applications');
  const [apps, setApps] = useState(APPS);
  const [changes, setChanges] = useState(CHANGES);
  const [schedules, setSchedules] = useState(SCHEDULES);
  const [confirm, setConfirm] = useState<Pending | null>(null);
  const [note, setNote] = useState('');

  const pendingCount = (list: { decision: Decision }[]) => list.filter((x) => x.decision === 'PENDING').length;

  const decide = () => {
    if (!confirm) return;
    const set = <T extends { decision: Decision }>(fn: React.Dispatch<React.SetStateAction<T[]>>, key: keyof T) =>
      fn((all) => all.map((x) => (x[key] === confirm.id ? { ...x, decision: confirm.action } : x)));
    if (confirm.type === 'applications') set(setApps, 'code');
    if (confirm.type === 'room-changes') set(setChanges, 'id');
    if (confirm.type === 'schedules') set(setSchedules, 'id');
    show(`${confirm.action === 'APPROVED' ? 'Đã phê duyệt' : 'Đã từ chối'} ${confirm.id} — đã thông báo các bên liên quan`, confirm.action === 'APPROVED' ? 'success' : 'info');
    setConfirm(null);
    setNote('');
  };

  const Actions = ({ type, id, title, decision }: { type: TabKey; id: string; title: string; decision: Decision }) =>
    decision === 'PENDING' ? (
      <div className="flex gap-2 shrink-0">
        <AppButton size="sm" variant="outline" leftIcon={<X className="w-3.5 h-3.5" />} onClick={() => setConfirm({ type, id, title, action: 'REJECTED' })}>Từ chối</AppButton>
        <AppButton size="sm" leftIcon={<Check className="w-3.5 h-3.5" />} onClick={() => setConfirm({ type, id, title, action: 'APPROVED' })}>Phê duyệt</AppButton>
      </div>
    ) : (
      <StatusBadge status={decision} />
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Trung tâm phê duyệt" description="Các quyết định thuộc thẩm quyền Trưởng ban KTX — mỗi quyết định được ghi nhật ký kiểm toán" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Đơn đăng ký" value={pendingCount(apps)} icon={FileText} tone="purple" hint="Staff chuyển lên" />
        <StatCard label="Đổi phòng" value={pendingCount(changes)} icon={ArrowLeftRight} tone="blue" />
        <StatCard label="Lịch bảo trì định kỳ" value={pendingCount(schedules)} icon={CalendarClock} tone="amber" />
        <StatCard label="Thời gian xử lý TB" value="5,2 giờ" icon={ShieldCheck} tone="emerald" hint="Mục tiêu ≤ 24 giờ" />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'applications', label: 'Đơn đăng ký', count: pendingCount(apps) },
          { value: 'room-changes', label: 'Đổi phòng', count: pendingCount(changes) },
          { value: 'schedules', label: 'Lịch bảo trì định kỳ', count: pendingCount(schedules) },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'applications' && (
        <div className="space-y-3">
          {apps.map((a) => (
            <SectionCard key={a.code}>
              <div className="flex flex-col lg:flex-row gap-4">
                <Avatar name={a.name} size="md" />
                <div className="flex-1 text-xs space-y-2">
                  <div className="text-sm font-bold text-slate-800">{a.name} <span className="font-normal text-slate-400">{a.studentId} · {a.code}</span></div>
                  <div className="text-slate-500">{a.roomType}</div>
                  <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{a.flag}</div>
                  <div className="p-2.5 rounded-lg bg-slate-50 text-slate-700 flex gap-2"><MessageSquare className="w-4 h-4 shrink-0 text-slate-400" /><span><strong>{a.staff}:</strong> {a.staffNote}</span></div>
                  <div className="flex flex-wrap gap-2">
                    {a.docs.map((d) => (
                      <button key={d} type="button" onClick={() => show(`Đang mở ${d}`, 'info')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 text-[11px] text-slate-600 hover:border-[#F26F21]">
                        <FileText className="w-3 h-3 text-rose-500" />{d}
                      </button>
                    ))}
                  </div>
                </div>
                <Actions type="applications" id={a.code} title={`đơn ${a.code} của ${a.name}`} decision={a.decision} />
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === 'room-changes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {changes.map((c) => (
            <SectionCard key={c.id}>
              <div className="flex items-center justify-between mb-3">
                <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1', c.kind === 'SWAP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')}>
                  {c.kind === 'SWAP' ? <ArrowLeftRight className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}{c.kind === 'SWAP' ? 'Hoán đổi' : 'Đổi phòng'} · {c.id}
                </span>
                {c.verified && <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Staff đã xác minh</span>}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 p-2.5 rounded-lg bg-slate-50"><div className="font-semibold">{c.a.name}</div><div className="text-slate-500">{c.a.room}</div></div>
                <ArrowLeftRight className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="flex-1 p-2.5 rounded-lg bg-slate-50"><div className="font-semibold">{c.b?.name}</div><div className="text-slate-500">{c.b?.room}</div></div>
              </div>
              <p className="text-xs text-slate-600 mt-3">{c.reason}</p>
              <p className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1"><Users className="w-3.5 h-3.5" />Hai sinh viên đã đồng ý hoán đổi</p>
              {c.warnings.map((w) => <p key={w} className="text-[11px] text-amber-700 mt-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{w}</p>)}
              {c.warnings.length === 0 && <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Đủ điều kiện đổi phòng</p>}
              <div className="flex justify-end mt-4"><Actions type="room-changes" id={c.id} title={`yêu cầu ${c.id}`} decision={c.decision} /></div>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === 'schedules' && (
        <SectionCard noPadding>
          <ul className="divide-y divide-slate-100">
            {schedules.map((s) => (
              <li key={s.id} className="px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-4 text-xs">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><CalendarClock className="w-5 h-5" /></div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800">{s.title}</div>
                  <div className="text-slate-500">{s.id} · {s.scope} · {s.repeat}</div>
                  <div className="text-slate-600 mt-1">{s.when}</div>
                  <div className="text-amber-700 mt-0.5">Ảnh hưởng: {s.impact}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Đề xuất bởi {s.proposer}</div>
                </div>
                <Actions type="schedules" id={s.id} title={`lịch ${s.id}`} decision={s.decision} />
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t text-[11px] text-slate-500">Sau khi duyệt, hệ thống tự tạo yêu cầu bảo trì đúng lịch và thông báo cho sinh viên các phòng bị ảnh hưởng.</div>
        </SectionCard>
      )}

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.action === 'APPROVED' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
        subtitle={confirm?.title}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setConfirm(null)}>Hủy</AppButton>
            <AppButton variant={confirm?.action === 'APPROVED' ? 'primary' : 'danger'} disabled={confirm?.action === 'REJECTED' && note.length < 10} onClick={decide}>
              {confirm?.action === 'APPROVED' ? 'Phê duyệt' : 'Từ chối'}
            </AppButton>
          </>
        }
      >
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Ý kiến {confirm?.action === 'REJECTED' ? '(bắt buộc — gửi kèm thông báo cho sinh viên)' : '(không bắt buộc)'}
        </label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" />
      </Modal>

      {toastNode}
    </div>
  );
}
