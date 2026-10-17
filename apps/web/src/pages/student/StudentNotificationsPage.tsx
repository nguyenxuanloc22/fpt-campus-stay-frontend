import { useState } from 'react';
import { Filter, Search, CheckCheck, Pin, FileText, Download, CalendarDays, Settings2, Megaphone, Wrench, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import { NotificationBanner } from './components/NotificationBanner';
import { NotificationListCard } from './components/NotificationListCard';
import { type NotificationModel } from './components/NotificationCardItem';
import { EmptyState } from '@shared-ui/components/EmptyState';
import { SectionCard, AppButton, useToast } from '@shared-ui';

const NOTIFICATIONS: NotificationModel[] = [
  {
    id: '1',
    category: 'KTX',
    title: 'Thông báo mở đợt đăng ký ký túc xá học kỳ Spring 2027',
    date: '14/10/2026 • 09:30',
    summary:
      'Phòng Công tác Sinh viên thông báo mở đợt đăng ký KTX cho học kỳ Spring 2027 từ ngày 14/10 đến 15/11/2026. Sinh viên đang ở được ưu tiên giữ phòng nếu gia hạn trước 01/11.',
    isNew: true,
    expanded: true,
    ctaText: 'Tiến hành Đăng ký KTX ngay >',
  },
  {
    id: '2',
    category: 'MAINTENANCE',
    title: 'Lịch cắt nước bảo trì bồn chứa Tòa A — ngày 19/10/2026',
    date: '16/10/2026 • 14:00',
    summary:
      'Ban Quản lý KTX thông báo tạm ngưng cấp nước Tòa A từ 08:00 đến 14:00 ngày 19/10 để vệ sinh bồn chứa định kỳ. Sinh viên vui lòng chủ động dự trữ nước.',
    isNew: true,
  },
  {
    id: '3',
    category: 'KTX',
    title: 'Kiểm tra phòng định kỳ tháng 10/2026',
    date: '15/10/2026 • 08:00',
    summary:
      'Đoàn kiểm tra sẽ đi kiểm tra vệ sinh, an toàn PCCC tất cả các phòng vào sáng 20/10. Phòng đạt loại Tốt 3 tháng liên tiếp được cộng 5 điểm nội quy.',
    isNew: true,
  },
  {
    id: '4',
    category: 'MAINTENANCE',
    title: 'Nâng cấp hệ thống Wi-Fi 6 toàn bộ khu KTX',
    date: '12/10/2026 • 10:00',
    summary:
      'Từ 22h ngày 21/10 đến 06h ngày 22/10, hệ thống mạng sẽ gián đoạn để lắp đặt bộ phát Wi-Fi 6 mới, tốc độ tối đa 1Gbps mỗi phòng.',
    isNew: false,
  },
  {
    id: '5',
    category: 'KTX',
    title: 'Quy định giờ giới nghiêm và đăng ký khách thăm',
    date: '10/10/2026 • 15:30',
    summary:
      'Nhắc nhở sinh viên giờ giới nghiêm 23:00. Khách thăm phải đăng ký tại quầy bảo vệ, xuất trình CCCD và rời KTX trước 21:00.',
    isNew: false,
  },
  {
    id: '6',
    category: 'ACADEMIC',
    title: 'Hỗ trợ xác nhận giấy tờ vay vốn ngân hàng chính sách',
    date: '05/10/2026 • 10:15',
    summary:
      'Sinh viên có hoàn cảnh khó khăn cần giấy xác nhận tạm trú tại KTX để vay vốn vui lòng nộp hồ sơ tại Phòng Công tác Sinh viên.',
    isNew: false,
  },
  {
    id: '7',
    category: 'ACADEMIC',
    title: 'Lịch thi cuối kỳ Block 1 — phòng tự học KTX mở 24/7',
    date: '01/10/2026 • 08:00',
    summary:
      'Trong 2 tuần thi, phòng tự học tầng 1 các tòa mở cửa 24/7, có hỗ trợ nước uống miễn phí. Vui lòng giữ trật tự và vệ sinh chung.',
    isNew: false,
  },
];

const PINNED_DOCS = [
  { name: 'Nội quy Ký túc xá FPT University 2026', size: '1.2 MB' },
  { name: 'Hướng dẫn thanh toán VietQR', size: '640 KB' },
  { name: 'Quy trình xử lý sự cố PCCC', size: '2.1 MB' },
  { name: 'Bảng giá dịch vụ & phí phạt', size: '320 KB' },
];

export function StudentNotificationsPage() {
  const navigate = useNavigate();
  const { show, toastNode } = useToast();
  const [viewState, setViewState] = useState<'populated' | 'empty'>('populated');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [query, setQuery] = useState('');
  const [readAll, setReadAll] = useState(false);

  const data = NOTIFICATIONS.map((n) => (readAll ? { ...n, isNew: false } : n));
  const filteredList = data.filter((n) => {
    if (selectedFilter !== 'ALL' && n.category !== selectedFilter) return false;
    if (query && !`${n.title} ${n.summary}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  const unread = data.filter((n) => n.isNew).length;
  const countBy = (c: NotificationModel['category']) => data.filter((n) => n.category === c).length;

  return (
    <div className="space-y-6">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">Thông báo chung</h1>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>FPT University</span>
            <span>•</span>
            <span>KTX Tân Uyên</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#F26F21] font-bold">{unread} chưa đọc</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm thông báo..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs w-52"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setReadAll(true);
              show('Đã đánh dấu tất cả là đã đọc');
            }}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50"
          >
            <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Đọc tất cả</span>
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Tất cả</span>
          </button>
        </div>
      </div>

      {/* State Switcher for Committee Demonstration */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl w-fit text-xs font-bold">
        <button
          type="button"
          onClick={() => setViewState('populated')}
          className={`px-3 py-1.5 rounded-lg transition ${
            viewState === 'populated' ? 'bg-[#F26F21] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Có thông báo
        </button>
        <button
          type="button"
          onClick={() => setViewState('empty')}
          className={`px-3 py-1.5 rounded-lg transition ${
            viewState === 'empty' ? 'bg-[#F26F21] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Trạng thái rỗng
        </button>
      </div>

      {viewState === 'empty' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
          <EmptyState
            title="Hiện không có thông báo nào"
            description="Bạn đã cập nhật và đọc tất cả các thông báo mới từ Ban Quản lý KTX FPT Tân Uyên."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <NotificationBanner />

            {/* Pinned */}
            <div className="p-4 rounded-2xl border border-[#1A365D]/20 bg-[#EBF2FB] flex gap-3">
              <Pin className="w-5 h-5 text-[#1A365D] shrink-0 mt-0.5" />
              <div className="text-xs text-[#1A365D]">
                <div className="font-bold">Ghim: Hạn chót gia hạn giữ phòng Spring 2027 là 01/11/2026</div>
                <div className="text-slate-600 mt-0.5">
                  Sau thời hạn này phòng của bạn sẽ được mở cho sinh viên mới đăng ký.{' '}
                  <button type="button" onClick={() => navigate(APP_ROUTES.STUDENT.REGISTRATION)} className="font-semibold text-[#F26F21] hover:underline">
                    Gia hạn ngay
                  </button>
                </div>
              </div>
            </div>

            {filteredList.length === 0 ? (
              <EmptyState title="Không tìm thấy thông báo" description="Thử từ khóa khác hoặc bỏ bộ lọc danh mục." />
            ) : (
              <NotificationListCard notifications={filteredList} selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} />
            )}
          </div>

          <div className="space-y-6">
            <SectionCard title="Theo danh mục">
              <ul className="space-y-2">
                {[
                  { key: 'KTX' as const, label: 'Ký túc xá', icon: Megaphone, color: 'bg-orange-50 text-[#F26F21]' },
                  { key: 'MAINTENANCE' as const, label: 'Bảo trì', icon: Wrench, color: 'bg-blue-50 text-blue-600' },
                  { key: 'ACADEMIC' as const, label: 'Học vụ', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-600' },
                ].map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => setSelectedFilter(c.key)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.color}`}>
                        <c.icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1 text-xs font-semibold text-slate-700">{c.label}</span>
                      <span className="text-xs font-bold text-slate-500">{countBy(c.key)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title={<span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-[#F26F21]" /> Sắp diễn ra</span>}>
              <ul className="space-y-3 text-xs">
                {[
                  { d: '19/10', t: 'Cắt nước Tòa A (08:00 – 14:00)' },
                  { d: '20/10', t: 'Kiểm tra phòng định kỳ' },
                  { d: '21/10', t: 'Gián đoạn mạng nâng cấp Wi-Fi 6' },
                  { d: '01/11', t: 'Hạn gia hạn giữ phòng' },
                ].map((e) => (
                  <li key={e.t} className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-lg bg-slate-100 font-bold text-slate-700 text-[11px]">{e.d}</span>
                    <span className="text-slate-700">{e.t}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Tài liệu quan trọng" noPadding>
              <ul className="divide-y divide-slate-100">
                {PINNED_DOCS.map((d) => (
                  <li key={d.name} className="px-5 py-3 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-rose-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{d.name}</div>
                      <div className="text-[11px] text-slate-400">PDF • {d.size}</div>
                    </div>
                    <button type="button" onClick={() => show(`Đang tải ${d.name}`)} aria-label="Tải về">
                      <Download className="w-4 h-4 text-slate-400 hover:text-[#F26F21]" />
                    </button>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <AppButton
              variant="outline"
              className="w-full"
              leftIcon={<Settings2 className="w-4 h-4" />}
              onClick={() => navigate(APP_ROUTES.STUDENT.PROFILE)}
            >
              Cài đặt nhận thông báo
            </AppButton>
          </div>
        </div>
      )}

      {toastNode}
    </div>
  );
}
