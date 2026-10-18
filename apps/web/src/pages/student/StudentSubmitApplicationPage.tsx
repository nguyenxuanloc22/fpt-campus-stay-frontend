import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, Send, Clock, UserCog, Info, ArrowLeftRight, Repeat, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, AppButton, formatVnd } from '@shared-ui';
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
  { code: 'INV-2026-1012', label: 'Phí phòng Fall 2026 — đợt 2', amount: 2600000, due: '24/10/2026' },
  { code: 'INV-2026-1019', label: 'Điện nước tháng 10/2026', amount: 318000, due: '05/11/2026' },
];

const REFUND_KINDS = ['Hoàn cọc khi trả phòng', 'Thanh toán trùng / chuyển dư', 'Chấm dứt hợp đồng sớm'] as const;
const PURPOSES = ['Vay vốn ngân hàng chính sách', 'Đăng ký tạm trú', 'Hồ sơ học bổng', 'Khác'] as const;

const input = 'w-full px-3 py-2.5 text-sm border border-line rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-brand';

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
        return { title, fields: { 'Thiết bị': asset ? `${asset.id} · ${asset.name}` : '—', 'Mức độ': urgent ? 'Khẩn cấp' : 'Bình thường', ...(photos ? { 'Ảnh đính kèm': `${photos} ảnh` } : {}) } };
      case 'ROOM_CHANGE':
        return swapMode === 'SWAP'
          ? { title: `Hoán đổi phòng với ${partnerId}`, fields: { 'Đối tác': partnerId, 'Phòng hiện tại': `${MY_ROOM}-G1` } }
          : { title: 'Đổi phòng — chờ hệ thống ghép', fields: { 'Hình thức': 'Chưa có đối tác', 'Phòng hiện tại': `${MY_ROOM}-G1` } };
      case 'REFUND':
        return { title: `Hoàn tiền — ${refundKind}`, fields: { 'Loại hoàn tiền': refundKind, 'Số tiền': formatVnd(Number(amount)), ...(txRef ? { 'Mã giao dịch': txRef } : {}) } };
      case 'PAYMENT_EXTENSION':
        return { title: `Xin gia hạn ${inv?.label ?? invoice}`, fields: { 'Hóa đơn': invoice, 'Hạn hiện tại': inv?.due ?? '—', 'Hạn mong muốn': newDue.split('-').reverse().join('/') } };
      case 'RESIDENCE_CONFIRMATION':
        return { title: `Xác nhận cư trú — ${purpose}`, fields: { 'Mục đích': purpose, 'Số bản': String(copies) } };
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
      <PageHeader title="Gửi đơn" description="Chọn loại đơn, điền thông tin và gửi — theo dõi tiến độ tại mục “Đơn của tôi”" />

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 items-start">
        <SectionCard title="1. Chọn loại đơn" noPadding>
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

        <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-line shadow-sm overflow-hidden">
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
              <div className="text-label font-bold uppercase tracking-[0.12em] text-brand-ink">2. Nội dung đơn</div>
              <h2 className="text-lg font-extrabold text-ink">{meta.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-label">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-line text-ink-muted"><UserCog className="w-3.5 h-3.5 text-sky-500" />{meta.handler}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-line text-ink-muted"><Clock className="w-3.5 h-3.5 text-amber-500" />{meta.sla}</span>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {type === 'MAINTENANCE' && (
              <>
                <Field label="Thiết bị cần sửa" hint={`Phòng ${MY_ROOM} · mã tài sản giúp kỹ thuật viên xác định đúng thiết bị.`}>
                  <select value={assetId} onChange={(e) => setAssetId(e.target.value)} className={input}>
                    {MY_ASSETS.map((a) => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}
                  </select>
                </Field>
                <Field label="Tiêu đề">
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Máy lạnh chảy nước" className={input} />
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  {[false, true].map((u) => (
                    <button key={String(u)} type="button" onClick={() => setUrgent(u)} className={clsx('p-3 rounded-xl border text-left', urgent === u ? (u ? 'border-rose-300 bg-rose-50' : 'border-orange-300 bg-orange-50') : 'border-line')}>
                      <div className={clsx('text-sm font-bold', u ? 'text-rose-700' : 'text-ink')}>{u ? 'Khẩn cấp' : 'Bình thường'}</div>
                      <div className="text-label text-ink-muted">{u ? 'Mất điện, rò nước, chập cháy — xử lý trong 2 giờ' : 'Xử lý trong 24 – 72 giờ'}</div>
                    </button>
                  ))}
                </div>
                <div>
                  <span className="block text-xs font-bold text-ink mb-1.5">Ảnh hiện trạng (tối đa 4)</span>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: photos }).map((_, i) => <div key={i} className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-label text-ink-muted">IMG_{i + 1}</div>)}
                    {photos < 4 && (
                      <button type="button" onClick={() => setPhotos((p) => p + 1)} className="w-16 h-16 rounded-xl border-2 border-dashed border-line-strong flex items-center justify-center text-ink-subtle hover:border-brand hover:text-brand-ink" aria-label="Thêm ảnh">
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
                    <div className="text-sm font-bold text-ink flex items-center gap-1.5"><ArrowLeftRight className="w-4 h-4 text-sky-600" />Hoán đổi với bạn cụ thể</div>
                    <div className="text-label text-ink-muted mt-0.5">Nhập MSSV, bạn ấy cần chấp nhận lời mời</div>
                  </button>
                  <button type="button" onClick={() => setSwapMode('MOVE')} className={clsx('p-3 rounded-xl border text-left', swapMode === 'MOVE' ? 'border-sky-300 bg-sky-50' : 'border-line')}>
                    <div className="text-sm font-bold text-ink flex items-center gap-1.5"><Repeat className="w-4 h-4 text-sky-600" />Chưa có đối tác</div>
                    <div className="text-label text-ink-muted mt-0.5">Đơn được treo chờ ghép đến hết đợt đổi phòng</div>
                  </button>
                </div>
                {swapMode === 'SWAP' && (
                  <Field label="MSSV đối tác" hint="Cùng giới tính, cùng kỳ lưu trú và đang ở KTX.">
                    <input value={partnerId} onChange={(e) => setPartnerId(e.target.value.toUpperCase())} placeholder="VD: SE172211" className={clsx(input, partnerId && !partnerValid && 'border-rose-300')} />
                  </Field>
                )}
              </>
            )}

            {type === 'REFUND' && (
              <>
                <Field label="Loại hoàn tiền">
                  <select value={refundKind} onChange={(e) => setRefundKind(e.target.value as (typeof REFUND_KINDS)[number])} className={input}>
                    {REFUND_KINDS.map((k) => <option key={k}>{k}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Số tiền đề nghị (₫)" hint={Number(amount) > 0 ? formatVnd(Number(amount)) : undefined}>
                    <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="VD: 500000" className={input} />
                  </Field>
                  <Field label="Mã giao dịch VietQR (nếu có)">
                    <input value={txRef} onChange={(e) => setTxRef(e.target.value.toUpperCase())} placeholder="VD: FT26288123456" className={input} />
                  </Field>
                </div>
                <p className="flex items-start gap-2 text-label text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  <Info className="w-4 h-4 shrink-0" />Tiền được hoàn về tài khoản đã dùng để thanh toán VietQR, sau khi cán bộ đối chiếu biên bản trả phòng.
                </p>
              </>
            )}

            {type === 'PAYMENT_EXTENSION' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Hóa đơn cần gia hạn" hint={inv ? `${formatVnd(inv.amount)} · hạn hiện tại ${inv.due}` : undefined}>
                  <select value={invoice} onChange={(e) => setInvoice(e.target.value)} className={input}>
                    {OPEN_INVOICES.map((i) => <option key={i.code} value={i.code}>{i.code} — {i.label}</option>)}
                  </select>
                </Field>
                <Field label="Hạn mong muốn" hint="Tối đa 14 ngày so với hạn hiện tại.">
                  <input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} className={input} />
                </Field>
              </div>
            )}

            {type === 'RESIDENCE_CONFIRMATION' && (
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
                <Field label="Mục đích sử dụng">
                  <select value={purpose} onChange={(e) => setPurpose(e.target.value as (typeof PURPOSES)[number])} className={input}>
                    {PURPOSES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Số bản">
                  <input type="number" min={1} max={5} value={copies} onChange={(e) => setCopies(Math.max(1, Math.min(5, Number(e.target.value) || 1)))} className={input} />
                </Field>
              </div>
            )}

            {type === 'OTHER' && (
              <Field label="Tiêu đề">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tóm tắt nội dung đề nghị" className={input} />
              </Field>
            )}

            <Field label={type === 'MAINTENANCE' ? 'Mô tả chi tiết' : 'Lý do / nội dung'} hint="Tối thiểu 5 ký tự.">
              <textarea value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} placeholder="Trình bày ngắn gọn, rõ ràng…" className={input} />
            </Field>
          </div>

          <div className="px-6 py-4 border-t border-line bg-surface-muted flex flex-wrap items-center gap-3">
            <span className="text-label text-ink-muted flex-1 min-w-[200px]">Sau khi gửi, bạn nhận thông báo ở chuông mỗi khi đơn đổi trạng thái.</span>
            <AppButton type="button" variant="outline" onClick={() => navigate(APP_ROUTES.STUDENT.APPLICATIONS)}>Xem đơn đã gửi</AppButton>
            <AppButton type="submit" disabled={!canSubmit} leftIcon={<Send className="w-4 h-4" />}>Gửi đơn</AppButton>
          </div>
        </form>
      </div>
    </div>
  );
}
