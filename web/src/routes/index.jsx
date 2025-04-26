import { Route, Routes } from 'react-router';

import SignIn from '../pages/sign-in';

export function RoutesApp() {
  return (
    <Routes>
      <Route path='/auth/sign-in' element={<SignIn />} />
    </Routes>
  );
}
