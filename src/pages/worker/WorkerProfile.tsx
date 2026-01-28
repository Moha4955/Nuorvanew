import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  User,
  Edit,
  Camera,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  DollarSign,
  Star,
  Award,
  Clock,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { workerService } from '../../services/workerService';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const WorkerProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [worker, setWorker] = useState<any>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    suburb: '',
    state: 'NSW',
    postcode: '',
    abn: '',
    business_name: '',
    hourly_rate: 42.00,
    working_radius: 15,
    experience_years: 0,
    qualifications: '',
    skills: [] as string[],
    languages: [] as string[],
    transport_available: false,
    account_name: '',
    bsb: '',
    account_number: '',
    bank_name: '',
    availability: [] as any[]
  });

  const AUSTRALIAN_STATES = [
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' }
  ];

  const SERVICE_CATEGORIES = [
    'Core Supports - Daily Activities',
    'Core Supports - Transport',
    'Core Supports - Personal Care',
    'Capacity Building - Community Participation',
    'Capacity Building - Employment',
    'Capacity Building - Relationships',
    'Capacity Building - Daily Living Skills',
    'Specialized Support - Behavior Support'
  ];

  const LANGUAGES = [
    'English', 'Mandarin', 'Arabic', 'Cantonese', 'Vietnamese',
    'Italian', 'Greek', 'Hindi', 'Spanish', 'Punjabi', 'Tagalog',
    'Korean', 'Other'
  ];

  const DEFAULT_AVAILABILITY = [
    { day: 'Monday', start_time: '09:00', end_time: '17:00', is_available: true },
    { day: 'Tuesday', start_time: '09:00', end_time: '17:00', is_available: true },
    { day: 'Wednesday', start_time: '09:00', end_time: '17:00', is_available: true },
    { day: 'Thursday', start_time: '09:00', end_time: '17:00', is_available: true },
    { day: 'Friday', start_time: '09:00', end_time: '17:00', is_available: true },
    { day: 'Saturday', start_time: '09:00', end_time: '13:00', is_available: false },
    { day: 'Sunday', start_time: '09:00', end_time: '13:00', is_available: false }
  ];

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const workerData = await workerService.getWorkerByUserId(user.id);

      if (workerData) {
        setWorker(workerData);

        const address = workerData.address || {};
        const banking = workerData.banking_details || {};

        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          date_of_birth: user.date_of_birth || '',
          phone: user.phone || '',
          email: user.email || '',
          address: typeof address === 'string' ? address : (address.street || ''),
          suburb: typeof address === 'string' ? '' : (address.suburb || ''),
          state: typeof address === 'string' ? 'NSW' : (address.state || 'NSW'),
          postcode: typeof address === 'string' ? '' : (address.postcode || ''),
          abn: workerData.abn || '',
          business_name: workerData.business_name || '',
          hourly_rate: workerData.hourly_rate || 42.00,
          working_radius: workerData.working_radius || 15,
          experience_years: workerData.experience_years || 0,
          qualifications: Array.isArray(workerData.qualifications)
            ? workerData.qualifications.map((q: any) => q.name || q).join(', ')
            : '',
          skills: Array.isArray(workerData.skills) ? workerData.skills : [],
          languages: Array.isArray(workerData.languages) ? workerData.languages : ['English'],
          transport_available: workerData.transport_available || false,
          account_name: banking.account_name || '',
          bsb: banking.bsb || '',
          account_number: banking.account_number || '',
          bank_name: banking.bank_name || '',
          availability: Array.isArray(workerData.availability) && workerData.availability.length > 0
            ? workerData.availability
            : DEFAULT_AVAILABILITY
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleAvailabilityChange = (index: number, field: string, value: any) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData(prev => ({ ...prev, availability: newAvailability }));
  };

  const handleSave = async () => {
    if (!user || !worker) return;

    try {
      setSaving(true);

      await authService.updateProfile(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth
      });

      const qualificationsArray = formData.qualifications
        .split(',')
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .map(name => ({ name, verified: false }));

      await workerService.updateWorker(worker.id, {
        abn: formData.abn,
        business_name: formData.business_name,
        hourly_rate: formData.hourly_rate,
        working_radius: formData.working_radius,
        experience_years: formData.experience_years,
        qualifications: qualificationsArray,
        skills: formData.skills,
        languages: formData.languages,
        transport_available: formData.transport_available,
        availability: formData.availability,
        banking_details: {
          account_name: formData.account_name,
          bsb: formData.bsb,
          account_number: formData.account_number,
          bank_name: formData.bank_name
        },
        address: {
          street: formData.address,
          suburb: formData.suburb,
          state: formData.state,
          postcode: formData.postcode
        }
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfile();
    setIsEditing(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'professional', name: 'Professional', icon: Briefcase },
    { id: 'availability', name: 'Availability', icon: Calendar },
    { id: 'performance', name: 'Performance', icon: Star }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional profile and settings</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="btn-secondary flex items-center">
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center">
                <Edit size={16} className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="content-card">
          <div className="content-card-body">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6 flex-1">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {formData.first_name?.[0]}{formData.last_name?.[0]}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formData.first_name} {formData.last_name}
                  </h2>
                  <p className="text-gray-600 mt-1">NDIS Support Worker</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3">
                    <div className="flex items-center">
                      <Mail size={14} className="mr-2 text-blue-500" />
                      {formData.email}
                    </div>
                    <div className="flex items-center">
                      <Phone size={14} className="mr-2 text-green-500" />
                      {formData.phone || 'Not provided'}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2 text-purple-500" />
                      {formData.suburb && formData.state ? `${formData.suburb}, ${formData.state}` : 'Not provided'}
                    </div>
                  </div>
                  {worker?.performance_metrics && (
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center">
                        <Star size={14} className="text-yellow-400 mr-1 fill-current" />
                        <span className="font-semibold text-gray-900">
                          {worker.performance_metrics.average_rating || '5.0'}
                        </span>
                        <span className="text-gray-500 ml-1 text-sm">
                          ({worker.performance_metrics.total_services || 0} services)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="text-green-500 mr-1" />
                        <span className="font-semibold text-gray-900">
                          {worker.performance_metrics.on_time_percentage || 95}%
                        </span>
                        <span className="text-gray-500 ml-1 text-sm">on-time</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold mb-3 ${
                  worker?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : worker?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {worker?.status === 'active' ? 'Active Worker' : worker?.status === 'pending' ? 'Pending Approval' : 'Inactive'}
                </div>
                {formData.abn && (
                  <p className="text-sm text-gray-600 mb-1">ABN: {formData.abn}</p>
                )}
                <p className="text-lg font-bold text-green-600">{formatCurrency(formData.hourly_rate)}/hour</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="content-card-body">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="input"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="04XX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="input bg-gray-50"
                    value={formData.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suburb</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.suburb}
                      onChange={(e) => handleInputChange('suburb', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Melbourne"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      className="input"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      disabled={!isEditing}
                    >
                      {AUSTRALIAN_STATES.map(state => (
                        <option key={state.value} value={state.value}>{state.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.postcode}
                      onChange={(e) => handleInputChange('postcode', e.target.value)}
                      disabled={!isEditing}
                      placeholder="3000"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'professional' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ABN</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.abn}
                        onChange={(e) => handleInputChange('abn', e.target.value)}
                        disabled={!isEditing}
                        placeholder="XX XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Name (Optional)</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.business_name}
                        onChange={(e) => handleInputChange('business_name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your Business Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate (AUD)</label>
                    <div className="relative">
                      <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        className="input pl-10"
                        value={formData.hourly_rate}
                        onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value))}
                        disabled={!isEditing}
                        step="0.50"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Working Radius (km)</label>
                    <select
                      className="input"
                      value={formData.working_radius}
                      onChange={(e) => handleInputChange('working_radius', parseInt(e.target.value))}
                      disabled={!isEditing}
                    >
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
                      <option value={15}>15 km</option>
                      <option value={20}>20 km</option>
                      <option value={30}>30 km</option>
                      <option value={50}>50 km</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      className="input"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value))}
                      disabled={!isEditing}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={formData.qualifications}
                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Certificate IV in Disability Support, First Aid Certificate (comma separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple qualifications with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Service Categories</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {SERVICE_CATEGORIES.map((category) => (
                      <label key={category} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          className="mt-1 mr-3"
                          checked={formData.skills.includes(category)}
                          onChange={() => handleSkillToggle(category)}
                          disabled={!isEditing}
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Languages Spoken</label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {LANGUAGES.map((language) => (
                      <label key={language} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          className="mr-3"
                          checked={formData.languages.includes(language)}
                          onChange={() => handleLanguageToggle(language)}
                          disabled={!isEditing}
                        />
                        <span className="text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-3"
                      checked={formData.transport_available}
                      onChange={(e) => handleInputChange('transport_available', e.target.checked)}
                      disabled={!isEditing}
                    />
                    <div>
                      <span className="font-medium text-gray-900">Transport Available</span>
                      <p className="text-sm text-gray-600">I have reliable transport and can provide transport assistance</p>
                    </div>
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign size={20} className="mr-2 text-yellow-600" />
                    Banking Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.account_name}
                        onChange={(e) => handleInputChange('account_name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.bank_name}
                        onChange={(e) => handleInputChange('bank_name', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Commonwealth Bank"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">BSB</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.bsb}
                        onChange={(e) => handleInputChange('bsb', e.target.value)}
                        disabled={!isEditing}
                        placeholder="063-000"
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        className="input"
                        value={formData.account_number}
                        onChange={(e) => handleInputChange('account_number', e.target.value)}
                        disabled={!isEditing}
                        placeholder="12345678"
                        maxLength={9}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Weekly Availability</h3>
                  <p className="text-sm text-gray-600 mb-6">Set your general availability for shift assignments</p>

                  <div className="space-y-3">
                    {formData.availability.map((day, index) => (
                      <div key={day.day} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                        <div className="w-28 font-medium text-gray-900">{day.day}</div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={day.is_available}
                            onChange={(e) => handleAvailabilityChange(index, 'is_available', e.target.checked)}
                            disabled={!isEditing}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">Available</span>
                        </label>
                        {day.is_available && (
                          <div className="flex items-center gap-3 ml-auto">
                            <input
                              type="time"
                              className="input w-32"
                              value={day.start_time}
                              onChange={(e) => handleAvailabilityChange(index, 'start_time', e.target.value)}
                              disabled={!isEditing}
                            />
                            <span className="text-gray-400">to</span>
                            <input
                              type="time"
                              className="input w-32"
                              value={day.end_time}
                              onChange={(e) => handleAvailabilityChange(index, 'end_time', e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">About Your Availability</h4>
                      <p className="text-sm text-blue-800">
                        This represents your general availability. Administrators will use this information when assigning shifts.
                        You can always accept or decline specific shift assignments as they come in.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Performance Metrics</h3>
                  <p className="text-sm text-gray-600 mb-6">Your performance and service quality overview</p>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
                      <Star size={32} className="mx-auto text-green-600 mb-3" />
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {worker?.performance_metrics?.average_rating || '5.0'}
                      </div>
                      <div className="text-sm font-medium text-green-700 mb-1">Average Rating</div>
                      <div className="text-xs text-green-600">
                        Based on {worker?.performance_metrics?.total_services || 0} services
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 text-center">
                      <Clock size={32} className="mx-auto text-blue-600 mb-3" />
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {worker?.performance_metrics?.on_time_percentage || '95'}%
                      </div>
                      <div className="text-sm font-medium text-blue-700 mb-1">On-Time Rate</div>
                      <div className="text-xs text-blue-600">Punctuality score</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 text-center">
                      <Award size={32} className="mx-auto text-purple-600 mb-3" />
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {worker?.performance_metrics?.total_services || '0'}
                      </div>
                      <div className="text-sm font-medium text-purple-700 mb-1">Services Completed</div>
                      <div className="text-xs text-purple-600">Total sessions</div>
                    </div>
                  </div>
                </div>

                {formData.skills && formData.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Your Service Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span key={index} className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.languages && formData.languages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((language, index) => (
                        <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Professional Summary</h4>
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Experience:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        {formData.experience_years} {formData.experience_years === 1 ? 'year' : 'years'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Working Radius:</span>
                      <span className="font-medium text-gray-900 ml-2">{formData.working_radius} km</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Transport:</span>
                      <span className="font-medium text-gray-900 ml-2">
                        {formData.transport_available ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ml-2 ${
                        worker?.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {worker?.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerProfile;
