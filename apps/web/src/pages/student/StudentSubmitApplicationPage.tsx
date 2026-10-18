import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, Send, Clock, UserCog, Info, ArrowLeftRight, Repeat, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, AppButton, formatVnd, t } from '@shared-ui';
import { APP_ROUTES } from '@campusstay/constants';
import { assetsForRoom } from '@features/rooms/roomCatalog';
import { APPLICATION_TYPES, typeMeta, useStudentApplications, type ApplicationType } from '@features/applications/studentApplications';
import { APPLICATION_VISUAL } from '@features/applications/applicationVisuals';

/**
 * Gửi đơn — một nơi cho mọi loại đơn của sinh viên (giống mục Applications của FAP):
 * báo hỏng, đổi/hoán đổi phòng, hoàn tiền, gia hạn thanh toán, xác nhận cư trú, đơn khác.
 * Mỗi loại có form riêng và được chuyển tới đúng người xử lý (docs/BUSINESS_FLOWS.md F4–F6).
 */

const MY_ROOM = 'A204';
const MY_ASSETS = assetsForRoom(MY_ROOM, 'ROOM_4');

const OPEN_INVOICES = [
  { code: 'INV-2026-1012', label: t('Fall 2026 room fee — installment 2'), amount: 2600000, due: '24/10/2026' },
  { code: 'INV-2026-1019', label: t('Utilities, October 2026'), amount: 318000, due: '05/11/2026' },
];

const REFUND_KINDS = [t('Deposit refund on check-out'), t('Duplicate payment / overpayment'), t('Early contract termination')] as const;
const PURPOSES = [t('Policy bank student loan'), t('Temporary residence registration'), t('Scholarship application'), t('Other')] as const;

const input = 'w-full px-3 py-2.5 text-sm border border-line rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-brand';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold text-ink mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-label text-ink-subtle mt-1">{hint}</span>}
    </label>
  );
}

const isType = (v: string | null): v is ApplicationType => !!v && APPLICATION_TYPES.some((t) => t.type === v);

