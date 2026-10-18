import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, PenLine, Wrench, Mail, Check } from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { assetsForRoom, roomTypeById } from '@features/rooms/roomCatalog';
import { RoomTypeIllustration } from '@features/rooms/RoomTypeIllustration';
import { SectionCard, StatusBadge, AppButton, Avatar, Modal, ProgressBar, maskPhone, useToast, t } from '@shared-ui';

/**
 * Phòng của tôi — View Room Assignment, bạn cùng phòng, tài sản trong phòng (có mã ID để báo hỏng)
 * và hợp đồng lưu trú số.
 */

const ROOM = {
  code: 'A204',
  bed: 'G1',
  building: t('Building A'),
  floor: 2,
  typeId: 'ROOM_4' as const,
  term: 'Fall 2026',
  period: '01/09/2026 – 31/12/2026',
  daysStayed: 47,
  daysTotal: 122,
  contract: 'HD-KTX-0789',
};

const NEXT_CONTRACT = 'HD-KTX-1102';

/** Tình trạng tài sản — đồng bộ từ các yêu cầu bảo trì */
const ASSET_STATUS: Record<string, { label: string; tone: 'ok' | 'repair' }> = {
  'A204-DH-01': { label: t('In repair · TK-10482'), tone: 'repair' },
};

