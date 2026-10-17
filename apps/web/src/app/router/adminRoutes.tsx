import type { RouteObject } from 'react-router-dom';
import { RequirePermission } from '../guards/RequirePermission';
import {
  AdminDashboardPage,
  AdminSemestersPage,
  AdminRulesPage,
  AdminPricingPage,
  AdminAllocationEnginePage,
  AdminBatchRunsPage,
  AdminIntegrationsPage,
  AdminUsersPage,
  AdminFinancePage,
  AdminAuditLogsPage,
} from '@pages/admin';

const wrap = (elem: React.ReactNode) => (
  <RequirePermission permission="config:system">{elem}</RequirePermission>
);

export const adminRoutes: RouteObject[] = [
  { path: '/admin/dashboard', element: wrap(<AdminDashboardPage />) },
  { path: '/admin/semesters', element: wrap(<AdminSemestersPage />) },
  { path: '/admin/rules', element: wrap(<AdminRulesPage />) },
  { path: '/admin/pricing', element: wrap(<AdminPricingPage />) },
  { path: '/admin/allocation-engine', element: wrap(<AdminAllocationEnginePage />) },
  { path: '/admin/batch-runs', element: wrap(<AdminBatchRunsPage />) },
  { path: '/admin/integrations', element: wrap(<AdminIntegrationsPage />) },
  { path: '/admin/users', element: wrap(<AdminUsersPage />) },
  { path: '/admin/finance', element: wrap(<AdminFinancePage />) },
  { path: '/admin/audit-logs', element: wrap(<AdminAuditLogsPage />) },
];
