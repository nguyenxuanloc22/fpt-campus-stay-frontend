export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Hệ Thống Quản Trị Hệ Thống (System Admin)</h1>
        <p className="text-xs text-slate-500 mt-1">Cấu hình tham số, kết nối API SIS & VietQR, giám sát engine xếp phòng và audit log</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Trạng thái hệ thống</div>
          <div className="text-xl font-bold text-emerald-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            100% Khả dụng
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Uptime: 99.98%</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Tài khoản kích hoạt</div>
          <div className="text-2xl font-bold text-slate-800">1,540 users</div>
          <div className="text-[11px] text-slate-400 mt-1">1.480 sinh viên, 60 cán bộ</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Kết nối SIS FPT</div>
          <div className="text-xl font-bold text-blue-600">Đã đồng bộ</div>
          <div className="text-[11px] text-slate-400 mt-1">Lần cuối: 10 phút trước</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Cổng VietQR NAPAS</div>
          <div className="text-xl font-bold text-emerald-600">Hoạt động tốt</div>
          <div className="text-[11px] text-slate-400 mt-1">Webhook IPN: Sẵn sàng</div>
        </div>
      </div>
    </div>
  );
}
