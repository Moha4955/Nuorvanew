import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { NDISUser } from '../types/ndis';
import { authService } from '../services/authService';
import { DashboardStats } from '../types';
import { PermissionKey, PERMISSIONS } from '../utils/permissions';

interface AuthContextType {
  user: NDISUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName: string, lastName: string, role: 'participant' | 'support_worker', phone?: string) => Promise<void>;
  loading: boolean;
  updateProfile: (updates: Partial<NDISUser>) => Promise<void>;
  getDashboardStats: () => DashboardStats;
  hasPermission: (permission: PermissionKey) => boolean;
  hasAnyPermission: (permissions: PermissionKey[]) => boolean;
  getUserPermissions: () => string[];
  isAdmin: () => boolean;
}

const defaultStats: DashboardStats = {
  participant: {
    upcomingServices: 0,
    totalBudget: 0,
    usedBudget: 0,
    remainingBudget: 0,
    activeWorkers: 0,
    unreadMessages: 0,
    pendingInvoices: 0,
    planExpiryDays: 0
  },
  worker: {
    weeklyEarnings: 0,
    hoursWorked: 0,
    upcomingShifts: 0,
    activeParticipants: 0,
    averageRating: 0,
    complianceStatus: 'compliant',
    pendingTimesheets: 0,
    unreadMessages: 0
  },
  admin: {
    totalParticipants: 0,
    activeWorkers: 0,
    pendingApplications: 0,
    monthlyRevenue: 0,
    servicesCompleted: 0,
    complianceIssues: 0,
    systemAlerts: 0,
    averageResponseTime: 0
  }
};

