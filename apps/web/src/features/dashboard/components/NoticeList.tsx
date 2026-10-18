import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { DataState, ListSkeleton, Modal, AppButton, STATUS_TONE_CLASS, type DataStatus } from '@shared-ui';
import { ANNOUNCEMENTS, ANNOUNCEMENT_CATEGORY_LABEL, type Announcement } from '@features/notifications/systemAnnouncements';
import clsx from 'clsx';

const levelOf = (a: Announcement) =>
  a.important ? { label: 'Quan trọng', className: STATUS_TONE_CLASS.danger } : { label: ANNOUNCEMENT_CATEGORY_LABEL[a.category], className: STATUS_TONE_CLASS.neutral };

interface NoticeListProps {
  limit?: number;
  status?: DataStatus;
  onViewAll: () => void;
}

/** Thông báo ngắn trên dashboard: tiêu đề + badge mức độ; bấm để đọc đầy đủ. */
export function NoticeList({ limit = 3, status, onViewAll }: NoticeListProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const items = ANNOUNCEMENTS.slice(0, limit);
  const selected = ANNOUNCEMENTS.find((a) => a.id === openId);

  return (
    <>
      <DataState
        status={status}
        isEmpty={items.length === 0}
        skeleton={<ListSkeleton rows={limit} />}
        empty={{ title: 'Chưa có thông báo', description: 'Thông báo mới từ Ban quản lý KTX sẽ hiện ở đây.' }}
      >
        <ul className="divide-y divide-line">
          {items.map((n) => {
            const level = levelOf(n);
            return (
              <li key={n.id}>
                <button type="button" onClick={() => setOpenId(n.id)} className="w-full min-h-touch px-4 sm:px-6 py-3 text-left flex items-center gap-3 hover:bg-surface-muted">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={clsx('px-2 py-0.5 rounded-full text-label font-semibold', level.className)}>{level.label}</span>
                      <span className="text-label text-ink-muted">{n.date}</span>
                    </div>
                    <div className="text-body text-ink">{n.title}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-ink-muted shrink-0" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </DataState>

      <Modal
        open={!!selected}
        onClose={() => setOpenId(null)}
        title={selected?.title}
        subtitle={selected && `${selected.source} · ${selected.date}`}
        footer={
          <AppButton
            variant="outline"
            onClick={() => {
              setOpenId(null);
              onViewAll();
            }}
          >
            Xem tất cả thông báo
          </AppButton>
        }
      >
        <p className="text-body text-ink leading-relaxed whitespace-pre-line">{selected?.body}</p>
      </Modal>
    </>
  );
}