const ROOMMATES = [
  { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', major: t('Software Engineering'), bed: 'G1', phone: '0901234567', isMe: true },
  { name: 'Võ Thị Bảo Ngọc', id: 'SE172211', major: t('Software Engineering'), bed: 'G2', phone: '0912456789', isMe: false },
  { name: 'Phạm Ngọc Hân', id: 'SS170789', major: 'Digital Marketing', bed: 'G3', phone: '0987112233', isMe: false },
  { name: 'Trần Khánh Linh', id: 'SE180321', major: t('Artificial Intelligence'), bed: 'G4', phone: '0938777654', isMe: false },
];

const STAY = [
  { term: 'Summer 2026', semester: 4, status: 'CHECKED_OUT', room: 'A204-G1' },
  { term: 'Fall 2026', semester: 5, status: 'CHECKED_IN', room: 'A204-G1' },
  { term: 'Spring 2027', semester: 6, status: 'ASSIGNED', room: 'A204-G1' },
  { term: 'Summer 2027', semester: 7, status: 'PROCESSING', room: t('Awaiting allocation') },
];

export function StudentMyRoomPage() {
  const navigate = useNavigate();
  const { show, toastNode } = useToast();
  const [signOpen, setSignOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [signed, setSigned] = useState(false);

  const type = roomTypeById(ROOM.typeId);
  const assets = assetsForRoom(ROOM.code, ROOM.typeId);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Thẻ phòng */}
      <div className="bg-surface rounded-2xl border border-line overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <RoomTypeIllustration type={ROOM.typeId} className="w-full h-full min-h-[180px] bg-surface-muted" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm text-ink-muted">{t('My room ·')} {ROOM.term}</div>
              <div className="flex items-baseline gap-3 mt-1">
                <h1 className="text-4xl font-bold text-ink tracking-tight">{ROOM.code}</h1>
                <span className="text-lg font-semibold text-ink-muted">{t('Bed')} {ROOM.bed}</span>
              </div>
              <div className="text-sm text-ink-muted mt-1">{ROOM.building} {t('· Floor')} {ROOM.floor} · {type.name}</div>
            </div>
            <StatusBadge status="CHECKED_IN" customLabel={t('Occupied')} />
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs text-ink-muted mb-1.5">
              <span>{ROOM.period}</span>
              <span>{ROOM.daysStayed}/{ROOM.daysTotal} {t('days')}</span>
            </div>
            <ProgressBar value={ROOM.daysStayed} max={ROOM.daysTotal} tone="navy" size="md" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div><div className="text-xs text-ink-muted">{t('Contract')}</div><div className="font-semibold text-ink">{ROOM.contract}</div></div>
            <div><div className="text-xs text-ink-muted">{t('Members')}</div><div className="font-semibold text-ink">{ROOMMATES.length}/{type.capacity} {t('people')}</div></div>
            <div><div className="text-xs text-ink-muted">{t('Term fee')}</div><div className="font-semibold text-ink">{type.pricePerTerm.toLocaleString('vi-VN')} ₫</div></div>
          </div>
        </div>
      </div>

      {/* Việc cần làm cho kỳ tiếp theo */}
      {!signed && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-brand to-brand text-white shadow-lg shadow-orange-500/20">
          <div className="flex-1">
            <div className="text-sm font-semibold">{t('Room assigned for Spring 2027:')} {ROOM.code} {t('· Bed')} {ROOM.bed}</div>
            <div className="text-xs text-white/85">{t('Sign contract')} {NEXT_CONTRACT} {t('before check-in (02/01 – 05/01/2027).')}</div>
          </div>
          <AppButton variant="outline" leftIcon={<PenLine className="w-4 h-4" />} onClick={() => setSignOpen(true)}>{t('Sign contract')}</AppButton>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tài sản */}
        <SectionCard className="lg:col-span-2" title={t('Room assets')} subtitle={t('Each item has its own ID — use it when reporting a fault')} noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-ink-muted bg-surface-muted">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">{t('Asset ID')}</th>
                  <th className="text-left font-medium px-5 py-2.5">{t('Equipment')}</th>
                  <th className="text-left font-medium px-5 py-2.5">{t('Condition')}</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {assets.map((a) => {
                  const st = ASSET_STATUS[a.id];
                  return (
                    <tr key={a.id}>
                      <td className="px-5 py-2.5 whitespace-nowrap"><code className="text-xs text-ink-muted">{a.id}</code></td>
                      <td className="px-5 py-2.5 text-ink">{a.name}</td>
                      <td className="px-5 py-2.5">
                        <span className={clsx('text-xs font-medium', st?.tone === 'repair' ? 'text-amber-600' : 'text-ink-muted')}>{st?.label ?? t('Normal')}</span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(APP_ROUTES.STUDENT.APPLICATION_NEW, { state: { assetId: a.id, assetName: a.name } })}
                          className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-ink-muted hover:text-brand-ink"
                        >
                          <Wrench className="w-3.5 h-3.5" /> {t('Report a fault')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-6">
          {/* Bạn cùng phòng */}
          <SectionCard title={t('Roommates')} noPadding>
            <ul className="divide-y divide-line">
              {ROOMMATES.map((m) => (
                <li key={m.id} className="px-5 py-3 flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">{m.name}{m.isMe && <span className="text-ink-subtle font-normal"> {t('(you)')}</span>}</div>
                    <div className="text-xs text-ink-muted truncate">{m.major}{!m.isMe && ` · ${maskPhone(m.phone)}`}</div>
                  </div>
                  <span className="text-xs font-semibold text-ink-muted">{m.bed}</span>
                  {!m.isMe && (
                    <a href={`mailto:${m.id.toLowerCase()}@fpt.edu.vn`} aria-label={t('Email {0}', { 0: m.name })} className="text-ink-subtle hover:text-ink">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Lịch lưu trú */}
          <SectionCard title={t('Stay schedule')}>
            <ol className="space-y-3">
              {STAY.map((s) => (
                <li key={s.term} className="flex items-center gap-3">
                  <span className={clsx('w-2 h-2 rounded-full shrink-0', s.status === 'CHECKED_IN' ? 'bg-brand-fill' : 'bg-slate-300')} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink">{s.term} <span className="text-xs font-normal text-ink-subtle">{t('· Term')} {s.semester}</span></div>
                    <div className="text-xs text-ink-muted">{s.room}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ol>
          </SectionCard>

          {/* Hợp đồng */}
          <SectionCard title={t('Contract')} noPadding>
            <ul className="divide-y divide-line">
              {[
                { code: NEXT_CONTRACT, term: 'Spring 2027', status: signed ? 'SIGNED' : 'DRAFT' },
                { code: ROOM.contract, term: 'Fall 2026', status: 'ACTIVE' },
              ].map((c) => (
                <li key={c.code} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-ink">{c.code}</div>
                    <div className="text-xs text-ink-muted">{c.term}</div>
                  </div>
                  <StatusBadge status={c.status} customLabel={c.status === 'DRAFT' ? t('Awaiting signature') : undefined} />
                  <button type="button" aria-label={t('Download {0}', { 0: c.code })} onClick={() => show(t('Downloading {0}.pdf', { 0: c.code }))} className="text-ink-subtle hover:text-ink">
                    <Download className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <Modal
        open={signOpen}
        onClose={() => setSignOpen(false)}
        size="sm"
        title={t('Sign contract {0}', { 0: NEXT_CONTRACT })}
        subtitle={t('An OTP code has been sent to your student email')}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setSignOpen(false)}>{t('Cancel')}</AppButton>
            <AppButton
              disabled={otp.length !== 6}
              leftIcon={<Check className="w-4 h-4" />}
              onClick={() => { setSigned(true); setSignOpen(false); setOtp(''); show(t('Electronic contract signed')); }}
            >
              {t('Confirm signature')}
            </AppButton>
          </>
        }
      >
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          aria-label={t('OTP code')}
          placeholder="••••••"
          className="w-full px-3 py-3 text-center text-xl tracking-[0.6em] font-bold border border-line rounded-lg"
        />
        <p className="text-xs text-ink-muted mt-3">{t('Electronic signatures are legally valid under the 2023 Law on Electronic Transactions.')}</p>
      </Modal>
      {toastNode}
    </div>
  );
}
