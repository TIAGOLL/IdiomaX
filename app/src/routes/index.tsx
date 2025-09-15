import { Route, Routes } from 'react-router';

import { SignIn } from '../pages/auth/sign-in';
import { PrivateRoute } from './private-route';
import { Dashboard } from '@/pages/dashboard';
import { SignUp } from '@/pages/auth/sign-up';
import { AuthLayout } from './auth-layout';
import ProfilePage from '@/pages/profile';

export function RoutesApp() {

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/auth/sign-in' element={<SignIn />} />
        <Route path='/auth/sign-up' element={<SignUp />} />
      </Route>
      <Route element={<PrivateRoute />}>
        <Route index element={<Dashboard />} />
        {/* ADMIN, TEACHER e STUDENT IRÃO DIVIDIR A MESMA DASHBOARD */}
        <Route path='/profile' element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
