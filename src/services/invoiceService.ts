import { supabase } from '../lib/supabase';

export interface Invoice {
  id: string;
  invoice_number: string;
  participant_id: string;
  worker_id: string;
  timesheet_ids: string[];
  shift_ids: string[];
  amount: number;
  gst_amount: number;
  total_amount: number;
  line_items: any[];
  status: 'generated' | 'sent' | 'viewed' | 'approved' | 'paid' | 'overdue' | 'disputed' | 'cancelled';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  plan_manager_details?: any;
  ndis_claim_number?: string;
  schads_award_details?: any;
  sent_at?: string;
  sent_by?: string;
  viewed_at?: string;
  reminders_sent: number;
  last_reminder_sent?: string;
  payment_intent_id?: string;
  stripe_invoice_id?: string;
  download_url?: string;
  audit_trail: any[];
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  participant_id: string;
  worker_id: string;
  timesheet_ids: string[];
  shift_ids?: string[];
  line_items: any[];
  notes?: string;
  plan_manager_details?: any;
  ndis_claim_number?: string;
}

class InvoiceService {
  async getInvoice(id: string): Promise<Invoice | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('invoices')
      .select('*, participants!invoices_participant_id_fkey(*), support_workers!invoices_worker_id_fkey(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAllInvoices(filters?: {
    status?: string;
    participantId?: string;
    workerId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Invoice[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('invoices')
      .select('*, participants!invoices_participant_id_fkey(*), support_workers!invoices_worker_id_fkey(*)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.participantId) {
      query = query.eq('participant_id', filters.participantId);
    }

    if (filters?.workerId) {
      query = query.eq('worker_id', filters.workerId);
    }

    if (filters?.startDate) {
      query = query.gte('issue_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('issue_date', filters.endDate);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query.order('issue_date', { ascending: false });

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  private generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  }

  private calculateTotals(lineItems: any[]): {
    amount: number;
    gstAmount: number;
    totalAmount: number;
  } {
    const amount = lineItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const gstAmount = amount * 0.1;
    const totalAmount = amount + gstAmount;

    return {
      amount: Math.round(amount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100
    };
  }

  async createInvoice(invoiceData: CreateInvoiceData): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const totals = this.calculateTotals(invoiceData.line_items);
    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: this.generateInvoiceNumber(),
        participant_id: invoiceData.participant_id,
        worker_id: invoiceData.worker_id,
        timesheet_ids: invoiceData.timesheet_ids,
        shift_ids: invoiceData.shift_ids || [],
        amount: totals.amount,
        gst_amount: totals.gstAmount,
        total_amount: totals.totalAmount,
        line_items: invoiceData.line_items,
        status: 'generated',
        issue_date: issueDate.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        notes: invoiceData.notes,
        plan_manager_details: invoiceData.plan_manager_details,
        ndis_claim_number: invoiceData.ndis_claim_number,
        reminders_sent: 0,
        audit_trail: [
          {
            action: 'generated',
            timestamp: new Date().toISOString(),
            details: 'Invoice generated from timesheets'
          }
        ]
      })
      .select()
      .single();

    if (error) throw error;

    if (invoiceData.timesheet_ids.length > 0) {
      await supabase
        .from('timesheets')
        .update({ invoice_id: data.id })
        .in('id', invoiceData.timesheet_ids);
    }

    return data;
  }

  async generateInvoiceFromTimesheets(timesheetIds: string[]): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: timesheets, error: timesheetError } = await supabase
      .from('timesheets')
      .select('*, shifts!timesheets_shift_id_fkey(*)')
      .in('id', timesheetIds)
      .eq('status', 'approved');

    if (timesheetError) throw timesheetError;
    if (!timesheets || timesheets.length === 0) {
      throw new Error('No approved timesheets found');
    }

    const firstTimesheet = timesheets[0];
    const lineItems = timesheets.map((ts: any) => {
      const schadsCalc = ts.schads_calculation || {};
      return {
        description: `Service on ${ts.service_date} - ${ts.shifts?.title || 'Support Service'}`,
        quantity: ts.billable_hours,
        unit_price: schadsCalc.total_hourly_rate || 42.00,
        amount: schadsCalc.total_payment || (ts.billable_hours * 42.00),
        schads_details: schadsCalc
      };
    });

    const shiftIds = timesheets
      .filter((ts: any) => ts.shift_id)
      .map((ts: any) => ts.shift_id);

    return this.createInvoice({
      participant_id: firstTimesheet.participant_id,
      worker_id: firstTimesheet.worker_id,
      timesheet_ids: timesheetIds,
      shift_ids: shiftIds,
      line_items: lineItems
    });
  }

  async sendInvoice(invoiceId: string, sentBy: string): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const auditTrail = [...(invoice.audit_trail || []), {
      action: 'sent',
      timestamp: new Date().toISOString(),
      sent_by: sentBy,
      details: 'Invoice sent to participant'
    }];

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        sent_by: sentBy,
        audit_trail: auditTrail
      })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAsViewed(invoiceId: string): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'viewed',
        viewed_at: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAsPaid(invoiceId: string, paymentDetails: {
    payment_method: string;
    payment_reference: string;
  }): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const auditTrail = [...(invoice.audit_trail || []), {
      action: 'paid',
      timestamp: new Date().toISOString(),
      details: `Payment received via ${paymentDetails.payment_method}`,
      payment_reference: paymentDetails.payment_reference
    }];

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
        payment_method: paymentDetails.payment_method,
        payment_reference: paymentDetails.payment_reference,
        audit_trail: auditTrail
      })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async sendReminder(invoiceId: string): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const { data, error } = await supabase
      .from('invoices')
      .update({
        reminders_sent: invoice.reminders_sent + 1,
        last_reminder_sent: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('invoices')
      .select('*, participants!invoices_participant_id_fkey(*), support_workers!invoices_worker_id_fkey(*)')
      .in('status', ['sent', 'viewed'])
      .lt('due_date', today)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateInvoice(invoiceId: string, updates: Partial<Invoice>): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async cancelInvoice(invoiceId: string, reason: string): Promise<Invoice> {
    if (!supabase) throw new Error('Supabase not configured');

    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const auditTrail = [...(invoice.audit_trail || []), {
      action: 'cancelled',
      timestamp: new Date().toISOString(),
      details: reason
    }];

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'cancelled',
        audit_trail: auditTrail
      })
      .eq('id', invoiceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const invoiceService = new InvoiceService();
export default invoiceService;
