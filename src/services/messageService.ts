import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  conversation_id: string;
  from_id: string;
  to_id: string;
  content: string;
  attachments: any[];
  message_type: 'text' | 'file' | 'system' | 'urgent';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  related_service_id?: string;
  is_encrypted: boolean;
  read: boolean;
  read_at?: string;
  created_at: string;
}

export interface CreateMessageData {
  conversation_id: string;
  from_id: string;
  to_id: string;
  content: string;
  attachments?: any[];
  message_type?: string;
  priority?: string;
  related_service_id?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

class MessageService {
  async getConversations(userId: string): Promise<Conversation[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .or(`from_id.eq.${userId},to_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const conversationMap = new Map<string, Conversation>();

    messages?.forEach((message: Message) => {
      const convId = message.conversation_id;

      if (!conversationMap.has(convId)) {
        conversationMap.set(convId, {
          id: convId,
          participants: [message.from_id, message.to_id],
          lastMessage: message,
          unreadCount: 0
        });
      }

      const conv = conversationMap.get(convId)!;
      if (!conv.lastMessage || new Date(message.created_at) > new Date(conv.lastMessage.created_at)) {
        conv.lastMessage = message;
      }

      if (message.to_id === userId && !message.read) {
        conv.unreadCount++;
      }
    });

    return Array.from(conversationMap.values());
  }

  async getMessages(conversationId: string, limit: number = 50): Promise<Message[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getConversationMessages(userId1: string, userId2: string, limit: number = 50): Promise<Message[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const conversationId = this.generateConversationId(userId1, userId2);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async sendMessage(messageData: CreateMessageData): Promise<Message> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('messages')
      .insert({
        ...messageData,
        attachments: messageData.attachments || [],
        message_type: messageData.message_type || 'text',
        priority: messageData.priority || 'normal',
        is_encrypted: false,
        read: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAsRead(messageId: string): Promise<Message> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('messages')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('messages')
      .update({
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('conversation_id', conversationId)
      .eq('to_id', userId)
      .eq('read', false);

    if (error) throw error;
  }

  async getUnreadCount(userId: string): Promise<number> {
    if (!supabase) throw new Error('Supabase not configured');

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('to_id', userId)
      .eq('read', false);

    if (error) throw error;
    return count || 0;
  }

  async deleteMessage(messageId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
  }

  private generateConversationId(userId1: string, userId2: string): string {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  }

  async createOrGetConversation(userId1: string, userId2: string): Promise<string> {
    return this.generateConversationId(userId1, userId2);
  }

  async subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    if (!supabase) throw new Error('Supabase not configured');

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback(payload.new as Message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async searchMessages(userId: string, searchTerm: string): Promise<Message[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`from_id.eq.${userId},to_id.eq.${userId}`)
      .ilike('content', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }
}

export const messageService = new MessageService();
export default messageService;
