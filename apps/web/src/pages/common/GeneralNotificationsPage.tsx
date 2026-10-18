import { useState } from 'react';
import { Search, Pin, ChevronDown, CheckCheck } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, Tabs, EmptyState, useToast, t } from '@shared-ui';
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
        title={t('Announcements')}
        description={t('Announcements from the Dormitory Management Board and the system · {0} unread', { 0: unread })}
        actions={
          <button
            type="button"
            onClick={() => { setRead(NOTICES.map((n) => n.id)); show(t('All marked as read')); }}
            className="px-3 py-2 rounded-lg border border-line bg-surface text-xs font-semibold text-ink flex items-center gap-1.5 hover:bg-surface-muted"
          >
            <CheckCheck className="w-4 h-4" /> {t('Mark all as read')}
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs<Category>
          items={[
            { value: 'ALL', label: t('All'), count: NOTICES.length },
            ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABEL[c], count: count(c) })),
          ]}
          value={category}
          onChange={setCategory}
        />
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search announcements…')} className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line bg-surface" />
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState title={t('No announcements found')} description={t('Try another keyword or category.')} />
      ) : (
        <SectionCard noPadding>
          <ul className="divide-y divide-line">
            {list.map((n) => {
              const isOpen = open === n.id;
              const isUnread = !read.includes(n.id);
              return (
                <li key={n.id}>
                  <button type="button" onClick={() => toggle(n.id)} aria-expanded={isOpen} className="w-full px-5 py-4 text-left hover:bg-surface-muted flex gap-3">
                    <span className={clsx('mt-1.5 w-2 h-2 rounded-full shrink-0', isUnread ? 'bg-brand-fill' : 'bg-transparent')} />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-label text-ink-muted mb-1">
                        {n.important && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold"><Pin className="w-3 h-3" />{t('Important')}</span>}
                        <span className={clsx('px-2 py-0.5 rounded-full font-semibold', ANNOUNCEMENT_CATEGORY_TONE[n.category])}>{CATEGORY_LABEL[n.category]}</span>
                        <span>·</span>
                        <span>{n.source}</span>
                        <span>·</span>
                        <span>{n.date}</span>
                      </div>
                      <div className={clsx('text-sm text-ink', isUnread ? 'font-bold' : 'font-medium')}>{n.title}</div>
                      <p className={clsx('text-xs text-ink-muted mt-1 leading-relaxed whitespace-pre-line', !isOpen && 'line-clamp-1')}>{n.body}</p>
                    </div>
                    <ChevronDown className={clsx('w-4 h-4 text-ink-subtle mt-1 shrink-0 transition', isOpen && 'rotate-180')} />
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
