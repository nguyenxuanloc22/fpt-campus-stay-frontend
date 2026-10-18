import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowLeftRight, CalendarClock, Inbox, Check, X, CheckCircle2, ChevronRight, PartyPopper, UserCog, Clock } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, Tabs, StatusBadge, AppButton, Modal, Avatar, EmptyState, useToast } from '@shared-ui';
import { APP_ROUTES } from '@campusstay/constants';
import {
  APPLICATION_TYPES,
  STATE_LABEL,
  typeMeta,
  useStudentApplications,
  type ApplicationState,
  type ApplicationType,
} from '@features/applications/studentApplications';
import { APPLICATION_VISUAL, STATE_TONE } from '@features/applications/applicationVisuals';

/**
 * Đơn của tôi — theo dõi mọi đơn đã gửi (Track Request Status), phản hồi lời mời hoán đổi phòng
 * (Respond to Swap Invitation) và xem lịch bảo trì (View Maintenance Schedule) — docs/BUSINESS_FLOWS.md F4, F5.
 */

type TabKey = 'mine' | 'invitations' | 'schedule';
type StateFilter = 'ALL' | 'OPEN' | 'DONE';

const OPEN_STATES: ApplicationState[] = ['SUBMITTED', 'PROCESSING', 'WAITING_PARTNER', 'APPROVED'];

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

const INITIAL_INVITES: Invitation[] = [
  { id: 'INV-SW-0052', from: 'Đặng Minh Thư', fromId: 'IA171876', fromRoom: 'A115-G3', myRoom: 'A204-G1', reason: 'Mình muốn lên tầng cao cho yên tĩnh, bạn có muốn xuống tầng 1 không?', expires: '19/10/2026 23:59' },
];

const SCHEDULE = [
  { date: '19/10/2026', time: '08:00 – 14:00', title: 'Vệ sinh bồn chứa nước Tòa A', impact: 'Tạm ngưng cấp nước', mine: true },
  { date: '21/10/2026', time: '22:00 – 06:00', title: 'Nâng cấp Wi-Fi 6 toàn KTX', impact: 'Gián đoạn mạng', mine: true },
  { date: '28/10/2026', time: '08:00 – 11:00', title: 'Bảo dưỡng máy lạnh tầng 2 Tòa A', impact: 'Kỹ thuật viên vào phòng', mine: true },
  { date: '04/11/2026', time: '14:00 – 16:00', title: 'Kiểm tra hệ thống PCCC Tòa B', impact: 'Chuông báo thử', mine: false },
];

function StateBadge({ state }: { state: ApplicationState }) {
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap', STATE_TONE[state])}>{STATE_LABEL[state]}</span>;
}

