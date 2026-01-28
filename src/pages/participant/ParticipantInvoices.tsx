import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  FileText,
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { invoiceService } from '../../services/invoiceService';
import { participantService } from '../../services/participantService';
import toast from 'react-hot-toast';

const ParticipantInvoices: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [participant, setParticipant] = useState<any>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    loadInvoices();
  }, [user, filterStatus]);

  const loadInvoices = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const participantData = await participantService.getParticipantByUserId(user.id);
      setParticipant(participantData);

      if (participantData) {
        const filters: any = {};
        if (filterStatus !== 'all') {
          filters.status = filterStatus;
        }

        const result = await invoiceService.getParticipantInvoices(participantData.id, filters);
        setInvoices(result.data || []);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'badge-success';
      case 'approved':
        return 'badge-info';
      case 'sent':
      case 'viewed':
        return 'badge-warning';
      case 'overdue':
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
      case 'viewed':
      case 'approved':
        return Clock;
      case 'overdue':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.service_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaid = invoices.filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + Number(i.total_amount), 0);
  const totalPending = invoices.filter(i => ['sent', 'viewed', 'approved'].includes(i.status))
    .reduce((sum, i) => sum + Number(i.total_amount), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoices & Payments</h1>
            <p className="text-gray-600 mt-1">View and manage your service invoices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{invoices.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalPaid)}</p>
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
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{formatCurrency(totalPending)}</p>
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
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {invoices.filter(i => {
                      const date = new Date(i.issue_date);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="content-card-body">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="viewed">Viewed</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="content-card">
              <div className="content-card-body flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => {
              const StatusIcon = getStatusIcon(invoice.status);
              return (
                <div key={invoice.id} className="content-card hover:shadow-lg transition-all">
                  <div className="content-card-body">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            Invoice #{invoice.invoice_number}
                          </h3>
                          <span className={`badge ${getStatusColor(invoice.status)} flex items-center`}>
                            <StatusIcon size={14} className="mr-1" />
                            {invoice.status?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {invoice.service_type || 'Support Service'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(invoice.total_amount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {invoice.gst_included ? 'Inc. GST' : 'Ex. GST'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-2 text-blue-500" />
                        Issue: {formatDate(invoice.issue_date)}
                      </div>
                      {invoice.due_date && (
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-orange-500" />
                          Due: {formatDate(invoice.due_date)}
                        </div>
                      )}
                      {invoice.paid_date && (
                        <div className="flex items-center">
                          <CheckCircle size={16} className="mr-2 text-green-500" />
                          Paid: {formatDate(invoice.paid_date)}
                        </div>
                      )}
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-purple-500" />
                        {invoice.payment_method || 'NDIS Plan'}
                      </div>
                    </div>

                    {invoice.line_items && invoice.line_items.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
                        {invoice.line_items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm py-1">
                            <span className="text-gray-600">{item.description}</span>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedInvoice(invoice)}
                        className="btn-primary text-sm px-4 py-2 flex items-center"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </button>
                      <button className="btn-secondary text-sm px-4 py-2 flex items-center">
                        <Download size={16} className="mr-2" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="content-card">
              <div className="content-card-body text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus !== 'all'
                    ? 'No invoices match your filters'
                    : "You don't have any invoices yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Invoice #{selectedInvoice.invoice_number}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Issued: {formatDate(selectedInvoice.issue_date)}
                  </p>
                </div>
                <span className={`badge ${getStatusColor(selectedInvoice.status)} text-sm`}>
                  {selectedInvoice.status?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Details</h4>
                  <p className="text-sm text-gray-600">{selectedInvoice.service_type}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(selectedInvoice.service_date || selectedInvoice.issue_date)}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                  <p className="text-sm text-gray-600">
                    {selectedInvoice.payment_method || 'NDIS Plan'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Line Items</h4>
                <div className="space-y-2">
                  {selectedInvoice.line_items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.description}</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(selectedInvoice.subtotal_amount || selectedInvoice.total_amount)}
                    </span>
                  </div>
                  {selectedInvoice.gst_included && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GST (10%)</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency((selectedInvoice.total_amount || 0) * 0.1 / 1.1)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatCurrency(selectedInvoice.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="btn-primary flex-1 flex items-center justify-center">
                  <Download size={16} className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="btn-secondary flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParticipantInvoices;
