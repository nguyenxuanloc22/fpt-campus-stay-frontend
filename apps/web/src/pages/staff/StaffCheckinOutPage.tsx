import { CheckCircle2, Search } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function StaffCheckinOutPage() {
  const appointments = [
    { id: '1', student: 'Nguyễn Xuân Lộc (SE170123)', room: 'A204 - G1', time: '09:30 30/08/2026', type: 'CHECK_IN' },
    { id: '2', student: 'Trần Văn An (SE170111)', room: 'A201 - G1', time: '14:00 30/08/2026', type: 'CHECK_IN' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Nghiệm Thu Check-In & Check-Out</h1>
        <p className="text-xs text-slate-500 mt-1">Quét mã/tìm kiếm sinh viên đến nhận phòng và lập biên bản bàn giao</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Quét mã QR hoặc nhập MSSV để kiểm tra..."
            className="flex-1 px-3 py-2 text-xs border rounded-lg"
          />
          <AppButton size="sm" leftIcon={<Search className="w-4 h-4" />}>
            Tra cứu
          </AppButton>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {appointments.map((a) => (
            <div key={a.id} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">{a.student}</span>
                <span className="text-slate-400">Phòng chỉ định: {a.room} • Giờ hẹn: {a.time}</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Bàn giao chìa khóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
