// Comprehensive audit log viewer for compliance and security monitoring

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PermissionGuard from '../../components/PermissionGuard';
import AdvancedFilters from '../../components/admin/AdvancedFilters';
import DataExport from '../../components/admin/DataExport';
import { 
  Shield, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Settings
} from 'lucide-react';
import { PERMISSIONS } from '../../utils/permissions';
import { auditLogger, AuditLogEntry } from '../../utils/auditLogger';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const auditLogs = await auditLogger.getLogs();
      setLogs(auditLogs);
      setFilteredLogs(auditLogs);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: Record<string, any>) => {
    let filtered = [...logs];
    
    if (filters.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }
    
    if (filters.entityType) {
      filtered = filtered.filter(log => log.entityType === filters.entityType);
    }
    
    if (filters.outcome) {
      filtered = filtered.filter(log => log.outcome === filters.outcome);
    }
    
    if (filters.userRole) {
      filtered = filtered.filter(log => log.userRole === filters.userRole);
    }
    
    if (filters.dateRange?.start && filters.dateRange?.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(log => 
        log.timestamp >= startDate && log.timestamp <= endDate
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return User;
      case 'assign_shift':
      case 'edit_shifts':
        return Calendar;
      case 'approve_timesheet':
      case 'reject_timesheet':
        return FileText;
      case 'generate_invoice':
      case 'send_invoice':
        return FileText;
      case 'approve_worker':
      case 'suspend_worker':
        return User;
      case 'system_setting_change':
        return Settings;
      default:
        return Activity;
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'failure':
        return 'text-red-600 bg-red-50';
      case 'partial':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success':
        return CheckCircle;
      case 'failure':
        return AlertTriangle;
      case 'partial':
        return Clock;
      default:
        return Activity;
    }
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const selectedLogData = logs.find(log => log.id === selectedLog);

  const filterOptions = [
    {
      id: 'action',
      label: 'Action',
      type: 'select' as const,
      options: [
        { value: 'login', label: 'Login' },
        { value: 'logout', label: 'Logout' },
        { value: 'assign_shift', label: 'Assign Shift' },
        { value: 'approve_timesheet', label: 'Approve Timesheet' },
        { value: 'reject_timesheet', label: 'Reject Timesheet' },
        { value: 'generate_invoice', label: 'Generate Invoice' },
        { value: 'send_invoice', label: 'Send Invoice' },
        { value: 'approve_worker', label: 'Approve Worker' },
        { value: 'suspend_worker', label: 'Suspend Worker' }
      ]
    },
    {
      id: 'entityType',
      label: 'Entity Type',
      type: 'select' as const,
      options: [
        { value: 'user', label: 'User' },
        { value: 'shift', label: 'Shift' },
        { value: 'timesheet', label: 'Timesheet' },
        { value: 'invoice', label: 'Invoice' },
        { value: 'worker', label: 'Worker' },
        { value: 'participant', label: 'Participant' }
      ]
    },
    {
      id: 'outcome',
      label: 'Outcome',
      type: 'select' as const,
      options: [
        { value: 'success', label: 'Success' },
        { value: 'failure', label: 'Failure' },
        { value: 'partial', label: 'Partial' }
      ]
    },
    {
      id: 'userRole',
      label: 'User Role',
      type: 'select' as const,
      options: [
        { value: 'admin', label: 'Administrator' },
        { value: 'shift_coordinator', label: 'Shift Coordinator' },
        { value: 'financial_admin', label: 'Financial Admin' },
        { value: 'compliance_officer', label: 'Compliance Officer' },
        { value: 'support_worker', label: 'Support Worker' },
        { value: 'participant', label: 'Participant' }
      ]
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'daterange' as const
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600 mt-2">Monitor system activities and user actions for compliance</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowExport(true)}
              className="btn-secondary flex items-center"
            >
              <Download size={20} className="mr-2" />
              Export Logs
            </button>
            <button
              onClick={loadAuditLogs}
              className="btn-primary flex items-center"
            >
              <Activity size={20} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Activity size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="metric-value text-blue-600">{logs.length}</div>
            <div className="metric-label">Audit Entries</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Success</span>
            </div>
            <div className="metric-value text-green-600">
              {logs.filter(log => log.outcome === 'success').length}
            </div>
            <div className="metric-label">Successful Actions</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-red-600" />
              <span className="text-sm text-gray-500">Failed</span>
            </div>
            <div className="metric-value text-red-600">
              {logs.filter(log => log.outcome === 'failure').length}
            </div>
            <div className="metric-label">Failed Actions</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <User size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Users</span>
            </div>
            <div className="metric-value text-purple-600">
              {new Set(logs.map(log => log.userId)).size}
            </div>
            <div className="metric-label">Active Users</div>
          </div>
        </div>

        {/* Filters */}
        <AdvancedFilters
          filters={filterOptions}
          onFiltersChange={handleFiltersChange}
          onReset={() => setFilteredLogs(logs)}
        />

        {/* Search */}
        <div className="content-card">
          <div className="content-card-body">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user ID, action, or entity ID..."
                className="form-input pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFiltersChange({});
                }}
              />
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="content-card">
          <div className="content-card-body">
            {loading ? (
              <div className="text-center py-12">
                <div className="loading-spinner mx-auto mb-4" />
                <p className="text-gray-600">Loading audit logs...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Entity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Outcome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => {
                      const ActionIcon = getActionIcon(log.action);
                      const OutcomeIcon = getOutcomeIcon(log.outcome);
                      
                      return (
                        <tr 
                          key={log.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedLog(log.id)}
                        >
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {log.timestamp.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{log.userId}</div>
                              <div className="text-xs text-gray-600">{log.userRole}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <ActionIcon size={16} className="text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">{formatAction(log.action)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-sm text-gray-900">{log.entityType}</div>
                              <div className="text-xs text-gray-600">{log.entityId}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(log.outcome)}`}>
                              <OutcomeIcon size={12} className="mr-1" />
                              {log.outcome}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button className="btn-secondary text-xs">
                              <Eye size={12} className="mr-1" />
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {filteredLogs.length === 0 && (
                  <div className="text-center py-12">
                    <Shield size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Audit Logs Found</h3>
                    <p className="text-gray-600">
                      {searchQuery ? 'Try adjusting your search criteria' : 'No audit logs match the current filters'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Log Details Modal */}
        {selectedLog && selectedLogData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Audit Log Details</h2>
                  <p className="text-gray-600">{selectedLogData.id}</p>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Action Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Action:</span>
                        <span className="font-medium">{formatAction(selectedLogData.action)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entity Type:</span>
                        <span className="font-medium">{selectedLogData.entityType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Entity ID:</span>
                        <span className="font-medium">{selectedLogData.entityId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Outcome:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(selectedLogData.outcome)}`}>
                          {selectedLogData.outcome}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">User Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-medium">{selectedLogData.userId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium">{selectedLogData.userRole}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp:</span>
                        <span className="font-medium">{selectedLogData.timestamp.toLocaleString()}</span>
                      </div>
                      {selectedLogData.ipAddress && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">IP Address:</span>
                          <span className="font-medium">{selectedLogData.ipAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {selectedLogData.errorMessage && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">Error Details</h3>
                    <p className="text-sm text-red-800">{selectedLogData.errorMessage}</p>
                  </div>
                )}

                {/* Metadata */}
                {selectedLogData.metadata && Object.keys(selectedLogData.metadata).length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Additional Information</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedLogData.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-blue-700">{key}:</span>
                          <span className="font-medium text-blue-900">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Old/New Values */}
                {(selectedLogData.oldValues || selectedLogData.newValues) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedLogData.oldValues && (
                      <div className="bg-red-50 rounded-lg p-4">
                        <h3 className="font-semibold text-red-900 mb-3">Previous Values</h3>
                        <pre className="text-xs text-red-800 overflow-auto">
                          {JSON.stringify(selectedLogData.oldValues, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {selectedLogData.newValues && (
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-3">New Values</h3>
                        <pre className="text-xs text-green-800 overflow-auto">
                          {JSON.stringify(selectedLogData.newValues, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Export Audit Logs</h2>
                  <p className="text-gray-600">Generate compliance reports and audit trails</p>
                </div>
                <button 
                  onClick={() => setShowExport(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <DataExport
                  entityType="audit_logs"
                  onExport={async (config) => {
                    console.log('Exporting audit logs with config:', config);
                    // Implement actual export logic
                    setShowExport(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;