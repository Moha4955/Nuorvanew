import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Filter,
  Search,
  Folder,
  Calendar,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  File
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { documentService } from '../../services/documentService';
import { participantService } from '../../services/participantService';
import toast from 'react-hot-toast';

const ParticipantDocuments: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [participant, setParticipant] = useState<any>(null);

  const [uploadForm, setUploadForm] = useState({
    document_name: '',
    document_type: '',
    file: null as File | null,
    notes: ''
  });

  const categories = [
    { id: 'all', name: 'All Documents', icon: Folder },
    { id: 'ndis_plan', name: 'NDIS Plans', icon: Shield },
    { id: 'care_plan', name: 'Care Plans', icon: FileText },
    { id: 'medical', name: 'Medical', icon: AlertCircle },
    { id: 'service_agreement', name: 'Service Agreements', icon: CheckCircle },
    { id: 'assessment', name: 'Assessments', icon: FileText },
    { id: 'other', name: 'Other', icon: File }
  ];

  useEffect(() => {
    loadDocuments();
  }, [user, selectedCategory]);

  const loadDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const participantData = await participantService.getParticipantByUserId(user.id);
      setParticipant(participantData);

      if (participantData) {
        const filters: any = {};
        if (selectedCategory !== 'all') {
          filters.document_type = selectedCategory;
        }

        const docs = await documentService.getParticipantDocuments(participantData.id, filters);
        setDocuments(docs);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!participant || !uploadForm.file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);

      // Note: File upload to Supabase Storage would happen here
      // For now, we'll create the document record
      await documentService.createDocument({
        participant_id: participant.id,
        document_name: uploadForm.document_name,
        document_type: uploadForm.document_type,
        file_path: `documents/${participant.id}/${uploadForm.file.name}`,
        file_size: uploadForm.file.size,
        notes: uploadForm.notes
      });

      toast.success('Document uploaded successfully');
      setShowUploadModal(false);
      resetUploadForm();
      await loadDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentService.deleteDocument(documentId);
      toast.success('Document deleted successfully');
      await loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      document_name: '',
      document_type: '',
      file: null,
      notes: ''
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.document_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.document_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'ndis_plan':
        return Shield;
      case 'care_plan':
      case 'assessment':
        return FileText;
      case 'medical':
        return AlertCircle;
      case 'service_agreement':
        return CheckCircle;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
            <p className="text-gray-600 mt-1">Manage your NDIS documents and care plans</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center"
          >
            <Upload size={16} className="mr-2" />
            Upload Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{documents.length}</p>
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
                  <p className="text-sm text-gray-600">NDIS Plans</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {documents.filter(d => d.document_type === 'ndis_plan').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Care Plans</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {documents.filter(d => d.document_type === 'care_plan').length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {documents.filter(d => d.expiry_date && new Date(d.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <AlertCircle size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories & Search */}
        <div className="content-card">
          <div className="content-card-body">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {loading ? (
            <div className="content-card">
              <div className="content-card-body flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => {
              const Icon = getDocumentIcon(doc.document_type);
              const isExpiringSoon = doc.expiry_date &&
                new Date(doc.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

              return (
                <div key={doc.id} className="content-card hover:shadow-lg transition-all">
                  <div className="content-card-body">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        doc.document_type === 'ndis_plan' ? 'bg-green-100' :
                        doc.document_type === 'care_plan' ? 'bg-purple-100' :
                        doc.document_type === 'medical' ? 'bg-orange-100' :
                        'bg-blue-100'
                      }`}>
                        <Icon size={24} className={
                          doc.document_type === 'ndis_plan' ? 'text-green-600' :
                          doc.document_type === 'care_plan' ? 'text-purple-600' :
                          doc.document_type === 'medical' ? 'text-orange-600' :
                          'text-blue-600'
                        } />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{doc.document_name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{doc.notes}</p>
                          </div>
                          {isExpiringSoon && (
                            <span className="badge badge-warning flex items-center">
                              <AlertCircle size={14} className="mr-1" />
                              Expiring Soon
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-blue-500" />
                            {formatDate(doc.created_at)}
                          </div>
                          <div className="flex items-center">
                            <File size={16} className="mr-2 text-green-500" />
                            {formatFileSize(doc.file_size || 0)}
                          </div>
                          <div className="flex items-center">
                            <User size={16} className="mr-2 text-purple-500" />
                            {doc.uploaded_by || 'You'}
                          </div>
                          {doc.expiry_date && (
                            <div className="flex items-center">
                              <AlertCircle size={16} className="mr-2 text-orange-500" />
                              Expires: {formatDate(doc.expiry_date)}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button className="btn-primary text-sm px-4 py-2 flex items-center">
                            <Eye size={16} className="mr-2" />
                            View
                          </button>
                          <button className="btn-secondary text-sm px-4 py-2 flex items-center">
                            <Download size={16} className="mr-2" />
                            Download
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="btn-danger text-sm px-4 py-2 flex items-center"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="content-card">
              <div className="content-card-body text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No documents match your filters'
                    : "You haven't uploaded any documents yet"}
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Upload Your First Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Document</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={uploadForm.document_name}
                  onChange={(e) => setUploadForm({ ...uploadForm, document_name: e.target.value })}
                  className="input"
                  placeholder="e.g., NDIS Plan 2025"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={uploadForm.document_type}
                  onChange={(e) => setUploadForm({ ...uploadForm, document_type: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="ndis_plan">NDIS Plan</option>
                  <option value="care_plan">Care Plan</option>
                  <option value="medical">Medical Document</option>
                  <option value="service_agreement">Service Agreement</option>
                  <option value="assessment">Assessment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploadForm.file ? uploadForm.file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, JPG, PNG (max 10MB)
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                  rows={3}
                  className="input"
                  placeholder="Add any notes about this document..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="btn-secondary flex-1"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-2" />
                      Upload Document
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ParticipantDocuments;
