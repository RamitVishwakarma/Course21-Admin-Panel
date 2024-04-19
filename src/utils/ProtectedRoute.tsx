import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = sessionStorage.getItem('Authorisation');

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;
