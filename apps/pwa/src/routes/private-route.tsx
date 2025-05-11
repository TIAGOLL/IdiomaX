import { Navigate, Outlet, useLocation } from 'react-router';
import { isAuthenticated } from '../ultis/isAuthenticated';

export function PrivateRoute() {
  const location = useLocation();

  return isAuthenticated() ? <Outlet /> : <Navigate to='/' state={{ from: location }} replace />;
}
