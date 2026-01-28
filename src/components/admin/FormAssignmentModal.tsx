import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, AlertTriangle, Send, Clock } from 'lucide-react';
import FormField from '../common/FormField';
import { NDISParticipant, FormSubmission } from '../../types/ndis';
import { formService } from '../../services/formService';

interface FormAssignmentModalProps {
  participants: NDISParticipant[];
  onAssign: (assignment: FormAssignmentData) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

interface FormAssignmentData {
  participantId: string;
  formType: 'service_agreement' | 'risk_assessment' | 'incident_report' | 'support_plan';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  assignedTo?: string;
}

const FormAssignmentModal: React.FC<FormAssignmentModalProps> = ({
  participants,
  onAssign,
  onClose,
  isOpen
}) => {
  const [formData, setFormData] = useState<FormAssignmentData>({
    participantId: '',
    formType: 'service_agreement',
    dueDate: '',
    priority: 'medium',
    notes: '',
    assignedTo: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formTypes = [
    { 
      value: 'service_agreement', 
      label: 'Service Agreement',
      description: 'Legal contract establishing service relationship',
      estimatedTime: '15-20 minutes',
      icon: '📋'
    },
    { 
      value: 'risk_assessment', 
      label: 'Risk Assessment',
      description: 'Comprehensive safety evaluation',
      estimatedTime: '30-45 minutes',
      icon: '⚠️'
    },
    { 
      value: 'incident_report', 
      label: 'Incident Report',
      description: 'Immediate incident documentation',
      estimatedTime: '10-15 minutes',
      icon: '🚨'
    },
    { 
      value: 'support_plan', 
      label: 'Individual Support Plan',
      description: 'Person-centered planning document',
      estimatedTime: '45-60 minutes',
      icon: '🎯'
    }
  ];

  const priorityOptions = [
    { 
      value: 'low', 
      label: 'Low Priority',
      description: 'Complete within 2 weeks',
      color: 'text-green-700 bg-green-100'
    },
    { 
      value: 'medium', 
      label: 'Medium Priority',
      description: 'Complete within 1 week',
      color: 'text-yellow-700 bg-yellow-100'
    },
    { 
      value: 'high', 
      label: 'High Priority',
      description: 'Complete within 3 days',
      color: 'text-red-700 bg-red-100'
    }
  ];

  useEffect(() => {
    if (formData.formType && formData.priority) {
      // Auto-calculate due date based on priority
      const today = new Date();
      let daysToAdd = 14; // Default for low priority
      
      switch (formData.priority) {
        case 'high':
          daysToAdd = 3;
          break;
        case 'medium':
          daysToAdd = 7;
          break;
        case 'low':
          daysToAdd = 14;
          break;
      }
      
      const dueDate = new Date(today.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.formType, formData.priority]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.participantId) {
      newErrors.participantId = 'Please select a participant';
    }
    
    if (!formData.formType) {
      newErrors.formType = 'Please select a form type';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Please set a due date';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      if (dueDate <= today) {
        newErrors.dueDate = 'Due date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onAssign(formData);
      // Reset form
      setFormData({
        participantId: '',
        formType: 'service_agreement',
        dueDate: '',
        priority: 'medium',
        notes: '',
        assignedTo: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Form assignment failed:', error);
      setErrors({ general: 'Failed to assign form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormAssignmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const selectedParticipant = participants.find(p => p.id === formData.participantId);
  const selectedFormType = formTypes.find(ft => ft.value === formData.formType);
  const selectedPriority = priorityOptions.find(po => po.value === formData.priority);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assign Form to Participant</h2>
            <p className="text-gray-600">Create a new form submission for completion</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle size={20} className="text-red-600 mr-3" />
                <p className="text-red-800">{errors.general}</p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Participant Selection */}
            <div>
              <label className="form-label required">Select Participant</label>
              <select
                value={formData.participantId}
                onChange={(e) => handleInputChange('participantId', e.target.value)}
                className={`form-input ${errors.participantId ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Choose a participant...</option>
                {participants.map(participant => (
                  <option key={participant.id} value={participant.id}>
                    {participant.user_id} - NDIS: {participant.ndis_number}
                  </option>
                ))}
              </select>
              {errors.participantId && (
                <p className="text-red-600 text-sm mt-1">{errors.participantId}</p>
              )}
            </div>

            {/* Selected Participant Info */}
            {selectedParticipant && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Participant Details</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>NDIS Number:</strong> {selectedParticipant.ndis_number}</p>
                  <p><strong>Date of Birth:</strong> {selectedParticipant.date_of_birth.toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {selectedParticipant.status}</p>
                </div>
              </div>
            )}

            {/* Form Type Selection */}
            <div>
              <label className="form-label required">Form Type</label>
              <div className="grid md:grid-cols-2 gap-4">
                {formTypes.map((formType) => (
                  <label
                    key={formType.value}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      formData.formType === formType.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={formType.value}
                      checked={formData.formType === formType.value}
                      onChange={(e) => handleInputChange('formType', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">{formType.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{formType.label}</h4>
                        <p className="text-sm text-gray-600 mb-1">{formType.description}</p>
                        <p className="text-xs text-gray-500">Est. time: {formType.estimatedTime}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.formType && (
                <p className="text-red-600 text-sm mt-1">{errors.formType}</p>
              )}
            </div>

            {/* Priority Selection */}
            <div>
              <label className="form-label required">Priority Level</label>
              <div className="space-y-3">
                {priorityOptions.map((priority) => (
                  <label
                    key={priority.value}
                    className={`cursor-pointer border rounded-lg p-3 flex items-center transition-all ${
                      formData.priority === priority.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={priority.value}
                      checked={formData.priority === priority.value}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{priority.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${priority.color}`}>
                          {priority.value.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{priority.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <FormField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(value) => handleInputChange('dueDate', value)}
              error={errors.dueDate}
              required
              min={new Date().toISOString().split('T')[0]}
              helpText="Automatically calculated based on priority level"
            />

            {/* Notes */}
            <FormField
              label="Additional Notes"
              name="notes"
              type="textarea"
              value={formData.notes}
              onChange={(value) => handleInputChange('notes', value)}
              placeholder="Any specific instructions or context for this form assignment..."
              rows={3}
              helpText="Optional notes that will be included in the notification to the participant"
            />

            {/* Assignment Summary */}
            {selectedParticipant && selectedFormType && selectedPriority && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Assignment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participant:</span>
                    <span className="font-medium">{selectedParticipant.user_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Form Type:</span>
                    <span className="font-medium">{selectedFormType.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedPriority.color}`}>
                      {selectedPriority.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{new Date(formData.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="font-medium">{selectedFormType.estimatedTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !formData.participantId || !formData.formType || !formData.dueDate}
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Assign Form
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAssignmentModal;