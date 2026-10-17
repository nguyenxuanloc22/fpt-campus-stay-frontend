import { useState } from 'react';
import { Save, Plus, Trash2, ShieldCheck, RotateCcw, FlaskConical, History, Info } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, AppButton, StatusBadge, useToast } from '@shared-ui';

/**
 * Configure Eligibility Rules (Admin) — Phiếu đăng ký §3.2.c: năm học, ngành, khoảng cách, tình trạng học tập.
 * Hệ thống áp dụng khi sinh viên nộp đơn (include Validate Eligibility) và khi gửi email mời đăng ký.
 * Luật ưu tiên xếp phòng nằm ở trang Engine xếp phòng.
 */

interface Rule {
  id: string;
  name: string;
  field: string;
  operator: string;
  value: string;
  blocking: boolean;
  enabled: boolean;
}

const FIELDS = [
  { id: 'sis.enrollmentStatus', label: 'Tình trạng học tập (SIS)' },
  { id: 'sis.yearOfStudy', label: 'Năm học' },
  { id: 'sis.program', label: 'Ngành / chương trình' },
  { id: 'sis.homeDistanceKm', label: 'Khoảng cách nhà – trường (km)' },
  { id: 'dorm.overdueDebt', label: 'Công nợ KTX quá hạn (₫)' },
  { id: 'dorm.activeApplication', label: 'Đã có đơn hiệu lực trong kỳ' },
];

const INITIAL: Rule[] = [
  { id: 'r1', name: 'Đang học chính quy', field: 'sis.enrollmentStatus', operator: '=', value: 'ACTIVE', blocking: true, enabled: true },
  { id: 'r2', name: 'Không còn công nợ KTX quá hạn', field: 'dorm.overdueDebt', operator: '=', value: '0', blocking: true, enabled: true },
  { id: 'r3', name: 'Mỗi kỳ chỉ một đơn hiệu lực', field: 'dorm.activeApplication', operator: '=', value: 'false', blocking: true, enabled: true },
  { id: 'r4', name: 'Sinh viên từ năm 1 đến năm 4', field: 'sis.yearOfStudy', operator: '<=', value: '4', blocking: true, enabled: true },
  { id: 'r5', name: 'Ưu tiên nhà cách trường trên 30 km', field: 'sis.homeDistanceKm', operator: '>', value: '30', blocking: false, enabled: true },
  { id: 'r6', name: 'Chỉ chương trình đại học', field: 'sis.program', operator: '!=', value: 'SHORT_COURSE', blocking: true, enabled: false },
];

const VERSIONS = [
  { v: 'v12', by: 'Quản trị viên', when: '10/10/2026', note: 'Áp dụng luật khoảng cách > 30 km cho Spring 2027' },
  { v: 'v11', by: 'Quản trị viên', when: '25/07/2026', note: 'Bổ sung luật một đơn hiệu lực mỗi kỳ' },
  { v: 'v10', by: 'Quản trị viên', when: '02/04/2026', note: 'Thêm luật công nợ KTX quá hạn' },
];

