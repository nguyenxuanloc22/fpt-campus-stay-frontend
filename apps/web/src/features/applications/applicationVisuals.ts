import { Wrench, ArrowLeftRight, Wallet, CalendarClock, FileBadge, FileText, type LucideIcon } from 'lucide-react';
import type { ApplicationState, ApplicationType } from './studentApplications';

/** Biểu tượng + màu nhấn cho từng loại đơn (nền cam trắng, mỗi loại một sắc nhẹ — docs/CONVENTIONS.md §8.3). */
export const APPLICATION_VISUAL: Record<ApplicationType, { icon: LucideIcon; tile: string; ring: string }> = {
  MAINTENANCE: { icon: Wrench, tile: 'bg-orange-100 text-orange-600', ring: 'border-orange-300 bg-orange-50' },
  ROOM_CHANGE: { icon: ArrowLeftRight, tile: 'bg-sky-100 text-sky-600', ring: 'border-sky-300 bg-sky-50' },
  REFUND: { icon: Wallet, tile: 'bg-emerald-100 text-emerald-600', ring: 'border-emerald-300 bg-emerald-50' },
  PAYMENT_EXTENSION: { icon: CalendarClock, tile: 'bg-amber-100 text-amber-600', ring: 'border-amber-300 bg-amber-50' },
  RESIDENCE_CONFIRMATION: { icon: FileBadge, tile: 'bg-violet-100 text-violet-600', ring: 'border-violet-300 bg-violet-50' },
  OTHER: { icon: FileText, tile: 'bg-surface-sunken text-ink-muted', ring: 'border-line-strong bg-surface-muted' },
};

export const STATE_TONE: Record<ApplicationState, string> = {
  SUBMITTED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-amber-50 text-amber-700 border-amber-200',
  WAITING_PARTNER: 'bg-violet-50 text-violet-700 border-violet-200',
  APPROVED: 'bg-teal-50 text-teal-700 border-teal-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
  CANCELLED: 'bg-surface-sunken text-ink-muted border-line',
};
