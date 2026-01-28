import { supabase } from '../lib/supabase';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'form_assignment' | 'form_reminder' | 'compliance_alert' | 'system_update' | 'incident_alert' | 'service_update' | 'payment_due' | 'payment_received' | 'message_received';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  action_required: boolean;
  action_url?: string;
  expires_at?: string;
  metadata: any;
  created_at: string;
}

export interface CreateNotificationData {
  user_id: string;
  title: string;
  message: string;
  type: string;
  priority?: string;
  action_required?: boolean;
  action_url?: string;
  expires_at?: string;
  metadata?: any;
}

class NotificationService {
  async getNotifications(userId: string, filters?: {
    read?: boolean;
    type?: string;
    limit?: number;
  }): Promise<Notification[]> {
    if (!supabase) throw new Error('Supabase not configured');

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);

    if (filters?.read !== undefined) {
      query = query.eq('read', filters.read);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getUnreadCount(userId: string): Promise<number> {
    if (!supabase) throw new Error('Supabase not configured');

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  }

  async createNotification(notificationData: CreateNotificationData): Promise<Notification> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notificationData,
        priority: notificationData.priority || 'normal',
        read: false,
        action_required: notificationData.action_required || false,
        metadata: notificationData.metadata || {}
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createBulkNotifications(notifications: CreateNotificationData[]): Promise<Notification[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const notificationsToInsert = notifications.map(n => ({
      ...n,
      priority: n.priority || 'normal',
      read: false,
      action_required: n.action_required || false,
      metadata: n.metadata || {}
    }));

    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationsToInsert)
      .select();

    if (error) throw error;
    return data || [];
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAllAsRead(userId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  }

  async deleteExpiredNotifications(): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('notifications')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;
  }

  async notifyFormAssignment(userId: string, formType: string, dueDate: string, formId: string): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'New Form Assignment',
      message: `You have been assigned a ${formType.replace('_', ' ')} form. Due date: ${new Date(dueDate).toLocaleDateString()}`,
      type: 'form_assignment',
      priority: 'high',
      action_required: true,
      action_url: `/forms/${formId}`,
      metadata: { formType, dueDate, formId }
    });
  }

  async notifyComplianceAlert(userId: string, alertType: string, message: string): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'Compliance Alert',
      message,
      type: 'compliance_alert',
      priority: 'high',
      action_required: true,
      metadata: { alertType }
    });
  }

  async notifyShiftAssignment(userId: string, shiftDetails: any): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: 'New Shift Assignment',
      message: `You have been assigned a new shift on ${shiftDetails.date}`,
      type: 'service_update',
      priority: 'normal',
      action_required: true,
      action_url: `/worker/shifts`,
      metadata: { shiftId: shiftDetails.id }
    });
  }

  async notifyPayment(userId: string, amount: number, paymentType: 'due' | 'received'): Promise<Notification> {
    const title = paymentType === 'due' ? 'Payment Due' : 'Payment Received';
    const message = paymentType === 'due'
      ? `You have a payment of $${amount.toFixed(2)} due`
      : `Payment of $${amount.toFixed(2)} has been received`;

    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: paymentType === 'due' ? 'payment_due' : 'payment_received',
      priority: paymentType === 'due' ? 'high' : 'normal',
      action_required: paymentType === 'due',
      action_url: paymentType === 'due' ? '/participant/invoices' : undefined,
      metadata: { amount, paymentType }
    });
  }

  async notifyMessage(userId: string, fromName: string, messagePreview: string): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title: `New message from ${fromName}`,
      message: messagePreview,
      type: 'message_received',
      priority: 'normal',
      action_required: false,
      action_url: '/messages',
      metadata: { fromName }
    });
  }

  async subscribeToRealtimeNotifications(userId: string, callback: (notification: Notification) => void) {
    if (!supabase) throw new Error('Supabase not configured');

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
