import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import { APP_ROUTES, ROLES } from '@campusstay/constants';

export function RoleRedirect() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to={APP_ROUTES.AUTH.LOGIN} replace />;
  }

  switch (user.role) {
    case ROLES.STUDENT:
      return <Navigate to={APP_ROUTES.STUDENT.DASHBOARD} replace />;
    case ROLES.STAFF:
      return <Navigate to={APP_ROUTES.STAFF.DASHBOARD} replace />;
    case ROLES.MANAGER:
      return <Navigate to={APP_ROUTES.MANAGER.DASHBOARD} replace />;
    case ROLES.ADMIN:
      return <Navigate to={APP_ROUTES.ADMIN.DASHBOARD} replace />;
    default:
      return <Navigate to={APP_ROUTES.AUTH.LOGIN} replace />;
  }
}
