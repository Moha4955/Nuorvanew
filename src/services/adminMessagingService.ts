import { supabase } from '../lib/supabase';

export interface AdminMessage {
  id?: string;
  from_user_id: string;
  to_user_id: string;
  subject: string;
  message: string;
  message_type: 'notification' | 'alert' | 'announcement' | 'support';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  read_at?: string;
  created_at?: string;
}

export interface BroadcastMessage {
  id?: string;
  from_user_id: string;
  subject: string;
  message: string;
  target_roles: string[];
  message_type: 'announcement' | 'alert';
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
}

class AdminMessagingService {
  async sendMessageToUser(message: AdminMessage): Promise<void> {
    try {
      if (!supabase) {
        console.log('📧 Admin Message (Demo Mode):', message);
        return;
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: message.from_user_id,
          recipient_id: message.to_user_id,
          content: message.message,
          subject: message.subject,
          message_type: message.message_type,
          priority: message.priority,
          read: false
        });

      if (error) throw error;

      console.log('✅ Message sent to user:', message.to_user_id);
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async sendBroadcastMessage(broadcast: BroadcastMessage): Promise<void> {
    try {
      if (!supabase) {
        console.log('📢 Broadcast Message (Demo Mode):', broadcast);
        return;
      }

      // Get all users with target roles
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('id')
        .in('role', broadcast.target_roles);

      if (usersError) throw usersError;
      if (!users || users.length === 0) {
        console.log('No users found for broadcast');
        return;
      }

      // Send message to all users
      const messages = users.map(user => ({
        sender_id: broadcast.from_user_id,
        recipient_id: user.id,
        content: broadcast.message,
        subject: broadcast.subject,
        message_type: broadcast.message_type,
        priority: broadcast.priority,
        read: false,
        is_broadcast: true
      }));

      const { error: insertError } = await supabase
        .from('messages')
        .insert(messages);

      if (insertError) throw insertError;

      console.log(`✅ Broadcast sent to ${users.length} users`);
    } catch (error) {
      console.error('Error sending broadcast:', error);
      throw new Error('Failed to send broadcast message');
    }
  }

  async getAdminMessages(adminId: string, limit: number = 50): Promise<AdminMessage[]> {
    try {
      if (!supabase) {
        return [];
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', adminId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching admin messages:', error);
      return [];
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      if (!supabase) {
        return;
      }

      const { error } = await supabase
        .from('messages')
        .update({
          read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  async sendComplianceAlert(
    adminId: string,
    workerId: string,
    documentName: string,
    daysUntilExpiry: number
  ): Promise<void> {
    const priority = daysUntilExpiry <= 7 ? 'urgent' : daysUntilExpiry <= 30 ? 'high' : 'medium';

    const message: AdminMessage = {
      from_user_id: adminId,
      to_user_id: workerId,
      subject: `ALERT: ${documentName} Expiring Soon`,
      message: `Your ${documentName} will expire in ${daysUntilExpiry} days. Please renew it immediately to maintain compliance.`,
      message_type: 'alert',
      priority,
      read: false
    };

    await this.sendMessageToUser(message);
  }

  async notifyParticipantShiftAssignment(
    adminId: string,
    participantId: string,
    workerName: string,
    shiftDate: string,
    shiftTime: string
  ): Promise<void> {
    const message: AdminMessage = {
      from_user_id: adminId,
      to_user_id: participantId,
      subject: 'Support Worker Assigned to Your Shift',
      message: `${workerName} has been assigned to support you on ${shiftDate} at ${shiftTime}.`,
      message_type: 'notification',
      priority: 'high',
      read: false
    };

    await this.sendMessageToUser(message);
  }

  async notifyWorkerShiftAssignment(
    adminId: string,
    workerId: string,
    participantName: string,
    shiftDate: string,
    shiftTime: string,
    location: string
  ): Promise<void> {
    const message: AdminMessage = {
      from_user_id: adminId,
      to_user_id: workerId,
      subject: 'New Shift Assignment',
      message: `You have been assigned to support ${participantName} on ${shiftDate} at ${shiftTime} at ${location}. Please accept or decline this shift.`,
      message_type: 'notification',
      priority: 'high',
      read: false
    };

    await this.sendMessageToUser(message);
  }

  async sendTimesheetApprovalNotification(
    adminId: string,
    workerId: string,
    hours: number,
    amount: number
  ): Promise<void> {
    const message: AdminMessage = {
      from_user_id: adminId,
      to_user_id: workerId,
      subject: 'Timesheet Approved',
      message: `Your timesheet has been approved for ${hours} hours, totaling $${amount.toFixed(2)}.`,
      message_type: 'notification',
      priority: 'medium',
      read: false
    };

    await this.sendMessageToUser(message);
  }

  async sendInvoiceNotification(
    adminId: string,
    participantId: string,
    invoiceNumber: string,
    amount: number,
    dueDate: string
  ): Promise<void> {
    const message: AdminMessage = {
      from_user_id: adminId,
      to_user_id: participantId,
      subject: `Invoice Available: ${invoiceNumber}`,
      message: `Your invoice #${invoiceNumber} for $${amount.toFixed(2)} is ready. Due date: ${dueDate}.`,
      message_type: 'notification',
      priority: 'high',
      read: false
    };

    await this.sendMessageToUser(message);
  }

  async announceMaintenanceWindow(
    adminId: string,
    targetRoles: string[],
    startTime: string,
    endTime: string,
    reason: string
  ): Promise<void> {
    const broadcast: BroadcastMessage = {
      from_user_id: adminId,
      subject: 'System Maintenance Notice',
      message: `System maintenance scheduled from ${startTime} to ${endTime}. Reason: ${reason}. Thank you for your patience.`,
      target_roles: targetRoles,
      message_type: 'announcement',
      priority: 'high'
    };

    await this.sendBroadcastMessage(broadcast);
  }

  async announceNewFeature(
    adminId: string,
    targetRoles: string[],
    featureName: string,
    description: string
  ): Promise<void> {
    const broadcast: BroadcastMessage = {
      from_user_id: adminId,
      subject: `New Feature Available: ${featureName}`,
      message: `${description}. Check your dashboard for more information.`,
      target_roles: targetRoles,
      message_type: 'announcement',
      priority: 'medium'
    };

    await this.sendBroadcastMessage(broadcast);
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    try {
      if (!supabase) {
        return 0;
      }

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }
}

export const adminMessagingService = new AdminMessagingService();
export default adminMessagingService;
