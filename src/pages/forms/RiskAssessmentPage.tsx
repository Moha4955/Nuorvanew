import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/Layout/PublicLayout';
import RiskAssessmentForm from '../../components/forms/RiskAssessmentForm';
import { formService } from '../../services/formService';
import { FormSubmission } from '../../types/ndis';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const RiskAssessmentPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submission, setSubmission] = useState<FormSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    } else {
      setLoading(false);
    }
  }, [submissionId]);

  const loadSubmission = async () => {
    if (!submissionId) return;
    
    try {
      const submissionData = await formService.getFormSubmission(submissionId);
      if (submissionData) {
        setSubmission(submissionData);
      } else {
        setError('Form submission not found');
      }
    } catch (err) {
      console.error('Failed to load form submission:', err);
      setError('Failed to load form submission');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = (result: any) => {
    console.log('Risk Assessment completed:', result);
    
    // Show success message and redirect
    setTimeout(() => {
      if (user?.role === 'participant') {
        navigate('/participant/dashboard');
      } else {
        navigate('/admin/forms');
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4" />
          <p className="text-gray-600">Loading risk assessment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Form</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const participantId = submission?.participant_id || user?.id || '';

  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal" showNavigation={false}>
      <div className="bg-gray-50 py-8">
        <RiskAssessmentForm
          participantId={participantId}
          submissionId={submissionId}
          onComplete={handleComplete}
        />
      </div>
    </PublicLayout>
  );
};

export default RiskAssessmentPage;