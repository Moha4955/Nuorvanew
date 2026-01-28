import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  Shield,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Calendar,
  Eye,
  RefreshCw,
  Bell,
  Award,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import { workerService } from '../../services/workerService';
import toast from 'react-hot-toast';

const WorkerCompliance: React.FC = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<any[]>([]);
  const [worker, setWorker] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    expiry_date: '',
    notes: ''
  });

  const REQUIRED_DOCUMENTS = [
    {
      id: 'ndis_worker_screening',
      name: 'NDIS Worker Screening',
      description: 'Background check required for all NDIS workers',
      category: 'compliance',
      required: true
    },
    {
      id: 'working_with_children_check',
      name: 'Working with Children Check',
      description: 'Victorian WWCC or equivalent state police check',
      category: 'compliance',
      required: true
    },
    {
      id: 'first_aid_certificate',
      name: 'First Aid Certification',
      description: 'Current First Aid certificate from recognized provider',
      category: 'certification',
      required: true
    },
    {
      id: 'ndis_orientation',
      name: 'NDIS Worker Orientation',
      description: 'Completion of NDIS Worker Orientation Module',
      category: 'training',
      required: true
    },
    {
      id: 'professional_indemnity',
      name: 'Professional Indemnity Insurance',
      description: 'Professional indemnity insurance coverage',
      category: 'insurance',
      required: false
    },
    {
      id: 'disability_qualification',
      name: 'Disability Support Qualification',
      description: 'Certificate IV in Disability Support or equivalent',
      category: 'qualification',
      required: true
    },
    {
      id: 'police_check',
      name: 'Police Check',
      description: 'National Police Check Certificate',
      category: 'compliance',
      required: true
    }
  ];

  useEffect(() => {
    loadCompliance();
  }, [user]);

  const loadCompliance = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const workerData = await workerService.getWorkerByUserId(user.id);

      if (workerData) {
        setWorker(workerData);
        const docs = await documentService.getWorkerDocuments(workerData.id);
        setDocuments(docs);
      }
    } catch (error) {
      console.error('Error loading compliance:', error);
      toast.error('Failed to load compliance documents');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'expires_soon':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'expired':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return CheckCircle;
      case 'expires_soon':
      case 'expired':
      case 'rejected':
        return AlertTriangle;
      case 'pending':
        return Clock;
      default:
        return FileText;
    }
  };

  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDocumentStatus = (doc: any): string => {
    if (!doc) return 'missing';
    if (doc.status === 'rejected') return 'rejected';
    if (doc.status === 'pending') return 'pending';
    if (doc.expiry_date) {
      const daysUntilExpiry = calculateDaysUntilExpiry(doc.expiry_date);
      if (daysUntilExpiry < 0) return 'expired';
      if (daysUntilExpiry <= 30) return 'expires_soon';
    }
    return doc.status || 'approved';
  };

  const complianceDocuments = REQUIRED_DOCUMENTS.map(reqDoc => {
    const uploadedDoc = documents.find(d =>
      d.document_type === reqDoc.id ||
      d.document_name?.toLowerCase().includes(reqDoc.name.toLowerCase())
    );

    const status = getDocumentStatus(uploadedDoc);
    const daysUntilExpiry = uploadedDoc?.expiry_date ? calculateDaysUntilExpiry(uploadedDoc.expiry_date) : null;

    return {
      ...reqDoc,
      uploadedDoc,
      status,
      daysUntilExpiry,
      expiryDate: uploadedDoc?.expiry_date || null,
      uploadedAt: uploadedDoc?.created_at || null,
      verifiedAt: uploadedDoc?.verified_at || null,
      verifiedBy: uploadedDoc?.verified_by || 'Admin Team'
    };
  });

  const getOverallComplianceStatus = () => {
    const requiredDocs = complianceDocuments.filter(doc => doc.required);
    const approvedRequired = requiredDocs.filter(doc =>
      ['approved', 'verified'].includes(doc.status)
    ).length;
    const expiringSoon = complianceDocuments.filter(doc =>
      doc.status === 'expires_soon'
    ).length;
    const expired = complianceDocuments.filter(doc =>
      doc.status === 'expired'
    ).length;

    if (expired > 0) {
      return { status: 'non_compliant', message: `${expired} document(s) expired - action required` };
    } else if (approvedRequired < requiredDocs.length) {
      return { status: 'non_compliant', message: `${requiredDocs.length - approvedRequired} required document(s) missing` };
    } else if (expiringSoon > 0) {
      return { status: 'expires_soon', message: `${expiringSoon} document(s) expiring soon` };
    } else {
      return { status: 'compliant', message: 'All compliance requirements met' };
    }
  };

  const overallStatus = getOverallComplianceStatus();
  const approvedDocs = complianceDocuments.filter(doc => ['approved', 'verified'].includes(doc.status)).length;
  const expiringDocs = complianceDocuments.filter(doc => doc.status === 'expires_soon').length;
  const pendingDocs = complianceDocuments.filter(doc => doc.status === 'pending').length;
  const expiredDocs = complianceDocuments.filter(doc => doc.status === 'expired').length;

  const handleUploadDocument = async () => {
    if (!worker || !selectedDocumentType) return;

    try {
      setUploading(true);

      const docType = REQUIRED_DOCUMENTS.find(d => d.id === selectedDocumentType);
      if (!docType) return;

      await documentService.createDocument({
        worker_id: worker.id,
        document_type: selectedDocumentType,
        document_name: docType.name,
        document_category: docType.category,
        expiry_date: formData.expiry_date || null,
        notes: formData.notes || null,
        status: 'pending',
        file_path: `documents/workers/${worker.id}/${selectedDocumentType}_${Date.now()}.pdf`
      });

      toast.success('Document uploaded successfully. Pending admin verification.');
      setShowUploadModal(false);
      setSelectedDocumentType('');
      setFormData({ expiry_date: '', notes: '' });
      await loadCompliance();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Compliance Status</h1>
            <p className="text-gray-600 mt-1">Manage your NDIS compliance documents and certifications</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center"
          >
            <Upload size={20} className="mr-2" />
            Upload Document
          </button>
        </div>

        <div className={`content-card ${
          overallStatus.status === 'compliant' ? 'border-l-4 border-l-green-500' :
          overallStatus.status === 'expires_soon' ? 'border-l-4 border-l-yellow-500' :
          'border-l-4 border-l-red-500'
        }`}>
          <div className="content-card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${
                  overallStatus.status === 'compliant' ? 'bg-green-100' :
                  overallStatus.status === 'expires_soon' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Shield size={32} className={`${
                    overallStatus.status === 'compliant' ? 'text-green-600' :
                    overallStatus.status === 'expires_soon' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {overallStatus.status === 'compliant' ? 'Fully Compliant' :
                     overallStatus.status === 'expires_soon' ? 'Documents Expiring Soon' : 'Action Required'}
                  </h2>
                  <p className="text-gray-600 mt-1">{overallStatus.message}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{approvedDocs}/{complianceDocuments.length}</div>
                <div className="text-sm text-gray-600">Documents Approved</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{approvedDocs}</p>
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
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{expiringDocs}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertTriangle size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{pendingDocs}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Clock size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{expiredDocs}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {complianceDocuments.map((document) => {
            const StatusIcon = getStatusIcon(document.status);
            const isExpiringSoon = document.daysUntilExpiry && document.daysUntilExpiry <= 30 && document.daysUntilExpiry > 0;
            const isExpired = document.daysUntilExpiry && document.daysUntilExpiry < 0;

            return (
              <div key={document.id} className="content-card hover:shadow-lg transition-all">
                <div className="content-card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                        {document.required && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                            Required
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {document.category}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{document.description}</p>

                      <div className={`inline-flex items-center px-3 py-2 rounded-lg border ${getStatusColor(document.status)}`}>
                        <StatusIcon size={16} className="mr-2" />
                        <span className="text-sm font-medium">
                          {document.status === 'expires_soon' ? 'Expires Soon' :
                           document.status === 'missing' ? 'Not Uploaded' :
                           document.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>

                      {document.uploadedDoc && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-4">
                          {document.uploadedAt && (
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-2 text-blue-500" />
                              Uploaded: {formatDate(document.uploadedAt)}
                            </div>
                          )}
                          {document.expiryDate && (
                            <div className="flex items-center">
                              <Clock size={14} className="mr-2 text-orange-500" />
                              Expires: {formatDate(document.expiryDate)}
                            </div>
                          )}
                          {document.verifiedAt && (
                            <div className="flex items-center">
                              <CheckCircle size={14} className="mr-2 text-green-500" />
                              Verified: {formatDate(document.verifiedAt)}
                            </div>
                          )}
                          {document.verifiedBy && (
                            <div className="flex items-center">
                              <Shield size={14} className="mr-2 text-purple-500" />
                              By: {document.verifiedBy}
                            </div>
                          )}
                        </div>
                      )}

                      {isExpiringSoon && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-900">Document Expiring Soon</p>
                              <p className="text-sm text-yellow-800">
                                This document expires in {document.daysUntilExpiry} days. Please upload a renewal to maintain compliance.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {isExpired && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Document Expired</p>
                              <p className="text-sm text-red-800">
                                This document expired {Math.abs(document.daysUntilExpiry)} days ago. Shift access may be restricted.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {document.status === 'missing' && document.required && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                          <div className="flex items-start gap-3">
                            <Upload size={20} className="text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-900">Required Document</p>
                              <p className="text-sm text-blue-800">
                                This document is required for NDIS compliance. Please upload it as soon as possible.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    {document.uploadedDoc && (
                      <>
                        <button className="btn-secondary text-sm flex items-center">
                          <Eye size={16} className="mr-2" />
                          View
                        </button>
                        <button className="btn-secondary text-sm flex items-center">
                          <Download size={16} className="mr-2" />
                          Download
                        </button>
                      </>
                    )}
                    {(['expires_soon', 'expired', 'missing'].includes(document.status)) && (
                      <button
                        onClick={() => {
                          setSelectedDocumentType(document.id);
                          setShowUploadModal(true);
                        }}
                        className="btn-primary text-sm flex items-center"
                      >
                        <Upload size={16} className="mr-2" />
                        {document.uploadedDoc ? 'Upload Renewal' : 'Upload Document'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="content-card">
          <div className="content-card-header">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Guidelines</h3>
          </div>
          <div className="content-card-body">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Document Requirements</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Upload clear, high-quality scans or photos
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Ensure all text is readable and dates are visible
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Submit documents at least 30 days before expiry
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Keep personal copies of all uploaded documents
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Renewal Reminders</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Bell size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    Email notifications sent 60, 30, and 7 days before expiry
                  </li>
                  <li className="flex items-start">
                    <Bell size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    Dashboard alerts appear 30 days before expiry
                  </li>
                  <li className="flex items-start">
                    <Bell size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    Shift access may be restricted for expired documents
                  </li>
                  <li className="flex items-start">
                    <Bell size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    Contact admin team if you need assistance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Upload Compliance Document</h2>
                  <p className="text-gray-600">Upload or renew your compliance documentation</p>
                </div>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedDocumentType('');
                    setFormData({ expiry_date: '', notes: '' });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="input"
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                  >
                    <option value="">Select document type</option>
                    {REQUIRED_DOCUMENTS.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} {doc.required ? '(Required)' : '(Optional)'}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDocumentType && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      {REQUIRED_DOCUMENTS.find(d => d.id === selectedDocumentType)?.name}
                    </h4>
                    <p className="text-sm text-blue-800">
                      {REQUIRED_DOCUMENTS.find(d => d.id === selectedDocumentType)?.description}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Upload <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                    <Upload size={32} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supported: PDF, JPG, PNG (Max 10MB)</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    <button type="button" className="btn-secondary">
                      Choose File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Any additional notes about this document..."
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Documents must be current and clearly readable</li>
                        <li>• Admin review typically takes 1-2 business days</li>
                        <li>• You'll receive email notification once verified</li>
                        <li>• Expired documents may restrict shift access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedDocumentType('');
                    setFormData({ expiry_date: '', notes: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadDocument}
                  disabled={!selectedDocumentType || uploading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkerCompliance;
