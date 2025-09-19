import { Route, Routes } from 'react-router';

import { SignInPage } from '../pages/auth/sign-in';
import { PrivateRoute } from './private-route';
import { DashboardPage } from '@/pages/dashboard';
import { SignUpPage } from '@/pages/auth/sign-up';
import ProfilePage from '@/pages/profile';
import { CreateCompanyPage } from '@/pages/subscription/create-company';
import SelectPlanPage from '@/pages/subscription/select-plan';
import ResetPasswordPage from '@/pages/auth/reset-password';
import { PaidRoute } from './paid-route';
import CongratulationsPage from '@/pages/subscription/congratulations';
import { FinanceDashboard } from '@/pages/finances';

export function RoutesApp() {

  return (
    <Routes>
      <Route path='/auth/sign-in' element={<SignInPage />} />
      <Route path='/auth/sign-up' element={<SignUpPage />} />
      <Route path='/auth/reset-password/:token' element={<ResetPasswordPage />} />
      <Route element={<PrivateRoute />}>
        {/* ADMIN, TEACHER e STUDENT IRÃO DIVIDIR A MESMA DASHBOARD */}
        <Route path='/auth/create-company' element={<CreateCompanyPage />} />
        <Route path='/auth/select-plan' element={<SelectPlanPage />} />
        <Route path='/congratulations' element={<CongratulationsPage />} />

        <Route element={<PaidRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/finances' element={<FinanceDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
