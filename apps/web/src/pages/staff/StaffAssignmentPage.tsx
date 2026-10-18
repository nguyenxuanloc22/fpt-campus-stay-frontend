import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Send, Cpu, Search, Users, BedDouble, Undo2, MessageSquare, Clock } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Modal, useToast } from '@shared-ui';
import type { AssignmentProposalStatus } from '@campusstay/constants';

/**
 * Review / Adjust Room Assignment Proposal (Staff) — docs/BUSINESS_FLOWS.md F2.
 * Engine (actor System) đã chạy: chốt ghép bạn cùng phòng → xếp phòng → phát hiện xung đột.
 * Staff xử lý từng dòng có cảnh báo rồi gửi Manager duyệt.
 */

type Conflict = 'DOUBLE_BED' | 'SPLIT_PAIR' | 'GENDER' | 'OVER_CAPACITY';

interface Row {
  id: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  roomType: string;
  group?: string;
  bed: string;
  conflict?: Conflict;
  adjusted?: string;
}

const CONFLICT_LABEL: Record<Conflict, string> = {
  DOUBLE_BED: 'Giường bị gán 2 lần',
  SPLIT_PAIR: 'Cặp bạn cùng phòng bị tách',
  GENDER: 'Sai khu giới tính',
  OVER_CAPACITY: 'Vượt sức chứa phòng',
};

const ROWS: Row[] = [
  { id: 'SE172211', name: 'Võ Thị Bảo Ngọc', gender: 'Nữ', roomType: '4 giường máy lạnh', group: 'Cặp #A17', bed: 'C305-G1', conflict: 'SPLIT_PAIR' },
  { id: 'SE171234', name: 'Nguyễn Thị Mai Anh', gender: 'Nữ', roomType: '4 giường máy lạnh', group: 'Cặp #A17', bed: 'A204-G1' },
  { id: 'SE190455', name: 'Đỗ Minh Quân', gender: 'Nam', roomType: '4 giường máy lạnh', bed: 'B210-G4', conflict: 'DOUBLE_BED' },
  { id: 'SE190888', name: 'Nguyễn Hoàng Long', gender: 'Nam', roomType: '4 giường máy lạnh', bed: 'B210-G4' },
  { id: 'GD190087', name: 'Phan Thùy Dung', gender: 'Nữ', roomType: '4 giường quạt', bed: 'B118-G2', conflict: 'GENDER' },
  { id: 'IA171876', name: 'Đặng Minh Thư', gender: 'Nữ', roomType: '4 giường máy lạnh', bed: 'A115-G5', conflict: 'OVER_CAPACITY' },
  { id: 'SE190112', name: 'Lê Thị Hồng Nhung', gender: 'Nữ', roomType: '4 giường máy lạnh', bed: 'C305-G2' },
  { id: 'SE170321', name: 'Hồ Tấn Phát', gender: 'Nam', roomType: '4 giường máy lạnh', bed: 'D402-G1' },
  { id: 'BA173001', name: 'Huỳnh Gia Hân', gender: 'Nữ', roomType: '4 giường máy lạnh', bed: 'C210-G3' },
];

const FREE_BEDS: Record<'Nam' | 'Nữ', string[]> = {
  Nữ: ['A204-G2', 'A115-G3', 'A220-G4', 'C301-G1', 'C301-G2'],
  Nam: ['B210-G3', 'B305-G1', 'D402-G3', 'D118-G2'],
};

const ROUND2 = [
  { id: 'SS190234', name: 'Mai Khánh Vy', roomType: '2 giường', reason: 'Hết loại phòng 2 giường', accepted: true },
  { id: 'BA190012', name: 'Lý Thanh Trúc', roomType: '6 giường', reason: 'Hết loại phòng 6 giường', accepted: true },
  { id: 'SE191020', name: 'Phạm Quốc Huy', roomType: '2 giường', reason: 'Hết loại phòng 2 giường', accepted: false },
];

type TabKey = 'proposal' | 'round2';

