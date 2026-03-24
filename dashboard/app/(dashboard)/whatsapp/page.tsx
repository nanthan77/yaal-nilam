// @ts-nocheck
'use client';

import { useState } from 'react';
import {
  MessageCircle,
  Phone,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  User,
  Tag,
  Archive,
  Star,
  Filter,
  ChevronLeft,
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'inbound' | 'outbound';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Listing {
  id: string;
  title: string;
  location: string;
  price: string;
}

interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  whatsappStatus: 'online' | 'offline' | 'away';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  assignedAgent: string;
  agentAvatar: string;
  tags: string[];
  relatedListing?: Listing;
  isStarred: boolean;
  isArchived: boolean;
  messages: Message[];
}

// Mock conversations data
const mockConversations: Conversation[] = [
  {
    id: '1',
    customerId: 'cust_001',
    customerName: 'Aravinthan Kumar',
    customerPhone: '+94701234567',
    whatsappStatus: 'online',
    lastMessage: 'Can you send me the villa photos again? I want to show my family',
    lastMessageTime: '2:30 PM',
    unreadCount: 1,
    assignedAgent: 'Ravi Shankar',
    agentAvatar: 'RS',
    tags: ['Villa', 'Nallur'],
    relatedListing: {
      id: 'lst_001',
      title: 'Luxury Villa in Nallur',
      location: 'Nallur, Jaffna',
      price: 'Rs. 8,500,000',
    },
    isStarred: true,
    isArchived: false,
    messages: [
      {
        id: 'msg_1',
        text: 'Hi, I am interested in the villa you listed in Nallur',
        sender: 'inbound',
        timestamp: '10:15 AM',
        status: 'read',
      },
      {
        id: 'msg_2',
        text: 'Thank you for your interest! Here are the details and photos.',
        sender: 'outbound',
        timestamp: '10:30 AM',
        status: 'read',
      },
      {
        id: 'msg_3',
        text: 'Can you send me the villa photos again? I want to show my family',
        sender: 'inbound',
        timestamp: '2:30 PM',
        status: 'read',
      },
    ],
  },
  {
    id: '2',
    customerId: 'cust_002',
    customerName: 'Mallika Reddy',
    customerPhone: '+94702345678',
    whatsappStatus: 'online',
    lastMessage: 'When can we schedule a site visit?',
    lastMessageTime: '1:45 PM',
    unreadCount: 2,
    assignedAgent: 'Priya Nair',
    agentAvatar: 'PN',
    tags: ['Apartment', 'Jaffna Town'],
    relatedListing: {
      id: 'lst_002',
      title: 'Modern Apartment in Jaffna Town',
      location: 'Jaffna Town',
      price: 'Rs. 4,200,000',
    },
    isStarred: false,
    isArchived: false,
    messages: [
      {
        id: 'msg_1',
        text: 'Hi, is the apartment still available?',
        sender: 'inbound',
        timestamp: '11:00 AM',
        status: 'read',
      },
      {
        id: 'msg_2',
        text: 'Yes! It is available. Would you like more details?',
        sender: 'outbound',
        timestamp: '11:15 AM',
        status: 'read',
      },
      {
        id: 'msg_3',
        text: 'Yes please, can you send the floor plan and amenities list?',
        sender: 'inbound',
        timestamp: '11:30 AM',
        status: 'read',
      },
      {
        id: 'msg_4',
        text: 'Attached are the floor plan and amenities. Let me know if you have any questions.',
        sender: 'outbound',
        timestamp: '11:45 AM',
        status: 'delivered',
      },
      {
        id: 'msg_5',
        text: 'When can we schedule a site visit?',
        sender: 'inbound',
        timestamp: '1:45 PM',
        status: 'read',
      },
    ],
  },
  {
    id: '3',
    customerId: 'cust_003',
    customerName: 'Prakash Iyer',
    customerPhone: '+94703456789',
    whatsappStatus: 'away',
    lastMessage: 'Thank you for the information, will get back to you soon',
    lastMessageTime: '12:00 PM',
    unreadCount: 0,
    assignedAgent: 'Arjun Kumar',
    agentAvatar: 'AK',
    tags: ['Land', 'Chunnakam'],
    relatedListing: {
      id: 'lst_003',
      title: 'Agricultural Land in Chunnakam',
      location: 'Chunnakam, Jaffna',
      price: 'Rs. 2,100,000',
    },
    isStarred: false,
    isArchived: false,
    messages: [
      {
        id: 'msg_1',
        text: 'Hi, I am interested in the land plot in Chunnakam',
        sender: 'inbound',
        timestamp: '9:00 AM',
        status: 'read',
      },
      {
        id: 'msg_2',
        text: 'Thank you for your interest! The land is 2 acres and has good access roads.',
        sender: 'outbound',
        timestamp: '9:20 AM',
        status: 'read',
      },
    ],
  },
  {
    id: '4',
    customerId: 'cust_004',
    customerName: 'Nirupa Sharma',
    customerPhone: '+94704567890',
    whatsappStatus: 'offline',
    lastMessage: 'Perfect! Thank you for all your help',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    assignedAgent: 'Ravi Shankar',
    agentAvatar: 'RS',
    tags: ['Rental', 'Resolved'],
    relatedListing: {
      id: 'lst_004',
      title: 'Cozy House for Rent in Jaffna',
      location: 'Jaffna North',
      price: 'Rs. 15,000/month',
    },
    isStarred: false,
    isArchived: false,
    messages: [
      {
        id: 'msg_1',
        text: 'Hi, are there any rentals available near the beach?',
        sender: 'inbound',
        timestamp: 'Yesterday, 3:00 PM',
        status: 'read',
      },
      {
        id: 'msg_2',
        text: 'Yes! I have a cozy house for rent near the beach. Would you like to see it?',
        sender: 'outbound',
        timestamp: 'Yesterday, 3:15 PM',
        status: 'read',
      },
      {
        id: 'msg_3',
        text: 'Yes please! Can we arrange a viewing?',
        sender: 'inbound',
        timestamp: 'Yesterday, 3:30 PM',
        status: 'read',
      },
      {
        id: 'msg_4',
        text: 'Perfect! Thank you for all your help',
        sender: 'inbound',
        timestamp: 'Yesterday, 5:00 PM',
        status: 'read',
      },
    ],
  },
  {
    id: '5',
    customerId: 'cust_005',
    customerName: 'Jayatheeban Murthy',
    customerPhone: '+94705678901',
    whatsappStatus: 'online',
    lastMessage: 'Is the price negotiable?',
    lastMessageTime: '3:15 PM',
    unreadCount: 1,
    assignedAgent: 'Priya Nair',
    agentAvatar: 'PN',
    tags: ['Budget Discussion'],
    relatedListing: {
      id: 'lst_005',
      title: 'Semi-Detached House in Mullaitivu',
      location: 'Mullaitivu',
      price: 'Rs. 3,500,000',
    },
    isStarred: false,
    isArchived: false,
    messages: [
      {
        id: 'msg_1',
        text: 'Hi, what is the lowest price you can offer?',
        sender: 'inbound',
        timestamp: '2:00 PM',
        status: 'read',
      },
      {
        id: 'msg_2',
        text: 'The price is competitive for the location. Let me connect you with the owner.',
        sender: 'outbound',
        timestamp: '2:30 PM',
        status: 'read',
      },
      {
        id: 'msg_3',
        text: 'Is the price negotiable?',
        sender: 'inbound',
        timestamp: '3:15 PM',
        status: 'read',
      },
    ],
  },
  {
    id: '6',
    customerId: 'cust_006',
    customerName: 'Srinivasan Verma',
    customerPhone: '+94706789012',
    whatsappStatus: 'offline',
    lastMessage: 'Looking for premium villas in the area',
    lastMessageTime: '5 days ago',
    unreadCount: 0,
    assignedAgent: 'Ravi Shankar',
    agentAvatar: 'RS',
    tags: ['Premium', 'Villa Search'],
    relatedListing: {
      id: 'lst_006',
      title: 'Waterfront Villa in Nallur',
      location: 'Nallur Waterfront',
      price: 'Rs. 12,500,000',
    },
    isStarred: true,
    isArchived: true,
    messages: [
      {
        id: 'msg_1',
        text: 'Hi, looking for premium villas in the area',
        sender: 'inbound',
        timestamp: '5 days ago, 10:00 AM',
        status: 'read',
      },
      {
        id: 'msg_2',
        text: 'We have some excellent premium villas available. Let me send you the details.',
        sender: 'outbound',
        timestamp: '5 days ago, 10:30 AM',
        status: 'read',
      },
    ],
  },
];

