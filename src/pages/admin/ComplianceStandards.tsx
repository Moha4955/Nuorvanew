import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  Shield,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

const ComplianceStandards: React.FC = () => {
  const [activeTab, setActiveTab] = useState('standards');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirement_type: 'document',
    applicable_roles: [] as string[],
    renewal_period: '',
    grace_period: '30',
    mandatory: true,
    verification_required: true,
    notification_days: ['60', '30', '7']
  });

  const complianceStandards = [
    {
      id: 'cs-001',
      name: 'NDIS Worker Screening Check',
      description: 'Background check required for all NDIS support workers',
      requirement_type: 'document',
      applicable_roles: ['worker'],
      renewal_period: '60',
      grace_period: '30',
      mandatory: true,
      verification_required: true,
      active_workers: 142,
      compliant_workers: 138,
      expiring_soon: 12,
      expired: 4,
      compliance_rate: 97.2,
      notification_days: [60, 30, 7],
      created_date: '2024-01-15',
      last_updated: '2025-01-10'
    },
    {
      id: 'cs-002',
      name: 'Working with Children Check',
      description: 'State-based police check for working with vulnerable persons',
      requirement_type: 'document',
      applicable_roles: ['worker'],
      renewal_period: '60',
      grace_period: '30',
      mandatory: true,
      verification_required: true,
      active_workers: 142,
      compliant_workers: 140,
      expiring_soon: 8,
      expired: 2,
      compliance_rate: 98.6,
      notification_days: [60, 30, 7],
      created_date: '2024-01-15',
      last_updated: '2024-12-20'
    },
    {
      id: 'cs-003',
      name: 'First Aid Certification',
      description: 'Current First Aid and CPR certification from recognized provider',
      requirement_type: 'certification',
      applicable_roles: ['worker'],
      renewal_period: '36',
      grace_period: '30',
      mandatory: true,
      verification_required: true,
      active_workers: 142,
      compliant_workers: 135,
      expiring_soon: 18,
      expired: 7,
      compliance_rate: 95.1,
      notification_days: [60, 30, 7],
      created_date: '2024-01-15',
      last_updated: '2025-01-05'
    },
    {
      id: 'cs-004',
      name: 'NDIS Worker Orientation Module',
      description: 'Completion of mandatory NDIS Worker Orientation training',
      requirement_type: 'training',
      applicable_roles: ['worker'],
      renewal_period: '0',
      grace_period: '0',
      mandatory: true,
      verification_required: true,
      active_workers: 142,
      compliant_workers: 142,
      expiring_soon: 0,
      expired: 0,
      compliance_rate: 100,
      notification_days: [],
      created_date: '2024-01-15',
      last_updated: '2024-11-30'
    },
    {
      id: 'cs-005',
      name: 'Professional Indemnity Insurance',
      description: 'Current professional indemnity insurance coverage',
      requirement_type: 'insurance',
      applicable_roles: ['worker'],
      renewal_period: '12',
      grace_period: '14',
      mandatory: false,
      verification_required: true,
      active_workers: 142,
      compliant_workers: 98,
      expiring_soon: 5,
      expired: 0,
      compliance_rate: 69.0,
      notification_days: [60, 30, 7],
      created_date: '2024-01-15',
      last_updated: '2024-12-15'
    },
    {
      id: 'cs-006',
      name: 'Disability Support Qualification',
      description: 'Certificate IV in Disability or equivalent recognized qualification',
      requirement_type: 'qualification',
      applicable_roles: ['worker'],
      renewal_period: '0',
      grace_period: '0',
      mandatory: true,
      verification_required: true,
      active_workers: 142,
      compliant_workers: 139,
      expiring_soon: 0,
      expired: 3,
      compliance_rate: 97.9,
      notification_days: [],
      created_date: '2024-01-15',
      last_updated: '2025-01-08'
    }
  ];

  const auditLogs = [
    {
      id: 'log-001',
      action: 'Standard Updated',
      standard: 'NDIS Worker Screening Check',
      user: 'Admin Team',
      timestamp: '2025-01-10 14:30',
      details: 'Updated notification schedule to 60, 30, 7 days'
    },
    {
      id: 'log-002',
      action: 'Compliance Alert Sent',
      standard: 'First Aid Certification',
      user: 'System',
      timestamp: '2025-01-10 09:00',
      details: '18 workers notified about expiring certifications'
    },
    {
      id: 'log-003',
      action: 'Standard Created',
      standard: 'COVID-19 Vaccination Status',
      user: 'Compliance Officer',
      timestamp: '2025-01-08 11:45',
      details: 'New health requirement added for all roles'
    }
  ];

  const tabs = [
    { id: 'standards', name: 'Standards', icon: Shield },
    { id: 'monitoring', name: 'Monitoring', icon: TrendingUp },
    { id: 'audit', name: 'Audit Log', icon: FileText }
  ];

  const handleCreateStandard = async () => {
    try {
      setLoading(true);
      toast.success('Compliance standard created successfully');
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        requirement_type: 'document',
        applicable_roles: [],
        renewal_period: '',
        grace_period: '30',
        mandatory: true,
        verification_required: true,
        notification_days: ['60', '30', '7']
      });
    } catch (error) {
      toast.error('Failed to create standard');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToUsers = (standardId: string) => {
    toast.success('Compliance requirement applied to all applicable users');
  };

  const getComplianceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceBg = (rate: number) => {
    if (rate >= 95) return 'bg-green-100';
    if (rate >= 85) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Compliance Standards Management</h1>
            <p className="text-gray-600 mt-1">Manage NDIS compliance requirements and monitoring</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Standard
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Standards</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{complianceStandards.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Compliance</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">94.6%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">43</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Non-Compliant</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">16</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
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
            {activeTab === 'standards' && (
              <div className="space-y-4">
                {complianceStandards.map((standard) => (
                  <div key={standard.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{standard.name}</h3>
                          {standard.mandatory ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                              Mandatory
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              Optional
                            </span>
                          )}
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                            {standard.requirement_type}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{standard.description}</p>

                        <div className="grid md:grid-cols-4 gap-4 mb-4">
                          <div className={`p-4 rounded-lg ${getComplianceBg(standard.compliance_rate)}`}>
                            <p className="text-xs text-gray-600 mb-1">Compliance Rate</p>
                            <p className={`text-2xl font-bold ${getComplianceColor(standard.compliance_rate)}`}>
                              {standard.compliance_rate}%
                            </p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Compliant</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {standard.compliant_workers}/{standard.active_workers}
                            </p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Expiring Soon</p>
                            <p className="text-2xl font-bold text-yellow-600">{standard.expiring_soon}</p>
                          </div>
                          <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-xs text-gray-600 mb-1">Expired</p>
                            <p className="text-2xl font-bold text-red-600">{standard.expired}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {standard.renewal_period !== '0' && (
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              Renewal: Every {standard.renewal_period} months
                            </div>
                          )}
                          {standard.grace_period !== '0' && (
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              Grace: {standard.grace_period} days
                            </div>
                          )}
                          {standard.notification_days.length > 0 && (
                            <div className="flex items-center">
                              <Bell size={14} className="mr-1" />
                              Alerts: {standard.notification_days.join(', ')} days before
                            </div>
                          )}
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            Applies to: {standard.applicable_roles.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleApplyToUsers(standard.id)}
                        className="btn-secondary text-sm"
                      >
                        <Target size={14} className="mr-2" />
                        Apply to Users
                      </button>
                      <button
                        onClick={() => setSelectedStandard(standard)}
                        className="btn-secondary text-sm"
                      >
                        <Edit size={14} className="mr-2" />
                        Edit
                      </button>
                      <button className="btn-secondary text-sm text-red-600">
                        <Trash2 size={14} className="mr-2" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {complianceStandards.filter(s => s.mandatory).map((standard) => (
                      <div key={standard.id} className="bg-white rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">{standard.name}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-xl font-bold ${getComplianceColor(standard.compliance_rate)}`}>
                              {standard.compliance_rate}%
                            </p>
                            <p className="text-xs text-gray-500">
                              {standard.compliant_workers}/{standard.active_workers} compliant
                            </p>
                          </div>
                          {standard.expiring_soon > 0 && (
                            <div className="text-right">
                              <p className="text-sm font-bold text-yellow-600">{standard.expiring_soon}</p>
                              <p className="text-xs text-yellow-600">expiring</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Action Required</h4>
                    <div className="space-y-3">
                      {complianceStandards
                        .filter(s => s.expired > 0 || s.expiring_soon > 0)
                        .map((standard) => (
                          <div key={standard.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{standard.name}</p>
                              <p className="text-xs text-gray-600">
                                {standard.expired > 0 && `${standard.expired} expired`}
                                {standard.expired > 0 && standard.expiring_soon > 0 && ', '}
                                {standard.expiring_soon > 0 && `${standard.expiring_soon} expiring`}
                              </p>
                            </div>
                            <button className="btn-secondary text-xs">
                              Send Reminders
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Recent Updates</h4>
                    <div className="space-y-3">
                      {complianceStandards.slice(0, 5).map((standard) => (
                        <div key={standard.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{standard.name}</p>
                            <p className="text-xs text-gray-600">Updated: {standard.last_updated}</p>
                          </div>
                          <CheckCircle size={16} className="text-green-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">{log.action}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {log.standard}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Users size={12} className="mr-1" />
                            {log.user}
                          </div>
                          <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {log.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {(showCreateModal || selectedStandard) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedStandard ? 'Edit' : 'Create'} Compliance Standard
                  </h2>
                  <p className="text-gray-600">Define requirements and monitoring rules</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedStandard(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Standard Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., NDIS Worker Screening Check"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Describe the compliance requirement..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirement Type</label>
                    <select
                      className="input"
                      value={formData.requirement_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, requirement_type: e.target.value }))}
                    >
                      <option value="document">Document</option>
                      <option value="certification">Certification</option>
                      <option value="training">Training</option>
                      <option value="insurance">Insurance</option>
                      <option value="qualification">Qualification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renewal Period (months)
                    </label>
                    <input
                      type="number"
                      className="input"
                      placeholder="0 for no renewal"
                      value={formData.renewal_period}
                      onChange={(e) => setFormData(prev => ({ ...prev, renewal_period: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Roles</label>
                  <div className="space-y-2">
                    {['worker', 'participant', 'admin'].map(role => (
                      <label key={role} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mr-3"
                          checked={formData.applicable_roles.includes(role)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                applicable_roles: [...prev.applicable_roles, role]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                applicable_roles: prev.applicable_roles.filter(r => r !== role)
                              }));
                            }
                          }}
                        />
                        <span className="capitalize">{role}s</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={formData.mandatory}
                        onChange={(e) => setFormData(prev => ({ ...prev, mandatory: e.target.checked }))}
                      />
                      <div>
                        <span className="font-medium text-gray-900">Mandatory Requirement</span>
                        <p className="text-xs text-gray-600">Must be completed for platform access</p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-3"
                        checked={formData.verification_required}
                        onChange={(e) => setFormData(prev => ({ ...prev, verification_required: e.target.checked }))}
                      />
                      <div>
                        <span className="font-medium text-gray-900">Verification Required</span>
                        <p className="text-xs text-gray-600">Admin must verify submission</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedStandard(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateStandard}
                  disabled={loading || !formData.name}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : selectedStandard ? 'Update Standard' : 'Create Standard'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ComplianceStandards;
