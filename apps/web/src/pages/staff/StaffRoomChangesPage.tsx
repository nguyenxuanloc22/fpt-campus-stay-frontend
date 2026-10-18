import { useState } from 'react';
import { ArrowLeftRight, Repeat, CheckCircle2, AlertTriangle, Search, ShieldCheck, CalendarRange } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, useToast } from '@shared-ui';
import type { RoomChangeStatus } from '@campusstay/constants';

/**
 * Đổi phòng (Staff) — docs/BUSINESS_FLOWS.md F4.
 * Manager là người phê duyệt; Staff theo dõi và xác minh điều kiện (cùng giới, đang ở, không nợ)
 * để Manager có căn cứ ra quyết định.
 */

interface ChangeRequest {
  id: string;
  kind: 'SWAP' | 'MOVE';
  a: { name: string; id: string; room: string };
  b?: { name: string; id: string; room: string };
  reason: string;
  created: string;
  status: RoomChangeStatus;
  checks: { label: string; ok: boolean }[];
  verified?: boolean;
}

const baseChecks = [
  { label: 'Cùng giới tính', ok: true },
  { label: 'Cả hai đang lưu trú kỳ hiện tại', ok: true },
  { label: 'Không còn công nợ quá hạn', ok: true },
  { label: 'Trong đợt đổi phòng cho phép', ok: true },
];

