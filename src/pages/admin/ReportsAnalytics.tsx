import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const ReportsAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const analyticsData = {
    overview: {
      totalParticipants: 342,
      activeWorkers: 156,
      servicesCompleted: 1247,
      monthlyRevenue: 145820,
      averageRating: 4.7,
      complianceRate: 94.2,
      growth: {
        participants: 12.5,
        workers: 8.3,
        services: 22.1,
        revenue: 15.2
      }
    },
    serviceMetrics: {
      totalServices: 1247,
      completedServices: 1189,
      cancelledServices: 58,
      averageDuration: 3.2,
      averageRating: 4.7,
      onTimeRate: 94.8,
      categories: [
        { name: 'Daily Living Support', count: 456, percentage: 36.6 },
        { name: 'Community Access', count: 298, percentage: 23.9 },
        { name: 'Personal Care', count: 234, percentage: 18.8 },
        { name: 'Transport Support', count: 156, percentage: 12.5 },
        { name: 'Capacity Building', count: 103, percentage: 8.3 }
      ]
    },
    financialMetrics: {
      totalRevenue: 145820,
      workerPayments: 118650,
      platformFees: 27170,
      averageInvoiceValue: 342.68,
      paymentRate: 96.2,
      overdueAmount: 5420,
      monthlyGrowth: 15.2
    },
    complianceMetrics: {
      totalWorkers: 156,
      compliantWorkers: 147,
      nonCompliantWorkers: 9,
      expiringDocuments: 23,
      overdueDocuments: 5,
      complianceRate: 94.2,
      documentTypes: [
        { type: 'NDIS Worker Screening', compliant: 152, total: 156 },
        { type: 'WWCC/Police Check', compliant: 149, total: 156 },
        { type: 'First Aid Certification', compliant: 145, total: 156 },
        { type: 'Professional Indemnity', compliant: 134, total: 156 }
      ]
    }
  };

  const reportTypes = [
    { id: 'overview', name: 'Platform Overview', icon: BarChart3 },
    { id: 'services', name: 'Service Analytics', icon: Calendar },
    { id: 'financial', name: 'Financial Reports', icon: DollarSign },
    { id: 'compliance', name: 'Compliance Status', icon: CheckCircle },
    { id: 'performance', name: 'Performance Metrics', icon: Star }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <Users size={24} className="text-blue-600" />
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="mr-1 text-green-500" />
              {formatPercentage(analyticsData.overview.growth.participants)}
            </div>
          </div>
          <div className="metric-value text-blue-600">{analyticsData.overview.totalParticipants}</div>
          <div className="metric-label">Total Participants</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <Users size={24} className="text-green-600" />
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="mr-1 text-green-500" />
              {formatPercentage(analyticsData.overview.growth.workers)}
            </div>
          </div>
          <div className="metric-value text-green-600">{analyticsData.overview.activeWorkers}</div>
          <div className="metric-label">Active Workers</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <Calendar size={24} className="text-purple-600" />
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="mr-1 text-green-500" />
              {formatPercentage(analyticsData.overview.growth.services)}
            </div>
          </div>
          <div className="metric-value text-purple-600">{analyticsData.overview.servicesCompleted}</div>
          <div className="metric-label">Services Completed</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={24} className="text-orange-600" />
            <div className="flex items-center text-sm">
              <TrendingUp size={14} className="mr-1 text-green-500" />
              {formatPercentage(analyticsData.overview.growth.revenue)}
            </div>
          </div>
          <div className="metric-value text-orange-600">{formatCurrency(analyticsData.overview.monthlyRevenue)}</div>
          <div className="metric-label">Monthly Revenue</div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Quality Metrics</h3>
          </div>
          <div className="content-card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Service Rating</span>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-400 mr-1" />
                  <span className="font-bold text-gray-900">{analyticsData.overview.averageRating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Compliance Rate</span>
                <span className="font-bold text-green-600">{analyticsData.overview.complianceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                  style={{ width: `${analyticsData.overview.complianceRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="content-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Growth Trends</h3>
          </div>
          <div className="content-card-body">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Participant Growth</span>
                <span className="font-bold text-blue-600">{formatPercentage(analyticsData.overview.growth.participants)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Worker Growth</span>
                <span className="font-bold text-green-600">{formatPercentage(analyticsData.overview.growth.workers)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Service Growth</span>
                <span className="font-bold text-purple-600">{formatPercentage(analyticsData.overview.growth.services)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Revenue Growth</span>
                <span className="font-bold text-orange-600">{formatPercentage(analyticsData.overview.growth.revenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServiceReport = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="metric-value text-blue-600">{analyticsData.serviceMetrics.totalServices}</div>
          <div className="metric-label">Total Services</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-green-600">{analyticsData.serviceMetrics.onTimeRate}%</div>
          <div className="metric-label">On-Time Rate</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-purple-600">{analyticsData.serviceMetrics.averageDuration}h</div>
          <div className="metric-label">Average Duration</div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h3 className="text-lg font-semibold text-gray-900">Service Categories</h3>
        </div>
        <div className="content-card-body">
          <div className="space-y-4">
            {analyticsData.serviceMetrics.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{category.name}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16 text-right">
                    {category.count} ({category.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="metric-value text-green-600">{formatCurrency(analyticsData.financialMetrics.totalRevenue)}</div>
          <div className="metric-label">Total Revenue</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-blue-600">{formatCurrency(analyticsData.financialMetrics.workerPayments)}</div>
          <div className="metric-label">Worker Payments</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-purple-600">{formatCurrency(analyticsData.financialMetrics.platformFees)}</div>
          <div className="metric-label">Platform Fees</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-orange-600">{analyticsData.financialMetrics.paymentRate}%</div>
          <div className="metric-label">Payment Rate</div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h3 className="text-lg font-semibold text-gray-900">Financial Breakdown</h3>
        </div>
        <div className="content-card-body">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Invoice Value</span>
              <span className="font-bold text-gray-900">{formatCurrency(analyticsData.financialMetrics.averageInvoiceValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Overdue Amount</span>
              <span className="font-bold text-red-600">{formatCurrency(analyticsData.financialMetrics.overdueAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Monthly Growth</span>
              <span className="font-bold text-green-600">{formatPercentage(analyticsData.financialMetrics.monthlyGrowth)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplianceReport = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="metric-card">
          <div className="metric-value text-green-600">{analyticsData.complianceMetrics.compliantWorkers}</div>
          <div className="metric-label">Compliant Workers</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-red-600">{analyticsData.complianceMetrics.nonCompliantWorkers}</div>
          <div className="metric-label">Non-Compliant</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-orange-600">{analyticsData.complianceMetrics.expiringDocuments}</div>
          <div className="metric-label">Expiring Soon</div>
        </div>
      </div>

      <div className="content-card">
        <div className="content-card-header">
          <h3 className="text-lg font-semibold text-gray-900">Document Compliance</h3>
        </div>
        <div className="content-card-body">
          <div className="space-y-4">
            {analyticsData.complianceMetrics.documentTypes.map((docType, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{docType.type}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(docType.compliant / docType.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20 text-right">
                    {docType.compliant}/{docType.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-2">Platform performance insights and compliance reporting</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-input"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="btn-secondary flex items-center">
              <RefreshCw size={20} className="mr-2" />
              Refresh
            </button>
            <button className="btn-primary flex items-center">
              <Download size={20} className="mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="content-card">
          <div className="content-card-body">
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedReport === type.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <type.icon size={16} className="mr-2" />
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Content */}
        {selectedReport === 'overview' && renderOverviewReport()}
        {selectedReport === 'services' && renderServiceReport()}
        {selectedReport === 'financial' && renderFinancialReport()}
        {selectedReport === 'compliance' && renderComplianceReport()}
        {selectedReport === 'performance' && renderOverviewReport()}
      </div>
    </DashboardLayout>
  );
};

export default ReportsAnalytics;