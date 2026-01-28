import { supabase } from '../lib/supabase';

export interface FormSubmission {
  id: string;
  participant_id: string;
  form_type: 'service_agreement' | 'risk_assessment' | 'incident_report' | 'support_plan';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  assigned_by?: string;
  assigned_to?: string;
  due_date?: string;
  completed_date?: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  form_data: any;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

class FormService {
  async getParticipants() {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('participants')
      .select('id, ndis_number, status, user_profiles!participants_user_id_fkey(first_name, last_name, email)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.user_profiles ? `${p.user_profiles.first_name} ${p.user_profiles.last_name}` : 'Unknown',
      email: p.user_profiles?.email || '',
      ndis_number: p.ndis_number,
      status: p.status
    }));
  }

  async getFormSubmissions(filters?: {
    participantId?: string;
    formType?: string;
    status?: string;
  }) {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('form_submissions')
      .select('*, participants!form_submissions_participant_id_fkey(*, user_profiles!participants_user_id_fkey(*))');

    if (filters?.participantId) {
      query = query.eq('participant_id', filters.participantId);
    }

    if (filters?.formType) {
      query = query.eq('form_type', filters.formType);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getFormSubmission(id: string): Promise<FormSubmission | null> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createFormSubmission(data: {
    participant_id: string;
    form_type: string;
    assigned_by?: string;
    assigned_to?: string;
    due_date?: string;
    priority?: string;
    notes?: string;
    form_data?: any;
  }) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: formSubmission, error } = await supabase
      .from('form_submissions')
      .insert({
        ...data,
        status: 'pending',
        priority: data.priority || 'medium',
        form_data: data.form_data || {},
        reminder_sent: false
      })
      .select()
      .single();

    if (error) throw error;
    return formSubmission;
  }

  async saveServiceAgreement(data: any) {
    if (!supabase) throw new Error('Supabase not configured');

    const formData = {
      participant_id: data.participantId,
      form_type: 'service_agreement' as const,
      status: data.status || 'completed' as const,
      form_data: data,
      completed_date: new Date().toISOString()
    };

    if (data.submissionId) {
      const { data: updated, error } = await supabase
        .from('form_submissions')
        .update({ form_data: data, status: 'completed', completed_date: new Date().toISOString() })
        .eq('id', data.submissionId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      const { data: created, error } = await supabase
        .from('form_submissions')
        .insert(formData)
        .select()
        .single();

      if (error) throw error;
      return created;
    }
  }

  async saveRiskAssessment(data: any) {
    if (!supabase) throw new Error('Supabase not configured');

    const formData = {
      participant_id: data.participantId,
      form_type: 'risk_assessment' as const,
      status: data.status || 'completed' as const,
      form_data: data,
      completed_date: new Date().toISOString()
    };

    if (data.submissionId) {
      const { data: updated, error } = await supabase
        .from('form_submissions')
        .update({ form_data: data, status: 'completed', completed_date: new Date().toISOString() })
        .eq('id', data.submissionId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      const { data: created, error } = await supabase
        .from('form_submissions')
        .insert(formData)
        .select()
        .single();

      if (error) throw error;
      return created;
    }
  }

  async saveIncidentReport(data: any) {
    if (!supabase) throw new Error('Supabase not configured');

    const formData = {
      participant_id: data.participantId,
      form_type: 'incident_report' as const,
      status: 'completed' as const,
      form_data: data,
      priority: data.severity === 'critical' ? 'high' as const : 'medium' as const,
      completed_date: new Date().toISOString()
    };

    const { data: created, error } = await supabase
      .from('form_submissions')
      .insert(formData)
      .select()
      .single();

    if (error) throw error;
    return created;
  }

  async saveSupportPlan(data: any) {
    if (!supabase) throw new Error('Supabase not configured');

    const formData = {
      participant_id: data.participantId,
      form_type: 'support_plan' as const,
      status: data.status || 'completed' as const,
      form_data: data,
      completed_date: new Date().toISOString()
    };

    if (data.submissionId) {
      const { data: updated, error } = await supabase
        .from('form_submissions')
        .update({ form_data: data, status: 'completed', completed_date: new Date().toISOString() })
        .eq('id', data.submissionId)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } else {
      const { data: created, error } = await supabase
        .from('form_submissions')
        .insert(formData)
        .select()
        .single();

      if (error) throw error;
      return created;
    }
  }

  async updateFormSubmissionStatus(id: string, status: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const updates: any = { status };

    if (status === 'completed') {
      updates.completed_date = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('form_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async autoSaveForm(formId: string, formData: any) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('form_submissions')
      .update({
        form_data: formData,
        status: 'in_progress'
      })
      .eq('id', formId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async validateForm(formType: string, data: any) {
    const errors: string[] = [];

    switch (formType) {
      case 'service_agreement':
        if (!data.participantInfo?.name) errors.push('Participant name is required');
        if (!data.services || data.services.length === 0) errors.push('At least one service is required');
        break;
      case 'risk_assessment':
        if (!data.participantInfo?.name) errors.push('Participant name is required');
        if (!data.identifiedRisks || data.identifiedRisks.length === 0) errors.push('At least one risk must be identified');
        break;
      case 'incident_report':
        if (!data.incidentDetails?.date) errors.push('Incident date is required');
        if (!data.incidentDetails?.description) errors.push('Incident description is required');
        break;
      case 'support_plan':
        if (!data.participantInfo?.name) errors.push('Participant name is required');
        if (!data.goals || data.goals.length === 0) errors.push('At least one goal is required');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async generateFormPDF(formId: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: formSubmission, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('id', formId)
      .maybeSingle();

    if (error) throw error;
    if (!formSubmission) throw new Error('Form submission not found');

    return {
      pdfUrl: `/api/forms/${formId}/pdf`,
      generatedAt: new Date(),
      formData: formSubmission
    };
  }

  async assignForm(participantId: string, formType: string, assignedBy: string, dueDate?: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        participant_id: participantId,
        form_type: formType,
        assigned_by: assignedBy,
        due_date: dueDate,
        status: 'pending',
        priority: 'medium',
        form_data: {},
        reminder_sent: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async sendReminder(formSubmissionId: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('form_submissions')
      .update({ reminder_sent: true })
      .eq('id', formSubmissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOverdueForms() {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('form_submissions')
      .select('*, participants!form_submissions_participant_id_fkey(*)')
      .in('status', ['pending', 'in_progress'])
      .lt('due_date', new Date().toISOString())
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  }
}

// Create and export instance
const formService = new FormService();

export { formService };
export default FormService;