const defaultAuthContext: AuthContextType = {
  user: null,
  login: async () => { throw new Error('AuthProvider not initialized'); },
  logout: () => { throw new Error('AuthProvider not initialized'); },
  register: async () => { throw new Error('AuthProvider not initialized'); },
  loading: true,
  updateProfile: async () => { throw new Error('AuthProvider not initialized'); },
  getDashboardStats: () => defaultStats,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  getUserPermissions: () => [],
  isAdmin: () => false
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<NDISUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing...');
    initializeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('👤 User state updated:', {
        id: user.id,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`,
        profile_complete: user.profile_complete
      });
    } else {
      console.log('👤 User state: No user logged in');
    }
  }, [user]);

  const initializeAuth = async () => {
    try {
      console.log('🔍 Checking for existing session...');
      const currentUser = await authService.getCurrentUser();

      if (currentUser) {
        console.log('✅ Found existing session:', currentUser.email);
        setUser(currentUser);
      } else {
        console.log('ℹ️ No existing session found');
      }
    } catch (error) {
      console.error('❌ Failed to initialize auth:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
      console.log('✅ AuthProvider initialized');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔑 Login attempt for:', email);
      setLoading(true);

      const authResponse = await authService.login({ email, password });
      console.log('✅ Login successful:', authResponse.user.email);

      setUser(authResponse.user);
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'participant' | 'support_worker',
    phone?: string
  ) => {
    try {
      console.log('📝 Register attempt for:', email);
      setLoading(true);

      const authResponse = await authService.register({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role,
        phone
      });

      console.log('✅ Registration successful:', authResponse.user.email);
      setUser(authResponse.user);
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logout attempt');
      await authService.logout();
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      setUser(null);
    }
  };

  const updateProfile = async (updates: Partial<NDISUser>) => {
    if (!user) {
      console.error('❌ Cannot update profile: No user logged in');
      throw new Error('No user logged in');
    }

    try {
      console.log('📝 Updating profile for:', user.email);
      await authService.updateProfile(user.id, updates);
      const updatedUser = { ...user, ...updates, updated_at: new Date() };
      setUser(updatedUser);
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw error;
    }
  };

  const getDashboardStats = (): DashboardStats => {
    if (!user) {
      console.log('📊 getDashboardStats: No user, returning default stats');
      return defaultStats;
    }

    const mockStats: DashboardStats = {
      participant: {
        upcomingServices: 3,
        totalBudget: 45000,
        usedBudget: 12500,
        remainingBudget: 32500,
        activeWorkers: 2,
        unreadMessages: 2,
        pendingInvoices: 1,
        planExpiryDays: 287
      },
      worker: {
        weeklyEarnings: 1248.50,
        hoursWorked: 28.5,
        upcomingShifts: 4,
        activeParticipants: 8,
        averageRating: 4.8,
        complianceStatus: 'compliant',
        pendingTimesheets: 2,
        unreadMessages: 3
      },
      admin: {
        totalParticipants: 342,
        activeWorkers: 156,
        pendingApplications: 23,
        monthlyRevenue: 145820,
        servicesCompleted: 1247,
        complianceIssues: 8,
        systemAlerts: 4,
        averageResponseTime: 2.3
      }
    };

    console.log('📊 getDashboardStats: Returning mock stats for role:', user.role);
    return mockStats;
  };

  const checkPermission = (permission: PermissionKey): boolean => {
    if (!user) return false;
    const userPermissions = getUserPermissions();
    return userPermissions.includes(permission);
  };

  const checkAnyPermission = (permissions: PermissionKey[]): boolean => {
    if (!user) return false;
    const userPermissions = getUserPermissions();
    return permissions.some(permission => userPermissions.includes(permission));
  };

  const getUserPermissions = (): string[] => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          PERMISSIONS.ASSIGN_SHIFTS,
          PERMISSIONS.VIEW_SHIFTS,
          PERMISSIONS.EDIT_SHIFTS,
          PERMISSIONS.CANCEL_SHIFTS,
          PERMISSIONS.CREATE_RECURRING_SHIFTS,
          PERMISSIONS.VIEW_WORKERS,
          PERMISSIONS.APPROVE_WORKERS,
          PERMISSIONS.SUSPEND_WORKERS,
          PERMISSIONS.EDIT_WORKER_PROFILES,
          PERMISSIONS.VIEW_WORKER_PERFORMANCE,
          PERMISSIONS.VIEW_PARTICIPANTS,
          PERMISSIONS.APPROVE_PARTICIPANTS,
          PERMISSIONS.EDIT_PARTICIPANT_PROFILES,
          PERMISSIONS.VIEW_PARTICIPANT_BUDGETS,
          PERMISSIONS.VIEW_FINANCIALS,
          PERMISSIONS.APPROVE_TIMESHEETS,
          PERMISSIONS.GENERATE_INVOICES,
          PERMISSIONS.SEND_INVOICES,
          PERMISSIONS.RECORD_PAYMENTS,
          PERMISSIONS.VIEW_FINANCIAL_REPORTS,
          PERMISSIONS.EXPORT_FINANCIAL_DATA,
          PERMISSIONS.VIEW_COMPLIANCE,
          PERMISSIONS.MANAGE_COMPLIANCE,
          PERMISSIONS.APPROVE_DOCUMENTS,
          PERMISSIONS.SEND_COMPLIANCE_REMINDERS,
          PERMISSIONS.SUSPEND_FOR_COMPLIANCE,
          PERMISSIONS.MANAGE_USERS,
          PERMISSIONS.VIEW_AUDIT_LOGS,
          PERMISSIONS.SYSTEM_SETTINGS,
          PERMISSIONS.EXPORT_DATA,
          PERMISSIONS.SEND_NOTIFICATIONS,
          PERMISSIONS.VIEW_ALL_MESSAGES,
          PERMISSIONS.MODERATE_COMMUNICATIONS
        ];
      case 'team_leader':
        return [
          PERMISSIONS.ASSIGN_SHIFTS,
          PERMISSIONS.VIEW_SHIFTS,
          PERMISSIONS.EDIT_SHIFTS,
          PERMISSIONS.VIEW_WORKERS,
          PERMISSIONS.VIEW_PARTICIPANTS,
          PERMISSIONS.SEND_NOTIFICATIONS
        ];
      case 'compliance':
        return [
          PERMISSIONS.VIEW_COMPLIANCE,
          PERMISSIONS.MANAGE_COMPLIANCE,
          PERMISSIONS.APPROVE_DOCUMENTS,
          PERMISSIONS.VIEW_WORKERS
        ];
      default:
        return [];
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin' || user?.role === 'team_leader' || user?.role === 'compliance';
  };

  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        updateProfile,
        getDashboardStats,
        hasPermission: checkPermission,
        hasAnyPermission: checkAnyPermission,
        getUserPermissions,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
