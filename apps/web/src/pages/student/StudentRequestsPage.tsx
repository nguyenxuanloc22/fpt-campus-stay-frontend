import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Wrench,
  Repeat,
  ArrowLeftRight,
  Plus,
  Camera,
  CheckCircle2,
  Send,
  CalendarClock,
  Inbox,
  Check,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import {
  PageHeader,
  SectionCard,
  Tabs,
  StatusBadge,
  AppButton,
  Modal,
  Avatar,
  EmptyState,
  useToast,
} from '@shared-ui';
import { MAINTENANCE_STATUS, ROOM_CHANGE_STATUS, type MaintenanceStatus, type RoomChangeStatus } from '@campusstay/constants';
import { assetsForRoom } from '@features/rooms/roomCatalog';

/**
 * Yêu cầu của sinh viên (docs/BUSINESS_FLOWS.md F4, F5):
 * Submit Maintenance Request · Submit Room Change Request (+ Initiate Mutual Room Swap)
 * · Respond to Swap Invitation · Track Request Status · View Maintenance Schedule.
 */

type TabKey = 'maintenance' | 'room-change' | 'invitations' | 'schedule';

interface Ticket {
  id: string;
  title: string;
  category: string;
  created: string;
  status: MaintenanceStatus;
  description: string;
  timeline: { time: string; text: string }[];
}

interface RoomChange {
  id: string;
  kind: 'MOVE' | 'SWAP';
  partner?: string;
  target?: string;
  reason: string;
  created: string;
  status: RoomChangeStatus;
}

interface Invitation {
  id: string;
  from: string;
  fromId: string;
  fromRoom: string;
  myRoom: string;
  reason: string;
  expires: string;
  answered?: 'ACCEPTED' | 'REJECTED';
}

/** Tài sản trong phòng hiện tại — báo hỏng theo mã ID để cán bộ bảo trì xác định đúng thiết bị */
const MY_ASSETS = assetsForRoom('A204', 'ROOM_4');

/** Thứ tự hiển thị tiến trình theo State Diagram yêu cầu sửa chữa */
const MAINT_FLOW: MaintenanceStatus[] = ['SENT', 'PENDING', 'PROCESSING', 'APPROVED', 'SCHEDULED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const MAINT_LABEL: Record<MaintenanceStatus, string> = {
  SENT: 'Đã gửi', PENDING: 'Tiếp nhận', PROCESSING: 'Phân loại', APPROVED: 'Đã duyệt', SCHEDULED: 'Đã lên lịch',
  IN_PROGRESS: 'Đang sửa', RESOLVED: 'Đã sửa xong', CLOSED: 'Đã đóng', CANCELLED: 'Đã hủy',
};
const SWAP_FLOW: RoomChangeStatus[] = ['PENDING', 'STUDENT_RESPONSE', 'PROCESSING', 'APPROVED', 'COMPLETED'];
const SWAP_LABEL: Record<RoomChangeStatus, string> = {
  DRAFT: 'Bản nháp', PENDING: 'Chờ ghép', STUDENT_RESPONSE: 'Chờ bạn phản hồi', PROCESSING: 'Chờ Manager duyệt',
  APPROVED: 'Đã duyệt', COMPLETED: 'Hoàn tất', REJECTED: 'Bị từ chối',
};

const INITIAL_TICKETS: Ticket[] = [
  { id: 'TK-10482', title: 'Máy lạnh chảy nước, không mát', category: 'A204-DH-01 · Điều hòa', created: '15/10/2026 21:10', status: 'SCHEDULED', description: 'Máy lạnh chảy nước xuống giường G2, bật 18°C không mát.', timeline: [{ time: '15/10 21:10', text: 'Bạn gửi yêu cầu kèm 2 ảnh' }, { time: '16/10 07:45', text: 'Cán bộ tiếp nhận, phân loại: điện lạnh' }, { time: '16/10 14:00', text: 'Đã lên lịch sửa 18/10 09:00 — KTV Lê Văn Tài' }] },
  { id: 'TK-10377', title: 'Bóng đèn nhà tắm bị cháy', category: 'A204-WC-01 · Nhà vệ sinh khép kín', created: '08/10/2026 19:02', status: 'RESOLVED', description: 'Đèn LED nhà tắm chập chờn rồi tắt hẳn.', timeline: [{ time: '08/10 19:02', text: 'Bạn gửi yêu cầu' }, { time: '09/10 10:30', text: 'Đã thay bóng LED 12W — chờ bạn xác nhận' }] },
  { id: 'TK-10290', title: 'Ổ cắm bàn học lỏng', category: 'A204-BH-01 · Bàn học cá nhân #1', created: '01/10/2026 20:15', status: 'CLOSED', description: 'Ổ cắm bàn học G1 lỏng, cắm sạc hay bị ngắt.', timeline: [{ time: '01/10 20:15', text: 'Bạn gửi yêu cầu' }, { time: '02/10 15:00', text: 'Đã thay ổ cắm mới' }, { time: '02/10 19:30', text: 'Bạn xác nhận hoàn tất' }] },
];

