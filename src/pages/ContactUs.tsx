import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/Layout/PublicLayout';
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, MessageCircle, Heart, Shield, CheckCircle } from 'lucide-react';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '',
    subject: '',
    message: '',
    urgent: false
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for contacting Nurova Australia. We've received your message and will respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
              <button 
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
              >
                Send Another Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="text-center mb-12">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center justify-center mb-6">
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
                <h1 className="nav-brand-name">Nurova Australia</h1>
                <p className="nav-brand-tagline">NDIS Support Platform</p>
              </div>
            </Link>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to support you every step of your NDIS journey. Our expert team is available 
              24/7 to assist with platform questions, service coordination, compliance support, and emergency situations.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                    <p className="text-gray-600 text-sm mb-2">24/7 support for all inquiries and emergencies</p>
                    <a href="tel:1800687682" className="text-blue-600 hover:text-blue-700 font-medium">
                      1800 NUROVA (1800 687 682)
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-gray-600 text-sm mb-2">Comprehensive support with response within 4 hours</p>
                    <a href="mailto:support@nurova.com.au" className="text-blue-600 hover:text-blue-700 font-medium">
                      support@nurova.com.au
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Headquarters</h3>
                    <p className="text-gray-600 text-sm">
                      Melbourne, Victoria, Australia<br />
                      Serving all states and territories
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Monday - Friday: 7:00 AM - 7:00 PM AEDT</p>
                      <p>Saturday: 8:00 AM - 5:00 PM AEDT</p>
                      <p>Sunday: 9:00 AM - 3:00 PM AEDT</p>
                      <p><strong>Emergency support: 24/7</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                <MessageCircle size={20} className="mr-2" />
                Emergency Support
              </h3>
              <p className="text-red-800 text-sm mb-4">
                For urgent safeguarding concerns or emergencies, contact us immediately:
              </p>
              <div className="space-y-2">
                <a href="tel:1800687682" className="block bg-red-600 text-white px-4 py-2 rounded-lg text-center font-medium hover:bg-red-700 transition-colors">
                  Call 1800 NUROVA
                </a>
                <a href="mailto:emergency@nurova.com.au" className="block bg-white text-red-600 px-4 py-2 rounded-lg text-center font-medium border border-red-600 hover:bg-red-50 transition-colors">
                  emergency@nurova.com.au
                </a>
              </div>
            </div>

            {/* Specialized Contact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Specialized Support</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Technical Support</p>
                  <a href="mailto:tech@nurova.com.au" className="text-blue-600 hover:text-blue-700">tech@nurova.com.au</a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Billing & Payment</p>
                  <a href="mailto:billing@nurova.com.au" className="text-blue-600 hover:text-blue-700">billing@nurova.com.au</a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Compliance & Quality</p>
                  <a href="mailto:compliance@nurova.com.au" className="text-blue-600 hover:text-blue-700">compliance@nurova.com.au</a>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Worker Applications</p>
                  <a href="mailto:applications@nurova.com.au" className="text-blue-600 hover:text-blue-700">applications@nurova.com.au</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label required">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label required">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="0400 000 000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label required">I am a...</label>
                    <select
                      className="form-input"
                      value={formData.userType}
                      onChange={(e) => handleInputChange('userType', e.target.value)}
                      required
                    >
                      <option value="">Select your role</option>
                      <option value="participant">NDIS Participant</option>
                      <option value="support_worker">Support Worker</option>
                      <option value="plan_manager">Plan Manager</option>
                      <option value="family_member">Family Member/Carer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label required">Subject</label>
                  <select
                    className="form-input"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general_inquiry">General Inquiry</option>
                    <option value="technical_support">Technical Support</option>
                    <option value="billing_payment">Billing & Payment</option>
                    <option value="service_request">Service Request</option>
                    <option value="compliance_issue">Compliance Issue</option>
                    <option value="worker_application">Worker Application</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="form-label required">Message</label>
                  <textarea
                    className="form-input"
                    rows={6}
                    placeholder="Please provide details about your inquiry..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="urgent"
                    className="mr-3"
                    checked={formData.urgent}
                    onChange={(e) => handleInputChange('urgent', e.target.checked)}
                  />
                  <label htmlFor="urgent" className="text-sm text-gray-700">
                    This is an urgent matter requiring immediate attention
                  </label>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Response Guarantee:</strong> We respond to all inquiries within 4 hours during business days. 
                    Urgent matters marked above receive immediate attention within 1 hour. Emergency situations are handled 24/7.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner mr-2" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I get started as an NDIS participant?</h3>
                <p className="text-gray-600 text-sm">
                  Simply click "Get Started" on our homepage, select "I need support services", and complete our guided 
                  registration process. You'll need your NDIS number, plan information, and basic contact details. 
                  Our team will verify your information and activate your account within 24 hours.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What's the support worker approval process?</h3>
                <p className="text-gray-600 text-sm">
                  Our comprehensive approval process takes 3-5 business days and includes document verification, 
                  background check confirmation, qualification review, and compliance assessment. We maintain 
                  the highest standards to ensure only qualified professionals join our network.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What documents are required for support workers?</h3>
                <p className="text-gray-600 text-sm">
                  Support workers need current NDIS Worker Screening, WWCC/Police Check, First Aid certification, 
                  relevant professional qualifications, professional indemnity insurance, and government-issued identification. 
                  Our team guides you through the entire process.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How does your matching process work?</h3>
                <p className="text-gray-600 text-sm">
                  Unlike automated marketplaces, our expert admin team manually reviews each service request 
                  and assigns the most suitable qualified worker based on expertise, location, availability, 
                  compliance status, and participant preferences. This ensures optimal matches every time.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How does billing and payment work?</h3>
                <p className="text-gray-600 text-sm">
                  Our platform handles all billing automatically with NDIS-compliant invoicing. Support workers 
                  submit timesheets through the platform, which are reviewed and approved by our admin team. 
                  Payments follow SCHADS Award rates with automatic penalty and allowance calculations.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do you handle complaints and feedback?</h3>
                <p className="text-gray-600 text-sm">
                  We take all feedback seriously and have comprehensive incident reporting procedures. 
                  Contact us immediately through this form, call our 24/7 support line, or use the emergency 
                  contact for urgent safeguarding concerns. All complaints are investigated thoroughly and resolved promptly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link>
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
            <Link to="/help" className="text-blue-600 hover:text-blue-700">Help Center</Link>
            <Link to="/about" className="text-blue-600 hover:text-blue-700">About Us</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactUs;