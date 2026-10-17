import { Bell } from 'lucide-react';

export function StudentNotificationsPage() {
  const notifications = [
    {
      id: '1',
      title: 'Thông báo mở cổng đăng ký Ký túc xá học kỳ Fall 2026',
      date: '10/08/2026',
      sender: 'Ban Quản lý KTX Tân Uyên',
      content: 'Cổng đăng ký mở từ 10/08 đến 25/08. Sinh viên vui lòng hoàn thành chọn phòng và đóng phí đúng hạn.',
      type: 'INFO',
    },
    {
      id: '2',
      title: 'Lịch bảo trì và vệ sinh điều hòa định kỳ Tòa A',
      date: '02/08/2026',
      sender: 'Bộ phận Kỹ thuật KTX',
      content: 'Từ 08:00 đến 17:00 ngày 05/08/2026, đội kỹ thuật sẽ tiến hành bảo trì điều hòa các tầng 2 và 3.',
      type: 'WARNING',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Thông Báo Ký Túc Xá</h1>
        <p className="text-xs text-slate-500 mt-1">Thông tin vận hành, lịch sinh hoạt và thông báo khẩn cấp từ BQL KTX</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F26F21] flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">{n.title}</h3>
                  <span className="text-[11px] text-slate-400">{n.date}</span>
                </div>
                <div className="text-[11px] text-[#F26F21] font-semibold mt-0.5">{n.sender}</div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{n.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
