import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('participant' | 'support_worker' | 'admin' | 'team_leader' | 'compliance')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute check:', {
    loading,
    hasUser: !!user,
    userRole: user?.role,
    allowedRoles,
    path: location.pathname
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚫 ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('🚫 ProtectedRoute: User role not allowed, redirecting...');

    let dashboardPath = '/';

    switch (user.role) {
      case 'participant':
        dashboardPath = user.profile_complete ? '/participant/dashboard' : '/participant/onboarding';
        break;
      case 'support_worker':
        dashboardPath = user.profile_complete ? '/worker/dashboard' : '/worker/onboarding';
        break;
      case 'admin':
      case 'team_leader':
      case 'compliance':
        dashboardPath = '/admin/dashboard';
        break;
      default:
        dashboardPath = '/';
    }

    console.log('↪️ ProtectedRoute: Redirecting to:', dashboardPath);
    return <Navigate to={dashboardPath} replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;