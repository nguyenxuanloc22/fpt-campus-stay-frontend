import { useState } from 'react';
import {
  Send,
  Megaphone,
  Mail,
  Smartphone,
  MessageSquare,
  Users,
  Building2,
  Clock,
  Eye,
  FileText,
  CheckCircle2,
  BarChart3,
  Bell,
  Paperclip,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, StatusBadge, AppButton, Tabs, ProgressBar, useToast } from '@shared-ui';

type Audience = 'ALL' | 'BUILDING' | 'FLOOR' | 'ROOM' | 'DEBT';
type Channel = 'INAPP' | 'EMAIL' | 'SMS' | 'PUSH';

const TEMPLATES = [
  { id: 'water', name: 'Cắt nước bảo trì', category: 'MAINTENANCE', title: 'Thông báo tạm ngưng cấp nước Tòa {tòa}', body: 'Ban Quản lý KTX thông báo tạm ngưng cấp nước Tòa {tòa} từ {giờ bắt đầu} đến {giờ kết thúc} ngày {ngày} để bảo trì hệ thống. Sinh viên vui lòng chủ động dự trữ nước. Xin cảm ơn!' },
  { id: 'inspection', name: 'Lịch kiểm tra phòng', category: 'KTX', title: 'Lịch kiểm tra phòng định kỳ ngày {ngày}', body: 'Đoàn kiểm tra sẽ kiểm tra vệ sinh, an toàn PCCC tại các phòng thuộc Tòa {tòa} vào {giờ}. Đề nghị sinh viên dọn dẹp phòng ở và có mặt (nếu có thể).' },
  { id: 'debt', name: 'Nhắc nợ phí', category: 'FINANCE', title: 'Nhắc nhở thanh toán phí KTX', body: 'Hệ thống ghi nhận bạn còn khoản phí chưa thanh toán. Vui lòng thanh toán qua VietQR trước {hạn} để tránh bị tạm khóa thẻ ra vào.' },
  { id: 'fire', name: 'Diễn tập PCCC', category: 'SAFETY', title: 'Diễn tập phòng cháy chữa cháy toàn KTX', body: 'Vào lúc {giờ} ngày {ngày}, KTX tổ chức diễn tập PCCC. Khi nghe chuông báo động, sinh viên di chuyển theo lối thoát hiểm tới sân tập trung.' },
];

const HISTORY = [
  { title: 'Lịch cắt nước bảo trì bồn chứa Tòa A ngày 19/10', audience: 'Tòa A (288 SV)', channels: ['INAPP', 'PUSH', 'EMAIL'], sent: '16/10/2026 14:00', by: 'Lê Minh Khoa', read: 82, status: 'COMPLETED' },
  { title: 'Kiểm tra phòng định kỳ tháng 10/2026', audience: 'Toàn KTX (1.075 SV)', channels: ['INAPP', 'EMAIL'], sent: '15/10/2026 08:00', by: 'Nguyễn Thu Hà', read: 91, status: 'COMPLETED' },
  { title: 'Nâng cấp hệ thống Wi-Fi 6', audience: 'Toàn KTX (1.075 SV)', channels: ['INAPP', 'PUSH'], sent: '12/10/2026 10:00', by: 'Trần Văn Cường', read: 76, status: 'COMPLETED' },
  { title: 'Diễn tập PCCC ngày 02/11', audience: 'Toàn KTX (1.075 SV)', channels: ['INAPP', 'PUSH', 'SMS'], sent: 'Hẹn 30/10/2026 07:00', by: 'Trần Văn Cường', read: 0, status: 'SCHEDULED' },
  { title: 'Nhắc nợ phí điện nước tháng 9', audience: 'SV còn nợ (37 SV)', channels: ['EMAIL', 'SMS'], sent: '10/10/2026 09:00', by: 'Hệ thống', read: 64, status: 'COMPLETED' },
];

const CHANNELS: { id: Channel; label: string; icon: typeof Mail; cost?: string }[] = [
  { id: 'INAPP', label: 'In-app', icon: Bell },
  { id: 'PUSH', label: 'Push mobile', icon: Smartphone },
  { id: 'EMAIL', label: 'Email', icon: Mail },
  { id: 'SMS', label: 'SMS', icon: MessageSquare, cost: '~350 ₫/tin' },
];

const AUDIENCE_SIZE: Record<Audience, number> = { ALL: 1075, BUILDING: 288, FLOOR: 48, ROOM: 4, DEBT: 37 };

