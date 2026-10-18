import { Cpu, GraduationCap, UserCog, type LucideIcon } from 'lucide-react';
import { STATUS_TONE_CLASS, t, type StatusTone } from '@shared-ui';
import type { PhaseOwner, PhaseStatus } from './timeline';

/** Màu theo người phụ trách giai đoạn (màu biểu đồ — luôn kèm chữ trong chú thích). */
export const OWNER_META: Record<PhaseOwner, { label: string; bar: string; dot: string; icon: LucideIcon }> = {
  system: { label: t('System'), bar: 'bg-chart-2', dot: 'bg-chart-2', icon: Cpu },
  student: { label: t('Students'), bar: 'bg-chart-1', dot: 'bg-chart-1', icon: GraduationCap },
  staff: { label: t('Dormitory staff'), bar: 'bg-chart-3', dot: 'bg-chart-3', icon: UserCog },
};

export const STATUS_META: Record<PhaseStatus, { label: string; tone: StatusTone }> = {
  done: { label: t('Done'), tone: 'success' },
  active: { label: t('In progress'), tone: 'info' },
  upcoming: { label: t('Upcoming'), tone: 'neutral' },
};

export const statusClass = (s: PhaseStatus) => STATUS_TONE_CLASS[STATUS_META[s].tone];
