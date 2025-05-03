import { Navigate, Route, Routes } from 'react-router';

import { LandingPage } from '../pages';

export function RoutesApp() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />

      {/* Redireciona qualquer rota desconhecida para a página inicial */}
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}
