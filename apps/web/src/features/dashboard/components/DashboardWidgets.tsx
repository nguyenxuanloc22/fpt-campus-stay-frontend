import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Pin, Sparkles, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { SectionCard } from '@shared-ui';
import {
  ANNOUNCEMENTS,
  ANNOUNCEMENT_CATEGORY_LABEL,
  ANNOUNCEMENT_CATEGORY_TONE,
  type AnnouncementCategory,
} from '@features/notifications/systemAnnouncements';

/** Khối dùng chung cho trang Tổng quan của mọi vai trò (bố cục tham khảo FAP, docs/CONVENTIONS.md §8.3). */

export interface InfoTile {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Nền nhạt + chữ đậm cùng sắc, ví dụ `bg-emerald-50 text-emerald-600`. */
  tone: string;
}

export interface QuickItem {
  label: string;
  to: string;
  icon: LucideIcon;
  tone: string;
}

export interface TaskItem {
  id?: string;
  title: string;
  desc: string;
  to: string;
  cta: string;
  /** Chấm màu bên trái, ví dụ `bg-[#F26F21]`. */
  dot: string;
  /** Nhãn phụ (loại đơn, mức ưu tiên…) hiển thị trước tiêu đề. */
  badge?: { label: string; tone: string };
}

export interface WelcomeAction {
  label: string;
  onClick: () => void;
}

interface WelcomeSectionProps {
  name?: string;
  subtitle: string;
  /** Tối đa 2 nút: nút đầu nền trắng (chính), nút sau viền trắng. */
  actions: WelcomeAction[];
  tiles: InfoTile[];
}

