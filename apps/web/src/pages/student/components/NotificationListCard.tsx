import { Send } from 'lucide-react';
import { NotificationCardItem, type NotificationModel } from './NotificationCardItem';

interface NotificationListCardProps {
  notifications: NotificationModel[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export function NotificationListCard({
  notifications,
  selectedFilter,
  onFilterChange,
}: NotificationListCardProps) {
  const categories = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'KTX', label: 'KTX' },
    { key: 'MAINTENANCE', label: 'Bảo trì' },
    { key: 'ACADEMIC', label: 'Học vụ' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      {/* Card Header with Category Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F26F21] flex items-center justify-center">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800">Thông báo mới nhất</h3>
            <p className="text-[11px] text-slate-400">6 thông báo • Cập nhật 12/09/2026</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {categories.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange(tab.key)}
              className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                selectedFilter === tab.key
                  ? 'bg-orange-100 text-[#F26F21]'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-slate-100">
        {notifications.map((item) => (
          <NotificationCardItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
