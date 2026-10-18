import { useState } from 'react';
import { CheckSquare, Check, X, Cpu, User, Search, Download, AlertTriangle, CheckCircle2, Clock, Layers, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, StatusBadge, AppButton, ProgressBar, DonutChart, Modal, useToast, CHART_COLORS } from '@shared-ui';
import type { AssignmentProposalStatus } from '@campusstay/constants';

/**
 * Review / Approve Room Assignment Proposals (Manager) — docs/BUSINESS_FLOWS.md F2.
 * Đề xuất do engine (actor System) sinh ra, đã được Staff rà soát & điều chỉnh xung đột.
 * Duyệt → tạo hợp đồng & thông báo sinh viên; từ chối → trả về Staff điều chỉnh.
 */

type BatchStatus = AssignmentProposalStatus;

interface Allocation {
  studentId: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  score: number;
  wish: string;
  room: string;
  matchedWish: boolean;
  flag?: string;
}

interface Batch {
  code: string;
  source: 'ENGINE' | 'MANUAL';
  title: string;
  createdBy: string;
  created: string;
  total: number;
  matched: number;
  flagged: number;
  status: BatchStatus;
  allocations: Allocation[];
}

const NAMES = ['Nguyễn Hoàng Long', 'Lê Thị Hồng Nhung', 'Võ Thị Bảo Ngọc', 'Hồ Tấn Phát', 'Đặng Minh Thư', 'Huỳnh Gia Hân', 'Ngô Phương Uyên', 'Bùi Thanh Tâm', 'Châu Ngọc Trâm', 'Lý Gia Huy'];

function sampleAllocations(seed: number): Allocation[] {
  return NAMES.map((name, i) => {
    const female = ['Thị', 'Hân', 'Uyên', 'Trâm', 'Thư'].some((k) => name.includes(k));
    const b = female ? (i % 2 ? 'A' : 'C') : i % 2 ? 'B' : 'D';
    const matched = (i + seed) % 4 !== 0;
    return {
      studentId: `SE19${String(1000 + i * 37 + seed).slice(-4)}`,
      name,
      gender: female ? 'Nữ' : 'Nam',
      score: 90 - i * 4,
      wish: `Tòa ${b}`,
      room: `${matched ? b : female ? (b === 'A' ? 'C' : 'A') : b === 'B' ? 'D' : 'B'}${(i % 4) + 1}0${(i % 6) + 1}-G${(i % 4) + 1}`,
      matchedWish: matched,
      flag: i === 3 + (seed % 2) ? 'Trùng nhóm GRP khác phòng' : undefined,
    };
  });
}

const BATCHES: Batch[] = [
  { code: 'BR-SP27-02', source: 'ENGINE', title: 'Đề xuất xếp phòng vòng 1 — Spring 2027', createdBy: 'Engine v2.3 · Staff Trần Văn Cường đã rà soát', created: '17/10/2026 03:00', total: 342, matched: 311, flagged: 6, status: 'PENDING_APPROVAL', allocations: sampleAllocations(1) },
  { code: 'MA-SP27-07', source: 'MANUAL', title: 'Vòng 2 — lấp chỗ trống từ no-show & hủy đơn', createdBy: 'Engine v2.3 · Staff Nguyễn Thu Hà đã rà soát', created: '16/10/2026 16:45', total: 7, matched: 6, flagged: 0, status: 'PENDING_APPROVAL', allocations: sampleAllocations(2).slice(0, 7) },
  { code: 'BR-SP27-01', source: 'ENGINE', title: 'Đề xuất vòng 1 (bản trước) — trả về Staff điều chỉnh', createdBy: 'Allocation Engine v2.3', created: '12/10/2026 03:00', total: 298, matched: 262, flagged: 14, status: 'REJECTED', allocations: sampleAllocations(3) },
  { code: 'BR-FA26-04', source: 'ENGINE', title: 'Đề xuất xếp phòng vòng 2 — Fall 2026', createdBy: 'Allocation Engine v2.2', created: '20/08/2026 03:00', total: 186, matched: 171, flagged: 2, status: 'APPROVED', allocations: sampleAllocations(4) },
];

