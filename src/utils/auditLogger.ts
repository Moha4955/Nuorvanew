// Comprehensive audit logging system for compliance and security

export interface AuditLogEntry {
  id: string;
  userId: string;
  userRole: string;
  action: AuditAction;
  entityType: EntityType;
  entityId: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  outcome: 'success' | 'failure' | 'partial';
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export type AuditAction = 
  | 'create' | 'read' | 'update' | 'delete'
  | 'login' | 'logout' | 'password_change'
  | 'assign_shift' | 'approve_timesheet' | 'reject_timesheet'
  | 'generate_invoice' | 'send_invoice' | 'record_payment'
  | 'approve_worker' | 'suspend_worker' | 'reactivate_worker'
  | 'upload_document' | 'approve_document' | 'reject_document'
  | 'send_reminder' | 'bulk_operation'
  | 'export_data' | 'system_setting_change';

export type EntityType = 
  | 'user' | 'participant' | 'worker' | 'shift' | 'timesheet' 
  | 'invoice' | 'payment' | 'document' | 'service_request'
  | 'compliance_alert' | 'system_setting';

class AuditLogger {
  private static instance: AuditLogger;
  private logs: AuditLogEntry[] = [];

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<void> {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // In production, this would save to database
    this.logs.push(auditEntry);
    
    // Also log to console for development
    console.log('Audit Log:', auditEntry);
    
    // Send to backend audit service
    await this.sendToAuditService(auditEntry);
  }

  private async sendToAuditService(entry: AuditLogEntry): Promise<void> {
    try {
      // This would send to your backend audit service
      // For now, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Failed to send audit log:', error);
      // Store locally for retry
    }
  }

  async getLogs(filters?: {
    userId?: string;
    action?: AuditAction;
    entityType?: EntityType;
    startDate?: Date;
    endDate?: Date;
  }): Promise<AuditLogEntry[]> {
    let filteredLogs = [...this.logs];
    
    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      if (filters.entityType) {
        filteredLogs = filteredLogs.filter(log => log.entityType === filters.entityType);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
    }
    
    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async exportAuditReport(
    startDate: Date,
    endDate: Date,
    format: 'csv' | 'json' | 'pdf'
  ): Promise<string> {
    const logs = await this.getLogs({ startDate, endDate });
    
    // Generate report in requested format
    switch (format) {
      case 'csv':
        return this.generateCSVReport(logs);
      case 'json':
        return JSON.stringify(logs, null, 2);
      case 'pdf':
        return this.generatePDFReport(logs);
      default:
        throw new Error('Unsupported format');
    }
  }

  private generateCSVReport(logs: AuditLogEntry[]): string {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Outcome'];
    const rows = logs.map(log => [
      log.timestamp.toISOString(),
      log.userId,
      log.userRole,
      log.action,
      log.entityType,
      log.entityId,
      log.outcome
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private generatePDFReport(logs: AuditLogEntry[]): string {
    // This would integrate with a PDF generation service
    return `audit-report-${Date.now()}.pdf`;
  }
}

// Convenience functions for common audit actions
export const auditLogger = AuditLogger.getInstance();

export const logShiftAssignment = async (
  userId: string,
  userRole: string,
  shiftId: string,
  workerId: string,
  outcome: 'success' | 'failure',
  errorMessage?: string
): Promise<void> => {
  await auditLogger.log({
    userId,
    userRole,
    action: 'assign_shift',
    entityType: 'shift',
    entityId: shiftId,
    outcome,
    errorMessage,
    metadata: { assignedWorkerId: workerId }
  });
};

export const logTimesheetApproval = async (
  userId: string,
  userRole: string,
  timesheetId: string,
  approved: boolean,
  reason?: string
): Promise<void> => {
  await auditLogger.log({
    userId,
    userRole,
    action: approved ? 'approve_timesheet' : 'reject_timesheet',
    entityType: 'timesheet',
    entityId: timesheetId,
    outcome: 'success',
    metadata: { approved, reason }
  });
};

export const logInvoiceAction = async (
  userId: string,
  userRole: string,
  invoiceId: string,
  action: 'generate_invoice' | 'send_invoice' | 'record_payment',
  outcome: 'success' | 'failure',
  metadata?: Record<string, any>
): Promise<void> => {
  await auditLogger.log({
    userId,
    userRole,
    action,
    entityType: 'invoice',
    entityId: invoiceId,
    outcome,
    metadata
  });
};

export const logWorkerAction = async (
  userId: string,
  userRole: string,
  workerId: string,
  action: 'approve_worker' | 'suspend_worker' | 'reactivate_worker',
  reason?: string
): Promise<void> => {
  await auditLogger.log({
    userId,
    userRole,
    action,
    entityType: 'worker',
    entityId: workerId,
    outcome: 'success',
    metadata: { reason }
  });
};

export const logComplianceAction = async (
  userId: string,
  userRole: string,
  documentId: string,
  action: 'approve_document' | 'reject_document' | 'send_reminder',
  metadata?: Record<string, any>
): Promise<void> => {
  await auditLogger.log({
    userId,
    userRole,
    action,
    entityType: 'document',
    entityId: documentId,
    outcome: 'success',
    metadata
  });
};

// Security monitoring
export const logSecurityEvent = async (
  userId: string,
  action: string,
  severity: 'low' | 'medium' | 'high' | 'critical',
  details: string,
  ipAddress?: string
): Promise<void> => {
  await auditLogger.log({
    userId,
    userRole: 'system',
    action: action as AuditAction,
    entityType: 'system_setting',
    entityId: 'security',
    outcome: 'success',
    ipAddress,
    metadata: { severity, details }
  });
};

// Compliance reporting
export const generateComplianceAuditReport = async (
  startDate: Date,
  endDate: Date
): Promise<{
  totalActions: number;
  complianceActions: AuditLogEntry[];
  suspensions: AuditLogEntry[];
  documentApprovals: AuditLogEntry[];
  remindersSent: AuditLogEntry[];
}> => {
  const logs = await auditLogger.getLogs({ startDate, endDate });
  
  const complianceActions = logs.filter(log => 
    ['approve_document', 'reject_document', 'send_reminder', 'suspend_worker'].includes(log.action)
  );
  
  return {
    totalActions: logs.length,
    complianceActions,
    suspensions: logs.filter(log => log.action === 'suspend_worker'),
    documentApprovals: logs.filter(log => log.action === 'approve_document'),
    remindersSent: logs.filter(log => log.action === 'send_reminder')
  };
};