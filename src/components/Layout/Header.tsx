import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, CheckCircle, Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
  showNavigation?: boolean;
  variant?: 'default' | 'minimal';
}

const Header: React.FC<HeaderProps> = ({ 
  showNavigation = true, 
  variant = 'default' 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/help', label: 'Help' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="main-header sticky top-0 z-50">
      <div className="container xl">
        <div className="flex justify-between items-center py-4">
          {/* Enhanced Logo */}
          <Link to="/" className="nav-logo group">
            <div className="nav-logo-icon">
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
              <h1 className="nav-brand-name group-hover:scale-105 transition-transform">Nurova Australia</h1>
              <p className="nav-brand-tagline">NDIS Support Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {showNavigation && (
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {showNavigation && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showNavigation && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-center">
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;