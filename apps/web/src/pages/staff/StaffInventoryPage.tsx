import { useState } from 'react';
import {
  Building2,
  BedDouble,
  Wrench,
  Lock,
  Search,
  Download,
  Upload,
  Users,
  Wind,
  Sun,
  CheckCircle2,
  AlertTriangle,
  Package,
  Plus,
} from 'lucide-react';
import clsx from 'clsx';
import {
  PageHeader,
  StatCard,
  SectionCard,
  StatusBadge,
  AppButton,
  Modal,
  Tabs,
  Avatar,
  ProgressBar,
  useToast, t } from '@shared-ui';

type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'LOCKED';

interface InvRoom {
  id: string;
  building: string;
  floor: number;
  number: string;
  type: string;
  capacity: number;
  occupants: string[];
  status: RoomStatus;
  hasAc: boolean;
  lastInspection: string;
  assetIssues: number;
}

const FIRST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Huỳnh'];
const MIDDLE = ['Minh', 'Thị', 'Văn', 'Gia', 'Ngọc', 'Hoàng', 'Thanh', 'Khánh'];
const LAST = ['Anh', 'Bảo', 'Châu', 'Dung', 'Huy', 'Khoa', 'Linh', 'Nam', 'Phúc', 'Quân', 'Trang', 'Vy'];

function buildRooms(): InvRoom[] {
  const rooms: InvRoom[] = [];
  ['A', 'B', 'C', 'D'].forEach((b, bi) => {
    for (let f = 1; f <= 5; f++) {
      for (let n = 1; n <= 8; n++) {
        const seed = (bi * 37 + f * 11 + n * 7) % 23;
        const capacity = b === 'D' && n % 2 === 0 ? 2 : b === 'B' && n > 5 ? 6 : 4;
        const status: RoomStatus = seed === 22 ? 'MAINTENANCE' : seed === 21 ? 'LOCKED' : seed % (capacity + 2) >= capacity ? 'OCCUPIED' : 'AVAILABLE';
        const occCount = status === 'OCCUPIED' ? capacity : status === 'AVAILABLE' ? seed % capacity : 0;
        rooms.push({
          id: `${b}${f}${n}`,
          building: b,
          floor: f,
          number: `${b}${f}${String(n).padStart(2, '0')}`,
          type: capacity === 2 ? t('2-bed VIP') : capacity === 6 ? t('6-bed standard') : t('4-bed air-conditioned'),
          capacity,
          occupants: Array.from({ length: occCount }).map(
            (_, i) => `${FIRST[(seed + i) % FIRST.length]} ${MIDDLE[(seed + i * 3) % MIDDLE.length]} ${LAST[(seed * 2 + i) % LAST.length]}`
          ),
          status,
          hasAc: capacity !== 6,
          lastInspection: `${String(((seed + n) % 28) + 1).padStart(2, '0')}/09/2026`,
          assetIssues: seed % 7 === 0 ? 1 + (seed % 3) : 0,
        });
      }
    }
  });
  return rooms;
}

const ASSETS = [
  { name: t('Steel bunk bed'), qty: 4, ok: 4 },
  { name: t('1.2 m rubber mattress'), qty: 4, ok: 4 },
  { name: t('Desk + chair'), qty: 4, ok: 3 },
  { name: t('Lockable wardrobe'), qty: 4, ok: 4 },
  { name: t('Panasonic 1.5HP air conditioner'), qty: 1, ok: 1 },
  { name: t('Ariston 30L water heater'), qty: 1, ok: 1 },
  { name: t('LED tube light'), qty: 4, ok: 3 },
];

