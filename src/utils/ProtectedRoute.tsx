import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = sessionStorage.getItem('Authorization');

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" />;
};

export default ProtectedRoute;
