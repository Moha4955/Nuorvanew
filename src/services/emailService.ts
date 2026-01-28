import { supabase } from '../lib/supabase';

export interface EmailTemplate {
  subject: string;
  body: string;
  html?: string;
}

export interface EmailNotification {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  template?: string;
  data?: Record<string, any>;
}

class EmailService {
  private async sendEmail(notification: EmailNotification): Promise<void> {
    try {
      if (!supabase) {
        console.log('📧 Email (Demo Mode):', {
          to: notification.to,
          subject: notification.subject,
          preview: notification.body.substring(0, 100)
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: notification,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (error) {
        console.error('Email send error:', error);
        throw error;
      }

      console.log('📧 Email sent successfully:', {
        to: notification.to,
        subject: notification.subject,
        response: data
      });
    } catch (error) {
      console.error('Email service error:', error);
      console.log('📧 Email (Fallback - Demo Mode):', {
        to: notification.to,
        subject: notification.subject
      });
    }
  }

  async sendWelcomeEmail(to: string, firstName: string, role: string): Promise<void> {
    const templates = {
      participant: {
        subject: 'Welcome to Nurova Australia - NDIS Support Platform',
        body: `Hi ${firstName},\n\nWelcome to Nurova Australia! We're excited to support your NDIS journey.\n\nYour account has been created and you can now access our platform to manage your services, communicate with support workers, and track your NDIS plan.\n\nNext steps:\n1. Complete your profile\n2. Upload required documents\n3. Browse available services\n\nIf you need assistance, our support team is here to help.\n\nBest regards,\nThe Nurova Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Welcome to Nurova Australia!</h2>
            <p>Hi ${firstName},</p>
            <p>Welcome to Nurova Australia! We're excited to support your NDIS journey.</p>
            <p>Your account has been created and you can now access our platform to manage your services, communicate with support workers, and track your NDIS plan.</p>
            <h3>Next steps:</h3>
            <ol>
              <li>Complete your profile</li>
              <li>Upload required documents</li>
              <li>Browse available services</li>
            </ol>
            <p>If you need assistance, our support team is here to help.</p>
            <p>Best regards,<br/>The Nurova Team</p>
          </div>
        `
      },
      support_worker: {
        subject: 'Welcome to Nurova Australia - Support Worker Platform',
        body: `Hi ${firstName},\n\nWelcome to Nurova Australia! Thank you for joining our team of dedicated support workers.\n\nYour account has been created. Please complete the following steps to get started:\n\n1. Complete your professional profile\n2. Upload compliance documents (NDIS Worker Screening, WWCC, First Aid)\n3. Set your availability\n4. Wait for admin verification\n\nOnce verified, you'll be able to view and accept shift assignments.\n\nBest regards,\nThe Nurova Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Welcome to Nurova Australia!</h2>
            <p>Hi ${firstName},</p>
            <p>Thank you for joining our team of dedicated support workers.</p>
            <p>Your account has been created. Please complete the following steps to get started:</p>
            <ol>
              <li>Complete your professional profile</li>
              <li>Upload compliance documents (NDIS Worker Screening, WWCC, First Aid)</li>
              <li>Set your availability</li>
              <li>Wait for admin verification</li>
            </ol>
            <p>Once verified, you'll be able to view and accept shift assignments.</p>
            <p>Best regards,<br/>The Nurova Team</p>
          </div>
        `
      }
    };

    const template = templates[role as keyof typeof templates] || templates.participant;

    await this.sendEmail({
      to,
      subject: template.subject,
      body: template.body,
      html: template.html
    });
  }

  async sendComplianceAlert(
    to: string,
    firstName: string,
    documentName: string,
    daysUntilExpiry: number
  ): Promise<void> {
    const urgency = daysUntilExpiry <= 7 ? 'URGENT' : daysUntilExpiry <= 30 ? 'Important' : 'Reminder';

    await this.sendEmail({
      to,
      subject: `${urgency}: ${documentName} Expiring Soon`,
      body: `Hi ${firstName},\n\nThis is a ${urgency.toLowerCase()} reminder that your ${documentName} will expire in ${daysUntilExpiry} days.\n\nPlease upload a renewed document as soon as possible to maintain compliance and continue receiving shift assignments.\n\nTo update your documents:\n1. Log in to your Nurova account\n2. Go to Compliance\n3. Upload the renewed ${documentName}\n\nIf you have any questions, please contact our compliance team.\n\nBest regards,\nNurova Compliance Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: ${daysUntilExpiry <= 7 ? '#dc2626' : '#f59e0b'};">${urgency}: Document Expiring Soon</h2>
          <p>Hi ${firstName},</p>
          <p>This is a ${urgency.toLowerCase()} reminder that your <strong>${documentName}</strong> will expire in <strong>${daysUntilExpiry} days</strong>.</p>
          <p>Please upload a renewed document as soon as possible to maintain compliance and continue receiving shift assignments.</p>
          <h3>To update your documents:</h3>
          <ol>
            <li>Log in to your Nurova account</li>
            <li>Go to Compliance</li>
            <li>Upload the renewed ${documentName}</li>
          </ol>
          <p>If you have any questions, please contact our compliance team.</p>
          <p>Best regards,<br/>Nurova Compliance Team</p>
        </div>
      `
    });
  }

  async sendShiftAssignment(
    to: string,
    firstName: string,
    shiftDetails: {
      participantName: string;
      date: string;
      time: string;
      location: string;
      serviceType: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'New Shift Assignment - Action Required',
      body: `Hi ${firstName},\n\nYou have been assigned a new shift:\n\nParticipant: ${shiftDetails.participantName}\nDate: ${shiftDetails.date}\nTime: ${shiftDetails.time}\nLocation: ${shiftDetails.location}\nService Type: ${shiftDetails.serviceType}\n\nPlease log in to your account to confirm or decline this shift.\n\nBest regards,\nNurova Operations Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">New Shift Assignment</h2>
          <p>Hi ${firstName},</p>
          <p>You have been assigned a new shift:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Participant:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${shiftDetails.participantName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${shiftDetails.date}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${shiftDetails.time}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Location:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${shiftDetails.location}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Service Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${shiftDetails.serviceType}</td></tr>
          </table>
          <p>Please log in to your account to confirm or decline this shift.</p>
          <p>Best regards,<br/>Nurova Operations Team</p>
        </div>
      `
    });
  }

  async sendInvoiceNotification(
    to: string,
    firstName: string,
    invoiceDetails: {
      invoiceNumber: string;
      amount: number;
      dueDate: string;
      downloadUrl?: string;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: `New Invoice: ${invoiceDetails.invoiceNumber}`,
      body: `Hi ${firstName},\n\nA new invoice has been generated for your NDIS services:\n\nInvoice Number: ${invoiceDetails.invoiceNumber}\nAmount: $${invoiceDetails.amount.toFixed(2)} (inc. GST)\nDue Date: ${invoiceDetails.dueDate}\n\nPlease log in to your account to view and download your invoice.\n\nBest regards,\nNurova Finance Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">New Invoice Available</h2>
          <p>Hi ${firstName},</p>
          <p>A new invoice has been generated for your NDIS services:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Invoice Number:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${invoiceDetails.invoiceNumber}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">$${invoiceDetails.amount.toFixed(2)} (inc. GST)</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Due Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${invoiceDetails.dueDate}</td></tr>
          </table>
          <p>Please log in to your account to view and download your invoice.</p>
          <p>Best regards,<br/>Nurova Finance Team</p>
        </div>
      `
    });
  }

  async sendTimesheetApproval(
    to: string,
    firstName: string,
    timesheetDetails: {
      date: string;
      hours: number;
      amount: number;
    }
  ): Promise<void> {
    await this.sendEmail({
      to,
      subject: 'Timesheet Approved',
      body: `Hi ${firstName},\n\nYour timesheet has been approved:\n\nDate: ${timesheetDetails.date}\nHours: ${timesheetDetails.hours}\nAmount: $${timesheetDetails.amount.toFixed(2)}\n\nPayment will be processed according to the standard payment schedule.\n\nBest regards,\nNurova Finance Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Timesheet Approved</h2>
          <p>Hi ${firstName},</p>
          <p>Your timesheet has been approved:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${timesheetDetails.date}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Hours:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${timesheetDetails.hours}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">$${timesheetDetails.amount.toFixed(2)}</td></tr>
          </table>
          <p>Payment will be processed according to the standard payment schedule.</p>
          <p>Best regards,<br/>Nurova Finance Team</p>
        </div>
      `
    });
  }

  async sendNewsletter(
    recipients: string[],
    subject: string,
    content: string,
    htmlContent?: string
  ): Promise<void> {
    for (const recipient of recipients) {
      await this.sendEmail({
        to: recipient,
        subject,
        body: content,
        html: htmlContent || content
      });
    }
  }
}

export const emailService = new EmailService();
export default emailService;
