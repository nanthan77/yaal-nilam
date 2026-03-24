'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Download,
  Filter,
  User,
  Activity,
  Check,
  AlertCircle,
  LogOut,
  Settings,
} from 'lucide-react';

interface AuditLog {
  id: string;
  user: string;
  user_avatar: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'settings';
  target: string;
  target_type: string;
  details: string;
  status: 'success' | 'failed';
  timestamp: string;
  ip_address: string;
}

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    user: 'Ravi Kumar',
    user_avatar: 'RK',
    action: 'create',
    target: 'Luxury Villa in Jaffna Fort',
    target_type: 'Listing',
    details: 'New listing created with 8 images',
    status: 'success',
    timestamp: '2024-03-21T14:30:00',
    ip_address: '192.168.1.100',
  },
  {
    id: '2',
    user: 'Priya Singh',
    user_avatar: 'PS',
    action: 'update',
    target: 'Apartment - Central Jaffna',
    target_type: 'Listing',
    details: 'Updated price and description',
    status: 'success',
    timestamp: '2024-03-21T13:45:00',
    ip_address: '192.168.1.101',
  },
  {
    id: '3',
    user: 'Admin User',
    user_avatar: 'AU',
    action: 'delete',
    target: 'Old Listing #2023',
    target_type: 'Listing',
    details: 'Listing deleted due to policy violation',
    status: 'success',
    timestamp: '2024-03-21T12:20:00',
    ip_address: '192.168.1.50',
  },
  {
    id: '4',
    user: 'Arun Patel',
    user_avatar: 'AP',
    action: 'login',
    target: 'User Account',
    target_type: 'Authentication',
    details: 'Successful login from web browser',
    status: 'success',
    timestamp: '2024-03-21T11:00:00',
    ip_address: '192.168.1.105',
  },
  {
    id: '5',
    user: 'Unknown User',
    user_avatar: 'UU',
    action: 'login',
    target: 'User Account',
    target_type: 'Authentication',
    details: 'Failed login attempt - Invalid credentials',
    status: 'failed',
    timestamp: '2024-03-21T10:30:00',
    ip_address: '192.168.1.200',
  },
  {
    id: '6',
    user: 'Admin User',
    user_avatar: 'AU',
    action: 'settings',
    target: 'Platform Settings',
    target_type: 'Settings',
    details: 'Updated SEO settings and meta tags',
    status: 'success',
    timestamp: '2024-03-21T09:15:00',
    ip_address: '192.168.1.50',
  },
];

const getActionIcon = (action: string) => {
  switch (action) {
    case 'create':
      return <Plus className="w-4 h-4 text-emerald-600" />;
    case 'update':
      return <Edit2 className="w-4 h-4 text-blue-600" />;
    case 'delete':
      return <Trash2 className="w-4 h-4 text-red-600" />;
    case 'view':
      return <Eye className="w-4 h-4 text-slate-600" />;
    case 'login':
      return <LogOut className="w-4 h-4 text-purple-600" />;
    case 'logout':
      return <LogOut className="w-4 h-4 text-slate-600" />;
    case 'settings':
      return <Settings className="w-4 h-4 text-orange-600" />;
    default:
      return <Activity className="w-4 h-4 text-slate-600" />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'create':
      return 'bg-emerald-50 text-emerald-700';
    case 'update':
      return 'bg-blue-50 text-blue-700';
    case 'delete':
      return 'bg-red-50 text-red-700';
    case 'view':
      return 'bg-slate-50 text-slate-700';
    case 'login':
      return 'bg-purple-50 text-purple-700';
    case 'logout':
      return 'bg-slate-50 text-slate-700';
    case 'settings':
      return 'bg-orange-50 text-orange-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

const getStatusIcon = (status: string) => {
  return status === 'success' ? (
    <Check className="w-4 h-4 text-emerald-600" />
  ) : (
    <AlertCircle className="w-4 h-4 text-red-600" />
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAction = actionFilter === 'all' || log.action === actionFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      const matchesUser = userFilter === 'all' || log.user === userFilter;

      return matchesSearch && matchesAction && matchesStatus && matchesUser;
    });
  }, [searchTerm, actionFilter, statusFilter, userFilter]);

  const stats = {
    total: mockAuditLogs.length,
    success: mockAuditLogs.filter((l) => l.status === 'success').length,
    failed: mockAuditLogs.filter((l) => l.status === 'failed').length,
    today: mockAuditLogs.filter((l) => {
      const logDate = new Date(l.timestamp).toDateString();
      const today = new Date().toDateString();
      return logDate === today;
    }).length,
  };

  const uniqueUsers = Array.from(new Set(mockAuditLogs.map((l) => l.user)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Audit Logs</h1>
        <p className="text-slate-600">Track all system activities and changes for security and compliance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Logs</p>
          <p className="text-3xl font-bold text-navy-900">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-2">All activities</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Success</p>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{stats.success}</p>
          <p className="text-xs text-slate-500 mt-2">Successful actions</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Failed</p>
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          <p className="text-xs text-slate-500 mt-2">Failed attempts</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Today</p>
          <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
          <p className="text-xs text-slate-500 mt-2">Today's activities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="view">View</option>
            <option value="login">Login</option>
            <option value="settings">Settings</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const csv = [
                ['Time', 'User', 'Action', 'Target', 'Status', 'Details', 'IP'].join(','),
                ...filteredLogs.map((log) =>
                  [
                    log.timestamp,
                    log.user,
                    log.action,
                    log.target,
                    log.status,
                    log.details,
                    log.ip_address,
                  ]
                    .map((v) => `"${v}"`)
                    .join(',')
                ),
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'audit-logs.csv';
              a.click();
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Target</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Details</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{formatDate(log.timestamp)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-semibold">
                        {log.user_avatar}
                      </div>
                      <p className="font-medium text-slate-900">{log.user}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}
                      >
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{log.target}</p>
                      <p className="text-xs text-slate-500">{log.target_type}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">{log.details}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(log.status)}
                      <span
                        className={`text-xs font-semibold ${
                          log.status === 'success'
                            ? 'text-emerald-600'
                            : 'text-red-600'
                        }`}
                      >
                        {log.status === 'success' ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-slate-600">{log.ip_address}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No audit logs found</p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing {filteredLogs.length} of {mockAuditLogs.length} logs
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition font-medium text-sm">
            Previous
          </button>
          <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition font-medium text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
