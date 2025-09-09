import { isAuthenticated } from '@/hooks/is-authenticated';
import { Navigate, Outlet, useLocation } from 'react-router';


export function PrivateRoute() {
  const location = useLocation();

  return isAuthenticated() ? <Outlet /> : <Navigate to='/auth/sign-in' state={{ from: location }} replace />;
}
