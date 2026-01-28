import { supabase } from '../lib/supabase';

export interface Timesheet {
  id: string;
  shift_id: string;
  worker_id: string;
  participant_id: string;
  service_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time: string;
  actual_end_time: string;
  total_hours: number;
  break_time: number;
  billable_hours: number;
  travel_time?: number;
  travel_distance?: number;
  service_notes: string;
  participant_signature?: string;
  worker_signature: string;
  status: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  approved_at?: string;
  approved_by?: string;
  rejected_at?: string;
  rejected_by?: string;
  rejection_reason?: string;
  schads_calculation?: any;
  invoice_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTimesheetData {
  shift_id: string;
  worker_id: string;
  participant_id: string;
  service_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time: string;
  actual_end_time: string;
  break_time?: number;
  travel_time?: number;
  travel_distance?: number;
  service_notes: string;
  worker_signature: string;
  participant_signature?: string;
}

class TimesheetService {
  async getTimesheet(id: string): Promise<Timesheet | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('timesheets')
      .select('*, shifts!timesheets_shift_id_fkey(*), support_workers!timesheets_worker_id_fkey(*), participants!timesheets_participant_id_fkey(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAllTimesheets(filters?: {
    status?: string;
    workerId?: string;
    participantId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Timesheet[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('timesheets')
      .select('*, shifts!timesheets_shift_id_fkey(*), support_workers!timesheets_worker_id_fkey(*), participants!timesheets_participant_id_fkey(*)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.workerId) {
      query = query.eq('worker_id', filters.workerId);
    }

    if (filters?.participantId) {
      query = query.eq('participant_id', filters.participantId);
    }

    if (filters?.startDate) {
      query = query.gte('service_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('service_date', filters.endDate);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query.order('service_date', { ascending: false });

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  private calculateHours(startTime: string, endTime: string, breakTime: number = 0): {
    totalHours: number;
    billableHours: number;
  } {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const billableHours = Math.max(0, totalHours - breakTime);

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      billableHours: Math.round(billableHours * 100) / 100
    };
  }

  async createTimesheet(timesheetData: CreateTimesheetData): Promise<Timesheet> {
    if (!supabase) throw new Error('Supabase not configured');

    const { totalHours, billableHours } = this.calculateHours(
      timesheetData.actual_start_time,
      timesheetData.actual_end_time,
      timesheetData.break_time || 0
    );

    const { data: worker, error: workerError } = await supabase
      .from('support_workers')
      .select('hourly_rate')
      .eq('id', timesheetData.worker_id)
      .maybeSingle();

    if (workerError) throw workerError;

    const serviceDate = new Date(timesheetData.service_date);
    const schadsCalculation = calculateSCHADSPayment(
      worker?.hourly_rate || 42.00,
      billableHours,
      serviceDate,
      timesheetData.actual_start_time
    );

    const { data, error } = await supabase
      .from('timesheets')
      .insert({
        ...timesheetData,
        total_hours: totalHours,
        billable_hours: billableHours,
        break_time: timesheetData.break_time || 0,
        status: 'draft',
        schads_calculation: schadsCalculation
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async submitTimesheet(timesheetId: string): Promise<Timesheet> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('timesheets')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', timesheetId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async approveTimesheet(timesheetId: string, approvedBy: string): Promise<Timesheet> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('timesheets')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: approvedBy,
        reviewed_at: new Date().toISOString(),
        reviewed_by: approvedBy
      })
      .eq('id', timesheetId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async rejectTimesheet(timesheetId: string, rejectedBy: string, reason: string): Promise<Timesheet> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('timesheets')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: rejectedBy,
        rejection_reason: reason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: rejectedBy
      })
      .eq('id', timesheetId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTimesheet(timesheetId: string, updates: Partial<Timesheet>): Promise<Timesheet> {
    if (!supabase) throw new Error('Supabase not configured');

    if (updates.actual_start_time || updates.actual_end_time || updates.break_time !== undefined) {
      const timesheet = await this.getTimesheet(timesheetId);
      if (!timesheet) throw new Error('Timesheet not found');

      const startTime = updates.actual_start_time || timesheet.actual_start_time;
      const endTime = updates.actual_end_time || timesheet.actual_end_time;
      const breakTime = updates.break_time !== undefined ? updates.break_time : timesheet.break_time;

      const { totalHours, billableHours } = this.calculateHours(startTime, endTime, breakTime);

      const { data: worker, error: workerError } = await supabase
        .from('support_workers')
        .select('hourly_rate')
        .eq('id', timesheet.worker_id)
        .maybeSingle();

      if (workerError) throw workerError;

      const serviceDate = new Date(updates.service_date || timesheet.service_date);
      const schadsCalculation = calculateSCHADSPayment(
        worker?.hourly_rate || 42.00,
        billableHours,
        serviceDate,
        startTime
      );

      updates.total_hours = totalHours;
      updates.billable_hours = billableHours;
      updates.schads_calculation = schadsCalculation;
    }

    const { data, error } = await supabase
      .from('timesheets')
      .update(updates)
      .eq('id', timesheetId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPendingTimesheets(): Promise<Timesheet[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('timesheets')
      .select('*, shifts!timesheets_shift_id_fkey(*), support_workers!timesheets_worker_id_fkey(*, user_profiles!support_workers_user_id_fkey(*)), participants!timesheets_participant_id_fkey(*)')
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getWorkerTimesheets(workerId: string, status?: string): Promise<Timesheet[]> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('timesheets')
      .select('*, shifts!timesheets_shift_id_fkey(*), participants!timesheets_participant_id_fkey(*)')
      .eq('worker_id', workerId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('service_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const timesheetService = new TimesheetService();
export default timesheetService;
