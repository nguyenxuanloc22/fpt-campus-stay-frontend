import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';
import { HomePage } from '@pages/public/HomePage';
import { LoginPage } from '@pages/auth/LoginPage';
import { ForbiddenPage } from '@pages/errors/ForbiddenPage';
import { NotFoundPage } from '@pages/errors/NotFoundPage';
import { AppLayout } from '../layouts/AppLayout';
import { RequireAuth } from '../guards/RequireAuth';
import { lazyPage } from './lazyPage';
import { studentRoutes } from './studentRoutes';
import { staffRoutes } from './staffRoutes';
import { managerRoutes } from './managerRoutes';
import { adminRoutes } from './adminRoutes';

const loadNotifications = () => import('@pages/common/GeneralNotificationsPage');
const loadProfile = () => import('@pages/common/ProfilePage');

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: APP_ROUTES.AUTH.LOGIN, element: <LoginPage /> },
  { path: APP_ROUTES.AUTH.FORBIDDEN, element: <ForbiddenPage /> },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      // Trang dùng chung cho mọi vai trò
      { path: APP_ROUTES.COMMON.NOTIFICATIONS, element: lazyPage(loadNotifications, 'GeneralNotificationsPage') },
      { path: APP_ROUTES.COMMON.PROFILE, element: lazyPage(loadProfile, 'ProfilePage') },
      ...studentRoutes,
      ...staffRoutes,
      ...managerRoutes,
      ...adminRoutes,
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
