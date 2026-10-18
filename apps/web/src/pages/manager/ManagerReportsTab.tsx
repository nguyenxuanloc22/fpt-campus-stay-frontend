// Tab “Báo cáo” của ManagerPortal — Monitor Occupancy & Reports.
import { MANAGER_GOVERNANCE_DATA } from './managerMockData';

export function ManagerReportsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-ink">Giám Sát Công Suất Lưu Trú & Báo Cáo Quản Trị</h2>
        <p className="text-xs text-ink-muted mt-0.5">
          Chỉ số vận hành toàn diện KTX FPT University Tân Uyên
        </p>
      </div>

      {/* Top Governance KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Tỷ lệ lấp đầy tổng thể</div>
          <div className="text-2xl font-bold text-ink mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.occupancyRate}%
          </div>
          <p className="text-label text-emerald-600 mt-1 font-medium">
            {MANAGER_GOVERNANCE_DATA.overview.occupiedBeds} / {MANAGER_GOVERNANCE_DATA.overview.totalBeds} giường
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Doanh thu học kỳ</div>
          <div className="text-2xl font-bold text-brand-ink mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.revenueSemesterBillion} tỷ ₫
          </div>
          <p className="text-label text-emerald-600 mt-1 font-medium">
            Tỷ lệ thu thực tế: {MANAGER_GOVERNANCE_DATA.overview.collectedPercentage}%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Tuân thủ cam kết SLA</div>
          <div className="text-2xl font-bold text-ink mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.slaComplianceRate}%
          </div>
          <p className="text-label text-ink-muted mt-1 font-medium">
            Xử lý sự cố kỹ thuật đúng hẹn
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Hóa đơn quá hạn</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.overdueInvoicesCount} SV
          </div>
          <p className="text-label text-rose-600 mt-1 font-medium">
            Đã gửi thông báo nhắc nợ đợt 2
          </p>
        </div>
      </div>

      {/* Building Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-ink">Công suất theo từng tòa nhà</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MANAGER_GOVERNANCE_DATA.buildings.map((b) => (
            <div
              key={b.code}
              className="bg-white rounded-2xl border border-line/80 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-ink text-white font-bold text-sm flex items-center justify-center">
                    {b.code}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink">{b.name} ({b.gender})</h4>
                    <p className="text-xs text-ink-muted">Doanh thu dự kiến: {(b.revenueMillionVnd / 1000).toFixed(2)} tỷ ₫</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-brand-ink">{b.occupancyRate}%</span>
                  <div className="text-label text-ink-subtle">lấp đầy</div>
                </div>
              </div>

              {/* Visual Progress bar */}
              <div className="w-full bg-surface-sunken rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-ink h-full rounded-full transition-all"
                  style={{ width: `${b.occupancyRate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-ink-muted pt-1">
                <span>Đã ở: <strong className="text-ink">{b.occupiedBeds}</strong>/{b.totalBeds} giường</span>
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
