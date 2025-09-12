import { Navigate, Route, Routes } from 'react-router';

import SignIn from '../pages/sign-in';
import { PrivateRoute } from './private-route';
import { Dashboard } from '@/pages/dashboard';

export function RoutesApp() {

  return (
    <Routes>
      <Route path='/auth/sign-in' element={<SignIn />} />
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route element={<PrivateRoute />}>
        {/* ADMIN, TEACHER e STUDENT IRÃO DIVIDIR A MESMA DASHBOARD */}
        <Route path='/dashboard' element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
