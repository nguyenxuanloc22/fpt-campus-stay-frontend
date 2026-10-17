import { useState } from 'react';
import { Search, Flag, CheckCircle2, XCircle, Send, FileText, Download, MessageSquare, ShieldCheck, Users, Clock } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, useToast } from '@shared-ui';
import type { ApplicationStatus } from '@campusstay/constants';

/**
 * Review Dormitory Applications (Staff) — docs/BUSINESS_FLOWS.md F1.
 * Điều kiện được hệ thống kiểm tra tự động khi nộp; Staff chỉ rà soát đơn bị gắn cờ:
 * xác nhận hợp lệ, hoặc chuyển Manager quyết định (Approve / Reject Dormitory Applications).
 */

type ReviewState = 'FLAGGED' | 'CLEARED' | 'ESCALATED';

interface Application {
  code: string;
  name: string;
  studentId: string;
  gender: 'Nam' | 'Nữ';
  major: string;
  roomType: string;
  submitted: string;
  status: ApplicationStatus;
  roommate: string;
  flag?: string;
  review?: ReviewState;
  checks: { label: string; ok: boolean }[];
  note?: string;
}

const okChecks = [
  { label: 'Sinh viên chính quy (SIS)', ok: true },
  { label: 'Không nợ phí KTX', ok: true },
  { label: 'Thuộc diện được đăng ký kỳ này', ok: true },
  { label: 'Đã đóng cọc', ok: true },
];

const APPLICATIONS: Application[] = [
  { code: 'APP-SP27-004809', name: 'Đỗ Minh Quân', studentId: 'SE190455', gender: 'Nam', major: 'Kỹ thuật phần mềm', roomType: '4 giường máy lạnh', submitted: '16/10/2026 18:02', status: 'PROCESSING', roommate: 'Ghép theo tiêu chí', flag: 'SIS báo “bảo lưu” nhưng sinh viên đã có quyết định học lại', review: 'FLAGGED', checks: [{ label: 'Sinh viên chính quy (SIS)', ok: false }, ...okChecks.slice(1)], note: 'Đính kèm quyết định học lại số 1123/QĐ-FPTU.' },
  { code: 'APP-SP27-004788', name: 'Phan Thùy Dung', studentId: 'GD190087', gender: 'Nữ', major: 'Thiết kế đồ họa', roomType: '4 giường quạt', submitted: '15/10/2026 14:10', status: 'PROCESSING', roommate: 'Mời SE190112', flag: 'Bạn cùng phòng được mời khác giới tính trên SIS', review: 'FLAGGED', checks: okChecks },
  { code: 'APP-SP27-004771', name: 'Mai Khánh Vy', studentId: 'SS190234', gender: 'Nữ', major: 'Digital Marketing', roomType: '4 giường máy lạnh', submitted: '14/10/2026 21:47', status: 'PROCESSING', roommate: 'Hệ thống tự xếp', flag: 'Yêu cầu đặc biệt: cần tầng thấp (giấy khám bệnh)', review: 'FLAGGED', checks: okChecks, note: 'Viêm khớp gối, có chỉ định hạn chế leo cầu thang.' },
  { code: 'APP-SP27-004760', name: 'Trương Gia Bảo', studentId: 'AI180990', gender: 'Nam', major: 'Trí tuệ nhân tạo', roomType: '2 giường', submitted: '14/10/2026 10:12', status: 'PROCESSING', roommate: 'Hệ thống tự xếp', flag: 'Còn nợ hóa đơn điện nước 405.000 ₫ (đang tranh chấp)', review: 'ESCALATED', checks: [okChecks[0]!, { label: 'Không nợ phí KTX', ok: false }, okChecks[2]!, okChecks[3]!] },
  { code: 'APP-SP27-004812', name: 'Nguyễn Thị Mai Anh', studentId: 'SE171234', gender: 'Nữ', major: 'Kỹ thuật phần mềm', roomType: '4 giường máy lạnh', submitted: '16/10/2026 20:15', status: 'PROCESSING', roommate: 'Mời SE172211', checks: okChecks },
  { code: 'APP-SP27-004801', name: 'Lê Thị Hồng Nhung', studentId: 'SE190112', gender: 'Nữ', major: 'An toàn thông tin', roomType: '4 giường máy lạnh', submitted: '16/10/2026 09:44', status: 'ASSIGNED', roommate: 'Ghép theo tiêu chí', checks: okChecks },
  { code: 'APP-SP27-004795', name: 'Hồ Tấn Phát', studentId: 'SE170321', gender: 'Nam', major: 'Kỹ thuật phần mềm', roomType: '4 giường máy lạnh', submitted: '15/10/2026 22:30', status: 'PENDING_PAYMENT', roommate: 'Hệ thống tự xếp', checks: [...okChecks.slice(0, 3), { label: 'Đã đóng cọc', ok: false }] },
  { code: 'APP-SP27-004702', name: 'Châu Ngọc Trâm', studentId: 'BA190045', gender: 'Nữ', major: 'Quản trị kinh doanh', roomType: '6 giường', submitted: '13/10/2026 08:20', status: 'CANCELLED', roommate: '—', checks: okChecks, note: 'Hệ thống hủy: quá hạn giữ chỗ chưa đóng cọc.' },
];

