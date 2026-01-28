import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PermissionGuard from '../../components/PermissionGuard';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell, 
  Mail,
  DollarSign,
  Clock,
  Users,
  Database,
  Key,
  Globe,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { PERMISSIONS } from '../../utils/permissions';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    platformName: 'Nurova Australia',
    supportEmail: 'support@nurova.com.au',
    supportPhone: '1800 NUROVA',
    timezone: 'Australia/Melbourne',
    dateFormat: 'DD/MM/YYYY',
    currency: 'AUD',
    
    // NDIS Settings
    ndisApiEndpoint: 'https://api.ndis.gov.au',
    ndisApiKey: '••••••••••••••••',
    schadsAwardVersion: '2024-2025',
    complianceCheckInterval: 30, // days
    documentExpiryWarning: 30, // days
    
    // Email Settings
    emailProvider: 'sendgrid',
    emailApiKey: '••••••••••••••••',
    fromEmail: 'noreply@nurova.com.au',
    fromName: 'Nurova Australia',
    emailTemplatesEnabled: true,
    
    // Notification Settings
    enableEmailNotifications: true,
    enableSmsNotifications: true,
    enablePushNotifications: true,
    notificationFrequency: 'immediate',
    
    // Security Settings
    sessionTimeout: 60, // minutes
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowedLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    
    // Financial Settings
    invoiceTerms: 14, // days
    latePaymentFee: 25.00,
    gstRate: 10, // percentage
    paymentGracePeriod: 7, // days
    autoGenerateInvoices: true,
    
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info',
    backupFrequency: 'daily',
    dataRetentionPeriod: 2555 // days (7 years)
  });

  const [showApiKeys, setShowApiKeys] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving settings:', settings);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'ndis', name: 'NDIS Integration', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Key },
    { id: 'financial', name: 'Financial', icon: DollarSign },
    { id: 'system', name: 'System', icon: Database }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-2">Configure platform settings and integrations</p>
          </div>
          <div className="flex items-center space-x-4">
            {unsavedChanges && (
              <span className="text-sm text-orange-600 flex items-center">
                <AlertTriangle size={16} className="mr-1" />
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleSaveSettings}
              disabled={!unsavedChanges}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} className="mr-2" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="content-card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Platform Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Platform Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settings.platformName}
                      onChange={(e) => handleSettingChange('platformName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Support Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={settings.supportEmail}
                      onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Support Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={settings.supportPhone}
                      onChange={(e) => handleSettingChange('supportPhone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">Timezone</label>
                    <select
                      className="form-input"
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    >
                      <option value="Australia/Melbourne">Australia/Melbourne</option>
                      <option value="Australia/Sydney">Australia/Sydney</option>
                      <option value="Australia/Brisbane">Australia/Brisbane</option>
                      <option value="Australia/Perth">Australia/Perth</option>
                      <option value="Australia/Adelaide">Australia/Adelaide</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Date Format</label>
                    <select
                      className="form-input"
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Currency</label>
                    <select
                      className="form-input"
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                    >
                      <option value="AUD">Australian Dollar (AUD)</option>
                      <option value="USD">US Dollar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* NDIS Settings */}
            {activeTab === 'ndis' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">NDIS Integration Settings</h3>
                
                <div>
                  <label className="form-label">NDIS API Endpoint</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.ndisApiEndpoint}
                    onChange={(e) => handleSettingChange('ndisApiEndpoint', e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">NDIS API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKeys ? 'text' : 'password'}
                      className="form-input pr-10"
                      value={settings.ndisApiKey}
                      onChange={(e) => handleSettingChange('ndisApiKey', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                    >
                      {showApiKeys ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">SCHADS Award Version</label>
                    <select
                      className="form-input"
                      value={settings.schadsAwardVersion}
                      onChange={(e) => handleSettingChange('schadsAwardVersion', e.target.value)}
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2022-2023">2022-2023</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Compliance Check Interval (days)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="1"
                      max="90"
                      value={settings.complianceCheckInterval}
                      onChange={(e) => handleSettingChange('complianceCheckInterval', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Document Expiry Warning (days)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="7"
                    max="90"
                    value={settings.documentExpiryWarning}
                    onChange={(e) => handleSettingChange('documentExpiryWarning', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Send alerts this many days before document expiry
                  </p>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Email Notifications</label>
                      <p className="text-sm text-gray-600">Send notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={settings.enableEmailNotifications}
                      onChange={(e) => handleSettingChange('enableEmailNotifications', e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">SMS Notifications</label>
                      <p className="text-sm text-gray-600">Send urgent notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={settings.enableSmsNotifications}
                      onChange={(e) => handleSettingChange('enableSmsNotifications', e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Push Notifications</label>
                      <p className="text-sm text-gray-600">Browser and mobile push notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={settings.enablePushNotifications}
                      onChange={(e) => handleSettingChange('enablePushNotifications', e.target.checked)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Notification Frequency</label>
                  <select
                    className="form-input"
                    value={settings.notificationFrequency}
                    onChange={(e) => handleSettingChange('notificationFrequency', e.target.value)}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="hourly">Hourly Digest</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="15"
                      max="480"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Password Minimum Length</label>
                    <input
                      type="number"
                      className="form-input"
                      min="6"
                      max="20"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Allowed Login Attempts</label>
                    <input
                      type="number"
                      className="form-input"
                      min="3"
                      max="10"
                      value={settings.allowedLoginAttempts}
                      onChange={(e) => handleSettingChange('allowedLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Lockout Duration (minutes)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="5"
                      max="120"
                      value={settings.lockoutDuration}
                      onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-900">Require Two-Factor Authentication</label>
                    <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.requireTwoFactor}
                    onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {/* Financial Settings */}
            {activeTab === 'financial' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Financial Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Invoice Payment Terms (days)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="7"
                      max="60"
                      value={settings.invoiceTerms}
                      onChange={(e) => handleSettingChange('invoiceTerms', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Late Payment Fee (AUD)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      step="0.01"
                      value={settings.latePaymentFee}
                      onChange={(e) => handleSettingChange('latePaymentFee', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">GST Rate (%)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      max="20"
                      step="0.1"
                      value={settings.gstRate}
                      onChange={(e) => handleSettingChange('gstRate', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="form-label">Payment Grace Period (days)</label>
                    <input
                      type="number"
                      className="form-input"
                      min="0"
                      max="30"
                      value={settings.paymentGracePeriod}
                      onChange={(e) => handleSettingChange('paymentGracePeriod', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-900">Auto-Generate Invoices</label>
                    <p className="text-sm text-gray-600">Automatically create invoices when timesheets are approved</p>
                  </div>
                  <input
                    type="checkbox"
                    className="toggle"
                    checked={settings.autoGenerateInvoices}
                    onChange={(e) => handleSettingChange('autoGenerateInvoices', e.target.checked)}
                  />
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">System Configuration</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Log Level</label>
                    <select
                      className="form-input"
                      value={settings.logLevel}
                      onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                    >
                      <option value="error">Error</option>
                      <option value="warn">Warning</option>
                      <option value="info">Info</option>
                      <option value="debug">Debug</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Backup Frequency</label>
                    <select
                      className="form-input"
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Data Retention Period (days)</label>
                  <input
                    type="number"
                    className="form-input"
                    min="365"
                    max="3650"
                    value={settings.dataRetentionPeriod}
                    onChange={(e) => handleSettingChange('dataRetentionPeriod', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    NDIS requires 7 years (2555 days) minimum retention
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Maintenance Mode</label>
                      <p className="text-sm text-gray-600">Temporarily disable user access for maintenance</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-900">Debug Mode</label>
                      <p className="text-sm text-gray-600">Enable detailed logging for troubleshooting</p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle"
                      checked={settings.debugMode}
                      onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                    />
                  </div>
                </div>

                {settings.maintenanceMode && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle size={20} className="text-orange-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-900">Maintenance Mode Active</p>
                        <p className="text-sm text-orange-800 mt-1">
                          The platform is currently in maintenance mode. Only admin users can access the system.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
          </div>
          <div className="content-card-body">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <CheckCircle size={32} className="mx-auto text-green-600 mb-3" />
                <div className="text-lg font-bold text-green-600">Operational</div>
                <div className="text-sm text-green-700">All systems running</div>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Database size={32} className="mx-auto text-blue-600 mb-3" />
                <div className="text-lg font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-blue-700">Uptime (30 days)</div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Clock size={32} className="mx-auto text-purple-600 mb-3" />
                <div className="text-lg font-bold text-purple-600">2.3s</div>
                <div className="text-sm text-purple-700">Avg Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;