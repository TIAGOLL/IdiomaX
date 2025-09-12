import { Navigate, Route, Routes } from 'react-router';

import SignIn from '../pages/sign-in';
import { PrivateRoute } from './private-route';
import { Dashboard } from '@/pages/dashboard';

export function RoutesApp() {
  return (
    <Routes>
      <Route element={() => window.location.href.includes('/auth') ? <Navigate to="/" /> : <Navigate to="/admin" replace />}>
        <Route path='/auth/sign-in' element={<SignIn />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route path='/admin' element={<Dashboard />} />
        <Route index element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
