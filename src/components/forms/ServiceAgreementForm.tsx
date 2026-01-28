import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormWizard from '../common/FormWizard';
import FormField from '../common/FormField';
import { serviceAgreementSchema } from '../../hooks/useFormValidation';
import { ServiceAgreementFormData, ServiceType } from '../../types/ndis';
import { useFormSubmission } from '../../hooks/useFormSubmission';
import { useAuth } from '../../context/AuthContext';
import { Heart, CheckCircle, Shield, FileText, Users, Calendar, MapPin, Clock } from 'lucide-react';

interface ServiceAgreementFormProps {
  participantId: string;
  submissionId?: string;
  onComplete?: (result: any) => void;
  initialData?: Partial<ServiceAgreementFormData>;
}

const ServiceAgreementForm: React.FC<ServiceAgreementFormProps> = ({
  participantId,
  submissionId,
  onComplete,
  initialData
}) => {
  const { user } = useAuth();
  const { submitForm, loading, error, autoSaveForm, autoSaveStatus } = useFormSubmission({
    onSuccess: onComplete,
    autoSave: true,
    autoSaveInterval: 30000
  });

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<ServiceAgreementFormData>({
    resolver: yupResolver(serviceAgreementSchema),
    mode: 'onChange',
    defaultValues: {
      participantInfo: {
        fullName: initialData?.participantInfo?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        ndisNumber: initialData?.participantInfo?.ndisNumber || '',
        dateOfBirth: initialData?.participantInfo?.dateOfBirth || '',
        address: initialData?.participantInfo?.address || {
          street: '',
          suburb: '',
          state: 'VIC',
          postcode: '',
          country: 'Australia'
        },
        emergencyContact: initialData?.participantInfo?.emergencyContact || {
          fullName: '',
          phone: '',
          relationship: '',
          email: ''
        },
        supportCoordinator: initialData?.participantInfo?.supportCoordinator || {
          name: '',
          phone: '',
          email: '',
          organization: ''
        }
      },
      serviceDetails: {
        serviceTypes: initialData?.serviceDetails?.serviceTypes || [],
        startDate: initialData?.serviceDetails?.startDate || '',
        reviewDate: initialData?.serviceDetails?.reviewDate || '',
        serviceLocation: initialData?.serviceDetails?.serviceLocation || ''
      },
      supportTeam: {
        primary_worker: initialData?.supportTeam?.primary_worker || '',
        team_leader: initialData?.supportTeam?.team_leader || '',
        nurova_representative: initialData?.supportTeam?.nurova_representative || 'Nurova Australia Team'
      }
    }
  });

  const formData = watch();

  // Auto-save effect
  useEffect(() => {
    if (submissionId && formData) {
      const timer = setTimeout(() => {
        autoSaveForm('service_agreement', submissionId, formData);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [formData, submissionId, autoSaveForm]);

  const serviceTypeOptions = [
    {
      category: 'core_supports',
      label: 'Core Supports',
      options: [
        { value: 'daily_activities', label: 'Assistance with Daily Personal Activities' },
        { value: 'transport', label: 'Transport' },
        { value: 'consumables', label: 'Consumables' }
      ]
    },
    {
      category: 'capacity_building',
      label: 'Capacity Building',
      options: [
        { value: 'support_coordination', label: 'Support Coordination' },
        { value: 'community_participation', label: 'Improved Social and Community Participation' },
        { value: 'employment', label: 'Finding and Keeping a Job' },
        { value: 'relationships', label: 'Improved Relationships' },
        { value: 'health_wellbeing', label: 'Improved Health and Wellbeing' },
        { value: 'learning', label: 'Improved Learning' },
        { value: 'life_choices', label: 'Improved Life Choices' },
        { value: 'daily_living', label: 'Improved Daily Living Skills' }
      ]
    },
    {
      category: 'capital_supports',
      label: 'Capital Supports',
      options: [
        { value: 'assistive_technology', label: 'Assistive Technology' },
        { value: 'home_modifications', label: 'Home Modifications' },
        { value: 'specialist_accommodation', label: 'Specialist Disability Accommodation' }
      ]
    }
  ];

  const onSubmit = async (data: ServiceAgreementFormData) => {
    try {
      await submitForm({
        formType: 'service_agreement',
        participantId,
        submissionId,
        formData: data
      });
    } catch (error) {
      console.error('Service Agreement submission failed:', error);
    }
  };

  // Step 1: Participant Information
  const ParticipantInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Participant Information</h2>
        <p className="text-gray-600">Please verify and complete your personal details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Controller
          name="participantInfo.fullName"
          control={control}
          render={({ field }) => (
            <FormField
              label="Full Name"
              name="fullName"
              value={field.value}
              onChange={field.onChange}
              error={errors.participantInfo?.fullName?.message}
              required
              placeholder="Enter your full legal name"
            />
          )}
        />

        <Controller
          name="participantInfo.ndisNumber"
          control={control}
          render={({ field }) => (
            <FormField
              label="NDIS Number"
              name="ndisNumber"
              value={field.value}
              onChange={field.onChange}
              error={errors.participantInfo?.ndisNumber?.message}
              required
              placeholder="123456789"
              pattern="[0-9]{9}"
              helpText="Your 9-digit NDIS participant number"
            />
          )}
        />
      </div>

      <Controller
        name="participantInfo.dateOfBirth"
        control={control}
        render={({ field }) => (
          <FormField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={field.value}
            onChange={field.onChange}
            error={errors.participantInfo?.dateOfBirth?.message}
            required
            max={new Date().toISOString().split('T')[0]}
          />
        )}
      />

      {/* Address Fields */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="space-y-4">
          <Controller
            name="participantInfo.address.street"
            control={control}
            render={({ field }) => (
              <FormField
                label="Street Address"
                name="street"
                value={field.value}
                onChange={field.onChange}
                error={errors.participantInfo?.address?.street?.message}
                required
                placeholder="123 Main Street"
              />
            )}
          />
          
          <div className="grid md:grid-cols-3 gap-4">
            <Controller
              name="participantInfo.address.suburb"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Suburb"
                  name="suburb"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.participantInfo?.address?.suburb?.message}
                  required
                  placeholder="Melbourne"
                />
              )}
            />
            
            <Controller
              name="participantInfo.address.state"
              control={control}
              render={({ field }) => (
                <FormField
                  label="State"
                  name="state"
                  type="select"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.participantInfo?.address?.state?.message}
                  required
                  options={[
                    { value: 'NSW', label: 'New South Wales' },
                    { value: 'VIC', label: 'Victoria' },
                    { value: 'QLD', label: 'Queensland' },
                    { value: 'WA', label: 'Western Australia' },
                    { value: 'SA', label: 'South Australia' },
                    { value: 'TAS', label: 'Tasmania' },
                    { value: 'ACT', label: 'Australian Capital Territory' },
                    { value: 'NT', label: 'Northern Territory' }
                  ]}
                />
              )}
            />
            
            <Controller
              name="participantInfo.address.postcode"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Postcode"
                  name="postcode"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.participantInfo?.address?.postcode?.message}
                  required
                  placeholder="3000"
                  pattern="[0-9]{4}"
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-900 mb-4">Emergency Contact</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            name="participantInfo.emergencyContact.fullName"
            control={control}
            render={({ field }) => (
              <FormField
                label="Contact Name"
                name="emergencyContactName"
                value={field.value}
                onChange={field.onChange}
                error={errors.participantInfo?.emergencyContact?.fullName?.message}
                required
                placeholder="John Smith"
              />
            )}
          />
          
          <Controller
            name="participantInfo.emergencyContact.phone"
            control={control}
            render={({ field }) => (
              <FormField
                label="Phone Number"
                name="emergencyContactPhone"
                type="tel"
                value={field.value}
                onChange={field.onChange}
                error={errors.participantInfo?.emergencyContact?.phone?.message}
                required
                placeholder="0400 000 000"
              />
            )}
          />
          
          <Controller
            name="participantInfo.emergencyContact.relationship"
            control={control}
            render={({ field }) => (
              <FormField
                label="Relationship"
                name="emergencyContactRelationship"
                type="select"
                value={field.value}
                onChange={field.onChange}
                error={errors.participantInfo?.emergencyContact?.relationship?.message}
                required
                options={[
                  { value: 'parent', label: 'Parent' },
                  { value: 'sibling', label: 'Sibling' },
                  { value: 'spouse', label: 'Spouse/Partner' },
                  { value: 'child', label: 'Child' },
                  { value: 'friend', label: 'Friend' },
                  { value: 'guardian', label: 'Guardian' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            )}
          />
          
          <Controller
            name="participantInfo.emergencyContact.email"
            control={control}
            render={({ field }) => (
              <FormField
                label="Email (Optional)"
                name="emergencyContactEmail"
                type="email"
                value={field.value}
                onChange={field.onChange}
                error={errors.participantInfo?.emergencyContact?.email?.message}
                placeholder="john@example.com"
              />
            )}
          />
        </div>
      </div>
    </div>
  );

  // Step 2: Service Details
  const ServiceDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Details</h2>
        <p className="text-gray-600">Select the NDIS supports you require</p>
      </div>

      {/* Service Types Selection */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">NDIS Support Categories</h3>
        {serviceTypeOptions.map((category) => (
          <div key={category.category} className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-900 mb-4">{category.label}</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {category.options.map((option) => (
                <Controller
                  key={option.value}
                  name="serviceDetails.serviceTypes"
                  control={control}
                  render={({ field }) => {
                    const isSelected = field.value.some((service: ServiceType) => 
                      service.subcategory === option.value
                    );
                    
                    return (
                      <label className="flex items-center p-3 border rounded-lg hover:bg-white cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([
                                ...field.value,
                                {
                                  category: category.category,
                                  subcategory: option.value,
                                  description: option.label,
                                  frequency: 'As required',
                                  duration: 'Ongoing'
                                }
                              ]);
                            } else {
                              field.onChange(
                                field.value.filter((service: ServiceType) => 
                                  service.subcategory !== option.value
                                )
                              );
                            }
                          }}
                          className="mr-3"
                        />
                        <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      </label>
                    );
                  }}
                />
              ))}
            </div>
          </div>
        ))}
        
        {errors.serviceDetails?.serviceTypes && (
          <div className="text-red-600 text-sm flex items-center">
            <AlertCircle size={16} className="mr-2" />
            {errors.serviceDetails.serviceTypes.message}
          </div>
        )}
      </div>

      {/* Service Timeline */}
      <div className="grid md:grid-cols-2 gap-6">
        <Controller
          name="serviceDetails.startDate"
          control={control}
          render={({ field }) => (
            <FormField
              label="Service Start Date"
              name="startDate"
              type="date"
              value={field.value}
              onChange={field.onChange}
              error={errors.serviceDetails?.startDate?.message}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          )}
        />
        
        <Controller
          name="serviceDetails.reviewDate"
          control={control}
          render={({ field }) => (
            <FormField
              label="First Review Date"
              name="reviewDate"
              type="date"
              value={field.value}
              onChange={field.onChange}
              error={errors.serviceDetails?.reviewDate?.message}
              required
              helpText="Recommended within 3 months of service commencement"
            />
          )}
        />
      </div>

      <Controller
        name="serviceDetails.serviceLocation"
        control={control}
        render={({ field }) => (
          <FormField
            label="Primary Service Location"
            name="serviceLocation"
            type="select"
            value={field.value}
            onChange={field.onChange}
            error={errors.serviceDetails?.serviceLocation?.message}
            required
            options={[
              { value: 'participant_home', label: 'Participant\'s Home' },
              { value: 'community', label: 'Community Locations' },
              { value: 'nurova_premises', label: 'Nurova Australia Premises' },
              { value: 'multiple', label: 'Multiple Locations' }
            ]}
          />
        )}
      />
    </div>
  );

  // Step 3: Support Team
  const SupportTeamStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Team</h2>
        <p className="text-gray-600">Identify your support team members</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Team Members</h3>
        <div className="space-y-4">
          <Controller
            name="supportTeam.primary_worker"
            control={control}
            render={({ field }) => (
              <FormField
                label="Primary Support Worker (if known)"
                name="primaryWorker"
                value={field.value}
                onChange={field.onChange}
                error={errors.supportTeam?.primary_worker?.message}
                placeholder="To be assigned by Nurova Australia"
                helpText="This will be assigned based on your service needs and location"
              />
            )}
          />
          
          <Controller
            name="supportTeam.team_leader"
            control={control}
            render={({ field }) => (
              <FormField
                label="Team Leader (if applicable)"
                name="teamLeader"
                value={field.value}
                onChange={field.onChange}
                error={errors.supportTeam?.team_leader?.message}
                placeholder="To be assigned by Nurova Australia"
                helpText="For complex support needs requiring team coordination"
              />
            )}
          />
          
          <Controller
            name="supportTeam.nurova_representative"
            control={control}
            render={({ field }) => (
              <FormField
                label="Nurova Australia Representative"
                name="nurovaRep"
                value={field.value}
                onChange={field.onChange}
                error={errors.supportTeam?.nurova_representative?.message}
                required
                disabled
                helpText="Your designated Nurova Australia contact person"
              />
            )}
          />
        </div>
      </div>

      {/* Support Coordinator (Optional) */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Support Coordinator (Optional)</h3>
        <p className="text-sm text-green-800 mb-4">
          If you have a Support Coordinator, please provide their details
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Controller
            name="participantInfo.supportCoordinator.name"
            control={control}
            render={({ field }) => (
              <FormField
                label="Coordinator Name"
                name="supportCoordinatorName"
                value={field.value}
                onChange={field.onChange}
                placeholder="Jane Smith"
              />
            )}
          />
          
          <Controller
            name="participantInfo.supportCoordinator.organization"
            control={control}
            render={({ field }) => (
              <FormField
                label="Organization"
                name="supportCoordinatorOrg"
                value={field.value}
                onChange={field.onChange}
                placeholder="ABC Support Coordination"
              />
            )}
          />
          
          <Controller
            name="participantInfo.supportCoordinator.phone"
            control={control}
            render={({ field }) => (
              <FormField
                label="Phone Number"
                name="supportCoordinatorPhone"
                type="tel"
                value={field.value}
                onChange={field.onChange}
                placeholder="0400 000 000"
              />
            )}
          />
          
          <Controller
            name="participantInfo.supportCoordinator.email"
            control={control}
            render={({ field }) => (
              <FormField
                label="Email"
                name="supportCoordinatorEmail"
                type="email"
                value={field.value}
                onChange={field.onChange}
                placeholder="jane@abcsupport.com.au"
              />
            )}
          />
        </div>
      </div>
    </div>
  );

  // Step 4: Review & Sign
  const ReviewSignStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Sign Agreement</h2>
        <p className="text-gray-600">Please review your information before signing</p>
      </div>

      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Participant Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Name:</strong> {formData.participantInfo.fullName}</p>
              <p><strong>NDIS Number:</strong> {formData.participantInfo.ndisNumber}</p>
              <p><strong>Date of Birth:</strong> {formData.participantInfo.dateOfBirth}</p>
            </div>
            <div>
              <p><strong>Address:</strong> {formData.participantInfo.address.street}, {formData.participantInfo.address.suburb} {formData.participantInfo.address.state} {formData.participantInfo.address.postcode}</p>
              <p><strong>Emergency Contact:</strong> {formData.participantInfo.emergencyContact.fullName} ({formData.participantInfo.emergencyContact.relationship})</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Selected Services</h3>
          <div className="space-y-2">
            {formData.serviceDetails.serviceTypes.map((service, index) => (
              <div key={index} className="flex items-center p-2 bg-white rounded border">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                <span className="text-sm">{service.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Service Timeline</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p><strong>Start Date:</strong> {formData.serviceDetails.startDate}</p>
            <p><strong>Review Date:</strong> {formData.serviceDetails.reviewDate}</p>
            <p><strong>Location:</strong> {formData.serviceDetails.serviceLocation}</p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Terms and Conditions</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <p>By signing this Service Agreement, I acknowledge that:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>I have read and understood the terms of service</li>
            <li>The information provided is accurate and complete</li>
            <li>I consent to Nurova Australia providing the selected services</li>
            <li>I understand my rights and responsibilities as an NDIS participant</li>
            <li>I agree to the payment terms and billing procedures</li>
            <li>I understand the complaint and feedback processes</li>
          </ul>
        </div>
      </div>

      {/* Digital Signature */}
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Signature</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms-agreement"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              required
            />
            <label htmlFor="terms-agreement" className="ml-2 text-sm text-gray-700">
              I agree to the terms and conditions of this Service Agreement
            </label>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Digital Signature:</strong> {formData.participantInfo.fullName}
            </p>
            <p className="text-xs text-gray-600">
              By clicking "Submit Agreement" below, you are providing your digital signature and agreeing to all terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const steps = [
    {
      id: 'participant-info',
      title: 'Participant Information',
      component: <ParticipantInfoStep />,
      isValid: !errors.participantInfo,
      isRequired: true
    },
    {
      id: 'service-details',
      title: 'Service Details',
      component: <ServiceDetailsStep />,
      isValid: !errors.serviceDetails,
      isRequired: true
    },
    {
      id: 'support-team',
      title: 'Support Team',
      component: <SupportTeamStep />,
      isValid: !errors.supportTeam,
      isRequired: true
    },
    {
      id: 'review-sign',
      title: 'Review & Sign',
      component: <ReviewSignStep />,
      isValid: true,
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
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Agreement</h1>
        <p className="text-lg text-gray-600">
          Establishing your NDIS support services with Nurova Australia
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

export default ServiceAgreementForm;