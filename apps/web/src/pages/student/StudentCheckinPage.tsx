import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';
import { AppButton } from '@shared-ui/components/AppButton';

export function StudentCheckinPage() {
  const [scheduledDate, setScheduledDate] = useState('2026-08-30T09:30');
  const [isBooked, setIsBooked] = useState(false);

  const checklistItems = [
    { item: 'Khóa cửa phòng & thẻ từ vào tòa A', status: 'Tốt' },
    { item: 'Giường tầng + Nệm cá nhân', status: 'Đầy đủ, nguyên vẹn' },
    { item: 'Bàn ghế học tập cá nhân', status: 'Tốt' },
    { item: 'Điều hòa Panasonic Inverter + Remote', status: 'Hoạt động bình thường' },
    { item: 'Bình nước nóng Ariston phòng tắm', status: 'Hoạt động bình thường' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Lịch Hẹn Check-In & Bàn Giao Phòng</h1>
        <p className="text-xs text-slate-500 mt-1">Đăng ký khung giờ nhận phòng và kiểm tra biên bản hiện trạng tài sản</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800">1. Đặt lịch hẹn nhận phòng</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Thời gian mong muốn</label>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg"
            />
          </div>
          <div className="flex items-end">
            <AppButton onClick={() => setIsBooked(true)} size="sm">
              Xác nhận đặt lịch
            </AppButton>
          </div>
        </div>

        {isBooked && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã đặt lịch hẹn check-in: 09:30 ngày 30/08/2026 tại Văn phòng KTX Tòa A.</span>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">2. Biên bản kiểm kê tài sản phòng A204</h3>
          <StatusBadge status="APPROVED" customLabel="Đã nghiệm thu" />
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {checklistItems.map((c, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <span className="text-slate-700 font-medium">{c.item}</span>
              <span className="text-emerald-700 font-semibold">{c.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
