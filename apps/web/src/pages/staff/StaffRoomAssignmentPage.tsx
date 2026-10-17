import { Check } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function StaffRoomAssignmentPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Xếp Phòng Thủ Công</h1>
        <p className="text-xs text-slate-500 mt-1">Điều phối và sắp xếp phòng đột xuất cho sinh viên</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Bố trí giường cho sinh viên</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mã số sinh viên (MSSV)</label>
            <input type="text" placeholder="Nhập MSSV..." defaultValue="SE170123" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Họ tên sinh viên</label>
            <input type="text" defaultValue="Nguyễn Xuân Lộc" disabled className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-500" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chọn Tòa & Phòng đích</label>
            <select className="w-full px-3 py-2 border rounded-lg bg-white">
              <option>Tòa A - Phòng A204 (Còn 1 giường trống)</option>
              <option>Tòa A - Phòng A202 (Còn 2 giường trống)</option>
              <option>Tòa B - Phòng B102 (Còn 2 giường trống)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Chọn vị trí giường</label>
            <select className="w-full px-3 py-2 border rounded-lg bg-white">
              <option>Giường G1 (Tầng dưới)</option>
              <option>Giường G2 (Tầng trên)</option>
            </select>
          </div>
        </div>
        <div className="pt-4 border-t flex justify-end">
          <AppButton leftIcon={<Check className="w-4 h-4" />}>
            Xác nhận xếp phòng
          </AppButton>
        </div>
      </div>
    </div>
  );
}