export function WelcomeSection({ name, subtitle, actions, tiles }: WelcomeSectionProps) {
  const initials = (name ?? '?').split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(280px,360px)_1fr] gap-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F26F21] via-[#F7823A] to-[#FFB067] text-white p-6 shadow-lg shadow-orange-500/20">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-6 bottom-[-30px] w-24 h-24 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-4">
          <span className="w-16 h-16 rounded-2xl bg-white/20 ring-2 ring-white/40 flex items-center justify-center text-xl font-black shrink-0">{initials}</span>
          <div className="min-w-0">
            <p className="text-sm text-white/85 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Xin chào,</p>
            <h1 className="text-xl font-extrabold leading-tight truncate">{name}</h1>
            <p className="text-xs text-white/80 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-2">
          {actions.slice(0, 2).map((a, i) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className={clsx(
                'px-3 py-2 rounded-xl text-sm font-bold',
                i === 0 ? 'bg-white text-[#F26F21] hover:bg-orange-50' : 'bg-white/15 ring-1 ring-white/40 hover:bg-white/25'
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
            <span className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', t.tone)}>
              <t.icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t.label}</div>
              <div className="text-sm font-bold text-slate-800 truncate" title={t.value}>{t.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type NewsFilter = 'ALL' | AnnouncementCategory;
const NEWS_FILTERS: NewsFilter[] = ['ALL', 'DORM', 'FINANCE', 'MAINTENANCE', 'SYSTEM'];

/** “Tin mới nhất” — thông báo chung có chip lọc theo danh mục và liên kết “Xem tất cả”. */
export function LatestNewsCard({ limit = 5 }: { limit?: number }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<NewsFilter>('ALL');
  const news = ANNOUNCEMENTS.filter((a) => filter === 'ALL' || a.category === filter).slice(0, limit);
  const openAll = () => navigate(APP_ROUTES.COMMON.NOTIFICATIONS);

  return (
    <SectionCard
      title="Tin mới nhất"
      actions={
        <button type="button" onClick={openAll} className="text-xs font-bold text-[#F26F21] hover:underline flex items-center gap-0.5">
          Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
        </button>
      }
      noPadding
    >
      <div className="px-5 pt-1 pb-3 flex gap-1.5 flex-wrap border-b border-slate-100">
        {NEWS_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={clsx('px-3 py-1 rounded-full text-xs font-bold border transition', filter === f ? 'bg-[#F26F21] text-white border-[#F26F21]' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300')}
          >
            {f === 'ALL' ? 'Tất cả' : ANNOUNCEMENT_CATEGORY_LABEL[f]}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-slate-100">
        {news.map((n) => (
          <li key={n.id}>
            <button type="button" onClick={openAll} className="w-full px-5 py-3.5 text-left hover:bg-orange-50/40 flex items-start gap-3">
              <span className="w-12 shrink-0 text-center rounded-xl border border-slate-200 py-1">
                <span className="block text-base font-extrabold text-slate-800 leading-none">{n.date.slice(0, 2)}</span>
                <span className="block text-[10px] text-slate-400">Th{Number(n.date.slice(3, 5))}</span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', ANNOUNCEMENT_CATEGORY_TONE[n.category])}>{ANNOUNCEMENT_CATEGORY_LABEL[n.category]}</span>
                  {n.important && <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700"><Pin className="w-2.5 h-2.5" />Quan trọng</span>}
                </div>
                <div className="text-sm font-semibold text-slate-800 leading-snug">{n.title}</div>
                <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{n.body}</div>
              </div>
            </button>
          </li>
        ))}
        {news.length === 0 && <li className="px-5 py-6 text-center text-xs text-slate-400">Chưa có tin trong danh mục này.</li>}
      </ul>
    </SectionCard>
  );
}

/** “Menu nhanh” — lưới ô icon màu dẫn tới các trang của vai trò. */
export function QuickMenuCard({ items }: { items: QuickItem[] }) {
  const navigate = useNavigate();
  return (
    <SectionCard title="Menu nhanh">
      <div className="grid grid-cols-4 gap-2">
        {items.map((q) => (
          <button key={q.label} type="button" onClick={() => navigate(q.to)} className="group flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 text-center">
            <span className={clsx('w-11 h-11 rounded-xl flex items-center justify-center transition group-hover:scale-105', q.tone)}>
              <q.icon className="w-5 h-5" />
            </span>
            <span className="text-[11px] font-semibold text-slate-600 leading-tight">{q.label}</span>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

interface TaskListCardProps {
  title: string;
  items: TaskItem[];
  /** Liên kết cuối thẻ: tới một trang (`to`) hoặc một hành động trong trang (`onClick`). */
  footer?: { label: string; icon: LucideIcon; to?: string; onClick?: () => void };
  emptyText?: string;
}

/** Danh sách việc cần làm / hàng đợi phê duyệt — mỗi dòng dẫn tới trang xử lý. */
export function TaskListCard({ title, items, footer, emptyText = 'Không còn việc nào cần xử lý.' }: TaskListCardProps) {
  const navigate = useNavigate();
  return (
    <SectionCard
      title={title}
      actions={<span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#C2410C] text-[11px] font-bold">{items.length}</span>}
      noPadding
    >
      <ul className="divide-y divide-slate-100">
        {items.map((t) => (
          <li key={t.id ?? t.title}>
            <button type="button" onClick={() => navigate(t.to)} className="w-full px-5 py-3.5 flex items-center gap-3 text-left hover:bg-slate-50">
              <span className={clsx('w-2 h-2 rounded-full shrink-0', t.dot)} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {t.badge && <span className={clsx('px-2 py-0.5 rounded-full text-[10px] font-bold', t.badge.tone)}>{t.badge.label}</span>}
                  <span className="text-sm font-semibold text-slate-800">{t.title}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
              </div>
              <span className="text-xs font-bold text-[#F26F21] shrink-0">{t.cta}</span>
            </button>
          </li>
        ))}
        {items.length === 0 && <li className="px-5 py-6 text-center text-xs text-slate-400">{emptyText}</li>}
      </ul>
      {footer && (
        <button type="button" onClick={() => (footer.onClick ? footer.onClick() : footer.to && navigate(footer.to))} className="w-full px-5 py-3 border-t border-slate-100 text-xs font-bold text-slate-500 hover:text-[#F26F21] flex items-center justify-center gap-1">
          <footer.icon className="w-3.5 h-3.5" /> {footer.label}
        </button>
      )}
    </SectionCard>
  );
}
