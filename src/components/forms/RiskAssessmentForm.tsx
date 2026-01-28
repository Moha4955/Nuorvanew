import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormWizard from '../common/FormWizard';
import FormField from '../common/FormField';
import { riskAssessmentSchema } from '../../hooks/useFormValidation';
import { RiskAssessmentFormData, RiskLevels, RiskCategory } from '../../types/ndis';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { useAuth } from '../../context/AuthContext';
import { Shield, AlertTriangle, CheckCircle, Heart, Eye, Activity } from 'lucide-react';

interface RiskAssessmentFormProps {
  participantId: string;
  submissionId?: string;
  onComplete?: (result: any) => void;
  initialData?: Partial<RiskAssessmentFormData>;
}

const RiskAssessmentForm: React.FC<RiskAssessmentFormProps> = ({
  participantId,
  submissionId,
  onComplete,
  initialData
}) => {
  const { user } = useAuth();
  const { submitForm, loading, error, autoSaveForm } = useFormSubmission({
    onSuccess: onComplete,
    autoSave: true
  });

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<RiskAssessmentFormData>({
    resolver: yupResolver(riskAssessmentSchema),
    mode: 'onChange',
    defaultValues: {
      basicInfo: {
        participantName: initialData?.basicInfo?.participantName || '',
        assessmentDate: initialData?.basicInfo?.assessmentDate || new Date().toISOString().split('T')[0],
        assessedBy: initialData?.basicInfo?.assessedBy || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
      },
      riskIdentification: {
        physicalHealth: initialData?.riskIdentification?.physicalHealth || {
          identified_risks: [],
          risk_level: 'low',
          likelihood: 'unlikely',
          consequence: 'minor',
          current_controls: []
        },
        environmental: initialData?.riskIdentification?.environmental || {
          identified_risks: [],
          risk_level: 'low',
          likelihood: 'unlikely',
          consequence: 'minor',
          current_controls: []
        },
        behavioral: initialData?.riskIdentification?.behavioral || {
          identified_risks: [],
          risk_level: 'low',
          likelihood: 'unlikely',
          consequence: 'minor',
          current_controls: []
        },
        communication: initialData?.riskIdentification?.communication || {
          identified_risks: [],
          risk_level: 'low',
          likelihood: 'unlikely',
          consequence: 'minor',
          current_controls: []
        }
      },
      mitigationPlanning: {
        strategies: initialData?.mitigationPlanning?.strategies || [],
        monitoring: initialData?.mitigationPlanning?.monitoring || [],
        emergency: initialData?.mitigationPlanning?.emergency || []
      }
    }
  });

  const formData = watch();

  const calculateOverallRisk = (): 'low' | 'medium' | 'high' => {
    const riskLevels = [
      formData.riskIdentification.physicalHealth.risk_level,
      formData.riskIdentification.environmental.risk_level,
      formData.riskIdentification.behavioral.risk_level,
      formData.riskIdentification.communication.risk_level
    ];

    if (riskLevels.includes('high')) return 'high';
    if (riskLevels.includes('medium')) return 'medium';
    return 'low';
  };

  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-900';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-900';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const getRiskIcon = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'high':
        return <AlertTriangle size={24} className="text-red-600" />;
      case 'medium':
        return <Eye size={24} className="text-yellow-600" />;
      case 'low':
        return <CheckCircle size={24} className="text-green-600" />;
      default:
        return <Activity size={24} className="text-gray-600" />;
    }
  };

  const onSubmit = async (data: RiskAssessmentFormData) => {
    try {
      await submitForm({
        formType: 'risk_assessment',
        participantId,
        submissionId,
        formData: data
      });
    } catch (error) {
      console.error('Risk Assessment submission failed:', error);
    }
  };

  // Step 1: Basic Information
  const BasicInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield size={32} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Information</h2>
        <p className="text-gray-600">Basic details for this risk assessment</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Controller
          name="basicInfo.participantName"
          control={control}
          render={({ field }) => (
            <FormField
              label="Participant Name"
              name="participantName"
              value={field.value}
              onChange={field.onChange}
              error={errors.basicInfo?.participantName?.message}
              required
              placeholder="Enter participant's full name"
            />
          )}
        />

        <Controller
          name="basicInfo.assessmentDate"
          control={control}
          render={({ field }) => (
            <FormField
              label="Assessment Date"
              name="assessmentDate"
              type="date"
              value={field.value}
              onChange={field.onChange}
              error={errors.basicInfo?.assessmentDate?.message}
              required
              max={new Date().toISOString().split('T')[0]}
            />
          )}
        />
      </div>

      <Controller
        name="basicInfo.assessedBy"
        control={control}
        render={({ field }) => (
          <FormField
            label="Assessed By"
            name="assessedBy"
            value={field.value}
            onChange={field.onChange}
            error={errors.basicInfo?.assessedBy?.message}
            required
            placeholder="Name of person conducting assessment"
            helpText="Support worker, team leader, or qualified assessor"
          />
        )}
      />

      {/* Overall Risk Display */}
      <div className={`border-2 rounded-lg p-6 ${getRiskColor(calculateOverallRisk())}`}>
        <div className="flex items-center justify-center mb-4">
          {getRiskIcon(calculateOverallRisk())}
        </div>
        <h3 className="text-center text-xl font-bold">
          Overall Risk Level: {calculateOverallRisk().toUpperCase()}
        </h3>
        <p className="text-center text-sm mt-2">
          This is calculated based on the highest individual risk category
        </p>
      </div>
    </div>
  );

  // Step 2: Risk Identification
  const RiskIdentificationStep = () => {
    const riskCategories = [
      {
        key: 'physicalHealth',
        title: 'Physical Health Risks',
        description: 'Medical conditions, mobility issues, medication management',
        icon: Heart
      },
      {
        key: 'environmental',
        title: 'Environmental Risks',
        description: 'Home safety, community access, transport safety',
        icon: Shield
      },
      {
        key: 'behavioral',
        title: 'Behavioral Risks',
        description: 'Challenging behaviors, self-harm, aggression',
        icon: Activity
      },
      {
        key: 'communication',
        title: 'Communication Risks',
        description: 'Language barriers, cognitive impairment, sensory issues',
        icon: Eye
      }
    ];

    const renderRiskCategory = (categoryKey: string, category: any) => (
      <div key={categoryKey} className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <category.icon size={24} className="text-blue-600 mr-3" />
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{category.title}</h4>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        </div>

        {/* Risk Level Selection */}
        <div className="mb-4">
          <label className="form-label required">Risk Level</label>
          <Controller
            name={`riskIdentification.${categoryKey}.risk_level` as any}
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <label
                    key={level}
                    className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                      field.value === level
                        ? getRiskColor(level)
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={level}
                      checked={field.value === level}
                      onChange={field.onChange}
                      className="sr-only"
                    />
                    <div className="font-semibold text-sm">{level.toUpperCase()}</div>
                  </label>
                ))}
              </div>
            )}
          />
        </div>

        {/* Likelihood and Consequence */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Controller
            name={`riskIdentification.${categoryKey}.likelihood` as any}
            control={control}
            render={({ field }) => (
              <FormField
                label="Likelihood"
                name={`${categoryKey}Likelihood`}
                type="select"
                value={field.value}
                onChange={field.onChange}
                required
                options={[
                  { value: 'rare', label: 'Rare' },
                  { value: 'unlikely', label: 'Unlikely' },
                  { value: 'possible', label: 'Possible' },
                  { value: 'likely', label: 'Likely' },
                  { value: 'almost_certain', label: 'Almost Certain' }
                ]}
              />
            )}
          />

          <Controller
            name={`riskIdentification.${categoryKey}.consequence` as any}
            control={control}
            render={({ field }) => (
              <FormField
                label="Consequence"
                name={`${categoryKey}Consequence`}
                type="select"
                value={field.value}
                onChange={field.onChange}
                required
                options={[
                  { value: 'insignificant', label: 'Insignificant' },
                  { value: 'minor', label: 'Minor' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'major', label: 'Major' },
                  { value: 'catastrophic', label: 'Catastrophic' }
                ]}
              />
            )}
          />
        </div>

        {/* Identified Risks */}
        <Controller
          name={`riskIdentification.${categoryKey}.identified_risks` as any}
          control={control}
          render={({ field }) => (
            <FormField
              label="Identified Risks"
              name={`${categoryKey}Risks`}
              type="textarea"
              value={field.value?.join('\n') || ''}
              onChange={(value) => field.onChange(value.split('\n').filter(Boolean))}
              placeholder="List specific risks in this category (one per line)"
              rows={3}
              helpText="Enter each risk on a new line"
            />
          )}
        />

        {/* Current Controls */}
        <Controller
          name={`riskIdentification.${categoryKey}.current_controls` as any}
          control={control}
          render={({ field }) => (
            <FormField
              label="Current Controls"
              name={`${categoryKey}Controls`}
              type="textarea"
              value={field.value?.join('\n') || ''}
              onChange={(value) => field.onChange(value.split('\n').filter(Boolean))}
              placeholder="List current risk controls and safeguards (one per line)"
              rows={3}
              helpText="What measures are already in place to manage these risks?"
            />
          )}
        />
      </div>
    );

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Risk Identification</h2>
          <p className="text-gray-600">Assess risks across all support areas</p>
        </div>

        <div className="space-y-6">
          {riskCategories.map((category) =>
            renderRiskCategory(category.key, category)
          )}
        </div>
      </div>
    );
  };

  // Step 3: Mitigation Planning
  const MitigationPlanningStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mitigation Planning</h2>
        <p className="text-gray-600">Develop strategies to manage identified risks</p>
      </div>

      {/* Mitigation Strategies */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Mitigation Strategies</h3>
        <p className="text-sm text-blue-800 mb-4">
          For each identified risk, develop specific strategies to reduce or eliminate the risk
        </p>
        
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => {
              const currentStrategies = formData.mitigationPlanning.strategies;
              setValue('mitigationPlanning.strategies', [
                ...currentStrategies,
                {
                  risk_area: '',
                  strategy: '',
                  responsible_person: '',
                  implementation_date: new Date(),
                  review_date: new Date(),
                  effectiveness: 'medium'
                }
              ]);
            }}
            className="btn-secondary text-sm"
          >
            Add Mitigation Strategy
          </button>
          
          {formData.mitigationPlanning.strategies.map((strategy, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name={`mitigationPlanning.strategies.${index}.risk_area`}
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Risk Area"
                      name={`strategy${index}RiskArea`}
                      value={field.value}
                      onChange={field.onChange}
                      required
                      placeholder="e.g., Medication management"
                    />
                  )}
                />
                
                <Controller
                  name={`mitigationPlanning.strategies.${index}.responsible_person`}
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Responsible Person"
                      name={`strategy${index}ResponsiblePerson`}
                      value={field.value}
                      onChange={field.onChange}
                      required
                      placeholder="e.g., Primary Support Worker"
                    />
                  )}
                />
              </div>
              
              <Controller
                name={`mitigationPlanning.strategies.${index}.strategy`}
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Strategy Description"
                    name={`strategy${index}Description`}
                    type="textarea"
                    value={field.value}
                    onChange={field.onChange}
                    required
                    placeholder="Describe the specific strategy to mitigate this risk"
                    rows={2}
                  />
                )}
              />
              
              <div className="grid md:grid-cols-3 gap-4">
                <Controller
                  name={`mitigationPlanning.strategies.${index}.implementation_date`}
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Implementation Date"
                      name={`strategy${index}ImplementationDate`}
                      type="date"
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                      onChange={(value) => field.onChange(new Date(value))}
                      required
                    />
                  )}
                />
                
                <Controller
                  name={`mitigationPlanning.strategies.${index}.review_date`}
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Review Date"
                      name={`strategy${index}ReviewDate`}
                      type="date"
                      value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                      onChange={(value) => field.onChange(new Date(value))}
                      required
                    />
                  )}
                />
                
                <Controller
                  name={`mitigationPlanning.strategies.${index}.effectiveness`}
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label="Expected Effectiveness"
                      name={`strategy${index}Effectiveness`}
                      type="select"
                      value={field.value}
                      onChange={field.onChange}
                      required
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                      ]}
                    />
                  )}
                />
              </div>
              
              <button
                type="button"
                onClick={() => {
                  const currentStrategies = formData.mitigationPlanning.strategies;
                  setValue('mitigationPlanning.strategies', currentStrategies.filter((_, i) => i !== index));
                }}
                className="text-red-600 hover:text-red-700 text-sm mt-2"
              >
                Remove Strategy
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="bg-red-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Procedures</h3>
        <p className="text-sm text-red-800 mb-4">
          Define emergency response procedures for high-risk scenarios
        </p>
        
        <button
          type="button"
          onClick={() => {
            const currentProcedures = formData.mitigationPlanning.emergency;
            setValue('mitigationPlanning.emergency', [
              ...currentProcedures,
              {
                scenario: '',
                immediate_actions: [],
                contact_persons: [],
                escalation_process: ''
              }
            ]);
          }}
          className="btn-secondary text-sm mb-4"
        >
          Add Emergency Procedure
        </button>
        
        {formData.mitigationPlanning.emergency.map((procedure, index) => (
          <div key={index} className="bg-white border border-red-200 rounded-lg p-4 mb-4">
            <Controller
              name={`mitigationPlanning.emergency.${index}.scenario`}
              control={control}
              render={({ field }) => (
                <FormField
                  label="Emergency Scenario"
                  name={`emergency${index}Scenario`}
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="e.g., Medical emergency, behavioral incident"
                />
              )}
            />
            
            <Controller
              name={`mitigationPlanning.emergency.${index}.immediate_actions`}
              control={control}
              render={({ field }) => (
                <FormField
                  label="Immediate Actions"
                  name={`emergency${index}Actions`}
                  type="textarea"
                  value={field.value?.join('\n') || ''}
                  onChange={(value) => field.onChange(value.split('\n').filter(Boolean))}
                  required
                  placeholder="List immediate actions to take (one per line)"
                  rows={3}
                />
              )}
            />
            
            <Controller
              name={`mitigationPlanning.emergency.${index}.escalation_process`}
              control={control}
              render={({ field }) => (
                <FormField
                  label="Escalation Process"
                  name={`emergency${index}Escalation`}
                  type="textarea"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="Describe when and how to escalate this emergency"
                  rows={2}
                />
              )}
            />
            
            <button
              type="button"
              onClick={() => {
                const currentProcedures = formData.mitigationPlanning.emergency;
                setValue('mitigationPlanning.emergency', currentProcedures.filter((_, i) => i !== index));
              }}
              className="text-red-600 hover:text-red-700 text-sm mt-2"
            >
              Remove Procedure
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const steps = [
    {
      id: 'basic-info',
      title: 'Assessment Information',
      component: <BasicInfoStep />,
      isValid: !errors.basicInfo,
      isRequired: true
    },
    {
      id: 'risk-identification',
      title: 'Risk Identification',
      component: <RiskIdentificationStep />,
      isValid: !errors.riskIdentification,
      isRequired: true
    },
    {
      id: 'mitigation-planning',
      title: 'Mitigation Planning',
      component: <MitigationPlanningStep />,
      isValid: !errors.mitigationPlanning,
      isRequired: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="nav-logo-icon mr-3">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-green-600 rounded-xl"></div>
            <div className="absolute inset-0.5 bg-white rounded-lg flex items-center justify-center">
              <Heart size={20} className="text-transparent bg-gradient-to-br from-blue-600 to-green-600 bg-clip-text" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-white">
              <CheckCircle size={12} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield size={8} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="nav-brand-name">Nurova Australia</h1>
            <p className="nav-brand-tagline">NDIS Support Platform</p>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Assessment</h1>
        <p className="text-lg text-gray-600">
          Comprehensive safety evaluation and mitigation planning
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-red-600 mr-3" />
            <div>
              <h3 className="text-red-900 font-medium">Submission Error</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWizard
          steps={steps}
          onComplete={handleSubmit(onSubmit)}
          autoSave={true}
          showProgress={true}
        />
      </form>
    </div>
  );
};

export default RiskAssessmentForm;