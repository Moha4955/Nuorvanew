import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import PermissionGuard from '../../components/PermissionGuard';
import { Users, Search, Filter, Plus, CreditCard as Edit, Trash2, Shield, CheckCircle, AlertTriangle, Clock, Eye, Mail, Phone, Calendar, Key, UserPlus, UserX, X, Save } from 'lucide-react';
import { PERMISSIONS, ADMIN_ROLES } from '../../utils/permissions';

const UserManagement: React.FC = () => {
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    permissions: [] as string[]
  });

  const adminUsers = [
    {
      id: 'admin-001',
      firstName: 'Emily',
      lastName: 'Chen',
      email: 'admin@nurova.com',
      role: 'admin',
      department: 'Administration',
      status: 'active',
      lastLogin: '2025-01-15 14:30',
      createdAt: '2023-11-10',
      permissions: ADMIN_ROLES.SUPER_ADMIN?.permissions || [],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      loginCount: 1247,
      lastActivity: '2025-01-15 16:45'
    },
    {
      id: 'admin-002',
      firstName: 'James',
      lastName: 'Wilson',
      email: 'shifts@nurova.com',
      role: 'shift_coordinator',
      department: 'Operations',
      status: 'active',
      lastLogin: '2025-01-15 09:15',
      createdAt: '2024-05-15',
      permissions: ADMIN_ROLES.shift_coordinator?.permissions || [],
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      loginCount: 456,
      lastActivity: '2025-01-15 15:20'
    },
    {
      id: 'admin-003',
      firstName: 'Lisa',
      lastName: 'Anderson',
      email: 'finance@nurova.com',
      role: 'financial_admin',
      department: 'Finance',
      status: 'active',
      lastLogin: '2025-01-15 08:00',
      createdAt: '2024-03-10',
      permissions: ADMIN_ROLES.financial_admin?.permissions || [],
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      loginCount: 789,
      lastActivity: '2025-01-15 17:00'
    },
    {
      id: 'admin-004',
      firstName: 'David',
      lastName: 'Martinez',
      email: 'compliance@nurova.com',
      role: 'compliance_officer',
      department: 'Compliance',
      status: 'active',
      lastLogin: '2025-01-15 10:30',
      createdAt: '2024-04-20',
      permissions: ADMIN_ROLES.compliance_officer?.permissions || [],
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      loginCount: 623,
      lastActivity: '2025-01-15 16:15'
    },
    {
      id: 'admin-005',
      firstName: 'Sarah',
      lastName: 'Thompson',
      email: 'operations@nurova.com',
      role: 'operations_manager',
      department: 'Operations',
      status: 'inactive',
      lastLogin: '2024-12-20 16:45',
      createdAt: '2024-08-15',
      permissions: ADMIN_ROLES.operations_manager?.permissions || [],
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      loginCount: 234,
      lastActivity: '2024-12-20 17:30'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-neutral';
      case 'suspended':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-indigo-100 text-indigo-800';
      case 'shift_coordinator':
        return 'bg-purple-100 text-purple-800';
      case 'financial_admin':
        return 'bg-orange-100 text-orange-800';
      case 'compliance_officer':
        return 'bg-red-100 text-red-800';
      case 'operations_manager':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRoleName = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCreateUser = async () => {
    try {
      console.log('Creating user:', newUser);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowCreateModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        department: '',
        permissions: []
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleSuspendUser = (userId: string) => {
    console.log('Suspending user:', userId);
  };

  const handleActivateUser = (userId: string) => {
    console.log('Activating user:', userId);
  };

  const filteredUsers = adminUsers.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const selectedUserData = adminUsers.find(u => u.id === selectedUser);

  const activeUsers = adminUsers.filter(u => u.status === 'active').length;
  const inactiveUsers = adminUsers.filter(u => u.status === 'inactive').length;
  const totalLogins = adminUsers.reduce((sum, u) => sum + u.loginCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage admin users, roles, and permissions</p>
          </div>
          <PermissionGuard permission={PERMISSIONS.MANAGE_USERS}>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center"
            >
              <UserPlus size={20} className="mr-2" />
              Add Admin User
            </button>
          </PermissionGuard>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Users size={24} className="text-blue-600" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <div className="metric-value text-blue-600">{adminUsers.length}</div>
            <div className="metric-label">Admin Users</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={24} className="text-green-600" />
              <span className="text-sm text-gray-500">Active</span>
            </div>
            <div className="metric-value text-green-600">{activeUsers}</div>
            <div className="metric-label">Active Users</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-orange-600" />
              <span className="text-sm text-gray-500">Inactive</span>
            </div>
            <div className="metric-value text-orange-600">{inactiveUsers}</div>
            <div className="metric-label">Inactive Users</div>
          </div>

          <div className="metric-card">
            <div className="flex items-center justify-between mb-4">
              <Key size={24} className="text-purple-600" />
              <span className="text-sm text-gray-500">Sessions</span>
            </div>
            <div className="metric-value text-purple-600">{totalLogins}</div>
            <div className="metric-label">Total Logins</div>
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
                    placeholder="Search users..."
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
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Administrator</option>
                    <option value="shift_coordinator">Shift Coordinator</option>
                    <option value="financial_admin">Financial Admin</option>
                    <option value="compliance_officer">Compliance Officer</option>
                    <option value="operations_manager">Operations Manager</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <select
                    className="form-input"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="content-card hover-lift">
              <div className="content-card-body">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <img 
                      src={user.avatar} 
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
                            {formatRoleName(user.role)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2 text-blue-500" />
                          {user.email}
                        </div>
                        <div className="flex items-center">
                          <Shield size={16} className="mr-2 text-green-500" />
                          {user.department}
                        </div>
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-purple-500" />
                          Last Login: {user.lastLogin}
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2 text-orange-500" />
                          {user.loginCount} total logins
                        </div>
                      </div>

                      {/* Permissions Summary */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Permissions Summary</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 mb-1">
                              <strong>Total Permissions:</strong> {user.permissions.length}
                            </p>
                            <p className="text-gray-600">
                              <strong>Role Level:</strong> {ADMIN_ROLES[user.role as keyof typeof ADMIN_ROLES]?.level || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 mb-1">
                              <strong>Created:</strong> {user.createdAt}
                            </p>
                            <p className="text-gray-600">
                              <strong>Last Activity:</strong> {user.lastActivity}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Key Permissions */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Key Permissions:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.permissions.slice(0, 4).map((permission, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {permission.replace('_', ' ')}
                            </span>
                          ))}
                          {user.permissions.length > 4 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              +{user.permissions.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <PermissionGuard permission={PERMISSIONS.MANAGE_USERS}>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      User ID: {user.id} • Created: {user.createdAt}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setSelectedUser(user.id)}
                        className="btn-secondary text-sm flex items-center"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user.id);
                          setShowEditModal(true);
                        }}
                        className="btn-secondary text-sm flex items-center"
                      >
                        <Edit size={16} className="mr-2" />
                        Edit
                      </button>
                      {user.status === 'active' ? (
                        <button 
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 hover:text-red-700 text-sm flex items-center"
                        >
                          <UserX size={16} className="mr-2" />
                          Suspend
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateUser(user.id)}
                          className="btn-success text-sm flex items-center"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                </PermissionGuard>
              </div>
            </div>
          ))}
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create Admin User</h2>
                <p className="text-gray-600">Add a new administrator to the platform</p>
              </div>
              
              <div className="p-6">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label required">First Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newUser.firstName}
                        onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label required">Last Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newUser.lastName}
                        onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label required">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label required">Role</label>
                      <select
                        className="form-input"
                        value={newUser.role}
                        onChange={(e) => {
                          const role = e.target.value;
                          const permissions = role ? ADMIN_ROLES[role as keyof typeof ADMIN_ROLES]?.permissions || [] : [];
                          setNewUser({...newUser, role, permissions});
                        }}
                      >
                        <option value="">Select role</option>
                        <option value="shift_coordinator">Shift Coordinator</option>
                        <option value="financial_admin">Financial Admin</option>
                        <option value="compliance_officer">Compliance Officer</option>
                        <option value="operations_manager">Operations Manager</option>
                        <option value="admin">Super Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Department</label>
                      <select
                        className="form-input"
                        value={newUser.department}
                        onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      >
                        <option value="">Select department</option>
                        <option value="Operations">Operations</option>
                        <option value="Finance">Finance</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                  </div>

                  {newUser.role && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Role Permissions</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        {ADMIN_ROLES[newUser.role as keyof typeof ADMIN_ROLES]?.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {newUser.permissions.slice(0, 6).map((permission, index) => (
                          <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            {permission.replace('_', ' ')}
                          </span>
                        ))}
                        {newUser.permissions.length > 6 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            +{newUser.permissions.length - 6} more permissions
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateUser}
                  disabled={!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.role}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <UserPlus size={16} className="mr-2" />
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && selectedUserData && !showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedUserData.firstName} {selectedUserData.lastName}
                  </h2>
                  <p className="text-gray-600">{formatRoleName(selectedUserData.role)}</p>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* User Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">User Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedUserData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedUserData.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`badge ${getStatusColor(selectedUserData.status)}`}>
                          {selectedUserData.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{selectedUserData.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Activity Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Login:</span>
                        <span className="font-medium">{selectedUserData.lastLogin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Logins:</span>
                        <span className="font-medium">{selectedUserData.loginCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="font-medium">{selectedUserData.lastActivity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Permissions:</span>
                        <span className="font-medium">{selectedUserData.permissions.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions List */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">Assigned Permissions</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedUserData.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center text-sm text-blue-800">
                        <CheckCircle size={14} className="mr-2 text-blue-600" />
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <PermissionGuard permission={PERMISSIONS.MANAGE_USERS}>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    className="btn-primary"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit User
                  </button>
                </PermissionGuard>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="content-card text-center">
            <div className="content-card-body py-12">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">
                {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Admin users will appear here for management'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;