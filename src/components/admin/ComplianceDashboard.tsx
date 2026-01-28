import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Calendar,
  Plus,
  Eye,
  Send,
  Filter,
  Search,
  Bell,
  TrendingUp,
  Activity
} from 'lucide-react';
import FormAssignmentModal from './FormAssignmentModal';
import { NDISParticipant, FormSubmission, ComplianceEvent } from '../../types/ndis';
import { formService } from '../../services/formService';

interface ComplianceDashboardProps {
  className?: string;
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ className = '' }) => {
  const [participants, setParticipants] = useState<NDISParticipant[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [complianceEvents, setComplianceEvents] = useState<ComplianceEvent[]>([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [participantsData, submissionsData] = await Promise.all([
        formService.getParticipants(),
        formService.getFormSubmissions()
      ]);
      
      setParticipants(participantsData);
      setFormSubmissions(submissionsData);
      
      // Mock compliance events for demo
      setComplianceEvents([
        {
          id: '1',
          participant_id: participantsData[0]?.id || '',
          event_type: 'Service Agreement Review',
          event_description: 'Annual service agreement review due',
          compliance_status: 'pending',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          priority: 'high',
          ndis_standard: 'Practice Standard 1',
          evidence_required: ['Updated service agreement', 'Participant consent'],
          evidence_provided: [],
          created_at: new Date(),
          updated_at: new Date()
        }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignForm = async (assignmentData: any) => {
    try {
      await formService.createFormSubmission({
        participant_id: assignmentData.participantId,
        form_type: assignmentData.formType,
        status: 'pending',
        assigned_by: 'current-user-id', // This would come from auth context
        due_date: new Date(assignmentData.dueDate),
        priority: assignmentData.priority,
        notes: assignmentData.notes,
        reminder_sent: false
      });
      
      setShowAssignmentModal(false);
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to assign form:', error);
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'overdue':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredSubmissions = formSubmissions.filter(submission => {
    const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      submission.form_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.participant_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingSubmissions = formSubmissions.filter(s => s.status === 'pending').length;
  const overdueSubmissions = formSubmissions.filter(s => 
    s.status === 'pending' && s.due_date && new Date(s.due_date) < new Date()
  ).length;
  const completedThisWeek = formSubmissions.filter(s => 
    s.status === 'completed' && 
    s.completed_date && 
    new Date(s.completed_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner mr-3" />
        <span className="text-gray-600">Loading compliance dashboard...</span>
      </div>
    );
  }

  return (
    <div className={`compliance-dashboard ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor form submissions and NDIS compliance</p>
        </div>
        <button
          onClick={() => setShowAssignmentModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Assign New Form
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <Clock size={24} className="text-orange-600" />
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <div className="metric-value text-orange-600">{pendingSubmissions}</div>
          <div className="metric-label">Form Submissions</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle size={24} className="text-red-600" />
            <span className="text-sm text-gray-500">Overdue</span>
          </div>
          <div className="metric-value text-red-600">{overdueSubmissions}</div>
          <div className="metric-label">Require Attention</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={24} className="text-green-600" />
            <span className="text-sm text-gray-500">Completed</span>
          </div>
          <div className="metric-value text-green-600">{completedThisWeek}</div>
          <div className="metric-label">This Week</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <Users size={24} className="text-blue-600" />
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <div className="metric-value text-blue-600">{participants.length}</div>
          <div className="metric-label">Participants</div>
        </div>
      </div>

      {/* Filters */}
      <div className="content-card mb-8">
        <div className="content-card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search form submissions..."
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
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Submissions */}
        <div className="lg:col-span-2">
          <div className="content-card">
            <div className="content-card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="content-card-title">Form Submissions</h2>
                  <p className="content-card-subtitle">Track form completion progress</p>
                </div>
                <FileText size={24} className="text-gray-400" />
              </div>
            </div>
            
            <div className="content-card-body">
              <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Form Submissions</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || filterStatus !== 'all' 
                        ? 'No submissions match your current filters'
                        : 'No form submissions have been created yet'
                      }
                    </p>
                    <button
                      onClick={() => setShowAssignmentModal(true)}
                      className="btn-primary"
                    >
                      <Plus size={16} className="mr-2" />
                      Assign First Form
                    </button>
                  </div>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {submission.form_type.replace('_', ' ').toUpperCase()}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(submission.priority)}`}>
                                {submission.priority.toUpperCase()}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                                {submission.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><strong>Participant:</strong> {submission.participant_id}</p>
                            {submission.due_date && (
                              <p><strong>Due Date:</strong> {new Date(submission.due_date).toLocaleDateString()}</p>
                            )}
                            <p><strong>Created:</strong> {new Date(submission.created_at).toLocaleDateString()}</p>
                            {submission.notes && (
                              <p><strong>Notes:</strong> {submission.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          ID: {submission.id}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="btn-secondary text-xs flex items-center">
                            <Eye size={14} className="mr-1" />
                            View
                          </button>
                          {submission.status === 'pending' && (
                            <button className="btn-secondary text-xs flex items-center">
                              <Send size={14} className="mr-1" />
                              Remind
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
                  <p className="text-sm text-gray-600">NDIS standards monitoring</p>
                </div>
                <Bell size={24} className="text-gray-400" />
              </div>
            </div>
            
            <div className="content-card-body">
              <div className="space-y-3">
                {complianceEvents.map((event) => (
                  <div key={event.id} className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertTriangle size={16} className="text-orange-600 mr-2 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-orange-900 text-sm">{event.event_type}</h4>
                        <p className="text-xs text-orange-800 mt-1">{event.event_description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-orange-700">
                            Due: {event.due_date?.toLocaleDateString()}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(event.priority)}`}>
                            {event.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {complianceEvents.length === 0 && (
                  <div className="text-center py-4">
                    <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                    <p className="text-sm text-gray-600">All compliance requirements up to date</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
            </div>
            
            <div className="content-card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Forms Assigned Today</span>
                  <span className="font-semibold text-gray-900">
                    {formSubmissions.filter(s => 
                      new Date(s.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-green-600">
                    {formSubmissions.length > 0 
                      ? Math.round((formSubmissions.filter(s => s.status === 'completed').length / formSubmissions.length) * 100)
                      : 0
                    }%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Response Time</span>
                  <span className="font-semibold text-blue-600">2.3 days</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Participants</span>
                  <span className="font-semibold text-gray-900">
                    {participants.filter(p => p.status === 'active').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            
            <div className="content-card-body">
              <div className="space-y-3">
                {formSubmissions
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 5)
                  .map((submission) => (
                    <div key={submission.id} className="flex items-center space-x-3 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        submission.status === 'completed' ? 'bg-green-500' :
                        submission.status === 'in_progress' ? 'bg-blue-500' :
                        submission.status === 'overdue' ? 'bg-red-500' :
                        'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-gray-900">
                          {submission.form_type.replace('_', ' ')} {submission.status}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                
                {formSubmissions.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Assignment Modal */}
      <FormAssignmentModal
        participants={participants}
        onAssign={handleAssignForm}
        onClose={() => setShowAssignmentModal(false)}
        isOpen={showAssignmentModal}
      />
    </div>
  );
};

export default ComplianceDashboard;