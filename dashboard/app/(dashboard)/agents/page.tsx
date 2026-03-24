'use client';

import { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Search,
  Download,
  UserPlus,
  MapPin,
  Mail,
  Phone,
  Building,
  TrendingUp,
  Eye,
  Shield,
  MessageSquare,
  X,
  FileUp,
  Award,
  Home,
  MessageCircle,
  Target,
} from 'lucide-react';
import { MOCK_AGENTS, AGENT_PERFORMANCE } from '@/lib/mock-data';

interface Agent {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatar?: string;
  verified: boolean;
  nic_uploaded: boolean;
  active_listings: number;
  total_inquiries: number;
  response_rate: number;
  rating?: number;
  service_areas: string[];
  specializations: string[];
  joined_date: string;
  status: string;
  recentActivity?: string;
}

interface AgentStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  topPerformer: Agent | null;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-cyan-500',
    'bg-indigo-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
    </div>
    {trend && <p className="text-xs text-green-600 mt-2">↑ {trend}</p>}
  </div>
);

const AgentAvatar = ({ name }: { name: string }) => (
  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${getAvatarColor(name)}`}>
    {getInitials(name)}
  </div>
);

const StarRating = ({ rating }: { rating?: number }) => {
  const r = rating || 0;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < Math.floor(r) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-xs text-gray-600 ml-1">{r.toFixed(1)}</span>
    </div>
  );
};

const ResponseRateBar = ({ rate }: { rate: number }) => {
  const getColor = (rate: number) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${getColor(rate)}`} style={{ width: `${rate}%` }} />
      </div>
      <span className="text-sm font-medium text-gray-700 w-10">{rate}%</span>
    </div>
  );
};

