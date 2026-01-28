// Invoice generation and management utilities

import { Invoice, Timesheet, SchadsCalculation } from '../types';

export interface InvoiceGenerationOptions {
  timesheetIds: string[];
  participantId: string;
  planManagerEmail?: string;
  dueDate?: Date;
  notes?: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  attachments: string[];
}

export const generateInvoiceFromTimesheets = async (
  options: InvoiceGenerationOptions
): Promise<Invoice> => {
  // This would integrate with your backend to generate actual invoices
  // For now, simulate the generation process
  
  const invoiceNumber = `NUR-${String(Date.now()).slice(-6)}-2025`;
  const issueDate = new Date();
  const dueDate = options.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
  
  // Calculate totals from timesheets
  const subtotal = 182.00; // This would be calculated from actual timesheet data
  const gstAmount = subtotal * 0.1;
  const totalAmount = subtotal + gstAmount;
  
  const invoice: Invoice = {
    id: `INV-${Date.now()}`,
    invoiceNumber,
    participantId: options.participantId,
    workerId: 'W-001', // This would come from timesheet data
    timesheetIds: options.timesheetIds,
    shiftIds: [], // Would be populated from timesheets
    amount: subtotal,
    gstAmount,
    totalAmount,
    lineItems: [], // Would be generated from timesheet data
    status: {
      current: 'generated',
      history: [
        {
          status: 'generated',
          timestamp: issueDate,
          changedBy: 'system',
          reason: 'Auto-generated from approved timesheets'
        }
      ]
    },
    issueDate,
    dueDate,
    notes: options.notes,
    schadsAwardDetails: {
      classification: 'Social and Community Services Level 3',
      baseRate: 45.50,
      penalties: [],
      allowances: []
    },
    remindersSent: 0,
    auditTrail: [
      {
        id: `audit-${Date.now()}`,
        action: 'created',
        timestamp: issueDate,
        userId: 'admin-001',
        userRole: 'Financial Admin',
        details: 'Invoice auto-generated from approved timesheets'
      }
    ]
  };
  
  return invoice;
};

export const sendInvoiceToplanManager = async (
  invoice: Invoice,
  template: 'standard' | 'reminder' | 'overdue',
  recipientEmail: string
): Promise<boolean> => {
  try {
    // This would integrate with your email service (SendGrid, Mailgun, etc.)
    const emailTemplate = generateEmailTemplate(invoice, template);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Sending invoice email:', {
      to: recipientEmail,
      subject: emailTemplate.subject,
      body: emailTemplate.body,
      attachments: emailTemplate.attachments
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send invoice:', error);
    return false;
  }
};

export const generateEmailTemplate = (
  invoice: Invoice,
  template: 'standard' | 'reminder' | 'overdue'
): EmailTemplate => {
  const templates = {
    standard: {
      subject: `NDIS Service Invoice - ${invoice.invoiceNumber}`,
      body: `Dear Plan Manager,

Please find attached the invoice for NDIS support services.

Invoice Details:
- Invoice Number: ${invoice.invoiceNumber}
- Amount: ${formatCurrency(invoice.totalAmount)}
- Due Date: ${invoice.dueDate.toLocaleDateString()}

The invoice includes detailed breakdown of services provided in compliance with NDIS requirements.

Please process payment by the due date to avoid any service interruptions.

Best regards,
Nurova Australia Finance Team`,
      attachments: [`${invoice.invoiceNumber}.pdf`]
    },
    reminder: {
      subject: `Payment Reminder - Invoice ${invoice.invoiceNumber}`,
      body: `Dear Plan Manager,

This is a friendly reminder that invoice ${invoice.invoiceNumber} is due for payment.

Amount Due: ${formatCurrency(invoice.totalAmount)}
Due Date: ${invoice.dueDate.toLocaleDateString()}

Please process payment at your earliest convenience.

Best regards,
Nurova Australia Finance Team`,
      attachments: [`${invoice.invoiceNumber}.pdf`]
    },
    overdue: {
      subject: `URGENT: Overdue Invoice ${invoice.invoiceNumber}`,
      body: `Dear Plan Manager,

Invoice ${invoice.invoiceNumber} is now overdue and requires immediate attention.

Amount Due: ${formatCurrency(invoice.totalAmount)}
Days Overdue: ${Math.floor((new Date().getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))}

Please contact us immediately to discuss payment arrangements.

Urgent Contact: finance@nurova.com.au | 1800 NUROVA

Best regards,
Nurova Australia Finance Team`,
      attachments: [`${invoice.invoiceNumber}.pdf`]
    }
  };
  
  return templates[template];
};

export const processPayment = async (
  invoiceId: string,
  paymentAmount: number,
  paymentMethod: string,
  paymentReference?: string
): Promise<boolean> => {
  try {
    // This would integrate with Stripe or other payment processor
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Processing payment:', {
      invoiceId,
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentReference
    });
    
    return true;
  } catch (error) {
    console.error('Payment processing failed:', error);
    return false;
  }
};

export const generateInvoicePDF = async (invoice: Invoice): Promise<string> => {
  // This would integrate with a PDF generation service
  // Return the URL or base64 of the generated PDF
  return `https://invoices.nurova.com.au/${invoice.invoiceNumber}.pdf`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

// Batch invoice operations
export const sendBulkInvoices = async (
  invoiceIds: string[],
  template: 'standard' | 'reminder' | 'overdue'
): Promise<{ sent: string[]; failed: string[] }> => {
  const sent: string[] = [];
  const failed: string[] = [];
  
  for (const invoiceId of invoiceIds) {
    try {
      // Simulate sending each invoice
      await new Promise(resolve => setTimeout(resolve, 200));
      sent.push(invoiceId);
    } catch (error) {
      failed.push(invoiceId);
    }
  }
  
  return { sent, failed };
};

export const generateFinancialReport = async (
  startDate: Date,
  endDate: Date,
  includeDetails: boolean = false
): Promise<any> => {
  // Generate comprehensive financial reports
  return {
    period: { startDate, endDate },
    summary: {
      totalInvoices: 45,
      totalRevenue: 15420.50,
      paidAmount: 14240.25,
      pendingAmount: 1180.25,
      overdueAmount: 0
    },
    breakdown: includeDetails ? [] : undefined,
    generatedAt: new Date()
  };
};