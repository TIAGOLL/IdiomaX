import { Navigate } from 'react-router-dom';

export default function Private({ children }) {
  const loading = false;

  const user = {
    admin: false,
    signed: true,
    email: 'tiago@teste.com',
  };

  if (loading) {
    return <div></div>;
  }

  if (user?.admin == true) {
    return <Navigate to='/admin/dashboard' />;
  }

  if (!user.signed || !user.email || !user) {
    return <Navigate to='/' />;
  }

  return children;
}
