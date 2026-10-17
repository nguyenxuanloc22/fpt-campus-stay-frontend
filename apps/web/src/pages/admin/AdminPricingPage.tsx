import { Save } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function AdminPricingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Quản Lý Bảng Giá Phòng & Dịch Vụ</h1>
        <p className="text-xs text-slate-500 mt-1">Đơn giá áp dụng cho các loại phòng tại ký túc xá</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Phòng 4 Giường (Máy lạnh) / tháng</label>
          <input type="text" defaultValue="1.200.000 ₫" className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Phòng 6 Giường (Tiêu chuẩn) / tháng</label>
          <input type="text" defaultValue="800.000 ₫" className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Tiền cọc cơ sở vật chất (hoàn lại)</label>
          <input type="text" defaultValue="1.000.000 ₫" className="w-full px-3 py-2 border rounded-lg" />
        </div>
        <div className="pt-2 flex justify-end">
          <AppButton size="sm" leftIcon={<Save className="w-4 h-4" />}>Cập nhật bảng giá</AppButton>
        </div>
      </div>
    </div>
  );
}
