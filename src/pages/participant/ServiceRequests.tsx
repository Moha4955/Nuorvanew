import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  Edit,
  Trash2,
  MessageCircle,
  Phone,
  DollarSign,
  Star,
  Shield,
  X,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { serviceRequestService } from '../../services/serviceRequestService';
import { participantService } from '../../services/participantService';
import toast from 'react-hot-toast';

const ServiceRequests: React.FC = () => {
  const { user } = useAuth();
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [participant, setParticipant] = useState<any>(null);

  const [newRequest, setNewRequest] = useState({
    service_type: '',
    description: '',
    preferred_date: '',
    start_time: '',
    end_time: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    location: '',
    special_requirements: ''
  });

  useEffect(() => {
    loadData();
  }, [user, filterStatus]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load participant data
      const participantData = await participantService.getParticipantByUserId(user.id);
      setParticipant(participantData);

      if (participantData) {
        // Load service requests
        const filters: any = {};
        if (filterStatus !== 'all') {
          filters.status = filterStatus;
        }

        const result = await serviceRequestService.getParticipantRequests(
          participantData.id,
          filters
        );
        setRequests(result.data || []);
      }
    } catch (error) {
      console.error('Error loading service requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participant) {
      toast.error('Participant profile not found');
      return;
    }

    try {
      setSubmitting(true);

      await serviceRequestService.createRequest({
        participant_id: participant.id,
        service_type: newRequest.service_type,
        description: newRequest.description,
        preferred_date: newRequest.preferred_date,
        start_time: newRequest.start_time,
        end_time: newRequest.end_time,
        urgency: newRequest.urgency,
        location: newRequest.location,
        special_requirements: newRequest.special_requirements
      });

      toast.success('Service request submitted successfully');
      setShowNewRequestModal(false);
      resetForm();
      await loadData();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit service request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to cancel this service request?')) return;

    try {
      await serviceRequestService.updateRequest(requestId, { status: 'cancelled' });
      toast.success('Service request cancelled');
      await loadData();
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    }
  };

  const resetForm = () => {
    setNewRequest({
      service_type: '',
      description: '',
      preferred_date: '',
      start_time: '',
      end_time: '',
      urgency: 'medium',
      location: '',
      special_requirements: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
      case 'confirmed':
        return 'badge-success';
      case 'under_review':
        return 'badge-warning';
      case 'submitted':
        return 'badge-info';
      case 'cancelled':
      case 'rejected':
        return 'badge-error';
      case 'completed':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
      case 'confirmed':
      case 'completed':
        return CheckCircle;
      case 'under_review':
      case 'submitted':
        return Clock;
      case 'cancelled':
      case 'rejected':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchQuery === '' ||
      request.service_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const serviceCategories = [
    'Core Supports - Daily Activities',
    'Core Supports - Transport',
    'Core Supports - Personal Care',
    'Capacity Building - Community Participation',
    'Capacity Building - Employment',
    'Capacity Building - Health & Wellbeing',
    'Capital Supports - Assistive Technology',
    'Capital Supports - Home Modifications'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-gray-600 mt-1">Request and manage your NDIS support services</p>
          </div>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            New Request
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{requests.length}</p>
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
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {requests.filter(r => ['assigned', 'confirmed'].includes(r.status)).length}
                  </p>
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
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {requests.filter(r => ['submitted', 'under_review'].includes(r.status)).length}
                  </p>
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
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-600 mt-1">
                    {requests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Shield size={24} className="text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="content-card">
          <div className="content-card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search service requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="assigned">Assigned</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Service Requests List */}
        <div className="space-y-4">
          {loading ? (
            <div className="content-card">
              <div className="content-card-body flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const StatusIcon = getStatusIcon(request.status);
              const requestDate = new Date(request.preferred_date).toLocaleDateString('en-AU', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });

              return (
                <div key={request.id} className="content-card hover:shadow-lg transition-all">
                  <div className="content-card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {request.service_type || 'Support Service'}
                          </h3>
                          <span className={`badge ${getStatusColor(request.status)} flex items-center`}>
                            <StatusIcon size={14} className="mr-1" />
                            {formatStatus(request.status)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency?.toUpperCase()} Priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{request.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            {requestDate}
                          </div>
                          {request.start_time && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock size={16} className="mr-2 text-green-500" />
                              {request.start_time?.substring(0, 5)} - {request.end_time?.substring(0, 5)}
                            </div>
                          )}
                          {request.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin size={16} className="mr-2 text-purple-500" />
                              {request.location}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <User size={16} className="mr-2 text-orange-500" />
                            Request #{request.id.substring(0, 8)}
                          </div>
                        </div>

                        {request.special_requirements && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-900">
                              <strong>Special Requirements:</strong> {request.special_requirements}
                            </p>
                          </div>
                        )}

                        {request.admin_notes && (
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                              <strong>Admin Notes:</strong> {request.admin_notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      {request.status === 'assigned' && (
                        <button className="btn-primary text-sm px-4 py-2 flex items-center">
                          <MessageCircle size={16} className="mr-2" />
                          Contact Worker
                        </button>
                      )}
                      {['submitted', 'under_review'].includes(request.status) && (
                        <button
                          onClick={() => handleCancelRequest(request.id)}
                          className="btn-danger text-sm px-4 py-2 flex items-center"
                        >
                          <X size={16} className="mr-2" />
                          Cancel Request
                        </button>
                      )}
                      <button className="btn-secondary text-sm px-4 py-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="content-card">
              <div className="content-card-body text-center py-12">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Requests</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== 'all'
                    ? 'No requests match your filters'
                    : "You haven't submitted any service requests yet"}
                </p>
                <button
                  onClick={() => setShowNewRequestModal(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Create Your First Request
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">New Service Request</h2>
              <button
                onClick={() => {
                  setShowNewRequestModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newRequest.service_type}
                  onChange={(e) => setNewRequest({ ...newRequest, service_type: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select a service category</option>
                  {serviceCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  rows={4}
                  className="input"
                  placeholder="Describe what support you need..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newRequest.preferred_date}
                    onChange={(e) => setNewRequest({ ...newRequest, preferred_date: e.target.value })}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value as any })}
                    className="input"
                    required
                  >
                    <option value="low">Low - Within 2 weeks</option>
                    <option value="medium">Medium - Within 1 week</option>
                    <option value="high">High - Within 3 days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={newRequest.start_time}
                    onChange={(e) => setNewRequest({ ...newRequest, start_time: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={newRequest.end_time}
                    onChange={(e) => setNewRequest({ ...newRequest, end_time: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newRequest.location}
                  onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                  className="input"
                  placeholder="e.g., Your home, Community center, Shopping mall"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={newRequest.special_requirements}
                  onChange={(e) => setNewRequest({ ...newRequest, special_requirements: e.target.value })}
                  rows={3}
                  className="input"
                  placeholder="Any special requirements or accessibility needs..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-blue-600 mr-3 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <strong>What happens next:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your request will be reviewed by our admin team</li>
                      <li>We'll match you with a qualified support worker</li>
                      <li>You'll be notified once a worker is assigned</li>
                      <li>You can communicate with your worker through the platform</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewRequestModal(false);
                    resetForm();
                  }}
                  className="btn-secondary flex-1"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ServiceRequests;