export function StaffAssignmentPage() {
  const { show, toastNode } = useToast();
  const [rows, setRows] = useState(ROWS);
  const [tab, setTab] = useState<TabKey>('proposal');
  const [onlyConflicts, setOnlyConflicts] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AssignmentProposalStatus | 'DRAFT'>('DRAFT');
  const [sendOpen, setSendOpen] = useState(false);
  const [note, setNote] = useState('');

  const open = rows.filter((r) => r.conflict && !r.adjusted);
  const visible = rows.filter((r) => (!onlyConflicts || r.conflict) && (!query || `${r.name} ${r.id} ${r.bed}`.toLowerCase().includes(query.toLowerCase())));

  const adjust = (id: string, bed: string) => {
    setRows((all) => all.map((r) => (r.id === id ? { ...r, adjusted: bed } : r)));
    show(`Đã chuyển ${id} sang ${bed} — hệ thống kiểm tra lại xung đột`, 'info');
  };
  const undo = (id: string) => setRows((all) => all.map((r) => (r.id === id ? { ...r, adjusted: undefined } : r)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Xếp phòng"
        description="Rà soát & điều chỉnh đề xuất do thuật toán xếp phòng sinh ra, sau đó gửi Manager phê duyệt"
        actions={
          <AppButton size="sm" disabled={status !== 'DRAFT' || open.length > 0} leftIcon={<Send className="w-4 h-4" />} onClick={() => setSendOpen(true)}>
            Gửi Manager duyệt
          </AppButton>
        }
      />

      <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl bg-surface-sunken border border-blue-100 text-xs text-ink">
        <Cpu className="w-5 h-5 shrink-0" />
        <span className="flex-1">
          Đề xuất <strong>BR-SP27-02</strong> · Engine chạy 25/11/2026 03:00 · 342 phân bổ · 41/44 cặp bạn cùng phòng được giữ nguyên.
        </span>
        <StatusBadge status={status} customLabel={status === 'DRAFT' ? 'Chờ cán bộ rà soát' : undefined} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Phân bổ trong đề xuất" value="342" icon={BedDouble} tone="navy" />
        <StatCard label="Xung đột chưa xử lý" value={open.length} icon={AlertTriangle} tone={open.length ? 'rose' : 'emerald'} />
        <StatCard label="Đã điều chỉnh" value={rows.filter((r) => r.adjusted).length} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Chờ vòng 2" value={ROUND2.length} icon={Users} tone="purple" hint="Hệ thống tự lấp chỗ trống" />
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'proposal', label: 'Đề xuất BR-SP27-02', count: open.length },
          { value: 'round2', label: 'Vòng 2 & lấp chỗ', count: ROUND2.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'proposal' && (
        <SectionCard noPadding>
          <div className="p-4 border-b border-line flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <label className="flex items-center gap-2 text-xs text-ink-muted">
              <input type="checkbox" checked={onlyConflicts} onChange={(e) => setOnlyConflicts(e.target.checked)} className="accent-brand-ink" />
              Chỉ hiện dòng có cảnh báo
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tên, MSSV, giường…" className="pl-9 pr-3 py-2 text-xs rounded-lg border border-line w-full md:w-56" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Sinh viên</th>
                  <th className="text-left font-semibold px-4 py-3">Loại phòng</th>
                  <th className="text-left font-semibold px-4 py-3">Nhóm</th>
                  <th className="text-left font-semibold px-4 py-3">Giường đề xuất</th>
                  <th className="text-left font-semibold px-4 py-3">Cảnh báo</th>
                  <th className="text-left font-semibold px-4 py-3">Điều chỉnh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((r) => (
                  <tr key={r.id} className={clsx(r.conflict && !r.adjusted && 'bg-rose-50/40')}>
                    <td className="px-4 py-3"><div className="font-semibold text-ink">{r.name}</div><div className="text-label text-ink-subtle">{r.id} · {r.gender}</div></td>
                    <td className="px-4 py-3">{r.roomType}</td>
                    <td className="px-4 py-3">{r.group ?? '—'}</td>
                    <td className="px-4 py-3 font-bold">{r.adjusted ? <><span className="line-through text-ink-subtle mr-1">{r.bed}</span><span className="text-emerald-700">{r.adjusted}</span></> : r.bed}</td>
                    <td className="px-4 py-3">
                      {r.conflict ? (
                        <span className={clsx('inline-flex items-center gap-1 font-semibold', r.adjusted ? 'text-emerald-600' : 'text-rose-600')}>
                          {r.adjusted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          {r.adjusted ? 'Đã xử lý' : CONFLICT_LABEL[r.conflict]}
                        </span>
                      ) : (
                        <span className="text-ink-subtle">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.adjusted ? (
                        <button type="button" onClick={() => undo(r.id)} className="text-ink-muted hover:text-rose-600 inline-flex items-center gap-1"><Undo2 className="w-3.5 h-3.5" />Hoàn tác</button>
                      ) : (
                        <select
                          disabled={status !== 'DRAFT'}
                          defaultValue=""
                          onChange={(e) => e.target.value && adjust(r.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-line rounded-md bg-white"
                        >
                          <option value="">Chuyển sang giường…</option>
                          {FREE_BEDS[r.gender].map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t text-label text-ink-muted">
            Hiển thị {visible.length} dòng mẫu. Dòng không có cảnh báo được giữ nguyên theo kết quả thuật toán.
          </div>
        </SectionCard>
      )}

      {tab === 'round2' && (
        <SectionCard title="Sinh viên chờ vòng 2" subtitle="Hệ thống mở vòng 2 ngày 02/12 và lấp các giường trống từ no-show / hủy đơn" noPadding>
          <ul className="divide-y divide-line">
            {ROUND2.map((s) => (
              <li key={s.id} className="px-5 py-3 flex items-center gap-3 text-xs">
                <div className="flex-1">
                  <div className="font-semibold text-ink">{s.name} <span className="text-ink-subtle font-normal">{s.id}</span></div>
                  <div className="text-ink-muted">{s.roomType} · {s.reason}</div>
                </div>
                {s.accepted ? <StatusBadge status="WAITING_NEXT_ROUND" customLabel="Đồng ý vòng 2" /> : <StatusBadge status="PENDING" customLabel="Chưa phản hồi" />}
              </li>
            ))}
          </ul>
          <div className="px-5 py-3 border-t text-label text-ink-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Sinh viên không đồng ý vòng 2 sẽ được hủy đơn và hoàn cọc.</div>
        </SectionCard>
      )}

      <Modal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        title="Gửi đề xuất BR-SP27-02 cho Manager"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setSendOpen(false)}>Hủy</AppButton>
            <AppButton onClick={() => { setStatus('PENDING_APPROVAL'); setSendOpen(false); show('Đã gửi đề xuất — chờ Manager phê duyệt'); }}>Gửi duyệt</AppButton>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-ink-muted">{rows.filter((r) => r.adjusted).length} phân bổ đã được điều chỉnh thủ công; 0 xung đột còn lại.</p>
          <label className="font-semibold text-ink flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" />Ghi chú cho Manager</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 border border-line rounded-lg" placeholder="VD: Đã chuyển 2 sinh viên sang khu đúng giới tính…" />
        </div>
      </Modal>

      {toastNode}
    </div>
  );
}
