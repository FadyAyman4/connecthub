import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, token, isAuthenticated, authChecked, loading, error } = useSelector(
    (state) => state.auth
  );
  return { user, token, isAuthenticated, authChecked, loading, error };
};

export default useAuth;