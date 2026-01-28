import { useState, useEffect } from 'react';
import { NDISNotification } from '../types/ndis';
import { useAuth } from '../context/AuthContext';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NDISNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Mock notifications for demo - in production, this would fetch from API
  const mockNotifications: NDISNotification[] = [
    {
      id: '1',
      user_id: user?.id || '',
      title: 'New Service Agreement Assigned',
      message: 'You have been assigned a new Service Agreement form to complete. Please review and sign by the due date.',
      type: 'form_assignment',
      priority: 'medium',
      read: false,
      action_required: true,
      action_url: '/forms/service-agreement/sub-001',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      id: '2',
      user_id: user?.id || '',
      title: 'Risk Assessment Due Soon',
      message: 'Your risk assessment is due in 2 days. Please complete it to maintain compliance.',
      type: 'form_reminder',
      priority: 'high',
      read: false,
      action_required: true,
      action_url: '/forms/risk-assessment/sub-002',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    },
    {
      id: '3',
      user_id: user?.id || '',
      title: 'Compliance Alert',
      message: 'Your support plan review is overdue. Please contact your support coordinator.',
      type: 'compliance_alert',
      priority: 'urgent',
      read: true,
      action_required: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      user_id: user?.id || '',
      title: 'System Update',
      message: 'The platform will undergo maintenance this Sunday from 2:00 AM to 4:00 AM AEDT.',
      type: 'system_update',
      priority: 'low',
      read: true,
      action_required: false,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    }
  ];

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter notifications for current user
      const userNotifications = mockNotifications.filter(n => n.user_id === user?.id);
      setNotifications(userNotifications);
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getUrgentCount = () => {
    return notifications.filter(n => n.priority === 'urgent' && !n.read).length;
  };

  const hasActionRequired = () => {
    return notifications.some(n => n.action_required && !n.read);
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getUrgentCount,
    hasActionRequired,
    refreshNotifications: loadNotifications
  };
};

export default useNotifications;