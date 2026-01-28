import React from 'react';
import { useAuth } from '../context/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY permission
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  permission, 
  permissions = [], 
  requireAll = false,
  fallback = null,
  showFallback = false
}) => {
  const { hasPermission, hasAnyPermission, getUserPermissions } = useAuth();
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every(perm => hasPermission(perm));
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
  } else {
    // If no permissions specified, allow access
    hasAccess = true;
  }
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  if (showFallback && fallback) {
    return <>{fallback}</>;
  }
  
  return null;
};

export default PermissionGuard;