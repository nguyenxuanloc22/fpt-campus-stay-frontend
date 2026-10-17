import { Save } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function AdminRulesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Cấu Hình Luật Điều Kiện Xét Tuyển</h1>
        <p className="text-xs text-slate-500 mt-1">Thiết lập trọng số và điểm ưu tiên xét duyệt chỗ ở KTX Tân Uyên</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Khoảng cách địa lý tối thiểu (Km)</label>
          <input type="number" defaultValue={50} className="w-full px-3 py-2 border rounded-lg" />
          <span className="text-[11px] text-slate-400">Sinh viên có hộ khẩu cách trường &gt; 50km được cộng 40 điểm</span>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Ưu tiên tân sinh viên K20</label>
          <input type="number" defaultValue={30} className="w-full px-3 py-2 border rounded-lg" />
          <span className="text-[11px] text-slate-400">Cộng 30 điểm cho sinh viên khóa mới</span>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Điểm rèn luyện tối thiểu</label>
          <input type="number" defaultValue={70} className="w-full px-3 py-2 border rounded-lg" />
          <span className="text-[11px] text-slate-400">Không xét duyệt nếu điểm rèn luyện kỳ trước &lt; 70</span>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <AppButton size="sm" leftIcon={<Save className="w-4 h-4" />}>
            Lưu cấu hình
          </AppButton>
        </div>
      </div>
    </div>
  );
}
