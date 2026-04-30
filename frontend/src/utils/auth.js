export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('joblyhubUser') || 'null');
  } catch {
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('joblyhubToken');
};

export const isLoggedIn = () => {
  return Boolean(getStoredToken() && getStoredUser());
};

export const getDashboardPath = (role) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'employer') return '/employer/dashboard';
  if (role === 'job_seeker') return '/job-seeker/dashboard';

  return '/';
};

export const logoutUser = () => {
  localStorage.removeItem('joblyhubToken');
  localStorage.removeItem('joblyhubUser');
};