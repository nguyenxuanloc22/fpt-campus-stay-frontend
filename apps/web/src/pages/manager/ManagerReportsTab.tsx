// Tab “Báo cáo” của ManagerPortal — Monitor Occupancy & Reports.
import { MANAGER_GOVERNANCE_DATA } from './managerMockData';

export function ManagerReportsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-[#1A365D]">Giám Sát Công Suất Lưu Trú & Báo Cáo Quản Trị</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Chỉ số vận hành toàn diện KTX FPT University Tân Uyên
        </p>
      </div>

      {/* Top Governance KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tỷ lệ lấp đầy tổng thể</div>
          <div className="text-2xl font-bold text-[#1A365D] mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.occupancyRate}%
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            {MANAGER_GOVERNANCE_DATA.overview.occupiedBeds} / {MANAGER_GOVERNANCE_DATA.overview.totalBeds} giường
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Doanh thu học kỳ</div>
          <div className="text-2xl font-bold text-[#F26522] mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.revenueSemesterBillion} tỷ ₫
          </div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">
            Tỷ lệ thu thực tế: {MANAGER_GOVERNANCE_DATA.overview.collectedPercentage}%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tuân thủ cam kết SLA</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.slaComplianceRate}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            Xử lý sự cố kỹ thuật đúng hẹn
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hóa đơn quá hạn</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.overdueInvoicesCount} SV
          </div>
          <p className="text-[11px] text-rose-600 mt-1 font-medium">
            Đã gửi thông báo nhắc nợ đợt 2
          </p>
        </div>
      </div>

      {/* Building Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#1A365D]">Công suất theo từng tòa nhà</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MANAGER_GOVERNANCE_DATA.buildings.map((b) => (
            <div
              key={b.code}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#1A365D] text-white font-bold text-sm flex items-center justify-center">
                    {b.code}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{b.name} ({b.gender})</h4>
                    <p className="text-xs text-slate-500">Doanh thu dự kiến: {(b.revenueMillionVnd / 1000).toFixed(2)} tỷ ₫</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-[#F26522]">{b.occupancyRate}%</span>
                  <div className="text-[11px] text-slate-400">lấp đầy</div>
                </div>
              </div>

              {/* Visual Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#F26522] h-full rounded-full transition-all"
                  style={{ width: `${b.occupancyRate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Đã ở: <strong className="text-slate-800">{b.occupiedBeds}</strong>/{b.totalBeds} giường</span>
                <span>Bảo trì: <strong className="text-rose-600">{b.maintenanceBeds}</strong></span>
                <span>Trống: <strong className="text-emerald-600">{b.totalBeds - b.occupiedBeds}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
