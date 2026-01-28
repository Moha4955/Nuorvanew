import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect: React.FC = () => {
  const { user } = useAuth();

  console.log('🔄 DashboardRedirect: Determining redirect path', {
    hasUser: !!user,
    role: user?.role,
    profileComplete: user?.profile_complete
  });

  if (!user) {
    console.log('🔄 DashboardRedirect: No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  let redirectPath: string;

  switch (user.role) {
    case 'participant':
      redirectPath = '/participant/dashboard';
      break;
    case 'support_worker':
      redirectPath = '/worker/dashboard';
      break;
    case 'admin':
    case 'team_leader':
    case 'compliance':
      redirectPath = '/admin/dashboard';
      break;
    default:
      redirectPath = '/';
  }

  console.log('🔄 DashboardRedirect: Redirecting to', redirectPath);
  return <Navigate to={redirectPath} replace />;
};

export default DashboardRedirect;
