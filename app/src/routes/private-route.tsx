import { useEffect, useState } from 'react';
import { isAuthenticated } from '@/hooks/is-authenticated';
import { Navigate, Outlet, useLocation } from 'react-router';

export function PrivateRoute() {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setIsAuth);
  }, []);

  if (isAuth === null) return null;

  return isAuth ? <Outlet /> : <Navigate to='/auth/sign-in' state={{ from: location }} replace />;
}
