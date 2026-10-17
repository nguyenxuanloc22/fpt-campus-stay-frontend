import type { RouteObject } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import { RequirePermission } from '../guards/RequirePermission';
import { lazyPage } from './lazyPage';

const load = () => import('@pages/admin');
const page = (name: Parameters<typeof lazyPage<Awaited<ReturnType<typeof load>>>>[1]) => (
  <RequirePermission permission="config:system">{lazyPage(load, name)}</RequirePermission>
);

const R = APP_ROUTES.ADMIN;

export const adminRoutes: RouteObject[] = [
  { path: R.DASHBOARD, element: page('AdminDashboardPage') },
  { path: R.SEMESTERS, element: page('AdminSemestersPage') },
  { path: R.RULES, element: page('AdminRulesPage') },
  { path: R.PRICING, element: page('AdminPricingPage') },
  { path: R.ALLOCATION_ENGINE, element: page('AdminAllocationEnginePage') },
  { path: R.INTEGRATIONS, element: page('AdminIntegrationsPage') },
  { path: R.USERS, element: page('AdminUsersPage') },
  { path: R.REPORTS, element: page('AdminReportsPage') },
  { path: R.AUDIT_LOGS, element: page('AdminAuditLogsPage') },
];