const REQUESTS: ChangeRequest[] = [
  { id: 'RC-2026-0231', kind: 'SWAP', a: { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', room: 'A204-G1' }, b: { name: 'Võ Thị Bảo Ngọc', id: 'SE172211', room: 'A310-G2' }, reason: 'Muốn ở cùng phòng bạn cùng lớp để học nhóm.', created: '16/10/2026', status: 'PROCESSING', checks: baseChecks },
  { id: 'RC-2026-0229', kind: 'SWAP', a: { name: 'Đỗ Minh Quân', id: 'SE190455', room: 'B210-G4' }, b: { name: 'Lý Gia Huy', id: 'SE180777', room: 'B105-G1' }, reason: 'Muốn ở gần bạn cùng quê.', created: '15/10/2026', status: 'PROCESSING', checks: [baseChecks[0]!, baseChecks[1]!, { label: 'Không còn công nợ quá hạn', ok: false }, baseChecks[3]!] },
  { id: 'RC-2026-0227', kind: 'SWAP', a: { name: 'Đặng Minh Thư', id: 'IA171876', room: 'A115-G3' }, b: { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', room: 'A204-G1' }, reason: 'Muốn lên tầng cao cho yên tĩnh.', created: '15/10/2026', status: 'STUDENT_RESPONSE', checks: baseChecks },
  { id: 'RC-2026-0224', kind: 'MOVE', a: { name: 'Mai Khánh Vy', id: 'SS190234', room: 'C210-G4' }, reason: 'Cần tầng thấp vì lý do sức khỏe — chờ ghép người đổi.', created: '14/10/2026', status: 'PENDING', checks: baseChecks },
  { id: 'RC-2026-0214', kind: 'SWAP', a: { name: 'Bùi Thanh Tâm', id: 'BA180123', room: 'B301-G2' }, b: { name: 'Trần Quốc Bảo', id: 'BA180456', room: 'B305-G5' }, reason: 'Thống nhất đổi chỗ.', created: '10/10/2026', status: 'COMPLETED', checks: baseChecks, verified: true },
  { id: 'RC-2026-0198', kind: 'MOVE', a: { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', room: 'A204-G1' }, reason: 'Đau chân, cần tầng 1.', created: '20/09/2026', status: 'REJECTED', checks: baseChecks, verified: true },
];

const STATUS_LABEL: Partial<Record<RoomChangeStatus, string>> = {
  PENDING: 'Chờ ghép',
  STUDENT_RESPONSE: 'Chờ đối tác phản hồi',
  PROCESSING: 'Chờ Manager duyệt',
};

type TabKey = 'processing' | 'waiting' | 'closed';

export function StaffRoomChangesPage() {
  const { show, toastNode } = useToast();
  const [items, setItems] = useState(REQUESTS);
  const [tab, setTab] = useState<TabKey>('processing');
  const [query, setQuery] = useState('');

  const inTab = (r: ChangeRequest) =>
    tab === 'processing' ? r.status === 'PROCESSING' : tab === 'waiting' ? r.status === 'PENDING' || r.status === 'STUDENT_RESPONSE' : ['APPROVED', 'COMPLETED', 'REJECTED'].includes(r.status);
  const list = items.filter((r) => inTab(r) && (!query || `${r.id} ${r.a.name} ${r.a.id} ${r.b?.name ?? ''}`.toLowerCase().includes(query.toLowerCase())));

  const verify = (id: string) => {
    setItems((all) => all.map((r) => (r.id === id ? { ...r, verified: true } : r)));
    show(`Đã ghi nhận xác minh cho ${id} — Manager sẽ thấy kết quả khi duyệt`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Đổi phòng" description="Theo dõi yêu cầu đổi / hoán đổi phòng và xác minh điều kiện trước khi Manager quyết định" />

      <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-sunken border border-blue-100 text-xs text-ink">
        <CalendarRange className="w-5 h-5 shrink-0" />
        Đợt đổi phòng tuần 9 đang mở (12/10 – 25/10/2026). Yêu cầu chưa ghép được đối tác sẽ tự hủy khi hết đợt.
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Chờ Manager duyệt" value={items.filter((r) => r.status === 'PROCESSING').length} icon={ShieldCheck} tone="purple" />
        <StatCard label="Chưa xác minh" value={items.filter((r) => r.status === 'PROCESSING' && !r.verified).length} icon={AlertTriangle} tone="amber" />
        <StatCard label="Đang chờ ghép / phản hồi" value={items.filter((r) => r.status === 'PENDING' || r.status === 'STUDENT_RESPONSE').length} icon={Repeat} tone="blue" />
        <StatCard label="Hoàn tất trong đợt" value={items.filter((r) => r.status === 'COMPLETED').length} icon={CheckCircle2} tone="emerald" />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-3">
          <Tabs<TabKey>
            items={[
              { value: 'processing', label: 'Chờ Manager duyệt', count: items.filter((r) => r.status === 'PROCESSING').length },
              { value: 'waiting', label: 'Đang chờ ghép', count: items.filter((r) => r.status === 'PENDING' || r.status === 'STUDENT_RESPONSE').length },
              { value: 'closed', label: 'Đã kết thúc' },
            ]}
            value={tab}
            onChange={setTab}
          />
          <div className="relative">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mã, tên, MSSV…" className="pl-9 pr-3 py-2 text-xs rounded-lg border border-line w-full md:w-52" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {list.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-line">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={clsx('text-label font-bold px-2 py-0.5 rounded flex items-center gap-1', r.kind === 'SWAP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')}>
                  {r.kind === 'SWAP' ? <ArrowLeftRight className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}
                  {r.kind === 'SWAP' ? 'Hoán đổi' : 'Đổi phòng'} · {r.id}
                </span>
                <StatusBadge status={r.status} customLabel={STATUS_LABEL[r.status]} />
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 p-2.5 rounded-lg bg-surface-muted flex items-center gap-2"><Avatar name={r.a.name} size="xs" /><div><div className="font-semibold">{r.a.name}</div><div className="text-ink-muted">{r.a.room}</div></div></div>
                {r.b && <>
                  <ArrowLeftRight className="w-4 h-4 text-purple-500 shrink-0" />
                  <div className="flex-1 p-2.5 rounded-lg bg-surface-muted flex items-center gap-2"><Avatar name={r.b.name} size="xs" /><div><div className="font-semibold">{r.b.name}</div><div className="text-ink-muted">{r.b.room}</div></div></div>
                </>}
              </div>
              <p className="text-xs text-ink-muted mt-3">{r.reason}</p>
              <ul className="mt-3 grid grid-cols-2 gap-1 text-label">
                {r.checks.map((c) => (
                  <li key={c.label} className={clsx('flex items-center gap-1', c.ok ? 'text-ink-muted' : 'text-rose-600 font-semibold')}>
                    {c.ok ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3" />}{c.label}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-line text-label">
                <span className="text-ink-subtle">Tạo {r.created}</span>
                {r.status === 'PROCESSING' && (r.verified ? (
                  <span className="font-semibold text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Đã xác minh</span>
                ) : (
                  <AppButton size="sm" variant="outline" onClick={() => verify(r.id)}>Ghi nhận đã xác minh</AppButton>
                ))}
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="col-span-full py-10 text-center text-xs text-ink-subtle">Không có yêu cầu nào.</div>}
        </div>
      </SectionCard>

      {toastNode}
    </div>
  );
}
