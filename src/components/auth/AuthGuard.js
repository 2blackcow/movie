import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const tmdbApiKey = localStorage.getItem('TMDB-Key');
  
  if (!isAuthenticated || !tmdbApiKey) {
    return <Navigate to="/signin" replace />;
  }
  
  return children;
};

export default AuthGuard;