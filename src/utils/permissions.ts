// Permission definitions and role-based access control utilities

export const PERMISSIONS = {
  // Shift Management
  ASSIGN_SHIFTS: 'assign_shifts',
  VIEW_SHIFTS: 'view_shifts',
  EDIT_SHIFTS: 'edit_shifts',
  CANCEL_SHIFTS: 'cancel_shifts',
  CREATE_RECURRING_SHIFTS: 'create_recurring_shifts',
  
  // Worker Management
  VIEW_WORKERS: 'view_workers',
  APPROVE_WORKERS: 'approve_workers',
  SUSPEND_WORKERS: 'suspend_workers',
  EDIT_WORKER_PROFILES: 'edit_worker_profiles',
  VIEW_WORKER_PERFORMANCE: 'view_worker_performance',
  
  // Participant Management
  VIEW_PARTICIPANTS: 'view_participants',
  APPROVE_PARTICIPANTS: 'approve_participants',
  EDIT_PARTICIPANT_PROFILES: 'edit_participant_profiles',
  VIEW_PARTICIPANT_BUDGETS: 'view_participant_budgets',
  
  // Financial Management
  VIEW_FINANCIALS: 'view_financials',
  APPROVE_TIMESHEETS: 'approve_timesheets',
  GENERATE_INVOICES: 'generate_invoices',
  SEND_INVOICES: 'send_invoices',
  RECORD_PAYMENTS: 'record_payments',
  VIEW_FINANCIAL_REPORTS: 'view_financial_reports',
  EXPORT_FINANCIAL_DATA: 'export_financial_data',
  
  // Compliance Management
  VIEW_COMPLIANCE: 'view_compliance',
  MANAGE_COMPLIANCE: 'manage_compliance',
  APPROVE_DOCUMENTS: 'approve_documents',
  SEND_COMPLIANCE_REMINDERS: 'send_compliance_reminders',
  SUSPEND_FOR_COMPLIANCE: 'suspend_for_compliance',
  
  // System Administration
  MANAGE_USERS: 'manage_users',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  SYSTEM_SETTINGS: 'system_settings',
  EXPORT_DATA: 'export_data',
  
  // Communication
  SEND_NOTIFICATIONS: 'send_notifications',
  VIEW_ALL_MESSAGES: 'view_all_messages',
  MODERATE_COMMUNICATIONS: 'moderate_communications'
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Utility functions for permission checking
export const checkPermission = (userPermissions: string[], requiredPermission: PermissionKey): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const checkAnyPermission = (userPermissions: string[], requiredPermissions: PermissionKey[]): boolean => {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

export const checkAllPermissions = (userPermissions: string[], requiredPermissions: PermissionKey[]): boolean => {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};

export const canAccessFinancials = (userPermissions: string[]): boolean => {
  return checkAnyPermission(userPermissions, [
    PERMISSIONS.VIEW_FINANCIALS,
    PERMISSIONS.APPROVE_TIMESHEETS,
    PERMISSIONS.GENERATE_INVOICES,
    PERMISSIONS.SEND_INVOICES,
    PERMISSIONS.RECORD_PAYMENTS
  ]);
};

export const canManageShifts = (userPermissions: string[]): boolean => {
  return checkAnyPermission(userPermissions, [
    PERMISSIONS.ASSIGN_SHIFTS,
    PERMISSIONS.EDIT_SHIFTS,
    PERMISSIONS.CANCEL_SHIFTS
  ]);
};

export const canManageCompliance = (userPermissions: string[]): boolean => {
  return checkAnyPermission(userPermissions, [
    PERMISSIONS.MANAGE_COMPLIANCE,
    PERMISSIONS.APPROVE_DOCUMENTS,
    PERMISSIONS.SUSPEND_FOR_COMPLIANCE
  ]);
};

// Role definitions with their associated permissions
export const ADMIN_ROLES = {
  SUPER_ADMIN: {
    name: 'Super Administrator',
    description: 'Full system access and management capabilities',
    level: 5,
    permissions: [
      PERMISSIONS.ASSIGN_SHIFTS,
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.EDIT_SHIFTS,
      PERMISSIONS.CANCEL_SHIFTS,
      PERMISSIONS.CREATE_RECURRING_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.APPROVE_WORKERS,
      PERMISSIONS.SUSPEND_WORKERS,
      PERMISSIONS.EDIT_WORKER_PROFILES,
      PERMISSIONS.VIEW_WORKER_PERFORMANCE,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.APPROVE_PARTICIPANTS,
      PERMISSIONS.EDIT_PARTICIPANT_PROFILES,
      PERMISSIONS.VIEW_PARTICIPANT_BUDGETS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.APPROVE_TIMESHEETS,
      PERMISSIONS.GENERATE_INVOICES,
      PERMISSIONS.SEND_INVOICES,
      PERMISSIONS.RECORD_PAYMENTS,
      PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      PERMISSIONS.EXPORT_FINANCIAL_DATA,
      PERMISSIONS.VIEW_COMPLIANCE,
      PERMISSIONS.MANAGE_COMPLIANCE,
      PERMISSIONS.APPROVE_DOCUMENTS,
      PERMISSIONS.SEND_COMPLIANCE_REMINDERS,
      PERMISSIONS.SUSPEND_FOR_COMPLIANCE,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.VIEW_AUDIT_LOGS,
      PERMISSIONS.SYSTEM_SETTINGS,
      PERMISSIONS.EXPORT_DATA,
      PERMISSIONS.SEND_NOTIFICATIONS,
      PERMISSIONS.VIEW_ALL_MESSAGES,
      PERMISSIONS.MODERATE_COMMUNICATIONS
    ]
  },
  admin: {
    name: 'Administrator',
    description: 'Full system access and management capabilities',
    level: 5,
    permissions: [
      PERMISSIONS.ASSIGN_SHIFTS,
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.EDIT_SHIFTS,
      PERMISSIONS.CANCEL_SHIFTS,
      PERMISSIONS.CREATE_RECURRING_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.APPROVE_WORKERS,
      PERMISSIONS.SUSPEND_WORKERS,
      PERMISSIONS.EDIT_WORKER_PROFILES,
      PERMISSIONS.VIEW_WORKER_PERFORMANCE,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.APPROVE_PARTICIPANTS,
      PERMISSIONS.EDIT_PARTICIPANT_PROFILES,
      PERMISSIONS.VIEW_PARTICIPANT_BUDGETS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.APPROVE_TIMESHEETS,
      PERMISSIONS.GENERATE_INVOICES,
      PERMISSIONS.SEND_INVOICES,
      PERMISSIONS.RECORD_PAYMENTS,
      PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      PERMISSIONS.EXPORT_FINANCIAL_DATA,
      PERMISSIONS.VIEW_COMPLIANCE,
      PERMISSIONS.MANAGE_COMPLIANCE,
      PERMISSIONS.APPROVE_DOCUMENTS,
      PERMISSIONS.SEND_COMPLIANCE_REMINDERS,
      PERMISSIONS.SUSPEND_FOR_COMPLIANCE,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.VIEW_AUDIT_LOGS,
      PERMISSIONS.SYSTEM_SETTINGS,
      PERMISSIONS.EXPORT_DATA,
      PERMISSIONS.SEND_NOTIFICATIONS,
      PERMISSIONS.VIEW_ALL_MESSAGES,
      PERMISSIONS.MODERATE_COMMUNICATIONS
    ]
  },
  shift_coordinator: {
    name: 'Shift Coordinator',
    description: 'Manages shift assignments and worker scheduling',
    level: 3,
    permissions: [
      PERMISSIONS.ASSIGN_SHIFTS,
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.EDIT_SHIFTS,
      PERMISSIONS.CANCEL_SHIFTS,
      PERMISSIONS.CREATE_RECURRING_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.VIEW_WORKER_PERFORMANCE,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.SEND_NOTIFICATIONS
    ]
  },
  financial_admin: {
    name: 'Financial Administrator',
    description: 'Manages financial operations and invoicing',
    level: 3,
    permissions: [
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.APPROVE_TIMESHEETS,
      PERMISSIONS.GENERATE_INVOICES,
      PERMISSIONS.SEND_INVOICES,
      PERMISSIONS.RECORD_PAYMENTS,
      PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      PERMISSIONS.EXPORT_FINANCIAL_DATA
    ]
  },
  compliance_officer: {
    name: 'Compliance Officer',
    description: 'Compliance monitoring and document management',
    level: 3,
    permissions: [
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.SUSPEND_WORKERS,
      PERMISSIONS.VIEW_WORKER_PERFORMANCE,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.VIEW_PARTICIPANT_BUDGETS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      PERMISSIONS.VIEW_COMPLIANCE,
      PERMISSIONS.MANAGE_COMPLIANCE,
      PERMISSIONS.APPROVE_DOCUMENTS,
      PERMISSIONS.SEND_COMPLIANCE_REMINDERS,
      PERMISSIONS.SUSPEND_FOR_COMPLIANCE,
      PERMISSIONS.VIEW_AUDIT_LOGS,
      PERMISSIONS.SEND_NOTIFICATIONS
    ]
  },
  operations_manager: {
    name: 'Operations Manager',
    description: 'Oversees daily operations and service delivery',
    level: 4,
    permissions: [
      PERMISSIONS.ASSIGN_SHIFTS,
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.EDIT_SHIFTS,
      PERMISSIONS.CANCEL_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.APPROVE_WORKERS,
      PERMISSIONS.EDIT_WORKER_PROFILES,
      PERMISSIONS.VIEW_WORKER_PERFORMANCE,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.EDIT_PARTICIPANT_PROFILES,
      PERMISSIONS.VIEW_PARTICIPANT_BUDGETS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.APPROVE_TIMESHEETS,
      PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      PERMISSIONS.VIEW_COMPLIANCE,
      PERMISSIONS.MANAGE_COMPLIANCE,
      PERMISSIONS.SEND_NOTIFICATIONS,
      PERMISSIONS.VIEW_ALL_MESSAGES
    ]
  },
  team_leader: {
    name: 'Team Leader',
    description: 'Team management and operational oversight',
    level: 4,
    permissions: [
      PERMISSIONS.ASSIGN_SHIFTS,
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.EDIT_SHIFTS,
      PERMISSIONS.CANCEL_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.APPROVE_WORKERS,
      PERMISSIONS.EDIT_WORKER_PROFILES,
      PERMISSIONS.VIEW_WORKER_PERFORMANCE,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.EDIT_PARTICIPANT_PROFILES,
      PERMISSIONS.VIEW_PARTICIPANT_BUDGETS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.APPROVE_TIMESHEETS,
      PERMISSIONS.GENERATE_INVOICES,
      PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      PERMISSIONS.VIEW_COMPLIANCE,
      PERMISSIONS.MANAGE_COMPLIANCE,
      PERMISSIONS.APPROVE_DOCUMENTS,
      PERMISSIONS.SEND_COMPLIANCE_REMINDERS,
      PERMISSIONS.SEND_NOTIFICATIONS,
      PERMISSIONS.VIEW_ALL_MESSAGES
    ]
  },
  compliance: {
    name: 'Compliance Officer',
    description: 'Compliance monitoring and document management',
    level: 3,
    permissions: [
      PERMISSIONS.VIEW_SHIFTS,
      PERMISSIONS.VIEW_WORKERS,
      PERMISSIONS.SUSPEND_WORKERS,
      PERMISSIONS.VIEW_WORKER_PERFORMANCE,
      PERMISSIONS.VIEW_PARTICIPANTS,
      PERMISSIONS.VIEW_PARTICIPANT_BUDGETS,
      PERMISSIONS.VIEW_FINANCIALS,
      PERMISSIONS.VIEW_FINANCIAL_REPORTS,
      PERMISSIONS.VIEW_COMPLIANCE,
      PERMISSIONS.MANAGE_COMPLIANCE,
      PERMISSIONS.APPROVE_DOCUMENTS,
      PERMISSIONS.SEND_COMPLIANCE_REMINDERS,
      PERMISSIONS.SUSPEND_FOR_COMPLIANCE,
      PERMISSIONS.VIEW_AUDIT_LOGS,
      PERMISSIONS.SEND_NOTIFICATIONS
    ]
  }
} as const;