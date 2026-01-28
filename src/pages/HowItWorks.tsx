import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/Layout/PublicLayout';
import { ArrowLeft, Users, Shield, Calendar, CheckCircle, Heart, Award, Clock, MessageCircle, FileText, DollarSign, Star, Target, TrendingUp } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Register & Verify',
      description: 'Create your account and complete identity verification',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      details: [
        'Choose your role (Participant or Support Worker)',
        'Complete identity verification process',
        'Upload required documentation',
        'Admin team reviews and approves your profile'
      ]
    },
    {
      step: 2,
      title: 'Profile Setup',
      description: 'Complete your comprehensive profile with preferences',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      image: 'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      details: [
        'Add personal details and preferences',
        'Upload compliance documents (workers)',
        'Set availability and service categories',
        'Complete NDIS-specific requirements'
      ]
    },
    {
      step: 3,
      title: 'Quality Matching',
      description: 'Our admin team carefully matches participants with workers',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      details: [
        'Participants request support services',
        'Admin reviews qualifications and compliance',
        'Manual assignment based on expertise and location',
        'Quality-first approach ensures best matches'
      ]
    },
    {
      step: 4,
      title: 'Service Delivery',
      description: 'Receive or provide high-quality NDIS support services',
      icon: CheckCircle,
      color: 'from-indigo-500 to-indigo-600',
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
      details: [
        'Confirmed service appointments',
        'Real-time communication between parties',
        'Service delivery with full compliance',
        'Automatic timesheet and invoice generation'
      ]
    }
  ];

  const participantFlow = [
    { title: 'Request Service', description: 'Submit detailed service requirements', icon: Calendar },
    { title: 'Admin Review', description: 'Our team reviews and assigns qualified worker', icon: Shield },
    { title: 'Service Confirmation', description: 'Receive confirmation with worker details', icon: CheckCircle },
    { title: 'Service Delivery', description: 'Receive support from qualified professional', icon: Heart },
    { title: 'Payment Processing', description: 'Automatic NDIS-compliant invoicing', icon: DollarSign }
  ];

  const workerFlow = [
    { title: 'Application', description: 'Submit comprehensive application with documents', icon: FileText },
    { title: 'Verification', description: 'Admin verifies qualifications and compliance', icon: Shield },
    { title: 'Assignment', description: 'Receive shift assignments based on expertise', icon: Calendar },
    { title: 'Service Delivery', description: 'Provide quality support to participants', icon: Heart },
    { title: 'Payment', description: 'Receive payment via SCHADS Award rates', icon: DollarSign }
  ];

  const benefits = [
    'NDIS Worker Screening verification',
    'SCHADS Award compliance',
    'End-to-end service management',
    'Secure messaging system',
    'Transparent invoicing',
    'Document management'
  ];

  const faqs = [
    {
      question: 'How long does the approval process take?',
      answer: 'Participant approval typically takes 24-48 hours. Support worker applications take 3-5 business days due to comprehensive document verification and background checks.'
    },
    {
      question: 'What makes your matching different?',
      answer: 'Unlike marketplace platforms, we use admin-curated matching. Our team manually reviews each request and assigns the most qualified, compliant worker based on expertise, location, and availability.'
    },
    {
      question: 'How do payments work?',
      answer: 'All payments are processed through our NDIS-compliant system with automatic SCHADS Award rate calculations, GST handling, and direct invoicing to participants or plan managers.'
    },
    {
      question: 'What documents do support workers need?',
      answer: 'NDIS Worker Screening, WWCC/Police Check, First Aid certification, professional qualifications, and identification. All documents must be current and verified by our admin team.'
    }
  ];

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}></div>
        
        <div className="container xl relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
              <Award size={16} className="mr-2" />
              NDIS Quality & Safeguards Commission Approved
            </div>
            
            <h1 className="display-text mb-6">
              Quality NDIS Support<br />
              <span className="text-transparent bg-gradient-to-r from-blue-200 to-green-200 bg-clip-text" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                Connections
              </span>
            </h1>
            
            <p className="body-large text-blue-100 max-w-3xl mx-auto mb-12">
              Connect with qualified support workers through Australia's most comprehensive 
              NDIS compliance platform. Quality-first matching for better outcomes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 hover-lift">
                <Users size={20} className="mr-3" />
                I Need Support Services
              </Link>
              <Link to="/register" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center hover-lift">
                <Award size={20} className="mr-3" />
                I Provide Support Services
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <Users size={24} />
                </div>
                <div className="text-3xl font-bold mb-2">2,500+</div>
                <div className="text-sm text-blue-200">Active Participants</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <Award size={24} />
                </div>
                <div className="text-3xl font-bold mb-2">1,200+</div>
                <div className="text-sm text-blue-200">Qualified Workers</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <Star size={24} />
                </div>
                <div className="text-3xl font-bold mb-2">98.5%</div>
                <div className="text-sm text-blue-200">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                  <Clock size={24} />
                </div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm text-blue-200">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Process */}
      <section className="py-20 bg-white">
        <div className="container xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Target size={16} className="mr-2" />
              Simple Process
            </div>
            <h2 className="section-heading mb-6">How Nurova Australia Works</h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Our quality-first approach ensures every connection meets the highest NDIS standards
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card hover-lift group">
                  <div className="relative mb-6 overflow-hidden rounded-lg">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                        {step.step}
                      </div>
                    </div>
                  </div>
                  <h3 className="card-title mb-3">{step.title}</h3>
                  <p className="body-regular mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Flows */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Participant Flow */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For NDIS Participants</h3>
                <p className="text-gray-600">Simple steps to access quality support services</p>
              </div>
              
              <div className="space-y-6">
                {participantFlow.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <item.icon size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Flow */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={32} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Support Workers</h3>
                <p className="text-gray-600">Professional pathway to meaningful work</p>
              </div>
              
              <div className="space-y-6">
                {workerFlow.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <item.icon size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
                <CheckCircle size={16} className="mr-2" />
                Platform Benefits
              </div>
              <h2 className="section-heading mb-6">
                Complete NDIS Support Ecosystem
              </h2>
              <p className="body-large text-gray-600 mb-8">
                From participant onboarding to support worker compliance, our platform 
                handles every aspect of NDIS service delivery with precision and care.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <span className="body-regular text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/register" className="btn-primary hover-lift">
                Start Your Journey
              </Link>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2" 
                alt="NDIS support services" 
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container xl">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-6">Frequently Asked Questions</h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our NDIS platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}></div>
        
        <div className="container xl relative z-10 text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
            <TrendingUp size={16} className="mr-2" />
            Join Our Growing Community
          </div>
          <h2 className="section-heading text-white mb-6">
            Ready to Experience Quality NDIS Support?
          </h2>
          <p className="body-large text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of participants and support workers who trust Nurova Australia 
            for their NDIS service coordination needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center hover-lift">
              <Users size={20} className="mr-2" />
              Get Started Today
            </Link>
            <Link to="/contact" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200 inline-flex items-center justify-center hover-lift">
              <MessageCircle size={20} className="mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      </div>
    </PublicLayout>
  );
};

export default HowItWorks;