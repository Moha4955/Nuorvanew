import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  Clock, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Edit,
  Eye,
  Send,
  Download,
  Filter,
  Search,
  User,
  MapPin
} from 'lucide-react';

const WorkerTimesheets: React.FC = () => {
  const [showNewTimesheetModal, setShowNewTimesheetModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const timesheets = [
    {
      id: 'TS-001',
      participant: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      service: 'Daily Living Support',
      date: '2025-01-15',
      startTime: '10:00 AM',
      endTime: '2:00 PM',
      totalHours: 4.0,
      breakTime: 0.5,
      billableHours: 3.5,
      location: 'Participant Home',
      address: '123 Collins Street, Melbourne VIC 3000',
      status: 'approved',
      submittedAt: '2025-01-15 14:30',
      approvedAt: '2025-01-16 09:15',
      approvedBy: 'Admin Team',
      schadsDetails: {
        classification: 'Social and Community Services Level 3',
        baseRate: 45.50,
        penalties: [],
        allowances: [],
        totalPay: 159.25
      },
      serviceNotes: 'Completed meal preparation, light housekeeping, and medication reminders. Participant was cooperative and engaged.',
      travelTime: 30,
      travelAllowance: 15.50
    },
    {
      id: 'TS-002',
      participant: {
        name: 'Robert Smith',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      service: 'Community Access',
      date: '2025-01-14',
      startTime: '9:00 AM',
      endTime: '12:00 PM',
      totalHours: 3.0,
      breakTime: 0,
      billableHours: 3.0,
      location: 'Community Centre',
      address: 'Westfield Shopping Centre, Doncaster',
      status: 'pending',
      submittedAt: '2025-01-14 12:30',
      schadsDetails: {
        classification: 'Social and Community Services Level 2',
        baseRate: 42.00,
        penalties: [],
        allowances: [
          { type: 'travel', amount: 12.50, description: 'Travel allowance for community access' }
        ],
        totalPay: 138.50
      },
      serviceNotes: 'Assisted with grocery shopping and social skills development. Participant showed good progress with independence.',
      travelTime: 45,
      travelAllowance: 12.50
    },
    {
      id: 'TS-003',
      participant: {
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      service: 'Personal Care',
      date: '2025-01-13',
      startTime: '8:00 AM',
      endTime: '10:00 AM',
      totalHours: 2.0,
      breakTime: 0,
      billableHours: 2.0,
      location: 'Participant Home',
      address: '456 High Street, Preston VIC 3072',
      status: 'submitted',
      submittedAt: '2025-01-13 10:30',
      schadsDetails: {
        classification: 'Social and Community Services Level 4',
        baseRate: 48.75,
        penalties: [
          { type: 'early_morning', multiplier: 1.25, applicableHours: 2.0, amount: 24.38 }
        ],
        allowances: [],
        totalPay: 121.88
      },
      serviceNotes: 'Provided personal care assistance and mobility support. Used wheelchair transfer techniques safely.',
      travelTime: 35,
      travelAllowance: 18.75
    },
    {
      id: 'TS-004',
      participant: {
        name: 'David Wilson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      service: 'Capacity Building Support',
      date: '2025-01-12',
      startTime: '1:00 PM',
      endTime: '4:00 PM',
      totalHours: 3.0,
      breakTime: 0,
      billableHours: 3.0,
      location: 'Community Centre',
      address: 'Box Hill Community Centre',
      status: 'rejected',
      submittedAt: '2025-01-12 16:30',
      rejectedAt: '2025-01-13 10:00',
      rejectedBy: 'Admin Team',
      rejectionReason: 'Service notes insufficient - please provide more detail about activities completed',
      schadsDetails: {
        classification: 'Social and Community Services Level 2',
        baseRate: 44.25,
        penalties: [],
        allowances: [],
        totalPay: 132.75
      },
      serviceNotes: 'Worked on life skills.',
      travelTime: 40,
      travelAllowance: 16.25
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'submitted':
        return 'badge-pending';
      case 'rejected':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'pending':
      case 'submitted':
        return Clock;
      case 'rejected':
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

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesStatus = filterStatus === 'all' || timesheet.status === filterStatus;
    const matchesSearch = timesheet.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timesheet.participant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalEarnings = filteredTimesheets.reduce((sum, ts) => sum + ts.schadsDetails.totalPay, 0);
  const approvedTimesheets = filteredTimesheets.filter(ts => ts.status === 'approved').length;
  const pendingTimesheets = filteredTimesheets.filter(ts => ts.status === 'pending' || ts.status === 'submitted').length;
  const totalHours = filteredTimesheets.reduce((sum, ts) => sum + ts.billableHours, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Timesheets</h1>
            <p className="text-gray-600 mt-2">Submit and manage your service timesheets</p>
          </div>
          <button 
            onClick={() => setShowNewTimesheetModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Timesheet
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Earnings</span>
            </div>
            <div className="metric-value text-green-600">{formatCurrency(totalEarnings)}</div>
            <div className="metric-label">Total Earnings</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Hours</span>
            </div>
            <div className="metric-value text-blue-600">{totalHours}</div>
            <div className="metric-label">Billable Hours</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Approved</span>
            </div>
            <div className="metric-value text-purple-600">{approvedTimesheets}</div>
            <div className="metric-label">Timesheets</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <div className="metric-value text-orange-600">{pendingTimesheets}</div>
            <div className="metric-label">Review</div>
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
                    placeholder="Search timesheets..."
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
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <button className="btn-secondary text-sm flex items-center">
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timesheets List */}
        <div className="space-y-6">
          {filteredTimesheets.map((timesheet) => {
            const StatusIcon = getStatusIcon(timesheet.status);
            return (
              <div key={timesheet.id} className="content-card hover-lift">
                <div className="content-card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{timesheet.service}</h3>
                        <span className={`badge ${getStatusColor(timesheet.status)} flex items-center`}>
                          <StatusIcon size={14} className="mr-1" />
                          {timesheet.status}
                        </span>
                      </div>
                      
                      {/* Participant Info */}
                      <div className="flex items-center mb-4">
                        <img 
                          src={timesheet.participant.avatar} 
                          alt={timesheet.participant.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{timesheet.participant.name}</p>
                          <p className="text-sm text-gray-600">{timesheet.date}</p>
                        </div>
                      </div>
                      
                      {/* Time Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-blue-500" />
                          {timesheet.startTime} - {timesheet.endTime}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-green-500" />
                          {timesheet.billableHours}h billable
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-purple-500" />
                          {timesheet.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-orange-500" />
                          {formatCurrency(timesheet.schadsDetails.totalPay)}
                        </div>
                      </div>
                      
                      {/* SCHADS Details */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-3">SCHADS Award Calculation</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-800 mb-1">
                              <strong>Classification:</strong> {timesheet.schadsDetails.classification}
                            </p>
                            <p className="text-blue-800 mb-1">
                              <strong>Base Rate:</strong> {formatCurrency(timesheet.schadsDetails.baseRate)}/hour
                            </p>
                            <p className="text-blue-800">
                              <strong>Billable Hours:</strong> {timesheet.billableHours}h
                            </p>
                          </div>
                          <div>
                            {timesheet.schadsDetails.penalties.length > 0 && (
                              <div className="mb-2">
                                <p className="text-blue-800 font-medium">Penalties Applied:</p>
                                {timesheet.schadsDetails.penalties.map((penalty, index) => (
                                  <p key={index} className="text-blue-700 text-xs">
                                    {penalty.type}: +{formatCurrency(penalty.amount)}
                                  </p>
                                ))}
                              </div>
                            )}
                            {timesheet.schadsDetails.allowances.length > 0 && (
                              <div>
                                <p className="text-blue-800 font-medium">Allowances:</p>
                                {timesheet.schadsDetails.allowances.map((allowance, index) => (
                                  <p key={index} className="text-blue-700 text-xs">
                                    {allowance.type}: +{formatCurrency(allowance.amount)}
                                  </p>
                                ))}
                              </div>
                            )}
                            <div className="mt-2 pt-2 border-t border-blue-200">
                              <p className="text-blue-900 font-bold">
                                Total Pay: {formatCurrency(timesheet.schadsDetails.totalPay)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Service Notes */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Service Notes</h4>
                        <p className="text-sm text-gray-700">{timesheet.serviceNotes}</p>
                      </div>
                      
                      {/* Rejection Reason */}
                      {timesheet.status === 'rejected' && timesheet.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start">
                            <AlertTriangle size={20} className="text-red-600 mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Timesheet Rejected</p>
                              <p className="text-sm text-red-800 mt-1">{timesheet.rejectionReason}</p>
                              <p className="text-xs text-red-700 mt-2">
                                Rejected by {timesheet.rejectedBy} on {timesheet.rejectedAt}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Approval Info */}
                      {timesheet.status === 'approved' && (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm text-green-800">
                            <strong>Approved:</strong> {timesheet.approvedAt} by {timesheet.approvedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Submitted: {timesheet.submittedAt} • ID: {timesheet.id}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="btn-secondary text-sm flex items-center">
                        <Eye size={16} className="mr-2" />
                        View Details
                      </button>
                      {timesheet.status === 'rejected' && (
                        <button className="btn-primary text-sm flex items-center">
                          <Edit size={16} className="mr-2" />
                          Resubmit
                        </button>
                      )}
                      {timesheet.status === 'approved' && (
                        <button className="btn-secondary text-sm flex items-center">
                          <Download size={16} className="mr-2" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTimesheets.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <Clock size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Timesheets Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Submit your first timesheet after completing a service'
                }
              </p>
              <button 
                onClick={() => setShowNewTimesheetModal(true)}
                className="btn-primary"
              >
                <Plus size={20} className="mr-2" />
                Create Timesheet
              </button>
            </div>
          </div>
        )}

        {/* New Timesheet Modal */}
        {showNewTimesheetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Submit Timesheet</h2>
                <p className="text-gray-600">Record your completed service hours</p>
              </div>
              
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label required">Participant</label>
                      <select className="form-input">
                        <option value="">Select participant</option>
                        <option value="sarah">Sarah Johnson</option>
                        <option value="robert">Robert Smith</option>
                        <option value="maria">Maria Garcia</option>
                        <option value="david">David Wilson</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label required">Service Type</label>
                      <select className="form-input">
                        <option value="">Select service</option>
                        <option value="daily_living">Daily Living Support</option>
                        <option value="community_access">Community Access</option>
                        <option value="personal_care">Personal Care</option>
                        <option value="capacity_building">Capacity Building</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="form-label required">Service Date</label>
                      <input type="date" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label required">Start Time</label>
                      <input type="time" className="form-input" />
                    </div>
                    <div>
                      <label className="form-label required">End Time</label>
                      <input type="time" className="form-input" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Break Time (minutes)</label>
                      <input type="number" className="form-input" placeholder="30" min="0" />
                    </div>
                    <div>
                      <label className="form-label">Travel Time (minutes)</label>
                      <input type="number" className="form-input" placeholder="15" min="0" />
                    </div>
                  </div>

                  <div>
                    <label className="form-label required">Service Location</label>
                    <select className="form-input">
                      <option value="">Select location</option>
                      <option value="participant_home">Participant's Home</option>
                      <option value="community">Community Location</option>
                      <option value="provider_location">Provider Location</option>
                      <option value="virtual">Virtual/Online</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label required">Service Notes</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder="Describe the services provided, participant engagement, any issues or achievements..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Detailed notes are required for timesheet approval and NDIS compliance
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">SCHADS Award Information</h4>
                    <p className="text-sm text-blue-800 mb-3">
                      Pay rates are automatically calculated based on SCHADS Award classifications, 
                      time of day, and applicable penalties/allowances.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-blue-800"><strong>Standard Rate:</strong> $45.50/hour</p>
                        <p className="text-blue-800"><strong>Evening (6PM-10PM):</strong> +25%</p>
                        <p className="text-blue-800"><strong>Night (10PM-6AM):</strong> +50%</p>
                      </div>
                      <div>
                        <p className="text-blue-800"><strong>Weekend:</strong> +25%</p>
                        <p className="text-blue-800"><strong>Public Holiday:</strong> +100%</p>
                        <p className="text-blue-800"><strong>Travel Allowance:</strong> $0.85/km</p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowNewTimesheetModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  <Send size={16} className="mr-2" />
                  Submit Timesheet
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkerTimesheets;