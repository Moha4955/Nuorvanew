import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  DollarSign,
  Heart,
  CheckCircle,
  BarChart3,
  Clock,
  Bell,
  Mail,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const getNavigationItems = () => {
    switch (user.role) {
      case 'participant':
        return [
          { path: '/participant/dashboard', icon: Home, label: 'Dashboard', badge: null },
          { path: '/participant/services', icon: Calendar, label: 'Services', badge: { count: 2, variant: 'info' } },
          { path: '/participant/messages', icon: MessageCircle, label: 'Messages', badge: { count: 2, variant: 'error' } },
          { path: '/participant/invoices', icon: FileText, label: 'Invoices', badge: { count: 1, variant: 'warning' } },
          { path: '/participant/documents', icon: FileText, label: 'Documents', badge: null },
          { path: '/participant/profile', icon: Settings, label: 'Profile', badge: null }
        ];
      case 'support_worker':
        return [
          { path: '/worker/dashboard', icon: Home, label: 'Dashboard', badge: null },
          { path: '/worker/shifts', icon: Calendar, label: 'Shifts', badge: { count: 3, variant: 'info' } },
          { path: '/worker/messages', icon: MessageCircle, label: 'Messages', badge: { count: 3, variant: 'error' } },
          { path: '/worker/compliance', icon: Shield, label: 'Compliance', badge: { count: 1, variant: 'warning' } },
          { path: '/worker/timesheets', icon: FileText, label: 'Timesheets', badge: { count: 2, variant: 'warning' } },
          { path: '/worker/profile', icon: Settings, label: 'Profile', badge: null }
        ];
      default:
        return [
          { path: '/admin/dashboard', icon: Home, label: 'Dashboard', badge: null },
          { path: '/admin/workers', icon: Users, label: 'Workers', badge: { count: 23, variant: 'info' } },
          { path: '/admin/participants', icon: Users, label: 'Participants', badge: null },
          { path: '/admin/shifts', icon: Calendar, label: 'Shift Assignment', badge: null },
          { path: '/admin/services', icon: Calendar, label: 'Service Management', badge: null },
          { path: '/admin/timesheets', icon: FileText, label: 'Timesheets', badge: { count: 5, variant: 'warning' } },
          { path: '/admin/invoices', icon: DollarSign, label: 'Invoices', badge: { count: 3, variant: 'info' } },
          { path: '/admin/compliance', icon: Shield, label: 'Compliance', badge: { count: 8, variant: 'error' } },
          { path: '/admin/compliance-standards', icon: Target, label: 'Standards', badge: null },
          { path: '/admin/communications', icon: MessageCircle, label: 'Communications', badge: { count: 2, variant: 'info' } },
          { path: '/admin/financial', icon: DollarSign, label: 'Financial', badge: null },
          { path: '/admin/marketing', icon: Mail, label: 'Marketing', badge: null },
          { path: '/admin/reports', icon: BarChart3, label: 'Reports', badge: null },
          { path: '/admin/notifications', icon: Bell, label: 'Notifications', badge: null },
          { path: '/admin/users', icon: Users, label: 'User Management', badge: null },
          { path: '/admin/settings', icon: Settings, label: 'Settings', badge: null }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getBadgeColor = (variant: string) => {
    switch (variant) {
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-orange-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl border-r border-gray-100 transform transition-transform lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <Link to="/" className="flex items-center">
            <div className="nav-logo-icon mr-3">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-green-600 rounded-xl"></div>
              <div className="absolute inset-0.5 bg-white rounded-lg flex items-center justify-center">
                <Heart size={20} className="text-transparent bg-gradient-to-br from-blue-600 to-green-600 bg-clip-text" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle size={12} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                <Shield size={8} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Nurova Australia</h1>
              <p className="text-xs text-gray-500">NDIS Support Platform</p>
            </div>
          </Link>
        </div>

        {/* User Profile */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user.first_name?.[0] || 'U'}{user.last_name?.[0] || 'U'}
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500">
                {user.role === 'participant' ? 'NDIS Participant' : 
                 user.role === 'support_worker' ? 'Support Worker' : 'Administrator'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 py-4 flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className="mr-3" />
                      {item.label}
                    </div>
                    {item.badge && item.badge.count > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor(item.badge.variant)}`}>
                        {item.badge.count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;