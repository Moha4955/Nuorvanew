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
  Briefcase,
  AlertCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const WorkerOnboarding: React.FC = () => {
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
    
    // Professional Information
    abn: '',
    businessName: '',
    hourlyRate: '',
    workingRadius: '10',
    experience: '',
    qualifications: '',
    
    // Service Categories
    serviceCategories: [] as string[],
    
    // Availability
    mondayStart: '',
    mondayEnd: '',
    tuesdayStart: '',
    tuesdayEnd: '',
    wednesdayStart: '',
    wednesdayEnd: '',
    thursdayStart: '',
    thursdayEnd: '',
    fridayStart: '',
    fridayEnd: '',
    saturdayStart: '',
    saturdayEnd: '',
    sundayStart: '',
    sundayEnd: '',
    
    // Banking Details
    accountName: '',
    bsb: '',
    accountNumber: '',
    bankName: '',
    
    // Documents
    profilePhoto: null as File | null,
    ndisWorkerScreening: null as File | null,
    wwccPoliceCheck: null as File | null,
    firstAidCert: null as File | null,
    professionalIndemnity: null as File | null,
    identificationDoc: null as File | null
  });

  const serviceCategoryOptions = [
    'Core Supports - Daily Activities',
    'Core Supports - Transport',
    'Core Supports - Personal Care',
    'Capacity Building - Support Coordination',
    'Capacity Building - Community Participation',
    'Capacity Building - Employment Support',
    'Capacity Building - Relationships',
    'Capacity Building - Health & Wellbeing',
    'Capacity Building - Learning',
    'Capacity Building - Life Choices',
    'Capacity Building - Daily Living Skills',
    'Specialized Support - Behavior Support',
    'Specialized Support - Allied Health',
    'Specialized Support - Nursing Care'
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
        return !!(formData.abn && formData.hourlyRate && formData.experience);
      case 3:
        return formData.serviceCategories.length > 0;
      case 4:
        return true; // Availability is optional
      case 5:
        return !!(formData.accountName && formData.bsb && formData.accountNumber && formData.bankName);
      case 6:
        return !!(formData.profilePhoto && formData.ndisWorkerScreening && 
                 formData.wwccPoliceCheck && formData.firstAidCert && formData.identificationDoc);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 7));
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
        onboarding_completed: true,
        applicationStatus: 'pending_review'
      });
      
      navigate('/worker/application-pending');
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
        <React.Fragment key={step}>
          <div className={`progress-step ${
            step < currentStep ? 'completed' : 
            step === currentStep ? 'current' : ''
          }`}>
            {step < currentStep && <CheckCircle size={12} className="text-white" />}
          </div>
          {step < 7 && <div className={`progress-connector ${step < currentStep ? 'completed' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User size={48} className="mx-auto text-green-600 mb-4" />
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
        <Briefcase size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Information</h2>
        <p className="text-gray-600">Tell us about your professional background</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="form-label required">ABN</label>
          <input
            type="text"
            className="form-input"
            placeholder="12 345 678 901"
            value={formData.abn}
            onChange={(e) => handleInputChange('abn', e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">Your Australian Business Number</p>
        </div>
        <div>
          <label className="form-label">Business Name (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="Your Business Name"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="form-label required">Hourly Rate (AUD)</label>
          <div className="relative">
            <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              className="form-input pl-10"
              placeholder="45.00"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">Your standard hourly rate</p>
        </div>
        <div>
          <label className="form-label required">Working Radius (km)</label>
          <select
            className="form-input"
            value={formData.workingRadius}
            onChange={(e) => handleInputChange('workingRadius', e.target.value)}
          >
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="15">15 km</option>
            <option value="20">20 km</option>
            <option value="30">30 km</option>
            <option value="50">50 km</option>
            <option value="unlimited">Unlimited</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label required">Experience</label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Describe your experience in disability support services..."
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Qualifications</label>
        <textarea
          className="form-input"
          rows={3}
          placeholder="List your relevant qualifications, certifications, and training..."
          value={formData.qualifications}
          onChange={(e) => handleInputChange('qualifications', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Categories</h2>
        <p className="text-gray-600">Select the types of support you can provide</p>
      </div>

      <div>
        <label className="form-label required">Service Categories</label>
        <p className="text-sm text-gray-600 mb-4">Select all categories you're qualified to provide</p>
        <div className="grid md:grid-cols-2 gap-3">
          {serviceCategoryOptions.map((category) => (
            <label key={category} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                className="mr-3"
                checked={formData.serviceCategories.includes(category)}
                onChange={() => handleArrayToggle('serviceCategories', category)}
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle size={20} className="text-green-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Important Note</h3>
            <p className="text-sm text-green-800">
              You can only provide services in categories where you have appropriate qualifications 
              and experience. Our admin team will verify your capabilities during the approval process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Calendar size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability</h2>
        <p className="text-gray-600">Set your general availability (you can update this later)</p>
      </div>

      <div className="space-y-4">
        {[
          { day: 'Monday', startField: 'mondayStart', endField: 'mondayEnd' },
          { day: 'Tuesday', startField: 'tuesdayStart', endField: 'tuesdayEnd' },
          { day: 'Wednesday', startField: 'wednesdayStart', endField: 'wednesdayEnd' },
          { day: 'Thursday', startField: 'thursdayStart', endField: 'thursdayEnd' },
          { day: 'Friday', startField: 'fridayStart', endField: 'fridayEnd' },
          { day: 'Saturday', startField: 'saturdayStart', endField: 'saturdayEnd' },
          { day: 'Sunday', startField: 'sundayStart', endField: 'sundayEnd' }
        ].map(({ day, startField, endField }) => (
          <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
            <div className="w-24 font-medium text-gray-900">{day}</div>
            <div className="flex items-center space-x-2">
              <input
                type="time"
                className="form-input w-32"
                value={formData[startField as keyof typeof formData] as string}
                onChange={(e) => handleInputChange(startField, e.target.value)}
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                className="form-input w-32"
                value={formData[endField as keyof typeof formData] as string}
                onChange={(e) => handleInputChange(endField, e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              {formData[startField as keyof typeof formData] && formData[endField as keyof typeof formData] 
                ? 'Available' : 'Not available'}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start">
          <Clock size={20} className="text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Flexibility</h3>
            <p className="text-sm text-blue-800">
              This is your general availability. You can always update your schedule and 
              set specific unavailable dates through your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <DollarSign size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Banking Details</h2>
        <p className="text-gray-600">For payment processing</p>
      </div>

      <div>
        <label className="form-label required">Account Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="John Smith"
          value={formData.accountName}
          onChange={(e) => handleInputChange('accountName', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="form-label required">BSB</label>
          <input
            type="text"
            className="form-input"
            placeholder="123-456"
            value={formData.bsb}
            onChange={(e) => handleInputChange('bsb', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label required">Account Number</label>
          <input
            type="text"
            className="form-input"
            placeholder="12345678"
            value={formData.accountNumber}
            onChange={(e) => handleInputChange('accountNumber', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="form-label required">Bank Name</label>
        <input
          type="text"
          className="form-input"
          placeholder="Commonwealth Bank"
          value={formData.bankName}
          onChange={(e) => handleInputChange('bankName', e.target.value)}
        />
      </div>

      <div className="bg-yellow-50 rounded-lg p-6">
        <div className="flex items-start">
          <Shield size={20} className="text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Security</h3>
            <p className="text-sm text-yellow-800">
              Your banking details are encrypted and stored securely. They will only be used 
              for payment processing and will never be shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Document Upload</h2>
        <p className="text-gray-600">Upload required compliance documents</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="form-label required">Profile Photo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Upload a professional photo of yourself</p>
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
          <label className="form-label required">NDIS Worker Screening</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Current NDIS Worker Screening Check</p>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="ndisWorkerScreening"
              onChange={(e) => handleFileUpload('ndisWorkerScreening', e.target.files?.[0] || null)}
            />
            <label htmlFor="ndisWorkerScreening" className="btn-secondary text-sm cursor-pointer">
              Choose File
            </label>
            {formData.ndisWorkerScreening && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.ndisWorkerScreening.name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label required">WWCC/Police Check</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Working with Children Check or Police Check</p>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="wwccPoliceCheck"
              onChange={(e) => handleFileUpload('wwccPoliceCheck', e.target.files?.[0] || null)}
            />
            <label htmlFor="wwccPoliceCheck" className="btn-secondary text-sm cursor-pointer">
              Choose File
            </label>
            {formData.wwccPoliceCheck && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.wwccPoliceCheck.name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label required">First Aid Certification</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Current First Aid Certificate</p>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="firstAidCert"
              onChange={(e) => handleFileUpload('firstAidCert', e.target.files?.[0] || null)}
            />
            <label htmlFor="firstAidCert" className="btn-secondary text-sm cursor-pointer">
              Choose File
            </label>
            {formData.firstAidCert && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.firstAidCert.name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Professional Indemnity Insurance (Recommended)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">Professional Indemnity Insurance Certificate</p>
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="professionalIndemnity"
              onChange={(e) => handleFileUpload('professionalIndemnity', e.target.files?.[0] || null)}
            />
            <label htmlFor="professionalIndemnity" className="btn-secondary text-sm cursor-pointer">
              Choose File
            </label>
            {formData.professionalIndemnity && (
              <p className="text-sm text-green-600 mt-2">✓ {formData.professionalIndemnity.name}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label required">Identification Document</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
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

  const renderStep7 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review your application before submitting</p>
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
          <h3 className="font-semibold text-gray-900 mb-2">Professional Details</h3>
          <p className="text-sm text-gray-600">ABN: {formData.abn}</p>
          <p className="text-sm text-gray-600">Hourly Rate: ${formData.hourlyRate}</p>
          <p className="text-sm text-gray-600">Working Radius: {formData.workingRadius}km</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Service Categories</h3>
          <p className="text-sm text-gray-600">{formData.serviceCategories.length} categories selected</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Documents Uploaded</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>✓ Profile Photo</p>
            <p>✓ NDIS Worker Screening</p>
            <p>✓ WWCC/Police Check</p>
            <p>✓ First Aid Certificate</p>
            {formData.professionalIndemnity && <p>✓ Professional Indemnity Insurance</p>}
            <p>✓ Identification Document</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-start">
          <AlertCircle size={20} className="text-green-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Application Review Process</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Your application will be reviewed by our admin team</li>
              <li>• We'll verify all documents and qualifications</li>
              <li>• You may be contacted for additional information</li>
              <li>• Review process typically takes 3-5 business days</li>
              <li>• You'll receive an email notification once approved</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal" showNavigation={false}>
      <div className="bg-gradient-to-br from-green-50 to-blue-100 py-12 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Worker Application</h1>
            <p className="text-gray-600">Join the Nurova Australia support worker network</p>
          </div>

          {renderStepIndicator()}

          <div className="bg-white rounded-xl shadow-lg p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}
            {currentStep === 7 && renderStep7()}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 7 ? (
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
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      Submit Application
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

export default WorkerOnboarding;