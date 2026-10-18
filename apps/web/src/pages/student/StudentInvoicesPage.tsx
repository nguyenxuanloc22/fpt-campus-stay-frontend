import { useState } from 'react';
import { AlertTriangle, Download, Clock, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, Tabs, StatusBadge, AppButton, Modal, VietQrCode, formatVnd, useToast, t } from '@shared-ui';
import type { InvoiceStatus, InvoiceType } from '@campusstay/constants';

/**
 * Hóa đơn & thanh toán (docs/BUSINESS_FLOWS.md F1, F3, F6).
 * Tiền cọc (gồm cọc điện nước) đóng khi đăng ký; phí phòng do hệ thống tạo theo kỳ. Thanh toán qua VietQR.
 */

interface Invoice {
  code: string;
  title: string;
  type: InvoiceType;
  issued: string;
  due: string;
  amount: number;
  status: InvoiceStatus;
  items: { name: string; amount: number }[];
}

const INVOICES: Invoice[] = [
  {
    code: 'INV-2026-1012',
    title: t('Fall 2026 room fee — installment 2'),
    type: 'ROOM_FEE',
    issued: '01/10/2026',
    due: '24/10/2026',
    amount: 2400000,
    status: 'UNPAID',
    items: [{ name: t('Bed fee A204-G1, November–December 2026'), amount: 2400000 }],
  },
  {
    code: 'DEP-SP27-004812',
    title: t('Spring 2027 registration deposit'),
    type: 'DEPOSIT',
    issued: '16/10/2026',
    due: '16/10/2026',
    amount: 1540000,
    status: 'PAID',
    items: [
      { name: t('Holding deposit (20% of the first term fee, 4-person room)'), amount: 1040000 },
      { name: t('Utility deposit'), amount: 500000 },
    ],
  },
  {
    code: 'INV-2026-0830',
    title: t('Fall 2026 room fee — paid at check-in'),
    type: 'ROOM_FEE',
    issued: '30/08/2026',
    due: '30/08/2026',
    amount: 1760000,
    status: 'PAID',
    items: [
      { name: t('Bed fee A204-G1, September–October 2026'), amount: 2800000 },
      { name: t('Minus the holding deposit already paid'), amount: -1040000 },
    ],
  },
  {
    code: 'DEP-FA26-002311',
    title: t('Fall 2026 registration deposit'),
    type: 'DEPOSIT',
    issued: '05/08/2026',
    due: '05/08/2026',
    amount: 1540000,
    status: 'PAID',
    items: [
      { name: t('Holding deposit'), amount: 1040000 },
      { name: t('Utility deposit'), amount: 500000 },
    ],
  },
];

const TYPE_LABEL: Record<InvoiceType, string> = { DEPOSIT: t('Deposits'), ROOM_FEE: t('Room fee'), UTILITY: t('Utilities') };

type TabKey = 'UNPAID' | 'PAID' | 'ALL';

