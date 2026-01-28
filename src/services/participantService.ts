import { supabase } from '../lib/supabase';

export interface Participant {
  id: string;
  user_id: string;
  ndis_number: string;
  date_of_birth: string;
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
  };
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
  };
  support_coordinator?: {
    name: string;
    email: string;
    phone: string;
  };
  cultural_background?: string;
  communication_preferences?: string[];
  disability_type?: string;
  support_needs?: string;
  plan_start_date?: string;
  plan_end_date?: string;
  plan_budget?: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface CreateParticipantData {
  user_id: string;
  ndis_number: string;
  date_of_birth: string;
  address: any;
  emergency_contact: any;
  support_coordinator?: any;
  cultural_background?: string;
  communication_preferences?: string[];
  disability_type?: string;
  support_needs?: string;
  plan_start_date?: string;
  plan_end_date?: string;
  plan_budget?: number;
}

class ParticipantService {
  async getParticipant(id: string): Promise<Participant | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getParticipantByUserId(userId: string): Promise<Participant | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAllParticipants(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Participant[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('participants')
      .select('*, user_profiles!participants_user_id_fkey(first_name, last_name, email, phone)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`ndis_number.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  async createParticipant(participantData: CreateParticipantData): Promise<Participant> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('participants')
      .insert(participantData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateParticipant(id: string, updates: Partial<Participant>): Promise<Participant> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('participants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteParticipant(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getBudgetUsage(participantId: string): Promise<{
    totalBudget: number;
    usedBudget: number;
    remainingBudget: number;
    percentUsed: number;
  }> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('plan_budget')
      .eq('id', participantId)
      .maybeSingle();

    if (participantError) throw participantError;

    const totalBudget = participant?.plan_budget || 0;

    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('total_amount')
      .eq('participant_id', participantId)
      .in('status', ['sent', 'approved', 'paid']);

    if (invoicesError) throw invoicesError;

    const usedBudget = invoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0;
    const remainingBudget = totalBudget - usedBudget;
    const percentUsed = totalBudget > 0 ? (usedBudget / totalBudget) * 100 : 0;

    return {
      totalBudget,
      usedBudget,
      remainingBudget,
      percentUsed
    };
  }

  async getUpcomingServices(participantId: string): Promise<any[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .select('*, support_workers!shifts_worker_id_fkey(*, user_profiles!support_workers_user_id_fkey(first_name, last_name))')
      .eq('participant_id', participantId)
      .in('status', ['confirmed', 'assigned'])
      .gte('scheduled_date', new Date().toISOString().split('T')[0])
      .order('scheduled_date', { ascending: true })
      .order('scheduled_start_time', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  async getActiveWorkers(participantId: string): Promise<any[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('shifts')
      .select('worker_id, support_workers!shifts_worker_id_fkey(*, user_profiles!support_workers_user_id_fkey(first_name, last_name, email, phone))')
      .eq('participant_id', participantId)
      .in('status', ['confirmed', 'completed'])
      .not('worker_id', 'is', null);

    if (error) throw error;

    const uniqueWorkers = new Map();
    data?.forEach((shift: any) => {
      if (shift.support_workers && !uniqueWorkers.has(shift.worker_id)) {
        uniqueWorkers.set(shift.worker_id, shift.support_workers);
      }
    });

    return Array.from(uniqueWorkers.values());
  }
}

export const participantService = new ParticipantService();
export default participantService;
