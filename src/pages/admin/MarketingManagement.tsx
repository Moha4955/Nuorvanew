import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import {
  Send,
  Mail,
  FileText,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Image,
  Link as LinkIcon,
  BarChart,
  Target,
  MessageSquare,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MarketingManagement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('newsletters');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    target_audience: [] as string[],
    schedule_date: '',
    status: 'draft' as 'draft' | 'scheduled' | 'sent' | 'published'
  });

  const newsletters = [
    {
      id: 'nl-001',
      title: 'January 2025 - NDIS Updates & Service Highlights',
      excerpt: 'Important updates on NDIS compliance, new service offerings, and success stories from our community.',
      status: 'sent',
      target_audience: ['participants', 'workers'],
      sent_date: '2025-01-05',
      opens: 847,
      clicks: 234,
      open_rate: 68.2,
      click_rate: 18.9,
      created_by: 'Marketing Team',
      recipients: 1242
    },
    {
      id: 'nl-002',
      title: 'Worker Excellence - December Recognition',
      excerpt: 'Celebrating our outstanding support workers and their dedication to quality care.',
      status: 'sent',
      target_audience: ['workers'],
      sent_date: '2024-12-28',
      opens: 523,
      clicks: 156,
      open_rate: 72.4,
      click_rate: 21.6,
      created_by: 'Admin Team',
      recipients: 722
    },
    {
      id: 'nl-003',
      title: 'February Service Updates - Important Information',
      excerpt: 'Upcoming changes to service delivery, new compliance requirements, and training opportunities.',
      status: 'scheduled',
      target_audience: ['participants', 'workers'],
      schedule_date: '2025-02-01',
      created_by: 'Compliance Team',
      recipients: 1354
    },
    {
      id: 'nl-004',
      title: 'Q1 2025 - Strategic Initiatives',
      excerpt: 'Preview of new features, platform improvements, and community engagement initiatives.',
      status: 'draft',
      target_audience: ['participants', 'workers'],
      created_by: 'Marketing Team',
      last_modified: '2025-01-14'
    }
  ];

  const blogs = [
    {
      id: 'blog-001',
      title: 'Understanding Your NDIS Plan: A Comprehensive Guide',
      excerpt: 'Everything you need to know about managing your NDIS plan effectively, from budget tracking to service coordination.',
      author: 'Dr. Sarah Williams',
      status: 'published',
      publish_date: '2025-01-10',
      views: 2847,
      shares: 156,
      comments: 43,
      category: 'Education',
      featured_image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      reading_time: '8 min'
    },
    {
      id: 'blog-002',
      title: 'Best Practices for Support Workers in 2025',
      excerpt: 'Essential guidelines and tips for providing exceptional care while maintaining NDIS compliance.',
      author: 'James Thompson',
      status: 'published',
      publish_date: '2025-01-08',
      views: 1923,
      shares: 98,
      comments: 67,
      category: 'Professional Development',
      featured_image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg',
      reading_time: '6 min'
    },
    {
      id: 'blog-003',
      title: 'Mental Health Support During Challenging Times',
      excerpt: 'Practical strategies and resources for maintaining wellbeing for both participants and support workers.',
      author: 'Dr. Michael Chen',
      status: 'published',
      publish_date: '2025-01-05',
      views: 3421,
      shares: 234,
      comments: 89,
      category: 'Wellness',
      featured_image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      reading_time: '10 min'
    },
    {
      id: 'blog-004',
      title: 'Technology in NDIS: Digital Transformation',
      excerpt: 'How technology is revolutionizing disability support services and improving outcomes.',
      author: 'Tech Team',
      status: 'draft',
      last_modified: '2025-01-14',
      category: 'Innovation',
      reading_time: '7 min'
    }
  ];

  const announcements = [
    {
      id: 'ann-001',
      title: 'Platform Maintenance - January 20, 2025',
      content: 'Scheduled system maintenance from 2:00 AM to 4:00 AM AEDT. Limited functionality during this time.',
      priority: 'high',
      target_audience: ['participants', 'workers'],
      status: 'active',
      start_date: '2025-01-15',
      end_date: '2025-01-20',
      views: 1547
    },
    {
      id: 'ann-002',
      title: 'New Compliance Training Available',
      content: 'Updated NDIS Quality and Safeguards training modules now available for all support workers.',
      priority: 'medium',
      target_audience: ['workers'],
      status: 'active',
      start_date: '2025-01-10',
      end_date: '2025-02-28',
      views: 892
    }
  ];

  const tabs = [
    { id: 'newsletters', name: 'Newsletters', icon: Mail, count: newsletters.length },
    { id: 'blogs', name: 'Blog Posts', icon: FileText, count: blogs.length },
    { id: 'announcements', name: 'Announcements', icon: MessageSquare, count: announcements.length },
    { id: 'analytics', name: 'Analytics', icon: BarChart, count: 0 }
  ];

  const handleCreate = async () => {
    try {
      setLoading(true);
      toast.success(`${activeTab === 'newsletters' ? 'Newsletter' : 'Blog post'} created successfully`);
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        target_audience: [],
        schedule_date: '',
        status: 'draft'
      });
    } catch (error) {
      toast.error('Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AU').format(num);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing & Communications</h1>
            <p className="text-gray-600 mt-1">Manage newsletters, blog posts, and announcements</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Create {activeTab === 'newsletters' ? 'Newsletter' : activeTab === 'blogs' ? 'Blog Post' : 'Announcement'}
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sent</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Send size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">71.3%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Eye size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reach</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">8.2k</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users size={24} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">+23%</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="content-card-body">
            {activeTab === 'newsletters' && (
              <div className="space-y-4">
                {newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{newsletter.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            newsletter.status === 'sent' ? 'bg-green-100 text-green-800' :
                            newsletter.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {newsletter.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{newsletter.excerpt}</p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          {newsletter.sent_date && (
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              Sent: {new Date(newsletter.sent_date).toLocaleDateString('en-AU')}
                            </div>
                          )}
                          {newsletter.schedule_date && (
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              Scheduled: {new Date(newsletter.schedule_date).toLocaleDateString('en-AU')}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {newsletter.recipients} recipients
                          </div>
                          <div className="flex gap-2">
                            {newsletter.target_audience.map(audience => (
                              <span key={audience} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                {audience}
                              </span>
                            ))}
                          </div>
                        </div>

                        {newsletter.status === 'sent' && (
                          <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-xs text-gray-600">Opens</p>
                              <p className="text-lg font-bold text-gray-900">{formatNumber(newsletter.opens || 0)}</p>
                              <p className="text-xs text-gray-500">{newsletter.open_rate}% rate</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Clicks</p>
                              <p className="text-lg font-bold text-gray-900">{formatNumber(newsletter.clicks || 0)}</p>
                              <p className="text-xs text-gray-500">{newsletter.click_rate}% rate</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Created By</p>
                              <p className="text-sm font-medium text-gray-900">{newsletter.created_by}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
                      <button className="btn-secondary text-sm">
                        <Eye size={14} className="mr-2" />
                        View
                      </button>
                      {newsletter.status !== 'sent' && (
                        <>
                          <button className="btn-secondary text-sm">
                            <Edit size={14} className="mr-2" />
                            Edit
                          </button>
                          <button className="btn-secondary text-sm">
                            <Send size={14} className="mr-2" />
                            Send Now
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'blogs' && (
              <div className="grid md:grid-cols-2 gap-6">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    {blog.featured_image && (
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {blog.category}
                        </span>
                        {blog.reading_time && (
                          <span className="text-xs text-gray-500">
                            <Clock size={12} className="inline mr-1" />
                            {blog.reading_time}
                          </span>
                        )}
                        <span className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                          blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {blog.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>

                      {blog.author && (
                        <p className="text-xs text-gray-500 mb-4">By {blog.author}</p>
                      )}

                      {blog.status === 'published' && (
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {formatNumber(blog.views || 0)} views
                          </div>
                          <div className="flex items-center">
                            <MessageSquare size={12} className="mr-1" />
                            {blog.comments} comments
                          </div>
                          <div className="flex items-center">
                            <Globe size={12} className="mr-1" />
                            {blog.shares} shares
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button className="btn-secondary text-sm flex-1">
                          <Eye size={14} className="mr-2" />
                          View
                        </button>
                        <button className="btn-secondary text-sm flex-1">
                          <Edit size={14} className="mr-2" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'announcements' && (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        announcement.priority === 'high' ? 'bg-red-100' :
                        announcement.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <MessageSquare size={24} className={
                          announcement.priority === 'high' ? 'text-red-600' :
                          announcement.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        } />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                            announcement.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {announcement.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-4">{announcement.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div>Active: {announcement.start_date} to {announcement.end_date}</div>
                          <div>{formatNumber(announcement.views)} views</div>
                          <div className="flex gap-1">
                            {announcement.target_audience.map(audience => (
                              <span key={audience} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                {audience}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary text-sm">
                          <Edit size={14} />
                        </button>
                        <button className="btn-secondary text-sm text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="py-12 text-center">
                <BarChart size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">Detailed engagement metrics and performance analytics coming soon</p>
              </div>
            )}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create {activeTab === 'newsletters' ? 'Newsletter' : activeTab === 'blogs' ? 'Blog Post' : 'Announcement'}
                  </h2>
                  <p className="text-gray-600">Engage your community with valuable content</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Enter title..."
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt / Summary
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="Brief summary..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="input"
                    rows={12}
                    placeholder="Write your content here..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Rich text editor will be available soon</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <div className="space-y-2">
                      {['participants', 'workers', 'admins'].map(audience => (
                        <label key={audience} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="mr-3"
                            checked={formData.target_audience.includes(audience)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  target_audience: [...prev.target_audience, audience]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  target_audience: prev.target_audience.filter(a => a !== audience)
                                }));
                              }
                            }}
                          />
                          <span className="capitalize">{audience}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={formData.schedule_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, schedule_date: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                <button onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !formData.title || !formData.content}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create & Send'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MarketingManagement;
