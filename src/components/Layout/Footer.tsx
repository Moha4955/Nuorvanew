import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle, Shield, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  variant?: 'default' | 'minimal';
}

const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  if (variant === 'minimal') {
    return (
      <footer className="bg-gray-900 text-white py-8">
        <div className="container xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Nurova Australia. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <div className="flex items-center text-gray-400">
                <Shield size={16} className="mr-2" />
                NDIS Commission Approved
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container xl">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="nav-logo mb-6 inline-flex">
              <div className="nav-logo-icon">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-green-600 rounded-xl"></div>
                <div className="absolute inset-0.5 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Heart size={20} className="text-transparent bg-gradient-to-br from-blue-400 to-green-400 bg-clip-text" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                  <CheckCircle size={12} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield size={8} className="text-white" />
                </div>
              </div>
              <div>
                <h3 className="nav-brand-name text-white">Nurova Australia</h3>
                <p className="nav-brand-tagline text-gray-400">NDIS Support Platform</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Australia's leading technology-enabled NDIS platform, connecting participants 
              with qualified support workers through expert-curated matching and comprehensive compliance management.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <Shield size={16} className="text-green-400 mr-2" />
                <span className="text-sm text-gray-300">NDIS Commission Approved</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-blue-400 mr-2" />
                <span className="text-sm text-gray-300">ISO 27001 Certified</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Get Started</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Participants</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Find Support Workers</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">Service Categories</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Budget Management</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Plan Coordination</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Workers</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Join Our Network</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">Application Process</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Compliance Support</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Worker Resources</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">24/7 Support</h4>
              <p className="text-gray-300 mb-2">1800 NUROVA</p>
              <p className="text-sm text-gray-400">(1800 687 682)</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Email Support</h4>
              <p className="text-gray-300 mb-2">support@nurova.com.au</p>
              <p className="text-sm text-gray-400">Response within 24 hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Headquarters</h4>
              <p className="text-gray-300 mb-2">Melbourne, Victoria</p>
              <p className="text-sm text-gray-400">Serving all of Australia</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Nurova Australia. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
              <div className="flex items-center text-gray-400">
                <Shield size={16} className="mr-2" />
                NDIS Commission Approved
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;