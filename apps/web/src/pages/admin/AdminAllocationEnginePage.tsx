import { useEffect, useState } from 'react';
import { Cpu, Play, Save, Settings2, Users, Building2, Sparkles, Terminal, GripVertical, Clock, History, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, AppButton, ProgressBar, DonutChart, StatusBadge, useToast, CHART_COLORS } from '@shared-ui';

/**
 * Configure Assignment Rules & Priorities + Monitor Assignment Engine (Admin) — docs/BUSINESS_FLOWS.md F2.
 * Engine là actor System: tự chạy theo lịch kỳ học (Finalize Roommate Matching → Execute Room Assignment Algorithm
 * → Detect Assignment Conflicts → Open Round 2 & Backfill). Admin chỉ cấu hình, chạy thử và giám sát.
 */

const STRATEGIES = [
  { id: 'DATE_FIRST', name: 'Ưu tiên ngày nộp', desc: 'Đơn đóng cọc sớm được xếp trước vào loại phòng đã chọn.' },
  { id: 'GROUP_FIRST', name: 'Ưu tiên bạn cùng phòng', desc: 'Xếp các cặp/nhóm đã xác nhận trước để không bị tách.' },
  { id: 'BALANCED', name: 'Cân bằng (khuyến nghị)', desc: 'Tối ưu tổng điểm theo trọng số bên dưới, giữ nhóm, cân bằng tầng.' },
];

const CONSTRAINTS = [
  { id: 'gender', label: 'Đúng khu giới tính', hard: true, enabled: true },
  { id: 'type', label: 'Đúng loại phòng đã đóng cọc', hard: true, enabled: true },
  { id: 'capacity', label: 'Không vượt sức chứa / không gán trùng giường', hard: true, enabled: true },
  { id: 'pair', label: 'Không tách cặp bạn cùng phòng đã xác nhận', hard: false, enabled: true },
  { id: 'keep', label: 'Giữ phòng cũ cho sinh viên đang ở', hard: false, enabled: true },
  { id: 'cohort', label: 'Ghép sinh viên cùng khóa / cùng ngành', hard: false, enabled: true },
];

/** Tiêu chí ưu tiên theo Phiếu đăng ký §3.2.c */
const WEIGHTS = [
  ['date', 'Ngày nộp đơn / đóng cọc'],
  ['preference', 'Nguyện vọng loại phòng'],
  ['roommate', 'Yêu cầu bạn cùng phòng'],
  ['program', 'Ngành / năm học'],
] as const;

const LOG_LINES = [
  '[03:00:00] Khởi động engine v2.3 — chiến lược BALANCED',
  '[03:00:02] Nạp 1.284 đơn đã đóng cọc, 412 giường trống',
  '[03:00:09] Finalize Roommate Matching — 44 cặp/nhóm đã xác nhận, ghép thêm 37 theo tiêu chí',
  '[03:00:18] Giữ phòng cũ cho 121 sinh viên đang ở',
  '[03:01:31] Execute Room Assignment Algorithm — xếp cá nhân theo trọng số',
  '[03:02:05] Detect Assignment Conflicts — 6 cảnh báo (2 giường trùng, 1 cặp bị tách, 2 sai khu, 1 vượt sức chứa)',
  '[03:02:10] 18 đơn không còn giường phù hợp → chờ vòng 2',
  '[03:02:14] Hoàn tất: đề xuất BR-SP27-02 (342 phân bổ) → chờ Staff rà soát',
];

export const RUNS = [
  { id: 'BR-SP27-02', when: '25/11/2026 03:00', type: 'Vòng 1', total: 342, conflicts: 6, status: 'PENDING_APPROVAL' },
  { id: 'BR-SP27-01', when: '24/11/2026 15:12', type: 'Chạy thử', total: 298, conflicts: 14, status: 'COMPLETED' },
  { id: 'BR-FA26-04', when: '20/08/2026 03:00', type: 'Vòng 2', total: 186, conflicts: 2, status: 'APPROVED' },
  { id: 'BR-FA26-03', when: '12/08/2026 03:00', type: 'Vòng 1', total: 1012, conflicts: 9, status: 'APPROVED' },
];

