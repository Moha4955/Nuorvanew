import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PermissionGuard from '../../components/PermissionGuard';
import { 
  Bell, 
  Send, 
  Users, 
  Filter, 
  Search,
  Eye,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Mail,
  MessageCircle,
  Smartphone,
  Globe,
  Calendar,
  User,
  Plus,
  X
} from 'lucide-react';
import { PERMISSIONS } from '../../utils/permissions';

const NotificationCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sent');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'normal',
    recipients: 'all_users',
    customRecipients: [] as string[],
    channels: ['email'] as string[],
    scheduleType: 'immediate',
    scheduledDate: '',
    scheduledTime: '',
    expiryDate: ''
  });

  const notifications = [
    {
      id: 'NOT-001',
      title: 'System Maintenance Scheduled',
      message: 'Planned maintenance window on Sunday 2025-01-19 from 2:00 AM to 4:00 AM AEDT. Platform will be temporarily unavailable.',
      type: 'system_update',
      priority: 'high',
      status: 'sent',
      createdAt: '2025-01-15 10:00',
      sentAt: '2025-01-15 10:05',
      sentBy: 'Emily Chen',
      recipients: {
        total: 498,
        delivered: 495,
        opened: 387,
        clicked: 156
      },
      channels: ['email', 'push'],
      expiryDate: '2025-01-20',
      targetAudience: 'all_users'
    },
    {
      id: 'NOT-002',
      title: 'New SCHADS Award Rates Effective',
      message: 'Updated SCHADS Award rates are now in effect. All new timesheets will use the 2025 rate structure.',
      type: 'policy_update',
      priority: 'medium',
      status: 'sent',
      createdAt: '2025-01-10 14:30',
      sentAt: '2025-01-10 15:00',
      sentBy: 'Lisa Anderson',
      recipients: {
        total: 156,
        delivered: 156,
        opened: 142,
        clicked: 89
      },
      channels: ['email'],
      expiryDate: '2025-02-10',
      targetAudience: 'support_workers'
    },
    {
      id: 'NOT-003',
      title: 'Compliance Document Renewal Reminder',
      message: 'Your First Aid certification expires in 30 days. Please upload your renewal to maintain compliance.',
      type: 'compliance_reminder',
      priority: 'urgent',
      status: 'scheduled',
      createdAt: '2025-01-15 16:00',
      scheduledFor: '2025-01-16 09:00',
      sentBy: 'David Martinez',
      recipients: {
        total: 23,
        delivered: 0,
        opened: 0,
        clicked: 0
      },
      channels: ['email', 'sms'],
      expiryDate: '2025-02-15',
      targetAudience: 'specific_workers'
    },
    {
      id: 'NOT-004',
      title: 'New Service Request Available',
      message: 'A new high-priority service request has been submitted and requires immediate assignment.',
      type: 'service_request',
      priority: 'urgent',
      status: 'draft',
      createdAt: '2025-01-15 17:30',
      sentBy: 'James Wilson',
      recipients: {
        total: 5,
        delivered: 0,
        opened: 0,
        clicked: 0
      },
      channels: ['email', 'push'],
      targetAudience: 'shift_coordinators'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'badge-success';
      case 'scheduled':
        return 'badge-warning';
      case 'draft':
        return 'badge-neutral';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system_update':
        return Globe;
      case 'compliance_reminder':
        return AlertTriangle;
      case 'service_request':
        return Calendar;
      case 'policy_update':
        return FileText;
      case 'payment_reminder':
        return DollarSign;
      default:
        return Bell;
    }
  };

  const handleSendNotification = async () => {
    try {
      console.log('Sending notification:', newNotification);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowCreateModal(false);
      setNewNotification({
        title: '',
        message: '',
        type: 'general',
        priority: 'normal',
        recipients: 'all_users',
        customRecipients: [],
        channels: ['email'],
        scheduleType: 'immediate',
        scheduledDate: '',
        scheduledTime: '',
        expiryDate: ''
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const tabs = [
    { id: 'sent', name: 'Sent Notifications', count: notifications.filter(n => n.status === 'sent').length },
    { id: 'scheduled', name: 'Scheduled', count: notifications.filter(n => n.status === 'scheduled').length },
    { id: 'drafts', name: 'Drafts', count: notifications.filter(n => n.status === 'draft').length }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Center</h1>
            <p className="text-gray-600 mt-2">Send and manage platform-wide notifications</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.SEND_NOTIFICATIONS}>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Create Notification
            </button>
          </PermissionGuard>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Send size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Sent</span>
            </div>
            <div className="metric-value text-blue-600">
              {notifications.filter(n => n.status === 'sent').length}
            </div>
            <div className="metric-label">This Month</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Scheduled</span>
            </div>
            <div className="metric-value text-orange-600">
              {notifications.filter(n => n.status === 'scheduled').length}
            </div>
            <div className="metric-label">Pending</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Eye size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Opened</span>
            </div>
            <div className="metric-value text-green-600">
              {Math.round(notifications.reduce((sum, n) => sum + (n.recipients?.opened || 0), 0) / 
                notifications.filter(n => n.status === 'sent').length * 100) || 0}%
            </div>
            <div className="metric-label">Open Rate</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Users size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Reached</span>
            </div>
            <div className="metric-value text-purple-600">
              {notifications.reduce((sum, n) => sum + (n.recipients?.delivered || 0), 0)}
            </div>
            <div className="metric-label">Total Recipients</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="content-card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    className="form-input pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Filter size={20} className="text-gray-400 mr-2" />
                  <select
                    className="form-input"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="system_update">System Updates</option>
                    <option value="compliance_reminder">Compliance</option>
                    <option value="service_request">Service Requests</option>
                    <option value="policy_update">Policy Updates</option>
                    <option value="payment_reminder">Payment Reminders</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredNotifications
                .filter(n => activeTab === 'sent' ? n.status === 'sent' :
                           activeTab === 'scheduled' ? n.status === 'scheduled' :
                           n.status === 'draft')
                .map((notification) => {
                  const TypeIcon = getTypeIcon(notification.type);
                  
                  return (
                    <div key={notification.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TypeIcon size={24} className="text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                                <span className={`badge ${getStatusColor(notification.status)}`}>
                                  {notification.status}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-3">{notification.message}</p>
                            
                            {/* Notification Details */}
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center">
                                <Calendar size={16} className="mr-2 text-blue-500" />
                                Created: {notification.createdAt}
                              </div>
                              {notification.sentAt && (
                                <div className="flex items-center">
                                  <Send size={16} className="mr-2 text-green-500" />
                                  Sent: {notification.sentAt}
                                </div>
                              )}
                              <div className="flex items-center">
                                <User size={16} className="mr-2 text-purple-500" />
                                By: {notification.sentBy}
                              </div>
                              <div className="flex items-center">
                                <Users size={16} className="mr-2 text-orange-500" />
                                {notification.targetAudience.replace('_', ' ')}
                              </div>
                            </div>

                            {/* Channels */}
                            <div className="flex items-center space-x-2 mb-4">
                              <span className="text-sm text-gray-600">Channels:</span>
                              {notification.channels.map((channel, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center">
                                  {channel === 'email' && <Mail size={12} className="mr-1" />}
                                  {channel === 'sms' && <Smartphone size={12} className="mr-1" />}
                                  {channel === 'push' && <Bell size={12} className="mr-1" />}
                                  {channel}
                                </span>
                              ))}
                            </div>

                            {/* Delivery Stats */}
                            {notification.status === 'sent' && notification.recipients && (
                              <div className="bg-green-50 rounded-lg p-4">
                                <h4 className="font-medium text-green-900 mb-3">Delivery Statistics</h4>
                                <div className="grid grid-cols-4 gap-4 text-center">
                                  <div>
                                    <div className="text-lg font-bold text-green-600">{notification.recipients.delivered}</div>
                                    <div className="text-xs text-green-700">Delivered</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-blue-600">{notification.recipients.opened}</div>
                                    <div className="text-xs text-blue-700">Opened</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-purple-600">{notification.recipients.clicked}</div>
                                    <div className="text-xs text-purple-700">Clicked</div>
                                  </div>
                                  <div>
                                    <div className="text-lg font-bold text-orange-600">
                                      {Math.round((notification.recipients.opened / notification.recipients.delivered) * 100)}%
                                    </div>
                                    <div className="text-xs text-orange-700">Open Rate</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Scheduled Info */}
                            {notification.status === 'scheduled' && notification.scheduledFor && (
                              <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center">
                                  <Clock size={20} className="text-orange-600 mr-3" />
                                  <div>
                                    <p className="font-medium text-orange-900">Scheduled for delivery</p>
                                    <p className="text-sm text-orange-800">{notification.scheduledFor}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          ID: {notification.id} • Type: {notification.type.replace('_', ' ')}
                        </div>
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => setSelectedNotification(notification.id)}
                            className="btn-secondary text-sm flex items-center"
                          >
                            <Eye size={16} className="mr-2" />
                            View Details
                          </button>
                          
                          <PermissionGuard permission={PERMISSIONS.SEND_NOTIFICATIONS}>
                            {notification.status === 'draft' && (
                              <button className="btn-primary text-sm flex items-center">
                                <Send size={16} className="mr-2" />
                                Send Now
                              </button>
                            )}
                            
                            {notification.status === 'scheduled' && (
                              <button className="btn-secondary text-sm">
                                Cancel Schedule
                              </button>
                            )}
                            
                            <button className="text-red-600 hover:text-red-700 text-sm flex items-center">
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </button>
                          </PermissionGuard>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Create Notification Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create Notification</h2>
                <p className="text-gray-600">Send a notification to platform users</p>
              </div>
              
              <div className="p-6">
                <form className="space-y-6">
                  <div>
                    <label className="form-label required">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Notification title..."
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="form-label required">Message</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder="Notification message..."
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label required">Type</label>
                      <select
                        className="form-input"
                        value={newNotification.type}
                        onChange={(e) => setNewNotification({...newNotification, type: e.target.value})}
                      >
                        <option value="general">General</option>
                        <option value="system_update">System Update</option>
                        <option value="compliance_reminder">Compliance Reminder</option>
                        <option value="service_request">Service Request</option>
                        <option value="policy_update">Policy Update</option>
                        <option value="payment_reminder">Payment Reminder</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label required">Priority</label>
                      <select
                        className="form-input"
                        value={newNotification.priority}
                        onChange={(e) => setNewNotification({...newNotification, priority: e.target.value})}
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label required">Recipients</label>
                    <select
                      className="form-input"
                      value={newNotification.recipients}
                      onChange={(e) => setNewNotification({...newNotification, recipients: e.target.value})}
                    >
                      <option value="all_users">All Users</option>
                      <option value="participants">NDIS Participants</option>
                      <option value="support_workers">Support Workers</option>
                      <option value="admin_users">Admin Users</option>
                      <option value="shift_coordinators">Shift Coordinators</option>
                      <option value="financial_admins">Financial Admins</option>
                      <option value="compliance_officers">Compliance Officers</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label required">Delivery Channels</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: 'email', label: 'Email', icon: Mail },
                        { id: 'sms', label: 'SMS', icon: Smartphone },
                        { id: 'push', label: 'Push', icon: Bell }
                      ].map((channel) => (
                        <label key={channel.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-3"
                            checked={newNotification.channels.includes(channel.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewNotification({
                                  ...newNotification,
                                  channels: [...newNotification.channels, channel.id]
                                });
                              } else {
                                setNewNotification({
                                  ...newNotification,
                                  channels: newNotification.channels.filter(c => c !== channel.id)
                                });
                              }
                            }}
                          />
                          <channel.icon size={16} className="mr-2" />
                          <span className="text-sm">{channel.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Schedule Delivery</label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="scheduleType"
                          value="immediate"
                          checked={newNotification.scheduleType === 'immediate'}
                          onChange={(e) => setNewNotification({...newNotification, scheduleType: e.target.value})}
                          className="mr-2"
                        />
                        <span className="text-sm">Send immediately</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="scheduleType"
                          value="scheduled"
                          checked={newNotification.scheduleType === 'scheduled'}
                          onChange={(e) => setNewNotification({...newNotification, scheduleType: e.target.value})}
                          className="mr-2"
                        />
                        <span className="text-sm">Schedule for later</span>
                      </label>
                      
                      {newNotification.scheduleType === 'scheduled' && (
                        <div className="grid md:grid-cols-2 gap-4 ml-6">
                          <div>
                            <label className="text-sm text-gray-600">Date</label>
                            <input 
                              type="date" 
                              className="form-input"
                              value={newNotification.scheduledDate}
                              onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Time</label>
                            <input 
                              type="time" 
                              className="form-input"
                              value={newNotification.scheduledTime}
                              onChange={(e) => setNewNotification({...newNotification, scheduledTime: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Expiry Date (Optional)</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newNotification.expiryDate}
                      onChange={(e) => setNewNotification({...newNotification, expiryDate: e.target.value})}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Notification will be automatically removed after this date
                    </p>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setNewNotification({...newNotification, scheduleType: 'draft'});
                    handleSendNotification();
                  }}
                  className="btn-secondary"
                >
                  Save as Draft
                </button>
                <button 
                  onClick={handleSendNotification}
                  disabled={!newNotification.title || !newNotification.message || newNotification.channels.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {newNotification.scheduleType === 'immediate' ? (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Now
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="mr-2" />
                      Schedule
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <Bell size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Notifications Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first notification to communicate with platform users'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationCenter;