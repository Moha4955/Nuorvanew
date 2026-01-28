import React, { useState } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { 
  MessageCircle, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Shield,
  User,
  Calendar
} from 'lucide-react';

const WorkerMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'NDIS Participant',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'Thank you for the great session today! The meal prep was very helpful.',
      timestamp: '1 hour ago',
      unread: 1,
      online: true,
      serviceType: 'Daily Living Support',
      nextSession: '2025-01-20 10:00 AM',
      riskLevel: 'low'
    },
    {
      id: '2',
      name: 'Robert Smith',
      role: 'NDIS Participant',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'Could we reschedule tomorrow\'s session to 2 PM instead?',
      timestamp: '3 hours ago',
      unread: 2,
      online: false,
      serviceType: 'Community Access',
      nextSession: '2025-01-18 9:00 AM',
      riskLevel: 'medium'
    },
    {
      id: '3',
      name: 'Admin Support',
      role: 'Administrator',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'Your First Aid certification expires in 30 days. Please upload renewal.',
      timestamp: '1 day ago',
      unread: 1,
      online: true,
      serviceType: 'Compliance Alert',
      nextSession: null,
      riskLevel: null
    },
    {
      id: '4',
      name: 'Maria Garcia',
      role: 'NDIS Participant',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      lastMessage: 'Muchas gracias for your patience and cultural sensitivity.',
      timestamp: '2 days ago',
      unread: 0,
      online: false,
      serviceType: 'Personal Care',
      nextSession: '2025-01-19 8:00 AM',
      riskLevel: 'high'
    }
  ];

  const getMessages = (conversationId: string) => {
    const messageData: Record<string, any[]> = {
      '1': [
        {
          id: '1',
          senderId: '1',
          senderName: 'Sarah Johnson',
          content: 'Hi Michael! Looking forward to our session tomorrow. Could you help me with meal preparation again?',
          timestamp: 'Today 9:00 AM',
          type: 'text',
          read: true
        },
        {
          id: '2',
          senderId: 'me',
          senderName: 'You',
          content: 'Absolutely! I\'ll bring some new vegetarian protein recipes we can try together.',
          timestamp: 'Today 9:15 AM',
          type: 'text',
          read: true
        },
        {
          id: '3',
          senderId: '1',
          senderName: 'Sarah Johnson',
          content: 'That sounds perfect! I\'ve been wanting to learn more healthy recipes.',
          timestamp: 'Today 9:30 AM',
          type: 'text',
          read: true
        },
        {
          id: '4',
          senderId: 'me',
          senderName: 'You',
          content: 'Great! I\'ll also bring my usual first aid kit and we can review your medication schedule.',
          timestamp: 'Today 2:00 PM',
          type: 'text',
          read: true
        },
        {
          id: '5',
          senderId: '1',
          senderName: 'Sarah Johnson',
          content: 'Thank you for the great session today! The meal prep was very helpful.',
          timestamp: '1 hour ago',
          type: 'text',
          read: false
        }
      ],
      '2': [
        {
          id: '1',
          senderId: '2',
          senderName: 'Robert Smith',
          content: 'Hello Michael, I hope you\'re well. I wanted to discuss tomorrow\'s community access session.',
          timestamp: 'Today 10:00 AM',
          type: 'text',
          read: true
        },
        {
          id: '2',
          senderId: 'me',
          senderName: 'You',
          content: 'Hi Robert! Yes, we\'re scheduled for 9 AM at Westfield. What would you like to focus on?',
          timestamp: 'Today 10:30 AM',
          type: 'text',
          read: true
        },
        {
          id: '3',
          senderId: '2',
          senderName: 'Robert Smith',
          content: 'I need to pick up my prescription and do some grocery shopping. Could we reschedule tomorrow\'s session to 2 PM instead?',
          timestamp: '3 hours ago',
          type: 'text',
          read: false
        },
        {
          id: '4',
          senderId: '2',
          senderName: 'Robert Smith',
          content: 'I have a medical appointment in the morning that might run late.',
          timestamp: '3 hours ago',
          type: 'text',
          read: false
        }
      ],
      '3': [
        {
          id: '1',
          senderId: '3',
          senderName: 'Admin Support',
          content: 'Hello Michael, this is a reminder that your First Aid certification expires on February 28, 2025.',
          timestamp: '1 day ago',
          type: 'system',
          read: false
        },
        {
          id: '2',
          senderId: '3',
          senderName: 'Admin Support',
          content: 'Your First Aid certification expires in 30 days. Please upload renewal.',
          timestamp: '1 day ago',
          type: 'system',
          read: false
        },
        {
          id: '3',
          senderId: '3',
          senderName: 'Admin Support',
          content: 'You can upload your new certificate through the Compliance section of your dashboard.',
          timestamp: '1 day ago',
          type: 'system',
          read: false
        }
      ],
      '4': [
        {
          id: '1',
          senderId: 'me',
          senderName: 'You',
          content: 'Hola Maria! I\'m looking forward to our session tomorrow morning.',
          timestamp: '2 days ago',
          type: 'text',
          read: true
        },
        {
          id: '2',
          senderId: '4',
          senderName: 'Maria Garcia',
          content: 'Hola Michael! Sí, I am ready. Please remember to bring the mobility equipment.',
          timestamp: '2 days ago',
          type: 'text',
          read: true
        },
        {
          id: '3',
          senderId: 'me',
          senderName: 'You',
          content: 'Of course! I have all the equipment ready and I\'ll be there at 8 AM sharp.',
          timestamp: '2 days ago',
          type: 'text',
          read: true
        },
        {
          id: '4',
          senderId: '4',
          senderName: 'Maria Garcia',
          content: 'Muchas gracias for your patience and cultural sensitivity.',
          timestamp: '2 days ago',
          type: 'text',
          read: true
        }
      ]
    };
    return messageData[conversationId] || [];
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const messages = getMessages(selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  const getRiskLevelColor = (level: string | null) => {
    if (!level) return '';
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)]">
        <div className="content-card h-full">
          <div className="flex h-full">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="form-input pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-green-50 border-r-4 border-r-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                          <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{conversation.role}</p>
                        <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              {conversation.serviceType}
                            </span>
                            {conversation.riskLevel && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(conversation.riskLevel)}`}>
                                {conversation.riskLevel} risk
                              </span>
                            )}
                          </div>
                          {conversation.unread > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        {conversation.nextSession && (
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            Next: {conversation.nextSession}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={selectedConv.avatar}
                            alt={selectedConv.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          {selectedConv.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">{selectedConv.name}</h2>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-600">
                              {selectedConv.role} • {selectedConv.online ? 'Online' : 'Offline'}
                            </p>
                            {selectedConv.riskLevel && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(selectedConv.riskLevel)}`}>
                                {selectedConv.riskLevel} risk
                              </span>
                            )}
                          </div>
                          {selectedConv.nextSession && (
                            <p className="text-xs text-gray-500 mt-1">
                              Next session: {selectedConv.nextSession}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Phone size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <Video size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                          message.senderId === 'me'
                            ? 'bg-green-500 text-white'
                            : message.type === 'system'
                            ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {message.type === 'system' && (
                            <div className="flex items-center mb-2">
                              <Shield size={14} className="text-indigo-600 mr-2" />
                              <span className="text-xs font-medium text-indigo-700">System Notification</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-between mt-2 ${
                            message.senderId === 'me' ? 'text-green-100' : 
                            message.type === 'system' ? 'text-indigo-600' : 'text-gray-500'
                          }`}>
                            <span className="text-xs">{message.timestamp}</span>
                            {message.senderId === 'me' && (
                              <div className="ml-2">
                                {message.read ? (
                                  <CheckCircle size={12} />
                                ) : (
                                  <Clock size={12} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Paperclip size={20} />
                      </button>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="form-input pr-12"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <Smile size={16} />
                        </button>
                      </div>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2 mt-3">
                      <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
                        Confirm Session
                      </button>
                      <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors">
                        Request Reschedule
                      </button>
                      <button className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors">
                        Report Concern
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerMessages;