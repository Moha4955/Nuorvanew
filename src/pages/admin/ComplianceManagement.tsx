import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  Shield, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Eye,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  Bell,
  X,
  User
} from 'lucide-react';

const ComplianceManagement: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const complianceAlerts = [
    {
      id: 'CA-001',
      worker: {
        id: 'W-001',
        name: 'Michael Thompson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        email: 'michael.thompson@email.com',
        phone: '0400 567 890'
      },
      documentType: 'First Aid Certification',
      issue: 'Document expires in 7 days',
      severity: 'warning',
      expiryDate: '2025-01-23',
      currentStatus: 'expires_soon',
      category: 'certification',
      lastContacted: '2025-01-10',
      responseStatus: 'pending',
      actionRequired: 'Upload renewed certificate',
      impactLevel: 'Shift access will be restricted after expiry',
      remindersSent: 2,
      daysOverdue: 0
    },
    {
      id: 'CA-002',
      worker: {
        id: 'W-003',
        name: 'Robert Wilson',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        email: 'robert.wilson@email.com',
        phone: '0400 987 654'
      },
      documentType: 'WWCC Police Check',
      issue: 'Document expired 26 days ago',
      severity: 'critical',
      expiryDate: '2024-12-20',
      currentStatus: 'expired',
      category: 'background_check',
      lastContacted: '2025-01-08',
      responseStatus: 'no_response',
      actionRequired: 'Immediate renewal required',
      impactLevel: 'Worker suspended - cannot accept new shifts',
      remindersSent: 5,
      daysOverdue: 26
    },
    {
      id: 'CA-003',
      worker: {
        id: 'W-002',
        name: 'Sarah Davis',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        email: 'sarah.davis@email.com',
        phone: '0400 123 789'
      },
      documentType: 'Professional Indemnity Insurance',
      issue: 'Document renewal needed in 45 days',
      severity: 'info',
      expiryDate: '2025-03-01',
      currentStatus: 'active',
      category: 'insurance',
      lastContacted: '2025-01-05',
      responseStatus: 'acknowledged',
      actionRequired: 'Schedule renewal reminder',
      impactLevel: 'No immediate impact - early notification',
      remindersSent: 1,
      daysOverdue: 0
    },
    {
      id: 'CA-004',
      worker: {
        id: 'W-004',
        name: 'Emma Chen',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        email: 'emma.chen@email.com',
        phone: '0400 555 123'
      },
      documentType: 'NDIS Worker Orientation',
      issue: 'Module completion pending',
      severity: 'warning',
      expiryDate: null,
      currentStatus: 'incomplete',
      category: 'training',
      lastContacted: '2025-01-12',
      responseStatus: 'in_progress',
      actionRequired: 'Complete online training modules',
      impactLevel: 'Cannot accept high-risk assignments',
      remindersSent: 3,
      daysOverdue: 14
    },
    {
      id: 'CA-005',
      worker: {
        id: 'W-005',
        name: 'Lisa Anderson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        email: 'lisa.anderson@email.com',
        phone: '0400 888 999'
      },
      documentType: 'NDIS Worker Screening',
      issue: 'Document verification failed',
      severity: 'critical',
      expiryDate: '2025-08-15',
      currentStatus: 'rejected',
      category: 'background_check',
      lastContacted: '2025-01-14',
      responseStatus: 'contacted',
      actionRequired: 'Resubmit with correct information',
      impactLevel: 'Account suspended pending resolution',
      remindersSent: 1,
      daysOverdue: 3
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-orange-200 bg-orange-50 text-orange-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={20} className="text-red-600" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-orange-600" />;
      case 'info':
        return <Clock size={20} className="text-blue-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  const getResponseStatusColor = (status: string) => {
    switch (status) {
      case 'no_response':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'acknowledged':
        return 'bg-green-100 text-green-700';
      case 'contacted':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleContactWorker = (workerId: string, method: 'email' | 'phone') => {
    console.log(`Contacting worker ${workerId} via ${method}`);
  };

  const handleResolveAlert = (alertId: string) => {
    console.log('Resolving alert:', alertId);
  };

  const filteredAlerts = complianceAlerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesSearch = alert.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.issue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const selectedAlertData = complianceAlerts.find(a => a.id === selectedAlert);

  const criticalAlerts = complianceAlerts.filter(a => a.severity === 'critical').length;
  const warningAlerts = complianceAlerts.filter(a => a.severity === 'warning').length;
  const overdueAlerts = complianceAlerts.filter(a => a.daysOverdue > 0).length;
  const noResponseAlerts = complianceAlerts.filter(a => a.responseStatus === 'no_response').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
            <p className="text-gray-600 mt-2">Monitor and manage worker compliance issues</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-red-600" />
              <span className="text-sm text-gray-500">Critical</span>
            </div>
            <div className="metric-value text-red-600">{criticalAlerts}</div>
            <div className="metric-label">Critical Issues</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Warning</span>
            </div>
            <div className="metric-value text-orange-600">{warningAlerts}</div>
            <div className="metric-label">Warnings</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Overdue</span>
            </div>
            <div className="metric-value text-purple-600">{overdueAlerts}</div>
            <div className="metric-label">Overdue Items</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Bell size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">No Response</span>
            </div>
            <div className="metric-value text-blue-600">{noResponseAlerts}</div>
            <div className="metric-label">Unresponsive</div>
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
                    placeholder="Search compliance alerts..."
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
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                  >
                    <option value="all">All Severity</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
                <button className="btn-secondary text-sm flex items-center">
                  <Download size={16} className="mr-2" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Alerts List */}
        <div className="space-y-6">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`border rounded-xl p-6 ${getSeverityColor(alert.severity)} hover:shadow-md transition-all`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="mt-1">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.documentType}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          alert.severity === 'critical' ? 'bg-red-200 text-red-800' :
                          alert.severity === 'warning' ? 'bg-orange-200 text-orange-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                        {alert.daysOverdue > 0 && (
                          <span className="text-xs px-2 py-1 bg-red-200 text-red-800 rounded-full font-medium">
                            {alert.daysOverdue} days overdue
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Worker Info */}
                    <div className="flex items-center mb-3 p-3 bg-white rounded-lg">
                      <img 
                        src={alert.worker.avatar} 
                        alt={alert.worker.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{alert.worker.name}</p>
                        <p className="text-sm text-gray-600">ID: {alert.worker.id}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleContactWorker(alert.worker.id, 'email')}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Mail size={16} />
                        </button>
                        <button 
                          onClick={() => handleContactWorker(alert.worker.id, 'phone')}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <Phone size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 font-medium">{alert.issue}</p>
                    
                    {/* Alert Details */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      {alert.expiryDate && (
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-blue-500" />
                          Expires: {alert.expiryDate}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-green-500" />
                        Last Contact: {alert.lastContacted}
                      </div>
                      <div className="flex items-center">
                        <Bell size={16} className="mr-2 text-purple-500" />
                        Reminders Sent: {alert.remindersSent}
                      </div>
                      <div className="flex items-center">
                        <User size={16} className="mr-2 text-orange-500" />
                        Response: 
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getResponseStatusColor(alert.responseStatus)}`}>
                          {alert.responseStatus.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Required */}
                    <div className="bg-white rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>Action Required:</strong> {alert.actionRequired}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Impact:</strong> {alert.impactLevel}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Category: {alert.category.replace('_', ' ')} • Alert ID: {alert.id}
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setSelectedAlert(alert.id)}
                    className="btn-secondary text-sm flex items-center"
                  >
                    <Eye size={16} className="mr-2" />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleContactWorker(alert.worker.id, 'email')}
                    className="btn-secondary text-sm flex items-center"
                  >
                    <Mail size={16} className="mr-2" />
                    Send Reminder
                  </button>
                  {alert.severity === 'critical' && (
                    <button className="btn-danger text-sm">
                      Suspend Worker
                    </button>
                  )}
                  <button 
                    onClick={() => handleResolveAlert(alert.id)}
                    className="btn-success text-sm flex items-center"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alert Details Modal */}
        {selectedAlert && selectedAlertData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Compliance Alert Details</h2>
                  <p className="text-gray-600">{selectedAlertData.documentType} - {selectedAlertData.worker.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Alert Summary */}
                <div className={`border rounded-lg p-6 ${getSeverityColor(selectedAlertData.severity)}`}>
                  <div className="flex items-start">
                    {getSeverityIcon(selectedAlertData.severity)}
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{selectedAlertData.issue}</h3>
                      <p className="text-sm mb-2">{selectedAlertData.actionRequired}</p>
                      <p className="text-sm font-medium">{selectedAlertData.impactLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Worker Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Worker Information</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={selectedAlertData.worker.avatar} 
                      alt={selectedAlertData.worker.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedAlertData.worker.name}</h4>
                      <p className="text-sm text-gray-600">Worker ID: {selectedAlertData.worker.id}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-600">{selectedAlertData.worker.email}</span>
                        <span className="text-sm text-gray-600">{selectedAlertData.worker.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Communication Timeline</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800">Last Contacted:</span>
                      <span className="font-medium text-blue-900">{selectedAlertData.lastContacted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Reminders Sent:</span>
                      <span className="font-medium text-blue-900">{selectedAlertData.remindersSent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Response Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResponseStatusColor(selectedAlertData.responseStatus)}`}>
                        {selectedAlertData.responseStatus.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedAlertData.expiryDate && (
                      <div className="flex justify-between">
                        <span className="text-blue-800">Document Expiry:</span>
                        <span className="font-medium text-blue-900">{selectedAlertData.expiryDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setSelectedAlert(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button 
                  onClick={() => handleContactWorker(selectedAlertData.worker.id, 'email')}
                  className="btn-secondary flex items-center"
                >
                  <Mail size={16} className="mr-2" />
                  Send Email
                </button>
                <button 
                  onClick={() => handleResolveAlert(selectedAlertData.id)}
                  className="btn-success"
                >
                  Mark Resolved
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <Shield size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Compliance Issues Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterSeverity !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'All workers are currently compliant with NDIS requirements'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ComplianceManagement;