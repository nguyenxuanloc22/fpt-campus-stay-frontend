import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from '@pages/auth/LoginPage';
import { ForbiddenPage } from '@pages/errors/ForbiddenPage';
import { NotFoundPage } from '@pages/errors/NotFoundPage';
import { AppLayout } from '../layouts/AppLayout';
import { RequireAuth } from '../guards/RequireAuth';
import { RoleRedirect } from '../guards/RoleRedirect';
import { studentRoutes } from './studentRoutes';
import { staffRoutes } from './staffRoutes';
import { managerRoutes } from './managerRoutes';
import { adminRoutes } from './adminRoutes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleRedirect />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/403',
    element: <ForbiddenPage />,
  },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      ...studentRoutes,
      ...staffRoutes,
      ...managerRoutes,
      ...adminRoutes,
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
