import { supabase } from '../lib/supabase';

export interface SupportWorker {
  id: string;
  user_id: string;
  abn: string;
  business_name?: string;
  hourly_rate: number;
  working_radius: number;
  qualifications: any[];
  skills: string[];
  certifications: any[];
  availability: any[];
  experience_years: number;
  languages: string[];
  transport_available: boolean;
  working_with_children_check?: string;
  police_check?: string;
  application_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  compliance_status: any;
  performance_metrics: any;
  banking_details?: any;
  insurance_details?: any;
  preferences: any;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface CreateWorkerData {
  user_id: string;
  abn: string;
  business_name?: string;
  hourly_rate: number;
  working_radius?: number;
  qualifications?: any[];
  skills?: string[];
  certifications?: any[];
  availability?: any[];
  experience_years?: number;
  languages?: string[];
  transport_available?: boolean;
  working_with_children_check?: string;
  police_check?: string;
  banking_details?: any;
  insurance_details?: any;
  preferences?: any;
}

class WorkerService {
  async getWorker(id: string): Promise<SupportWorker | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('support_workers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getWorkerByUserId(userId: string): Promise<SupportWorker | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('support_workers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async getAllWorkers(filters?: {
    status?: string;
    application_status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: SupportWorker[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('support_workers')
      .select('*, user_profiles!support_workers_user_id_fkey(first_name, last_name, email, phone)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.application_status) {
      query = query.eq('application_status', filters.application_status);
    }

    if (filters?.search) {
      query = query.or(`abn.ilike.%${filters.search}%,business_name.ilike.%${filters.search}%`);
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

  async getPendingApplications(): Promise<SupportWorker[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('support_workers')
      .select('*, user_profiles!support_workers_user_id_fkey(first_name, last_name, email, phone)')
      .eq('application_status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async createWorker(workerData: CreateWorkerData): Promise<SupportWorker> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('support_workers')
      .insert({
        ...workerData,
        status: 'pending',
        application_status: 'pending',
        compliance_status: {},
        performance_metrics: {},
        preferences: workerData.preferences || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateWorker(id: string, updates: Partial<SupportWorker>): Promise<SupportWorker> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('support_workers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async approveWorker(id: string): Promise<SupportWorker> {
    return this.updateWorker(id, {
      application_status: 'approved',
      status: 'active'
    });
  }

  async rejectWorker(id: string): Promise<SupportWorker> {
    return this.updateWorker(id, {
      application_status: 'rejected',
      status: 'inactive'
    });
  }

  async suspendWorker(id: string): Promise<SupportWorker> {
    return this.updateWorker(id, {
      status: 'suspended'
    });
  }

  async getWorkerShifts(workerId: string, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('shifts')
      .select('*, participants!shifts_participant_id_fkey(*, user_profiles!participants_user_id_fkey(first_name, last_name))')
      .eq('worker_id', workerId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('scheduled_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('scheduled_date', filters.endDate);
    }

    const { data, error } = await query.order('scheduled_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async getWorkerTimesheets(workerId: string, filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any[]> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('timesheets')
      .select('*, shifts!timesheets_shift_id_fkey(*), participants!timesheets_participant_id_fkey(*)')
      .eq('worker_id', workerId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.startDate) {
      query = query.gte('service_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('service_date', filters.endDate);
    }

    const { data, error } = await query.order('service_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getWorkerEarnings(workerId: string, startDate: string, endDate: string): Promise<{
    totalEarnings: number;
    totalHours: number;
    averageHourlyRate: number;
  }> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('timesheets')
      .select('billable_hours, schads_calculation')
      .eq('worker_id', workerId)
      .eq('status', 'approved')
      .gte('service_date', startDate)
      .lte('service_date', endDate);

    if (error) throw error;

    const totalHours = data?.reduce((sum, ts) => sum + Number(ts.billable_hours), 0) || 0;
    const totalEarnings = data?.reduce((sum, ts) => {
      const calc = ts.schads_calculation as any;
      return sum + (calc?.total_payment || 0);
    }, 0) || 0;
    const averageHourlyRate = totalHours > 0 ? totalEarnings / totalHours : 0;

    return {
      totalEarnings,
      totalHours,
      averageHourlyRate
    };
  }

  async checkComplianceStatus(workerId: string): Promise<{
    status: 'compliant' | 'expiring' | 'expired';
    issues: string[];
    expiringDocuments: any[];
  }> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: worker, error } = await supabase
      .from('support_workers')
      .select('compliance_status, certifications')
      .eq('id', workerId)
      .maybeSingle();

    if (error) throw error;

    const issues: string[] = [];
    const expiringDocuments: any[] = [];
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (worker?.certifications) {
      const certs = Array.isArray(worker.certifications) ? worker.certifications : [];
      certs.forEach((cert: any) => {
        if (cert.expiry_date) {
          const expiryDate = new Date(cert.expiry_date);
          if (expiryDate < today) {
            issues.push(`${cert.name} has expired`);
          } else if (expiryDate < thirtyDaysFromNow) {
            expiringDocuments.push(cert);
          }
        }
      });
    }

    let status: 'compliant' | 'expiring' | 'expired' = 'compliant';
    if (issues.length > 0) {
      status = 'expired';
    } else if (expiringDocuments.length > 0) {
      status = 'expiring';
    }

    return {
      status,
      issues,
      expiringDocuments
    };
  }
}

export const workerService = new WorkerService();
export default workerService;
