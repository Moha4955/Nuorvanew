// Compliance tracking and management utilities

import { ComplianceDocument, SupportWorkerProfile } from '../types';

export interface ComplianceAlert {
  id: string;
  workerId: string;
  documentType: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  dueDate?: Date;
  daysUntilDue?: number;
  actionRequired: string;
  lastContactDate?: Date;
  responseStatus: 'pending' | 'acknowledged' | 'in_progress' | 'no_response';
  remindersSent: number;
}

export interface ComplianceReport {
  overallRate: number;
  totalWorkers: number;
  compliantWorkers: number;
  nonCompliantWorkers: number;
  expiringDocuments: number;
  overdueDocuments: number;
  documentBreakdown: DocumentTypeCompliance[];
  alerts: ComplianceAlert[];
}

export interface DocumentTypeCompliance {
  documentType: string;
  totalRequired: number;
  compliant: number;
  expiringSoon: number;
  expired: number;
  complianceRate: number;
}

// Document expiry thresholds
const EXPIRY_THRESHOLDS = {
  critical: 7,   // 7 days
  warning: 30,   // 30 days
  info: 60       // 60 days
};

export const generateComplianceAlerts = (workers: SupportWorkerProfile[]): ComplianceAlert[] => {
  const alerts: ComplianceAlert[] = [];
  
  for (const worker of workers) {
    const workerAlerts = checkWorkerCompliance(worker);
    alerts.push(...workerAlerts);
  }
  
  return alerts.sort((a, b) => {
    // Sort by severity (critical first) then by days until due
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return (a.daysUntilDue || 0) - (b.daysUntilDue || 0);
  });
};

const checkWorkerCompliance = (worker: SupportWorkerProfile): ComplianceAlert[] => {
  const alerts: ComplianceAlert[] = [];
  const documents = worker.complianceStatus;
  
  // Check each document type
  Object.entries(documents).forEach(([docType, document]) => {
    if (docType === 'overallStatus' || docType === 'lastReviewDate' || docType === 'nextReviewDate') {
      return; // Skip non-document fields
    }
    
    const doc = document as ComplianceDocument;
    const alert = checkDocumentCompliance(worker.id, docType, doc);
    if (alert) {
      alerts.push(alert);
    }
  });
  
  return alerts;
};

const checkDocumentCompliance = (
  workerId: string,
  documentType: string,
  document: ComplianceDocument
): ComplianceAlert | null => {
  if (!document.expiryDate) return null;
  
  const now = new Date();
  const expiryDate = new Date(document.expiryDate);
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  let severity: 'info' | 'warning' | 'critical';
  let message: string;
  let actionRequired: string;
  
  if (daysUntilExpiry < 0) {
    severity = 'critical';
    message = `${formatDocumentType(documentType)} expired ${Math.abs(daysUntilExpiry)} days ago`;
    actionRequired = 'Immediate renewal required - worker suspended';
  } else if (daysUntilExpiry <= EXPIRY_THRESHOLDS.critical) {
    severity = 'critical';
    message = `${formatDocumentType(documentType)} expires in ${daysUntilExpiry} days`;
    actionRequired = 'Urgent renewal required';
  } else if (daysUntilExpiry <= EXPIRY_THRESHOLDS.warning) {
    severity = 'warning';
    message = `${formatDocumentType(documentType)} expires in ${daysUntilExpiry} days`;
    actionRequired = 'Schedule renewal';
  } else if (daysUntilExpiry <= EXPIRY_THRESHOLDS.info) {
    severity = 'info';
    message = `${formatDocumentType(documentType)} expires in ${daysUntilExpiry} days`;
    actionRequired = 'Plan for renewal';
  } else {
    return null; // No alert needed
  }
  
  return {
    id: `alert-${workerId}-${documentType}`,
    workerId,
    documentType: formatDocumentType(documentType),
    severity,
    message,
    dueDate: expiryDate,
    daysUntilDue: daysUntilExpiry,
    actionRequired,
    lastContactDate: document.reviewedAt,
    responseStatus: document.status === 'pending' ? 'pending' : 'acknowledged',
    remindersSent: document.remindersSent || 0
  };
};

const formatDocumentType = (docType: string): string => {
  const typeMap: Record<string, string> = {
    ndisWorkerScreening: 'NDIS Worker Screening',
    wwccPoliceCheck: 'WWCC/Police Check',
    firstAidCertification: 'First Aid Certification',
    ndisWorkerOrientation: 'NDIS Worker Orientation',
    professionalIndemnity: 'Professional Indemnity Insurance',
    publicLiabilityInsurance: 'Public Liability Insurance',
    workersCompensation: 'Workers Compensation'
  };
  
  return typeMap[docType] || docType;
};

export const generateComplianceReport = (workers: SupportWorkerProfile[]): ComplianceReport => {
  const alerts = generateComplianceAlerts(workers);
  const compliantWorkers = workers.filter(w => w.complianceStatus.overallStatus === 'compliant').length;
  
  const documentTypes = [
    'ndisWorkerScreening',
    'wwccPoliceCheck', 
    'firstAidCertification',
    'ndisWorkerOrientation',
    'professionalIndemnity'
  ];
  
  const documentBreakdown: DocumentTypeCompliance[] = documentTypes.map(docType => {
    const totalRequired = workers.length;
    const compliant = workers.filter(w => {
      const doc = w.complianceStatus[docType as keyof typeof w.complianceStatus] as ComplianceDocument;
      return doc?.status === 'approved';
    }).length;
    
    const expiringSoon = workers.filter(w => {
      const doc = w.complianceStatus[docType as keyof typeof w.complianceStatus] as ComplianceDocument;
      if (!doc?.expiryDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(doc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length;
    
    const expired = workers.filter(w => {
      const doc = w.complianceStatus[docType as keyof typeof w.complianceStatus] as ComplianceDocument;
      if (!doc?.expiryDate) return false;
      return new Date(doc.expiryDate) < new Date();
    }).length;
    
    return {
      documentType: formatDocumentType(docType),
      totalRequired,
      compliant,
      expiringSoon,
      expired,
      complianceRate: (compliant / totalRequired) * 100
    };
  });
  
  return {
    overallRate: (compliantWorkers / workers.length) * 100,
    totalWorkers: workers.length,
    compliantWorkers,
    nonCompliantWorkers: workers.length - compliantWorkers,
    expiringDocuments: alerts.filter(a => a.severity === 'warning').length,
    overdueDocuments: alerts.filter(a => a.severity === 'critical' && (a.daysUntilDue || 0) < 0).length,
    documentBreakdown,
    alerts
  };
};

export const sendComplianceReminder = async (
  workerId: string,
  documentType: string,
  reminderType: 'first' | 'second' | 'final'
): Promise<boolean> => {
  try {
    // This would integrate with your email/SMS service
    const template = getComplianceReminderTemplate(documentType, reminderType);
    
    // Simulate sending reminder
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Sending compliance reminder:', {
      workerId,
      documentType,
      reminderType,
      template
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send compliance reminder:', error);
    return false;
  }
};

const getComplianceReminderTemplate = (
  documentType: string,
  reminderType: 'first' | 'second' | 'final'
): { subject: string; body: string } => {
  const urgencyMap = {
    first: 'Reminder',
    second: 'Second Reminder',
    final: 'URGENT - Final Notice'
  };
  
  return {
    subject: `${urgencyMap[reminderType]}: ${formatDocumentType(documentType)} Renewal Required`,
    body: `Dear Support Worker,

Your ${formatDocumentType(documentType)} requires renewal to maintain compliance with NDIS requirements.

${reminderType === 'final' ? 'This is your final notice. ' : ''}Please upload your renewed document through your dashboard as soon as possible.

${reminderType === 'final' ? 'Failure to renew will result in suspension of shift assignments.' : ''}

Best regards,
Nurova Australia Compliance Team`
  };
};

export const suspendWorkerForCompliance = async (
  workerId: string,
  reason: string,
  documentTypes: string[]
): Promise<boolean> => {
  try {
    // This would update the worker's status in the database
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Suspending worker for compliance:', {
      workerId,
      reason,
      documentTypes
    });
    
    // Send suspension notification
    await sendSuspensionNotification(workerId, reason, documentTypes);
    
    return true;
  } catch (error) {
    console.error('Failed to suspend worker:', error);
    return false;
  }
};

const sendSuspensionNotification = async (
  workerId: string,
  reason: string,
  documentTypes: string[]
): Promise<void> => {
  // Send email notification about suspension
  console.log('Sending suspension notification to worker:', workerId);
};

export const bulkComplianceCheck = async (workerIds: string[]): Promise<{
  compliant: string[];
  nonCompliant: Array<{ workerId: string; issues: string[] }>;
}> => {
  const compliant: string[] = [];
  const nonCompliant: Array<{ workerId: string; issues: string[] }> = [];
  
  // Simulate bulk compliance checking
  for (const workerId of workerIds) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock compliance check
    if (Math.random() > 0.2) {
      compliant.push(workerId);
    } else {
      nonCompliant.push({
        workerId,
        issues: ['First Aid Certification expired', 'WWCC renewal required']
      });
    }
  }
  
  return { compliant, nonCompliant };
};