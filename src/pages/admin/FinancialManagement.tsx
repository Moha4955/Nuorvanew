import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  DollarSign, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Eye,
  Download,
  Send,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart3,
  X
} from 'lucide-react';

const FinancialManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const invoices = [
    {
      id: 'INV-2025-001',
      invoiceNumber: 'NUR-001-2025',
      participant: {
        name: 'Sarah Johnson',
        ndisNumber: '43000000001',
        planManager: 'Melbourne Plan Management',
        planManagerEmail: 'billing@melbournepm.com.au'
      },
      worker: {
        name: 'Michael Thompson',
        abn: '12 345 678 901'
      },
      service: 'Daily Living Support',
      serviceDate: '2025-01-15',
      duration: 4,
      lineItems: [
        {
          description: 'Daily Living Support',
          serviceCode: 'DLS001',
          quantity: 4,
          unitRate: 45.50,
          totalAmount: 182.00,
          gstApplicable: true
        }
      ],
      subtotal: 182.00,
      gstAmount: 18.20,
      totalAmount: 200.20,
      status: 'paid',
      issueDate: '2025-01-15',
      dueDate: '2025-01-29',
      paidDate: '2025-01-16',
      paymentMethod: 'NDIS Plan Funds',
      paymentReference: 'NDIS-PAY-001-2025',
      schadsDetails: {
        classification: 'Social and Community Services Level 3',
        baseRate: 45.50,
        penalties: [],
        allowances: []
      }
    },
    {
      id: 'INV-2025-002',
      invoiceNumber: 'NUR-002-2025',
      participant: {
        name: 'Robert Smith',
        ndisNumber: '43000000002',
        planManager: 'Self Managed',
        planManagerEmail: 'robert.smith@email.com'
      },
      worker: {
        name: 'Emma Chen',
        abn: '77 888 999 000'
      },
      service: 'Community Access Support',
      serviceDate: '2025-01-14',
      duration: 3,
      lineItems: [
        {
          description: 'Community Access Support',
          serviceCode: 'CAS001',
          quantity: 3,
          unitRate: 44.75,
          totalAmount: 134.25,
          gstApplicable: true
        },
        {
          description: 'Travel Allowance',
          serviceCode: 'TRV001',
          quantity: 1,
          unitRate: 12.50,
          totalAmount: 12.50,
          gstApplicable: false
        }
      ],
      subtotal: 146.75,
      gstAmount: 13.43,
      totalAmount: 160.18,
      status: 'pending',
      issueDate: '2025-01-14',
      dueDate: '2025-01-28',
      paymentMethod: 'Self Managed',
      schadsDetails: {
        classification: 'Social and Community Services Level 2',
        baseRate: 44.75,
        penalties: [],
        allowances: [
          { type: 'travel', amount: 12.50, description: 'Travel allowance for community access' }
        ]
      }
    },
    {
      id: 'INV-2025-003',
      invoiceNumber: 'NUR-003-2025',
      participant: {
        name: 'Maria Garcia',
        ndisNumber: '43000000003',
        planManager: 'Community Care Plan Management',
        planManagerEmail: 'invoices@ccpm.com.au'
      },
      worker: {
        name: 'Sarah Davis',
        abn: '98 765 432 109'
      },
      service: 'Personal Care',
      serviceDate: '2025-01-13',
      duration: 2,
      lineItems: [
        {
          description: 'Personal Care Support',
          serviceCode: 'PCS001',
          quantity: 2,
          unitRate: 48.75,
          totalAmount: 97.50,
          gstApplicable: true
        }
      ],
      subtotal: 97.50,
      gstAmount: 9.75,
      totalAmount: 107.25,
      status: 'overdue',
      issueDate: '2025-01-13',
      dueDate: '2025-01-27',
      paymentMethod: 'Plan Manager',
      schadsDetails: {
        classification: 'Social and Community Services Level 4',
        baseRate: 48.75,
        penalties: [],
        allowances: []
      }
    }
  ];

  const financialSummary = {
    thisMonth: {
      totalRevenue: 15420.50,
      totalInvoices: 45,
      paidInvoices: 38,
      pendingAmount: 3250.75,
      overdueAmount: 1180.25,
      averageInvoiceValue: 342.68
    },
    lastMonth: {
      totalRevenue: 14250.00,
      totalInvoices: 42,
      paidInvoices: 42,
      pendingAmount: 0,
      overdueAmount: 0,
      averageInvoiceValue: 339.29
    },
    growth: {
      revenue: 8.2,
      invoices: 7.1,
      averageValue: 1.0
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'overdue':
        return 'badge-error';
      case 'disputed':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
      case 'disputed':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesSearch = invoice.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedInvoiceData = invoices.find(i => i.id === selectedInvoice);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
            <p className="text-gray-600 mt-2">Monitor invoicing, payments, and financial performance</p>
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
              <Download size={20} className="mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="text-green-600" />
              <div className="flex items-center text-sm">
                <TrendingUp size={14} className="mr-1 text-green-500" />
                {formatPercentage(financialSummary.growth.revenue)}
              </div>
            </div>
            <div className="metric-value text-green-600">{formatCurrency(financialSummary.thisMonth.totalRevenue)}</div>
            <div className="metric-label">Total Revenue</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <FileText size={24} className="text-blue-600" />
              <div className="flex items-center text-sm">
                <TrendingUp size={14} className="mr-1 text-green-500" />
                {formatPercentage(financialSummary.growth.invoices)}
              </div>
            </div>
            <div className="metric-value text-blue-600">{financialSummary.thisMonth.totalInvoices}</div>
            <div className="metric-label">Total Invoices</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Outstanding</span>
            </div>
            <div className="metric-value text-orange-600">{formatCurrency(financialSummary.thisMonth.pendingAmount)}</div>
            <div className="metric-label">Pending</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-red-600" />
              <span className="text-sm text-gray-500">Overdue</span>
            </div>
            <div className="metric-value text-red-600">{formatCurrency(financialSummary.thisMonth.overdueAmount)}</div>
            <div className="metric-label">Overdue</div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="content-card">
          <div className="content-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Financial Performance</h3>
          </div>
          <div className="content-card-body">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <BarChart3 size={32} className="mx-auto text-green-600 mb-3" />
                <div className="text-2xl font-bold text-green-600 mb-1">{formatCurrency(financialSummary.thisMonth.averageInvoiceValue)}</div>
                <div className="text-sm text-green-700">Average Invoice Value</div>
                <div className="text-xs text-green-600 mt-1">
                  {formatPercentage(financialSummary.growth.averageValue)} vs last month
                </div>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <CheckCircle size={32} className="mx-auto text-blue-600 mb-3" />
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {Math.round((financialSummary.thisMonth.paidInvoices / financialSummary.thisMonth.totalInvoices) * 100)}%
                </div>
                <div className="text-sm text-blue-700">Payment Rate</div>
                <div className="text-xs text-blue-600 mt-1">
                  {financialSummary.thisMonth.paidInvoices} of {financialSummary.thisMonth.totalInvoices} paid
                </div>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <TrendingUp size={32} className="mx-auto text-purple-600 mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-1">{formatPercentage(financialSummary.growth.revenue)}</div>
                <div className="text-sm text-purple-700">Revenue Growth</div>
                <div className="text-xs text-purple-600 mt-1">Month over month</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="content-card">
          <div className="content-card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="form-input pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Filter size={20} className="text-gray-400 mr-2" />
                  <select
                    className="form-input"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices List */}
        <div className="space-y-6">
          {filteredInvoices.map((invoice) => {
            const StatusIcon = getStatusIcon(invoice.status);
            return (
              <div key={invoice.id} className="content-card hover-lift">
                <div className="content-card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{invoice.service}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getStatusColor(invoice.status)} flex items-center`}>
                            <StatusIcon size={14} className="mr-1" />
                            {invoice.status}
                          </span>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</div>
                            <div className="text-sm text-gray-500">Inc. GST</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Participant & Worker Info */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <h4 className="font-medium text-blue-900 mb-2">Participant</h4>
                          <p className="text-sm text-blue-800 mb-1">{invoice.participant.name}</p>
                          <p className="text-sm text-blue-700">NDIS: {invoice.participant.ndisNumber}</p>
                          <p className="text-sm text-blue-700">Plan Manager: {invoice.participant.planManager}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <h4 className="font-medium text-green-900 mb-2">Support Worker</h4>
                          <p className="text-sm text-green-800 mb-1">{invoice.worker.name}</p>
                          <p className="text-sm text-green-700">ABN: {invoice.worker.abn}</p>
                          <p className="text-sm text-green-700">Service Date: {invoice.serviceDate}</p>
                        </div>
                      </div>
                      
                      {/* Line Items */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Invoice Details</h4>
                        {invoice.lineItems.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.description}</p>
                              <p className="text-xs text-gray-600">
                                {item.quantity}h × {formatCurrency(item.unitRate)} 
                                {item.gstApplicable ? ' (+ GST)' : ' (GST-free)'}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(item.totalAmount)}
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-gray-300 pt-3 mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(invoice.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>GST (10%):</span>
                            <span>{formatCurrency(invoice.gstAmount)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-300">
                            <span>Total:</span>
                            <span>{formatCurrency(invoice.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment Status */}
                      {invoice.status === 'paid' && invoice.paidDate && (
                        <div className="bg-green-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-800">
                            <strong>Paid:</strong> {invoice.paidDate} via {invoice.paymentMethod}
                            {invoice.paymentReference && ` (Ref: ${invoice.paymentReference})`}
                          </p>
                        </div>
                      )}
                      
                      {invoice.status === 'overdue' && (
                        <div className="bg-red-50 rounded-lg p-3 mb-4">
                          <p className="text-sm text-red-800">
                            <strong>Overdue:</strong> Due date was {invoice.dueDate}. Follow up with plan manager required.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Invoice: {invoice.invoiceNumber} • Due: {invoice.dueDate}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setSelectedInvoice(invoice.id)}
                        className="btn-secondary text-sm flex items-center"
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </button>
                      <button className="btn-secondary text-sm flex items-center">
                        <Download size={16} className="mr-2" />
                        Download
                      </button>
                      {invoice.status === 'pending' && (
                        <button className="btn-primary text-sm flex items-center">
                          <Send size={16} className="mr-2" />
                          Send Reminder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invoice Details Modal */}
        {selectedInvoice && selectedInvoiceData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
                  <p className="text-gray-600">{selectedInvoiceData.invoiceNumber}</p>
                </div>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Invoice Header */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-4">Billing Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-800">Participant:</span>
                        <span className="font-medium text-blue-900">{selectedInvoiceData.participant.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">NDIS Number:</span>
                        <span className="font-medium text-blue-900">{selectedInvoiceData.participant.ndisNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Plan Manager:</span>
                        <span className="font-medium text-blue-900">{selectedInvoiceData.participant.planManager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Email:</span>
                        <span className="font-medium text-blue-900">{selectedInvoiceData.participant.planManagerEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="font-semibold text-green-900 mb-4">Service Provider</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-800">Worker:</span>
                        <span className="font-medium text-green-900">{selectedInvoiceData.worker.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">ABN:</span>
                        <span className="font-medium text-green-900">{selectedInvoiceData.worker.abn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">Service:</span>
                        <span className="font-medium text-green-900">{selectedInvoiceData.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">Date:</span>
                        <span className="font-medium text-green-900">{selectedInvoiceData.serviceDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SCHADS Award Details */}
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="font-semibold text-indigo-900 mb-4">SCHADS Award Breakdown</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-indigo-800 mb-1">
                        <strong>Classification:</strong> {selectedInvoiceData.schadsDetails.classification}
                      </p>
                      <p className="text-indigo-800 mb-1">
                        <strong>Base Rate:</strong> {formatCurrency(selectedInvoiceData.schadsDetails.baseRate)}/hour
                      </p>
                      <p className="text-indigo-800">
                        <strong>Duration:</strong> {selectedInvoiceData.duration} hours
                      </p>
                    </div>
                    <div>
                      {selectedInvoiceData.schadsDetails.penalties.length > 0 && (
                        <div className="mb-2">
                          <p className="text-indigo-800 font-medium">Penalties Applied:</p>
                          {selectedInvoiceData.schadsDetails.penalties.map((penalty, index) => (
                            <p key={index} className="text-indigo-700 text-xs">
                              {penalty.type}: +{formatCurrency(penalty.amount)}
                            </p>
                          ))}
                        </div>
                      )}
                      {selectedInvoiceData.schadsDetails.allowances.length > 0 && (
                        <div>
                          <p className="text-indigo-800 font-medium">Allowances:</p>
                          {selectedInvoiceData.schadsDetails.allowances.map((allowance, index) => (
                            <p key={index} className="text-indigo-700 text-xs">
                              {allowance.description}: +{formatCurrency(allowance.amount)}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-secondary flex items-center">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </button>
                <button className="btn-primary flex items-center">
                  <Send size={16} className="mr-2" />
                  Send to Plan Manager
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Invoices will appear here as services are completed and timesheets approved'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FinancialManagement;