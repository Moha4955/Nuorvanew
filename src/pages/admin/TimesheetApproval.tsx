import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PermissionGuard from '../../components/PermissionGuard';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  DollarSign,
  Calendar,
  MapPin,
  User,
  FileText,
  Send,
  MessageCircle,
  Filter,
  Search,
  Download,
  X,
  Star
} from 'lucide-react';
import { PERMISSIONS } from '../../utils/permissions';

const TimesheetApproval: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('submitted');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimesheet, setSelectedTimesheet] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const timesheets = [
    {
      id: 'TS-001',
      shiftId: 'SH-001',
      worker: {
        id: 'W-001',
        name: 'Michael Thompson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        schadsLevel: 3,
        abn: '12 345 678 901'
      },
      participant: {
        id: 'P-001',
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      service: 'Daily Living Support',
      serviceDate: '2025-01-15',
      scheduledStartTime: '10:00',
      scheduledEndTime: '14:00',
      actualStartTime: '10:05',
      actualEndTime: '14:10',
      totalHours: 4.08,
      breakTime: 0.5,
      billableHours: 3.58,
      travelTime: 30,
      travelDistance: 2.3,
      location: 'Participant Home',
      address: '123 Collins Street, Melbourne VIC 3000',
      status: 'submitted',
      submittedAt: '2025-01-15 14:30',
      serviceNotes: 'Completed meal preparation focusing on diabetic-friendly recipes. Assisted with light housekeeping including kitchen cleanup and bedroom tidying. Provided medication reminders at scheduled times. Participant was engaged and appreciative of the cultural meal suggestions. No incidents or concerns.',
      participantSignature: 'Sarah Johnson',
      workerSignature: 'Michael Thompson',
      urgency: 'normal',
      adminFlags: [],
      schadsCalculation: {
        baseRate: 45.50,
        regularHours: 3.58,
        regularPay: 162.89,
        penalties: [],
        allowances: [
          { type: 'travel', amount: 1.96, description: '2.3km × $0.85/km' }
        ],
        totalPay: 180.75,
        gstAmount: 18.08,
        totalWithGst: 198.83
      }
    },
    {
      id: 'TS-002',
      shiftId: 'SH-002',
      worker: {
        id: 'W-002',
        name: 'Emma Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        schadsLevel: 2,
        abn: '77 888 999 000'
      },
      participant: {
        id: 'P-002',
        name: 'Robert Smith',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      service: 'Community Access',
      serviceDate: '2025-01-14',
      scheduledStartTime: '09:00',
      scheduledEndTime: '12:00',
      actualStartTime: '09:00',
      actualEndTime: '12:15',
      totalHours: 3.25,
      breakTime: 0,
      billableHours: 3.25,
      travelTime: 45,
      travelDistance: 5.7,
      location: 'Community Centre',
      address: 'Westfield Shopping Centre, Doncaster',
      status: 'under_review',
      submittedAt: '2025-01-14 12:30',
      reviewedAt: '2025-01-15 09:00',
      reviewedBy: 'Admin Team',
      serviceNotes: 'Assisted with grocery shopping and social skills development. Participant showed good progress with independence and was able to complete checkout process with minimal assistance. Used public transport successfully. Slight delay due to participant wanting to practice social interaction with shop staff.',
      participantSignature: 'Robert Smith',
      workerSignature: 'Emma Chen',
      urgency: 'normal',
      adminFlags: ['overtime_15_minutes'],
      schadsCalculation: {
        baseRate: 42.00,
        regularHours: 3.25,
        regularPay: 136.50,
        penalties: [],
        allowances: [
          { type: 'travel', amount: 4.85, description: '5.7km × $0.85/km' }
        ],
        totalPay: 141.35,
        gstAmount: 14.14,
        totalWithGst: 155.49
      }
    },
    {
      id: 'TS-003',
      shiftId: 'SH-003',
      worker: {
        id: 'W-003',
        name: 'Sarah Davis',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        schadsLevel: 4,
        abn: '98 765 432 109'
      },
      participant: {
        id: 'P-003',
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
      },
      service: 'Personal Care',
      serviceDate: '2025-01-13',
      scheduledStartTime: '08:00',
      scheduledEndTime: '10:00',
      actualStartTime: '08:00',
      actualEndTime: '10:00',
      totalHours: 2.0,
      breakTime: 0,
      billableHours: 2.0,
      travelTime: 35,
      travelDistance: 0.8,
      location: 'Participant Home',
      address: '456 High Street, Preston VIC 3072',
      status: 'rejected',
      submittedAt: '2025-01-13 10:30',
      rejectedAt: '2025-01-14 11:00',
      rejectedBy: 'Financial Admin',
      rejectionReason: 'Service notes insufficient - please provide more detail about personal care activities completed and participant response',
      serviceNotes: 'Provided personal care assistance.',
      participantSignature: 'Maria Garcia',
      workerSignature: 'Sarah Davis',
      urgency: 'normal',
      adminFlags: ['insufficient_notes'],
      schadsCalculation: {
        baseRate: 48.75,
        regularHours: 2.0,
        regularPay: 97.50,
        penalties: [],
        allowances: [
          { type: 'travel', amount: 0.68, description: '0.8km × $0.85/km' }
        ],
        totalPay: 98.18,
        gstAmount: 9.82,
        totalWithGst: 108.00
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'badge-success';
      case 'submitted':
        return 'badge-pending';
      case 'under_review':
        return 'badge-warning';
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
      case 'submitted':
      case 'under_review':
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

  const handleApproveTimesheet = (timesheetId: string) => {
    console.log('Approving timesheet:', timesheetId);
    // This would trigger invoice generation
  };

  const handleRejectTimesheet = (timesheetId: string, reason: string) => {
    console.log('Rejecting timesheet:', timesheetId, 'Reason:', reason);
    setShowRejectionModal(false);
    setRejectionReason('');
    setSelectedTimesheet(null);
  };

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesStatus = filterStatus === 'all' || timesheet.status === filterStatus;
    const matchesSearch = timesheet.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timesheet.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         timesheet.participant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedTimesheetData = timesheets.find(t => t.id === selectedTimesheet);

  const pendingTimesheets = timesheets.filter(t => t.status === 'submitted' || t.status === 'under_review').length;
  const approvedTimesheets = timesheets.filter(t => t.status === 'approved').length;
  const rejectedTimesheets = timesheets.filter(t => t.status === 'rejected').length;
  const totalValue = timesheets.reduce((sum, t) => sum + t.schadsCalculation.totalWithGst, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Timesheet Approval</h1>
            <p className="text-gray-600 mt-2">Review and approve worker timesheets for payment processing</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.EXPORT_FINANCIAL_DATA}>
            <button className="btn-secondary flex items-center">
              <Download size={20} className="mr-2" />
              Export Timesheets
            </button>
          </PermissionGuard>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Review</span>
            </div>
            <div className="metric-value text-orange-600">{pendingTimesheets}</div>
            <div className="metric-label">Pending Approval</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Approved</span>
            </div>
            <div className="metric-value text-green-600">{approvedTimesheets}</div>
            <div className="metric-label">This Month</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-red-600" />
              <span className="text-sm text-gray-500">Rejected</span>
            </div>
            <div className="metric-value text-red-600">{rejectedTimesheets}</div>
            <div className="metric-label">Require Revision</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Value</span>
            </div>
            <div className="metric-value text-purple-600">{formatCurrency(totalValue)}</div>
            <div className="metric-label">Total Value</div>
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
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
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
                        <div className="flex items-center space-x-2">
                          {timesheet.adminFlags.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full font-medium">
                              {timesheet.adminFlags.length} flag(s)
                            </span>
                          )}
                          <span className={`badge ${getStatusColor(timesheet.status)} flex items-center`}>
                            <StatusIcon size={14} className="mr-1" />
                            {timesheet.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Worker and Participant Info */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <img 
                            src={timesheet.worker.avatar} 
                            alt={timesheet.worker.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium text-green-900">{timesheet.worker.name}</p>
                            <p className="text-sm text-green-700">SCHADS Level {timesheet.worker.schadsLevel}</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <img 
                            src={timesheet.participant.avatar} 
                            alt={timesheet.participant.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium text-blue-900">{timesheet.participant.name}</p>
                            <p className="text-sm text-blue-700">Participant</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Time Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-blue-500" />
                          {timesheet.serviceDate}
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-green-500" />
                          {timesheet.actualStartTime} - {timesheet.actualEndTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-purple-500" />
                          {timesheet.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-orange-500" />
                          {formatCurrency(timesheet.schadsCalculation.totalWithGst)}
                        </div>
                      </div>

                      {/* Time Comparison */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Time Comparison</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1"><strong>Scheduled:</strong></p>
                            <p className="text-gray-800">{timesheet.scheduledStartTime} - {timesheet.scheduledEndTime}</p>
                            <p className="text-gray-600">Duration: 4.0 hours</p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1"><strong>Actual:</strong></p>
                            <p className="text-gray-800">{timesheet.actualStartTime} - {timesheet.actualEndTime}</p>
                            <p className="text-gray-600">Duration: {timesheet.totalHours} hours</p>
                            <p className="text-gray-600">Billable: {timesheet.billableHours} hours</p>
                          </div>
                        </div>
                      </div>

                      {/* SCHADS Calculation */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-3">SCHADS Award Calculation</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-800 mb-1">
                              <strong>Classification:</strong> Level {timesheet.worker.schadsLevel}
                            </p>
                            <p className="text-blue-800 mb-1">
                              <strong>Base Rate:</strong> {formatCurrency(timesheet.schadsCalculation.baseRate)}/hour
                            </p>
                            <p className="text-blue-800">
                              <strong>Regular Hours:</strong> {timesheet.schadsCalculation.regularHours}h
                            </p>
                          </div>
                          <div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-blue-700">Base Pay:</span>
                                <span className="text-blue-900">{formatCurrency(timesheet.schadsCalculation.regularPay)}</span>
                              </div>
                              {timesheet.schadsCalculation.allowances.map((allowance, index) => (
                                <div key={index} className="flex justify-between">
                                  <span className="text-blue-700">{allowance.type}:</span>
                                  <span className="text-blue-900">+{formatCurrency(allowance.amount)}</span>
                                </div>
                              ))}
                              <div className="flex justify-between">
                                <span className="text-blue-700">GST (10%):</span>
                                <span className="text-blue-900">+{formatCurrency(timesheet.schadsCalculation.gstAmount)}</span>
                              </div>
                              <div className="flex justify-between font-medium border-t border-blue-200 pt-1">
                                <span className="text-blue-800">Total:</span>
                                <span className="text-blue-900">{formatCurrency(timesheet.schadsCalculation.totalWithGst)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Service Notes */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Service Notes</h4>
                        <p className="text-sm text-gray-700">{timesheet.serviceNotes}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            Worker: {timesheet.workerSignature} | Participant: {timesheet.participantSignature}
                          </div>
                          <div className="text-xs text-gray-500">
                            Submitted: {timesheet.submittedAt}
                          </div>
                        </div>
                      </div>

                      {/* Admin Flags */}
                      {timesheet.adminFlags.length > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-orange-900 mb-2">Admin Flags</h4>
                          <div className="space-y-1">
                            {timesheet.adminFlags.map((flag, index) => (
                              <div key={index} className="flex items-center text-sm text-orange-800">
                                <AlertTriangle size={14} className="mr-2" />
                                {flag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Rejection Info */}
                      {timesheet.status === 'rejected' && (
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
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Timesheet ID: {timesheet.id} • Shift ID: {timesheet.shiftId}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setSelectedTimesheet(timesheet.id)}
                        className="btn-secondary text-sm flex items-center"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </button>
                      
                      <PermissionGuard permission={PERMISSIONS.APPROVE_TIMESHEETS}>
                        {timesheet.status === 'submitted' || timesheet.status === 'under_review' ? (
                          <>
                            <button 
                              onClick={() => {
                                setSelectedTimesheet(timesheet.id);
                                setShowRejectionModal(true);
                              }}
                              className="btn-secondary text-sm text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleApproveTimesheet(timesheet.id)}
                              className="btn-success text-sm flex items-center"
                            >
                              <CheckCircle size={16} className="mr-2" />
                              Approve & Generate Invoice
                            </button>
                          </>
                        ) : timesheet.status === 'approved' ? (
                          <button className="btn-secondary text-sm flex items-center">
                            <FileText size={16} className="mr-2" />
                            View Invoice
                          </button>
                        ) : timesheet.status === 'rejected' ? (
                          <button className="btn-secondary text-sm flex items-center">
                            <MessageCircle size={16} className="mr-2" />
                            Contact Worker
                          </button>
                        ) : null}
                      </PermissionGuard>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rejection Modal */}
        {showRejectionModal && selectedTimesheetData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Reject Timesheet</h2>
                <p className="text-gray-600">Provide feedback for: {selectedTimesheetData.worker.name}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="form-label required">Rejection Reason</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder="Please provide detailed feedback on why this timesheet is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">Common Rejection Reasons</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'Insufficient service notes - more detail required',
                        'Time discrepancy - actual times don\'t match scheduled',
                        'Missing participant signature or confirmation',
                        'Service notes don\'t match billed hours',
                        'Travel time/distance seems excessive',
                        'Break time not properly documented'
                      ].map((reason, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setRejectionReason(reason)}
                          className="text-left text-xs p-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowRejectionModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleRejectTimesheet(selectedTimesheetData.id, rejectionReason)}
                  disabled={!rejectionReason.trim()}
                  className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <AlertTriangle size={16} className="mr-2" />
                  Reject Timesheet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTimesheets.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <Clock size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Timesheets Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Worker timesheets will appear here for review and approval'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TimesheetApproval;