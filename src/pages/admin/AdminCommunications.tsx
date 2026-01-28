import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  MessageSquare,
  Send,
  Radio,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Mail,
  Bell
} from 'lucide-react';
import { adminMessagingService } from '../../services/adminMessagingService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  to_name: string;
  subject: string;
  message: string;
  type: string;
  priority: string;
  timestamp: string;
  read: boolean;
}

const AdminCommunications: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sent' | 'compose' | 'broadcast'>('sent');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'alerts'>('all');

  // Compose form state
  const [composeForm, setComposeForm] = useState({
    recipientId: '',
    recipientName: '',
    subject: '',
    message: '',
    messageType: 'notification' as const,
    priority: 'medium' as const
  });

  // Broadcast form state
  const [broadcastForm, setBroadcastForm] = useState({
    subject: '',
    message: '',
    targetRoles: [] as string[],
    messageType: 'announcement' as const,
    priority: 'medium' as const
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      const adminMessages = await adminMessagingService.getAdminMessages(user.id);

      // Format messages for display
      const formattedMessages: Message[] = adminMessages.map((msg: any) => ({
        id: msg.id || '',
        to_name: msg.recipient_name || 'Unknown',
        subject: msg.subject || '',
        message: msg.content || msg.message || '',
        type: msg.message_type || 'notification',
        priority: msg.priority || 'medium',
        timestamp: new Date(msg.created_at).toLocaleString(),
        read: msg.read || false
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!composeForm.recipientId || !composeForm.subject || !composeForm.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (!user?.id) return;

      await adminMessagingService.sendMessageToUser({
        from_user_id: user.id,
        to_user_id: composeForm.recipientId,
        subject: composeForm.subject,
        message: composeForm.message,
        message_type: composeForm.messageType,
        priority: composeForm.priority,
        read: false
      });

      toast.success('Message sent successfully');

      // Reset form
      setComposeForm({
        recipientId: '',
        recipientName: '',
        subject: '',
        message: '',
        messageType: 'notification',
        priority: 'medium'
      });

      setActiveTab('sent');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastForm.subject || !broadcastForm.message || broadcastForm.targetRoles.length === 0) {
      toast.error('Please fill in all required fields and select at least one role');
      return;
    }

    try {
      if (!user?.id) return;

      await adminMessagingService.sendBroadcastMessage({
        from_user_id: user.id,
        subject: broadcastForm.subject,
        message: broadcastForm.message,
        target_roles: broadcastForm.targetRoles,
        message_type: broadcastForm.messageType,
        priority: broadcastForm.priority
      });

      toast.success(`Broadcast sent to ${broadcastForm.targetRoles.length} role(s)`);

      // Reset form
      setBroadcastForm({
        subject: '',
        message: '',
        targetRoles: [],
        messageType: 'announcement',
        priority: 'medium'
      });

      setActiveTab('sent');
      await loadMessages();
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast.error('Failed to send broadcast');
    }
  };

  const toggleRole = (role: string) => {
    setBroadcastForm(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role]
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'notification':
        return <Bell size={16} className="text-blue-600" />;
      case 'announcement':
        return <Broadcast size={16} className="text-green-600" />;
      default:
        return <Mail size={16} className="text-gray-600" />;
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.to_name.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'unread') return !msg.read && matchesSearch;
    if (filter === 'alerts') return msg.type === 'alert' && matchesSearch;
    return matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Communications Center</h1>
            <p className="text-gray-600 mt-1">Send messages and broadcasts to users</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <MessageSquare size={18} className="mr-2" />
              New Message
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'sent', name: 'Sent Messages', icon: Send },
              { id: 'compose', name: 'Send Message', icon: MessageSquare },
              { id: 'broadcast', name: 'Broadcast', icon: Radio }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={18} className="mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Sent Messages Tab */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="alerts">Alerts Only</option>
              </select>
            </div>

            {/* Messages List */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center">
                  <MessageSquare size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No messages found</p>
                </div>
              ) : (
                filteredMessages.map(msg => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">{getTypeIcon(msg.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{msg.subject}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(msg.priority)}`}>
                              {msg.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{msg.message.substring(0, 100)}...</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>To: {msg.to_name}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {msg.timestamp}
                            </span>
                            {!msg.read && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <AlertCircle size={12} />
                                Unread
                              </span>
                            )}
                            {msg.read && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle size={12} />
                                Read
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Compose Message Tab */}
        {activeTab === 'compose' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Direct Message</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient</label>
                <input
                  type="text"
                  placeholder="Enter recipient name or ID"
                  value={composeForm.recipientName}
                  onChange={(e) => setComposeForm({ ...composeForm, recipientName: e.target.value, recipientId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                  <select
                    value={composeForm.messageType}
                    onChange={(e) => setComposeForm({ ...composeForm, messageType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="notification">Notification</option>
                    <option value="alert">Alert</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={composeForm.priority}
                    onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Message subject"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  placeholder="Write your message here..."
                  value={composeForm.message}
                  onChange={(e) => setComposeForm({ ...composeForm, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setActiveTab('sent')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Send size={18} className="mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send Broadcast Message</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Send to Roles</label>
                <div className="space-y-2">
                  {['participant', 'support_worker', 'team_leader', 'compliance', 'admin'].map(role => (
                    <label key={role} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={broadcastForm.targetRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="rounded border-gray-300 text-blue-600 mr-3"
                      />
                      <span className="text-sm text-gray-700 capitalize">{role.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                  <select
                    value={broadcastForm.messageType}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, messageType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={broadcastForm.priority}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  placeholder="Broadcast subject"
                  value={broadcastForm.subject}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  placeholder="Write your broadcast message here..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setActiveTab('sent')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBroadcast}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Radio size={18} className="mr-2" />
                  Send Broadcast
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminCommunications;
