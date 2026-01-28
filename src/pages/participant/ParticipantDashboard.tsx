import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  Calendar, 
  MessageCircle, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Plus,
  MapPin,
  User,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Bell,
  Download,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { shiftService } from '../../services/shiftService';
import { invoiceService } from '../../services/invoiceService';
import { participantService } from '../../services/participantService';
import toast from 'react-hot-toast';

const ParticipantDashboard: React.FC = () => {
  const { user, getDashboardStats } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [loading, setLoading] = useState(true);
  const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
  const [recentInvoicesData, setRecentInvoicesData] = useState<any[]>([]);
  const [participantData, setParticipantData] = useState<any>(null);

  console.log('📊 ParticipantDashboard: Component rendering', {
    hasUser: !!user,
    userName: user ? `${user.first_name} ${user.last_name}` : 'No user',
    role: user?.role
  });

  const stats = getDashboardStats();
  const participantStats = stats.participant;

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Load participant data
        const participant = await participantService.getParticipantByUserId(user.id);
        setParticipantData(participant);

        if (participant) {
          // Load upcoming shifts
          const shifts = await shiftService.getParticipantShifts(participant.id, {
            status: ['assigned', 'confirmed'],
            upcoming: true,
            limit: 3
          });
          setUpcomingShifts(shifts.data || []);

          // Load recent invoices
          const invoices = await invoiceService.getParticipantInvoices(participant.id, {
            limit: 3,
            sortBy: 'issue_date',
            sortOrder: 'desc'
          });
          setRecentInvoicesData(invoices.data || []);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  console.log('📊 ParticipantDashboard: Stats loaded', {
    upcomingServices: participantStats?.upcomingServices,
    totalBudget: participantStats?.totalBudget,
    hasStats: !!stats,
    shiftsLoaded: upcomingShifts.length,
    invoicesLoaded: recentInvoicesData.length
  });

  // Safe status formatting function
  const formatStatus = (status: string | undefined): string => {
    if (typeof status === 'string' && status.length > 0) {
      return status.replace(/_/g, ' ');
    }
    return 'pending';
  };

  // Safe currency formatting
  const formatCurrency = (amount: number | undefined): string => {
    const safeAmount = typeof amount === 'number' ? amount : 0;
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(safeAmount);
  };

  // Safe percentage calculation
  const calculatePercentage = (used: number, total: number): number => {
    if (!total || total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  // Use real shifts data if available, otherwise show helpful message
  const displayShifts = upcomingShifts.length > 0 ? upcomingShifts : [];

  // Use real invoices data if available
  const displayInvoices = recentInvoicesData.length > 0 ? recentInvoicesData : [];

  const quickActions = [
    {
      id: 'request-service',
      title: 'Request New Service',
      description: 'Book additional support services',
      icon: Plus,
      color: 'from-blue-500 to-blue-600',
      badge: null,
      link: '/participant/services'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Chat with your support team',
      icon: MessageCircle,
      color: 'from-green-500 to-green-600',
      badge: { count: participantStats?.unreadMessages || 2, variant: 'error' },
      link: '/participant/messages'
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Access your care plans and reports',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      badge: null,
      link: '/participant/documents'
    },
    {
      id: 'invoices',
      title: 'Invoices',
      description: 'View billing and payment history',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      badge: { count: participantStats?.pendingInvoices || 1, variant: 'warning' },
      link: '/participant/invoices'
    }
  ];

  const planSummary = {
    totalBudget: participantStats?.totalBudget || 45000,
    usedBudget: participantStats?.usedBudget || 12500,
    remainingBudget: participantStats?.remainingBudget || 32500,
    planExpiryDate: '2025-10-15',
    planExpiryDays: participantStats?.planExpiryDays || 287,
    categories: [
      { name: 'Core Supports', allocated: 25000, used: 8500, remaining: 16500 },
      { name: 'Capacity Building', allocated: 15000, used: 3200, remaining: 11800 },
      { name: 'Capital Supports', allocated: 5000, used: 800, remaining: 4200 }
    ]
  };

  const getStatusColor = (status: string | undefined) => {
    const safeStatus = typeof status === 'string' ? status : 'pending';
    switch (safeStatus) {
      case 'confirmed':
        return 'badge-success';
      case 'pending':
      case 'pending_confirmation':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    const safeStatus = typeof status === 'string' ? status : 'pending';
    switch (safeStatus) {
      case 'confirmed':
        return CheckCircle;
      case 'pending':
      case 'pending_confirmation':
        return Clock;
      case 'cancelled':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getBudgetUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'from-red-500 to-red-600';
    if (percentage >= 60) return 'from-orange-500 to-orange-600';
    return 'from-green-500 to-green-600';
  };

  const budgetUsagePercentage = calculatePercentage(planSummary.usedBudget, planSummary.totalBudget);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)'
        }}>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.first_name || 'Participant'}! 👋
                </h1>
                <p className="text-blue-100 text-lg">
                  Manage your NDIS support services and stay connected with your care team.
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200 mb-1">Plan expires in</div>
                <div className="text-2xl font-bold">{planSummary.planExpiryDays} days</div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{participantStats?.upcomingServices || 3}</div>
                <div className="text-sm text-blue-200">Upcoming Services</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{participantStats?.activeWorkers || 2}</div>
                <div className="text-sm text-blue-200">Active Workers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{formatCurrency(planSummary.remainingBudget)}</div>
                <div className="text-sm text-blue-200">Budget Remaining</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{participantStats?.unreadMessages || 2}</div>
                <div className="text-sm text-blue-200">New Messages</div>
              </div>
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              to={action.link}
              className={`action-card group relative overflow-hidden block bg-gradient-to-br ${action.color}`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <action.icon size={32} className="text-white" />
                  {action.badge && action.badge.count > 0 && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                      {action.badge.count}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{action.title}</h3>
                <p className="text-sm opacity-90 text-white">{action.description}</p>
              </div>
              <ChevronRight size={20} className="absolute bottom-4 right-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Services */}
          <div className="lg:col-span-2">
            <div className="content-card">
              <div className="content-card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="content-card-title">Upcoming Services</h2>
                    <p className="content-card-subtitle">Your scheduled support sessions</p>
                  </div>
                  <Calendar size={24} className="text-gray-400" />
                </div>
              </div>
              
              <div className="content-card-body">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : displayShifts.length > 0 ? (
                  <div className="space-y-6">
                    {displayShifts.map((shift) => {
                      const StatusIcon = getStatusIcon(shift.status);
                      const shiftDate = new Date(shift.scheduled_date).toLocaleDateString('en-AU', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                      const startTime = shift.start_time?.substring(0, 5) || 'TBD';
                      const endTime = shift.end_time?.substring(0, 5) || 'TBD';

                      return (
                        <div key={shift.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {shift.service_type || 'Support Service'}
                                </h3>
                                <span className={`badge ${getStatusColor(shift.status)} flex items-center`}>
                                  <StatusIcon size={14} className="mr-1" />
                                  {formatStatus(shift.status)}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <Calendar size={16} className="mr-2 text-blue-500" />
                                  {shiftDate}
                                </div>
                                <div className="flex items-center">
                                  <Clock size={16} className="mr-2 text-green-500" />
                                  {startTime} - {endTime}
                                </div>
                                <div className="flex items-center">
                                  <MapPin size={16} className="mr-2 text-purple-500" />
                                  {shift.location || 'TBD'}
                                </div>
                                {shift.estimated_hours && (
                                  <div className="flex items-center">
                                    <Clock size={16} className="mr-2 text-orange-500" />
                                    {shift.estimated_hours} hours
                                  </div>
                                )}
                              </div>

                              {shift.notes && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                  <p className="text-sm text-gray-700">{shift.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Link to="/participant/messages" className="btn-primary text-sm px-4 py-2 flex items-center">
                              <MessageCircle size={16} className="mr-2" />
                              Message Worker
                            </Link>
                            <Link to="/participant/services" className="btn-secondary text-sm px-4 py-2">
                              View Details
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Services</h3>
                    <p className="text-gray-600 mb-6">You don't have any scheduled services yet.</p>
                    <Link to="/participant/services" className="btn-primary inline-flex items-center">
                      <Plus size={16} className="mr-2" />
                      Request a Service
                    </Link>
                  </div>
                )}
                
                <Link to="/participant/services" className="w-full mt-6 text-blue-600 hover:text-blue-700 font-medium py-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                  View All Services
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Summary */}
            <div className="content-card">
              <div className="content-card-header">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">NDIS Plan Summary</h3>
                <p className="text-sm text-gray-600">Budget utilization and remaining funds</p>
              </div>
              
              <div className="content-card-body">
                <div className="space-y-6">
                  {/* Overall Budget */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Total Budget Usage</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(planSummary.usedBudget)} / {formatCurrency(planSummary.totalBudget)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${getBudgetUsageColor(budgetUsagePercentage)}`}
                        style={{ width: `${budgetUsagePercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{budgetUsagePercentage}% used</span>
                      <span>{formatCurrency(planSummary.remainingBudget)} remaining</span>
                    </div>
                  </div>
                  
                  {/* Category Breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Budget Categories</h4>
                    {planSummary.categories.map((category, index) => {
                      const categoryPercentage = calculatePercentage(category.used, category.allocated);
                      return (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{category.name}</span>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(category.remaining)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                              style={{ width: `${categoryPercentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{categoryPercentage}% used</span>
                            <span>{formatCurrency(category.allocated)} total</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Shield size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">Plan Status</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your plan expires on {planSummary.planExpiryDate}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {planSummary.planExpiryDays} days remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="content-card">
              <div className="content-card-header">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Invoices</h3>
                <p className="text-sm text-gray-600">Latest billing and payments</p>
              </div>
              
              <div className="content-card-body">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : displayInvoices.length > 0 ? (
                  <div className="space-y-4">
                    {displayInvoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">Invoice #{invoice.invoice_number}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(invoice.issue_date).toLocaleDateString('en-AU')}
                          </p>
                          {invoice.service_type && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {invoice.service_type}
                            </span>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {formatStatus(invoice.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-600">No recent invoices</p>
                  </div>
                )}
                
                <Link to="/participant/invoices" className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium py-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center">
                  <Download size={16} className="mr-2" />
                  View All Invoices
                </Link>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="content-card">
              <div className="content-card-header">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Emergency Contact</h3>
                <p className="text-sm text-gray-600">24/7 support available</p>
              </div>
              
              <div className="content-card-body">
                <div className="space-y-3">
                  <a href="tel:1800687682" className="w-full btn-danger flex items-center justify-center">
                    <Phone size={16} className="mr-2" />
                    Emergency: 1800 NUROVA
                  </a>
                  <a href="mailto:support@nurova.com.au" className="w-full btn-secondary flex items-center justify-center">
                    <Mail size={16} className="mr-2" />
                    support@nurova.com.au
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParticipantDashboard;