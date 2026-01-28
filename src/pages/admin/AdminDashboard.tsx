import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  Users, 
  Calendar, 
  Shield, 
  DollarSign, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  Phone,
  Mail,
  Star,
  Filter,
  Download,
  RefreshCw,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user, getDashboardStats } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedFilter, setSelectedFilter] = useState('all');

  console.log('👨‍💼 AdminDashboard: Component rendering', {
    hasUser: !!user,
    userName: user ? `${user.first_name} ${user.last_name}` : 'No user',
    role: user?.role
  });

  // Safe stats retrieval with fallbacks
  const stats = getDashboardStats() || {
    admin: {
      totalParticipants: 342,
      activeWorkers: 156,
      pendingApplications: 23,
      monthlyRevenue: 145820,
      servicesCompleted: 1247,
      complianceIssues: 8,
      systemAlerts: 4,
      averageResponseTime: 2.3
    }
  };
  const adminStats = stats.admin;

  const platformMetrics = {
    totalParticipants: adminStats?.totalParticipants || 342,
    activeWorkers: adminStats?.activeWorkers || 156,
    pendingApplications: adminStats?.pendingApplications || 23,
    monthlyRevenue: adminStats?.monthlyRevenue || 145820,
    servicesCompleted: adminStats?.servicesCompleted || 1247,
    complianceIssues: adminStats?.complianceIssues || 8,
    systemAlerts: adminStats?.systemAlerts || 4,
    averageResponseTime: adminStats?.averageResponseTime || 2.3,
    growth: {
      participants: 12.5,
      workers: 8.3,
      revenue: 15.2,
      services: 22.1
    },
    satisfaction: {
      participants: 4.6,
      workers: 4.4,
      overall: 4.5
    }
  };

  const recentApplications = [
    {
      id: '1',
      name: 'Jessica Williams',
      type: 'support_worker',
      appliedDate: '2025-01-15',
      status: 'pending_review',
      completedDocuments: 4,
      totalDocuments: 5,
      location: 'Melbourne, VIC',
      experience: '3 years',
      specializations: ['Daily Living', 'Community Access'],
      priority: 'high'
    },
    {
      id: '2',
      name: 'David Thompson',
      type: 'support_worker',
      appliedDate: '2025-01-14',
      status: 'documents_missing',
      completedDocuments: 2,
      totalDocuments: 5,
      location: 'Sydney, NSW',
      experience: '5 years',
      specializations: ['Personal Care', 'Transport'],
      priority: 'medium'
    },
    {
      id: '3',
      name: 'Emma Chen',
      type: 'participant',
      appliedDate: '2025-01-13',
      status: 'approved',
      completedDocuments: 3,
      totalDocuments: 3,
      location: 'Brisbane, QLD',
      ndisNumber: 'NDIS-****-7892',
      supportNeeds: ['Core Supports', 'Capacity Building'],
      priority: 'low'
    },
    {
      id: '4',
      name: 'Michael Rodriguez',
      type: 'support_worker',
      appliedDate: '2025-01-12',
      status: 'interview_scheduled',
      completedDocuments: 5,
      totalDocuments: 5,
      location: 'Perth, WA',
      experience: '7 years',
      specializations: ['Behavior Support', 'Allied Health'],
      priority: 'high'
    }
  ];

  const complianceAlerts = [
    {
      id: '1',
      worker: 'Michael Johnson',
      workerId: 'W-001',
      issue: 'First Aid Certification expires in 7 days',
      severity: 'warning',
      dueDate: '2025-01-23',
      category: 'certification',
      lastContacted: '2025-01-10',
      responseStatus: 'pending'
    },
    {
      id: '2',
      worker: 'Sarah Davis',
      workerId: 'W-045',
      issue: 'WWCC expired',
      severity: 'critical',
      dueDate: '2025-01-10',
      category: 'background_check',
      lastContacted: '2025-01-08',
      responseStatus: 'no_response'
    },
    {
      id: '3',
      worker: 'Robert Wilson',
      workerId: 'W-023',
      issue: 'Professional Indemnity renewal needed',
      severity: 'info',
      dueDate: '2025-02-15',
      category: 'insurance',
      lastContacted: '2025-01-05',
      responseStatus: 'acknowledged'
    },
    {
      id: '4',
      worker: 'Lisa Anderson',
      workerId: 'W-067',
      issue: 'NDIS Worker Orientation incomplete',
      severity: 'warning',
      dueDate: '2025-01-20',
      category: 'training',
      lastContacted: '2025-01-12',
      responseStatus: 'in_progress'
    }
  ];

  const systemAlerts = [
    {
      id: '1',
      type: 'performance',
      title: 'High Response Time Detected',
      message: 'Average API response time increased to 3.2s',
      severity: 'warning',
      timestamp: '2025-01-15 14:30',
      resolved: false
    },
    {
      id: '2',
      type: 'security',
      title: 'Multiple Failed Login Attempts',
      message: '15 failed login attempts from IP 192.168.1.100',
      severity: 'critical',
      timestamp: '2025-01-15 13:45',
      resolved: false
    },
    {
      id: '3',
      type: 'integration',
      title: 'NDIS API Connection Issue',
      message: 'Intermittent connection issues with NDIS verification service',
      severity: 'warning',
      timestamp: '2025-01-15 12:15',
      resolved: true
    },
    {
      id: '4',
      type: 'capacity',
      title: 'Storage Usage Alert',
      message: 'Document storage at 85% capacity',
      severity: 'info',
      timestamp: '2025-01-15 10:00',
      resolved: false
    }
  ];

  const recentServices = [
    {
      id: 'S-001',
      participant: 'Sarah Johnson',
      worker: 'Michael Thompson',
      service: 'Daily Living Support',
      date: '2025-01-15',
      duration: 4,
      status: 'completed',
      rating: 5,
      amount: 180.00
    },
    {
      id: 'S-002',
      participant: 'Robert Smith',
      worker: 'Emma Wilson',
      service: 'Community Access',
      date: '2025-01-15',
      duration: 3,
      status: 'in_progress',
      rating: null,
      amount: 135.00
    },
    {
      id: 'S-003',
      participant: 'Maria Garcia',
      worker: 'David Chen',
      service: 'Transport Support',
      date: '2025-01-14',
      duration: 2,
      status: 'completed',
      rating: 4,
      amount: 90.00
    }
  ];

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'pending_review':
        return 'badge-warning';
      case 'documents_missing':
        return 'badge-error';
      case 'interview_scheduled':
        return 'badge-pending';
      default:
        return 'badge-neutral';
    }
  };

  const getComplianceAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getComplianceAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={16} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-orange-600" />;
      case 'info':
        return <Clock size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getSystemAlertIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Activity size={16} className="text-orange-600" />;
      case 'security':
        return <Shield size={16} className="text-red-600" />;
      case 'integration':
        return <RefreshCw size={16} className="text-blue-600" />;
      case 'capacity':
        return <BarChart3 size={16} className="text-purple-600" />;
      default:
        return <Bell size={16} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)'
        }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">Platform Overview</h1>
                <p className="text-indigo-100 text-lg">
                  Monitor operations, manage applications, and ensure compliance across the Nurova platform.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 hover:bg-white/20 transition-colors">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users size={20} />
                  <div className="flex items-center text-sm">
                    <TrendingUp size={14} className="mr-1" />
                    {formatPercentage(platformMetrics.growth.participants)}
                  </div>
                </div>
                <div className="text-2xl font-bold">{platformMetrics.totalParticipants}</div>
                <div className="text-sm text-indigo-200">Total Participants</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users size={20} />
                  <div className="flex items-center text-sm">
                    <TrendingUp size={14} className="mr-1" />
                    {formatPercentage(platformMetrics.growth.workers)}
                  </div>
                </div>
                <div className="text-2xl font-bold">{platformMetrics.activeWorkers}</div>
                <div className="text-sm text-indigo-200">Active Workers</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign size={20} />
                  <div className="flex items-center text-sm">
                    <TrendingUp size={14} className="mr-1" />
                    {formatPercentage(platformMetrics.growth.revenue)}
                  </div>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(platformMetrics.monthlyRevenue)}</div>
                <div className="text-sm text-indigo-200">Monthly Revenue</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle size={20} />
                  <div className="flex items-center text-sm">
                    <TrendingUp size={14} className="mr-1" />
                    {formatPercentage(platformMetrics.growth.services)}
                  </div>
                </div>
                <div className="text-2xl font-bold">{platformMetrics.servicesCompleted}</div>
                <div className="text-sm text-indigo-200">Services Completed</div>
              </div>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <FileText size={24} className="text-orange-600" />
              <span className="badge badge-warning">{platformMetrics.pendingApplications}</span>
            </div>
            <div className="metric-value text-orange-600">{platformMetrics.pendingApplications}</div>
            <div className="metric-label">Pending Applications</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Shield size={24} className="text-red-600" />
              <span className="badge badge-error">{platformMetrics.complianceIssues}</span>
            </div>
            <div className="metric-value text-red-600">{platformMetrics.complianceIssues}</div>
            <div className="metric-label">Compliance Issues</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Bell size={24} className="text-purple-600" />
              <span className="badge badge-pending">{platformMetrics.systemAlerts}</span>
            </div>
            <div className="metric-value text-purple-600">{platformMetrics.systemAlerts}</div>
            <div className="metric-label">System Alerts</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Activity size={24} className="text-blue-600" />
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span className="text-sm font-medium">{platformMetrics.satisfaction.overall}</span>
              </div>
            </div>
            <div className="metric-value text-blue-600">{platformMetrics.averageResponseTime}s</div>
            <div className="metric-label">Avg Response Time</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="content-card">
              <div className="content-card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="content-card-title">Recent Applications</h2>
                    <p className="content-card-subtitle">New registrations requiring review</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Filter size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Search size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="content-card-body">
                <div className="space-y-6">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-indigo-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{application.name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(application.priority)}`}>
                                {application.priority} priority
                              </span>
                              <span className={`badge ${getApplicationStatusColor(application.status)}`}>
                                {application.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Users size={16} className="mr-2 text-blue-500" />
                              {application.type === 'support_worker' ? 'Support Worker' : 'Participant'}
                            </div>
                            <div className="flex items-center">
                              <Calendar size={16} className="mr-2 text-green-500" />
                              Applied {application.appliedDate}
                            </div>
                            <div className="flex items-center">
                              <MapPin size={16} className="mr-2 text-purple-500" />
                              {application.location}
                            </div>
                            {application.type === 'support_worker' && (
                              <div className="flex items-center">
                                <Clock size={16} className="mr-2 text-orange-500" />
                                {application.experience} experience
                              </div>
                            )}
                          </div>
                          
                          {/* Document Progress */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Document Completion</span>
                              <span className="text-sm text-gray-600">
                                {application.completedDocuments}/{application.totalDocuments}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                style={{ width: `${(application.completedDocuments / application.totalDocuments) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          {/* Specializations/Needs */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {application.type === 'support_worker' ? 'Specializations:' : 'Support Needs:'}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(application.type === 'support_worker' ? application.specializations : application.supportNeeds)?.map((item, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="btn-primary text-sm px-4 py-2">
                          Review Application
                        </button>
                        <button className="btn-secondary text-sm px-4 py-2 flex items-center">
                          <Phone size={16} className="mr-2" />
                          Contact
                        </button>
                        <button className="btn-secondary text-sm px-4 py-2">
                          View Profile
                        </button>
                        {application.status === 'documents_missing' && (
                          <button className="btn-secondary text-sm px-4 py-2 flex items-center">
                            <Mail size={16} className="mr-2" />
                            Send Reminder
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 text-indigo-600 hover:text-indigo-700 font-medium py-3 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  View All Applications ({platformMetrics.pendingApplications} pending)
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Alerts */}
            <div className="content-card">
              <div className="content-card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
                    <p className="text-sm text-gray-600">Worker compliance issues</p>
                  </div>
                  <Shield size={24} className="text-gray-400" />
                </div>
              </div>
              
              <div className="content-card-body">
                <div className="space-y-3">
                  {complianceAlerts.slice(0, 4).map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border ${getComplianceAlertColor(alert.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start">
                          <div className="mr-3 mt-0.5">
                            {getComplianceAlertIcon(alert.severity)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{alert.worker}</p>
                            <p className="text-sm text-gray-600 mt-1">{alert.issue}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Due: {alert.dueDate}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          alert.responseStatus === 'no_response' ? 'bg-red-100 text-red-700' :
                          alert.responseStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          alert.responseStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {alert.responseStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 btn-secondary text-sm">
                  View All Alerts ({platformMetrics.complianceIssues})
                </button>
              </div>
            </div>

            {/* System Alerts */}
            <div className="content-card">
              <div className="content-card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                    <p className="text-sm text-gray-600">Platform health monitoring</p>
                  </div>
                  <Bell size={24} className="text-gray-400" />
                </div>
              </div>
              
              <div className="content-card-body">
                <div className="space-y-3">
                  {systemAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border ${
                        alert.resolved ? 'border-green-200 bg-green-50' : 
                        alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                        alert.severity === 'warning' ? 'border-orange-200 bg-orange-50' :
                        'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {getSystemAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
                            {alert.resolved && (
                              <CheckCircle size={14} className="text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                          <p className="text-xs text-gray-500">{alert.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 btn-secondary text-sm">
                  System Dashboard
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="content-card">
              <div className="content-card-header">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
              </div>
              
              <div className="content-card-body">
                <div className="space-y-3">
                  <button className="w-full btn-secondary text-sm text-left flex items-center justify-between group">
                    <div className="flex items-center">
                      <Users size={16} className="mr-3" />
                      Manage Workers
                    </div>
                    <span className="badge badge-info">{platformMetrics.activeWorkers}</span>
                  </button>
                  
                  <button className="w-full btn-secondary text-sm text-left flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-3" />
                      Review Services
                    </div>
                    <span className="badge badge-success">{platformMetrics.servicesCompleted}</span>
                  </button>
                  
                  <button className="w-full btn-secondary text-sm text-left flex items-center">
                    <BarChart3 size={16} className="mr-3" />
                    Generate Reports
                  </button>
                  
                  <button className="w-full btn-secondary text-sm text-left flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield size={16} className="mr-3" />
                      Compliance Review
                    </div>
                    <span className="badge badge-error">{platformMetrics.complianceIssues}</span>
                  </button>
                  
                  <button className="w-full btn-secondary text-sm text-left flex items-center">
                    <Download size={16} className="mr-3" />
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;