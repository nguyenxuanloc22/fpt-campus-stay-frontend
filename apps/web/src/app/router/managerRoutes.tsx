import type { RouteObject } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import type { Permission } from '@campusstay/permissions';
import { RequirePermission } from '../guards/RequirePermission';
import { lazyPage } from './lazyPage';

const load = () => import('@pages/manager');
const page = (name: Parameters<typeof lazyPage<Awaited<ReturnType<typeof load>>>>[1], permission: Permission) => (
  <RequirePermission permission={permission}>{lazyPage(load, name)}</RequirePermission>
);

const R = APP_ROUTES.MANAGER;

/** Mỗi trang kiểm tra đúng quyền phê duyệt tương ứng (docs/PERMISSION_MATRIX.md §2). */
export const managerRoutes: RouteObject[] = [
  { path: R.DASHBOARD, element: page('ManagerDashboardPage', 'report:operational') },
  { path: R.APPROVALS, element: page('ManagerApprovalsPage', 'room_change:approve') },
  { path: R.ASSIGNMENT_APPROVAL, element: page('ManagerAssignmentApprovalPage', 'assignment:approve_batch') },
  { path: R.REPORTS, element: page('ManagerReportsPage', 'report:financial') },
];
