import type { RouteObject } from 'react-router-dom';
import { RequirePermission } from '../guards/RequirePermission';
import {
  StaffDashboardPage,
  StaffInventoryPage,
  StaffApplicationsPage,
  StaffRoomAssignmentPage,
  StaffRoomTransfersPage,
  StaffCheckinOutPage,
  StaffInspectionsPage,
  StaffMaintenancePage,
  StaffBroadcastPage,
} from '@pages/staff';

const wrap = (elem: React.ReactNode) => (
  <RequirePermission permission="inventory:manage">{elem}</RequirePermission>
);

export const staffRoutes: RouteObject[] = [
  { path: '/staff/dashboard', element: wrap(<StaffDashboardPage />) },
  { path: '/staff/inventory', element: wrap(<StaffInventoryPage />) },
  { path: '/staff/applications', element: wrap(<StaffApplicationsPage />) },
  { path: '/staff/room-assignment', element: wrap(<StaffRoomAssignmentPage />) },
  { path: '/staff/room-transfers', element: wrap(<StaffRoomTransfersPage />) },
  { path: '/staff/checkin-out', element: wrap(<StaffCheckinOutPage />) },
  { path: '/staff/inspections', element: wrap(<StaffInspectionsPage />) },
  { path: '/staff/maintenance', element: wrap(<StaffMaintenancePage />) },
  { path: '/staff/broadcast', element: wrap(<StaffBroadcastPage />) },
];
