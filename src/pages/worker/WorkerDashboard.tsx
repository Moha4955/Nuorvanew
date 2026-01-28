import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  Calendar,
  Shield,
  FileText,
  Clock,
  MapPin,
  User,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  Activity,
  MessageCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { shiftService } from '../../services/shiftService';
import { timesheetService } from '../../services/timesheetService';
import { workerService } from '../../services/workerService';
import toast from 'react-hot-toast';

const WorkerDashboard: React.FC = () => {
  const { user, getDashboardStats } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [worker, setWorker] = useState<any>(null);

  const stats = getDashboardStats();
  const workerStats = stats?.worker;

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const workerData = await workerService.getWorkerByUserId(user.id);
      setWorker(workerData);

      if (workerData) {
        const shiftsResult = await shiftService.getWorkerShifts(workerData.id, {
          status: ['assigned', 'confirmed'],
          upcoming: true,
          limit: 5
        });
        setShifts(shiftsResult.data || []);

        const timesheetsResult = await timesheetService.getWorkerTimesheets(workerData.id, {
          status: 'draft',
          limit: 3
        });
        setTimesheets(timesheetsResult.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'assigned':
        return 'badge-info';
      case 'completed':
        return 'badge-neutral';
      default:
        return 'badge-warning';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100';
      case 'expiring_soon':
        return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.first_name}!
            </h1>
            <p className="text-gray-600 mt-1">Here's your activity summary</p>
          </div>
          <Link to="/worker/shifts" className="btn-primary flex items-center">
            <Calendar size={16} className="mr-2" />
            View All Shifts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Weekly Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {formatCurrency(workerStats?.weeklyEarnings || 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hours This Week</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {workerStats?.hoursWorked || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Shifts</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {shifts.length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={20} className="text-yellow-400 fill-current" />
                    <p className="text-2xl font-bold text-gray-900">
                      {workerStats?.averageRating || 0}
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Award size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {worker && (
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Shield size={32} className="text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Compliance Status</h3>
                    <p className="text-sm text-gray-600">All documents and certifications</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${getComplianceColor(worker.compliance_status?.status || 'compliant')}`}>
                  {worker.compliance_status?.status === 'compliant' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  {worker.compliance_status?.status === 'compliant' ? 'Fully Compliant' : 'Action Required'}
                </span>
              </div>
              {worker.compliance_status?.expiring_documents?.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Notice:</strong> {worker.compliance_status.expiring_documents.length} document(s) expiring soon
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="content-card">
              <div className="content-card-header">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Shifts</h3>
                <p className="text-sm text-gray-600">Your assigned support services</p>
              </div>

              <div className="content-card-body">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : shifts.length > 0 ? (
                  <div className="space-y-4">
                    {shifts.map((shift) => (
                      <div key={shift.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {shift.service_type || 'Support Service'}
                              </h4>
                              <span className={`badge ${getStatusColor(shift.status)}`}>
                                {shift.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Participant: {shift.participant_name || 'TBD'}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            {formatDate(shift.scheduled_date)}
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-green-500" />
                            {shift.start_time?.substring(0, 5)} - {shift.end_time?.substring(0, 5)}
                          </div>
                          {shift.location && (
                            <div className="flex items-center col-span-2">
                              <MapPin size={16} className="mr-2 text-purple-500" />
                              {shift.location}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/worker/shifts/${shift.id}`}
                            className="btn-primary text-sm px-3 py-1.5"
                          >
                            View Details
                          </Link>
                          <Link
                            to="/worker/messages"
                            className="btn-secondary text-sm px-3 py-1.5 flex items-center"
                          >
                            <MessageCircle size={14} className="mr-1" />
                            Message
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Shifts</h3>
                    <p className="text-gray-600">You don't have any assigned shifts at the moment</p>
                  </div>
                )}

                <Link
                  to="/worker/shifts"
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium py-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  View All Shifts
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="content-card">
              <div className="content-card-header">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="content-card-body">
                <div className="space-y-3">
                  <Link
                    to="/worker/timesheets"
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText size={20} className="text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Submit Timesheet</p>
                          <p className="text-xs text-gray-600">{timesheets.length} pending</p>
                        </div>
                      </div>
                      {timesheets.length > 0 && (
                        <span className="badge badge-warning">{timesheets.length}</span>
                      )}
                    </div>
                  </Link>

                  <Link
                    to="/worker/compliance"
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Shield size={20} className="text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">Compliance</p>
                        <p className="text-xs text-gray-600">View documents</p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/worker/messages"
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle size={20} className="text-purple-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Messages</p>
                          <p className="text-xs text-gray-600">View conversations</p>
                        </div>
                      </div>
                      {workerStats?.unreadMessages && workerStats.unreadMessages > 0 && (
                        <span className="badge badge-error">{workerStats.unreadMessages}</span>
                      )}
                    </div>
                  </Link>

                  <Link
                    to="/worker/profile"
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <User size={20} className="text-orange-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">My Profile</p>
                        <p className="text-xs text-gray-600">Update details</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="content-card">
              <div className="content-card-header">
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              </div>
              <div className="content-card-body">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Active Participants</span>
                      <span className="font-semibold text-gray-900">
                        {workerStats?.activeParticipants || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(((workerStats?.activeParticipants || 0) / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Completed Shifts</span>
                      <span className="font-semibold text-gray-900">
                        {workerStats?.upcomingShifts || 0}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${Math.min(((workerStats?.upcomingShifts || 0) / 50) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Client Satisfaction</span>
                      <span className="font-semibold text-gray-900">
                        {workerStats?.averageRating || 0}/5.0
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${((workerStats?.averageRating || 0) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
