import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const routeTitles = {
  '/': 'Home',
  '/jobs': 'Jobs',
  '/login': 'Login',
  '/register': 'Create Account',
  '/register/employer': 'Employer Registration',
  '/register/job-seeker': 'Job Seeker Registration',
  '/admin/dashboard': 'Admin Dashboard',
  '/employer/dashboard': 'Employer Dashboard',
  '/employer/post-job': 'Post a Job',
  '/employer/applications': 'Applications',
  '/job-seeker/dashboard': 'Job Seeker Dashboard',
  '/about': 'About',
  '/help': 'Help Center',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms and Conditions',
  '/commitment': 'Our Commitment',
  '/safety': 'Safety',
  '/contact': 'Contact',
  '/how-it-works': 'How It Works',
};

export default function RouteTitle() {
  const location = useLocation();

  useEffect(() => {
    let title = routeTitles[location.pathname];

    if (location.pathname.startsWith('/jobs/')) {
      title = 'Job Details';
    }

    if (location.pathname.startsWith('/employer/edit-job/')) {
      title = 'Edit Job';
    }

    document.title = title ? `${title} | JoblyHub` : 'JoblyHub';
  }, [location.pathname]);

  return null;
}