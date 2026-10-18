import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Chu trình vận hành KTX 16 tuần (docs/BUSINESS_FLOWS.md — Chu trình 16 tuần).
 * Mỗi học kỳ chạy một chu trình chuẩn bị cho kỳ kế tiếp: xác thực SIS → đơn từ → phí → xếp phòng 2 vòng → check-out / check-in.
 * Quản trị viên chỉnh ngày bắt đầu chu trình và tuần bắt đầu / kết thúc từng giai đoạn; “Khóa” để cố định ngày.
 * Tiêu đề / mô tả lưu bằng tiếng Anh (khóa dịch), hiển thị qua t().
 */

export const WEEKS = 16;
const DAY = 86_400_000;

export type PhaseOwner = 'system' | 'student' | 'staff';

export interface TimelinePhase {
  id: string;
  title: string;
  description: string;
  owner: PhaseOwner;
  startWeek: number;
  endWeek: number;
}

export const DEFAULT_PHASES: TimelinePhase[] = [
  {
    id: 'enrollment',
    title: 'Enrollment verification',
    description: "Integration with the university's central student information system (FPT SIS) to verify enrollment.",
    owner: 'system',
    startWeek: 1,
    endWeek: 2,
  },
  {
    id: 'requests',
    title: 'Requests & extensions',
    description: 'Students can submit requests such as room changes or maintenance. Students whose extension period has expired are notified.',
    owner: 'student',
    startWeek: 2,
    endWeek: 6,
  },
  {
    id: 'fees',
    title: 'Fees & request handling',
    description: 'Students pay room fees for the upcoming term. Staff process student requests such as room changes and maintenance.',
    owner: 'staff',
    startWeek: 6,
    endWeek: 10,
  },
  {
    id: 'assign-p1',
    title: 'Dormitory assignment — round 1',
    description: 'The dormitory application system for the upcoming semester opens.',
    owner: 'student',
    startWeek: 10,
    endWeek: 11,
  },
  {
    id: 'solve-p1',
    title: 'Round 1 resolution',
    description: 'Staff process the first round of applications, allocate available rooms and send check-in notifications. A list of students with issues is compiled.',
    owner: 'staff',
    startWeek: 11,
    endWeek: 12,
  },
  {
    id: 'assign-p2',
    title: 'Dormitory assignment — round 2',
    description: 'A second application round opens for students who had issues in round 1. Refund requests are accepted.',
    owner: 'student',
    startWeek: 12,
    endWeek: 13,
  },
  {
    id: 'solve-p2',
    title: 'Round 2 resolution',
    description: 'Handle issues from round 1, fill under-occupied rooms and process refunds.',
    owner: 'staff',
    startWeek: 13,
    endWeek: 14,
  },
  {
    id: 'checkout',
    title: 'Check-out',
    description: 'Students must check out within one week of receiving the check-out email.',
    owner: 'student',
    startWeek: 14,
    endWeek: 15,
  },
  {
    id: 'checkin',
    title: 'Check-in',
    description: 'Students may check in as early as one week before the new semester starts.',
    owner: 'student',
    startWeek: 15,
    endWeek: 16,
  },
];

interface TimelineState {
  /** Ngày bắt đầu tuần 1 (yyyy-mm-dd) */
  cycleStart: string;
  /** Học kỳ đang chạy chu trình → học kỳ được chuẩn bị */
  cycleLabel: string;
  phases: TimelinePhase[];
  /** Khóa: cố định ngày, không cho chỉnh */
  locked: boolean;
  setCycleStart: (iso: string) => void;
  updatePhase: (id: string, patch: Partial<Pick<TimelinePhase, 'startWeek' | 'endWeek'>>) => void;
  toggleLock: () => void;
  reset: () => void;
}

const INITIAL = { cycleStart: '2026-09-01', cycleLabel: 'Fall 2026 → Spring 2027', phases: DEFAULT_PHASES, locked: true };

export const useSemesterTimeline = create<TimelineState>()(
  persist(
    (set) => ({
      ...INITIAL,
      setCycleStart: (cycleStart) => set({ cycleStart }),
      updatePhase: (id, patch) =>
        set((s) => ({
          phases: s.phases.map((p) => {
            if (p.id !== id) return p;
            const startWeek = clampWeek(patch.startWeek ?? p.startWeek);
            const endWeek = Math.max(startWeek, clampWeek(patch.endWeek ?? p.endWeek));
            return { ...p, startWeek, endWeek };
          }),
        })),
      toggleLock: () => set((s) => ({ locked: !s.locked })),
      reset: () => set({ ...INITIAL }),
    }),
    { name: 'campusstay_semester_timeline', version: 1 }
  )
);

const clampWeek = (w: number) => Math.min(WEEKS, Math.max(1, Math.round(w) || 1));

/* ── Tính ngày ─────────────────────────────────────────── */

const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y ?? 2026, (m ?? 1) - 1, d ?? 1);
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** dd/mm hoặc dd/mm/yyyy */
export const formatDate = (d: Date, withYear = false) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}${withYear ? `/${d.getFullYear()}` : ''}`;

export const weekStartDate = (cycleStart: string, week: number) => new Date(parseIso(cycleStart).getTime() + (week - 1) * 7 * DAY);

export const phaseDates = (cycleStart: string, p: TimelinePhase) => ({
  start: weekStartDate(cycleStart, p.startWeek),
  end: new Date(weekStartDate(cycleStart, p.endWeek).getTime() + 6 * DAY),
});

/** Số ngày từ đầu tuần 1 tới hôm nay (0 = ngày đầu tiên); có thể âm hoặc vượt 112 ngày */
export const dayOfCycle = (cycleStart: string, today = new Date()) => Math.floor((startOfDay(today).getTime() - parseIso(cycleStart).getTime()) / DAY);

/** Tuần hiện tại (1–16), hoặc null nếu ngoài chu trình */
export const currentWeekOf = (cycleStart: string, today = new Date()) => {
  const day = dayOfCycle(cycleStart, today);
  return day < 0 || day >= WEEKS * 7 ? null : Math.floor(day / 7) + 1;
};

export type PhaseStatus = 'done' | 'active' | 'upcoming';

export const phaseStatus = (cycleStart: string, p: TimelinePhase, today = new Date()): PhaseStatus => {
  const { start, end } = phaseDates(cycleStart, p);
  const now = startOfDay(today).getTime();
  if (now > end.getTime()) return 'done';
  if (now >= start.getTime()) return 'active';
  return 'upcoming';
};

/** Số ngày tới khi giai đoạn bắt đầu */
export const daysUntil = (d: Date, today = new Date()) => Math.ceil((d.getTime() - startOfDay(today).getTime()) / DAY);
