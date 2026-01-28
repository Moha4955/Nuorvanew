import { supabase } from '../lib/supabase';

export interface Shift {
  id: string;
  service_request_id?: string;
  participant_id: string;
  worker_id?: string;
  title: string;
  description?: string;
  service_category: string;
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  duration: number;
  actual_duration?: number;
  location_details: any;
  status: string;
  urgency: string;
  risk_level: string;
  requirements: string[];
  estimated_cost?: number;
  actual_cost?: number;
  assigned_at?: string;
  assigned_by?: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  admin_notes?: string;
  worker_notes?: string;
  participant_feedback?: any;
  is_recurring: boolean;
  recurring_shift_id?: string;
  parent_shift_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateShiftData {
  service_request_id?: string;
  participant_id: string;
  worker_id?: string;
  title: string;
  description?: string;
  service_category: string;
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  duration: number;
  location_details: any;
  urgency?: string;
  risk_level?: string;
  requirements?: string[];
  estimated_cost?: number;
  is_recurring?: boolean;
}

class ShiftService {
  async getShift(id: string): Promise<Shift | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .select('*, participants!shifts_participant_id_fkey(*, user_profiles!participants_user_id_fkey(*)), support_workers!shifts_worker_id_fkey(*, user_profiles!support_workers_user_id_fkey(*))')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAllShifts(filters?: {
    status?: string;
    participantId?: string;
    workerId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Shift[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('shifts')
      .select('*, participants!shifts_participant_id_fkey(*), support_workers!shifts_worker_id_fkey(*)', { count: 'exact' });

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
      query = query.gte('scheduled_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('scheduled_date', filters.endDate);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query.order('scheduled_date', { ascending: true });

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  async createShift(shiftData: CreateShiftData): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .insert({
        ...shiftData,
        status: shiftData.worker_id ? 'assigned' : 'pending_assignment',
        urgency: shiftData.urgency || 'medium',
        risk_level: shiftData.risk_level || 'low',
        requirements: shiftData.requirements || [],
        is_recurring: shiftData.is_recurring || false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async assignWorker(shiftId: string, workerId: string, assignedBy: string): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .update({
        worker_id: workerId,
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        assigned_by: assignedBy
      })
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async confirmShift(shiftId: string): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .update({
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async startShift(shiftId: string): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .update({
        status: 'in_progress',
        actual_start_time: new Date().toTimeString().slice(0, 8)
      })
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async completeShift(shiftId: string, actualEndTime?: string): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const shift = await this.getShift(shiftId);
    if (!shift) throw new Error('Shift not found');

    const endTime = actualEndTime || new Date().toTimeString().slice(0, 8);

    let actualDuration = 0;
    if (shift.actual_start_time) {
      const start = new Date(`2000-01-01T${shift.actual_start_time}`);
      const end = new Date(`2000-01-01T${endTime}`);
      actualDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    const { data, error } = await supabase
      .from('shifts')
      .update({
        status: 'completed',
        actual_end_time: endTime,
        actual_duration: actualDuration,
        completed_at: new Date().toISOString()
      })
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async cancelShift(shiftId: string, reason: string): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason
      })
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateShift(shiftId: string, updates: Partial<Shift>): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .update(updates)
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUpcomingShifts(workerId: string, limit: number = 10): Promise<Shift[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .select('*, participants!shifts_participant_id_fkey(*, user_profiles!participants_user_id_fkey(*))')
      .eq('worker_id', workerId)
      .in('status', ['assigned', 'confirmed'])
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_start_time', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getUnassignedShifts(): Promise<Shift[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .select('*, participants!shifts_participant_id_fkey(*)')
      .eq('status', 'pending_assignment')
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addParticipantFeedback(shiftId: string, feedback: any): Promise<Shift> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .update({
        participant_feedback: feedback
      })
      .eq('id', shiftId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const shiftService = new ShiftService();
export default shiftService;
