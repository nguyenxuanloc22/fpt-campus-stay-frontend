import { useState } from 'react';
import { Filter, HelpCircle } from 'lucide-react';
import { NotificationHeader } from './components/NotificationHeader';
import { NotificationBanner } from './components/NotificationBanner';
import { NotificationListCard } from './components/NotificationListCard';
import { type NotificationModel } from './components/NotificationCardItem';
import { EmptyState } from '@shared-ui/components/EmptyState';

export function StudentNotificationsPage() {
  const [viewState, setViewState] = useState<'populated' | 'empty'>('populated');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const notificationsData: NotificationModel[] = [
    {
      id: '1',
      category: 'KTX',
      title: 'Thông báo mở đợt đăng ký ký túc xá học kỳ Fall 2026',
      date: '12/09/2026 • 09:30',
      summary: 'Phòng Công tác Sinh viên thông báo mở đợt đăng ký KTX cho học kỳ Fall 2026 từ ngày 12/09 đến 20/09/2026. Sinh viên đăng ký tại hệ thống CampusStay.',
      isNew: true,
      expanded: true,
      ctaText: 'Tiến hành Đăng ký KTX ngay >',
    },
    {
      id: '2',
      category: 'MAINTENANCE',
      title: 'Lịch bảo trì hệ thống điện Tòa A — từ 15/09 đến 17/09/2026',
      date: '10/09/2026 • 14:00',
      summary: 'Ban Quản lý KTX thông báo lịch bảo trì, nâng cấp hệ thống điện tại Tòa A. Sinh viên lưu ý sạc đầy thiết bị trước thời gian cắt điện luân phiên.',
      isNew: false,
    },
    {
      id: '3',
      category: 'KTX',
      title: 'Quy định bàn giao tài sản và nhận phòng học kỳ Fall 2026',
      date: '08/09/2026 • 15:30',
      summary: 'Sinh viên lưu ý kiểm tra kỹ biên bản bàn giao chìa khóa, thẻ từ và thiết bị điều hòa khi làm thủ tục check-in tại sảnh tòa nhà.',
      isNew: false,
    },
    {
      id: '4',
      category: 'ACADEMIC',
      title: 'Hỗ trợ xác nhận giấy tờ vay vốn ngân hàng chính sách',
      date: '05/09/2026 • 10:15',
      summary: 'Sinh viên có hoàn cảnh khó khăn cần giấy xác nhận tạm trú tại KTX để vay vốn sinh viên vui lòng nộp hồ sơ tại Phòng Công tác Sinh viên.',
      isNew: false,
    },
  ];

  const filteredList = selectedFilter === 'ALL'
    ? notificationsData
    : notificationsData.filter(n => n.category === selectedFilter);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 font-sans">
      <NotificationHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Page Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Thông báo chung
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
              <span>FPT University</span>
              <span>•</span>
              <span>KTX Tân Uyên</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#F26F21] font-bold">
                3 chưa đọc
              </span>
            </div>
          </div>

          <button
            type="button"
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50"
          >
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Tất cả</span>
          </button>
        </div>

        {/* State Switcher for Committee Demonstration */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl w-fit text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewState('populated')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewState === 'populated'
                ? 'bg-[#F26F21] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Có thông báo
          </button>
          <button
            type="button"
            onClick={() => setViewState('empty')}
            className={`px-3 py-1.5 rounded-lg transition ${
              viewState === 'empty'
                ? 'bg-[#F26F21] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
          <>
            <NotificationBanner />
            <NotificationListCard
              notifications={filteredList}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </>
        )}
      </main>

      {/* Floating Help Button */}
      <button
        type="button"
        title="Trợ giúp"
        onClick={() => alert('Phòng Hỗ trợ Sinh viên KTX FPT Tân Uyên: (0274) 7300 999')}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-xl z-50 transition"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
