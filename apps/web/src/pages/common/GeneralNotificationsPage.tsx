import { useState } from 'react';
import { Search, Pin, ChevronDown, CheckCheck } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, Tabs, EmptyState, useToast } from '@shared-ui';
import {
  ANNOUNCEMENTS,
  ANNOUNCEMENT_CATEGORY_LABEL as CATEGORY_LABEL,
  ANNOUNCEMENT_CATEGORY_TONE,
  type AnnouncementCategory,
} from '@features/notifications/systemAnnouncements';

/**
 * Thông báo chung — thông báo hệ thống gửi diện rộng (do Quản trị viên cấu hình hoặc Ban quản lý KTX gửi).
 * Dùng chung cho mọi vai trò. Thông báo cá nhân nằm ở chuông trên Header.
 */

type Category = 'ALL' | AnnouncementCategory;

const NOTICES = ANNOUNCEMENTS;
const CATEGORIES: AnnouncementCategory[] = ['DORM', 'FINANCE', 'MAINTENANCE', 'SYSTEM'];

export function GeneralNotificationsPage() {
  const { show, toastNode } = useToast();
  const [category, setCategory] = useState<Category>('ALL');
  const [query, setQuery] = useState('');
  const [read, setRead] = useState<string[]>(['n6', 'n7']);
  const [open, setOpen] = useState<string | null>('n1');

  const list = NOTICES.filter(
    (n) => (category === 'ALL' || n.category === category) && (!query || `${n.title} ${n.body}`.toLowerCase().includes(query.toLowerCase()))
  ).sort((a, b) => Number(!!b.important) - Number(!!a.important));
  const unread = NOTICES.filter((n) => !read.includes(n.id)).length;
  const count = (c: AnnouncementCategory) => NOTICES.filter((n) => n.category === c).length;

  const toggle = (id: string) => {
    setOpen((o) => (o === id ? null : id));
    setRead((r) => (r.includes(id) ? r : [...r, id]));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Thông báo chung"
        description={`Thông báo từ Ban Quản lý KTX và hệ thống · ${unread} chưa đọc`}
        actions={
          <button
            type="button"
            onClick={() => { setRead(NOTICES.map((n) => n.id)); show('Đã đánh dấu tất cả là đã đọc'); }}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50"
          >
            <CheckCheck className="w-4 h-4" /> Đánh dấu đã đọc
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs<Category>
          items={[
            { value: 'ALL', label: 'Tất cả', count: NOTICES.length },
            ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABEL[c], count: count(c) })),
          ]}
          value={category}
          onChange={setCategory}
        />
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm thông báo…" className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white" />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState title="Không tìm thấy thông báo" description="Thử từ khóa khác hoặc chọn danh mục khác." />
      ) : (
        <SectionCard noPadding>
          <ul className="divide-y divide-slate-100">
            {list.map((n) => {
              const isOpen = open === n.id;
              const isUnread = !read.includes(n.id);
              return (
                <li key={n.id}>
                  <button type="button" onClick={() => toggle(n.id)} aria-expanded={isOpen} className="w-full px-5 py-4 text-left hover:bg-slate-50 flex gap-3">
                    <span className={clsx('mt-1.5 w-2 h-2 rounded-full shrink-0', isUnread ? 'bg-[#F26F21]' : 'bg-transparent')} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mb-1">
                        {n.important && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold"><Pin className="w-3 h-3" />Quan trọng</span>}
                        <span className={clsx('px-2 py-0.5 rounded-full font-semibold', ANNOUNCEMENT_CATEGORY_TONE[n.category])}>{CATEGORY_LABEL[n.category]}</span>
                        <span>·</span>
                        <span>{n.source}</span>
                        <span>·</span>
                        <span>{n.date}</span>
                      </div>
                      <div className={clsx('text-sm text-slate-900', isUnread ? 'font-bold' : 'font-medium')}>{n.title}</div>
                      <p className={clsx('text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line', !isOpen && 'line-clamp-1')}>{n.body}</p>
                    </div>
                    <ChevronDown className={clsx('w-4 h-4 text-slate-400 mt-1 shrink-0 transition', isOpen && 'rotate-180')} />
                  </button>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
      {toastNode}
    </div>
  );
}
