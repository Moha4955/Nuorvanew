import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/Layout/PublicLayout';
import { Clock, CheckCircle, Mail, Phone, FileText, ArrowLeft, Heart, Shield } from 'lucide-react';

const ApplicationPending: React.FC = () => {
  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal" showNavigation={false}>
      <div className="bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center py-12 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* Status Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock size={48} className="text-orange-600" />
            </div>

            {/* Main Content */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Application Under Review
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for applying to become a support worker with Nurova Australia. 
              Your application is currently being reviewed by our admin team.
            </p>

            {/* Status Steps */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-gray-900 mb-4">Review Process</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-700">Application submitted successfully</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                    <Clock size={16} className="text-white" />
                  </div>
                  <span className="text-sm text-gray-700">Document verification in progress</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">Admin review and approval</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-500">Account activation</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">Expected Timeline</h3>
              <p className="text-sm text-blue-800 mb-4">
                Our review process typically takes 3-5 business days. You'll receive an email 
                notification once your application has been processed.
              </p>
              <div className="text-sm text-blue-700">
                <strong>What happens next:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Document verification and compliance check</li>
                  <li>Background check confirmation</li>
                  <li>Qualification review</li>
                  <li>Final approval and account activation</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:applications@nurova.com.au" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Mail size={16} className="mr-2" />
                  applications@nurova.com.au
                </a>
                <a 
                  href="tel:1800687682" 
                  className="inline-flex items-center justify-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Phone size={16} className="mr-2" />
                  1800 NUROVA
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link 
                to="/" 
                className="btn-secondary inline-flex items-center justify-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Home
              </Link>
              <button className="btn-primary inline-flex items-center justify-center">
                <FileText size={16} className="mr-2" />
                View Application Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ApplicationPending;