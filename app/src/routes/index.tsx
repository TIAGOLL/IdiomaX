import { Navigate, Route, Routes } from 'react-router';

import SignIn from '../pages/sign-in';
import { PrivateRoute } from './private-route';
import { Dashboard } from '@/pages/dashboard';

export function RoutesApp() {
  return (
    <Routes>
      <Route index element={<Navigate to="/auth/sign-in" replace />} />
      <Route path='/auth/sign-in' element={<SignIn />} />
      <Route element={<PrivateRoute />}>
        <Route path='/admin/dashboard' element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
