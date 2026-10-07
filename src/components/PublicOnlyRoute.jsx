import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useAuth();

  if (!authChecked) return <p>Loading...</p>;
  if (isAuthenticated) return <Navigate to="/home" replace />;
  return children;
};

export default PublicOnlyRoute;