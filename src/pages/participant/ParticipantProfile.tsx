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
  Heart,
  AlertCircle,
  CheckCircle,
  Upload,
  DollarSign,
  Clock,
  FileText,
  MessageSquare,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { participantService } from '../../services/participantService';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ParticipantProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [participant, setParticipant] = useState<any>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    address_street: '',
    address_suburb: '',
    address_state: 'VIC',
    address_postcode: '',
    ndis_number: '',
    plan_start_date: '',
    plan_end_date: '',
    plan_budget: 0,
    support_coordinator_name: '',
    support_coordinator_email: '',
    support_coordinator_phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    communication_preferences: [] as string[],
    cultural_background: '',
    disability_type: '',
    support_needs: ''
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const participantData = await participantService.getParticipantByUserId(user.id);

      if (participantData) {
        setParticipant(participantData);
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          phone: user.phone || '',
          email: user.email || '',
          date_of_birth: participantData.date_of_birth || '',
          address_street: participantData.address?.street || '',
          address_suburb: participantData.address?.suburb || '',
          address_state: participantData.address?.state || 'VIC',
          address_postcode: participantData.address?.postcode || '',
          ndis_number: participantData.ndis_number || '',
          plan_start_date: participantData.plan_start_date || '',
          plan_end_date: participantData.plan_end_date || '',
          plan_budget: participantData.plan_budget || 0,
          support_coordinator_name: participantData.support_coordinator?.name || '',
          support_coordinator_email: participantData.support_coordinator?.email || '',
          support_coordinator_phone: participantData.support_coordinator?.phone || '',
          emergency_contact_name: participantData.emergency_contact?.name || '',
          emergency_contact_phone: participantData.emergency_contact?.phone || '',
          emergency_contact_relationship: participantData.emergency_contact?.relationship || '',
          communication_preferences: participantData.communication_preferences || [],
          cultural_background: participantData.cultural_background || '',
          disability_type: participantData.disability_type || '',
          support_needs: participantData.support_needs || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !participant) return;

    try {
      setSaving(true);

      await authService.updateProfile(user.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      });

      await participantService.updateParticipant(participant.id, {
        date_of_birth: formData.date_of_birth,
        address: {
          street: formData.address_street,
          suburb: formData.address_suburb,
          state: formData.address_state,
          postcode: formData.address_postcode
        },
        ndis_number: formData.ndis_number,
        plan_start_date: formData.plan_start_date,
        plan_end_date: formData.plan_end_date,
        plan_budget: formData.plan_budget,
        support_coordinator: {
          name: formData.support_coordinator_name,
          email: formData.support_coordinator_email,
          phone: formData.support_coordinator_phone
        },
        emergency_contact: {
          name: formData.emergency_contact_name,
          phone: formData.emergency_contact_phone,
          relationship: formData.emergency_contact_relationship
        },
        communication_preferences: formData.communication_preferences,
        cultural_background: formData.cultural_background,
        disability_type: formData.disability_type,
        support_needs: formData.support_needs
      });

      toast.success('Profile updated successfully');
      setIsEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    loadProfile();
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      communication_preferences: checked
        ? [...prev.communication_preferences, value]
        : prev.communication_preferences.filter(v => v !== value)
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const calculateDaysRemaining = () => {
    if (!formData.plan_end_date) return 0;
    const endDate = new Date(formData.plan_end_date);
    const today = new Date();
    const diff = endDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'ndis', name: 'NDIS Details', icon: Shield },
    { id: 'support', name: 'Support Preferences', icon: Heart },
    { id: 'emergency', name: 'Emergency Contact', icon: AlertCircle }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Gradient Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-28 h-28 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white/50">
                    {formData.first_name?.[0]}{formData.last_name?.[0]}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-xl shadow-lg border-2 border-blue-200 hover:bg-blue-50 transition-all">
                      <Camera size={18} className="text-blue-600" />
                    </button>
                  )}
                </div>

                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {formData.first_name} {formData.last_name}
                  </h1>
                  <p className="text-blue-100 text-lg mb-3">NDIS Participant</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
                      <Mail size={14} className="mr-2" />
                      {formData.email}
                    </div>
                    <div className="flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm">
                      <Phone size={14} className="mr-2" />
                      {formData.phone || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center justify-center"
                      disabled={saving}
                    >
                      <X size={18} className="mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={18} className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-semibold"
                    >
                      <Edit size={18} className="mr-2" />
                      Edit Profile
                    </button>
                    <button
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all flex items-center justify-center"
                    >
                      <MessageSquare size={18} className="mr-2" />
                      Contact Admin
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Status Badge */}
            {participant && (
              <div className="mt-6 inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <CheckCircle size={18} className="text-white mr-2" />
                <span className="text-white font-medium mr-3">Active Status</span>
                <span className="text-blue-100 text-sm">NDIS: {formData.ndis_number || 'Not set'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        {formData.plan_budget > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <DollarSign size={28} className="text-white" />
                  </div>
                  <FileText size={20} className="text-white/60" />
                </div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Plan Budget</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(formData.plan_budget)}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Clock size={28} className="text-white" />
                  </div>
                  <Calendar size={20} className="text-white/60" />
                </div>
                <p className="text-green-100 text-sm font-medium mb-1">Plan Days Remaining</p>
                <p className="text-3xl font-bold text-white">{calculateDaysRemaining()} days</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <CheckCircle size={28} className="text-white" />
                  </div>
                  <Shield size={20} className="text-white/60" />
                </div>
                <p className="text-purple-100 text-sm font-medium mb-1">Plan Status</p>
                <p className="text-3xl font-bold text-white">Active</p>
              </div>
            </div>
          </div>
        )}

        {/* Modern Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <nav className="flex border-b border-gray-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 font-medium text-sm flex items-center justify-center transition-all relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.name}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Tab Content */}
          <div className="p-8">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled={true}
                      className="input bg-gray-50"
                      title="Email cannot be changed directly"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Bell size={12} className="mr-1" />
                      Contact admin support to change your email address
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900">Address</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={formData.address_street}
                        onChange={(e) => handleInputChange('address_street', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Suburb</label>
                      <input
                        type="text"
                        value={formData.address_suburb}
                        onChange={(e) => handleInputChange('address_suburb', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <select
                        value={formData.address_state}
                        onChange={(e) => handleInputChange('address_state', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      >
                        <option value="VIC">Victoria</option>
                        <option value="NSW">New South Wales</option>
                        <option value="QLD">Queensland</option>
                        <option value="SA">South Australia</option>
                        <option value="WA">Western Australia</option>
                        <option value="TAS">Tasmania</option>
                        <option value="NT">Northern Territory</option>
                        <option value="ACT">Australian Capital Territory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Postcode</label>
                      <input
                        type="text"
                        value={formData.address_postcode}
                        onChange={(e) => handleInputChange('address_postcode', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NDIS Details Tab */}
            {activeTab === 'ndis' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">NDIS Plan Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">NDIS Number</label>
                    <input
                      type="text"
                      value={formData.ndis_number}
                      onChange={(e) => handleInputChange('ndis_number', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                      placeholder="Enter your NDIS number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Budget</label>
                    <input
                      type="number"
                      value={formData.plan_budget}
                      onChange={(e) => handleInputChange('plan_budget', parseFloat(e.target.value))}
                      disabled={!isEditing}
                      className="input"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Start Date</label>
                    <input
                      type="date"
                      value={formData.plan_start_date}
                      onChange={(e) => handleInputChange('plan_start_date', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Plan End Date</label>
                    <input
                      type="date"
                      value={formData.plan_end_date}
                      onChange={(e) => handleInputChange('plan_end_date', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-6">Support Coordinator</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.support_coordinator_name}
                        onChange={(e) => handleInputChange('support_coordinator_name', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                        placeholder="Support coordinator name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.support_coordinator_phone}
                        onChange={(e) => handleInputChange('support_coordinator_phone', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                        placeholder="Phone number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.support_coordinator_email}
                        onChange={(e) => handleInputChange('support_coordinator_email', e.target.value)}
                        disabled={!isEditing}
                        className="input"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Support Preferences Tab */}
            {activeTab === 'support' && (
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Heart size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Support Preferences</h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Communication Preferences</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Email', 'SMS', 'Phone', 'Video Call'].map(pref => (
                      <label key={pref} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.communication_preferences.includes(pref)}
                          onChange={(e) => handleCheckboxChange(pref, e.target.checked)}
                          disabled={!isEditing}
                          className="rounded border-gray-300 text-blue-600 mr-3 w-5 h-5"
                        />
                        <span className="text-sm font-medium text-gray-700">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cultural Background</label>
                  <input
                    type="text"
                    value={formData.cultural_background}
                    onChange={(e) => handleInputChange('cultural_background', e.target.value)}
                    disabled={!isEditing}
                    className="input"
                    placeholder="Your cultural background (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Disability Type</label>
                  <input
                    type="text"
                    value={formData.disability_type}
                    onChange={(e) => handleInputChange('disability_type', e.target.value)}
                    disabled={!isEditing}
                    className="input"
                    placeholder="Primary disability type"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Support Needs</label>
                  <textarea
                    value={formData.support_needs}
                    onChange={(e) => handleInputChange('support_needs', e.target.value)}
                    disabled={!isEditing}
                    rows={5}
                    className="input"
                    placeholder="Describe your support needs and preferences..."
                  />
                </div>
              </div>
            )}

            {/* Emergency Contact Tab */}
            {activeTab === 'emergency' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="p-2 bg-orange-100 rounded-lg mr-4">
                      <AlertCircle size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-900 text-lg mb-2">Emergency Contact Information</h4>
                      <p className="text-sm text-orange-700">
                        This person will be contacted in case of an emergency. Please ensure this information is accurate and up to date.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship</label>
                    <input
                      type="text"
                      value={formData.emergency_contact_relationship}
                      onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                      placeholder="e.g., Mother, Brother, Friend"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                      placeholder="Phone number"
                    />
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

export default ParticipantProfile;
