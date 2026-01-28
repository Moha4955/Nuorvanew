import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/Layout/PublicLayout';
import { Shield, Users, Calendar, FileText, ArrowRight, CheckCircle, Heart, Star, Award, Clock, MapPin, Phone, Mail, Zap, Target, TrendingUp, Globe, Smartphone, Monitor, Database, Lock, Headphones } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'NDIS Quality & Safeguards Compliant',
      description: 'Fully approved platform meeting all NDIS Commission standards with automated compliance tracking',
      image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
    },
    {
      icon: Users,
      title: 'Expert-Curated Matching',
      description: 'Our admin team manually reviews and assigns qualified workers based on expertise, location, and compliance',
      image: 'https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
    },
    {
      icon: Calendar,
      title: 'Comprehensive Service Management',
      description: 'End-to-end service coordination from request to completion with real-time tracking and communication',
      image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
    },
    {
      icon: FileText,
      title: 'Automated Compliance & Documentation',
      description: 'SCHADS Award calculations, NDIS-compliant invoicing, and comprehensive audit trails',
      image: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2'
    }
  ];

  const platformFeatures = [
    {
      icon: Database,
      title: 'Advanced Analytics',
      description: 'Real-time insights into service delivery, compliance rates, and participant outcomes'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, secure document storage, and comprehensive audit logging'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Full-featured mobile experience for participants and workers on the go'
    },
    {
      icon: Globe,
      title: 'Australia-Wide Coverage',
      description: 'Expanding across all states and territories with local compliance expertise'
    },
    {
      icon: Monitor,
      title: 'Real-Time Dashboard',
      description: 'Live updates on services, compliance status, and budget utilization'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock technical and emergency support for all platform users'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'NDIS Participant',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'Nurova Australia has completely transformed my NDIS experience. The quality of support workers and the seamless communication through the platform is exceptional. I finally feel in control of my support services.',
      rating: 5
    },
    {
      name: 'James Rodriguez',
      role: 'Support Worker',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'As a support worker, Nurova Australia makes my job so much easier. The compliance tracking is automated, payments are reliable, and I can focus on what matters most - providing quality support to participants.',
      rating: 5
    },
    {
      name: 'Rebecca Thompson',
      role: 'Plan Manager',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'The transparency and detailed reporting from Nurova Australia makes plan management incredibly efficient. The NDIS-compliant invoicing and real-time budget tracking are game-changers for our practice.',
      rating: 5
    }
  ];

  const stats = [
    { value: '3,500+', label: 'Active Participants', icon: Users },
    { value: '1,800+', label: 'Verified Workers', icon: Award },
    { value: '98.5%', label: 'Satisfaction Rate', icon: Star },
    { value: '99.9%', label: 'Platform Uptime', icon: Clock }
  ];

  const companyValues = [
    {
      icon: Heart,
      title: 'Person-Centered Care',
      description: 'Every decision prioritizes participant dignity, choice, and independence'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Rigorous vetting and ongoing compliance monitoring for all support workers'
    },
    {
      icon: Target,
      title: 'Outcome Focused',
      description: 'Measurable improvements in participant independence and quality of life'
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'Constantly evolving platform based on user feedback and industry best practices'
    }
  ];

  const industryRecognition = [
    {
      title: 'NDIS Quality & Safeguards Commission',
      subtitle: 'Approved Provider',
      description: 'Full approval for NDIS service coordination and support worker management',
      icon: Shield
    },
    {
      title: 'ISO 27001 Certified',
      subtitle: 'Information Security',
      description: 'International standard for information security management systems',
      icon: Lock
    },
    {
      title: 'Privacy Act Compliant',
      subtitle: 'Data Protection',
      description: 'Full compliance with Australian Privacy Principles and GDPR standards',
      icon: FileText
    }
  ];

  return (
    <PublicLayout>
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      {/* Enhanced Hero Section */}
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
              Australia's Leading<br />
              <span className="text-transparent bg-gradient-to-r from-blue-200 to-green-200 bg-clip-text" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                NDIS Platform
              </span>
            </h1>
            
            <p className="body-large text-blue-100 max-w-3xl mx-auto mb-12">
              Transform your NDIS journey with Australia's most advanced support coordination platform. 
              Expert-curated matching, automated compliance, and 24/7 support for participants and workers nationwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 hover-lift">
                <Users size={20} className="mr-3" />
                I Need Support Services
                <ArrowRight size={20} className="ml-3" />
              </Link>
              <Link to="/register" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center hover-lift">
                <Award size={20} className="mr-3" />
                I Provide Support Services
                <ArrowRight size={20} className="ml-3" />
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-4">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-white to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10">
          <div className="w-full h-full bg-gradient-to-tr from-white to-transparent rounded-full transform -translate-x-48 translate-y-48"></div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Zap size={16} className="mr-2" />
              Why Choose Nurova Australia
            </div>
            <h2 className="section-heading mb-6">
              The Complete NDIS Solution
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              From participant onboarding to worker compliance management, our platform handles 
              every aspect of NDIS service delivery with precision, transparency, and care.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover-lift group">
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <feature.icon size={24} className="text-blue-600" />
                    </div>
                  </div>
                </div>
                <h3 className="card-title mb-3">
                  {feature.title}
                </h3>
                <p className="body-regular">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Target size={16} className="mr-2" />
              Advanced Platform Features
            </div>
            <h2 className="section-heading mb-6">
              Technology That Makes a Difference
            </h2>
            <p className="body-large text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge platform combines the latest technology with deep NDIS expertise 
              to deliver an unparalleled experience for participants, workers, and administrators.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="card hover-lift text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="card-title mb-4">{feature.title}</h3>
                <p className="body-regular">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Heart size={16} className="mr-2" />
              Our Values
            </div>
            <h2 className="section-heading mb-6">
              What Drives Us Every Day
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Our core values guide every decision we make and every feature we build, 
              ensuring the NDIS community receives the highest quality support and service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="card hover-lift text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon size={32} className="text-white" />
                </div>
                <h3 className="card-title mb-4">{value.title}</h3>
                <p className="body-regular">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Recognition Section */}
      <section className="py-20 bg-white">
        <div className="container xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <Award size={16} className="mr-2" />
              Industry Recognition
            </div>
            <h2 className="section-heading mb-6">
              Trusted & Certified
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Our platform meets the highest industry standards for security, compliance, and quality assurance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {industryRecognition.map((recognition, index) => (
              <div key={index} className="card hover-lift text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <recognition.icon size={40} className="text-white" />
                </div>
                <h3 className="card-title mb-2">{recognition.title}</h3>
                <p className="text-sm font-medium text-green-600 mb-3">{recognition.subtitle}</p>
                <p className="body-regular">{recognition.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6">
              <Target size={16} className="mr-2" />
              Simple Process
            </div>
            <h2 className="section-heading mb-6">
              How Nurova Australia Works
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Our quality-first approach ensures every connection meets the highest NDIS standards
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-6 mt-1 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Register & Verify</h4>
                    <p className="body-regular text-gray-600">Complete your profile with our guided onboarding process. We verify all documentation and ensure NDIS compliance from day one.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-6 mt-1 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Expert Matching</h4>
                    <p className="body-regular text-gray-600">Our admin team manually reviews each request and assigns the most qualified, compliant worker based on expertise, location, and participant needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg mr-6 mt-1 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quality Service Delivery</h4>
                    <p className="body-regular text-gray-600">Receive exceptional support with full compliance tracking, automated invoicing, and continuous quality monitoring.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/how-it-works" className="btn-primary hover-lift">
                  <ArrowRight size={20} className="mr-2" />
                  Learn More About Our Process
                </Link>
              </div>
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <Star size={16} className="mr-2" />
              What Our Community Says
            </div>
            <h2 className="section-heading mb-6">
              Real Stories from Real People
            </h2>
            <p className="body-large text-gray-600 max-w-2xl mx-auto">
              Hear directly from NDIS participants, support workers, and plan managers about how 
              Nurova Australia has transformed their experience with disability support services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card hover-lift">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="body-regular text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="small-text text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="body-large text-gray-600 mb-6">
              Join thousands of satisfied participants and support workers
            </p>
            <Link to="/register" className="btn-primary hover-lift">
              <Users size={20} className="mr-2" />
              Start Your Journey Today
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1
        }}></div>
        
        <div className="container xl relative z-10 text-center text-white">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
            <TrendingUp size={16} className="mr-2" />
            Transform Your NDIS Experience
          </div>
          <h2 className="section-heading text-white mb-6">
            Ready to Experience the Future of NDIS Support?
          </h2>
          <p className="body-large text-blue-100 mb-12 max-w-3xl mx-auto">
            Join Australia's fastest-growing NDIS community and experience the difference that 
            technology-enabled, quality-first support coordination can make in your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center hover-lift">
              <Users size={20} className="mr-2" />
              Join Nurova Australia
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link to="/contact" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-200 inline-flex items-center justify-center hover-lift">
              <Phone size={20} className="mr-2" />
              Speak with Our Team
            </Link>
          </div>
        </div>
      </section>

      </div>
    </PublicLayout>
  );
};

export default LandingPage;