export function StudentApplicationsPage() {
  const { show, toastNode } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, cancel, confirmDone } = useStudentApplications();
  const submittedId = (location.state as { submittedId?: string } | null)?.submittedId;

  const [tab, setTab] = useState<TabKey>('mine');
  const [typeFilter, setTypeFilter] = useState<'ALL' | ApplicationType>('ALL');
  const [stateFilter, setStateFilter] = useState<StateFilter>('ALL');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [invites, setInvites] = useState(INITIAL_INVITES);

  const pendingInvites = invites.filter((i) => !i.answered).length;
  const openCount = items.filter((a) => OPEN_STATES.includes(a.state)).length;
  const list = items.filter(
    (a) =>
      (typeFilter === 'ALL' || a.type === typeFilter) &&
      (stateFilter === 'ALL' || (stateFilter === 'OPEN' ? OPEN_STATES.includes(a.state) : !OPEN_STATES.includes(a.state))) &&
      (!query || `${a.id} ${a.title}`.toLowerCase().includes(query.toLowerCase()))
  );
  const selected = items.find((a) => a.id === openId);

  const summary = [
    { label: 'Tổng số đơn', value: items.length, tone: 'from-orange-500 to-amber-400' },
    { label: 'Đang xử lý', value: openCount, tone: 'from-sky-500 to-cyan-400' },
    { label: 'Hoàn tất', value: items.filter((a) => a.state === 'COMPLETED').length, tone: 'from-emerald-500 to-teal-400' },
    { label: 'Lời mời hoán đổi', value: pendingInvites, tone: 'from-violet-500 to-fuchsia-400' },
  ];

  const answer = (id: string, a: 'ACCEPTED' | 'REJECTED') => {
    setInvites((all) => all.map((i) => (i.id === id ? { ...i, answered: a } : i)));
    show(a === 'ACCEPTED' ? 'Đã chấp nhận — đơn được chuyển tới Trưởng ban KTX duyệt' : 'Đã từ chối lời mời hoán đổi', a === 'ACCEPTED' ? 'success' : 'info');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Đơn của tôi"
        description="Theo dõi tiến độ mọi đơn đã gửi tới Ban quản lý KTX"
        actions={<AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate(APP_ROUTES.STUDENT.APPLICATION_NEW)}>Gửi đơn mới</AppButton>}
      />

      {submittedId && (
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-800">
          <PartyPopper className="w-5 h-5 shrink-0" />
          <span className="flex-1">Đã gửi đơn <strong>{submittedId}</strong>. Bạn sẽ nhận thông báo khi đơn được tiếp nhận.</span>
          <button type="button" onClick={() => setOpenId(submittedId)} className="font-bold hover:underline">Xem đơn</button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
            <div className={clsx('absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br opacity-15', s.tone)} />
            <div className={clsx('w-8 h-1.5 rounded-full bg-gradient-to-r mb-3', s.tone)} />
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">{s.value}</div>
            <div className="text-xs font-semibold text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'mine', label: 'Đơn đã gửi', count: items.length },
          { value: 'invitations', label: 'Lời mời hoán đổi', count: pendingInvites },
          { value: 'schedule', label: 'Lịch bảo trì' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'mine' && (
        <SectionCard noPadding>
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-3 lg:items-center">
            <div className="flex gap-1.5 flex-wrap">
              {(['ALL', 'OPEN', 'DONE'] as StateFilter[]).map((f) => (
                <button key={f} type="button" onClick={() => setStateFilter(f)} className={clsx('px-3 py-1.5 rounded-full text-xs font-bold border transition', stateFilter === f ? 'bg-[#F26F21] text-white border-[#F26F21]' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300')}>
                  {f === 'ALL' ? 'Tất cả' : f === 'OPEN' ? 'Đang xử lý' : 'Đã đóng'}
                </button>
              ))}
            </div>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'ALL' | ApplicationType)} className="lg:ml-auto px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white">
              <option value="ALL">Mọi loại đơn</option>
              {APPLICATION_TYPES.map((t) => <option key={t.type} value={t.type}>{t.title}</option>)}
            </select>
            <div className="relative lg:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm mã đơn, tiêu đề…" className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white" />
            </div>
          </div>

          {list.length === 0 ? (
            <div className="p-6">
              <EmptyState title="Không có đơn phù hợp" description="Thử bỏ bớt bộ lọc hoặc gửi đơn mới." actionText="Gửi đơn mới" onAction={() => navigate(APP_ROUTES.STUDENT.APPLICATION_NEW)} />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {list.map((a) => {
                const v = APPLICATION_VISUAL[a.type];
                return (
                  <li key={a.id}>
                    <button type="button" onClick={() => setOpenId(a.id)} className={clsx('w-full px-4 py-3.5 flex items-center gap-4 text-left hover:bg-orange-50/40 transition', a.id === submittedId && 'bg-emerald-50/50')}>
                      <span className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', v.tile)}>
                        <v.icon className="w-5 h-5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-slate-800 truncate">{a.title}</span>
                        <span className="block text-[11px] text-slate-500">{a.id} · {typeMeta(a.type).title} · {a.created}</span>
                      </span>
                      {a.state === 'APPROVED' && a.type === 'MAINTENANCE' && <span className="hidden md:inline text-[11px] font-semibold text-teal-700">Chờ bạn xác nhận</span>}
                      <StateBadge state={a.state} />
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
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
                      <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-semibold">{i.fromRoom}</span>
                      <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 font-semibold">{i.myRoom} (phòng của bạn)</span>
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 text-white flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-sm font-extrabold leading-none">{s.date.slice(0, 2)}</span>
                  <span className="text-[10px]">T{Number(s.date.slice(3, 5))}</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-800">{s.title}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1"><CalendarClock className="w-3 h-3" />{s.time} · {s.impact}</div>
                </div>
                {s.mine && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">Ảnh hưởng phòng bạn</span>}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <Modal
        open={!!selected}
        onClose={() => setOpenId(null)}
        size="lg"
        title={selected?.title}
        subtitle={selected && `${selected.id} · ${typeMeta(selected.type).title} · gửi ${selected.created}`}
        footer={
          selected && (
            <>
              {(selected.state === 'SUBMITTED' || selected.state === 'WAITING_PARTNER') && (
                <AppButton variant="outline" onClick={() => { cancel(selected.id); show('Đã hủy đơn', 'info'); }}>Hủy đơn</AppButton>
              )}
              {selected.state === 'APPROVED' && selected.type === 'MAINTENANCE' && (
                <AppButton leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={() => { confirmDone(selected.id); show('Cảm ơn bạn đã xác nhận!'); }}>Xác nhận đã sửa xong</AppButton>
              )}
              <AppButton variant="ghost" onClick={() => setOpenId(null)}>Đóng</AppButton>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <StateBadge state={selected.state} />
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500"><UserCog className="w-3.5 h-3.5 text-sky-500" />{typeMeta(selected.type).handler}</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500"><Clock className="w-3.5 h-3.5 text-amber-500" />{typeMeta(selected.type).sla}</span>
            </div>
            {Object.keys(selected.fields).length > 0 && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(selected.fields).map(([k, val]) => (
                  <div key={k} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                    <dt className="text-[11px] text-slate-500">{k}</dt>
                    <dd className="text-sm font-semibold text-slate-800">{val}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div>
              <div className="text-xs font-bold text-slate-700 mb-1">Nội dung</div>
              <p className="text-slate-600 leading-relaxed">{selected.detail}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">Tiến trình xử lý</div>
              <ol className="relative border-l-2 border-orange-100 ml-2 space-y-3">
                {selected.timeline.map((e, i) => (
                  <li key={e.time + e.text} className="pl-4 relative">
                    <span className={clsx('absolute -left-[7px] top-1 w-3 h-3 rounded-full ring-2 ring-white', i === selected.timeline.length - 1 ? 'bg-[#F26F21]' : 'bg-orange-200')} />
                    <div className="text-[11px] font-bold text-slate-500">{e.time}</div>
                    <div className="text-sm text-slate-700">{e.text}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
