import { Navigate } from 'react-router-dom';
import { getDashboardPath, getStoredUser, isLoggedIn } from '../utils/auth';

export default function PublicOnlyRoute({ children }) {
  const user = getStoredUser();

  if (isLoggedIn()) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return children;
}