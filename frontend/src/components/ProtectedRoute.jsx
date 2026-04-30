import { Navigate } from 'react-router-dom';
import { getDashboardPath, getStoredUser, isLoggedIn } from '../utils/auth';

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getStoredUser();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return children;
}