export default function WhatsAppCRMPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversationId, setSelectedConversationId] = useState(conversations[0].id);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [showMobileList, setShowMobileList] = useState(true);

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  ) || conversations[0];

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'unread') return matchesSearch && conv.unreadCount > 0;
    if (filterType === 'starred') return matchesSearch && conv.isStarred;
    if (filterType === 'archived') return matchesSearch && conv.isArchived;
    return matchesSearch && !conv.isArchived;
  });

  // Sort by most recent
  const sortedConversations = [...filteredConversations].sort(
    (a, b) => conversations.indexOf(b) - conversations.indexOf(a)
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    setConversations(
      conversations.map((conv) => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            lastMessage: messageInput,
            lastMessageTime: 'now',
            messages: [
              ...conv.messages,
              {
                id: `msg_${Date.now()}`,
                text: messageInput,
                sender: 'outbound',
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                status: 'sent',
              },
            ],
          };
        }
        return conv;
      })
    );
    setMessageInput('');
  };

  const handleToggleStar = (convId: string) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === convId ? { ...conv, isStarred: !conv.isStarred } : conv
      )
    );
  };

  const handleToggleArchive = (convId: string) => {
    setConversations(
      conversations.map((conv) =>
        conv.id === convId ? { ...conv, isArchived: !conv.isArchived } : conv
      )
    );
  };

  const handleSelectConversation = (convId: string) => {
    setSelectedConversationId(convId);
    setShowMobileList(false);
  };

  const handleBackToList = () => {
    setShowMobileList(true);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* LEFT PANEL - Conversation List */}
      <div
        className={`${
          showMobileList ? 'w-full' : 'hidden'
        } md:w-1/3 border-r border-gray-200 flex flex-col bg-white md:flex`}
      >
        {/* Search and filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4 bg-gray-100 rounded-full px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'unread', 'starred', 'archived'].map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  setFilterType(filter as 'all' | 'unread' | 'starred' | 'archived')
                }
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterType === filter
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {sortedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <MessageCircle size={32} className="mb-2 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            sortedConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversationId === conv.id
                    ? 'bg-gray-50 border-l-4 border-l-teal-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <User size={20} className="text-teal-600" />
                    </div>
                    {/* Online status */}
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        conv.whatsappStatus === 'online'
                          ? 'bg-green-500'
                          : conv.whatsappStatus === 'away'
                            ? 'bg-yellow-500'
                            : 'bg-gray-300'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.customerName}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {conv.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right icons */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {conv.unreadCount > 0 && (
                      <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                        {conv.unreadCount}
                      </span>
                    )}
                    {conv.isStarred && <Star size={14} className="text-yellow-500 fill-yellow-500" />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Message Thread */}
      <div
        className={`${
          showMobileList ? 'hidden' : 'w-full'
        } md:w-2/3 flex flex-col bg-white md:flex`}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Back button on mobile */}
              <button
                onClick={handleBackToList}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>

              {/* Customer info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <User size={20} className="text-teal-600" />
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      selectedConversation.whatsappStatus === 'online'
                        ? 'bg-green-500'
                        : selectedConversation.whatsappStatus === 'away'
                          ? 'bg-yellow-500'
                          : 'bg-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConversation.customerName}
                  </h2>
                  <p className="text-xs text-gray-500">{selectedConversation.customerPhone}</p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone size={18} className="text-gray-600" />
              </button>
              <button
                onClick={() => handleToggleArchive(selectedConversationId)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Archive size={18} className="text-gray-600" />
              </button>
              <button
                onClick={() => handleToggleStar(selectedConversationId)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Star
                  size={18}
                  className={
                    selectedConversation.isStarred
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-600'
                  }
                />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Related listing card */}
        {selectedConversation.relatedListing && (
          <div className="mx-4 mt-4 p-3 border border-gray-200 rounded-lg bg-blue-50">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded flex items-center justify-center flex-shrink-0">
                <Tag size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {selectedConversation.relatedListing.title}
                </p>
                <p className="text-xs text-gray-600">{selectedConversation.relatedListing.location}</p>
                <p className="text-xs font-semibold text-teal-600">
                  {selectedConversation.relatedListing.price}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'outbound' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'outbound'
                    ? 'bg-teal-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs ${
                    message.sender === 'outbound' ? 'text-teal-100' : 'text-gray-600'
                  }`}
                >
                  <span>{message.timestamp}</span>
                  {message.sender === 'outbound' && (
                    <>
                      {message.status === 'read' && (
                        <CheckCheck size={14} className="text-blue-300" />
                      )}
                      {message.status === 'delivered' && (
                        <CheckCheck size={14} className="text-teal-100" />
                      )}
                      {message.status === 'sent' && <Check size={14} />}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compose bar */}
        <div className="border-t border-gray-200 p-4 bg-white">
          {/* Quick reply templates */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {['Thanks for inquiry', 'Available now', 'Will callback soon', 'Schedule visit?'].map(
              (template) => (
                <button
                  key={template}
                  onClick={() => setMessageInput(template)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full whitespace-nowrap transition-colors"
                >
                  {template}
                </button>
              )
            )}
          </div>

          {/* Message input area */}
          <div className="flex items-end gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <Paperclip size={18} className="text-gray-600" />
            </button>

            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 resize-none outline-none text-sm p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
              <Smile size={18} className="text-gray-600" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} className="text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
