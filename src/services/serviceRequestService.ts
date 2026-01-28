import { supabase } from '../lib/supabase';

export interface ServiceRequest {
  id: string;
  participant_id: string;
  title: string;
  description: string;
  service_category: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  location_type: 'participant_home' | 'community' | 'provider_location' | 'virtual';
  location_details: any;
  preferred_date: string;
  alternative_dates: string[];
  duration: number;
  status: 'submitted' | 'under_review' | 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  assigned_worker_id?: string;
  requirements: string[];
  budget_allocation?: any;
  risk_level: 'low' | 'medium' | 'high';
  special_instructions?: string;
  equipment_needed: string[];
  accessibility_requirements: string[];
  estimated_cost?: number;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceRequestData {
  participant_id: string;
  title: string;
  description: string;
  service_category: string;
  urgency?: string;
  location_type: string;
  location_details: any;
  preferred_date: string;
  alternative_dates?: string[];
  duration: number;
  requirements?: string[];
  budget_allocation?: any;
  risk_level?: string;
  special_instructions?: string;
  equipment_needed?: string[];
  accessibility_requirements?: string[];
}

class ServiceRequestService {
  async getServiceRequest(id: string): Promise<ServiceRequest | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('service_requests')
      .select('*, participants!service_requests_participant_id_fkey(*), support_workers!service_requests_assigned_worker_id_fkey(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAllServiceRequests(filters?: {
    status?: string;
    participantId?: string;
    workerId?: string;
    urgency?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: ServiceRequest[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('service_requests')
      .select('*, participants!service_requests_participant_id_fkey(*), support_workers!service_requests_assigned_worker_id_fkey(*)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.participantId) {
      query = query.eq('participant_id', filters.participantId);
    }

    if (filters?.workerId) {
      query = query.eq('assigned_worker_id', filters.workerId);
    }

    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    if (filters?.startDate) {
      query = query.gte('preferred_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('preferred_date', filters.endDate);
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

  async createServiceRequest(requestData: CreateServiceRequestData): Promise<ServiceRequest> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        ...requestData,
        urgency: requestData.urgency || 'medium',
        risk_level: requestData.risk_level || 'low',
        alternative_dates: requestData.alternative_dates || [],
        requirements: requestData.requirements || [],
        equipment_needed: requestData.equipment_needed || [],
        accessibility_requirements: requestData.accessibility_requirements || [],
        status: 'submitted'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateServiceRequest(requestId: string, updates: Partial<ServiceRequest>): Promise<ServiceRequest> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async assignWorker(requestId: string, workerId: string): Promise<ServiceRequest> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('service_requests')
      .update({
        assigned_worker_id: workerId,
        status: 'assigned'
      })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateStatus(requestId: string, status: string, notes?: string): Promise<ServiceRequest> {
    if (!supabase) throw new Error('Supabase not configured');

    const updates: any = { status };
    if (notes) {
      updates.admin_notes = notes;
    }

    const { data, error } = await supabase
      .from('service_requests')
      .update(updates)
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async cancelServiceRequest(requestId: string, reason?: string): Promise<ServiceRequest> {
    return this.updateStatus(requestId, 'cancelled', reason);
  }

  async confirmServiceRequest(requestId: string): Promise<ServiceRequest> {
    return this.updateStatus(requestId, 'confirmed');
  }

  async completeServiceRequest(requestId: string): Promise<ServiceRequest> {
    return this.updateStatus(requestId, 'completed');
  }

  async getPendingRequests(): Promise<ServiceRequest[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('service_requests')
      .select('*, participants!service_requests_participant_id_fkey(*)')
      .in('status', ['submitted', 'under_review'])
      .order('urgency', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getUrgentRequests(): Promise<ServiceRequest[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('service_requests')
      .select('*, participants!service_requests_participant_id_fkey(*)')
      .in('status', ['submitted', 'under_review', 'assigned'])
      .in('urgency', ['high', 'urgent'])
      .order('urgency', { ascending: false })
      .order('preferred_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async estimateCost(duration: number, serviceCategory: string): Promise<number> {
    const baseRates: Record<string, number> = {
      'personal_care': 42.00,
      'household_tasks': 38.50,
      'community_access': 45.00,
      'transport': 40.00,
      'meal_preparation': 38.50,
      'social_support': 42.00,
      'skills_development': 48.00,
      'therapy_support': 52.00
    };

    const baseRate = baseRates[serviceCategory] || 42.00;
    return Math.round(duration * baseRate * 100) / 100;
  }

  async deleteServiceRequest(requestId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('service_requests')
      .delete()
      .eq('id', requestId);

    if (error) throw error;
  }

  async searchServiceRequests(searchTerm: string, participantId?: string): Promise<ServiceRequest[]> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('service_requests')
      .select('*, participants!service_requests_participant_id_fkey(*)')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,service_category.ilike.%${searchTerm}%`);

    if (participantId) {
      query = query.eq('participant_id', participantId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}

export const serviceRequestService = new ServiceRequestService();
export default serviceRequestService;
