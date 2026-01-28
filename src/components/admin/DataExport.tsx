// Data export component for generating reports and exports

import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, CheckCircle, AlertTriangle } from 'lucide-react';

interface ExportOption {
  id: string;
  label: string;
  description: string;
  format: 'csv' | 'excel' | 'pdf' | 'json';
  icon: React.ComponentType<any>;
  estimatedSize?: string;
  includesPersonalData: boolean;
}

interface DataExportProps {
  entityType: 'workers' | 'participants' | 'shifts' | 'invoices' | 'timesheets' | 'compliance' | 'audit_logs';
  selectedItems?: string[];
  onExport: (options: ExportConfiguration) => Promise<void>;
}

interface ExportConfiguration {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  dateRange?: { start: Date; end: Date };
  includeFields: string[];
  filters?: Record<string, any>;
  selectedItems?: string[];
}

const DataExport: React.FC<DataExportProps> = ({
  entityType,
  selectedItems = [],
  onExport
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'excel' | 'pdf' | 'json'>('csv');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [includeFields, setIncludeFields] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const exportOptions: Record<string, ExportOption[]> = {
    workers: [
      {
        id: 'basic_info',
        label: 'Basic Worker Information',
        description: 'Name, contact details, status, and compliance overview',
        format: 'csv',
        icon: FileText,
        estimatedSize: '~50KB',
        includesPersonalData: true
      },
      {
        id: 'performance_report',
        label: 'Performance Report',
        description: 'Ratings, completed services, and performance metrics',
        format: 'pdf',
        icon: FileText,
        estimatedSize: '~200KB',
        includesPersonalData: false
      },
      {
        id: 'compliance_status',
        label: 'Compliance Status Report',
        description: 'Document status, expiry dates, and compliance alerts',
        format: 'excel',
        icon: FileText,
        estimatedSize: '~100KB',
        includesPersonalData: false
      }
    ],
    invoices: [
      {
        id: 'invoice_summary',
        label: 'Invoice Summary',
        description: 'Invoice numbers, amounts, status, and payment dates',
        format: 'csv',
        icon: FileText,
        estimatedSize: '~30KB',
        includesPersonalData: true
      },
      {
        id: 'financial_report',
        label: 'Financial Report',
        description: 'Detailed financial analysis with charts and summaries',
        format: 'pdf',
        icon: FileText,
        estimatedSize: '~500KB',
        includesPersonalData: false
      },
      {
        id: 'payment_tracking',
        label: 'Payment Tracking',
        description: 'Payment status, overdue amounts, and collection data',
        format: 'excel',
        icon: FileText,
        estimatedSize: '~150KB',
        includesPersonalData: true
      }
    ],
    shifts: [
      {
        id: 'shift_schedule',
        label: 'Shift Schedule',
        description: 'All shifts with dates, times, and assignment details',
        format: 'csv',
        icon: Calendar,
        estimatedSize: '~75KB',
        includesPersonalData: true
      },
      {
        id: 'utilization_report',
        label: 'Utilization Report',
        description: 'Worker utilization and service delivery analytics',
        format: 'pdf',
        icon: FileText,
        estimatedSize: '~300KB',
        includesPersonalData: false
      }
    ],
    audit_logs: [
      {
        id: 'audit_summary',
        label: 'Audit Log Summary',
        description: 'System activities and user actions for compliance',
        format: 'csv',
        icon: FileText,
        estimatedSize: '~100KB',
        includesPersonalData: true
      },
      {
        id: 'compliance_audit',
        label: 'Compliance Audit Report',
        description: 'Detailed compliance audit with recommendations',
        format: 'pdf',
        icon: FileText,
        estimatedSize: '~400KB',
        includesPersonalData: false
      }
    ]
  };

  const fieldOptions: Record<string, Array<{ id: string; label: string; sensitive: boolean }>> = {
    workers: [
      { id: 'name', label: 'Name', sensitive: true },
      { id: 'email', label: 'Email', sensitive: true },
      { id: 'phone', label: 'Phone', sensitive: true },
      { id: 'location', label: 'Location', sensitive: false },
      { id: 'status', label: 'Status', sensitive: false },
      { id: 'compliance', label: 'Compliance Status', sensitive: false },
      { id: 'rating', label: 'Average Rating', sensitive: false },
      { id: 'services_completed', label: 'Services Completed', sensitive: false },
      { id: 'join_date', label: 'Join Date', sensitive: false }
    ],
    invoices: [
      { id: 'invoice_number', label: 'Invoice Number', sensitive: false },
      { id: 'participant_name', label: 'Participant Name', sensitive: true },
      { id: 'worker_name', label: 'Worker Name', sensitive: true },
      { id: 'amount', label: 'Amount', sensitive: false },
      { id: 'status', label: 'Status', sensitive: false },
      { id: 'issue_date', label: 'Issue Date', sensitive: false },
      { id: 'due_date', label: 'Due Date', sensitive: false },
      { id: 'paid_date', label: 'Paid Date', sensitive: false }
    ],
    audit_logs: [
      { id: 'timestamp', label: 'Timestamp', sensitive: false },
      { id: 'user_id', label: 'User ID', sensitive: true },
      { id: 'action', label: 'Action', sensitive: false },
      { id: 'entity_type', label: 'Entity Type', sensitive: false },
      { id: 'outcome', label: 'Outcome', sensitive: false },
      { id: 'ip_address', label: 'IP Address', sensitive: true }
    ]
  };

  const currentOptions = exportOptions[entityType] || [];
  const currentFields = fieldOptions[entityType] || [];
  const sensitiveFieldsSelected = includeFields.some(fieldId => 
    currentFields.find(field => field.id === fieldId)?.sensitive
  );

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const config: ExportConfiguration = {
        format: selectedFormat,
        includeFields,
        selectedItems: selectedItems.length > 0 ? selectedItems : undefined
      };
      
      if (dateRange.start && dateRange.end) {
        config.dateRange = {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end)
        };
      }
      
      await onExport(config);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentOptions.map(option => (
            <div
              key={option.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedFormat === option.format
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFormat(option.format)}
            >
              <div className="flex items-center mb-3">
                <option.icon size={24} className="text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.format.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{option.description}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{option.estimatedSize}</span>
                {option.includesPersonalData && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Personal Data
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
        >
          <Filter size={16} className="mr-2" />
          Advanced Options
        </button>
        
        {showAdvanced && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Date Range */}
            <div>
              <label className="form-label">Date Range (Optional)</label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Field Selection */}
            <div>
              <label className="form-label">Include Fields</label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentFields.map(field => (
                  <label key={field.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={includeFields.includes(field.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setIncludeFields([...includeFields, field.id]);
                        } else {
                          setIncludeFields(includeFields.filter(id => id !== field.id));
                        }
                      }}
                    />
                    <span className="text-sm">{field.label}</span>
                    {field.sensitive && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1 rounded">
                        Sensitive
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selection Summary */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle size={20} className="text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900">
                Exporting {selectedItems.length} selected {entityType}
              </p>
              <p className="text-sm text-blue-700">
                Only the selected items will be included in the export
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Warning */}
      {sensitiveFieldsSelected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Personal Data Export</p>
              <p className="text-sm text-yellow-800 mt-1">
                This export includes personal data. Ensure you comply with privacy regulations 
                and only share this data with authorized personnel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          disabled={isExporting || (showAdvanced && includeFields.length === 0)}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <div className="loading-spinner mr-2" />
              Generating Export...
            </>
          ) : (
            <>
              <Download size={16} className="mr-2" />
              Export {selectedFormat.toUpperCase()}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DataExport;