export function AdminRulesPage() {
  const { show, toastNode } = useToast();
  const [rules, setRules] = useState(INITIAL);
  const [dirty, setDirty] = useState(false);
  const [testId, setTestId] = useState('SE171234');
  const [result, setResult] = useState<null | { ok: boolean; failed: string[]; soft: string[] }>(null);

  const update = (id: string, patch: Partial<Rule>) => {
    setRules((all) => all.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    setDirty(true);
  };

  const runTest = () => {
    const failed = testId.startsWith('AI') ? ['Không còn công nợ KTX quá hạn'] : [];
    setResult({ ok: failed.length === 0, failed, soft: ['Ưu tiên nhà cách trường trên 30 km — thỏa (52 km)'] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Luật điều kiện"
        description="Điều kiện để sinh viên được mời và được nộp đơn đăng ký KTX — dữ liệu lấy từ FPT SIS"
        badge={<span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EBF2FB] text-[#1A365D]">Phiên bản v12</span>}
        actions={
          <>
            <AppButton size="sm" variant="outline" leftIcon={<RotateCcw className="w-4 h-4" />} disabled={!dirty} onClick={() => { setRules(INITIAL); setDirty(false); }}>Hoàn tác</AppButton>
            <AppButton size="sm" leftIcon={<Save className="w-4 h-4" />} disabled={!dirty} onClick={() => { setDirty(false); show('Đã xuất bản bộ luật v13 — áp dụng cho đơn nộp từ bây giờ'); }}>Lưu & xuất bản</AppButton>
          </>
        }
      />

      {dirty && <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">Có thay đổi chưa lưu. Bộ luật mới không áp dụng ngược cho đơn đã nộp.</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <SectionCard
          className="xl:col-span-2"
          title={<span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" />Danh sách luật</span>}
          subtitle="Luật “chặn” không thỏa → không được nộp đơn. Luật “mềm” chỉ được ghi nhận để engine xếp phòng ưu tiên."
          actions={
            <AppButton size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => { setRules([...rules, { id: `r${Date.now()}`, name: 'Luật mới', field: FIELDS[0]!.id, operator: '=', value: '', blocking: false, enabled: true }]); setDirty(true); }}>
              Thêm luật
            </AppButton>
          }
          noPadding
        >
          <ul className="divide-y divide-slate-100">
            {rules.map((r) => (
              <li key={r.id} className={clsx('px-4 py-3 flex flex-col lg:flex-row lg:items-center gap-2', !r.enabled && 'opacity-50')}>
                <input value={r.name} onChange={(e) => update(r.id, { name: e.target.value })} className="flex-1 px-2.5 py-1.5 text-xs font-semibold border border-transparent hover:border-slate-200 rounded-lg" />
                <select value={r.field} onChange={(e) => update(r.id, { field: e.target.value })} className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white">
                  {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
                <select value={r.operator} onChange={(e) => update(r.id, { operator: e.target.value })} className="px-1.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white">
                  {['=', '!=', '>=', '<=', '>', '<'].map((o) => <option key={o}>{o}</option>)}
                </select>
                <input value={r.value} onChange={(e) => update(r.id, { value: e.target.value })} className="w-28 px-2 py-1.5 text-xs border border-slate-200 rounded-lg" />
                <label className="flex items-center gap-1 text-[11px] font-semibold text-rose-700"><input type="checkbox" checked={r.blocking} onChange={(e) => update(r.id, { blocking: e.target.checked })} className="accent-rose-600" />Chặn</label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600"><input type="checkbox" checked={r.enabled} onChange={(e) => update(r.id, { enabled: e.target.checked })} className="accent-[#F26F21]" />Bật</label>
                <button type="button" onClick={() => { setRules(rules.filter((x) => x.id !== r.id)); setDirty(true); }} className="text-slate-400 hover:text-rose-600" aria-label="Xóa luật"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title={<span className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-purple-600" />Kiểm tra thử</span>}>
            <p className="text-[11px] text-slate-500 mb-3">Áp dụng bộ luật hiện tại lên dữ liệu SIS của một sinh viên.</p>
            <div className="flex gap-2">
              <input value={testId} onChange={(e) => setTestId(e.target.value.toUpperCase())} className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg" />
              <AppButton size="sm" onClick={runTest}>Chạy</AppButton>
            </div>
            {result && (
              <div className={clsx('mt-3 p-3 rounded-lg text-xs space-y-1', result.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800')}>
                <div className="font-bold">{result.ok ? '✓ Đủ điều kiện đăng ký' : '✗ Không đủ điều kiện'}</div>
                {result.failed.map((f) => <div key={f}>Không thỏa: {f}</div>)}
                {result.soft.map((s) => <div key={s} className="text-slate-600">{s}</div>)}
              </div>
            )}
          </SectionCard>

          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" />Phiên bản</span>} noPadding>
            <ul className="divide-y divide-slate-100">
              {VERSIONS.map((v, i) => (
                <li key={v.v} className="px-5 py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{v.v}</span>
                    {i === 0 ? <StatusBadge status="ACTIVE" customLabel="Hiện hành" /> : <button type="button" onClick={() => show(`Đã khôi phục ${v.v} vào bản nháp`, 'info')} className="text-[11px] font-semibold text-[#F26F21]">Khôi phục</button>}
                  </div>
                  <div className="text-slate-600">{v.note}</div>
                  <div className="text-[11px] text-slate-400">{v.by} · {v.when}</div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <div className="p-3 rounded-xl bg-blue-50 text-[11px] text-blue-800 flex gap-2">
            <Info className="w-4 h-4 shrink-0" /> Trọng số ưu tiên khi xếp phòng (ngày nộp, nguyện vọng, bạn cùng phòng, ngành/năm) cấu hình tại trang Engine xếp phòng.
          </div>
        </div>
      </div>

      {toastNode}
    </div>
  );
}
