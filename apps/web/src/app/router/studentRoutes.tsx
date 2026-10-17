import type { RouteObject } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import { RequirePermission } from '../guards/RequirePermission';
import { lazyPage } from './lazyPage';

const load = () => import('@pages/student');
const page = (name: Parameters<typeof lazyPage<Awaited<ReturnType<typeof load>>>>[1]) => (
  <RequirePermission permission="application:create">{lazyPage(load, name)}</RequirePermission>
);

const R = APP_ROUTES.STUDENT;

export const studentRoutes: RouteObject[] = [
  { path: R.DASHBOARD, element: page('StudentDashboardPage') },
  { path: R.REGISTRATION, element: page('StudentRegistrationPage') },
  { path: R.MY_ROOM, element: page('StudentMyRoomPage') },
  { path: R.INVOICES, element: page('StudentInvoicesPage') },
  { path: R.REQUESTS, element: page('StudentRequestsPage') },
  { path: R.CHECKIN, element: page('StudentCheckinPage') },
];