const INITIAL_CHANGES: RoomChange[] = [
  { id: 'RC-2026-0231', kind: 'SWAP', partner: 'Võ Thị Bảo Ngọc (SE172211) · A310-G2', reason: 'Muốn ở cùng phòng với bạn cùng lớp để học nhóm.', created: '16/10/2026', status: 'PROCESSING' },
  { id: 'RC-2026-0198', kind: 'MOVE', target: 'Tầng thấp, Tòa A', reason: 'Đau chân, cần ở tầng 1.', created: '20/09/2026', status: 'REJECTED' },
];

const INITIAL_INVITES: Invitation[] = [
  { id: 'INV-SW-0052', from: 'Đặng Minh Thư', fromId: 'IA171876', fromRoom: 'A115-G3', myRoom: 'A204-G1', reason: 'Mình muốn lên tầng cao cho yên tĩnh, bạn có muốn xuống tầng 1 không?', expires: '19/10/2026 23:59' },
];

const SCHEDULE = [
  { date: '19/10/2026', time: '08:00 – 14:00', title: 'Vệ sinh bồn chứa nước Tòa A', impact: 'Tạm ngưng cấp nước', mine: true },
  { date: '21/10/2026', time: '22:00 – 06:00', title: 'Nâng cấp Wi-Fi 6 toàn KTX', impact: 'Gián đoạn mạng', mine: true },
  { date: '28/10/2026', time: '08:00 – 11:00', title: 'Bảo dưỡng máy lạnh tầng 2 Tòa A', impact: 'Kỹ thuật viên vào phòng', mine: true },
  { date: '04/11/2026', time: '14:00 – 16:00', title: 'Kiểm tra hệ thống PCCC Tòa B', impact: 'Chuông báo thử', mine: false },
];

function Progress<T extends string>({ flow, current, labels }: { flow: T[]; current: T; labels: Record<T, string> }) {
  const idx = flow.indexOf(current);
  return (
    <ol className="flex flex-wrap gap-1 mt-3">
      {flow.map((s, i) => (
        <li key={s} className={clsx('px-2 py-0.5 rounded-full text-[10px] font-semibold', i < idx ? 'bg-emerald-50 text-emerald-700' : i === idx ? 'bg-[#F26F21] text-white' : 'bg-slate-100 text-slate-400')}>
          {labels[s]}
        </li>
      ))}
    </ol>
  );
}