export function StudentInvoicesPage() {
  const { show, toastNode } = useToast();
  const [paid, setPaid] = useState<string[]>([]);
  const [tab, setTab] = useState<TabKey>('UNPAID');
  const [detail, setDetail] = useState<Invoice | null>(null);
  const [paying, setPaying] = useState<Invoice | null>(null);

  const invoices = INVOICES.map((i) => (paid.includes(i.code) ? { ...i, status: 'PAID' as const } : i));
  const unpaid = invoices.filter((i) => i.status !== 'PAID');
  const list = invoices.filter((i) => (tab === 'ALL' ? true : tab === 'PAID' ? i.status === 'PAID' : i.status !== 'PAID'));

  const confirmPaid = () => {
    if (!paying) return;
    setPaid((p) => [...p, paying.code]);
    show(t('Payment successful — receipt sent by email'));
    setPaying(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader title={t('Invoices & payments')} description={t('Pay with VietQR — confirmed automatically within 1–3 minutes')} />

      {unpaid.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 rounded-xl border border-line bg-surface">
          <AlertTriangle className="w-5 h-5 text-brand-ink shrink-0" />
          <div className="flex-1 text-sm text-ink">
            {t('Amount due')} <strong className="text-ink">{formatVnd(unpaid.reduce((s, i) => s + i.amount, 0))}</strong> {t('· nearest due date')} {unpaid[0]?.due}
          </div>
          <AppButton size="sm" onClick={() => unpaid[0] && setPaying(unpaid[0])}>{t('Payment')}</AppButton>
        </div>
      )}

      <SectionCard noPadding>
        <div className="px-4 pt-4">
          <Tabs<TabKey>
            items={[
              { value: 'UNPAID', label: t('Amount due'), count: unpaid.length },
              { value: 'PAID', label: t('Paid'), count: invoices.length - unpaid.length },
              { value: 'ALL', label: t('All'), count: invoices.length },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>
        <ul className="divide-y divide-line mt-3">
          {list.map((inv) => (
            <li key={inv.code} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <button type="button" onClick={() => setDetail(inv)} className="flex-1 min-w-0 text-left">
                <div className="text-sm font-semibold text-ink hover:text-brand-ink">{inv.title}</div>
                <div className="text-xs text-ink-muted mt-0.5">
                  {TYPE_LABEL[inv.type]} · {inv.code} · {inv.status === 'PAID' ? t('Issued {0}', { 0: inv.issued }) : t('Due {0}', { 0: inv.due })}
                </div>
              </button>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-ink tabular-nums">{formatVnd(inv.amount)}</span>
                <StatusBadge status={inv.status} />
                {inv.status === 'PAID' ? (
                  <AppButton size="sm" variant="ghost" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={() => show(t('Downloading receipt {0}', { 0: inv.code }))}>{t('Receipt')}</AppButton>
                ) : (
                  <AppButton size="sm" onClick={() => setPaying(inv)}>{t('Payment')}</AppButton>
                )}
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-ink-subtle flex flex-col items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" /> {t('You have nothing left to pay')}
            </li>
          )}
        </ul>
      </SectionCard>

      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title ?? ''}
        subtitle={detail ? t('{0} · Issued {1} · Due {2}', { 0: detail.code, 1: detail.issued, 2: detail.due }) : ''}
        footer={
          detail && detail.status !== 'PAID' ? (
            <AppButton onClick={() => { setPaying(detail); setDetail(null); }}>{t('Payment')}</AppButton>
          ) : (
            <AppButton variant="outline" onClick={() => setDetail(null)}>{t('Close')}</AppButton>
          )
        }
      >
        {detail && (
          <table className="w-full text-sm">
            <tbody className="divide-y divide-line">
              {detail.items.map((it) => (
                <tr key={it.name}>
                  <td className="py-2.5 text-ink">{it.name}</td>
                  <td className={clsx('py-2.5 text-right font-semibold tabular-nums', it.amount < 0 && 'text-emerald-600')}>{formatVnd(it.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td className="py-3 font-bold">{t('Total')}</td>
                <td className="py-3 text-right font-bold text-brand-ink tabular-nums">{formatVnd(detail.amount)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </Modal>

      <Modal
        open={!!paying}
        onClose={() => setPaying(null)}
        title={t('Pay with VietQR')}
        subtitle={paying ? `${paying.code} — ${paying.title}` : ''}
        footer={
          <>
            <AppButton variant="outline" onClick={() => setPaying(null)}>{t('Later')}</AppButton>
            <AppButton leftIcon={<CheckCircle2 className="w-4 h-4" />} onClick={confirmPaid}>{t('I have paid')}</AppButton>
          </>
        }
      >
        {paying && (
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-2xl border border-line">
              <VietQrCode value={paying.code} size={220} />
            </div>
            <div className="text-2xl font-bold text-ink mt-4 tabular-nums">{formatVnd(paying.amount)}</div>
            <div className="text-xs text-ink-muted mt-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {t('The QR code is valid for 15 minutes')}</div>
            <p className="text-xs text-ink-muted mt-3 max-w-xs">{t('Open any banking app and scan the code. The amount and payment note are pre-filled.')}</p>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
