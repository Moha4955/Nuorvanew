import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  Calendar, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Eye,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  User,
  Star,
  X,
  Users
} from 'lucide-react';

const ServiceManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedServiceForAssign, setSelectedServiceForAssign] = useState<string | null>(null);

  const serviceRequests = [
    {
      id: 'SR-001',
      participant: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        ndisNumber: '43000000001',
        riskLevel: 'low'
      },
      title: 'Daily Living Support',
      description: 'Assistance with meal preparation, light housekeeping, and medication reminders',
      category: 'Core Supports - Daily Activities',
      urgency: 'medium',
      preferredDate: '2025-01-20',
      preferredTime: '10:00 AM - 2:00 PM',
      duration: 4,
      location: 'Participant Home',
      address: '123 Collins Street, Melbourne VIC 3000',
      status: 'assigned',
      assignedWorker: {
        id: 'W-001',
        name: 'Michael Thompson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        rating: 4.8,
        specializations: ['Daily Living', 'Meal Prep', 'Medication Management']
      },
      estimatedCost: 180.00,
      createdAt: '2025-01-15',
      assignedAt: '2025-01-15 14:30',
      assignedBy: 'Admin Team',
      requirements: ['Meal preparation', 'Light housekeeping', 'Medication reminder'],
      adminNotes: 'Matched based on experience with meal preparation and medication management'
    },
    {
      id: 'SR-002',
      participant: {
        name: 'Robert Smith',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        ndisNumber: '43000000002',
        riskLevel: 'medium'
      },
      title: 'Community Access Support',
      description: 'Support for grocery shopping and attending medical appointments',
      category: 'Capacity Building - Community Participation',
      urgency: 'high',
      preferredDate: '2025-01-18',
      preferredTime: '9:00 AM - 12:00 PM',
      duration: 3,
      location: 'Community',
      address: 'Westfield Shopping Centre, Doncaster',
      status: 'under_review',
      estimatedCost: 135.00,
      createdAt: '2025-01-16',
      requirements: ['Transport assistance', 'Shopping support', 'Medical appointment'],
      adminNotes: 'Reviewing available workers with transport capabilities and autism experience'
    },
    {
      id: 'SR-003',
      participant: {
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        ndisNumber: '43000000003',
        riskLevel: 'high'
      },
      title: 'Personal Care Assistance',
      description: 'Morning personal care routine and mobility assistance',
      category: 'Core Supports - Personal Care',
      urgency: 'high',
      preferredDate: '2025-01-19',
      preferredTime: '8:00 AM - 10:00 AM',
      duration: 2,
      location: 'Participant Home',
      address: '456 High Street, Preston VIC 3072',
      status: 'submitted',
      estimatedCost: 95.00,
      createdAt: '2025-01-16',
      requirements: ['Personal hygiene', 'Mobility assistance', 'Dignity and respect'],
      adminNotes: 'Requires specialized personal care qualifications and wheelchair transfer experience'
    }
  ];

  const availableWorkers = [
    {
      id: 'W-001',
      name: 'Michael Thompson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      rating: 4.8,
      location: 'Richmond, VIC',
      distance: '2.3 km',
      specializations: ['Daily Living', 'Meal Prep', 'Medication Management'],
      availability: 'Available',
      hourlyRate: 45.50,
      complianceStatus: 'compliant',
      matchScore: 95
    },
    {
      id: 'W-002',
      name: 'Emma Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      rating: 4.9,
      location: 'Ballarat, VIC',
      distance: '8.7 km',
      specializations: ['Community Access', 'Employment Support', 'Life Skills'],
      availability: 'Available',
      hourlyRate: 44.75,
      complianceStatus: 'compliant',
      matchScore: 88
    },
    {
      id: 'W-003',
      name: 'Sarah Davis',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      rating: 4.6,
      location: 'Melbourne, VIC',
      distance: '5.1 km',
      specializations: ['Personal Care', 'Daily Living', 'Capacity Building'],
      availability: 'Limited',
      hourlyRate: 42.00,
      complianceStatus: 'pending',
      matchScore: 72
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'badge-success';
      case 'confirmed':
        return 'badge-success';
      case 'under_review':
        return 'badge-warning';
      case 'submitted':
        return 'badge-pending';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
      case 'confirmed':
      case 'completed':
        return CheckCircle;
      case 'under_review':
      case 'submitted':
        return Clock;
      case 'cancelled':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const handleAssignWorker = (serviceId: string, workerId: string) => {
    console.log('Assigning worker', workerId, 'to service', serviceId);
    setShowAssignModal(false);
    setSelectedServiceForAssign(null);
  };

  const filteredServices = serviceRequests.filter(service => {
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.participant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const selectedServiceData = serviceRequests.find(s => s.id === selectedService);
  const serviceForAssign = serviceRequests.find(s => s.id === selectedServiceForAssign);

  const totalServices = serviceRequests.length;
  const assignedServices = serviceRequests.filter(s => s.status === 'assigned' || s.status === 'confirmed').length;
  const pendingServices = serviceRequests.filter(s => s.status === 'submitted' || s.status === 'under_review').length;
  const totalValue = serviceRequests.reduce((sum, s) => sum + s.estimatedCost, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
            <p className="text-gray-600 mt-2">Review and assign service requests to qualified workers</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Calendar size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="metric-value text-blue-600">{totalServices}</div>
            <div className="metric-label">Service Requests</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <div className="metric-value text-green-600">{assignedServices}</div>
            <div className="metric-label">Assigned</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Review</span>
            </div>
            <div className="metric-value text-orange-600">{pendingServices}</div>
            <div className="metric-label">Pending</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Value</span>
            </div>
            <div className="metric-value text-purple-600">{formatCurrency(totalValue)}</div>
            <div className="metric-label">Total Value</div>
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
                    placeholder="Search service requests..."
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
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="assigned">Assigned</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Requests List */}
        <div className="space-y-6">
          {filteredServices.map((service) => {
            const StatusIcon = getStatusIcon(service.status);
            return (
              <div key={service.id} className="content-card hover-lift">
                <div className="content-card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getUrgencyColor(service.urgency)}`}>
                            {service.urgency} priority
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskLevelColor(service.participant.riskLevel)}`}>
                            {service.participant.riskLevel} risk
                          </span>
                          <span className={`badge ${getStatusColor(service.status)} flex items-center`}>
                            <StatusIcon size={14} className="mr-1" />
                            {service.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Participant Info */}
                      <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={service.participant.avatar} 
                          alt={service.participant.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{service.participant.name}</p>
                          <p className="text-sm text-gray-600">NDIS: {service.participant.ndisNumber}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      
                      {/* Service Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-blue-500" />
                          {service.preferredDate}
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-green-500" />
                          {service.preferredTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-purple-500" />
                          {service.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-orange-500" />
                          {formatCurrency(service.estimatedCost)}
                        </div>
                      </div>
                      
                      {/* Requirements */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {service.requirements.map((req, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Assigned Worker */}
                      {service.assignedWorker && (
                        <div className="bg-green-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={service.assignedWorker.avatar} 
                                alt={service.assignedWorker.name}
                                className="w-10 h-10 rounded-full mr-3"
                              />
                              <div>
                                <p className="font-medium text-green-900">{service.assignedWorker.name}</p>
                                <div className="flex items-center">
                                  <Star size={14} className="text-yellow-400 mr-1" />
                                  <span className="text-sm text-green-700">{service.assignedWorker.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right text-sm text-green-700">
                              <p>Assigned: {service.assignedAt}</p>
                              <p>By: {service.assignedBy}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Admin Notes */}
                      {service.adminNotes && (
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="text-sm text-indigo-800">
                            <strong>Admin Notes:</strong> {service.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Created: {service.createdAt} • ID: {service.id}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setSelectedService(service.id)}
                        className="btn-secondary text-sm flex items-center"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </button>
                      {(service.status === 'submitted' || service.status === 'under_review') && (
                        <button 
                          onClick={() => {
                            setSelectedServiceForAssign(service.id);
                            setShowAssignModal(true);
                          }}
                          className="btn-primary text-sm flex items-center"
                        >
                          <UserCheck size={16} className="mr-2" />
                          Assign Worker
                        </button>
                      )}
                      {service.assignedWorker && (
                        <button className="btn-secondary text-sm flex items-center">
                          <Phone size={16} className="mr-2" />
                          Contact Worker
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assign Worker Modal */}
        {showAssignModal && serviceForAssign && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Assign Worker</h2>
                  <p className="text-gray-600">Select the best worker for: {serviceForAssign.title}</p>
                </div>
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {availableWorkers.map((worker) => (
                    <div key={worker.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 cursor-pointer transition-colors">
                      <div className="flex items-center mb-4">
                        <img 
                          src={worker.avatar} 
                          alt={worker.name}
                          className="w-12 h-12 rounded-full mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{worker.name}</h4>
                          <div className="flex items-center">
                            <Star size={14} className="text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-600">{worker.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span>{worker.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span>{worker.distance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rate:</span>
                          <span>{formatCurrency(worker.hourlyRate)}/hr</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className={worker.availability === 'Available' ? 'text-green-600' : 'text-orange-600'}>
                            {worker.availability}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Specializations:</p>
                        <div className="flex flex-wrap gap-1">
                          {worker.specializations.map((spec, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-600">Match Score:</span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${worker.matchScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-green-600">{worker.matchScore}%</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleAssignWorker(serviceForAssign.id, worker.id)}
                        disabled={worker.complianceStatus !== 'compliant'}
                        className="w-full btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {worker.complianceStatus === 'compliant' ? 'Assign Worker' : 'Non-Compliant'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Service Requests Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Service requests from participants will appear here for assignment'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServiceManagement;