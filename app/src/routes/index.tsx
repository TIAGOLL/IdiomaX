import { Route, Routes } from 'react-router';

import { SignIn } from '../pages/auth/sign-in';
import { PrivateRoute } from './private-route';
import { Dashboard } from '@/pages/dashboard';
import { SignUp } from '@/pages/auth/sign-up';
import { AuthLayout } from './auth-layout';
import ProfilePage from '@/pages/profile';
import ResetPassword from '@/pages/auth/reset-password';
import SelectPlan from '@/pages/subscription/select-plan';

export function RoutesApp() {

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/auth/sign-in' element={<SignIn />} />
        <Route path='/auth/sign-up' element={<SignUp />} />
        <Route path='/auth/reset-password/:token' element={<ResetPassword />} />
      </Route>
      <Route element={<PrivateRoute />}>
        {/* ADMIN, TEACHER e STUDENT IRÃO DIVIDIR A MESMA DASHBOARD */}
        <Route path='/select-plan' element={<SelectPlan />} />
        <Route index element={<Dashboard />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