export function StudentSubmitApplicationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const submit = useStudentApplications((s) => s.submit);

  const [type, setType] = useState<ApplicationType>(isType(params.get('type')) ? (params.get('type') as ApplicationType) : 'MAINTENANCE');
  const [detail, setDetail] = useState('');
  const [title, setTitle] = useState('');

  const [assetId, setAssetId] = useState(MY_ASSETS[0]!.id);
  const [urgent, setUrgent] = useState(false);
  const [photos, setPhotos] = useState(0);

  const [swapMode, setSwapMode] = useState<'SWAP' | 'MOVE'>('SWAP');
  const [partnerId, setPartnerId] = useState('');

  const [refundKind, setRefundKind] = useState<(typeof REFUND_KINDS)[number]>(REFUND_KINDS[0]);
  const [amount, setAmount] = useState('');
  const [txRef, setTxRef] = useState('');

  const [invoice, setInvoice] = useState(OPEN_INVOICES[0]!.code);
  const [newDue, setNewDue] = useState('2026-10-31');

  const [purpose, setPurpose] = useState<(typeof PURPOSES)[number]>(PURPOSES[0]);
  const [copies, setCopies] = useState(1);

  // Bấm “Báo hỏng” ở trang Phòng của tôi → chọn sẵn đúng thiết bị
  useEffect(() => {
    const prefill = (location.state as { assetId?: string } | null)?.assetId;
    if (prefill && MY_ASSETS.some((a) => a.id === prefill)) {
      setType('MAINTENANCE');
      setAssetId(prefill);
    }
  }, [location.state]);

  const meta = typeMeta(type);
  const asset = MY_ASSETS.find((a) => a.id === assetId);
  const inv = OPEN_INVOICES.find((i) => i.code === invoice);
  const partnerValid = /^[A-Z]{2}\d{6}$/.test(partnerId);
  const canSubmit =
    detail.trim().length >= 5 &&
    (type !== 'MAINTENANCE' || title.trim()) &&
    (type !== 'OTHER' || title.trim()) &&
    (type !== 'ROOM_CHANGE' || swapMode === 'MOVE' || partnerValid) &&
    (type !== 'REFUND' || Number(amount) > 0);

  const build = (): { title: string; fields: Record<string, string> } => {
    switch (type) {
      case 'MAINTENANCE':
        return { title, fields: { [t('Equipment')]: asset ? `${asset.id} · ${asset.name}` : '—', [t('Severity')]: urgent ? t('Urgent') : t('Normal'), ...(photos ? { [t('Attached photos')]: t('{0} photos', { 0: photos }) } : {}) } };
      case 'ROOM_CHANGE':
        return swapMode === 'SWAP'
          ? { title: t('Room swap with {0}', { 0: partnerId }), fields: { [t('Partner')]: partnerId, [t('Current room')]: `${MY_ROOM}-G1` } }
          : { title: t('Room change — waiting for system matching'), fields: { [t('Type')]: t('No partner yet'), [t('Current room')]: `${MY_ROOM}-G1` } };
      case 'REFUND':
        return { title: t('Refund — {0}', { 0: refundKind }), fields: { [t('Refund type')]: refundKind, [t('Amount')]: formatVnd(Number(amount)), ...(txRef ? { [t('Transaction ID')]: txRef } : {}) } };
      case 'PAYMENT_EXTENSION':
        return { title: t('Extension request: {0}', { 0: inv?.label ?? invoice }), fields: { [t('Invoice')]: invoice, [t('Current due date')]: inv?.due ?? '—', [t('Requested due date')]: newDue.split('-').reverse().join('/') } };
      case 'RESIDENCE_CONFIRMATION':
        return { title: t('Residence confirmation — {0}', { 0: purpose }), fields: { [t('Purpose')]: purpose, [t('Copies')]: String(copies) } };
      default:
        return { title, fields: {} };
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const id = submit({ type, detail, ...build() });
    navigate(APP_ROUTES.STUDENT.APPLICATIONS, { state: { submittedId: id } });
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('Submit a request')} description={t('Choose a request type, fill in the details and submit — track progress in “My requests”')} />

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 items-start">
        <SectionCard title={t('1. Choose a request type')} noPadding>
          <ul className="p-3 space-y-1.5">
            {APPLICATION_TYPES.map((t) => {
              const v = APPLICATION_VISUAL[t.type];
              const active = t.type === type;
              return (
                <li key={t.type}>
                  <button
                    type="button"
                    onClick={() => setType(t.type)}
                    className={clsx('w-full flex items-start gap-3 p-3 rounded-xl border text-left transition', active ? v.ring : 'border-transparent hover:bg-surface-muted')}
                  >
                    <span className={clsx('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', v.tile)}>
                      <v.icon className="w-5 h-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold text-ink">{t.title}</span>
                      <span className="block text-label text-ink-muted leading-snug mt-0.5">{t.description}</span>
                    </span>
                    {active && <CheckCircle2 className="w-4 h-4 text-brand-ink shrink-0 mt-1" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <form onSubmit={onSubmit} className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-orange-50 via-white to-white border-b border-line flex flex-wrap items-center gap-4">
            {(() => {
              const v = APPLICATION_VISUAL[type];
              return (
                <span className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', v.tile)}>
                  <v.icon className="w-6 h-6" />
                </span>
              );
            })()}
            <div className="flex-1 min-w-0">
              <div className="text-label font-bold uppercase tracking-[0.12em] text-brand-ink">{t('2. Request details')}</div>
              <h2 className="text-lg font-extrabold text-ink">{meta.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-label">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-line text-ink-muted"><UserCog className="w-3.5 h-3.5 text-sky-500" />{meta.handler}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface border border-line text-ink-muted"><Clock className="w-3.5 h-3.5 text-amber-500" />{meta.sla}</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {type === 'MAINTENANCE' && (
              <>
                <Field label={t('Equipment to repair')} hint={t('Room {0} · the asset ID helps the technician identify the right equipment.', { 0: MY_ROOM })}>
                  <select value={assetId} onChange={(e) => setAssetId(e.target.value)} className={input}>
                    {MY_ASSETS.map((a) => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}
                  </select>
                </Field>
                <Field label={t('Title')}>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('E.g. Air conditioner leaking water')} className={input} />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  {[false, true].map((u) => (
                    <button key={String(u)} type="button" onClick={() => setUrgent(u)} className={clsx('p-3 rounded-xl border text-left', urgent === u ? (u ? 'border-rose-300 bg-rose-50' : 'border-orange-300 bg-orange-50') : 'border-line')}>
                      <div className={clsx('text-sm font-bold', u ? 'text-rose-700' : 'text-ink')}>{u ? t('Urgent') : t('Normal')}</div>
                      <div className="text-label text-ink-muted">{u ? t('Power outage, water leak, short circuit — handled within 2 hours') : t('Handled within 24 – 72 hours')}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink mb-1.5">{t('Photos of the condition (up to 4)')}</span>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: photos }).map((_, i) => <div key={i} className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-label text-ink-muted">IMG_{i + 1}</div>)}
                    {photos < 4 && (
                      <button type="button" onClick={() => setPhotos((p) => p + 1)} className="w-16 h-16 rounded-xl border-2 border-dashed border-line-strong flex items-center justify-center text-ink-subtle hover:border-brand hover:text-brand-ink" aria-label={t('Add photo')}>
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}

            {type === 'ROOM_CHANGE' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button type="button" onClick={() => setSwapMode('SWAP')} className={clsx('p-3 rounded-xl border text-left', swapMode === 'SWAP' ? 'border-sky-300 bg-sky-50' : 'border-line')}>
                    <div className="text-sm font-bold text-ink flex items-center gap-1.5"><ArrowLeftRight className="w-4 h-4 text-sky-600" />{t('Swap with a specific student')}</div>
                    <div className="text-label text-ink-muted mt-0.5">{t('Enter their student ID; they must accept the invitation')}</div>
                  </button>
                  <button type="button" onClick={() => setSwapMode('MOVE')} className={clsx('p-3 rounded-xl border text-left', swapMode === 'MOVE' ? 'border-sky-300 bg-sky-50' : 'border-line')}>
                    <div className="text-sm font-bold text-ink flex items-center gap-1.5"><Repeat className="w-4 h-4 text-sky-600" />{t('No partner yet')}</div>
                    <div className="text-label text-ink-muted mt-0.5">{t('The request waits for a match until the room-change window ends')}</div>
                  </button>
                </div>
                {swapMode === 'SWAP' && (
                  <Field label={t('Partner\'s student ID')} hint={t('Same gender, same stay term and currently living in the dormitory.')}>
                    <input value={partnerId} onChange={(e) => setPartnerId(e.target.value.toUpperCase())} placeholder="VD: SE172211" className={clsx(input, partnerId && !partnerValid && 'border-rose-300')} />
                  </Field>
                )}
              </>
            )}

            {type === 'REFUND' && (
              <>
                <Field label={t('Refund type')}>
                  <select value={refundKind} onChange={(e) => setRefundKind(e.target.value as (typeof REFUND_KINDS)[number])} className={input}>
                    {REFUND_KINDS.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label={t('Requested amount (₫)')} hint={Number(amount) > 0 ? formatVnd(Number(amount)) : undefined}>
                    <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="VD: 500000" className={input} />
                  </Field>
                  <Field label={t('VietQR transaction ID (if any)')}>
                    <input value={txRef} onChange={(e) => setTxRef(e.target.value.toUpperCase())} placeholder="VD: FT26288123456" className={input} />
                  </Field>
                </div>
                <p className="flex items-start gap-2 text-label text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <Info className="w-4 h-4 shrink-0" />{t('The money is refunded to the account used for the VietQR payment after staff check the check-out report.')}
                </p>
              </>
            )}

            {type === 'PAYMENT_EXTENSION' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t('Invoice to extend')} hint={inv ? t('{0} · current due date {1}', { 0: formatVnd(inv.amount), 1: inv.due }) : undefined}>
                  <select value={invoice} onChange={(e) => setInvoice(e.target.value)} className={input}>
                    {OPEN_INVOICES.map((i) => <option key={i.code} value={i.code}>{i.code} — {i.label}</option>)}
                  </select>
                </Field>
                <Field label={t('Requested due date')} hint={t('At most 14 days after the current due date.')}>
                  <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} className={input} />
                </Field>
              </div>
            )}

            {type === 'RESIDENCE_CONFIRMATION' && (
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
                <Field label={t('Purpose of use')}>
                  <select value={purpose} onChange={(e) => setPurpose(e.target.value as (typeof PURPOSES)[number])} className={input}>
                    {PURPOSES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label={t('Copies')}>
                  <input type="number" min={1} max={5} value={copies} onChange={(e) => setCopies(Math.max(1, Math.min(5, Number(e.target.value) || 1)))} className={input} />
                </Field>
              </div>
            )}

            {type === 'OTHER' && (
              <Field label={t('Title')}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('Summary of your request')} className={input} />
              </Field>
            )}

            <Field label={type === 'MAINTENANCE' ? t('Detailed description') : t('Reason / content')} hint={t('At least 5 characters.')}>
              <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} placeholder={t('Keep it short and clear…')} className={input} />
            </Field>
          </div>

          <div className="px-6 py-4 border-t border-line bg-surface-muted flex flex-wrap items-center gap-3">
            <span className="text-label text-ink-muted flex-1 min-w-[200px]">{t('After submitting, you\'ll get a bell notification whenever the request changes status.')}</span>
            <AppButton type="button" variant="outline" onClick={() => navigate(APP_ROUTES.STUDENT.APPLICATIONS)}>{t('View submitted requests')}</AppButton>
            <AppButton type="submit" disabled={!canSubmit} leftIcon={<Send className="w-4 h-4" />}>{t('Submit a request')}</AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
