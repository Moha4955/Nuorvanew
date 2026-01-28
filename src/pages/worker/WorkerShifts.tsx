import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  AlertTriangle,
  Star,
  Phone,
  MessageCircle,
  Navigation,
  DollarSign,
  Filter,
  Search,
  Eye,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { shiftService } from '../../services/shiftService';
import { workerService } from '../../services/workerService';
import toast from 'react-hot-toast';

const WorkerShifts: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShift, setSelectedShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<any[]>([]);
  const [worker, setWorker] = useState<any>(null);

  useEffect(() => {
    loadShifts();
  }, [user, filterStatus]);

  const loadShifts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const workerData = await workerService.getWorkerByUserId(user.id);

      if (workerData) {
        setWorker(workerData);

        const filters: any = {};
        if (filterStatus !== 'all') {
          filters.status = filterStatus;
        }

        const result = await shiftService.getWorkerShifts(workerData.id, filters);
        setShifts(result.data || []);
      }
    } catch (error) {
      console.error('Error loading shifts:', error);
      toast.error('Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-success';
      case 'assigned':
      case 'pending':
        return 'badge-warning';
      case 'completed':
        return 'badge-info';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return CheckCircle;
      case 'assigned':
      case 'pending':
        return Clock;
      case 'cancelled':
        return AlertTriangle;
      default:
        return Clock;
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString?.substring(0, 5) || '';
  };

  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60) * 10) / 10;
  };

  const calculateEstimatedEarnings = (rate: number, duration: number): number => {
    return rate * duration;
  };

  const handleConfirmShift = async (shiftId: string) => {
    try {
      await shiftService.confirmShift(shiftId);
      toast.success('Shift confirmed successfully');
      await loadShifts();
    } catch (error) {
      console.error('Error confirming shift:', error);
      toast.error('Failed to confirm shift');
    }
  };

  const handleDeclineShift = async (shiftId: string) => {
    try {
      await shiftService.updateShift(shiftId, { status: 'cancelled' });
      toast.success('Shift declined');
      await loadShifts();
    } catch (error) {
      console.error('Error declining shift:', error);
      toast.error('Failed to decline shift');
    }
  };

  const filteredShifts = shifts.filter(shift => {
    const matchesStatus = filterStatus === 'all' || shift.status === filterStatus;
    const matchesSearch =
      shift.service_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.participant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shift.location?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalEarnings = filteredShifts.reduce((sum, shift) => {
    const duration = calculateDuration(shift.start_time, shift.end_time);
    const rate = shift.hourly_rate || worker?.hourly_rate || 42.00;
    return sum + calculateEstimatedEarnings(rate, duration);
  }, 0);

  const confirmedShifts = filteredShifts.filter(s => s.status === 'confirmed').length;
  const pendingShifts = filteredShifts.filter(s => ['assigned', 'pending'].includes(s.status)).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assigned Shifts</h1>
            <p className="text-gray-600 mt-1">Manage your upcoming support sessions</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Shifts</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{filteredShifts.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{confirmedShifts}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingShifts}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Estimated</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(totalEarnings)}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <DollarSign size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="content-card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search shifts by service, participant, or location..."
                    className="input pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  className="input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="assigned">Assigned</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredShifts.length > 0 ? (
            filteredShifts.map((shift) => {
              const StatusIcon = getStatusIcon(shift.status);
              const duration = calculateDuration(shift.start_time, shift.end_time);
              const rate = shift.hourly_rate || worker?.hourly_rate || 42.00;
              const estimatedEarnings = calculateEstimatedEarnings(rate, duration);

              return (
                <div key={shift.id} className="content-card hover:shadow-lg transition-all">
                  <div className="content-card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {shift.service_type || 'Support Service'}
                          </h3>
                          <span className={`badge ${getStatusColor(shift.status)} flex items-center`}>
                            <StatusIcon size={14} className="mr-1" />
                            {shift.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                            {shift.participant_name?.charAt(0) || 'P'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {shift.participant_name || 'Participant Name'}
                            </p>
                            {shift.service_category && (
                              <p className="text-sm text-gray-600">{shift.service_category}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(rate)}/hr
                            </div>
                            <div className="text-sm text-gray-500">{duration}h shift</div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(estimatedEarnings)} total
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            {formatDate(shift.scheduled_date)}
                          </div>
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-green-500" />
                            {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                          </div>
                          {shift.location && (
                            <div className="flex items-center col-span-2">
                              <MapPin size={16} className="mr-2 text-purple-500" />
                              {shift.location}
                            </div>
                          )}
                        </div>

                        {shift.special_requirements && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Special Requirements:
                            </p>
                            <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              {shift.special_requirements}
                            </p>
                          </div>
                        )}

                        {shift.notes && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">
                              <strong>Notes:</strong> {shift.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Shift ID: {shift.id?.substring(0, 8)}
                      </div>
                      <div className="flex items-center gap-3">
                        {['assigned', 'pending'].includes(shift.status) ? (
                          <>
                            <button
                              onClick={() => handleConfirmShift(shift.id)}
                              className="btn-primary text-sm px-4 py-2 flex items-center"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Confirm Shift
                            </button>
                            <button
                              onClick={() => handleDeclineShift(shift.id)}
                              className="btn-secondary text-sm px-4 py-2"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedShift(shift)}
                              className="btn-secondary text-sm px-4 py-2 flex items-center"
                            >
                              <Eye size={16} className="mr-2" />
                              View Details
                            </button>
                            <button className="btn-primary text-sm px-4 py-2 flex items-center">
                              <MessageCircle size={16} className="mr-2" />
                              Message
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="content-card">
              <div className="content-card-body text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Shifts Found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus !== 'all'
                    ? 'No shifts match your filters'
                    : "You don't have any assigned shifts yet"}
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedShift && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedShift.service_type || 'Shift Details'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(selectedShift.scheduled_date)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedShift(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Participant Information</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {selectedShift.participant_name?.charAt(0) || 'P'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-lg mb-2">
                        {selectedShift.participant_name || 'Participant Name'}
                      </h4>
                      {selectedShift.service_category && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Category:</strong> {selectedShift.service_category}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Service Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {formatDate(selectedShift.scheduled_date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {formatTime(selectedShift.start_time)} - {formatTime(selectedShift.end_time)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {calculateDuration(selectedShift.start_time, selectedShift.end_time)} hours
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedShift.hourly_rate || worker?.hourly_rate || 42.00)}/hour
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Total Earnings:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(
                            calculateEstimatedEarnings(
                              selectedShift.hourly_rate || worker?.hourly_rate || 42.00,
                              calculateDuration(selectedShift.start_time, selectedShift.end_time)
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Location Details</h3>
                    <div className="space-y-3 text-sm">
                      {selectedShift.location ? (
                        <>
                          <div>
                            <span className="text-gray-600">Address:</span>
                            <p className="font-medium mt-1">{selectedShift.location}</p>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500">Location details not provided</p>
                      )}
                      <div className="flex items-center gap-2 mt-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusColor(selectedShift.status)}`}>
                          Status: {selectedShift.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedShift.special_requirements && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Special Requirements</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-900">
                        {selectedShift.special_requirements}
                      </p>
                    </div>
                  </div>
                )}

                {selectedShift.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Additional Notes</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">{selectedShift.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={() => setSelectedShift(null)} className="btn-secondary">
                  Close
                </button>
                {['assigned', 'pending'].includes(selectedShift.status) && (
                  <>
                    <button
                      onClick={() => {
                        handleDeclineShift(selectedShift.id);
                        setSelectedShift(null);
                      }}
                      className="btn-secondary"
                    >
                      Decline Shift
                    </button>
                    <button
                      onClick={() => {
                        handleConfirmShift(selectedShift.id);
                        setSelectedShift(null);
                      }}
                      className="btn-primary"
                    >
                      Confirm Shift
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkerShifts;
