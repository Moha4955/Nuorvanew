import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Eye,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MapPin,
  Star,
  Shield,
  Award,
  DollarSign,
  Calendar,
  X
} from 'lucide-react';

const WorkerManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

  const workers = [
    {
      id: 'W-001',
      name: 'Michael Thompson',
      email: 'michael.thompson@email.com',
      phone: '0400 567 890',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '2025-01-15',
      location: 'Richmond, VIC',
      abn: '12 345 678 901',
      hourlyRate: 45.50,
      workingRadius: 15,
      serviceCategories: ['Daily Living', 'Community Access', 'Transport'],
      complianceStatus: 'compliant',
      performanceMetrics: {
        totalServices: 247,
        averageRating: 4.8,
        onTimePercentage: 96.2,
        cancellationRate: 2.1,
        monthlyEarnings: 4850.00
      },
      complianceDocuments: {
        ndisWorkerScreening: { status: 'approved', expiryDate: '2025-08-15' },
        wwccPoliceCheck: { status: 'approved', expiryDate: '2025-06-20' },
        firstAidCertification: { status: 'expires_soon', expiryDate: '2025-02-28' },
        professionalIndemnity: { status: 'approved', expiryDate: '2025-12-31' }
      }
    },
    {
      id: 'W-002',
      name: 'Sarah Davis',
      email: 'sarah.davis@email.com',
      phone: '0400 123 789',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'pending_approval',
      joinDate: '2025-01-10',
      lastActive: '2025-01-15',
      location: 'Melbourne, VIC',
      abn: '98 765 432 109',
      hourlyRate: 42.00,
      workingRadius: 20,
      serviceCategories: ['Personal Care', 'Daily Living', 'Capacity Building'],
      complianceStatus: 'pending',
      performanceMetrics: {
        totalServices: 0,
        averageRating: 0,
        onTimePercentage: 0,
        cancellationRate: 0,
        monthlyEarnings: 0
      },
      complianceDocuments: {
        ndisWorkerScreening: { status: 'pending', expiryDate: null },
        wwccPoliceCheck: { status: 'approved', expiryDate: '2025-09-15' },
        firstAidCertification: { status: 'approved', expiryDate: '2025-11-30' },
        professionalIndemnity: { status: 'pending', expiryDate: null }
      }
    },
    {
      id: 'W-003',
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      phone: '0400 987 654',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'suspended',
      joinDate: '2024-05-15',
      lastActive: '2025-01-10',
      location: 'Geelong, VIC',
      abn: '55 444 333 222',
      hourlyRate: 47.25,
      workingRadius: 25,
      serviceCategories: ['Behavior Support', 'Specialized Care'],
      complianceStatus: 'non_compliant',
      performanceMetrics: {
        totalServices: 89,
        averageRating: 4.2,
        onTimePercentage: 88.5,
        cancellationRate: 8.2,
        monthlyEarnings: 2150.00
      },
      complianceDocuments: {
        ndisWorkerScreening: { status: 'approved', expiryDate: '2025-05-15' },
        wwccPoliceCheck: { status: 'expired', expiryDate: '2024-12-20' },
        firstAidCertification: { status: 'approved', expiryDate: '2025-08-10' },
        professionalIndemnity: { status: 'expired', expiryDate: '2024-11-30' }
      },
      suspensionReason: 'Expired compliance documents - WWCC and Professional Indemnity'
    },
    {
      id: 'W-004',
      name: 'Emma Chen',
      email: 'emma.chen@email.com',
      phone: '0400 555 123',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'active',
      joinDate: '2024-08-10',
      lastActive: '2025-01-15',
      location: 'Ballarat, VIC',
      abn: '77 888 999 000',
      hourlyRate: 44.75,
      workingRadius: 30,
      serviceCategories: ['Community Access', 'Employment Support', 'Life Skills'],
      complianceStatus: 'compliant',
      performanceMetrics: {
        totalServices: 156,
        averageRating: 4.9,
        onTimePercentage: 98.1,
        cancellationRate: 1.3,
        monthlyEarnings: 3420.00
      },
      complianceDocuments: {
        ndisWorkerScreening: { status: 'approved', expiryDate: '2025-08-10' },
        wwccPoliceCheck: { status: 'approved', expiryDate: '2025-12-15' },
        firstAidCertification: { status: 'approved', expiryDate: '2025-09-20' },
        professionalIndemnity: { status: 'approved', expiryDate: '2025-08-10' }
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'pending_approval':
        return 'badge-warning';
      case 'suspended':
        return 'badge-error';
      case 'inactive':
        return 'badge-neutral';
      default:
        return 'badge-neutral';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-50';
      case 'non_compliant':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const handleApproveWorker = (workerId: string) => {
    console.log('Approving worker:', workerId);
    // Approval logic here
  };

  const handleSuspendWorker = (workerId: string) => {
    console.log('Suspending worker:', workerId);
    // Suspension logic here
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesStatus = filterStatus === 'all' || worker.status === filterStatus;
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedWorkerData = workers.find(w => w.id === selectedWorker);

  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const pendingWorkers = workers.filter(w => w.status === 'pending_approval').length;
  const suspendedWorkers = workers.filter(w => w.status === 'suspended').length;
  const totalEarnings = workers.reduce((sum, w) => sum + w.performanceMetrics.monthlyEarnings, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Worker Management</h1>
            <p className="text-gray-600 mt-2">Manage support worker applications and compliance</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Users size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <div className="metric-value text-blue-600">{activeWorkers}</div>
            <div className="metric-label">Active Workers</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Review</span>
            </div>
            <div className="metric-value text-orange-600">{pendingWorkers}</div>
            <div className="metric-label">Pending Approval</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-red-600" />
              <span className="text-sm text-gray-500">Issues</span>
            </div>
            <div className="metric-value text-red-600">{suspendedWorkers}</div>
            <div className="metric-label">Suspended</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Monthly</span>
            </div>
            <div className="metric-value text-green-600">{formatCurrency(totalEarnings)}</div>
            <div className="metric-label">Total Earnings</div>
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
                    placeholder="Search workers..."
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
                    <option value="active">Active</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workers List */}
        <div className="space-y-6">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="content-card hover-lift">
              <div className="content-card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <img 
                      src={worker.avatar} 
                      alt={worker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{worker.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getStatusColor(worker.status)}`}>
                            {worker.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getComplianceStatusColor(worker.complianceStatus)}`}>
                            {worker.complianceStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2 text-blue-500" />
                          {worker.email}
                        </div>
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2 text-green-500" />
                          {worker.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-purple-500" />
                          {worker.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-orange-500" />
                          {formatCurrency(worker.hourlyRate)}/hour
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-600">{worker.performanceMetrics.totalServices}</div>
                          <div className="text-xs text-blue-700">Services</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-600">{worker.performanceMetrics.averageRating}</div>
                          <div className="text-xs text-green-700">Rating</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-purple-600">{worker.performanceMetrics.onTimePercentage}%</div>
                          <div className="text-xs text-purple-700">On-Time</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-orange-600">{formatCurrency(worker.performanceMetrics.monthlyEarnings)}</div>
                          <div className="text-xs text-orange-700">Monthly</div>
                        </div>
                      </div>

                      {/* Service Categories */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Service Categories:</p>
                        <div className="flex flex-wrap gap-2">
                          {worker.serviceCategories.map((category, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Compliance Status */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Compliance Documents</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {Object.entries(worker.complianceDocuments).map(([key, doc]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                doc.status === 'expires_soon' ? 'bg-orange-100 text-orange-800' :
                                doc.status === 'expired' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {doc.status.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Suspension Reason */}
                      {worker.status === 'suspended' && worker.suspensionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                          <div className="flex items-start">
                            <AlertTriangle size={20} className="text-red-600 mr-3 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Suspension Reason</p>
                              <p className="text-sm text-red-800">{worker.suspensionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Joined: {worker.joinDate} • Last Active: {worker.lastActive} • ID: {worker.id}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setSelectedWorker(worker.id)}
                      className="btn-secondary text-sm flex items-center"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </button>
                    {worker.status === 'pending_approval' && (
                      <>
                        <button 
                          onClick={() => handleApproveWorker(worker.id)}
                          className="btn-success text-sm flex items-center"
                        >
                          <UserCheck size={16} className="mr-2" />
                          Approve
                        </button>
                        <button className="btn-secondary text-sm">
                          Request More Info
                        </button>
                      </>
                    )}
                    {worker.status === 'active' && (
                      <button 
                        onClick={() => handleSuspendWorker(worker.id)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center"
                      >
                        <UserX size={16} className="mr-2" />
                        Suspend
                      </button>
                    )}
                    {worker.status === 'suspended' && (
                      <button className="btn-success text-sm flex items-center">
                        <UserCheck size={16} className="mr-2" />
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Worker Details Modal */}
        {selectedWorker && selectedWorkerData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedWorkerData.name}</h2>
                  <p className="text-gray-600">Support Worker Profile</p>
                </div>
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Professional Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Professional Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ABN:</span>
                        <span className="font-medium">{selectedWorkerData.abn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-medium">{formatCurrency(selectedWorkerData.hourlyRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Working Radius:</span>
                        <span className="font-medium">{selectedWorkerData.workingRadius} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Join Date:</span>
                        <span className="font-medium">{selectedWorkerData.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Services:</span>
                        <span className="font-medium">{selectedWorkerData.performanceMetrics.totalServices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Rating:</span>
                        <span className="font-medium flex items-center">
                          <Star size={14} className="text-yellow-400 mr-1" />
                          {selectedWorkerData.performanceMetrics.averageRating}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">On-Time Rate:</span>
                        <span className="font-medium">{selectedWorkerData.performanceMetrics.onTimePercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cancellation Rate:</span>
                        <span className="font-medium">{selectedWorkerData.performanceMetrics.cancellationRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Details */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Compliance Status</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(selectedWorkerData.complianceDocuments).map(([key, doc]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          {doc.expiryDate && (
                            <p className="text-xs text-gray-600">Expires: {doc.expiryDate}</p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'expires_soon' ? 'bg-orange-100 text-orange-800' :
                          doc.status === 'expired' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Categories */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Service Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorkerData.serviceCategories.map((category, index) => (
                      <span key={index} className="text-sm px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                {selectedWorkerData.status === 'pending_approval' && (
                  <>
                    <button className="btn-secondary">
                      Request More Info
                    </button>
                    <button 
                      onClick={() => {
                        handleApproveWorker(selectedWorkerData.id);
                        setSelectedWorker(null);
                      }}
                      className="btn-success"
                    >
                      Approve Worker
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <>
          {/* Empty State */}
          {filteredWorkers.length === 0 && (
            <div className="content-card text-center">
              <div className="content-card-body py-12">
                <Users size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Workers Found</h3>
                <p className="text-gray-600">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Worker applications will appear here for review and approval'
                  }
                </p>
              </div>
            </div>
          )}
        </>
      </div>
    </DashboardLayout>
  );
};

export default WorkerManagement;