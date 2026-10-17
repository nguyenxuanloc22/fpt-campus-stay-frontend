import { useState } from 'react';
import { Search, Download, Shield, LogIn, Pencil, Trash2, CheckCircle2, AlertTriangle, Eye, Filter, Globe } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, AppButton, Avatar, Modal, useToast } from '@shared-ui';

type Severity = 'INFO' | 'WARNING' | 'CRITICAL';
type Action = 'LOGIN' | 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'EXPORT';

interface Log {
  id: string;
  time: string;
  actor: string;
  role: string;
  action: Action;
  resource: string;
  detail: string;
  ip: string;
  severity: Severity;
  before?: string;
  after?: string;
}

const LOGS: Log[] = [
  { id: 'AL-552190', time: '17/10/2026 09:41:12', actor: 'Hệ thống', role: 'SYSTEM', action: 'UPDATE', resource: 'invoice/INV-2026-1009', detail: 'Gạch nợ tự động từ webhook VietQR', ip: '103.21.x.x', severity: 'INFO', before: '{ "status": "UNPAID" }', after: '{ "status": "PAID", "paidAt": "2026-10-17T09:41:12" }' },
  { id: 'AL-552188', time: '17/10/2026 08:12:40', actor: 'ThS. Hoàng Nam', role: 'MANAGER', action: 'APPROVE', resource: 'batch/BR-FA26-04', detail: 'Phê duyệt 186 phân bổ phòng', ip: '10.10.2.14', severity: 'INFO' },
  { id: 'AL-552181', time: '17/10/2026 08:01:05', actor: 'Quản trị viên Hệ thống', role: 'ADMIN', action: 'LOGIN', resource: 'auth/session', detail: 'Đăng nhập thành công (SSO + OTP)', ip: '10.10.1.2', severity: 'INFO' },
  { id: 'AL-552176', time: '17/10/2026 07:52:33', actor: 'baotgai180990@fpt.edu.vn', role: 'STUDENT', action: 'LOGIN', resource: 'auth/session', detail: 'Đăng nhập thất bại 5 lần — tài khoản bị khóa tạm thời', ip: '113.161.x.x', severity: 'WARNING' },
  { id: 'AL-552160', time: '16/10/2026 17:20:11', actor: 'Quản trị viên Hệ thống', role: 'ADMIN', action: 'UPDATE', resource: 'pricing/utility.electric', detail: 'Cập nhật đơn giá điện', ip: '10.10.1.2', severity: 'WARNING', before: '{ "price": 2800 }', after: '{ "price": 3000 }' },
  { id: 'AL-552143', time: '16/10/2026 15:05:47', actor: 'Trần Văn Cường', role: 'STAFF', action: 'UPDATE', resource: 'room/B105', detail: 'Chuyển trạng thái phòng sang LOCKED', ip: '10.10.3.21', severity: 'INFO', before: '{ "status": "AVAILABLE" }', after: '{ "status": "LOCKED" }' },
  { id: 'AL-552120', time: '16/10/2026 11:30:02', actor: 'Phạm Thị Lan', role: 'MANAGER', action: 'EXPORT', resource: 'report/finance', detail: 'Xuất báo cáo tài chính tháng 9 (Excel)', ip: '10.10.4.8', severity: 'INFO' },
  { id: 'AL-552098', time: '15/10/2026 22:47:19', actor: 'Quản trị viên Hệ thống', role: 'ADMIN', action: 'DELETE', resource: 'user/vietdq@fpt.edu.vn', detail: 'Vô hiệu hóa tài khoản nhân sự nghỉ việc', ip: '10.10.1.2', severity: 'CRITICAL' },
  { id: 'AL-552077', time: '15/10/2026 14:10:55', actor: 'Quản trị viên Hệ thống', role: 'ADMIN', action: 'CREATE', resource: 'user/khoalm@fpt.edu.vn', detail: 'Tạo tài khoản cán bộ mới, vai trò STAFF', ip: '10.10.1.2', severity: 'INFO' },
  { id: 'AL-552051', time: '15/10/2026 03:00:01', actor: 'Allocation Engine', role: 'SYSTEM', action: 'CREATE', resource: 'batch/BR-SP27-01', detail: 'Tạo batch chạy thử 298 phân bổ', ip: 'internal', severity: 'INFO' },
  { id: 'AL-552010', time: '14/10/2026 19:33:28', actor: 'Unknown', role: '—', action: 'LOGIN', resource: 'auth/admin', detail: 'Truy cập trái phép trang quản trị — bị chặn bởi WAF', ip: '45.142.x.x', severity: 'CRITICAL' },
];