export function StaffInventoryPage() {
  const { show, toastNode } = useToast();
  const [rooms, setRooms] = useState<InvRoom[]>(buildRooms);
  const [building, setBuilding] = useState('ALL');
  const [status, setStatus] = useState<'ALL' | RoomStatus>('ALL');
  const [floor, setFloor] = useState('ALL');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<InvRoom | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const filtered = rooms.filter((r) => {
    if (building !== 'ALL' && r.building !== building) return false;
    if (status !== 'ALL' && r.status !== status) return false;
    if (floor !== 'ALL' && r.floor !== Number(floor)) return false;
    if (query && !`${r.number} ${r.occupants.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalBeds = rooms.reduce((s, r) => s + r.capacity, 0);
  const usedBeds = rooms.reduce((s, r) => s + r.occupants.length, 0);
  const count = (s: RoomStatus) => rooms.filter((r) => r.status === s).length;

  const toggleSelect = (id: string) => setSelected((all) => (all.includes(id) ? all.filter((x) => x !== id) : [...all, id]));
  const allVisibleSelected = visible.length > 0 && visible.every((r) => selected.includes(r.id));

  const bulkSet = (s: RoomStatus) => {
    setRooms((all) => all.map((r) => (selected.includes(r.id) ? { ...r, status: s, occupants: s === 'MAINTENANCE' || s === 'LOCKED' ? [] : r.occupants } : r)));
    show(t('Updated {0} rooms to "{1}"', { 0: selected.length, 1: s === 'MAINTENANCE' ? t('Maintenance') : s === 'LOCKED' ? t('Locked') : t('Available') }));
    setSelected([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('Room inventory')}
        description={t('Track the status of rooms, beds, occupants and assets across the 4 dormitory buildings')}
        actions={
          <>
            <AppButton size="sm" variant="outline" leftIcon={<Upload className="w-4 h-4" />} onClick={() => show(t('Open the Excel import dialog'), 'info')}>
              {t('Import Excel')}
            </AppButton>
            <AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show(t('Exported {0} rooms to Excel', { 0: filtered.length }))}>
              {t('Export Excel')}
            </AppButton>
            <AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => show(t('Open the new room form'), 'info')}>
              {t('Add room')}
            </AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard label={t('Total rooms')} value={rooms.length} icon={Building2} tone="navy" />
        <StatCard label={t('Beds in use')} value={`${usedBeds}/${totalBeds}`} icon={BedDouble} tone="orange" hint={`${((usedBeds / totalBeds) * 100).toFixed(1)}%`} />
        <StatCard label={t('Rooms with space')} value={count('AVAILABLE')} icon={CheckCircle2} tone="emerald" />
        <StatCard label={t('Under maintenance')} value={count('MAINTENANCE')} icon={Wrench} tone="amber" />
        <StatCard label={t('Locked')} value={count('LOCKED')} icon={Lock} tone="rose" />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-line space-y-3">
          <Tabs
            items={[
              { value: 'ALL' as const, label: t('All'), count: rooms.length },
              { value: 'AVAILABLE' as const, label: t('Available'), count: count('AVAILABLE') },
              { value: 'OCCUPIED' as const, label: t('Full'), count: count('OCCUPIED') },
              { value: 'MAINTENANCE' as const, label: t('Maintenance'), count: count('MAINTENANCE') },
              { value: 'LOCKED' as const, label: t('Locked'), count: count('LOCKED') },
            ]}
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={t('Search by room number or student name...')}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line"
              />
            </div>
            <select aria-label={t('Building')} value={building} onChange={(e) => { setBuilding(e.target.value); setPage(1); }} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
              <option value="ALL">{t('All buildings')}</option>
              {['A', 'B', 'C', 'D'].map((b) => (
                <option key={b} value={b}>{t('Building')} {b}</option>
              ))}
            </select>
            <select aria-label={t('Floor')} value={floor} onChange={(e) => { setFloor(e.target.value); setPage(1); }} className="px-3 py-2 text-xs rounded-lg border border-line bg-surface">
              <option value="ALL">{t('All floors')}</option>
              {[1, 2, 3, 4, 5].map((f) => (
                <option key={f} value={f}>{t('Floor')} {f}</option>
              ))}
            </select>
          </div>
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-surface-sunken text-xs">
              <span className="font-semibold text-ink">{t('Selected')} {selected.length} {t('rooms')}</span>
              <span className="flex-1" />
              <AppButton size="sm" variant="outline" onClick={() => bulkSet('AVAILABLE')}>{t('Reopen')}</AppButton>
              <AppButton size="sm" variant="outline" leftIcon={<Wrench className="w-3.5 h-3.5" />} onClick={() => bulkSet('MAINTENANCE')}>{t('Set to maintenance')}</AppButton>
              <AppButton size="sm" variant="danger" leftIcon={<Lock className="w-3.5 h-3.5" />} onClick={() => bulkSet('LOCKED')}>{t('Lock room')}</AppButton>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-surface-muted text-ink-muted">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input
                    type="checkbox"
                    aria-label={t('Select all rooms on this page')}
                    checked={allVisibleSelected}
                    onChange={() =>
                      setSelected((all) => (allVisibleSelected ? all.filter((id) => !visible.some((r) => r.id === id)) : [...new Set([...all, ...visible.map((r) => r.id)])]))
                    }
                    className="accent-brand-ink"
                  />
                </th>
                <th className="text-left font-semibold px-4 py-3">{t('Room')}</th>
                <th className="text-left font-semibold px-4 py-3">{t('Type')}</th>
                <th className="text-left font-semibold px-4 py-3">{t('Occupancy')}</th>
                <th className="text-left font-semibold px-4 py-3">{t('Occupants')}</th>
                <th className="text-left font-semibold px-4 py-3">{t('Last inspection')}</th>
                <th className="text-left font-semibold px-4 py-3">{t('Status')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((r) => (
                <tr key={r.id} className={clsx('hover:bg-surface-muted', selected.includes(r.id) && 'bg-orange-50/40')}>
                  <td className="px-4 py-3">
                    <input type="checkbox" aria-label={t('Select room {0}', { 0: r.id })} checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className="accent-brand-ink" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-ink">{r.number}</div>
                    <div className="text-label text-ink-subtle">{t('Building')} {r.building} {t('• Floor')} {r.floor}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-ink-muted">
                      {r.hasAc ? <Wind className="w-3.5 h-3.5 text-blue-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                      {r.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-36">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={r.occupants.length} max={r.capacity} tone={r.occupants.length === r.capacity ? 'navy' : 'emerald'} />
                      <span className="font-semibold text-ink whitespace-nowrap">{r.occupants.length}/{r.capacity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-2">
                      {r.occupants.slice(0, 4).map((o) => (
                        <Avatar key={o} name={o} size="xs" className="ring-2 ring-white" />
                      ))}
                      {r.occupants.length === 0 && <span className="text-ink-subtle">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    <div className="flex items-center gap-1.5">
                      {r.lastInspection}
                      {r.assetIssues > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                          <AlertTriangle className="w-3 h-3" /> {r.assetIssues}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => setDetail(r)} className="text-brand-ink font-semibold hover:underline">
                      {t('Details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-line flex items-center justify-between text-xs text-ink-muted">
          <span>
            {t('Showing')} {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length} {t('rooms')}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2.5 py-1 rounded-md border border-line disabled:opacity-40">
              ‹
            </button>
            {Array.from({ length: pages }).slice(0, 7).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={clsx('px-2.5 py-1 rounded-md border', page === i + 1 ? 'bg-brand-fill text-white border-brand' : 'border-line')}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" disabled={page === pages} onClick={() => setPage(page + 1)} className="px-2.5 py-1 rounded-md border border-line disabled:opacity-40">
              ›
            </button>
          </div>
        </div>
      </SectionCard>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        size="lg"
        title={detail ? t('Room {0}', { 0: detail.number }) : ''}
        subtitle={detail ? t('Building {0} • Floor {1} • {2}', { 0: detail.building, 1: detail.floor, 2: detail.type }) : ''}
        footer={
          <>
            <AppButton variant="outline" leftIcon={<Wrench className="w-4 h-4" />} onClick={() => { show(t('Maintenance request created for {0}', { 0: detail?.number })); setDetail(null); }}>
              {t('Create maintenance request')}
            </AppButton>
            <AppButton onClick={() => setDetail(null)}>{t('Close')}</AppButton>
          </>
        }
      >
        {detail && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Status')}</div><div className="mt-1"><StatusBadge status={detail.status} /></div></div>
              <div className="p-3 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Capacity')}</div><div className="font-bold mt-1">{detail.capacity} {t('beds')}</div></div>
              <div className="p-3 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Occupied')}</div><div className="font-bold mt-1">{detail.occupants.length} SV</div></div>
              <div className="p-3 rounded-lg bg-surface-muted"><div className="text-ink-subtle">{t('Inspect')}</div><div className="font-bold mt-1">{detail.lastInspection}</div></div>
            </div>
            <div>
              <div className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5"><Users className="w-4 h-4" /> {t('Beds')}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: detail.capacity }).map((_, i) => {
                  const o = detail.occupants[i];
                  return (
                    <div key={i} className={clsx('p-3 rounded-lg border flex items-center gap-3 text-xs', o ? 'border-line' : 'border-dashed border-emerald-300 bg-emerald-50/40')}>
                      <span className="font-bold text-ink w-6">G{i + 1}</span>
                      {o ? (
                        <>
                          <Avatar name={o} size="xs" />
                          <span className="font-semibold text-ink">{o}</span>
                        </>
                      ) : (
                        <span className="text-emerald-700 font-semibold">{t('Free beds')}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-ink mb-2 flex items-center gap-1.5"><Package className="w-4 h-4" /> {t('Room assets')}</div>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-line">
                  {ASSETS.map((a) => (
                    <tr key={a.name}>
                      <td className="py-2 text-ink">{a.name}</td>
                      <td className="py-2 text-right text-ink-muted">{a.ok}/{a.qty}</td>
                      <td className="py-2 text-right w-28">
                        {a.ok === a.qty ? (
                          <span className="text-emerald-600 font-semibold">{t('Good')}</span>
                        ) : (
                          <span className="text-amber-600 font-semibold">{a.qty - a.ok} {t('damaged')}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