export function AdminAllocationEnginePage() {
  const { show, toastNode } = useToast();
  const [strategy, setStrategy] = useState('BALANCED');
  const [constraints, setConstraints] = useState(CONSTRAINTS);
  const [weights, setWeights] = useState<Record<(typeof WEIGHTS)[number][0], number>>({ date: 40, preference: 30, roommate: 20, program: 10 });
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(LOG_LINES);

  useEffect(() => {
    if (!running) return;
    if (progress >= 100) {
      setRunning(false);
      show('Chạy thử hoàn tất — kết quả không tạo đề xuất chính thức');
      return;
    }
    const t = window.setTimeout(() => {
      const next = Math.min(100, progress + 12.5);
      setLogs(LOG_LINES.slice(0, Math.round(next / 12.5)));
      setProgress(next);
    }, 500);
    return () => window.clearTimeout(t);
  }, [running, progress, show]);

  const start = () => {
    setLogs([]);
    setProgress(0);
    setRunning(true);
  };

  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engine xếp phòng"
        description="Cấu hình luật & trọng số ưu tiên, chạy thử và giám sát các lần hệ thống tự chạy"
        badge={<span className="text-label font-bold px-2 py-0.5 rounded-full bg-surface-sunken text-ink">v2.3</span>}
        actions={
          <>
            <AppButton size="sm" variant="outline" isLoading={running} leftIcon={<Play className="w-4 h-4" />} onClick={start}>Chạy thử</AppButton>
            <AppButton size="sm" disabled={totalWeight !== 100} leftIcon={<Save className="w-4 h-4" />} onClick={() => show('Đã lưu cấu hình — áp dụng cho lần chạy kế tiếp')}>Lưu cấu hình</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Đơn đã đóng cọc" value="1.284" icon={Users} tone="navy" />
        <StatCard label="Giường khả dụng" value="412" icon={Building2} tone="emerald" hint="sau khi giữ phòng cũ" />
        <StatCard label="Xung đột lần chạy gần nhất" value="6" icon={AlertTriangle} tone="rose" hint="Staff đã xử lý 6/6" />
        <StatCard label="Lịch chạy kế tiếp" value="02/12 03:00" icon={Clock} tone="blue" hint="Vòng 2 & lấp chỗ" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title={<span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Chiến lược phân bổ</span>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {STRATEGIES.map((s) => (
                <label key={s.id} className={clsx('p-4 rounded-xl border cursor-pointer', strategy === s.id ? 'border-brand bg-orange-50/50 ring-2 ring-orange-100' : 'border-line')}>
                  <div className="flex items-center gap-2 mb-1">
                    <input type="radio" checked={strategy === s.id} onChange={() => setStrategy(s.id)} className="accent-brand-ink" />
                    <span className="text-xs font-bold text-ink">{s.name}</span>
                  </div>
                  <p className="text-label text-ink-muted leading-relaxed">{s.desc}</p>
                </label>
              ))}
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title={<span className="flex items-center gap-2"><Settings2 className="w-4 h-4" /> Ràng buộc</span>} noPadding>
              <ul className="divide-y divide-line">
                {constraints.map((c) => (
                  <li key={c.id} className="px-4 py-2.5 flex items-center gap-2 text-xs">
                    <GripVertical className="w-3.5 h-3.5 text-ink-subtle" />
                    <span className="flex-1 text-ink">{c.label}</span>
                    <span className={clsx('text-label font-bold px-1.5 py-0.5 rounded', c.hard ? 'bg-rose-50 text-rose-600' : 'bg-surface-sunken text-ink-muted')}>{c.hard ? 'Cứng' : 'Mềm'}</span>
                    <input type="checkbox" disabled={c.hard} checked={c.enabled} onChange={(e) => setConstraints(constraints.map((x) => (x.id === c.id ? { ...x, enabled: e.target.checked } : x)))} className="accent-brand-ink" />
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title={<span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Trọng số ưu tiên (%)</span>}>
              <div className="space-y-4 text-xs">
                {WEIGHTS.map(([k, l]) => (
                  <div key={k}>
                    <div className="flex justify-between mb-1"><span className="text-ink-muted">{l}</span><span className="font-bold">{weights[k]}</span></div>
                    <input type="range" min={0} max={100} step={5} value={weights[k]} onChange={(e) => setWeights({ ...weights, [k]: Number(e.target.value) })} className="w-full accent-brand-ink" />
                  </div>
                ))}
                <div className={clsx('pt-2 border-t font-semibold', totalWeight === 100 ? 'text-emerald-600' : 'text-rose-600')}>
                  Tổng: {totalWeight}% {totalWeight !== 100 && '— cần bằng 100% để lưu'}
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" /> Lịch sử chạy</span>} noPadding>
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr><th className="text-left px-5 py-2.5 font-semibold">Đề xuất</th><th className="text-left px-5 py-2.5 font-semibold">Thời gian</th><th className="text-left px-5 py-2.5 font-semibold">Loại</th><th className="text-right px-5 py-2.5 font-semibold">Phân bổ</th><th className="text-right px-5 py-2.5 font-semibold">Xung đột</th><th className="text-left px-5 py-2.5 font-semibold">Trạng thái</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {RUNS.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-2.5 font-bold text-ink">{r.id}</td>
                    <td className="px-5 py-2.5 text-ink-muted">{r.when}</td>
                    <td className="px-5 py-2.5">{r.type}</td>
                    <td className="px-5 py-2.5 text-right">{r.total.toLocaleString('vi-VN')}</td>
                    <td className={clsx('px-5 py-2.5 text-right font-semibold', r.conflicts ? 'text-amber-600' : 'text-ink-muted')}>{r.conflicts}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={r.status} customLabel={r.type === 'Chạy thử' ? 'Chạy thử' : undefined} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>


          <SectionCard
            title={<span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Nhật ký thực thi</span>}
            actions={running ? <StatusBadge status="RUNNING" /> : <StatusBadge status="SUCCESS" customLabel="Lần chạy gần nhất thành công" />}
          >
            {(running || progress > 0) && (
              <div className="mb-3">
                <div className="flex justify-between text-label text-ink-muted mb-1"><span>Tiến độ</span><span>{progress}%</span></div>
                <ProgressBar value={progress} tone="orange" size="md" />
              </div>
            )}
            <div className="bg-ink text-emerald-300 rounded-xl p-4 font-mono text-label leading-relaxed h-56 overflow-y-auto">
              {logs.map((l) => <div key={l}>{l}</div>)}
              {running && <div className="animate-pulse">▋</div>}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Kết quả lần chạy gần nhất" subtitle="BR-SP27-02 • 17/10/2026 03:00">
            <DonutChart
              size={130}
              centerValue="342"
              centerLabel="phân bổ"
              segments={[
                { label: 'Khớp NV 1', value: 243, color: CHART_COLORS.green },
                { label: 'Khớp NV 2–3', value: 68, color: CHART_COLORS.blue },
                { label: 'Ngoài NV', value: 25, color: CHART_COLORS.amber },
                { label: 'Cảnh báo', value: 6, color: CHART_COLORS.red },
              ]}
            />
          </SectionCard>
          <SectionCard title="So sánh chiến lược (chạy thử)">
            <table className="w-full text-xs">
              <thead className="text-ink-muted border-b"><tr><th className="text-left py-2 font-semibold">Chiến lược</th><th className="text-right py-2 font-semibold">Khớp NV</th><th className="text-right py-2 font-semibold">Giữ nhóm</th></tr></thead>
              <tbody className="divide-y divide-line">
                <tr><td className="py-2">Ưu tiên ngày nộp</td><td className="py-2 text-right">88.2%</td><td className="py-2 text-right">72%</td></tr>
                <tr><td className="py-2">Ưu tiên bạn cùng phòng</td><td className="py-2 text-right">84.6%</td><td className="py-2 text-right">98%</td></tr>
                <tr className="font-bold text-ink"><td className="py-2">Cân bằng</td><td className="py-2 text-right">90.9%</td><td className="py-2 text-right">93%</td></tr>
              </tbody>
            </table>
          </SectionCard>
        </div>
      </div>

      {toastNode}
    </div>
  );
}
