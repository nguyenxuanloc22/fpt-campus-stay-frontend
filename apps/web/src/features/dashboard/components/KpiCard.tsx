import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { STATUS_TONE_CLASS, type StatusTone } from '@shared-ui';

export interface Kpi {
  label: string;
  value: string;
  /** Dòng phụ, ví dụ "1.075 / 1.200 giường" */
  detail?: string;
  /** Đánh giá theo ngưỡng — luôn kèm chữ, không chỉ dùng màu */
  status: { label: string; tone: StatusTone };
  to: string;
}

/** Thẻ số liệu bấm được: giá trị lớn + chip đánh giá theo ngưỡng. */
export function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <Link
      to={kpi.to}
      className="group block bg-surface rounded-card border border-line shadow-card p-4 sm:p-6 hover:border-line-strong hover:bg-surface-muted active:bg-surface-sunken"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-label font-medium text-ink-muted">{kpi.label}</span>
        <ChevronRight className="w-4 h-4 text-ink-muted shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
      <div className="text-2xl font-bold text-ink mt-1">{kpi.value}</div>
      {kpi.detail && <div className="text-label text-ink-muted">{kpi.detail}</div>}
      <span className={clsx('inline-flex mt-3 px-2 py-0.5 rounded-full text-label font-semibold', STATUS_TONE_CLASS[kpi.status.tone])}>{kpi.status.label}</span>
    </Link>
  );
}
