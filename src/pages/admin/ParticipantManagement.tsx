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
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  FileText,
  X
} from 'lucide-react';

const ParticipantManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);

  const participants = [
    {
      id: 'P-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '0400 123 456',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2025-01-15',
      location: 'Melbourne, VIC',
      ndisNumber: '43000000001',
      planStartDate: '2024-10-15',
      planEndDate: '2025-10-15',
      planManager: 'Melbourne Plan Management',
      totalBudget: 45000,
      usedBudget: 12500,
      remainingBudget: 32500,
      activeServices: 3,
      assignedWorkers: ['Michael Thompson', 'Emma Wilson'],
      supportCategories: ['Daily Living', 'Community Access', 'Transport'],
      riskLevel: 'low',
      emergencyContact: 'John Johnson - 0400 987 654',
      medicalNotes: 'Diabetes Type 2 - requires regular meal times and medication reminders'
    },
    {
      id: 'P-002',
      name: 'Robert Smith',
      email: 'robert.smith@email.com',
      phone: '0400 789 123',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'active',
      joinDate: '2024-03-22',
      lastActive: '2025-01-14',
      location: 'Doncaster, VIC',
      ndisNumber: '43000000002',
      planStartDate: '2024-11-01',
      planEndDate: '2025-11-01',
      planManager: 'Self Managed',
      totalBudget: 38000,
      usedBudget: 8900,
      remainingBudget: 29100,
      activeServices: 2,
      assignedWorkers: ['Michael Thompson'],
      supportCategories: ['Community Access', 'Social Skills', 'Employment Support'],
      riskLevel: 'medium',
      emergencyContact: 'Mary Smith - 0400 555 123',
      medicalNotes: 'Autism Spectrum Disorder - prefers routine and clear communication'
    },
    {
      id: 'P-003',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '0400 456 789',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'pending_approval',
      joinDate: '2025-01-10',
      lastActive: '2025-01-15',
      location: 'Preston, VIC',
      ndisNumber: '43000000003',
      planStartDate: '2025-01-01',
      planEndDate: '2026-01-01',
      planManager: 'Community Care Plan Management',
      totalBudget: 52000,
      usedBudget: 0,
      remainingBudget: 52000,
      activeServices: 0,
      assignedWorkers: [],
      supportCategories: ['Personal Care', 'Mobility Assistance', 'Daily Living'],
      riskLevel: 'high',
      emergencyContact: 'Carlos Garcia - 0400 777 888',
      medicalNotes: 'Mobility impairment - uses wheelchair, requires assistance with transfers'
    },
    {
      id: 'P-004',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '0400 321 654',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      status: 'active',
      joinDate: '2024-06-08',
      lastActive: '2025-01-13',
      location: 'Box Hill, VIC',
      ndisNumber: '43000000004',
      planStartDate: '2024-12-01',
      planEndDate: '2025-12-01',
      planManager: 'Independent Living Plan Management',
      totalBudget: 41000,
      usedBudget: 15600,
      remainingBudget: 25400,
      activeServices: 4,
      assignedWorkers: ['Emma Chen', 'Sarah Davis'],
      supportCategories: ['Capacity Building', 'Life Skills', 'Social Participation'],
      riskLevel: 'low',
      emergencyContact: 'Helen Wilson - 0400 333 444',
      medicalNotes: 'Intellectual disability - requires clear, simple instructions and positive reinforcement'
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

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
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

  const filteredParticipants = participants.filter(participant => {
    const matchesStatus = filterStatus === 'all' || participant.status === filterStatus;
    const matchesSearch = participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         participant.ndisNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const selectedParticipantData = participants.find(p => p.id === selectedParticipant);

  const activeParticipants = participants.filter(p => p.status === 'active').length;
  const pendingParticipants = participants.filter(p => p.status === 'pending_approval').length;
  const totalBudget = participants.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalUsed = participants.reduce((sum, p) => sum + p.usedBudget, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Participant Management</h1>
            <p className="text-gray-600 mt-2">Manage NDIS participant profiles and services</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Users size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <div className="metric-value text-blue-600">{activeParticipants}</div>
            <div className="metric-label">Participants</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Review</span>
            </div>
            <div className="metric-value text-orange-600">{pendingParticipants}</div>
            <div className="metric-label">Pending Approval</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="metric-value text-green-600">{formatCurrency(totalBudget)}</div>
            <div className="metric-label">Plan Budgets</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Utilized</span>
            </div>
            <div className="metric-value text-purple-600">{formatCurrency(totalUsed)}</div>
            <div className="metric-label">Budget Used</div>
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
                    placeholder="Search participants..."
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

        {/* Participants List */}
        <div className="space-y-6">
          {filteredParticipants.map((participant) => (
            <div key={participant.id} className="content-card hover-lift">
              <div className="content-card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <img 
                      src={participant.avatar} 
                      alt={participant.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{participant.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getStatusColor(participant.status)}`}>
                            {participant.status.replace('_', ' ')}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(participant.riskLevel)}`}>
                            {participant.riskLevel} risk
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2 text-blue-500" />
                          {participant.email}
                        </div>
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2 text-green-500" />
                          {participant.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-purple-500" />
                          {participant.location}
                        </div>
                        <div className="flex items-center">
                          <Shield size={16} className="mr-2 text-orange-500" />
                          NDIS: {participant.ndisNumber}
                        </div>
                      </div>

                      {/* Plan Information */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-3">NDIS Plan Information</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-800 mb-1">
                              <strong>Plan Period:</strong> {participant.planStartDate} to {participant.planEndDate}
                            </p>
                            <p className="text-blue-800 mb-1">
                              <strong>Plan Manager:</strong> {participant.planManager}
                            </p>
                            <p className="text-blue-800">
                              <strong>Emergency Contact:</strong> {participant.emergencyContact}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-800 mb-1">
                              <strong>Total Budget:</strong> {formatCurrency(participant.totalBudget)}
                            </p>
                            <p className="text-blue-800 mb-1">
                              <strong>Used:</strong> {formatCurrency(participant.usedBudget)}
                            </p>
                            <p className="text-blue-800">
                              <strong>Remaining:</strong> {formatCurrency(participant.remainingBudget)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Budget Usage */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Budget Usage</span>
                          <span className="font-medium">{Math.round((participant.usedBudget / participant.totalBudget) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${(participant.usedBudget / participant.totalBudget) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Service Categories */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Support Categories:</p>
                        <div className="flex flex-wrap gap-2">
                          {participant.supportCategories.map((category, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Assigned Workers */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Assigned Workers:</p>
                        <div className="flex flex-wrap gap-2">
                          {participant.assignedWorkers.map((worker, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {worker}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Medical Notes */}
                      {participant.medicalNotes && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <p className="text-sm text-yellow-800">
                            <strong>Medical Notes:</strong> {participant.medicalNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Joined: {participant.joinDate} • Last Active: {participant.lastActive} • ID: {participant.id}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setSelectedParticipant(participant.id)}
                      className="btn-secondary text-sm flex items-center"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </button>
                    {participant.status === 'pending_approval' && (
                      <button className="btn-success text-sm flex items-center">
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </button>
                    )}
                    <button className="btn-secondary text-sm flex items-center">
                      <FileText size={16} className="mr-2" />
                      View Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Participant Details Modal */}
        {selectedParticipant && selectedParticipantData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedParticipantData.name}</h2>
                  <p className="text-gray-600">NDIS Participant Profile</p>
                </div>
                <button 
                  onClick={() => setSelectedParticipant(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Contact & Plan Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedParticipantData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedParticipantData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedParticipantData.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emergency:</span>
                        <span className="font-medium">{selectedParticipantData.emergencyContact}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">NDIS Plan Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">NDIS Number:</span>
                        <span className="font-medium">{selectedParticipantData.ndisNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan Manager:</span>
                        <span className="font-medium">{selectedParticipantData.planManager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan Period:</span>
                        <span className="font-medium">
                          {selectedParticipantData.planStartDate} to {selectedParticipantData.planEndDate}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Services:</span>
                        <span className="font-medium">{selectedParticipantData.activeServices}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Breakdown */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Budget Overview</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{formatCurrency(selectedParticipantData.totalBudget)}</div>
                      <div className="text-sm text-blue-700">Total Budget</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedParticipantData.usedBudget)}</div>
                      <div className="text-sm text-green-700">Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{formatCurrency(selectedParticipantData.remainingBudget)}</div>
                      <div className="text-sm text-orange-700">Remaining</div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                        style={{ width: `${(selectedParticipantData.usedBudget / selectedParticipantData.totalBudget) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-blue-700 mt-1">
                      <span>{Math.round((selectedParticipantData.usedBudget / selectedParticipantData.totalBudget) * 100)}% utilized</span>
                      <span>{Math.round(((selectedParticipantData.totalBudget - selectedParticipantData.usedBudget) / selectedParticipantData.totalBudget) * 100)}% remaining</span>
                    </div>
                  </div>
                </div>

                {/* Support Categories & Workers */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Support Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipantData.supportCategories.map((category, index) => (
                        <span key={index} className="text-sm px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Assigned Workers</h3>
                    <div className="space-y-2">
                      {selectedParticipantData.assignedWorkers.map((worker, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium text-green-900">{worker}</span>
                          <button className="text-xs text-green-600 hover:text-green-700">
                            View Profile
                          </button>
                        </div>
                      ))}
                      {selectedParticipantData.assignedWorkers.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No workers assigned yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Notes */}
                {selectedParticipantData.medicalNotes && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Medical Notes</h3>
                    <p className="text-sm text-yellow-800">{selectedParticipantData.medicalNotes}</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setSelectedParticipant(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button className="btn-secondary">
                  View Services
                </button>
                <button className="btn-primary">
                  Assign Worker
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredParticipants.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Participants Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Participant registrations will appear here for review and management'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ParticipantManagement;