export function ManagerAssignmentApprovalPage() {
  const { show, toastNode } = useToast();
  const [batches, setBatches] = useState(BATCHES);
  const [openCode, setOpenCode] = useState<string>(BATCHES[0]!.code);
  const [query, setQuery] = useState('');
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<{ batch: Batch; action: BatchStatus } | null>(null);

  const open = batches.find((b) => b.code === openCode) ?? batches[0]!;
  const rows = open.allocations.filter((a) => (!onlyFlagged || a.flag || !a.matchedWish) && (!query || `${a.name} ${a.studentId} ${a.room}`.toLowerCase().includes(query.toLowerCase())));

  const decide = () => {
    if (!confirm) return;
    setBatches((all) => all.map((b) => (b.code === confirm.batch.code ? { ...b, status: confirm.action } : b)));
    show(
      confirm.action === 'APPROVED'
        ? `Đã phê duyệt ${confirm.batch.code} (${confirm.batch.total - excluded.length} phân bổ). Hợp đồng sẽ được phát hành tự động.`
        : `Đã trả ${confirm.batch.code} về Staff để điều chỉnh`,
      confirm.action === 'APPROVED' ? 'success' : 'info'
    );
    setExcluded([]);
    setConfirm(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duyệt xếp phòng"
        description="Phê duyệt đề xuất xếp phòng đã được Staff rà soát trước khi phát hành hợp đồng"
        actions={<AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(`Đã xuất ${open.code}.xlsx`)}>Xuất đề xuất</AppButton>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Đề xuất chờ duyệt" value={batches.filter((b) => b.status === 'PENDING_APPROVAL').length} icon={Clock} tone="amber" />
        <StatCard label="Phân bổ chờ duyệt" value={batches.filter((b) => b.status === 'PENDING_APPROVAL').reduce((s, b) => s + b.total, 0)} icon={Layers} tone="blue" />
        <StatCard label="Khớp nguyện vọng" value="90.9%" icon={CheckCircle2} tone="emerald" hint="Batch BR-SP27-02" />
        <StatCard label="Cần chú ý" value={open.flagged} icon={AlertTriangle} tone="rose" hint="Cảnh báo xung đột" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-3">
          {batches.map((b) => (
            <button
              key={b.code}
              type="button"
              onClick={() => { setOpenCode(b.code); setExcluded([]); }}
              className={clsx('w-full text-left p-4 rounded-2xl border bg-white transition', openCode === b.code ? 'border-brand ring-2 ring-orange-100' : 'border-line hover:border-line-strong')}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={clsx('flex items-center gap-1.5 text-label font-bold px-2 py-0.5 rounded-full', b.source === 'ENGINE' ? 'bg-surface-sunken text-ink' : 'bg-purple-50 text-purple-700')}>
                  {b.source === 'ENGINE' ? <Cpu className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {b.source === 'ENGINE' ? 'VÒNG 1' : 'VÒNG 2'}
                </span>
                <StatusBadge status={b.status} customLabel={b.status === 'PENDING_APPROVAL' ? 'Chờ duyệt' : undefined} />
              </div>
              <div className="text-xs font-bold text-ink">{b.title}</div>
              <div className="text-label text-ink-muted mt-0.5">{b.code} • {b.createdBy} • {b.created}</div>
              <div className="mt-3">
                <div className="flex justify-between text-label text-ink-muted mb-1">
                  <span>{b.matched}/{b.total} khớp NV</span>
                  <span>{b.flagged} cảnh báo</span>
                </div>
                <ProgressBar value={b.matched} max={b.total} tone="emerald" />
              </div>
            </button>
          ))}
        </div>

        <div className="xl:col-span-2 space-y-6">
          <SectionCard
            title={open.title}
            subtitle={`${open.code} • ${open.total} phân bổ • tạo lúc ${open.created}`}
            actions={
              open.status === 'PENDING_APPROVAL' && (
                <>
                  <AppButton size="sm" variant="danger" leftIcon={<X className="w-3.5 h-3.5" />} onClick={() => setConfirm({ batch: open, action: 'REJECTED' })}>Trả về Staff</AppButton>
                  <AppButton size="sm" leftIcon={<Check className="w-3.5 h-3.5" />} onClick={() => setConfirm({ batch: open, action: 'APPROVED' })}>Phê duyệt</AppButton>
                </>
              )
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DonutChart
                size={120}
                centerValue={`${Math.round((open.matched / open.total) * 100)}%`}
                centerLabel="khớp NV"
                segments={[
                  { label: 'Khớp NV 1', value: Math.round(open.matched * 0.78), color: CHART_COLORS.green },
                  { label: 'Khớp NV 2–3', value: open.matched - Math.round(open.matched * 0.78), color: CHART_COLORS.blue },
                  { label: 'Không khớp', value: open.total - open.matched - open.flagged, color: CHART_COLORS.amber },
                  { label: 'Cảnh báo', value: open.flagged, color: CHART_COLORS.red },
                ]}
              />
              <div className="space-y-2 text-xs">
                {[
                  ['Tham số engine', 'Ưu tiên điểm → nhóm → nguyện vọng'],
                  ['Ràng buộc giới tính', 'Đạt 100%'],
                  ['Nhóm ở chung được giữ', '41/44 nhóm'],
                  ['Giường còn trống sau batch', '84 giường'],
                  ['Thời gian chạy', '2 phút 14 giây'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2 rounded-lg bg-surface-muted">
                    <span className="text-ink-muted">{k}</span>
                    <span className="font-semibold text-ink">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard noPadding>
            <div className="p-4 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="text-xs font-bold text-ink flex items-center gap-1.5"><CheckSquare className="w-4 h-4" /> Chi tiết phân bổ (mẫu {open.allocations.length} dòng)</div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <input type="checkbox" checked={onlyFlagged} onChange={(e) => setOnlyFlagged(e.target.checked)} className="accent-brand-ink" /> Chỉ dòng cần chú ý
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-ink-subtle absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm..." className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-line w-40" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-surface-muted text-ink-muted">
                  <tr>
                    <th className="text-left font-semibold px-4 py-2.5">Sinh viên</th>
                    <th className="text-left font-semibold px-4 py-2.5">Điểm</th>
                    <th className="text-left font-semibold px-4 py-2.5">NV</th>
                    <th className="text-left font-semibold px-4 py-2.5">Phòng xếp</th>
                    <th className="text-left font-semibold px-4 py-2.5">Ghi chú</th>
                    {open.status === 'PENDING_APPROVAL' && <th className="px-4 py-2.5 text-right">Cần sửa</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((a) => (
                    <tr key={a.studentId} className={clsx(excluded.includes(a.studentId) && 'opacity-40 line-through')}>
                      <td className="px-4 py-2.5"><div className="font-semibold text-ink">{a.name}</div><div className="text-label text-ink-subtle">{a.studentId} • {a.gender}</div></td>
                      <td className="px-4 py-2.5 font-bold text-ink">{a.score}</td>
                      <td className="px-4 py-2.5">{a.wish}</td>
                      <td className="px-4 py-2.5 font-bold">{a.room}</td>
                      <td className="px-4 py-2.5">
                        {a.flag ? (
                          <span className="text-rose-600 font-semibold flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{a.flag}</span>
                        ) : a.matchedWish ? (
                          <span className="text-emerald-600 font-semibold">Khớp NV</span>
                        ) : (
                          <span className="text-amber-600 font-semibold">Ngoài NV</span>
                        )}
                      </td>
                      {open.status === 'PENDING_APPROVAL' && (
                        <td className="px-4 py-2.5 text-right">
                          <input type="checkbox" checked={excluded.includes(a.studentId)} onChange={() => setExcluded((all) => (all.includes(a.studentId) ? all.filter((x) => x !== a.studentId) : [...all, a.studentId]))} className="accent-rose-600" />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t text-label text-ink-muted flex items-center gap-1">
              <ChevronDown className="w-3.5 h-3.5" /> Hiển thị mẫu. Xuất batch để xem toàn bộ {open.total} dòng. {excluded.length > 0 && <strong className="text-rose-600 ml-1">{excluded.length} dòng được đánh dấu để Staff điều chỉnh lại.</strong>}
            </div>
          </SectionCard>
        </div>
      </div>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        size="sm"
        title={confirm?.action === 'APPROVED' ? 'Xác nhận phê duyệt đề xuất' : 'Trả đề xuất về Staff'}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setConfirm(null)}>Hủy</AppButton>
            <AppButton variant={confirm?.action === 'APPROVED' ? 'primary' : 'danger'} onClick={decide}>Xác nhận</AppButton>
          </>
        }
      >
        {confirm && (
          <div className="text-xs text-ink space-y-2">
            <p>Batch <strong>{confirm.batch.code}</strong> — {confirm.batch.title}</p>
            {confirm.action === 'APPROVED' ? (
              <p>Hệ thống sẽ phát hành <strong>{confirm.batch.total - excluded.length}</strong> hợp đồng điện tử và gửi email cho sinh viên. Thao tác này không thể hoàn tác.</p>
            ) : (
              <p>Đề xuất được trả về Staff để rà soát &amp; điều chỉnh, sau đó gửi lại cho bạn.</p>
            )}
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
