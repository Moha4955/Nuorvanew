import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/Layout/PublicLayout';
import { ArrowLeft, Search, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronRight, Users, Shield, Calendar, FileText, DollarSign, Settings } from 'lucide-react';

const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      articles: [
        { title: 'How to register as an NDIS participant', views: 1250 },
        { title: 'Support worker application process', views: 890 },
        { title: 'Document requirements and verification', views: 756 },
        { title: 'Setting up your profile', views: 634 },
        { title: 'Understanding NDIS compliance', views: 523 }
      ]
    },
    {
      id: 'services',
      title: 'Service Management',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      articles: [
        { title: 'How to request support services', views: 945 },
        { title: 'Understanding service assignments', views: 723 },
        { title: 'Cancelling or rescheduling services', views: 612 },
        { title: 'Service quality and feedback', views: 456 },
        { title: 'Emergency service requests', views: 334 }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance & Safety',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      articles: [
        { title: 'NDIS Worker Screening requirements', views: 834 },
        { title: 'Maintaining compliance status', views: 678 },
        { title: 'Document expiry notifications', views: 567 },
        { title: 'Incident reporting procedures', views: 445 },
        { title: 'Safety protocols and guidelines', views: 389 }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Invoicing',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      articles: [
        { title: 'Understanding NDIS pricing', views: 723 },
        { title: 'SCHADS Award rates and calculations', views: 656 },
        { title: 'Invoice processing and payments', views: 589 },
        { title: 'Plan manager invoicing', views: 467 },
        { title: 'Payment disputes and resolution', views: 234 }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Settings,
      color: 'from-indigo-500 to-indigo-600',
      articles: [
        { title: 'Troubleshooting login issues', views: 567 },
        { title: 'Mobile app functionality', views: 445 },
        { title: 'Document upload problems', views: 389 },
        { title: 'Notification settings', views: 334 },
        { title: 'Browser compatibility', views: 223 }
      ]
    },
    {
      id: 'messaging',
      title: 'Communication',
      icon: MessageCircle,
      color: 'from-pink-500 to-pink-600',
      articles: [
        { title: 'Using the messaging system', views: 456 },
        { title: 'Communication guidelines', views: 389 },
        { title: 'Privacy and confidentiality', views: 334 },
        { title: 'Emergency contact procedures', views: 278 },
        { title: 'Professional boundaries', views: 223 }
      ]
    }
  ];

  const popularArticles = [
    { title: 'How to register as an NDIS participant', category: 'Getting Started', views: 1250 },
    { title: 'How to request support services', category: 'Service Management', views: 945 },
    { title: 'Support worker application process', category: 'Getting Started', views: 890 },
    { title: 'NDIS Worker Screening requirements', category: 'Compliance & Safety', views: 834 },
    { title: 'Document requirements and verification', category: 'Getting Started', views: 756 }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0 || searchQuery === '');

  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Comprehensive support resources, step-by-step guides, and expert assistance 
              to help you make the most of your NDIS experience with Nurova Australia.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search help articles, guides, and FAQs..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <Phone size={32} className="mx-auto text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Phone Support</h3>
            <p className="text-gray-600 text-sm mb-4">Immediate assistance for all inquiries and emergencies</p>
            <a href="tel:1800687682" className="btn-primary text-sm">
              Call 1800 NUROVA
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <Mail size={32} className="mx-auto text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Expert Email Support</h3>
            <p className="text-gray-600 text-sm mb-4">Detailed responses within 4 hours</p>
            <a href="mailto:support@nurova.com.au" className="btn-secondary text-sm">
              Send Email
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <MessageCircle size={32} className="mx-auto text-purple-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Expert Chat</h3>
            <p className="text-gray-600 text-sm mb-4">Real-time assistance from NDIS specialists</p>
            <button className="btn-secondary text-sm">
              Start Chat
            </button>
          </div>
        </div>

        {/* Popular Articles */}
        {searchQuery === '' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
            <div className="space-y-4">
              {popularArticles.map((article, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div>
                    <h3 className="font-medium text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-500">{article.category}</p>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <span className="text-sm mr-2">{article.views} views</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div 
                className={`bg-gradient-to-br ${category.color} p-6 text-white cursor-pointer`}
                onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <category.icon size={24} className="mr-3" />
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                  </div>
                  {expandedCategory === category.id ? 
                    <ChevronDown size={20} /> : 
                    <ChevronRight size={20} />
                  }
                </div>
                <p className="text-sm opacity-90 mt-2">{category.articles.length} articles</p>
              </div>
              
              {expandedCategory === category.id && (
                <div className="p-6">
                  <div className="space-y-3">
                    {category.articles.map((article, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{article.title}</h4>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <span className="text-xs mr-2">{article.views}</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Emergency Support */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Emergency & Safeguarding Support</h2>
            <p className="text-red-800 mb-6">
              For urgent safeguarding concerns, medical emergencies, or critical incidents requiring immediate attention
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:1800687682" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                24/7 Emergency Hotline: 1800 NUROVA
              </a>
              <a href="mailto:emergency@nurova.com.au" className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold border border-red-600 hover:bg-red-50 transition-colors">
                emergency@nurova.com.au
              </a>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <Book size={32} className="text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive User Guides</h3>
            <p className="text-gray-600 mb-4">
              Step-by-step guides and video tutorials for maximizing your Nurova Australia experience
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">Complete Participant Guide & Video Tutorials</Link></li>
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">Support Worker Comprehensive Handbook</Link></li>
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">Plan Manager Integration Guide</Link></li>
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">NDIS Compliance & Quality Standards</Link></li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <FileText size={32} className="text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">NDIS Resources & Links</h3>
            <p className="text-gray-600 mb-4">
              Essential NDIS resources, regulatory information, and external support links
            </p>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">NDIS Quality & Safeguards Commission</Link></li>
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">SCHADS Award Rates & Classifications</Link></li>
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">Worker Screening Unit Portal</Link></li>
              <li><Link to="#" className="text-blue-600 hover:text-blue-700">Disability Advocacy & Rights Resources</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HelpCenter;