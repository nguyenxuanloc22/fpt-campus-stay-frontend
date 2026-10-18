import { useState } from 'react';
import { ArrowLeftRight, Repeat, CheckCircle2, AlertTriangle, Search, ShieldCheck, CalendarRange } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, useToast, t } from '@shared-ui';
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
  { label: t('Same gender'), ok: true },
  { label: t('Both residing this term'), ok: true },
  { label: t('No overdue debt'), ok: true },
  { label: t('Within the allowed room-change window'), ok: true },
];

const REQUESTS: ChangeRequest[] = [
  { id: 'RC-2026-0231', kind: 'SWAP', a: { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', room: 'A204-G1' }, b: { name: 'Võ Thị Bảo Ngọc', id: 'SE172211', room: 'A310-G2' }, reason: t('Wants to share a room with a classmate for group study.'), created: '16/10/2026', status: 'PROCESSING', checks: baseChecks },
  { id: 'RC-2026-0229', kind: 'SWAP', a: { name: 'Đỗ Minh Quân', id: 'SE190455', room: 'B210-G4' }, b: { name: 'Lý Gia Huy', id: 'SE180777', room: 'B105-G1' }, reason: t('Wants to live near a friend from the same hometown.'), created: '15/10/2026', status: 'PROCESSING', checks: [baseChecks[0]!, baseChecks[1]!, { label: t('No overdue debt'), ok: false }, baseChecks[3]!] },
  { id: 'RC-2026-0227', kind: 'SWAP', a: { name: 'Đặng Minh Thư', id: 'IA171876', room: 'A115-G3' }, b: { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', room: 'A204-G1' }, reason: t('Wants a higher floor for quiet.'), created: '15/10/2026', status: 'STUDENT_RESPONSE', checks: baseChecks },
  { id: 'RC-2026-0224', kind: 'MOVE', a: { name: 'Mai Khánh Vy', id: 'SS190234', room: 'C210-G4' }, reason: t('Needs a lower floor for health reasons — waiting for a swap partner.'), created: '14/10/2026', status: 'PENDING', checks: baseChecks },
  { id: 'RC-2026-0214', kind: 'SWAP', a: { name: 'Bùi Thanh Tâm', id: 'BA180123', room: 'B301-G2' }, b: { name: 'Trần Quốc Bảo', id: 'BA180456', room: 'B305-G5' }, reason: t('Agreed to swap places.'), created: '10/10/2026', status: 'COMPLETED', checks: baseChecks, verified: true },
  { id: 'RC-2026-0198', kind: 'MOVE', a: { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', room: 'A204-G1' }, reason: t('Leg pain, needs floor 1.'), created: '20/09/2026', status: 'REJECTED', checks: baseChecks, verified: true },
];

const STATUS_LABEL: Partial<Record<RoomChangeStatus, string>> = {
  PENDING: t('Waiting for match'),
  STUDENT_RESPONSE: t('Waiting for partner response'),
  PROCESSING: t('Awaiting manager approval'),
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
    show(t('Verification recorded for {0} — the manager will see the result when deciding', { 0: id }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('Room changes')} description={t('Track room change / swap requests and verify eligibility before the manager decides')} />

      <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-sunken border border-blue-100 text-xs text-ink">
        <CalendarRange className="w-5 h-5 shrink-0" />
        {t('The week-9 room-change window is open (12/10 – 25/10/2026). Requests without a partner are cancelled automatically when the window ends.')}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('Awaiting manager approval')} value={items.filter((r) => r.status === 'PROCESSING').length} icon={ShieldCheck} tone="purple" />
        <StatCard label={t('Not verified')} value={items.filter((r) => r.status === 'PROCESSING' && !r.verified).length} icon={AlertTriangle} tone="amber" />
        <StatCard label={t('Waiting for match / response')} value={items.filter((r) => r.status === 'PENDING' || r.status === 'STUDENT_RESPONSE').length} icon={Repeat} tone="blue" />
        <StatCard label={t('Completed in this window')} value={items.filter((r) => r.status === 'COMPLETED').length} icon={CheckCircle2} tone="emerald" />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-3">
          <Tabs<TabKey>
            items={[
              { value: 'processing', label: t('Awaiting manager approval'), count: items.filter((r) => r.status === 'PROCESSING').length },
              { value: 'waiting', label: t('Waiting for a match'), count: items.filter((r) => r.status === 'PENDING' || r.status === 'STUDENT_RESPONSE').length },
              { value: 'closed', label: t('Ended') },
            ]}
            value={tab}
            onChange={setTab}
          />
          <div className="relative">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('ID, name, student ID…')} className="pl-9 pr-3 py-2 text-xs rounded-lg border border-line w-full md:w-52" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {list.map((r) => (
            <div key={r.id} className="p-4 rounded-xl border border-line">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={clsx('text-label font-bold px-2 py-0.5 rounded flex items-center gap-1', r.kind === 'SWAP' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')}>
                  {r.kind === 'SWAP' ? <ArrowLeftRight className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}
                  {r.kind === 'SWAP' ? t('Swap') : t('Room changes')} · {r.id}
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
                <span className="text-ink-subtle">{t('Created')} {r.created}</span>
                {r.status === 'PROCESSING' && (r.verified ? (
                  <span className="font-semibold text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />{t('Verified')}</span>
                ) : (
                  <AppButton size="sm" variant="outline" onClick={() => verify(r.id)}>{t('Record as verified')}</AppButton>
                ))}
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="col-span-full py-10 text-center text-xs text-ink-subtle">{t('No requests.')}</div>}
        </div>
      </SectionCard>

      {toastNode}
    </div>
  );
}
