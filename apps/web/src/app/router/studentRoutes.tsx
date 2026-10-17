import type { RouteObject } from 'react-router-dom';
import {
  StudentDashboardPage,
  StudentRegistrationPage,
  StudentRoomsPage,
  StudentRoommatesPage,
  StudentContractPage,
  StudentInvoicesPage,
  StudentRequestsPage,
  StudentCheckinPage,
  StudentNotificationsPage,
  StudentProfilePage,
} from '@pages/student';

export const studentRoutes: RouteObject[] = [
  { path: '/student/dashboard', element: <StudentDashboardPage /> },
  { path: '/student/registration', element: <StudentRegistrationPage /> },
  { path: '/student/rooms', element: <StudentRoomsPage /> },
  { path: '/student/roommates', element: <StudentRoommatesPage /> },
  { path: '/student/contract', element: <StudentContractPage /> },
  { path: '/student/invoices', element: <StudentInvoicesPage /> },
  { path: '/student/requests', element: <StudentRequestsPage /> },
  { path: '/student/checkin', element: <StudentCheckinPage /> },
  { path: '/student/notifications', element: <StudentNotificationsPage /> },
  { path: '/student/profile', element: <StudentProfilePage /> },
];
