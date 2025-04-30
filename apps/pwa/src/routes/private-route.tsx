import { isAuthenticated } from '@idiomax/utils/auth';
import { Navigate, Outlet, useLocation } from 'react-router';

export function PrivateRoute() {
  const location = useLocation();

  return isAuthenticated() ? <Outlet /> : <Navigate to='/' state={{ from: location }} replace />;
}