const ACTION_META: Record<Action, { label: string; icon: typeof LogIn; cls: string }> = {
  LOGIN: { label: 'Đăng nhập', icon: LogIn, cls: 'bg-slate-100 text-slate-600' },
  CREATE: { label: 'Tạo mới', icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700' },
  UPDATE: { label: 'Cập nhật', icon: Pencil, cls: 'bg-blue-50 text-blue-700' },
  DELETE: { label: 'Xóa / vô hiệu', icon: Trash2, cls: 'bg-rose-50 text-rose-700' },
  APPROVE: { label: 'Phê duyệt', icon: Shield, cls: 'bg-purple-50 text-purple-700' },
  EXPORT: { label: 'Xuất dữ liệu', icon: Download, cls: 'bg-amber-50 text-amber-700' },
};

const SEVERITY_META: Record<Severity, string> = {
  INFO: 'bg-slate-100 text-slate-600',
  WARNING: 'bg-amber-50 text-amber-700',
  CRITICAL: 'bg-rose-50 text-rose-700',
};

export function AdminAuditLogsPage() {
  const { show, toastNode } = useToast();
  const [query, setQuery] = useState('');
  const [action, setAction] = useState<'ALL' | Action>('ALL');
  const [severity, setSeverity] = useState<'ALL' | Severity>('ALL');
  const [role, setRole] = useState('ALL');
  const [detail, setDetail] = useState<Log | null>(null);

  const filtered = LOGS.filter(
    (l) =>
      (action === 'ALL' || l.action === action) &&
      (severity === 'ALL' || l.severity === severity) &&
      (role === 'ALL' || l.role === role) &&
      (!query || `${l.id} ${l.actor} ${l.resource} ${l.detail} ${l.ip}`.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nhật Ký Kiểm Toán (Audit Logs)"
        description="Ghi lại mọi thao tác thay đổi dữ liệu và truy cập hệ thống — lưu trữ 5 năm, không thể chỉnh sửa"
        actions={<AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(`Đã xuất ${filtered.length} bản ghi audit (CSV, có chữ ký số)`)}>Xuất log</AppButton>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Sự kiện 24h" value="12.408" icon={Shield} tone="navy" />
        <StatCard label="Thay đổi dữ liệu" value="1.932" icon={Pencil} tone="blue" />
        <StatCard label="Cảnh báo" value={LOGS.filter((l) => l.severity === 'WARNING').length} icon={AlertTriangle} tone="amber" />
        <StatCard label="Nghiêm trọng" value={LOGS.filter((l) => l.severity === 'CRITICAL').length} icon={Globe} tone="rose" hint="1 truy cập trái phép bị chặn" />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo người thực hiện, tài nguyên, IP..." className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={action} onChange={(e) => setAction(e.target.value as 'ALL' | Action)} className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white">
              <option value="ALL">Mọi hành động</option>
              {(Object.keys(ACTION_META) as Action[]).map((a) => <option key={a} value={a}>{ACTION_META[a].label}</option>)}
            </select>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as 'ALL' | Severity)} className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white">
              <option value="ALL">Mọi mức độ</option>
              <option value="INFO">Thông tin</option>
              <option value="WARNING">Cảnh báo</option>
              <option value="CRITICAL">Nghiêm trọng</option>
            </select>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white">
              <option value="ALL">Mọi vai trò</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
              <option value="STUDENT">Student</option>
              <option value="SYSTEM">Hệ thống</option>
            </select>
            <input type="date" defaultValue="2026-10-17" className="px-3 py-2 text-xs rounded-lg border border-slate-200" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Thời gian</th>
                <th className="text-left px-4 py-3 font-semibold">Người thực hiện</th>
                <th className="text-left px-4 py-3 font-semibold">Hành động</th>
                <th className="text-left px-4 py-3 font-semibold">Tài nguyên</th>
                <th className="text-left px-4 py-3 font-semibold">Mô tả</th>
                <th className="text-left px-4 py-3 font-semibold">IP</th>
                <th className="text-left px-4 py-3 font-semibold">Mức độ</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => {
                const m = ACTION_META[l.action];
                return (
                  <tr key={l.id} className={clsx('hover:bg-slate-50', l.severity === 'CRITICAL' && 'bg-rose-50/30')}>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">{l.time}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Avatar name={l.actor} size="xs" /><div><div className="font-semibold text-slate-800">{l.actor}</div><div className="text-[10px] text-slate-400">{l.role}</div></div></div></td>
                    <td className="px-4 py-3"><span className={clsx('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', m.cls)}><m.icon className="w-3 h-3" />{m.label}</span></td>
                    <td className="px-4 py-3"><code className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100">{l.resource}</code></td>
                    <td className="px-4 py-3 text-slate-600 max-w-64 truncate">{l.detail}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{l.ip}</td>
                    <td className="px-4 py-3"><span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', SEVERITY_META[l.severity])}>{l.severity}</span></td>
                    <td className="px-4 py-3 text-right"><button type="button" onClick={() => setDetail(l)} className="p-1.5 rounded-md hover:bg-slate-100" aria-label="Xem chi tiết"><Eye className="w-4 h-4 text-slate-500" /></button></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-slate-400">Không có bản ghi phù hợp</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t text-[11px] text-slate-500">Hiển thị {filtered.length} / 12.408 bản ghi trong 24 giờ qua</div>
      </SectionCard>

      <Modal open={!!detail} onClose={() => setDetail(null)} size="lg" title={detail ? `Bản ghi ${detail.id}` : ''} subtitle={detail?.time}>
        {detail && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Người thực hiện', `${detail.actor} (${detail.role})`],
                ['Hành động', ACTION_META[detail.action].label],
                ['Tài nguyên', detail.resource],
                ['Địa chỉ IP', detail.ip],
                ['Mức độ', detail.severity],
                ['User-Agent', 'Mozilla/5.0 (Windows NT 10.0) Chrome/130'],
              ].map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg bg-slate-50"><div className="text-slate-400">{k}</div><div className="font-semibold text-slate-800 break-all">{v}</div></div>
              ))}
            </div>
            <p className="p-3 rounded-lg border border-slate-200 text-slate-700">{detail.detail}</p>
            {(detail.before || detail.after) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div><div className="font-bold text-slate-700 mb-1">Trước</div><pre className="p-3 rounded-lg bg-rose-50 text-rose-800 font-mono text-[11px] whitespace-pre-wrap">{detail.before ?? '—'}</pre></div>
                <div><div className="font-bold text-slate-700 mb-1">Sau</div><pre className="p-3 rounded-lg bg-emerald-50 text-emerald-800 font-mono text-[11px] whitespace-pre-wrap">{detail.after ?? '—'}</pre></div>
              </div>
            )}
            <div className="text-[11px] text-slate-400">Hash: sha256:9f2c…e81a • Bản ghi được ký và lưu bất biến (append-only).</div>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
