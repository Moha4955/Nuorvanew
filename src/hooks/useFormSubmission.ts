import { useState } from 'react';
import { FormSubmission, ServiceAgreementFormData, RiskAssessmentFormData, IncidentReportFormData, SupportPlanFormData } from '../types/ndis';
import { formService } from '../services/formService';
import { useAuth } from '../context/AuthContext';

interface UseFormSubmissionOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useFormSubmission = (options: UseFormSubmissionOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { user } = useAuth();

  const submitForm = async (formData: {
    formType: 'service_agreement' | 'risk_assessment' | 'incident_report' | 'support_plan';
    participantId: string;
    submissionId?: string;
    formData: ServiceAgreementFormData | RiskAssessmentFormData | IncidentReportFormData | SupportPlanFormData;
  }) => {
    setLoading(true);
    setError(null);

    try {
      let result;

      switch (formData.formType) {
        case 'service_agreement':
          result = await formService.saveServiceAgreement(
            formData.participantId,
            formData.formData as ServiceAgreementFormData,
            formData.submissionId
          );
          break;
        case 'risk_assessment':
          result = await formService.saveRiskAssessment(
            formData.participantId,
            formData.formData as RiskAssessmentFormData,
            formData.submissionId
          );
          break;
        case 'incident_report':
          result = await formService.saveIncidentReport(
            formData.participantId,
            formData.formData as IncidentReportFormData,
            formData.submissionId
          );
          break;
        case 'support_plan':
          result = await formService.saveSupportPlan(
            formData.participantId,
            formData.formData as SupportPlanFormData,
            formData.submissionId
          );
          break;
        default:
          throw new Error('Invalid form type');
      }

      // Update form submission status if applicable
      if (formData.submissionId) {
        await formService.updateFormSubmissionStatus(
          formData.submissionId,
          'completed',
          new Date()
        );
      }

      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Form submission failed';
      setError(errorMessage);
      options.onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const autoSaveForm = async (
    formType: string,
    formId: string,
    formData: any
  ) => {
    if (!options.autoSave) return;

    setAutoSaveStatus('saving');
    
    try {
      await formService.autoSaveForm(formType, formId, formData);
      setAutoSaveStatus('saved');
      
      // Reset to idle after 2 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      
      // Reset to idle after 3 seconds
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  };

  const validateForm = async (formType: string, formData: any) => {
    try {
      const result = await formService.validateForm(formType, formData);
      return result;
    } catch (error) {
      console.error('Form validation failed:', error);
      return { isValid: false, errors: [] };
    }
  };

  const generatePDF = async (formType: string, formId: string) => {
    setLoading(true);
    
    try {
      const result = await formService.generateFormPDF(formType, formId);
      return result.pdf_url;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    autoSaveStatus,
    submitForm,
    autoSaveForm,
    validateForm,
    generatePDF,
    clearError: () => setError(null)
  };
};

export default useFormSubmission;