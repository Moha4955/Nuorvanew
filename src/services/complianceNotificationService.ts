import { supabase } from '../lib/supabase';
import { emailService } from './emailService';

interface ComplianceDocument {
  id: string;
  worker_id: string;
  worker_email: string;
  worker_first_name: string;
  document_name: string;
  document_type: string;
  expiry_date: string;
  status: string;
}

class ComplianceNotificationService {
  private checkInterval: number = 24 * 60 * 60 * 1000;
  private intervalId: NodeJS.Timeout | null = null;

  startMonitoring(): void {
    if (this.intervalId) {
      console.log('Compliance monitoring already running');
      return;
    }

    console.log('Starting compliance monitoring...');
    this.checkComplianceStatus();
    this.intervalId = setInterval(() => {
      this.checkComplianceStatus();
    }, this.checkInterval);
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Compliance monitoring stopped');
    }
  }

  async checkComplianceStatus(): Promise<void> {
    try {
      if (!supabase) {
        console.log('Compliance check skipped: Supabase not configured');
        return;
      }

      const expiringDocuments = await this.getExpiringDocuments();
      console.log(`Found ${expiringDocuments.length} expiring documents`);

      for (const doc of expiringDocuments) {
        await this.sendExpiryNotification(doc);
      }
    } catch (error) {
      console.error('Compliance check error:', error);
    }
  }

  private async getExpiringDocuments(): Promise<ComplianceDocument[]> {
    if (!supabase) return [];

    try {
      const today = new Date();
      const in60Days = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('documents')
        .select(`
          id,
          worker_id,
          document_name,
          document_type,
          expiry_date,
          status,
          workers:worker_id (
            id,
            user_profiles!inner (
              email,
              first_name
            )
          )
        `)
        .eq('status', 'verified')
        .not('expiry_date', 'is', null)
        .lt('expiry_date', in60Days.toISOString())
        .gte('expiry_date', today.toISOString());

      if (error) throw error;

      return (data || []).map((doc: any) => ({
        id: doc.id,
        worker_id: doc.worker_id,
        worker_email: doc.workers.user_profiles.email,
        worker_first_name: doc.workers.user_profiles.first_name,
        document_name: doc.document_name,
        document_type: doc.document_type,
        expiry_date: doc.expiry_date,
        status: doc.status
      }));
    } catch (error) {
      console.error('Error fetching expiring documents:', error);
      return [];
    }
  }

  private async sendExpiryNotification(doc: ComplianceDocument): Promise<void> {
    try {
      const expiryDate = new Date(doc.expiry_date);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const notificationDays = [60, 30, 14, 7, 3, 1];

      if (notificationDays.includes(daysUntilExpiry)) {
        console.log(`Sending ${daysUntilExpiry}-day notification for ${doc.document_name} to ${doc.worker_email}`);

        await emailService.sendComplianceAlert(
          doc.worker_email,
          doc.worker_first_name,
          doc.document_name,
          daysUntilExpiry
        );

        if (supabase) {
          await supabase
            .from('notifications')
            .insert({
              user_id: doc.worker_id,
              type: 'compliance_alert',
              title: `${doc.document_name} Expiring Soon`,
              message: `Your ${doc.document_name} will expire in ${daysUntilExpiry} days. Please upload a renewal.`,
              priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
              read: false
            });
        }

        await this.logNotification(doc.id, daysUntilExpiry);
      }
    } catch (error) {
      console.error('Error sending expiry notification:', error);
    }
  }

  private async logNotification(documentId: string, daysUntilExpiry: number): Promise<void> {
    if (!supabase) return;

    try {
      await supabase
        .from('compliance_notifications')
        .insert({
          document_id: documentId,
          notification_type: 'expiry_reminder',
          days_before_expiry: daysUntilExpiry,
          sent_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  async checkWorkerCompliance(workerId: string): Promise<{
    compliant: boolean;
    issues: string[];
    expiringDocs: number;
    expiredDocs: number;
  }> {
    if (!supabase) {
      return {
        compliant: true,
        issues: [],
        expiringDocs: 0,
        expiredDocs: 0
      };
    }

    try {
      const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('worker_id', workerId);

      if (error) throw error;

      const today = new Date();
      const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      const issues: string[] = [];
      let expiringDocs = 0;
      let expiredDocs = 0;

      const requiredDocuments = [
        'ndis_worker_screening',
        'working_with_children_check',
        'first_aid_certificate',
        'ndis_orientation',
        'disability_qualification',
        'police_check'
      ];

      for (const docType of requiredDocuments) {
        const doc = documents?.find(d => d.document_type === docType);

        if (!doc) {
          issues.push(`Missing required document: ${this.formatDocumentType(docType)}`);
        } else if (doc.status === 'rejected') {
          issues.push(`Document rejected: ${doc.document_name}`);
        } else if (doc.status === 'pending') {
          issues.push(`Document pending verification: ${doc.document_name}`);
        } else if (doc.expiry_date) {
          const expiryDate = new Date(doc.expiry_date);

          if (expiryDate < today) {
            issues.push(`Document expired: ${doc.document_name}`);
            expiredDocs++;
          } else if (expiryDate < in30Days) {
            expiringDocs++;
          }
        }
      }

      return {
        compliant: issues.length === 0 && expiredDocs === 0,
        issues,
        expiringDocs,
        expiredDocs
      };
    } catch (error) {
      console.error('Error checking worker compliance:', error);
      return {
        compliant: false,
        issues: ['Error checking compliance status'],
        expiringDocs: 0,
        expiredDocs: 0
      };
    }
  }

  private formatDocumentType(type: string): string {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async generateComplianceReport(startDate: string, endDate: string): Promise<any> {
    if (!supabase) {
      return {
        totalWorkers: 0,
        compliantWorkers: 0,
        nonCompliantWorkers: 0,
        expiringDocuments: 0,
        expiredDocuments: 0,
        pendingVerifications: 0
      };
    }

    try {
      const { data: workers, error: workersError } = await supabase
        .from('support_workers')
        .select('id');

      if (workersError) throw workersError;

      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (docsError) throw docsError;

      const today = new Date();
      const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      let compliantWorkers = 0;
      let expiringDocuments = 0;
      let expiredDocuments = 0;
      let pendingVerifications = 0;

      for (const worker of workers || []) {
        const status = await this.checkWorkerCompliance(worker.id);
        if (status.compliant) compliantWorkers++;
        expiringDocuments += status.expiringDocs;
        expiredDocuments += status.expiredDocs;
      }

      pendingVerifications = documents?.filter(d => d.status === 'pending').length || 0;

      return {
        totalWorkers: workers?.length || 0,
        compliantWorkers,
        nonCompliantWorkers: (workers?.length || 0) - compliantWorkers,
        expiringDocuments,
        expiredDocuments,
        pendingVerifications,
        complianceRate: workers?.length ? (compliantWorkers / workers.length) * 100 : 0
      };
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  }
}

export const complianceNotificationService = new ComplianceNotificationService();
export default complianceNotificationService;
