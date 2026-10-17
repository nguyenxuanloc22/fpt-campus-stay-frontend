import type { RouteObject } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import { RequirePermission } from '../guards/RequirePermission';
import { lazyPage } from './lazyPage';

const load = () => import('@pages/staff');
const page = (name: Parameters<typeof lazyPage<Awaited<ReturnType<typeof load>>>>[1]) => (
  <RequirePermission permission="inventory:manage">{lazyPage(load, name)}</RequirePermission>
);

const R = APP_ROUTES.STAFF;

export const staffRoutes: RouteObject[] = [
  { path: R.DASHBOARD, element: page('StaffDashboardPage') },
  { path: R.INVENTORY, element: page('StaffInventoryPage') },
  { path: R.APPLICATIONS, element: page('StaffApplicationsPage') },
  { path: R.ASSIGNMENT, element: page('StaffAssignmentPage') },
  { path: R.ROOM_CHANGES, element: page('StaffRoomChangesPage') },
  { path: R.CHECKIN_OUT, element: page('StaffCheckinOutPage') },
  { path: R.MAINTENANCE, element: page('StaffMaintenancePage') },
  { path: R.BROADCAST, element: page('StaffBroadcastPage') },
];
