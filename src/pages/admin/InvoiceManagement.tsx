import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PermissionGuard from '../../components/PermissionGuard';
import { 
  FileText, 
  Send, 
  Download, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Filter,
  Search,
  Bell,
  CreditCard,
  X
} from 'lucide-react';
import { PERMISSIONS } from '../../utils/permissions';

const InvoiceManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState('standard');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const invoices = [
    {
      id: 'INV-2025-001',
      invoiceNumber: 'NUR-001-2025',
      participant: {
        id: 'P-001',
        name: 'Sarah Johnson',
        ndisNumber: '43000000001',
        email: 'sarah.johnson@email.com',
        planManager: {
          name: 'Melbourne Plan Management',
          email: 'billing@melbournepm.com.au',
          phone: '03 9000 0000',
          contactPerson: 'Jennifer Smith'
        }
      },
      worker: {
        id: 'W-001',
        name: 'Michael Thompson',
        abn: '12 345 678 901',
        email: 'michael.thompson@email.com'
      },
      services: [
        {
          date: '2025-01-15',
          description: 'Daily Living Support',
          duration: 4,
          rate: 45.50,
          amount: 182.00,
          serviceCode: 'DLS001'
        }
      ],
      subtotal: 182.00,
      gstAmount: 18.20,
      totalAmount: 200.20,
      status: 'generated',
      issueDate: '2025-01-15',
      dueDate: '2025-01-29',
      generatedAt: '2025-01-15 16:00',
      generatedBy: 'Financial Admin',
      sentAt: null,
      sentBy: null,
      viewedAt: null,
      remindersSent: 0,
      lastReminderSent: null,
      paymentMethod: 'NDIS Plan Funds',
      ndisClaimNumber: 'NDIS-2025-001',
      downloadUrl: '/invoices/NUR-001-2025.pdf'
    },
    {
      id: 'INV-2025-002',
      invoiceNumber: 'NUR-002-2025',
      participant: {
        id: 'P-002',
        name: 'Robert Smith',
        ndisNumber: '43000000002',
        email: 'robert.smith@email.com',
        planManager: {
          name: 'Self Managed',
          email: 'robert.smith@email.com',
          phone: '0400 789 123',
          contactPerson: 'Robert Smith'
        }
      },
      worker: {
        id: 'W-002',
        name: 'Emma Chen',
        abn: '77 888 999 000',
        email: 'emma.chen@email.com'
      },
      services: [
        {
          date: '2025-01-14',
          description: 'Community Access Support',
          duration: 3,
          rate: 44.75,
          amount: 134.25,
          serviceCode: 'CAS001'
        }
      ],
      subtotal: 134.25,
      gstAmount: 13.43,
      totalAmount: 147.68,
      status: 'sent',
      issueDate: '2025-01-14',
      dueDate: '2025-01-28',
      generatedAt: '2025-01-14 17:30',
      generatedBy: 'Financial Admin',
      sentAt: '2025-01-14 18:00',
      sentBy: 'Financial Admin',
      viewedAt: '2025-01-15 09:30',
      remindersSent: 0,
      lastReminderSent: null,
      paymentMethod: 'Self Managed',
      ndisClaimNumber: 'NDIS-2025-002',
      downloadUrl: '/invoices/NUR-002-2025.pdf'
    },
    {
      id: 'INV-2025-003',
      invoiceNumber: 'NUR-003-2025',
      participant: {
        id: 'P-003',
        name: 'Maria Garcia',
        ndisNumber: '43000000003',
        email: 'maria.garcia@email.com',
        planManager: {
          name: 'Community Care Plan Management',
          email: 'invoices@ccpm.com.au',
          phone: '03 8000 0000',
          contactPerson: 'Lisa Rodriguez'
        }
      },
      worker: {
        id: 'W-003',
        name: 'Sarah Davis',
        abn: '98 765 432 109',
        email: 'sarah.davis@email.com'
      },
      services: [
        {
          date: '2025-01-13',
          description: 'Personal Care Support',
          duration: 2,
          rate: 48.75,
          amount: 97.50,
          serviceCode: 'PCS001'
        }
      ],
      subtotal: 97.50,
      gstAmount: 9.75,
      totalAmount: 107.25,
      status: 'overdue',
      issueDate: '2025-01-13',
      dueDate: '2025-01-27',
      generatedAt: '2025-01-13 15:00',
      generatedBy: 'Financial Admin',
      sentAt: '2025-01-13 16:00',
      sentBy: 'Financial Admin',
      viewedAt: '2025-01-14 10:00',
      remindersSent: 2,
      lastReminderSent: '2025-01-30',
      paymentMethod: 'Plan Manager',
      ndisClaimNumber: 'NDIS-2025-003',
      downloadUrl: '/invoices/NUR-003-2025.pdf'
    }
  ];

  const emailTemplates = {
    standard: {
      subject: 'NDIS Service Invoice - {invoiceNumber}',
      body: `Dear {planManagerName},

Please find attached the invoice for NDIS support services provided to {participantName}.

Invoice Details:
- Invoice Number: {invoiceNumber}
- Service Date: {serviceDate}
- Amount: {totalAmount}
- Due Date: {dueDate}

The invoice includes detailed breakdown of services provided in compliance with NDIS requirements.

Please process payment by the due date to avoid any service interruptions.

Best regards,
Nurova Australia Finance Team`
    },
    reminder: {
      subject: 'Payment Reminder - Invoice {invoiceNumber}',
      body: `Dear {planManagerName},

This is a friendly reminder that invoice {invoiceNumber} for {participantName} is due for payment.

Invoice Details:
- Amount Due: {totalAmount}
- Original Due Date: {dueDate}

Please process payment at your earliest convenience to avoid any service disruptions.

Best regards,
Nurova Australia Finance Team`
    },
    overdue: {
      subject: 'URGENT: Overdue Invoice {invoiceNumber}',
      body: `Dear {planManagerName},

Invoice {invoiceNumber} for {participantName} is now overdue and requires immediate attention.

Invoice Details:
- Amount Due: {totalAmount}
- Days Overdue: {daysOverdue}

Please contact us immediately to discuss payment arrangements.

Urgent Contact: finance@nurova.com.au | 1800 NUROVA

Best regards,
Nurova Australia Finance Team`
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'badge-success';
      case 'sent':
        return 'badge-pending';
      case 'generated':
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
      case 'sent':
        return Send;
      case 'generated':
        return Clock;
      case 'overdue':
      case 'disputed':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const handleSendInvoice = (invoiceId: string, template: string) => {
    console.log('Sending invoice:', invoiceId, 'with template:', template);
    setShowSendModal(false);
  };

  const handleRecordPayment = (invoiceId: string, amount: number, method: string) => {
    console.log('Recording payment:', invoiceId, amount, method);
    setShowPaymentModal(false);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesSearch = invoice.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedInvoiceData = invoices.find(i => i.id === selectedInvoice);

  const generatedInvoices = invoices.filter(i => i.status === 'generated').length;
  const sentInvoices = invoices.filter(i => i.status === 'sent').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const totalValue = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
            <p className="text-gray-600 mt-2">Send invoices to plan managers and track payments</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.EXPORT_FINANCIAL_DATA}>
            <button className="btn-secondary flex items-center">
              <Download size={20} className="mr-2" />
              Export Invoices
            </button>
          </PermissionGuard>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <FileText size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Ready</span>
            </div>
            <div className="metric-value text-blue-600">{generatedInvoices}</div>
            <div className="metric-label">To Send</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Send size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Sent</span>
            </div>
            <div className="metric-value text-green-600">{sentInvoices}</div>
            <div className="metric-label">Awaiting Payment</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-red-600" />
              <span className="text-sm text-gray-500">Overdue</span>
            </div>
            <div className="metric-value text-red-600">{overdueInvoices}</div>
            <div className="metric-label">Need Follow-up</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="metric-value text-purple-600">{formatCurrency(totalValue)}</div>
            <div className="metric-label">Invoice Value</div>
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
                    <option value="generated">Generated</option>
                    <option value="sent">Sent</option>
                    <option value="viewed">Viewed</option>
                    <option value="paid">Paid</option>
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
                        <h3 className="text-xl font-semibold text-gray-900">
                          Invoice {invoice.invoiceNumber}
                        </h3>
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
                      
                      {/* Participant and Plan Manager Info */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">Participant</h4>
                          <p className="text-sm text-blue-800 mb-1">{invoice.participant.name}</p>
                          <p className="text-sm text-blue-700">NDIS: {invoice.participant.ndisNumber}</p>
                          <p className="text-sm text-blue-700">{invoice.participant.email}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">Plan Manager</h4>
                          <p className="text-sm text-green-800 mb-1">{invoice.participant.planManager.name}</p>
                          <p className="text-sm text-green-700">Contact: {invoice.participant.planManager.contactPerson}</p>
                          <p className="text-sm text-green-700">{invoice.participant.planManager.email}</p>
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Services Provided</h4>
                        {invoice.services.map((service, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{service.description}</p>
                              <p className="text-xs text-gray-600">
                                {service.date} • {service.duration}h × {formatCurrency(service.rate)}/hr
                              </p>
                              <p className="text-xs text-gray-600">Worker: {invoice.worker.name}</p>
                              <p className="text-xs text-gray-600">Service Code: {service.serviceCode}</p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(service.amount)}
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
                            <span>Total Amount:</span>
                            <span>{formatCurrency(invoice.totalAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Invoice Timeline */}
                      <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-indigo-900 mb-3">Invoice Timeline</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-indigo-800">Generated:</span>
                            <span className="text-indigo-900">{invoice.generatedAt} by {invoice.generatedBy}</span>
                          </div>
                          {invoice.sentAt && (
                            <div className="flex justify-between">
                              <span className="text-indigo-800">Sent:</span>
                              <span className="text-indigo-900">{invoice.sentAt} by {invoice.sentBy}</span>
                            </div>
                          )}
                          {invoice.viewedAt && (
                            <div className="flex justify-between">
                              <span className="text-indigo-800">Viewed:</span>
                              <span className="text-indigo-900">{invoice.viewedAt}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-indigo-800">Due Date:</span>
                            <span className="text-indigo-900">{invoice.dueDate}</span>
                          </div>
                          {invoice.remindersSent > 0 && (
                            <div className="flex justify-between">
                              <span className="text-indigo-800">Reminders Sent:</span>
                              <span className="text-indigo-900">{invoice.remindersSent} (Last: {invoice.lastReminderSent})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Overdue Warning */}
                      {invoice.status === 'overdue' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <AlertTriangle size={20} className="text-red-600 mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Invoice Overdue</p>
                              <p className="text-sm text-red-800">
                                This invoice is past due and requires immediate follow-up with the plan manager.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      NDIS Claim: {invoice.ndisClaimNumber} • Due: {invoice.dueDate}
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
                        Download PDF
                      </button>
                      
                      <PermissionGuard permission={PERMISSIONS.SEND_INVOICES}>
                        {invoice.status === 'generated' && (
                          <button 
                            onClick={() => {
                              setSelectedInvoice(invoice.id);
                              setEmailTemplate('standard');
                              setShowSendModal(true);
                            }}
                            className="btn-primary text-sm flex items-center"
                          >
                            <Send size={16} className="mr-2" />
                            Send to Plan Manager
                          </button>
                        )}
                        
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <button 
                            onClick={() => {
                              setSelectedInvoice(invoice.id);
                              setEmailTemplate(invoice.status === 'overdue' ? 'overdue' : 'reminder');
                              setShowSendModal(true);
                            }}
                            className="btn-secondary text-sm flex items-center"
                          >
                            <Bell size={16} className="mr-2" />
                            Send Reminder
                          </button>
                        )}
                      </PermissionGuard>

                      <PermissionGuard permission={PERMISSIONS.RECORD_PAYMENTS}>
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <button 
                            onClick={() => {
                              setSelectedInvoice(invoice.id);
                              setShowPaymentModal(true);
                            }}
                            className="btn-success text-sm flex items-center"
                          >
                            <CreditCard size={16} className="mr-2" />
                            Record Payment
                          </button>
                        )}
                      </PermissionGuard>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Send Invoice Modal */}
        {showSendModal && selectedInvoiceData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Send Invoice</h2>
                  <p className="text-gray-600">{selectedInvoiceData.invoiceNumber} - {selectedInvoiceData.participant.name}</p>
                </div>
                <button 
                  onClick={() => setShowSendModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="form-label required">Email Template</label>
                    <select 
                      className="form-input"
                      value={emailTemplate}
                      onChange={(e) => setEmailTemplate(e.target.value)}
                    >
                      <option value="standard">Standard Invoice</option>
                      <option value="reminder">Payment Reminder</option>
                      <option value="overdue">Overdue Notice</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Recipient</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{selectedInvoiceData.participant.planManager.name}</p>
                          <p className="text-sm text-gray-600">{selectedInvoiceData.participant.planManager.contactPerson}</p>
                          <p className="text-sm text-gray-600">{selectedInvoiceData.participant.planManager.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg">
                            <Mail size={16} />
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg">
                            <Phone size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Email Subject</label>
                    <input 
                      type="text" 
                      className="form-input"
                      value={emailTemplates[emailTemplate as keyof typeof emailTemplates].subject.replace('{invoiceNumber}', selectedInvoiceData.invoiceNumber)}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="form-label">Email Body</label>
                    <textarea 
                      className="form-input"
                      rows={8}
                      value={emailTemplates[emailTemplate as keyof typeof emailTemplates].body
                        .replace('{planManagerName}', selectedInvoiceData.participant.planManager.contactPerson)
                        .replace('{participantName}', selectedInvoiceData.participant.name)
                        .replace('{invoiceNumber}', selectedInvoiceData.invoiceNumber)
                        .replace('{totalAmount}', formatCurrency(selectedInvoiceData.totalAmount))
                        .replace('{dueDate}', selectedInvoiceData.dueDate)
                        .replace('{serviceDate}', selectedInvoiceData.services[0].date)}
                      readOnly
                    />
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Email will include:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• PDF invoice attachment</li>
                      <li>• NDIS service breakdown</li>
                      <li>• Payment instructions</li>
                      <li>• Contact information for queries</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowSendModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSendInvoice(selectedInvoiceData.id, emailTemplate)}
                  className="btn-primary"
                >
                  <Send size={16} className="mr-2" />
                  Send Invoice
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Record Payment Modal */}
        {showPaymentModal && selectedInvoiceData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Record Payment</h2>
                <p className="text-gray-600">{selectedInvoiceData.invoiceNumber} - {formatCurrency(selectedInvoiceData.totalAmount)}</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="form-label required">Payment Amount</label>
                    <div className="relative">
                      <DollarSign size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input 
                        type="number" 
                        className="form-input pl-10"
                        defaultValue={selectedInvoiceData.totalAmount}
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label required">Payment Method</label>
                    <select className="form-input">
                      <option value="">Select payment method</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="ndis_portal">NDIS Portal</option>
                      <option value="cheque">Cheque</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Payment Reference</label>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Transaction ID or reference number"
                    />
                  </div>

                  <div>
                    <label className="form-label">Payment Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="form-label">Notes</label>
                    <textarea 
                      className="form-input"
                      rows={3}
                      placeholder="Any additional notes about this payment..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowPaymentModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleRecordPayment(selectedInvoiceData.id, selectedInvoiceData.totalAmount, 'bank_transfer')}
                  className="btn-success"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Invoices will appear here as timesheets are approved'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InvoiceManagement;