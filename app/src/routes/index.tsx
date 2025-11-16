import { Outlet, Route, Routes } from 'react-router';

import { SignInPage } from '../pages/auth/sign-in';
import { PrivateRoute } from './private-route';
import { DashboardPage } from '@/pages/dashboard';
import { SignUpPage } from '@/pages/auth/sign-up';
import ProfilePage from '@/pages/profile';
import { CreateCompanyPage } from '@/pages/subscription/create-company';
import { SelectPlanPage } from '@/pages/subscription/select-plan';
import ResetPasswordPage from '@/pages/auth/reset-password';
import { PaidRoute } from './paid-route';
import CongratulationsPage from '@/pages/subscription/congratulations';
import { FinanceDashboard } from '@/pages/company';
import UsersPage from '@/pages/users';
import CoursesPage from '@/pages/courses';
import RegistrationsPage from '@/pages/registrations';
import LessonsPage from '@/pages/lessons';
import { ClassesPage } from '@/pages/classes';
import { TasksPage } from '@/pages/tasks';
import { ClassGradesPage, StudentGradesPage } from '@/pages/grades';

export function RoutesApp() {

  return (
    <Routes>
      <Route path='/auth/sign-in' element={<SignInPage />} />
      <Route path='/auth/sign-up' element={<SignUpPage />} />
      <Route path='/auth/reset-password/:token' element={<ResetPasswordPage />} />
      <Route element={<PrivateRoute />}>
        <Route element={
          <div className='min-h-screen flex'>
            <Outlet />
          </div>}>
          <Route path='/auth/create-company' element={<CreateCompanyPage />} />
          <Route path='/auth/select-plan' element={<SelectPlanPage />} />
          <Route path='/congratulations' element={<CongratulationsPage />} />
        </Route>

        <Route element={<PaidRoute />}>
          <Route element={
            <div className='min-h-[calc(100vh-48px)] flex flex-1'>
              <Outlet />
            </div>
          }>
            <Route index element={<DashboardPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/my-company' element={<FinanceDashboard />} />
            <Route path='/admin/users' element={<UsersPage />} />
            <Route path='/admin/courses' element={<CoursesPage />} />
            <Route path='/admin/classes' element={<ClassesPage />} />
            <Route path='/admin/classes/notes' element={<ClassGradesPage />} />
            <Route path='/admin/registrations' element={<RegistrationsPage />} />
            <Route path='/admin/lessons' element={<LessonsPage />} />
            <Route path='/admin/tasks' element={<TasksPage />} />
            <Route path='/notes' element={<StudentGradesPage />} />
          </Route>
        </Route>
      </Route>
    </Routes >
  );
}