type TabKey = 'flagged' | 'all' | 'escalated';

export function StaffApplicationsPage() {
  const { show, toastNode } = useToast();
  const [apps, setApps] = useState(APPLICATIONS);
  const [tab, setTab] = useState<TabKey>('flagged');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatus>('ALL');
  const [activeCode, setActiveCode] = useState(APPLICATIONS[0]!.code);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [comment, setComment] = useState('');

  const filtered = apps.filter((a) => {
    if (tab === 'flagged' && a.review !== 'FLAGGED') return false;
    if (tab === 'escalated' && a.review !== 'ESCALATED') return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    return !query || `${a.code} ${a.name} ${a.studentId}`.toLowerCase().includes(query.toLowerCase());
  });
  const active = apps.find((a) => a.code === activeCode) ?? apps[0]!;
  const count = (r: ReviewState) => apps.filter((a) => a.review === r).length;

  const setReview = (code: string, review: ReviewState, msg: string) => {
    setApps((all) => all.map((a) => (a.code === code ? { ...a, review } : a)));
    show(msg);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rà soát đơn đăng ký"
        description="Đợt đăng ký Spring 2027 · Điều kiện đã được hệ thống kiểm tra với FPT SIS — chỉ đơn bị gắn cờ cần cán bộ xử lý"
        actions={<AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show('Đã xuất danh sách đơn')}>Xuất danh sách</AppButton>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Tổng đơn" value="1.284" icon={FileText} tone="navy" hint="+48 hôm nay" />
        <StatCard label="Chờ đóng cọc" value="96" icon={Clock} tone="amber" hint="Hệ thống tự hủy khi quá hạn" />
        <StatCard label="Bị gắn cờ" value={count('FLAGGED')} icon={Flag} tone="rose" hint="Cần cán bộ rà soát" />
        <StatCard label="Đã chuyển Manager" value={count('ESCALATED')} icon={Send} tone="purple" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <SectionCard noPadding>
            <div className="p-4 border-b border-slate-100 space-y-3">
              <Tabs<TabKey>
                items={[
                  { value: 'flagged', label: 'Cần rà soát', count: count('FLAGGED') },
                  { value: 'escalated', label: 'Đã chuyển Manager', count: count('ESCALATED') },
                  { value: 'all', label: 'Tất cả', count: apps.length },
                ]}
                value={tab}
                onChange={setTab}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Mã đơn, tên, MSSV…" className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | ApplicationStatus)} className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white">
                  <option value="ALL">Mọi trạng thái</option>
                  <option value="PENDING_PAYMENT">Chờ đóng cọc</option>
                  <option value="PROCESSING">Đang xử lý</option>
                  <option value="WAITING_NEXT_ROUND">Chờ vòng 2</option>
                  <option value="ASSIGNED">Đã xếp phòng</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>
            <ul className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filtered.map((a) => (
                <li key={a.code}>
                  <button type="button" onClick={() => setActiveCode(a.code)} className={clsx('w-full px-4 py-3 flex items-center gap-3 text-left', active.code === a.code ? 'bg-orange-50/60' : 'hover:bg-slate-50')}>
                    <Avatar name={a.name} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{a.name} <span className="font-normal text-slate-400">{a.studentId}</span></div>
                      <div className="text-[11px] text-slate-500 truncate">{a.code} · {a.roomType}</div>
                      {a.flag && <div className="text-[11px] text-rose-600 truncate flex items-center gap-1"><Flag className="w-3 h-3" />{a.flag}</div>}
                    </div>
                    <StatusBadge status={a.status} />
                  </button>
                </li>
              ))}
              {filtered.length === 0 && <li className="py-10 text-center text-xs text-slate-400">Không có đơn nào cần xử lý 🎉</li>}
            </ul>
          </SectionCard>
        </div>

        <div className="xl:col-span-2">
          <SectionCard title={active.code} subtitle={`Nộp lúc ${active.submitted}`} actions={<StatusBadge status={active.status} />}>
            <div className="space-y-5 text-xs">
              <div className="flex items-center gap-3">
                <Avatar name={active.name} size="lg" />
                <div>
                  <div className="text-sm font-bold text-slate-800">{active.name}</div>
                  <div className="text-slate-500">{active.studentId} · {active.gender} · {active.major}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50"><div className="text-slate-400">Loại phòng</div><div className="font-semibold">{active.roomType}</div></div>
                <div className="p-2.5 rounded-lg bg-slate-50"><div className="text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" />Bạn cùng phòng</div><div className="font-semibold">{active.roommate}</div></div>
              </div>
              <div>
                <div className="font-bold text-slate-700 mb-2 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" />Kết quả kiểm tra tự động</div>
                <ul className="space-y-1.5">
                  {active.checks.map((c) => (
                    <li key={c.label} className="flex items-center gap-2">
                      {c.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                      <span className={c.ok ? 'text-slate-700' : 'text-rose-700 font-semibold'}>{c.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {active.flag && <div className="p-3 rounded-lg bg-rose-50 text-rose-800 flex gap-2"><Flag className="w-4 h-4 shrink-0" />{active.flag}</div>}
              {active.note && <div className="p-3 rounded-lg bg-amber-50 text-amber-900 flex gap-2"><MessageSquare className="w-4 h-4 shrink-0" />{active.note}</div>}

              {active.review === 'FLAGGED' && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <AppButton size="sm" variant="outline" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => setReview(active.code, 'CLEARED', `Đã xác nhận hợp lệ ${active.code} — đơn tiếp tục chờ xếp phòng`)}>
                    Xác nhận hợp lệ
                  </AppButton>
                  <AppButton size="sm" leftIcon={<Send className="w-3.5 h-3.5" />} onClick={() => setEscalateOpen(true)}>Chuyển Manager</AppButton>
                </div>
              )}
              {active.review === 'ESCALATED' && <p className="text-[11px] text-purple-700">Đang chờ Manager phê duyệt / từ chối.</p>}
              {active.review === 'CLEARED' && <p className="text-[11px] text-emerald-700">Đã xác nhận hợp lệ.</p>}
            </div>
          </SectionCard>
        </div>
      </div>

      <Modal
        open={escalateOpen}
        onClose={() => setEscalateOpen(false)}
        title={`Chuyển ${active.code} cho Manager`}
        subtitle="Manager sẽ phê duyệt hoặc từ chối đơn"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setEscalateOpen(false)}>Hủy</AppButton>
            <AppButton disabled={comment.length < 10} onClick={() => { setReview(active.code, 'ESCALATED', `Đã chuyển ${active.code} cho Manager`); setEscalateOpen(false); setComment(''); }}>Gửi</AppButton>
          </>
        }
      >
        <label className="block text-xs font-semibold text-slate-700 mb-1">Ý kiến đề xuất của cán bộ (tối thiểu 10 ký tự)</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" placeholder="VD: Hồ sơ y tế hợp lệ, đề xuất chấp thuận và ưu tiên tầng 1." />
      </Modal>

      {toastNode}
    </div>
  );
}
