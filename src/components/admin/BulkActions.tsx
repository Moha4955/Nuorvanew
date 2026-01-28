// Bulk action component for efficient admin operations

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Send, 
  UserCheck, 
  UserX, 
  FileText, 
  Download,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
  onExecute: (selectedIds: string[]) => Promise<void>;
}

interface BulkActionsProps {
  selectedItems: string[];
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onToggleItem: (id: string) => void;
  actions: BulkAction[];
  entityType: string;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  totalItems,
  onSelectAll,
  onDeselectAll,
  onToggleItem,
  actions,
  entityType
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const allSelected = selectedItems.length === totalItems && totalItems > 0;
  const someSelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  const handleActionClick = (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setSelectedAction(action);
      setShowConfirmation(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = async (action: BulkAction) => {
    setIsExecuting(true);
    try {
      await action.onExecute(selectedItems);
      onDeselectAll(); // Clear selection after successful action
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsExecuting(false);
      setShowConfirmation(false);
      setSelectedAction(null);
    }
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={allSelected ? onDeselectAll : onSelectAll}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              {allSelected ? (
                <CheckSquare size={20} className="mr-2 text-blue-600" />
              ) : someSelected ? (
                <div className="w-5 h-5 mr-2 bg-blue-600 rounded border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              ) : (
                <Square size={20} className="mr-2" />
              )}
              {selectedItems.length} of {totalItems} {entityType} selected
            </button>
            
            <button
              onClick={onDeselectAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear selection
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            {actions.map(action => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action)}
                disabled={isExecuting}
                className={`btn-secondary text-sm flex items-center ${action.color} disabled:opacity-50`}
              >
                <action.icon size={16} className="mr-2" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Bulk Action</h3>
            </div>
            
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle size={24} className="text-orange-500 mt-1" />
                <div>
                  <p className="text-gray-700 mb-4">
                    {selectedAction.confirmationMessage || 
                     `Are you sure you want to ${selectedAction.label.toLowerCase()} ${selectedItems.length} ${entityType}?`}
                  </p>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn-secondary"
                disabled={isExecuting}
              >
                Cancel
              </button>
              <button
                onClick={() => executeAction(selectedAction)}
                className="btn-danger"
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <>
                    <div className="loading-spinner mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;

// Predefined bulk actions for different entity types
export const getWorkerBulkActions = (
  onApprove: (ids: string[]) => Promise<void>,
  onSuspend: (ids: string[]) => Promise<void>,
  onSendReminder: (ids: string[]) => Promise<void>
): BulkAction[] => [
  {
    id: 'approve',
    label: 'Approve Workers',
    icon: UserCheck,
    color: 'text-green-600 hover:bg-green-50',
    requiresConfirmation: true,
    confirmationMessage: 'Approve selected workers? They will gain access to accept shifts.',
    onExecute: onApprove
  },
  {
    id: 'suspend',
    label: 'Suspend Workers',
    icon: UserX,
    color: 'text-red-600 hover:bg-red-50',
    requiresConfirmation: true,
    confirmationMessage: 'Suspend selected workers? They will lose access to shifts.',
    onExecute: onSuspend
  },
  {
    id: 'reminder',
    label: 'Send Reminders',
    icon: Send,
    color: 'text-blue-600 hover:bg-blue-50',
    requiresConfirmation: false,
    onExecute: onSendReminder
  }
];

export const getInvoiceBulkActions = (
  onSend: (ids: string[]) => Promise<void>,
  onDownload: (ids: string[]) => Promise<void>,
  onMarkPaid: (ids: string[]) => Promise<void>
): BulkAction[] => [
  {
    id: 'send',
    label: 'Send Invoices',
    icon: Send,
    color: 'text-blue-600 hover:bg-blue-50',
    requiresConfirmation: true,
    confirmationMessage: 'Send selected invoices to plan managers?',
    onExecute: onSend
  },
  {
    id: 'download',
    label: 'Download PDFs',
    icon: Download,
    color: 'text-green-600 hover:bg-green-50',
    requiresConfirmation: false,
    onExecute: onDownload
  },
  {
    id: 'mark_paid',
    label: 'Mark as Paid',
    icon: CheckCircle,
    color: 'text-purple-600 hover:bg-purple-50',
    requiresConfirmation: true,
    confirmationMessage: 'Mark selected invoices as paid?',
    onExecute: onMarkPaid
  }
];

export const getTimesheetBulkActions = (
  onApprove: (ids: string[]) => Promise<void>,
  onReject: (ids: string[]) => Promise<void>,
  onExport: (ids: string[]) => Promise<void>
): BulkAction[] => [
  {
    id: 'approve',
    label: 'Approve Timesheets',
    icon: CheckCircle,
    color: 'text-green-600 hover:bg-green-50',
    requiresConfirmation: true,
    confirmationMessage: 'Approve selected timesheets? This will generate invoices.',
    onExecute: onApprove
  },
  {
    id: 'reject',
    label: 'Reject Timesheets',
    icon: X,
    color: 'text-red-600 hover:bg-red-50',
    requiresConfirmation: true,
    confirmationMessage: 'Reject selected timesheets? Workers will need to resubmit.',
    onExecute: onReject
  },
  {
    id: 'export',
    label: 'Export Data',
    icon: FileText,
    color: 'text-blue-600 hover:bg-blue-50',
    requiresConfirmation: false,
    onExecute: onExport
  }
];