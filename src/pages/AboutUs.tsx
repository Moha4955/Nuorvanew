import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/Layout/PublicLayout';
import { ArrowLeft, Heart, Shield, Users, Target, Award, CheckCircle, Star, TrendingUp } from 'lucide-react';

const AboutUs: React.FC = () => {
  const teamMembers = [
    {
      name: 'Sarah Mitchell',
      role: 'Chief Executive Officer',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Former NDIS Commission executive with 15+ years in disability services policy and regulation.'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Chief Technology Officer',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Healthcare technology specialist focused on accessible, compliant digital solutions.'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Head of Quality & Compliance',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Registered nurse and quality auditor ensuring platform meets highest NDIS standards.'
    },
    {
      name: 'James Thompson',
      role: 'Head of Support Services',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Experienced support coordinator with deep understanding of participant needs and worker challenges.'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Person-Centered Care',
      description: 'Every decision we make prioritizes the dignity, choice, and wellbeing of NDIS participants.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Quality & Safety',
      description: 'Rigorous compliance with NDIS standards ensures safe, high-quality support services.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Users,
      title: 'Community Connection',
      description: 'Building meaningful relationships between participants, workers, and the broader community.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Continuous Improvement',
      description: 'Constantly evolving our platform based on user feedback and industry best practices.',
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const achievements = [
    { metric: '2,500+', label: 'Active Participants', icon: Users },
    { metric: '1,200+', label: 'Qualified Workers', icon: Award },
    { metric: '98.5%', label: 'Satisfaction Rate', icon: Star },
    { metric: '50,000+', label: 'Services Delivered', icon: CheckCircle }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Company Founded',
      description: 'Nurova Australia established with vision to transform NDIS service coordination'
    },
    {
      year: '2023',
      title: 'Platform Development',
      description: 'Built comprehensive NDIS-compliant platform with focus on accessibility and compliance'
    },
    {
      year: '2024',
      title: 'Beta Launch',
      description: 'Successful pilot program with 100 participants and 50 support workers in Melbourne'
    },
    {
      year: '2024',
      title: 'NDIS Commission Approval',
      description: 'Received full approval from NDIS Quality and Safeguards Commission'
    },
    {
      year: '2025',
      title: 'National Expansion',
      description: 'Expanding services across all Australian states and territories'
    }
  ];

  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <div className="text-center">
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
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About Nurova Australia</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're Australia's leading technology-enabled NDIS platform, revolutionizing disability support 
              services through expert-curated matching, automated compliance, and unwavering commitment to 
              participant outcomes and worker success.
            </p>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              To revolutionize NDIS service delivery through technology that prioritizes quality, compliance, 
              and human dignity. We believe every Australian with disability deserves access to exceptional 
              support services that enable true independence, meaningful choice, and full community participation 
              through our expert-curated platform.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nurova Australia was founded by technology and disability services experts who recognized 
                that the NDIS ecosystem needed a platform that truly understood the complexities of quality 
                support coordination. Traditional marketplace models were failing participants who needed 
                quality assurance and support workers who deserved meaningful, sustainable careers.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                With decades of combined experience in disability services, healthcare technology, and NDIS 
                regulation, our founding team set out to build something fundamentally different. Instead of 
                another race-to-the-bottom marketplace, we created Australia's first quality-first platform 
                where expert admin-curated matching ensures participants receive exceptional support from 
                thoroughly vetted, compliant professionals.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we're proud to be Australia's fastest-growing NDIS platform, serving thousands of 
                participants and support workers across all states and territories. We maintain the highest 
                standards of quality and compliance while fostering genuine human connections that create 
                measurable improvements in participant independence and quality of life.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7551667/pexels-photo-7551667.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2" 
                alt="NDIS support services" 
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon size={32} className="text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{achievement.metric}</div>
                <div className="text-blue-100">{achievement.label}</div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-blue-500">
            <p className="text-blue-100 mb-4">
              Trusted by participants, support workers, and plan managers across Australia
            </p>
            <Link to="/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Join Our Community
            </Link>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-20 text-right mr-6">
                  <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance & Certifications */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Compliance & Certifications</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Shield size={48} className="mx-auto text-green-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">NDIS Commission Approved</h3>
              <p className="text-gray-600 text-sm">
                Fully approved by the NDIS Quality and Safeguards Commission for comprehensive service coordination and support worker management
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <Award size={48} className="mx-auto text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">ISO 27001 Certified</h3>
              <p className="text-gray-600 text-sm">
                Information security management system certified to the highest international standards for data protection
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <CheckCircle size={48} className="mx-auto text-purple-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Act Compliant</h3>
              <p className="text-gray-600 text-sm">
                Full compliance with Australian Privacy Principles, GDPR standards, and comprehensive data protection protocols
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your NDIS Experience?</h2>
          <p className="text-lg mb-6 text-green-100">
            Join Australia's most trusted NDIS platform and experience the difference that 
            technology-enabled, quality-first support coordination can make in your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Join Nurova Australia
            </Link>
            <Link to="/contact" className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors">
              Speak with Our Experts
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link>
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700">Contact Us</Link>
            <Link to="/help" className="text-blue-600 hover:text-blue-700">Help Center</Link>
            <Link to="/how-it-works" className="text-blue-600 hover:text-blue-700">How It Works</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutUs;