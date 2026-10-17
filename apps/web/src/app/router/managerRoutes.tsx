import type { RouteObject } from 'react-router-dom';
import { RequirePermission } from '../guards/RequirePermission';
import {
  ManagerDashboardPage,
  ManagerExceptionsPage,
  ManagerBatchApprovalPage,
  ManagerReportsPage,
  ManagerStaffPerformancePage,
} from '@pages/manager';

const wrap = (elem: React.ReactNode) => (
  <RequirePermission permission="report:operational">{elem}</RequirePermission>
);

export const managerRoutes: RouteObject[] = [
  { path: '/manager/dashboard', element: wrap(<ManagerDashboardPage />) },
  { path: '/manager/exceptions', element: wrap(<ManagerExceptionsPage />) },
  { path: '/manager/batch-approval', element: wrap(<ManagerBatchApprovalPage />) },
  { path: '/manager/reports', element: wrap(<ManagerReportsPage />) },
  { path: '/manager/staff-performance', element: wrap(<ManagerStaffPerformancePage />) },
];
