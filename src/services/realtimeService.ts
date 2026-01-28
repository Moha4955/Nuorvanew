import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

type MessageCallback = (payload: any) => void;
type PresenceCallback = (state: any) => void;

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();

  subscribeToMessages(conversationId: string, onMessage: MessageCallback): () => void {
    if (!supabase) {
      console.log('Real-time not available in demo mode');
      return () => {};
    }

    const channelName = `messages:${conversationId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          onMessage(payload.new);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  subscribeToUserPresence(userId: string, onPresenceChange: PresenceCallback): () => void {
    if (!supabase) {
      return () => {};
    }

    const channelName = `presence:${userId}`;

    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        onPresenceChange(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            online_at: new Date().toISOString(),
            user_id: userId
          });
        }
      });

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  subscribeToNotifications(userId: string, onNotification: MessageCallback): () => void {
    if (!supabase) {
      return () => {};
    }

    const channelName = `notifications:${userId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          onNotification(payload.new);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  subscribeToShiftUpdates(workerId: string, onUpdate: MessageCallback): () => void {
    if (!supabase) {
      return () => {};
    }

    const channelName = `shifts:${workerId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shifts',
          filter: `worker_id=eq.${workerId}`
        },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  subscribeToComplianceAlerts(userId: string, onAlert: MessageCallback): () => void {
    if (!supabase) {
      return () => {};
    }

    const channelName = `compliance:${userId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.new && payload.new.expiry_date) {
            const expiryDate = new Date(payload.new.expiry_date);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            if (daysUntilExpiry <= 30) {
              onAlert({
                type: 'compliance',
                document: payload.new,
                daysUntilExpiry
              });
            }
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);

    return () => {
      channel.unsubscribe();
      this.channels.delete(channelName);
    };
  }

  broadcastTyping(conversationId: string, userId: string, isTyping: boolean): void {
    if (!supabase) return;

    const channelName = `messages:${conversationId}`;
    const channel = this.channels.get(channelName);

    if (channel) {
      channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId, isTyping }
      });
    }
  }

  unsubscribeAll(): void {
    this.channels.forEach(channel => {
      channel.unsubscribe();
    });
    this.channels.clear();
  }
}

export const realtimeService = new RealtimeService();
export default realtimeService;