const AgentCard = ({ agent, onViewDetails }: { agent: Agent; onViewDetails: (agent: Agent) => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <AgentAvatar name={agent.name} />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
            {agent.verified ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Clock className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <p className="text-sm text-gray-600">{agent.company}</p>
        </div>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          agent.status === 'active'
            ? 'bg-green-100 text-green-700'
            : agent.status === 'pending'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
        }`}
      >
        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
      </span>
    </div>

    <div className="space-y-3 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <FileUp className="w-4 h-4 text-gray-400" />
        <span className="text-gray-600">
          NIC: <span className={agent.nic_uploaded ? 'text-green-600 font-medium' : 'text-red-600'}>{agent.nic_uploaded ? 'Uploaded' : 'Not Uploaded'}</span>
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-gray-600">Active Listings</p>
        <p className="text-lg font-bold text-gray-900">{agent.active_listings}</p>
      </div>
      <div className="bg-gray-50 p-2 rounded">
        <p className="text-gray-600">Inquiries</p>
        <p className="text-lg font-bold text-gray-900">{agent.total_inquiries}</p>
      </div>
    </div>

    <div className="mb-4">
      <p className="text-xs text-gray-600 mb-2">Response Rate</p>
      <ResponseRateBar rate={agent.response_rate} />
    </div>

    <div className="mb-4">
      <p className="text-xs text-gray-600 mb-2">Rating</p>
      <StarRating rating={agent.rating} />
    </div>

    <div className="mb-4 flex flex-wrap gap-1">
      {agent.service_areas.map((area) => (
        <span key={area} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
          {area}
        </span>
      ))}
    </div>

    <div className="mb-4 flex flex-wrap gap-1">
      {agent.specializations.map((spec) => (
        <span key={spec} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
          {spec}
        </span>
      ))}
    </div>

    <p className="text-xs text-gray-500 mb-4">Joined {agent.joined_date}</p>

    <div className="flex gap-2">
      <button
        onClick={() => onViewDetails(agent)}
        className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
      >
        <Eye className="w-4 h-4" />
        View
      </button>
      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" />
        Verify
      </button>
      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Message
      </button>
    </div>
  </div>
);

const AgentDetailModal = ({ agent, isOpen, onClose }: { agent: Agent | null; isOpen: boolean; onClose: () => void }) => {
  if (!isOpen || !agent) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Agent Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <AgentAvatar name={agent.name} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{agent.name}</h3>
                {agent.verified ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-500" />
                )}
              </div>
              <p className="text-gray-600">{agent.company}</p>
              <p className="text-sm text-gray-500 mt-1">Joined {agent.joined_date}</p>
            </div>
            <div>
              <StarRating rating={agent.rating} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">{agent.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="text-sm font-medium text-gray-900">{agent.phone}</p>
              </div>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{agent.active_listings}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{agent.total_inquiries}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Response Rate</p>
                <ResponseRateBar rate={agent.response_rate} />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average Rating</p>
                <StarRating rating={agent.rating} />
              </div>
            </div>
          </div>

          {/* Document Verification */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Document Verification</h4>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">NIC Document</p>
                  <p className="text-sm text-gray-600">{agent.nic_uploaded ? 'Uploaded and verified' : 'Pending upload'}</p>
                </div>
              </div>
              {agent.nic_uploaded ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
          </div>

          {/* Service Areas */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Service Areas & Specializations</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Service Areas</p>
                <div className="flex flex-wrap gap-2">
                  {agent.service_areas.map((area) => (
                    <span key={area} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {agent.specializations.map((spec) => (
                    <span key={spec} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 pt-6 flex gap-3">
            <button className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Verify Agent
            </button>
            <button className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Suspend Agent
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InviteAgentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_areas: [] as string[],
    specializations: [] as string[],
  });

  const serviceAreaOptions = ['Colombo', 'Galle', 'Kandy', 'Jaffna', 'Matara', 'Negombo'];
  const specializationOptions = ['Residential', 'Commercial', 'Land', 'Industrial', 'Luxury'];

  const handleServiceAreaChange = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      service_areas: prev.service_areas.includes(area)
        ? prev.service_areas.filter((a) => a !== area)
        : [...prev.service_areas, area],
    }));
  };

  const handleSpecializationChange = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Invite New Agent</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Agent name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="+94 70 123 4567"
              />
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Service Areas</label>
            <div className="grid grid-cols-3 gap-2">
              {serviceAreaOptions.map((area) => (
                <label key={area} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.service_areas.includes(area)}
                    onChange={() => handleServiceAreaChange(area)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specializations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Specializations</label>
            <div className="grid grid-cols-3 gap-2">
              {specializationOptions.map((spec) => (
                <label key={spec} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specializations.includes(spec)}
                    onChange={() => handleSpecializationChange(spec)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerformanceLeaderboard = () => {
  const topAgents = [...MOCK_AGENTS]
    .filter((a) => a.status === 'active')
    .sort((a, b) => b.response_rate - a.response_rate)
    .slice(0, 5);
  const badges = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Closed Deals</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Response Time</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">Rating</th>
            </tr>
          </thead>
          <tbody>
            {topAgents.map((agent, index) => (
              <tr key={agent.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center text-2xl">
                    {index < 3 ? badges[index] : `#${index + 1}`}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <AgentAvatar name={agent.name} />
                    <div>
                      <p className="font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-600">{agent.company}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <p className="font-semibold text-gray-900">{agent.total_inquiries}</p>
                </td>
                <td className="py-3 px-4 text-right">
                  <p className="font-semibold text-gray-900">Rs. {(agent.total_inquiries * 45000).toLocaleString()}</p>
                </td>
                <td className="py-3 px-4 text-right">
                  <p className="font-semibold text-gray-900">{(agent.response_rate / 20).toFixed(1)}h</p>
                </td>
                <td className="py-3 px-4 text-right">
                  <StarRating rating={(agent.response_rate / 20)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AgentManagementPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'topPerformers' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'listings' | 'responseRate' | 'rating'>('name');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const agents: Agent[] = MOCK_AGENTS;

  const stats: AgentStats = useMemo(() => {
    return {
      total: agents.length,
      active: agents.filter((a) => a.status === 'active').length,
      pending: agents.filter((a) => a.status === 'pending').length,
      suspended: agents.filter((a) => a.status === 'suspended').length,
      topPerformer: agents.reduce((top, agent) => ((agent.rating || 0) > ((top?.rating || 0)) ? agent : top), agents[0]),
    };
  }, [agents]);

  const filteredAgents = useMemo(() => {
    let result = agents;

    // Filter by tab
    if (activeTab === 'active') {
      result = result.filter((a) => a.status === 'active');
    } else if (activeTab === 'pending') {
      result = result.filter((a) => a.status === 'pending');
    } else if (activeTab === 'suspended') {
      result = result.filter((a) => a.status === 'suspended');
    } else if (activeTab === 'topPerformers') {
      result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.company.toLowerCase().includes(query) ||
          a.service_areas.some((area) => area.toLowerCase().includes(query))
      );
    }

    // Filter by specialization
    if (filterSpecialization) {
      result = result.filter((a) => a.specializations.includes(filterSpecialization));
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'listings') {
      result.sort((a, b) => b.active_listings - a.active_listings);
    } else if (sortBy === 'responseRate') {
      result.sort((a, b) => b.response_rate - a.response_rate);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [agents, activeTab, searchQuery, filterSpecialization, sortBy]);

  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
              <p className="text-gray-600 mt-1">Manage and monitor your real estate agents</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Invite Agent
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4">
            <StatCard icon={Users} label="Total Agents" value={stats.total} />
            <StatCard icon={CheckCircle} label="Active" value={stats.active} trend="2 this week" />
            <StatCard icon={Clock} label="Pending Verification" value={stats.pending} />
            <StatCard icon={AlertCircle} label="Suspended" value={stats.suspended} />
            <StatCard icon={Award} label="Top Performer" value={stats.topPerformer?.name} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter/Tab Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
              {[
                { id: 'all' as const, label: 'All Agents' },
                { id: 'active' as const, label: 'Active' },
                { id: 'pending' as const, label: 'Pending Verification' },
                { id: 'topPerformers' as const, label: 'Top Performers' },
                { id: 'suspended' as const, label: 'Suspended' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, company, or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
              >
                <option value="">All Specializations</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
                <option value="Industrial">Industrial</option>
                <option value="Luxury">Luxury</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-700"
              >
                <option value="name">Sort by Name</option>
                <option value="listings">Sort by Listings</option>
                <option value="responseRate">Sort by Response Rate</option>
                <option value="rating">Sort by Rating</option>
              </select>

              <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Advanced Filters
              </button>
            </div>
          </div>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onViewDetails={handleViewDetails} />
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No agents found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Performance Leaderboard */}
        <PerformanceLeaderboard />
      </div>

      {/* Modals */}
      <AgentDetailModal agent={selectedAgent} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />
      <InviteAgentModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </div>
  );
}