export function StaffBroadcastPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<'compose' | 'history'>('compose');
  const [audience, setAudience] = useState<Audience>('BUILDING');
  const [building, setBuilding] = useState('A');
  const [channels, setChannels] = useState<Channel[]>(['INAPP', 'PUSH']);
  const [category, setCategory] = useState('MAINTENANCE');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [schedule, setSchedule] = useState<'now' | 'later'>('now');
  const [history, setHistory] = useState(HISTORY);

  const recipients = AUDIENCE_SIZE[audience];
  const toggleChannel = (c: Channel) => setChannels((all) => (all.includes(c) ? all.filter((x) => x !== c) : [...all, c]));

  const applyTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setTitle(t.title.replace('{tòa}', building));
    setBody(t.body.replaceAll('{tòa}', building));
    setCategory(t.category);
  };

  const send = () => {
    const audienceLabel = audience === 'ALL' ? `Toàn KTX (${recipients} SV)` : audience === 'BUILDING' ? `Tòa ${building} (${recipients} SV)` : audience === 'DEBT' ? `SV còn nợ (${recipients} SV)` : `${recipients} SV`;
    setHistory([{ title, audience: audienceLabel, channels, sent: schedule === 'now' ? 'Vừa xong' : 'Đã hẹn giờ', by: 'Trần Văn Cường', read: 0, status: schedule === 'now' ? 'COMPLETED' : 'SCHEDULED' }, ...history]);
    show(schedule === 'now' ? `Đã gửi thông báo tới ${recipients} sinh viên` : 'Đã lên lịch gửi thông báo');
    setTitle('');
    setBody('');
    setTab('history');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Phát Thông Báo" description="Gửi thông báo vận hành, cảnh báo an toàn và nhắc nhở tới sinh viên theo tòa, tầng hoặc phòng" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Đã gửi tháng này" value="24" icon={Megaphone} tone="orange" />
        <StatCard label="Tỷ lệ đọc TB" value="83%" icon={Eye} tone="emerald" trend={{ value: '+5%', up: true }} />
        <StatCard label="Đang hẹn giờ" value={history.filter((h) => h.status === 'SCHEDULED').length} icon={Clock} tone="blue" />
        <StatCard label="SMS còn lại" value="4.250" icon={MessageSquare} tone="navy" hint="Gói tháng 10" />
      </div>

      <Tabs
        items={[
          { value: 'compose' as const, label: 'Soạn thông báo' },
          { value: 'history' as const, label: 'Lịch sử gửi', count: history.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'compose' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <SectionCard title="1. Đối tượng nhận">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(
                  [
                    ['ALL', 'Toàn KTX', Users],
                    ['BUILDING', 'Theo tòa', Building2],
                    ['FLOOR', 'Theo tầng', Building2],
                    ['ROOM', 'Theo phòng', Building2],
                    ['DEBT', 'SV còn nợ', AlertTriangle],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAudience(id)}
                    className={clsx('p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5', audience === id ? 'border-[#F26F21] bg-orange-50 text-[#F26F21]' : 'border-slate-200 text-slate-600')}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              {(audience === 'BUILDING' || audience === 'FLOOR' || audience === 'ROOM') && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <select value={building} onChange={(e) => setBuilding(e.target.value)} className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white">
                    {['A', 'B', 'C', 'D'].map((b) => (
                      <option key={b} value={b}>Tòa {b}</option>
                    ))}
                  </select>
                  {audience !== 'BUILDING' && (
                    <select className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white">
                      {[1, 2, 3, 4, 5].map((f) => (
                        <option key={f}>Tầng {f}</option>
                      ))}
                    </select>
                  )}
                  {audience === 'ROOM' && <input placeholder="VD: A204, A205" className="px-3 py-2 text-xs border border-slate-200 rounded-lg" />}
                </div>
              )}
              <div className="mt-4 text-xs text-slate-600">
                Ước tính <strong className="text-[#1A365D]">{recipients.toLocaleString('vi-VN')}</strong> sinh viên sẽ nhận thông báo.
              </div>
            </SectionCard>

            <SectionCard title="2. Nội dung" actions={
              <select onChange={(e) => applyTemplate(e.target.value)} defaultValue="" className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white">
                <option value="" disabled>Dùng mẫu có sẵn...</option>
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            }>
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Danh mục</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                      <option value="KTX">Ký túc xá</option>
                      <option value="MAINTENANCE">Bảo trì</option>
                      <option value="SAFETY">An toàn</option>
                      <option value="FINANCE">Tài chính</option>
                      <option value="EVENT">Sự kiện</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 mt-5 font-semibold text-rose-700">
                    <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="accent-rose-600" />
                    Đánh dấu KHẨN CẤP (ghim đầu trang + âm báo)
                  </label>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tiêu đề</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Tiêu đề ngắn gọn, rõ ràng" />
                  <div className="text-right text-[10px] text-slate-400 mt-0.5">{title.length}/120</div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nội dung</label>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Nội dung chi tiết..." />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>{channels.includes('SMS') && body.length > 160 ? `SMS sẽ bị chia thành ${Math.ceil(body.length / 160)} tin` : ''}</span>
                    <span>{body.length} ký tự</span>
                  </div>
                </div>
                <button type="button" className="flex items-center gap-1.5 text-[#1A365D] font-semibold"><Paperclip className="w-3.5 h-3.5" /> Đính kèm tệp (PDF, ảnh)</button>
              </div>
            </SectionCard>

            <SectionCard title="3. Kênh gửi & thời gian">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {CHANNELS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleChannel(c.id)}
                    className={clsx('p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1', channels.includes(c.id) ? 'border-[#1A365D] bg-[#EBF2FB] text-[#1A365D]' : 'border-slate-200 text-slate-600')}
                  >
                    <c.icon className="w-4 h-4" />
                    {c.label}
                    {c.cost && <span className="text-[10px] font-normal text-slate-400">{c.cost}</span>}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2"><input type="radio" checked={schedule === 'now'} onChange={() => setSchedule('now')} className="accent-[#F26F21]" /> Gửi ngay</label>
                <label className="flex items-center gap-2"><input type="radio" checked={schedule === 'later'} onChange={() => setSchedule('later')} className="accent-[#F26F21]" /> Hẹn giờ</label>
                {schedule === 'later' && <input type="datetime-local" defaultValue="2026-10-18T07:00" className="px-3 py-1.5 border border-slate-200 rounded-lg" />}
              </div>
              <div className="flex justify-end gap-2 mt-5 pt-4 border-t">
                <AppButton variant="outline" onClick={() => show('Đã lưu bản nháp', 'info')}>Lưu nháp</AppButton>
                <AppButton disabled={!title || !body || channels.length === 0} leftIcon={<Send className="w-4 h-4" />} onClick={send}>
                  {schedule === 'now' ? 'Gửi thông báo' : 'Lên lịch gửi'}
                </AppButton>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title={<span className="flex items-center gap-2"><Smartphone className="w-4 h-4" /> Xem trước trên điện thoại</span>}>
              <div className="mx-auto w-60 rounded-[2rem] border-8 border-slate-800 bg-slate-100 p-3 min-h-96">
                <div className="text-center text-[10px] text-slate-500 mb-3">09:41</div>
                <div className={clsx('rounded-xl bg-white p-3 shadow-sm', urgent && 'ring-2 ring-rose-400')}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded bg-[#F26F21] text-white text-[9px] font-bold flex items-center justify-center">CS</div>
                    <span className="text-[10px] font-semibold text-slate-600">CampusStay • bây giờ</span>
                  </div>
                  {urgent && <div className="text-[9px] font-bold text-rose-600 mb-0.5">⚠ KHẨN CẤP</div>}
                  <div className="text-[11px] font-bold text-slate-800 leading-snug">{title || 'Tiêu đề thông báo'}</div>
                  <div className="text-[10px] text-slate-600 mt-1 line-clamp-6">{body || 'Nội dung thông báo sẽ hiển thị ở đây...'}</div>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Mẫu thông báo" noPadding>
              <ul className="divide-y divide-slate-100">
                {TEMPLATES.map((t) => (
                  <li key={t.id}>
                    <button type="button" onClick={() => applyTemplate(t.id)} className="w-full px-5 py-3 text-left hover:bg-slate-50 flex items-center gap-2 text-xs">
                      <FileText className="w-4 h-4 text-[#1A365D]" />
                      <span className="font-semibold text-slate-700">{t.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>
      ) : (
        <SectionCard noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Thông báo</th>
                  <th className="text-left font-semibold px-5 py-3">Đối tượng</th>
                  <th className="text-left font-semibold px-5 py-3">Kênh</th>
                  <th className="text-left font-semibold px-5 py-3">Tỷ lệ đọc</th>
                  <th className="text-left font-semibold px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((h, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-800">{h.title}</div>
                      <div className="text-[11px] text-slate-400">{h.sent} • {h.by}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{h.audience}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        {h.channels.map((c) => {
                          const ch = CHANNELS.find((x) => x.id === c);
                          return ch ? <span key={c} title={ch.label} className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center"><ch.icon className="w-3 h-3 text-slate-600" /></span> : null;
                        })}
                      </div>
                    </td>
                    <td className="px-5 py-3 w-40">
                      {h.status === 'COMPLETED' ? (
                        <div className="flex items-center gap-2"><ProgressBar value={h.read} tone="emerald" /><span className="font-semibold">{h.read}%</span></div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      {h.status === 'COMPLETED' ? <StatusBadge status="COMPLETED" customLabel="Đã gửi" /> : <StatusBadge status="SCHEDULED" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t text-[11px] text-slate-500 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Tỷ lệ đọc được tính trên kênh in-app & push. <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-2" /> Email đã gửi thành công 99.2%.
          </div>
        </SectionCard>
      )}

      {toastNode}
    </div>
  );
}
