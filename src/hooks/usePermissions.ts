// Custom hook for permission management and role-based UI rendering

import { useAuth } from '../context/AuthContext';
import { PermissionKey, PERMISSIONS } from '../utils/permissions';

export interface PermissionHookResult {
  hasPermission: (permission: PermissionKey) => boolean;
  hasAnyPermission: (permissions: PermissionKey[]) => boolean;
  hasAllPermissions: (permissions: PermissionKey[]) => boolean;
  canAccessFinancials: boolean;
  canManageShifts: boolean;
  canManageCompliance: boolean;
  canManageWorkers: boolean;
  canViewReports: boolean;
  userRole: string;
  isAdmin: boolean;
  permissions: string[];
}

export const usePermissions = (): PermissionHookResult => {
  const { user, hasPermission, hasAnyPermission, getUserPermissions, isAdmin } = useAuth();
  
  const permissions = getUserPermissions();
  
  const hasAllPermissions = (requiredPermissions: PermissionKey[]): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  };
  
  const canAccessFinancials = hasAnyPermission([
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.APPROVE_TIMESHEETS,
    PERMISSIONS.GENERATE_INVOICES,
    PERMISSIONS.SEND_INVOICES,
    PERMISSIONS.RECORD_PAYMENTS
  ]);
  
  const canManageShifts = hasAnyPermission([
    PERMISSIONS.ASSIGN_SHIFTS,
    PERMISSIONS.VIEW_SHIFTS,
    PERMISSIONS.EDIT_SHIFTS,
    PERMISSIONS.CANCEL_SHIFTS
  ]);
  
  const canManageCompliance = hasAnyPermission([
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.MANAGE_COMPLIANCE,
    PERMISSIONS.APPROVE_DOCUMENTS,
    PERMISSIONS.SUSPEND_FOR_COMPLIANCE
  ]);
  
  const canManageWorkers = hasAnyPermission([
    PERMISSIONS.VIEW_WORKERS,
    PERMISSIONS.APPROVE_WORKERS,
    PERMISSIONS.SUSPEND_WORKERS,
    PERMISSIONS.EDIT_WORKER_PROFILES
  ]);
  
  const canViewReports = hasAnyPermission([
    PERMISSIONS.VIEW_FINANCIAL_REPORTS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_DATA
  ]);
  
  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessFinancials,
    canManageShifts,
    canManageCompliance,
    canManageWorkers,
    canViewReports,
    userRole: user?.role || '',
    isAdmin: isAdmin(),
    permissions
  };
};

// Hook for dynamic menu generation based on permissions
export const useAdminNavigation = () => {
  const { canAccessFinancials, canManageShifts, canManageCompliance, canManageWorkers, canViewReports, hasPermission } = usePermissions();
  
  const getNavigationItems = () => {
    const items = [
      { path: '/admin/dashboard', icon: 'Home', label: 'Dashboard', badge: null, show: true }
    ];
    
    if (canManageWorkers) {
      items.push({ 
        path: '/admin/workers', 
        icon: 'Users', 
        label: 'Workers', 
        badge: { count: 23, variant: 'info' }, 
        show: true 
      });
    }
    
    if (hasPermission(PERMISSIONS.VIEW_PARTICIPANTS)) {
      items.push({ 
        path: '/admin/participants', 
        icon: 'Users', 
        label: 'Participants', 
        badge: null, 
        show: true 
      });
    }
    
    if (canManageShifts) {
      items.push({ 
        path: '/admin/shifts', 
        icon: 'Calendar', 
        label: 'Shift Assignment', 
        badge: null, 
        show: true 
      });
      items.push({ 
        path: '/admin/services', 
        icon: 'Calendar', 
        label: 'Service Management', 
        badge: null, 
        show: true 
      });
    }
    
    if (canAccessFinancials) {
      items.push({ 
        path: '/admin/timesheets', 
        icon: 'FileText', 
        label: 'Timesheets', 
        badge: { count: 5, variant: 'warning' }, 
        show: true 
      });
      items.push({ 
        path: '/admin/invoices', 
        icon: 'DollarSign', 
        label: 'Invoices', 
        badge: { count: 3, variant: 'info' }, 
        show: true 
      });
      items.push({ 
        path: '/admin/financial', 
        icon: 'DollarSign', 
        label: 'Financial', 
        badge: null, 
        show: true 
      });
    }
    
    if (canManageCompliance) {
      items.push({ 
        path: '/admin/compliance', 
        icon: 'Shield', 
        label: 'Compliance', 
        badge: { count: 8, variant: 'error' }, 
        show: true 
      });
    }
    
    if (canViewReports) {
      items.push({ 
        path: '/admin/reports', 
        icon: 'BarChart3', 
        label: 'Reports', 
        badge: null, 
        show: true 
      });
    }
    
    if (hasPermission(PERMISSIONS.VIEW_AUDIT_LOGS)) {
      items.push({ 
        path: '/admin/audit', 
        icon: 'Shield', 
        label: 'Audit Logs', 
        badge: null, 
        show: true 
      });
    }
    
    return items.filter(item => item.show);
  };
  
  return { getNavigationItems };
};

// Hook for feature flags and conditional rendering
export const useFeatureAccess = () => {
  const { hasPermission, canAccessFinancials, canManageCompliance } = usePermissions();
  
  return {
    // Financial features
    canApproveTimesheets: hasPermission(PERMISSIONS.APPROVE_TIMESHEETS),
    canGenerateInvoices: hasPermission(PERMISSIONS.GENERATE_INVOICES),
    canSendInvoices: hasPermission(PERMISSIONS.SEND_INVOICES),
    canRecordPayments: hasPermission(PERMISSIONS.RECORD_PAYMENTS),
    canViewFinancialReports: hasPermission(PERMISSIONS.VIEW_FINANCIAL_REPORTS),
    canExportFinancialData: hasPermission(PERMISSIONS.EXPORT_FINANCIAL_DATA),
    
    // Shift management features
    canAssignShifts: hasPermission(PERMISSIONS.ASSIGN_SHIFTS),
    canEditShifts: hasPermission(PERMISSIONS.EDIT_SHIFTS),
    canCancelShifts: hasPermission(PERMISSIONS.CANCEL_SHIFTS),
    canCreateRecurringShifts: hasPermission(PERMISSIONS.CREATE_RECURRING_SHIFTS),
    
    // Worker management features
    canApproveWorkers: hasPermission(PERMISSIONS.APPROVE_WORKERS),
    canSuspendWorkers: hasPermission(PERMISSIONS.SUSPEND_WORKERS),
    canViewWorkerPerformance: hasPermission(PERMISSIONS.VIEW_WORKER_PERFORMANCE),
    
    // Compliance features
    canApproveDocuments: hasPermission(PERMISSIONS.APPROVE_DOCUMENTS),
    canSendComplianceReminders: hasPermission(PERMISSIONS.SEND_COMPLIANCE_REMINDERS),
    canSuspendForCompliance: hasPermission(PERMISSIONS.SUSPEND_FOR_COMPLIANCE),
    
    // System features
    canManageUsers: hasPermission(PERMISSIONS.MANAGE_USERS),
    canViewAuditLogs: hasPermission(PERMISSIONS.VIEW_AUDIT_LOGS),
    canExportData: hasPermission(PERMISSIONS.EXPORT_DATA),
    
    // Grouped permissions
    hasFinancialAccess: canAccessFinancials,
    hasComplianceAccess: canManageCompliance
  };
};