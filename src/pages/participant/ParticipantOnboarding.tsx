import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/Layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  FileText, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Upload,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertCircle
} from 'lucide-react';

const ParticipantOnboarding: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Details
    dateOfBirth: '',
    phone: '',
    address: '',
    suburb: '',
    state: 'VIC',
    postcode: '',
    
    // NDIS Information
    ndisNumber: '',
    planStartDate: '',
    planEndDate: '',
    planManagerName: '',
    planManagerEmail: '',
    planManagerPhone: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    
    // Support Needs
    supportCategories: [] as string[],
    communicationPreferences: [] as string[],
    accessibilityNeeds: '',
    medicalInformation: '',
    
    // Documents
    profilePhoto: null as File | null,
    ndisCard: null as File | null,
    identificationDoc: null as File | null
  });

  const supportCategoryOptions = [
    'Core Supports - Daily Activities',
    'Core Supports - Transport',
    'Core Supports - Consumables',
    'Capacity Building - Support Coordination',
    'Capacity Building - Community Participation',
    'Capacity Building - Employment',
    'Capacity Building - Relationships',
    'Capacity Building - Health & Wellbeing',
    'Capacity Building - Learning',
    'Capacity Building - Life Choices',
    'Capacity Building - Daily Living Skills',
    'Capital Supports - Assistive Technology',
    'Capital Supports - Home Modifications',
    'Capital Supports - Specialist Disability Accommodation'
  ];

  const communicationOptions = [
    'Email', 'SMS', 'Phone', 'In-person', 'Video call',
    'Written notes', 'Sign language', 'Easy read', 'Large print', 'Audio'
  ];

  const australianStates = [
    'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.dateOfBirth && formData.phone && formData.address && 
                 formData.suburb && formData.postcode);
      case 2:
        return !!(formData.ndisNumber && formData.planStartDate && formData.planEndDate);
      case 3:
        return !!(formData.emergencyContactName && formData.emergencyContactPhone && 
                 formData.emergencyContactRelationship);
      case 4:
        return formData.supportCategories.length > 0 && formData.communicationPreferences.length > 0;
      case 5:
        return !!(formData.profilePhoto && formData.ndisCard && formData.identificationDoc);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateProfile({
        profile_complete: true,
        onboarding_completed: true
      });
      
      navigate('/participant/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <React.Fragment key={step}>
          <div className={`progress-step ${
            step < currentStep ? 'completed' : 
            step === currentStep ? 'current' : ''
          }`}>
            {step < currentStep && <CheckCircle size={12} className="text-white" />}
          </div>
          {step < 6 && <div className={`progress-connector ${step < currentStep ? 'completed' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User size={48} className="mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Let's start with your basic details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="form-label required">Date of Birth</label>
          <input
            type="date"
            className="form-input"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label required">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            placeholder="0400 000 000"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="form-label required">Street Address</label>
        <input
          type="text"
          className="form-input"
          placeholder="123 Main Street"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="form-label required">Suburb</label>
          <input
            type="text"
            className="form-input"
            placeholder="Melbourne"
            value={formData.suburb}
            onChange={(e) => handleInputChange('suburb', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label required">State</label>
          <select
            className="form-input"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          >
            {australianStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label required">Postcode</label>
          <input
            type="text"
            className="form-input"
            placeholder="3000"
            value={formData.postcode}
            onChange={(e) => handleInputChange('postcode', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield size={48} className="mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">NDIS Information</h2>
        <p className="text-gray-600">Your NDIS plan details</p>
      </div>

      <div>
        <label className="form-label required">NDIS Number</label>
        <input
          type="text"
          className="form-input"
          placeholder="43000000000"
          value={formData.ndisNumber}
          onChange={(e) => handleInputChange('ndisNumber', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">Your 11-digit NDIS participant number</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="form-label required">Plan Start Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.planStartDate}
            onChange={(e) => handleInputChange('planStartDate', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label required">Plan End Date</label>
          <input
            type="date"
            className="form-input"
            value={formData.planEndDate}
            onChange={(e) => handleInputChange('planEndDate', e.target.value)}
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Plan Manager (Optional)</h3>
        <p className="text-sm text-gray-600 mb-4">If you have a plan manager, please provide their details</p>
        
        <div className="space-y-4">
          <div>
            <label className="form-label">Plan Manager Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="John Smith"
              value={formData.planManagerName}
              onChange={(e) => handleInputChange('planManagerName', e.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="john@planmanager.com.au"
                value={formData.planManagerEmail}
                onChange={(e) => handleInputChange('planManagerEmail', e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className="form-input"
                placeholder="0400 000 000"
                value={formData.planManagerPhone}
                onChange={(e) => handleInputChange('planManagerPhone', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Phone size={48} className="mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Contact</h2>
        <p className="text-gray-600">Someone we can contact in case of emergency</p>
      </div>

      <div>
        <label className="form-label required">Contact Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Jane Smith"
          value={formData.emergencyContactName}
          onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="form-label required">Phone Number</label>
          <input
            type="tel"
            className="form-input"
            placeholder="0400 000 000"
            value={formData.emergencyContactPhone}
            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label required">Relationship</label>
          <select
            className="form-input"
            value={formData.emergencyContactRelationship}
            onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
          >
            <option value="">Select relationship</option>
            <option value="Parent">Parent</option>
            <option value="Sibling">Sibling</option>
            <option value="Spouse/Partner">Spouse/Partner</option>
            <option value="Child">Child</option>
            <option value="Friend">Friend</option>
            <option value="Guardian">Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Heart size={48} className="mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Support Needs</h2>
        <p className="text-gray-600">Tell us about the support you need</p>
      </div>

      <div>
        <label className="form-label required">Support Categories</label>
        <p className="text-sm text-gray-600 mb-4">Select all that apply to your NDIS plan</p>
        <div className="grid md:grid-cols-2 gap-3">
          {supportCategoryOptions.map((category) => (
            <label key={category} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="mr-3"
                checked={formData.supportCategories.includes(category)}
                onChange={() => handleArrayToggle('supportCategories', category)}
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label required">Communication Preferences</label>
        <p className="text-sm text-gray-600 mb-4">How would you like to communicate with support workers?</p>
        <div className="grid md:grid-cols-3 gap-3">
          {communicationOptions.map((option) => (
            <label key={option} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="mr-3"
                checked={formData.communicationPreferences.includes(option)}
                onChange={() => handleArrayToggle('communicationPreferences', option)}
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="form-label">Accessibility Needs</label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Please describe any accessibility requirements or accommodations needed..."
          value={formData.accessibilityNeeds}
          onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Medical Information (Optional)</label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Any relevant medical information that support workers should be aware of..."
          value={formData.medicalInformation}
          onChange={(e) => handleInputChange('medicalInformation', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">This information will only be shared with assigned support workers</p>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText size={48} className="mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h2>
        <p className="text-gray-600">Upload required documents to complete your profile</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="form-label required">Profile Photo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload a recent photo of yourself</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profilePhoto"
              onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0] || null)}
            />
            <label htmlFor="profilePhoto" className="btn-secondary text-sm cursor-pointer">
              Choose Photo
            </label>
            {formData.profilePhoto && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.profilePhoto.name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label required">NDIS Card</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload a clear photo of your NDIS participant card</p>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="ndisCard"
              onChange={(e) => handleFileUpload('ndisCard', e.target.files?.[0] || null)}
            />
            <label htmlFor="ndisCard" className="btn-secondary text-sm cursor-pointer">
              Choose File
            </label>
            {formData.ndisCard && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.ndisCard.name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label required">Identification Document</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Driver's license, passport, or other government ID</p>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="identificationDoc"
              onChange={(e) => handleFileUpload('identificationDoc', e.target.files?.[0] || null)}
            />
            <label htmlFor="identificationDoc" className="btn-secondary text-sm cursor-pointer">
              Choose File
            </label>
            {formData.identificationDoc && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.identificationDoc.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Complete</h2>
        <p className="text-gray-600">Please review your information before submitting</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
          <p className="text-sm text-gray-600">
            {formData.address}, {formData.suburb} {formData.state} {formData.postcode}
          </p>
          <p className="text-sm text-gray-600">Phone: {formData.phone}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">NDIS Information</h3>
          <p className="text-sm text-gray-600">NDIS Number: {formData.ndisNumber}</p>
          <p className="text-sm text-gray-600">
            Plan Period: {formData.planStartDate} to {formData.planEndDate}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Support Categories</h3>
          <p className="text-sm text-gray-600">{formData.supportCategories.length} categories selected</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
          <p className="text-sm text-gray-600">
            ✓ Profile Photo, ✓ NDIS Card, ✓ Identification
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle size={20} className="text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your profile will be reviewed by our team</li>
              <li>• We'll verify your NDIS information and documents</li>
              <li>• You'll receive access to your dashboard within 24 hours</li>
              <li>• You can then start requesting support services</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal" showNavigation={false}>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Nurova Australia</h1>
            <p className="text-gray-600">Let's set up your NDIS participant profile</p>
          </div>

          {renderStepIndicator()}

          <div className="bg-white rounded-xl shadow-lg p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 6 ? (
                <button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner mr-2" />
                      Completing Setup...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle size={16} className="ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ParticipantOnboarding;