export function StudentRequestsPage() {
  const { show, toastNode } = useToast();
  const location = useLocation();
  const [tab, setTab] = useState<TabKey>('maintenance');
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [changes, setChanges] = useState(INITIAL_CHANGES);
  const [invites, setInvites] = useState(INITIAL_INVITES);
  const [maintOpen, setMaintOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  const [assetId, setAssetId] = useState(MY_ASSETS[0]!.id);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState(0);

  const [swapMode, setSwapMode] = useState<'SWAP' | 'MOVE'>('SWAP');
  const [partnerId, setPartnerId] = useState('');
  const [reason, setReason] = useState('');

  const pendingInvites = invites.filter((i) => !i.answered).length;

  // Bấm “Báo hỏng” từ trang Phòng của tôi → mở sẵn form với đúng thiết bị
  useEffect(() => {
    const prefill = (location.state as { assetId?: string } | null)?.assetId;
    if (prefill && MY_ASSETS.some((a) => a.id === prefill)) {
      setAssetId(prefill);
      setTab('maintenance');
      setMaintOpen(true);
    }
  }, [location.state]);

  const submitMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `TK-${10500 + tickets.length}`;
    const asset = MY_ASSETS.find((a) => a.id === assetId);
    setTickets([{ id, title, category: asset ? `${asset.id} · ${asset.name}` : 'Khác', created: 'Vừa xong', status: MAINTENANCE_STATUS.SENT, description, timeline: [{ time: 'Vừa xong', text: `Bạn gửi yêu cầu${photos ? ` kèm ${photos} ảnh` : ''}` }] }, ...tickets]);
    setMaintOpen(false);
    setTitle('');
    setDescription('');
    setPhotos(0);
    show(`Đã gửi yêu cầu ${id}`);
  };

  const submitChange = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `RC-2026-0${240 + changes.length}`;
    setChanges([{ id, kind: swapMode, partner: swapMode === 'SWAP' ? partnerId : undefined, target: swapMode === 'MOVE' ? 'Hệ thống tìm người phù hợp' : undefined, reason, created: 'Vừa xong', status: swapMode === 'SWAP' ? ROOM_CHANGE_STATUS.STUDENT_RESPONSE : ROOM_CHANGE_STATUS.PENDING }, ...changes]);
    setChangeOpen(false);
    setPartnerId('');
    setReason('');
    show(swapMode === 'SWAP' ? `Đã gửi lời mời hoán đổi tới ${partnerId}` : 'Đã gửi yêu cầu, đang chờ ghép người phù hợp');
  };

  const confirmResolved = (id: string) => {
    setTickets((all) => all.map((t) => (t.id === id ? { ...t, status: MAINTENANCE_STATUS.CLOSED, timeline: [...t.timeline, { time: 'Vừa xong', text: 'Bạn xác nhận hoàn tất' }] } : t)));
    show('Cảm ơn bạn đã xác nhận!');
  };

  const cancelTicket = (id: string) => {
    setTickets((all) => all.map((t) => (t.id === id ? { ...t, status: MAINTENANCE_STATUS.CANCELLED } : t)));
    show('Đã hủy yêu cầu', 'info');
  };

  const answer = (id: string, a: 'ACCEPTED' | 'REJECTED') => {
    setInvites((all) => all.map((i) => (i.id === id ? { ...i, answered: a } : i)));
    show(a === 'ACCEPTED' ? 'Đã chấp nhận — yêu cầu được chuyển tới Ban quản lý duyệt' : 'Đã từ chối lời mời hoán đổi', a === 'ACCEPTED' ? 'success' : 'info');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yêu cầu"
        description="Báo hỏng, đổi phòng / hoán đổi phòng và theo dõi tiến độ xử lý"
        actions={
          <>
            <AppButton size="sm" variant="outline" leftIcon={<Repeat className="w-4 h-4" />} onClick={() => setChangeOpen(true)}>Yêu cầu đổi phòng</AppButton>
            <AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setMaintOpen(true)}>Báo hỏng</AppButton>
          </>
        }
      />

      {pendingInvites > 0 && tab !== 'invitations' && (
        <button type="button" onClick={() => setTab('invitations')} className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 text-left hover:border-slate-300">
          <ArrowLeftRight className="w-5 h-5 text-[#F26F21]" />
          <span className="flex-1">Bạn có <strong>{pendingInvites} lời mời hoán đổi phòng</strong> đang chờ phản hồi.</span>
          <span className="font-semibold">Xem ngay</span>
        </button>
      )}

      <Tabs<TabKey>
        items={[
          { value: 'maintenance', label: 'Báo hỏng', count: tickets.filter((t) => t.status !== 'CLOSED' && t.status !== 'CANCELLED').length },
          { value: 'room-change', label: 'Đổi phòng', count: changes.length },
          { value: 'invitations', label: 'Lời mời hoán đổi', count: pendingInvites },
          { value: 'schedule', label: 'Lịch bảo trì' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'maintenance' && (
        <div className="space-y-3">
          {tickets.map((t) => (
            <SectionCard key={t.id}>
              <div className="flex flex-col md:flex-row md:items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0"><Wrench className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{t.title}</span>
                    <StatusBadge status={t.status} customLabel={MAINT_LABEL[t.status]} />
                  </div>
                  <div className="text-[11px] text-slate-500">{t.id} · {t.category} · {t.created}</div>
                  <p className="text-xs text-slate-600 mt-1">{t.description}</p>
                  {t.status !== 'CANCELLED' && <Progress flow={MAINT_FLOW} current={t.status} labels={MAINT_LABEL} />}
                  <ul className="mt-3 space-y-1 text-[11px] text-slate-500">
                    {t.timeline.map((e) => <li key={e.time + e.text}><span className="font-semibold text-slate-700">{e.time}</span> — {e.text}</li>)}
                  </ul>
                </div>
                <div className="flex md:flex-col gap-2 shrink-0">
                  {t.status === 'RESOLVED' && <AppButton size="sm" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />} onClick={() => confirmResolved(t.id)}>Xác nhận đã sửa</AppButton>}
                  {(t.status === 'SENT' || t.status === 'PENDING') && <AppButton size="sm" variant="outline" onClick={() => cancelTicket(t.id)}>Hủy yêu cầu</AppButton>}
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {tab === 'room-change' && (
        changes.length === 0 ? (
          <EmptyState title="Chưa có yêu cầu đổi phòng" actionText="Tạo yêu cầu" onAction={() => setChangeOpen(true)} />
        ) : (
          <div className="space-y-3">
            {changes.map((c) => (
              <SectionCard key={c.id}>
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', 'bg-slate-100 text-slate-500')}>
                    {c.kind === 'SWAP' ? <ArrowLeftRight className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{c.kind === 'SWAP' ? 'Hoán đổi phòng' : 'Đổi phòng (chờ ghép)'}</span>
                      <StatusBadge status={c.status} customLabel={SWAP_LABEL[c.status]} />
                    </div>
                    <div className="text-[11px] text-slate-500">{c.id} · {c.created}</div>
                    <div className="text-xs text-slate-700 mt-1">{c.kind === 'SWAP' ? `Đối tác: ${c.partner}` : `Mong muốn: ${c.target}`}</div>
                    <p className="text-xs text-slate-500 mt-0.5">{c.reason}</p>
                    {c.status !== 'REJECTED' && <Progress flow={SWAP_FLOW} current={c.status} labels={SWAP_LABEL} />}
                    {c.status === 'REJECTED' && <p className="text-[11px] text-rose-600 mt-2">Ban quản lý từ chối: tầng 1 Tòa A hiện không còn chỗ trống.</p>}
                    {c.status === 'APPROVED' && <p className="text-[11px] text-emerald-700 mt-2">Đã duyệt — hãy tự check-out phòng cũ và check-in phòng mới trong 3 ngày.</p>}
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
        )
      )}

      {tab === 'invitations' && (
        invites.length === 0 ? (
          <EmptyState icon={<Inbox className="w-7 h-7" />} title="Không có lời mời nào" description="Khi sinh viên khác đề nghị hoán đổi phòng với bạn, lời mời sẽ xuất hiện ở đây." />
        ) : (
          <div className="space-y-3">
            {invites.map((i) => (
              <SectionCard key={i.id}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <Avatar name={i.from} size="md" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-slate-800">{i.from} ({i.fromId}) muốn hoán đổi phòng với bạn</div>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                      <span className="font-semibold">{i.fromRoom}</span><ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" /><span className="font-semibold">{i.myRoom} (phòng của bạn)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 italic">“{i.reason}”</p>
                    <p className="text-[11px] text-amber-700 mt-1">Hạn phản hồi: {i.expires}</p>
                  </div>
                  {i.answered ? (
                    <StatusBadge status={i.answered === 'ACCEPTED' ? 'PROCESSING' : 'REJECTED'} customLabel={i.answered === 'ACCEPTED' ? 'Đã chấp nhận · chờ duyệt' : 'Đã từ chối'} />
                  ) : (
                    <div className="flex gap-2">
                      <AppButton size="sm" variant="outline" leftIcon={<X className="w-3.5 h-3.5" />} onClick={() => answer(i.id, 'REJECTED')}>Từ chối</AppButton>
                      <AppButton size="sm" leftIcon={<Check className="w-3.5 h-3.5" />} onClick={() => answer(i.id, 'ACCEPTED')}>Chấp nhận</AppButton>
                    </div>
                  )}
                </div>
              </SectionCard>
            ))}
          </div>
        )
      )}

      {tab === 'schedule' && (
        <SectionCard title="Lịch bảo trì định kỳ" subtitle="Đã được Ban quản lý phê duyệt" noPadding>
          <ul className="divide-y divide-slate-100">
            {SCHEDULE.map((s) => (
              <li key={s.title} className="px-5 py-3.5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#EBF2FB] text-[#1A365D] flex flex-col items-center justify-center shrink-0">
                  <span className="text-sm font-bold leading-none">{s.date.slice(0, 2)}</span>
                  <span className="text-[10px]">T{Number(s.date.slice(3, 5))}</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800">{s.title}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1"><CalendarClock className="w-3 h-3" />{s.time} · {s.impact}</div>
                </div>
                {s.mine && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#F26F21]">Ảnh hưởng phòng bạn</span>}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <Modal open={maintOpen} onClose={() => setMaintOpen(false)} size="lg" title="Báo hỏng thiết bị" subtitle="Phòng A204 · Tòa A">
        <form onSubmit={submitMaintenance} className="space-y-4 text-xs">
          <label className="block">
            <span className="block font-semibold text-slate-700 mb-1">Thiết bị cần sửa</span>
            <select value={assetId} onChange={(e) => setAssetId(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
              {MY_ASSETS.map((a) => (
                <option key={a.id} value={a.id}>{a.id} — {a.name}</option>
              ))}
            </select>
            <span className="block text-[11px] text-slate-400 mt-1">Mã tài sản giúp kỹ thuật viên xác định đúng thiết bị trong phòng.</span>
          </label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Tiêu đề ngắn gọn" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Mô tả chi tiết, thời điểm phát hiện…" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: photos }).map((_, i) => <div key={i} className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">IMG_{i + 1}</div>)}
            {photos < 4 && (
              <button type="button" onClick={() => setPhotos((p) => p + 1)} className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-[#F26F21]" aria-label="Thêm ảnh">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <AppButton type="button" variant="outline" onClick={() => setMaintOpen(false)}>Hủy</AppButton>
            <AppButton type="submit" leftIcon={<Send className="w-4 h-4" />}>Gửi yêu cầu</AppButton>
          </div>
        </form>
      </Modal>

      <Modal open={changeOpen} onClose={() => setChangeOpen(false)} size="lg" title="Yêu cầu đổi phòng" subtitle="Đợt đổi phòng tuần 9: 12/10 – 25/10/2026">
        <form onSubmit={submitChange} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setSwapMode('SWAP')} className={clsx('p-3 rounded-lg border text-left', swapMode === 'SWAP' ? 'border-[#F26F21] bg-orange-50' : 'border-slate-200')}>
              <div className="font-bold text-slate-800 flex items-center gap-1.5"><ArrowLeftRight className="w-4 h-4" />Hoán đổi với bạn cụ thể</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Nhập mã SV, bạn ấy cần chấp nhận lời mời</div>
            </button>
            <button type="button" onClick={() => setSwapMode('MOVE')} className={clsx('p-3 rounded-lg border text-left', swapMode === 'MOVE' ? 'border-[#F26F21] bg-orange-50' : 'border-slate-200')}>
              <div className="font-bold text-slate-800 flex items-center gap-1.5"><Repeat className="w-4 h-4" />Chưa có đối tác</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Yêu cầu được treo chờ ghép đến hết đợt</div>
            </button>
          </div>
          {swapMode === 'SWAP' && (
            <input value={partnerId} onChange={(e) => setPartnerId(e.target.value.toUpperCase())} required placeholder="Mã sinh viên đối tác, VD: SE172211" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          )}
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} required rows={3} placeholder="Lý do đổi phòng" className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
          <p className="text-[11px] text-slate-500">Điều kiện: cùng giới tính, cùng kỳ lưu trú, đang ở KTX. Ban quản lý phê duyệt cuối cùng; hợp đồng được cập nhật sau khi hoán đổi.</p>
          <div className="flex justify-end gap-2 pt-2 border-t">
            <AppButton type="button" variant="outline" onClick={() => setChangeOpen(false)}>Hủy</AppButton>
            <AppButton type="submit" disabled={swapMode === 'SWAP' && !/^[A-Z]{2}\d{6}$/.test(partnerId)} leftIcon={<Send className="w-4 h-4" />}>Gửi yêu cầu</AppButton>
          </div>
        </form>
      </Modal>

      {toastNode}
    </div>
  );
}
