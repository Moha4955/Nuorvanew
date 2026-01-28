import { supabase } from '../lib/supabase';

export interface AuditLog {
  id: string;
  user_id?: string;
  table_name: string;
  record_id: string;
  action: 'create' | 'update' | 'delete' | 'view';
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  outcome: 'success' | 'failure' | 'partial';
  error_message?: string;
  metadata: any;
  timestamp: string;
}

export interface CreateAuditLogData {
  user_id?: string;
  table_name: string;
  record_id: string;
  action: 'create' | 'update' | 'delete' | 'view';
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  outcome?: 'success' | 'failure' | 'partial';
  error_message?: string;
  metadata?: any;
}

class AuditService {
  async createAuditLog(auditData: CreateAuditLogData): Promise<AuditLog> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        ...auditData,
        outcome: auditData.outcome || 'success',
        metadata: auditData.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getAuditLogs(filters?: {
    userId?: string;
    tableName?: string;
    recordId?: string;
    action?: string;
    outcome?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ data: AuditLog[]; count: number }> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' });

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.tableName) {
      query = query.eq('table_name', filters.tableName);
    }

    if (filters?.recordId) {
      query = query.eq('record_id', filters.recordId);
    }

    if (filters?.action) {
      query = query.eq('action', filters.action);
    }

    if (filters?.outcome) {
      query = query.eq('outcome', filters.outcome);
    }

    if (filters?.startDate) {
      query = query.gte('timestamp', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('timestamp', filters.endDate);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query.order('timestamp', { ascending: false });

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  }

  async getUserActivity(userId: string, days: number = 30): Promise<AuditLog[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getRecordHistory(tableName: string, recordId: string): Promise<AuditLog[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async logCreate(
    userId: string,
    tableName: string,
    recordId: string,
    newValues: any,
    metadata?: any
  ): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      table_name: tableName,
      record_id: recordId,
      action: 'create',
      new_values: newValues,
      outcome: 'success',
      metadata
    });
  }

  async logUpdate(
    userId: string,
    tableName: string,
    recordId: string,
    oldValues: any,
    newValues: any,
    metadata?: any
  ): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      table_name: tableName,
      record_id: recordId,
      action: 'update',
      old_values: oldValues,
      new_values: newValues,
      outcome: 'success',
      metadata
    });
  }

  async logDelete(
    userId: string,
    tableName: string,
    recordId: string,
    oldValues: any,
    metadata?: any
  ): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      table_name: tableName,
      record_id: recordId,
      action: 'delete',
      old_values: oldValues,
      outcome: 'success',
      metadata
    });
  }

  async logView(
    userId: string,
    tableName: string,
    recordId: string,
    metadata?: any
  ): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      table_name: tableName,
      record_id: recordId,
      action: 'view',
      outcome: 'success',
      metadata
    });
  }

  async logFailure(
    userId: string | undefined,
    tableName: string,
    recordId: string,
    action: 'create' | 'update' | 'delete' | 'view',
    errorMessage: string,
    metadata?: any
  ): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      table_name: tableName,
      record_id: recordId,
      action,
      outcome: 'failure',
      error_message: errorMessage,
      metadata
    });
  }

  async getFailedActions(days: number = 7): Promise<AuditLog[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('outcome', 'failure')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getActivitySummary(userId: string, days: number = 30): Promise<{
    totalActions: number;
    actionsByType: Record<string, number>;
    actionsByTable: Record<string, number>;
    successRate: number;
  }> {
    if (!supabase) throw new Error('Supabase not configured');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data: logs, error } = await supabase
      .from('audit_logs')
      .select('action, table_name, outcome')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;

    const totalActions = logs?.length || 0;
    const actionsByType: Record<string, number> = {};
    const actionsByTable: Record<string, number> = {};
    let successCount = 0;

    logs?.forEach(log => {
      actionsByType[log.action] = (actionsByType[log.action] || 0) + 1;
      actionsByTable[log.table_name] = (actionsByTable[log.table_name] || 0) + 1;
      if (log.outcome === 'success') successCount++;
    });

    const successRate = totalActions > 0 ? (successCount / totalActions) * 100 : 100;

    return {
      totalActions,
      actionsByType,
      actionsByTable,
      successRate
    };
  }

  async exportAuditLogs(filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    tableName?: string;
  }): Promise<AuditLog[]> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('audit_logs')
      .select('*');

    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters?.tableName) {
      query = query.eq('table_name', filters.tableName);
    }

    if (filters?.startDate) {
      query = query.gte('timestamp', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('timestamp', filters.endDate);
    }

    const { data, error } = await query.order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async cleanOldLogs(daysToKeep: number = 365): Promise<number> {
    if (!supabase) throw new Error('Supabase not configured');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { data, error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('timestamp', cutoffDate.toISOString())
      .select();

    if (error) throw error;
    return data?.length || 0;
  }
}

export const auditService = new AuditService();
export default auditService;
