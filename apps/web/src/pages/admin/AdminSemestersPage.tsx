import { Plus } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function AdminSemestersPage() {
  const semesters = [
    { code: 'FALL2026', name: 'Học kỳ Fall 2026', start: '01/09/2026', end: '31/12/2026', status: 'Đang mở đăng ký' },
    { code: 'SUMMER2026', name: 'Học kỳ Summer 2026', start: '01/05/2026', end: '31/08/2026', status: 'Đã kết thúc' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Cấu Hình Kỳ Học KTX</h1>
          <p className="text-xs text-slate-500 mt-1">Thiết lập thời gian mở/đóng cổng đăng ký và hạn chót thanh toán</p>
        </div>
        <AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Thêm kỳ học mới
        </AppButton>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {semesters.map((s) => (
          <div key={s.code} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">{s.name} ({s.code})</div>
              <div className="text-slate-400 mt-0.5">Thời gian: {s.start} - {s.end}</div>
            </div>
            <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-50 text-emerald-700">
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
