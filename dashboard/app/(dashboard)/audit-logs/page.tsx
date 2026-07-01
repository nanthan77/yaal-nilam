'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Download,
  Activity,
  Check,
  AlertCircle,
  Package,
  BookOpen,
} from 'lucide-react';
import { getAuditLogs } from '@/lib/firestore';

const formatDate = (dateString: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getActionColor = (action: string) => {
  const a = (action || '').toLowerCase();
  if (a.includes('delete') || a.includes('reject')) return 'bg-red-50 text-red-700';
  if (a.includes('create') || a.includes('approve') || a.includes('publish')) return 'bg-emerald-50 text-emerald-700';
  if (a.includes('update') || a.includes('save') || a.includes('edit')) return 'bg-blue-50 text-blue-700';
  if (a.includes('archive') || a.includes('close') || a.includes('match')) return 'bg-orange-50 text-orange-700';
  return 'bg-gray-50 text-gray-700';
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setError('Permission denied — your account lacks an admin role');
        } else {
          setError('Failed to load audit logs.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const uniqueUsers = Array.from(new Set(logs.map((l) => l.performed_by || l.user).filter(Boolean)));
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const user = log.performed_by || log.user || '';
      const action = log.action || '';
      const target = log.entity_title || log.target || '';
      const details = log.details || '';
      const matchesSearch =
        user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        target.toLowerCase().includes(searchTerm.toLowerCase()) ||
        details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = actionFilter === 'all' || action === actionFilter;
      const matchesUser = userFilter === 'all' || user === userFilter;
      return matchesSearch && matchesAction && matchesUser;
    });
  }, [logs, searchTerm, actionFilter, userFilter]);

  const exportCSV = () => {
    const csv = [
      ['Time', 'User', 'Action', 'Entity Type', 'Entity', 'Details'].join(','),
      ...filteredLogs.map((log) =>
        [
          log.created_at || log.timestamp || '',
          log.performed_by || log.user || '',
          log.action || '',
          log.entity_type || log.target_type || '',
          log.entity_title || log.target || '',
          log.details || '',
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const today = new Date().toDateString();
  const todayCount = logs.filter((l) => {
    const d = new Date(l.created_at || l.timestamp || '');
    return !isNaN(d.getTime()) && d.toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <BookOpen className="w-9 h-9 text-navy-600" />
        <div>
          <h1 className="text-4xl font-bold text-navy-900">Audit Logs</h1>
          <p className="text-slate-600 mt-0.5">Track all admin actions for security and compliance</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Logs</p>
          <p className="text-3xl font-bold text-navy-900">{logs.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Today</p>
          <p className="text-3xl font-bold text-blue-600">{todayCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Filtered</p>
          <p className="text-3xl font-bold text-teal-600">{filteredLogs.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100 flex gap-4 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All Users</option>
          {uniqueUsers.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center text-slate-500 text-sm">Loading audit logs…</div>
      )}

      {/* Empty state */}
      {!loading && !error && logs.length === 0 && (
        <div className="py-16 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium text-lg">No audit logs yet</p>
          <p className="text-slate-400 text-sm mt-2">Actions like approving listings, editing users, and saving settings will be logged here.</p>
        </div>
      )}

      {/* Table */}
      {!loading && filteredLogs.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Entity</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const user = log.performed_by || log.user || '—';
                  const initials = user !== '—' ? user.split(/\s|@/)[0].slice(0, 2).toUpperCase() : '?';
                  return (
                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {formatDate(log.created_at || log.timestamp || '')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-xs font-semibold flex-shrink-0">
                            {initials}
                          </div>
                          <span className="text-sm font-medium text-slate-900 truncate max-w-32">{user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                          {log.action || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">{log.entity_title || log.target || '—'}</p>
                        <p className="text-xs text-slate-500">{log.entity_type || log.target_type || ''}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{log.details || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && (
        <p className="mt-4 text-sm text-slate-600">Showing {filteredLogs.length} of {logs.length} logs</p>
      )}
    </div>
  );
}
