'use client';

import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MessageCircle,
  Search,
  Filter,
  Eye,
} from 'lucide-react';

interface Report {
  id: string;
  listing_id: string;
  listing_title: string;
  reported_by: string;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
}

interface QualityIssue {
  id: string;
  issue_type: string;
  affected_listings: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    listing_id: 'list-001',
    listing_title: 'Luxury Villa in Jaffna Fort',
    reported_by: 'Raja Kumar',
    reason: 'Misleading pricing information',
    status: 'investigating',
    created_at: '2024-03-20',
    updated_at: '2024-03-21',
  },
  {
    id: '2',
    listing_id: 'list-005',
    listing_title: 'Cottage in Nallur',
    reported_by: 'Priya Singh',
    reason: 'Inappropriate images',
    status: 'open',
    created_at: '2024-03-21',
    updated_at: '2024-03-21',
  },
  {
    id: '3',
    listing_id: 'list-010',
    listing_title: 'Apartment - Central Jaffna',
    reported_by: 'Arun Patel',
    reason: 'Duplicate listing',
    status: 'resolved',
    created_at: '2024-03-15',
    updated_at: '2024-03-19',
  },
];

const mockQualityIssues: QualityIssue[] = [
  {
    id: '1',
    issue_type: 'Missing Images',
    affected_listings: 24,
    severity: 'high',
    description: 'Listings with less than 3 images',
  },
  {
    id: '2',
    issue_type: 'Incomplete Information',
    affected_listings: 156,
    severity: 'medium',
    description: 'Missing property specifications',
  },
  {
    id: '3',
    issue_type: 'Outdated Listings',
    affected_listings: 42,
    severity: 'medium',
    description: 'Not updated in last 30 days',
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'open':
      return { bg: 'bg-red-50', color: 'text-red-700', icon: AlertCircle };
    case 'investigating':
      return { bg: 'bg-orange-50', color: 'text-orange-700', icon: Clock };
    case 'resolved':
      return { bg: 'bg-emerald-50', color: 'text-emerald-700', icon: CheckCircle };
    case 'dismissed':
      return { bg: 'bg-gray-50', color: 'text-gray-700', icon: AlertCircle };
    default:
      return { bg: 'bg-gray-50', color: 'text-gray-700', icon: AlertCircle };
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'medium':
      return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'low':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'content' | 'quality'>('listings');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reports, setReports] = useState<Report[]>(mockReports);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.listing_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openReports = reports.filter((r) => r.status === 'open').length;
  const investigatingReports = reports.filter((r) => r.status === 'investigating').length;
  const resolvedReports = reports.filter((r) => r.status === 'resolved').length;

  const updateReportStatus = (id: string, newStatus: Report['status']) => {
    setReports(
      reports.map((r) =>
        r.id === id ? { ...r, status: newStatus, updated_at: new Date().toISOString().split('T')[0] } : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Reports & Moderation</h1>
        <p className="text-slate-600">Review and manage user reports and content flags</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Total Reports</p>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{reports.length}</p>
          <p className="text-xs text-slate-500 mt-2">All reports</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Open</p>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{openReports}</p>
          <p className="text-xs text-slate-500 mt-2">Pending review</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Investigating</p>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{investigatingReports}</p>
          <p className="text-xs text-slate-500 mt-2">In progress</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Resolved</p>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{resolvedReports}</p>
          <p className="text-xs text-slate-500 mt-2">This month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex border-b border-slate-200">
          {(['listings', 'content', 'quality'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'listings'
                ? 'Reported Listings'
                : tab === 'content'
                ? 'Flagged Content'
                : 'Quality Issues'}
            </button>
          ))}
        </div>

        {/* Reported Listings Tab */}
        {activeTab === 'listings' && (
          <div className="p-6">
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredReports.map((report) => {
                const statusConfig = getStatusConfig(report.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={report.id}
                    className={`border border-slate-200 rounded-lg p-4 hover:shadow transition ${statusConfig.bg}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <StatusIcon className={`w-5 h-5 mt-1 ${statusConfig.color}`} />
                          <div>
                            <h4 className="font-semibold text-slate-900">{report.listing_title}</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              Reported by {report.reported_by}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-xs bg-white bg-opacity-60 px-2 py-1 rounded">
                                {report.reason}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded font-semibold ${statusConfig.color}`}>
                                {report.status === 'open'
                                  ? 'Open'
                                  : report.status === 'investigating'
                                  ? 'Investigating'
                                  : report.status === 'resolved'
                                  ? 'Resolved'
                                  : 'Dismissed'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-fit">
                        <button className="text-teal-600 hover:bg-white hover:bg-opacity-60 px-3 py-1.5 rounded transition text-sm font-medium flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        {report.status !== 'resolved' && (
                          <select
                            value={report.status}
                            onChange={(e) => updateReportStatus(report.id, e.target.value as Report['status'])}
                            className="px-3 py-1.5 border border-white border-opacity-50 rounded text-sm font-medium bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          >
                            <option value="open">Mark Open</option>
                            <option value="investigating">Investigating</option>
                            <option value="resolved">Resolve</option>
                            <option value="dismissed">Dismiss</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Flagged Content Tab */}
        {activeTab === 'content' && (
          <div className="p-6 text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No flagged content</h3>
            <p className="text-slate-600">All content has been reviewed and approved</p>
          </div>
        )}

        {/* Quality Issues Tab */}
        {activeTab === 'quality' && (
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {mockQualityIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="border border-slate-200 rounded-lg p-4 hover:shadow transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-900">{issue.issue_type}</h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold border ${getSeverityColor(
                        issue.severity
                      )}`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-xs text-slate-600 mb-1">Affected Listings</p>
                    <p className="text-2xl font-bold text-slate-900">{issue.affected_listings}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
