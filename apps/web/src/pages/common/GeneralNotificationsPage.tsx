import { useState } from 'react';
import { Search, Pin, ChevronDown, CheckCheck } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, SectionCard, Tabs, EmptyState, useToast } from '@shared-ui';

/**
 * Thông báo chung — thông báo hệ thống gửi diện rộng (do Quản trị viên cấu hình hoặc Ban quản lý KTX gửi).
 * Dùng chung cho mọi vai trò. Thông báo cá nhân nằm ở chuông trên Header.
 */

type Category = 'ALL' | 'DORM' | 'MAINTENANCE' | 'SYSTEM';

interface Notice {
  id: string;
  category: Exclude<Category, 'ALL'>;
  title: string;
  body: string;
  source: string;
  date: string;
  pinned?: boolean;
}

const CATEGORY_LABEL: Record<Exclude<Category, 'ALL'>, string> = {
  DORM: 'Ký túc xá',
  MAINTENANCE: 'Bảo trì',
  SYSTEM: 'Hệ thống',
};

const NOTICES: Notice[] = [
  { id: 'n1', category: 'DORM', pinned: true, title: 'Mở cửa sổ đăng ký lưu trú học kỳ Spring 2027', body: 'Cổng đăng ký mở từ 14/10 đến 15/11/2026. Sinh viên FPT University đủ điều kiện đăng ký tại mục “Đăng ký lưu trú”, đóng cọc qua VietQR để giữ chỗ. Sinh viên đang ở được giữ phòng cũ nếu đăng ký trước 01/11/2026.', source: 'Ban Quản lý KTX', date: '14/10/2026 08:00' },
  { id: 'n2', category: 'MAINTENANCE', title: 'Tạm ngưng cấp nước Tòa A ngày 19/10/2026', body: 'Vệ sinh bồn chứa định kỳ từ 08:00 đến 14:00. Sinh viên Tòa A vui lòng chủ động dự trữ nước.', source: 'Ban Quản lý KTX', date: '16/10/2026 14:00' },
  { id: 'n3', category: 'MAINTENANCE', title: 'Nâng cấp Wi-Fi toàn khu KTX đêm 21/10', body: 'Mạng gián đoạn từ 22:00 ngày 21/10 đến 06:00 ngày 22/10 để lắp đặt thiết bị mới.', source: 'Ban Quản lý KTX', date: '12/10/2026 10:00' },
  { id: 'n4', category: 'SYSTEM', title: 'Cập nhật bảng giá phòng học kỳ Spring 2027', body: 'Bảng giá áp dụng cho đơn đăng ký mới: phòng 2 người 8.500.000 ₫/kỳ, phòng 4 người 5.200.000 ₫/kỳ, phòng 6 người 3.600.000 ₫/kỳ. Tiền cọc 20% phí kỳ đầu cộng 500.000 ₫ cọc điện nước.', source: 'Quản trị hệ thống', date: '10/10/2026 09:00' },
  { id: 'n5', category: 'DORM', title: 'Nhắc nhở giờ giới nghiêm và đăng ký khách thăm', body: 'Giờ giới nghiêm 23:00. Khách thăm đăng ký tại quầy bảo vệ, xuất trình CCCD và rời KTX trước 21:00.', source: 'Ban Quản lý KTX', date: '10/10/2026 15:30' },
  { id: 'n6', category: 'SYSTEM', title: 'Bảo trì hệ thống CampusStay 02:00 – 03:00 ngày 20/10', body: 'Hệ thống tạm ngưng để nâng cấp. Thanh toán VietQR trong thời gian này sẽ được đối soát lại sau khi hoạt động trở lại.', source: 'Quản trị hệ thống', date: '09/10/2026 17:00' },
];

export function GeneralNotificationsPage() {
  const { show, toastNode } = useToast();
  const [category, setCategory] = useState<Category>('ALL');
  const [query, setQuery] = useState('');
  const [read, setRead] = useState<string[]>(['n5', 'n6']);
  const [open, setOpen] = useState<string | null>('n1');

  const list = NOTICES.filter(
    (n) => (category === 'ALL' || n.category === category) && (!query || `${n.title} ${n.body}`.toLowerCase().includes(query.toLowerCase()))
  ).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));
  const unread = NOTICES.filter((n) => !read.includes(n.id)).length;
  const count = (c: Exclude<Category, 'ALL'>) => NOTICES.filter((n) => n.category === c).length;

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
            { value: 'DORM', label: CATEGORY_LABEL.DORM, count: count('DORM') },
            { value: 'MAINTENANCE', label: CATEGORY_LABEL.MAINTENANCE, count: count('MAINTENANCE') },
            { value: 'SYSTEM', label: CATEGORY_LABEL.SYSTEM, count: count('SYSTEM') },
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
                        {n.pinned && <span className="inline-flex items-center gap-1 font-semibold text-slate-700"><Pin className="w-3 h-3" />Ghim</span>}
                        <span className="font-semibold text-slate-600">{CATEGORY_LABEL[n.category]}</span>
                        <span>·</span>
                        <span>{n.source}</span>
                        <span>·</span>
                        <span>{n.date}</span>
                      </div>
                      <div className={clsx('text-sm text-slate-900', isUnread ? 'font-bold' : 'font-medium')}>{n.title}</div>
                      <p className={clsx('text-xs text-slate-600 mt-1 leading-relaxed', !isOpen && 'line-clamp-1')}>{n.body}</p>
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
