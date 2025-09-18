import { Route, Routes } from 'react-router';

import { SignInPage } from '../pages/auth/sign-in';
import { PrivateRoute } from './private-route';
import { DashboardPage } from '@/pages/dashboard';
import { SignUpPage } from '@/pages/auth/sign-up';
import { AuthLayout } from './auth-layout';
import ProfilePage from '@/pages/profile';
import { CreateCompanyPage } from '@/pages/subscription/create-company';
import SelectPlanPage from '@/pages/subscription/select-plan';
import ResetPasswordPage from '@/pages/auth/reset-password';

export function RoutesApp() {

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/auth/sign-in' element={<SignInPage />} />
        <Route path='/auth/sign-up' element={<SignUpPage />} />
        <Route path='/auth/reset-password/:token' element={<ResetPasswordPage />} />
      </Route>
      <Route element={<PrivateRoute />}>
        {/* ADMIN, TEACHER e STUDENT IRÃO DIVIDIR A MESMA DASHBOARD */}
        <Route path='/select-plan' element={<SelectPlanPage />} />
        <Route index element={<DashboardPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/create-company' element={<CreateCompanyPage />} />
      </Route>
    </Routes>
  );
}
