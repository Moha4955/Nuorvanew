import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PermissionGuard from '../../components/PermissionGuard';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Phone,
  MessageCircle,
  Navigation,
  DollarSign,
  Filter,
  Search,
  Eye,
  UserCheck,
  Plus,
  Repeat,
  X,
  Save
} from 'lucide-react';
import { PERMISSIONS } from '../../utils/permissions';

const ShiftAssignment: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('pending_assignment');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [selectedWorkerForAssign, setSelectedWorkerForAssign] = useState<string | null>(null);

  const [recurringShiftData, setRecurringShiftData] = useState({
    type: 'weekly',
    interval: 1,
    daysOfWeek: [] as number[],
    endDate: '',
    endAfter: '',
    endType: 'date' // 'date' or 'occurrences'
  });

  const serviceRequests = [
    {
      id: 'SR-001',
      participant: {
        id: 'P-001',
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        ndisNumber: '43000000001',
        riskLevel: 'low',
        location: '123 Collins Street, Melbourne VIC 3000',
        preferences: ['Punctual', 'Friendly', 'Experienced with diabetes'],
        medicalNotes: 'Diabetes Type 2 - requires medication reminders'
      },
      title: 'Daily Living Support',
      description: 'Weekly assistance with meal preparation, light housekeeping, and medication reminders',
      category: 'Core Supports - Daily Activities',
      urgency: 'medium',
      preferredDate: '2025-01-20',
      preferredTime: '10:00 AM - 2:00 PM',
      duration: 4,
      location: 'Participant Home',
      status: 'pending_assignment',
      estimatedCost: 180.00,
      createdAt: '2025-01-15',
      requirements: ['Meal preparation', 'Light housekeeping', 'Medication reminder', 'Diabetes awareness'],
      riskLevel: 'low',
      isRecurring: true,
      recurringPattern: 'Every Monday for 6 months',
      adminNotes: 'Regular weekly session - participant prefers vegetarian meals and needs diabetes-aware support'
    },
    {
      id: 'SR-002',
      participant: {
        id: 'P-002',
        name: 'Robert Smith',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        ndisNumber: '43000000002',
        riskLevel: 'medium',
        location: 'Westfield Shopping Centre, Doncaster',
        preferences: ['Quiet environment', 'Structured routine', 'Autism experience'],
        medicalNotes: 'Autism Spectrum Disorder - prefers routine and clear communication'
      },
      title: 'Community Access Support',
      description: 'Bi-weekly support for grocery shopping and social skills development',
      category: 'Capacity Building - Community Participation',
      urgency: 'high',
      preferredDate: '2025-01-18',
      preferredTime: '9:00 AM - 12:00 PM',
      duration: 3,
      location: 'Community',
      status: 'pending_assignment',
      estimatedCost: 135.00,
      createdAt: '2025-01-16',
      requirements: ['Autism experience', 'Shopping assistance', 'Social skills support', 'Public transport'],
      riskLevel: 'medium',
      isRecurring: true,
      recurringPattern: 'Every 2 weeks for 3 months',
      adminNotes: 'Participant has autism - requires worker with ASD experience and patience'
    },
    {
      id: 'SR-003',
      participant: {
        id: 'P-003',
        name: 'Maria Garcia',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        ndisNumber: '43000000003',
        riskLevel: 'high',
        location: '456 High Street, Preston VIC 3072',
        preferences: ['Spanish speaking preferred', 'Patient approach', 'Cultural sensitivity'],
        medicalNotes: 'Mobility impairment - uses wheelchair, requires assistance with transfers'
      },
      title: 'Personal Care Assistance',
      description: 'Morning personal care routine and mobility assistance',
      category: 'Core Supports - Personal Care',
      urgency: 'high',
      preferredDate: '2025-01-19',
      preferredTime: '8:00 AM - 10:00 AM',
      duration: 2,
      location: 'Participant Home',
      status: 'pending_assignment',
      estimatedCost: 95.00,
      createdAt: '2025-01-16',
      requirements: ['Personal hygiene', 'Mobility assistance', 'Dignity and respect', 'Wheelchair transfers'],
      riskLevel: 'high',
      isRecurring: false,
      adminNotes: 'High-needs participant - requires specialized personal care qualifications and wheelchair transfer experience'
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
      specializations: ['Daily Living', 'Meal Prep', 'Medication Management', 'Diabetes Care'],
      qualifications: ['Certificate IV Disability Support', 'First Aid', 'Medication Administration'],
      availability: 'Available',
      hourlyRate: 45.50,
      schadsLevel: 3,
      complianceStatus: 'compliant',
      matchScore: 95,
      workingRadius: 15,
      languages: ['English'],
      experience: '5 years',
      performanceMetrics: {
        totalServices: 247,
        averageRating: 4.8,
        onTimePercentage: 96.2,
        cancellationRate: 2.1
      }
    },
    {
      id: 'W-002',
      name: 'Emma Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      rating: 4.9,
      location: 'Doncaster, VIC',
      distance: '1.8 km',
      specializations: ['Community Access', 'Autism Support', 'Social Skills', 'Public Transport'],
      qualifications: ['Certificate IV Disability Support', 'Autism Spectrum Disorder Training', 'First Aid'],
      availability: 'Available',
      hourlyRate: 44.75,
      schadsLevel: 2,
      complianceStatus: 'compliant',
      matchScore: 92,
      workingRadius: 20,
      languages: ['English', 'Mandarin'],
      experience: '3 years',
      performanceMetrics: {
        totalServices: 156,
        averageRating: 4.9,
        onTimePercentage: 98.1,
        cancellationRate: 1.3
      }
    },
    {
      id: 'W-003',
      name: 'Sarah Davis',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      rating: 4.6,
      location: 'Preston, VIC',
      distance: '0.8 km',
      specializations: ['Personal Care', 'Mobility Assistance', 'Wheelchair Transfers', 'High Needs Support'],
      qualifications: ['Certificate IV Disability Support', 'Personal Care Certificate', 'Manual Handling'],
      availability: 'Available',
      hourlyRate: 48.75,
      schadsLevel: 4,
      complianceStatus: 'compliant',
      matchScore: 88,
      workingRadius: 10,
      languages: ['English', 'Spanish'],
      experience: '7 years',
      performanceMetrics: {
        totalServices: 189,
        averageRating: 4.6,
        onTimePercentage: 94.2,
        cancellationRate: 3.1
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'badge-success';
      case 'confirmed':
        return 'badge-success';
      case 'pending_assignment':
        return 'badge-warning';
      case 'pending_worker_confirmation':
        return 'badge-pending';
      case 'completed':
        return 'badge-success';
      case 'cancelled':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-200 text-red-900 border-red-300';
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

  const calculateWorkerMatch = (worker: any, request: any) => {
    let score = 0;
    
    // Distance scoring (closer is better)
    const distance = parseFloat(worker.distance);
    if (distance <= 5) score += 30;
    else if (distance <= 10) score += 20;
    else if (distance <= 15) score += 10;
    
    // Specialization matching
    const matchingSpecs = worker.specializations.filter((spec: string) => 
      request.requirements.some((req: string) => 
        req.toLowerCase().includes(spec.toLowerCase()) || 
        spec.toLowerCase().includes(req.toLowerCase())
      )
    );
    score += matchingSpecs.length * 15;
    
    // Rating bonus
    score += worker.rating * 5;
    
    // Risk level compatibility
    if (request.riskLevel === 'high' && worker.specializations.some((s: string) => 
      s.includes('High Needs') || s.includes('Personal Care') || s.includes('Specialized')
    )) {
      score += 20;
    }
    
    return Math.min(100, Math.max(0, score));
  };

  const handleAssignWorker = (requestId: string, workerId: string, isRecurring: boolean = false) => {
    console.log('Assigning worker', workerId, 'to request', requestId, 'recurring:', isRecurring);
    
    if (isRecurring) {
      console.log('Creating recurring shift with pattern:', recurringShiftData);
    }
    
    setShowAssignModal(false);
    setShowRecurringModal(false);
    setSelectedRequest(null);
    setSelectedWorkerForAssign(null);
  };

  const filteredRequests = serviceRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.participant.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shift Assignment</h1>
            <p className="text-gray-600 mt-2">Assign qualified workers to service requests</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.ASSIGN_SHIFTS}>
            <div className="flex items-center space-x-4">
              <button className="btn-secondary flex items-center">
                <Calendar size={20} className="mr-2" />
                Calendar View
              </button>
              <button className="btn-primary flex items-center">
                <Plus size={20} className="mr-2" />
                Manual Assignment
              </button>
            </div>
          </PermissionGuard>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <div className="metric-value text-orange-600">
              {serviceRequests.filter(r => r.status === 'pending_assignment').length}
            </div>
            <div className="metric-label">Awaiting Assignment</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Assigned</span>
            </div>
            <div className="metric-value text-green-600">0</div>
            <div className="metric-label">Assigned Today</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Repeat size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Recurring</span>
            </div>
            <div className="metric-value text-blue-600">
              {serviceRequests.filter(r => r.isRecurring).length}
            </div>
            <div className="metric-label">Ongoing Services</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle size={24} className="text-red-600" />
              <span className="text-sm text-gray-500">Urgent</span>
            </div>
            <div className="metric-value text-red-600">
              {serviceRequests.filter(r => r.urgency === 'urgent' || r.urgency === 'high').length}
            </div>
            <div className="metric-label">High Priority</div>
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
                    <option value="pending_assignment">Pending Assignment</option>
                    <option value="assigned">Assigned</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => {
            const bestWorkers = availableWorkers
              .map(worker => ({
                ...worker,
                matchScore: calculateWorkerMatch(worker, request)
              }))
              .sort((a, b) => b.matchScore - a.matchScore)
              .slice(0, 3);

            return (
              <div key={request.id} className="content-card hover-lift">
                <div className="content-card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{request.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency} priority
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskLevelColor(request.riskLevel)}`}>
                            {request.riskLevel} risk
                          </span>
                          {request.isRecurring && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium flex items-center">
                              <Repeat size={12} className="mr-1" />
                              Recurring
                            </span>
                          )}
                          <span className={`badge ${getStatusColor(request.status)}`}>
                            {request.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Participant Info */}
                      <div className="flex items-center mb-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={request.participant.avatar} 
                          alt={request.participant.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{request.participant.name}</p>
                          <p className="text-sm text-gray-600">NDIS: {request.participant.ndisNumber}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {request.participant.preferences.slice(0, 2).map((pref, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {pref}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(request.estimatedCost)}</div>
                          <div className="text-sm text-gray-500">{request.duration}h service</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{request.description}</p>
                      
                      {/* Service Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-blue-500" />
                          {request.preferredDate}
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-green-500" />
                          {request.preferredTime}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-purple-500" />
                          {request.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign size={16} className="mr-2 text-orange-500" />
                          {formatCurrency(request.estimatedCost)}
                        </div>
                      </div>
                      
                      {/* Requirements */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {request.requirements.map((req, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recurring Pattern */}
                      {request.isRecurring && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center">
                            <Repeat size={16} className="text-blue-600 mr-2" />
                            <p className="text-sm text-blue-800">
                              <strong>Recurring Pattern:</strong> {request.recurringPattern}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Best Match Workers Preview */}
                      <div className="bg-green-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-green-900 mb-3">Top Matching Workers</h4>
                        <div className="space-y-2">
                          {bestWorkers.map((worker, index) => (
                            <div key={worker.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                              <div className="flex items-center">
                                <img 
                                  src={worker.avatar} 
                                  alt={worker.name}
                                  className="w-8 h-8 rounded-full mr-3"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{worker.name}</p>
                                  <div className="flex items-center space-x-2">
                                    <Star size={12} className="text-yellow-400" />
                                    <span className="text-xs text-gray-600">{worker.rating}</span>
                                    <span className="text-xs text-gray-500">• {worker.distance}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="text-right">
                                  <div className="text-sm font-medium text-green-600">{worker.matchScore}% match</div>
                                  <div className="text-xs text-gray-500">{formatCurrency(worker.hourlyRate)}/hr</div>
                                </div>
                                <PermissionGuard permission={PERMISSIONS.ASSIGN_SHIFTS}>
                                  <button 
                                    onClick={() => {
                                      setSelectedRequest(request.id);
                                      setSelectedWorkerForAssign(worker.id);
                                      if (request.isRecurring) {
                                        setShowRecurringModal(true);
                                      } else {
                                        setShowAssignModal(true);
                                      }
                                    }}
                                    className="btn-primary text-xs px-3 py-1"
                                  >
                                    Assign
                                  </button>
                                </PermissionGuard>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Admin Notes */}
                      {request.adminNotes && (
                        <div className="bg-indigo-50 rounded-lg p-3">
                          <p className="text-sm text-indigo-800">
                            <strong>Admin Notes:</strong> {request.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <PermissionGuard permission={PERMISSIONS.ASSIGN_SHIFTS}>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        Created: {request.createdAt} • ID: {request.id}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => setSelectedRequest(request.id)}
                          className="btn-secondary text-sm flex items-center"
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedRequest(request.id);
                            setShowAssignModal(true);
                          }}
                          className="btn-primary text-sm flex items-center"
                        >
                          <UserCheck size={16} className="mr-2" />
                          {request.isRecurring ? 'Assign Recurring' : 'Assign Worker'}
                        </button>
                      </div>
                    </div>
                  </PermissionGuard>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recurring Shift Modal */}
        {showRecurringModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create Recurring Shift</h2>
                  <p className="text-gray-600">Set up ongoing service schedule</p>
                </div>
                <button 
                  onClick={() => setShowRecurringModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <form className="space-y-6">
                  <div>
                    <label className="form-label required">Recurrence Type</label>
                    <select 
                      className="form-input"
                      value={recurringShiftData.type}
                      onChange={(e) => setRecurringShiftData({...recurringShiftData, type: e.target.value})}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label required">Repeat Every</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        min="1" 
                        max="12"
                        className="form-input w-20"
                        value={recurringShiftData.interval}
                        onChange={(e) => setRecurringShiftData({...recurringShiftData, interval: parseInt(e.target.value)})}
                      />
                      <span className="text-gray-600">
                        {recurringShiftData.type === 'weekly' ? 'week(s)' : 'month(s)'}
                      </span>
                    </div>
                  </div>

                  {recurringShiftData.type === 'weekly' && (
                    <div>
                      <label className="form-label required">Days of Week</label>
                      <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <label key={day} className="flex flex-col items-center">
                            <input
                              type="checkbox"
                              className="mb-1"
                              checked={recurringShiftData.daysOfWeek.includes(index)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRecurringShiftData({
                                    ...recurringShiftData,
                                    daysOfWeek: [...recurringShiftData.daysOfWeek, index]
                                  });
                                } else {
                                  setRecurringShiftData({
                                    ...recurringShiftData,
                                    daysOfWeek: recurringShiftData.daysOfWeek.filter(d => d !== index)
                                  });
                                }
                              }}
                            />
                            <span className="text-xs">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="form-label required">End Condition</label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="endType"
                          value="date"
                          checked={recurringShiftData.endType === 'date'}
                          onChange={(e) => setRecurringShiftData({...recurringShiftData, endType: e.target.value})}
                          className="mr-2"
                        />
                        <span className="text-sm">End on specific date</span>
                      </label>
                      {recurringShiftData.endType === 'date' && (
                        <input 
                          type="date" 
                          className="form-input ml-6"
                          value={recurringShiftData.endDate}
                          onChange={(e) => setRecurringShiftData({...recurringShiftData, endDate: e.target.value})}
                        />
                      )}
                      
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="endType"
                          value="occurrences"
                          checked={recurringShiftData.endType === 'occurrences'}
                          onChange={(e) => setRecurringShiftData({...recurringShiftData, endType: e.target.value})}
                          className="mr-2"
                        />
                        <span className="text-sm">End after number of occurrences</span>
                      </label>
                      {recurringShiftData.endType === 'occurrences' && (
                        <div className="flex items-center space-x-2 ml-6">
                          <input 
                            type="number" 
                            min="1" 
                            max="52"
                            className="form-input w-20"
                            value={recurringShiftData.endAfter}
                            onChange={(e) => setRecurringShiftData({...recurringShiftData, endAfter: e.target.value})}
                          />
                          <span className="text-gray-600">shifts</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Recurring Shift Summary</h4>
                    <p className="text-sm text-blue-800">
                      This will create {recurringShiftData.type} shifts every {recurringShiftData.interval} 
                      {recurringShiftData.type === 'weekly' ? ' week(s)' : ' month(s)'}.
                      {recurringShiftData.type === 'weekly' && recurringShiftData.daysOfWeek.length > 0 && (
                        <span> On {recurringShiftData.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}.</span>
                      )}
                    </p>
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowRecurringModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAssignWorker(selectedRequest!, selectedWorkerForAssign!, true)}
                  className="btn-primary"
                >
                  <Save size={16} className="mr-2" />
                  Create Recurring Shifts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assignment Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Assign Worker</h2>
                  <p className="text-gray-600">Select the best worker for this service</p>
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
                  {availableWorkers
                    .map(worker => ({
                      ...worker,
                      matchScore: calculateWorkerMatch(worker, filteredRequests.find(r => r.id === selectedRequest))
                    }))
                    .sort((a, b) => b.matchScore - a.matchScore)
                    .map((worker) => (
                      <div 
                        key={worker.id} 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedWorkerForAssign === worker.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => setSelectedWorkerForAssign(worker.id)}
                      >
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
                              <span className="text-sm text-gray-500 ml-2">• {worker.experience}</span>
                            </div>
                          </div>
                        </div>

                        {/* Match Score */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Match Score</span>
                            <span className="text-sm font-bold text-green-600">{worker.matchScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${worker.matchScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Worker Details */}
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

                        {/* Specializations */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Specializations:</p>
                          <div className="flex flex-wrap gap-1">
                            {worker.specializations.slice(0, 3).map((spec, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                {spec}
                              </span>
                            ))}
                            {worker.specializations.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                +{worker.specializations.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-bold text-blue-600">{worker.performanceMetrics.totalServices}</div>
                              <div className="text-gray-600">Services</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-green-600">{worker.performanceMetrics.onTimePercentage}%</div>
                              <div className="text-gray-600">On-Time</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowAssignModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAssignWorker(selectedRequest!, selectedWorkerForAssign!)}
                  disabled={!selectedWorkerForAssign}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserCheck size={16} className="mr-2" />
                  Assign Worker
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredRequests.length === 0 && (
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

export default ShiftAssignment;