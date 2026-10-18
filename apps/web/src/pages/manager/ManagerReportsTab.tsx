// Tab “Báo cáo” của ManagerPortal — Monitor Occupancy & Reports.
import { MANAGER_GOVERNANCE_DATA } from './managerMockData';
import { t } from '@shared-ui';

export function ManagerReportsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-bold text-ink">{t('Occupancy monitoring & management reports')}</h2>
        <p className="text-xs text-ink-muted mt-0.5">
          {t('Operational indicators for the FPT University Tan Uyen dormitory')}
        </p>
      </div>

      {/* Top Governance KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{t('Overall occupancy rate')}</div>
          <div className="text-2xl font-bold text-ink mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.occupancyRate}%
          </div>
          <p className="text-label text-emerald-600 mt-1 font-medium">
            {MANAGER_GOVERNANCE_DATA.overview.occupiedBeds} / {MANAGER_GOVERNANCE_DATA.overview.totalBeds} {t('beds')}
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{t('Semester revenue')}</div>
          <div className="text-2xl font-bold text-brand-ink mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.revenueSemesterBillion} {t('billion ₫')}
          </div>
          <p className="text-label text-emerald-600 mt-1 font-medium">
            {t('Actual collection rate:')} {MANAGER_GOVERNANCE_DATA.overview.collectedPercentage}%
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{t('SLA commitment compliance')}</div>
          <div className="text-2xl font-bold text-ink mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.slaComplianceRate}%
          </div>
          <p className="text-label text-ink-muted mt-1 font-medium">
            {t('Technical incidents resolved on time')}
          </p>
        </div>

        <div className="bg-surface p-5 rounded-2xl border border-line/80 shadow-xs">
          <div className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{t('Overdue invoices')}</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {MANAGER_GOVERNANCE_DATA.overview.overdueInvoicesCount} SV
          </div>
          <p className="text-label text-rose-600 mt-1 font-medium">
            {t('Installment 2 payment reminders sent')}
          </p>
        </div>
      </div>

      {/* Building Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-ink">{t('Capacity by building')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MANAGER_GOVERNANCE_DATA.buildings.map((b) => (
            <div
              key={b.code}
              className="bg-surface rounded-2xl border border-line/80 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-ink text-white font-bold text-sm flex items-center justify-center">
                    {b.code}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink">{b.name} ({t(b.gender)})</h4>
                    <p className="text-xs text-ink-muted">{t('Expected revenue:')} {(b.revenueMillionVnd / 1000).toFixed(2)} {t('billion ₫')}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-brand-ink">{b.occupancyRate}%</span>
                  <div className="text-label text-ink-subtle">{t('occupied')}</div>
                </div>
              </div>

              {/* Visual Progress bar */}
              <div className="w-full bg-surface-sunken rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-fill h-full rounded-full transition-all"
                  style={{ width: `${b.occupancyRate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-ink-muted pt-1">
                <span>{t('Occupied:')} <strong className="text-ink">{b.occupiedBeds}</strong>/{b.totalBeds} {t('beds')}</span>
                <span>{t('Maintenance:')} <strong className="text-rose-600">{b.maintenanceBeds}</strong></span>
                <span>{t('Free:')} <strong className="text-emerald-600">{b.totalBeds - b.occupiedBeds}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
