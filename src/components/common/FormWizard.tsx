import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save, CheckCircle, AlertTriangle } from 'lucide-react';

interface FormStep {
  id: string;
  title: string;
  component: React.ReactNode;
  isValid?: boolean;
  isRequired?: boolean;
}

interface FormWizardProps {
  steps: FormStep[];
  onComplete: (formData: any) => void;
  onStepChange?: (stepIndex: number) => void;
  autoSave?: boolean;
  autoSaveInterval?: number;
  className?: string;
  showProgress?: boolean;
  allowSkipSteps?: boolean;
}

const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onComplete,
  onStepChange,
  autoSave = false,
  autoSaveInterval = 30000, // 30 seconds
  className = '',
  showProgress = true,
  allowSkipSteps = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  useEffect(() => {
    if (autoSave) {
      const interval = setInterval(() => {
        handleAutoSave();
      }, autoSaveInterval);

      return () => clearInterval(interval);
    }
  }, [autoSave, autoSaveInterval]);

  const handleAutoSave = async () => {
    setAutoSaveStatus('saving');
    
    try {
      // Auto-save logic would go here
      // This would typically save the current form state to localStorage or backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
      setAutoSaveStatus('saved');
      
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus('idle'), 3000);
    }
  };

  const canProceedToStep = (stepIndex: number): boolean => {
    if (allowSkipSteps) return true;
    
    // Check if all previous required steps are completed
    for (let i = 0; i < stepIndex; i++) {
      const step = steps[i];
      if (step.isRequired && !completedSteps.has(i)) {
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    
    if (currentStepData.isValid !== false) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({});
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (canProceedToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (canProceedToStep(stepIndex)) return 'available';
    return 'disabled';
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white border-green-500';
      case 'current':
        return 'bg-blue-500 text-white border-blue-500';
      case 'available':
        return 'bg-white text-gray-700 border-gray-300 hover:border-blue-400';
      case 'disabled':
        return 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
      default:
        return 'bg-white text-gray-700 border-gray-300';
    }
  };

  return (
    <div className={`form-wizard ${className}`}>
      {/* Progress Indicator */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </h2>
            {autoSave && (
              <div className="flex items-center text-sm">
                {autoSaveStatus === 'saving' && (
                  <div className="flex items-center text-blue-600">
                    <div className="loading-spinner mr-2" />
                    Saving...
                  </div>
                )}
                {autoSaveStatus === 'saved' && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={16} className="mr-2" />
                    Saved
                  </div>
                )}
                {autoSaveStatus === 'error' && (
                  <div className="flex items-center text-red-600">
                    <AlertTriangle size={16} className="mr-2" />
                    Save failed
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => handleStepClick(index)}
                    disabled={status === 'disabled'}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${getStepStatusColor(status)}`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle size={16} />
                    ) : (
                      index + 1
                    )}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 rounded ${
                      completedSteps.has(index) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            {completedSteps.size} of {steps.length} steps completed
          </div>
        </div>
      )}

      {/* Current Step Content */}
      <div className="form-step-content mb-8">
        {steps[currentStep].component}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <ChevronLeft size={16} className="mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-4">
          {autoSave && (
            <button
              type="button"
              onClick={handleAutoSave}
              className="btn-secondary text-sm flex items-center"
            >
              <Save size={16} className="mr-2" />
              Save Progress
            </button>
          )}
          
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={steps[currentStep].isRequired && steps[currentStep].isValid === false}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRight size={16} className="ml-2" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={steps[currentStep].isRequired && steps[currentStep].isValid === false}
              className="btn-success disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Complete Form
              <CheckCircle size={16} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormWizard;