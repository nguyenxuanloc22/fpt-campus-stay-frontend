export function ManagerReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Báo Cáo Vận Hành & Phân Tích Công Suất</h1>
        <p className="text-xs text-slate-500 mt-1">Dữ liệu phân tích tỷ lệ lấp đầy, doanh thu và biến động cư dân qua các kỳ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Tỷ lệ lấp đầy theo tòa nhà</h3>
            <span className="text-xs text-slate-400">Tháng 10/2026</span>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 font-semibold"><span>Tòa A (Nam)</span><span>94% (376/400)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-[#F26F21] h-full" style={{ width: '94%' }} /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1 font-semibold"><span>Tòa B (Nam)</span><span>88% (352/400)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-600 h-full" style={{ width: '88%' }} /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1 font-semibold"><span>Tòa C (Nữ)</span><span>86% (347/400)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-purple-600 h-full" style={{ width: '86%' }} /></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Doanh thu lưu trú theo kỳ (Tỷ VND)</h3>
            <span className="text-xs text-slate-400">2025 - 2026</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Spring 2026</span>
              <span className="font-bold text-slate-700 text-sm">1.12 tỷ ₫</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block">Summer 2026</span>
              <span className="font-bold text-slate-700 text-sm">0.98 tỷ ₫</span>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <span className="text-[#F26F21] block font-semibold">Fall 2026 (Hiện tại)</span>
              <span className="font-bold text-[#F26F21] text-sm">1.28 tỷ ₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
