import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/hooks/is-authenticated';
import { Navigate, Outlet, useLocation } from 'react-router';

export function PrivateRoute() {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState<boolean | null>(true);

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, []);

  if (!isAuth) return <Navigate to='/auth/sign-in' state={{ from: location }} replace />;

  return <Outlet />;
}
