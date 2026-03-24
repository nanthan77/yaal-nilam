// @ts-nocheck
'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AuditLog {
  id: number
  user: string
  action: string
  target: string
  details: string
  timestamp: string
  actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'EXPORT' | 'APPROVE'
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    user: 'admin@yaalnilam.lk',
    action: 'APPROVE',
    target: 'Listing #1024',
    details: 'Approved luxury villa listing in Jaffna',
    timestamp: '2026-03-23 14:32:45',
    actionType: 'APPROVE',
  },
  {
    id: 2,
    user: 'content@yaalnilam.lk',
    action: 'UPDATE',
    target: 'Property #1023',
    details: 'Updated price from Rs. 50M to Rs. 48M',
    timestamp: '2026-03-23 13:15:22',
    actionType: 'UPDATE',
  },
  {
    id: 3,
    user: 'lead@yaalnilam.lk',
    action: 'EXPORT',
    target: 'Inquiries Report',
    details: 'Exported 150 inquiries for March 2026',
    timestamp: '2026-03-23 11:45:10',
    actionType: 'EXPORT',
  },
  {
    id: 4,
    user: 'admin@yaalnilam.lk',
    action: 'DELETE',
    target: 'Listing #1020',
    details: 'Deleted spam listing for inappropriate content',
    timestamp: '2026-03-22 16:20:33',
    actionType: 'DELETE',
  },
  {
    id: 5,
    user: 'manager@yaalnilam.lk',
    action: 'CREATE',
    target: 'Property #1021',
    details: 'Created new apartment listing in Point Pedro',
    timestamp: '2026-03-22 14:05:17',
    actionType: 'CREATE',
  },
  {
    id: 6,
    user: 'admin@yaalnilam.lk',
    action: 'LOGIN',
    target: 'Dashboard',
    details: 'Admin login from IP: 192.168.1.100',
    timestamp: '2026-03-22 09:00:45',
    actionType: 'LOGIN',
  },
  {
    id: 7,
    user: 'content@yaalnilam.lk',
    action: 'UPDATE',
    target: 'User #456',
    details: 'Changed user role from viewer to content_manager',
    timestamp: '2026-03-21 15:30:12',
    actionType: 'UPDATE',
  },
  {
    id: 8,
    user: 'lead@yaalnilam.lk',
    action: 'CREATE',
    target: 'Follow-up Task',
    details: 'Created follow-up task for inquiry #789',
    timestamp: '2026-03-21 12:45:55',
    actionType: 'CREATE',
  },
]

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs)
  const [dateFrom, setDateFrom] = useState('2026-03-15')
  const [dateTo, setDateTo] = useState('2026-03-23')
  const [filterUser, setFilterUser] = useState('')
  const [filterAction, setFilterAction] = useState('')

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'CREATE':
        return 'bg-teal-100 text-teal-700'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700'
      case 'DELETE':
        return 'bg-red-100 text-red-700'
      case 'LOGIN':
        return 'bg-purple-100 text-purple-700'
      case 'EXPORT':
        return 'bg-orange-100 text-orange-700'
      case 'APPROVE':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-sand-100 text-charcoal-700'
    }
  }

  const filteredLogs = logs.filter((log) => {
    const dateMatch =
      new Date(log.timestamp) >= new Date(dateFrom) &&
      new Date(log.timestamp) <= new Date(dateTo)
    const userMatch = !filterUser || log.user.toLowerCase().includes(filterUser.toLowerCase())
    const actionMatch = !filterAction || log.actionType === filterAction
    return dateMatch && userMatch && actionMatch
  })

  const uniqueActions = [...new Set(logs.map((log) => log.actionType))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Audit Logs</h1>
        <p className="text-charcoal-600 mt-1">Track all platform activities and changes</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-sand-200 rounded-lg p-6 space-y-4">
        <h2 className="font-semibold text-charcoal-900">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal-700 mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal-700 mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal-700 mb-2">User</label>
            <input
              type="text"
              placeholder="Search user..."
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-charcoal-700 mb-2">Action Type</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-4 py-2 border border-sand-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-sand-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200">
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Target</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Details</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-sand-100 hover:bg-sand-50">
                    <td className="py-3 px-4 text-charcoal-700 font-medium">{log.user}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.actionType)}`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-charcoal-700">{log.target}</td>
                    <td className="py-3 px-4 text-charcoal-600 max-w-xs truncate">{log.details}</td>
                    <td className="py-3 px-4 text-charcoal-600 text-xs whitespace-nowrap">{log.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-charcoal-600">
                    No logs found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between text-sm text-charcoal-600">
        <p>Showing {filteredLogs.length} of {logs.length} logs</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border border-sand-300 hover:bg-sand-50">Previous</button>
          <button className="px-3 py-1 rounded border border-sand-300 bg-navy-600 text-white">1</button>
          <button className="px-3 py-1 rounded border border-sand-300 hover:bg-sand-50">2</button>
          <button className="px-3 py-1 rounded border border-sand-300 hover:bg-sand-50">Next</button>
        </div>
      </div>
    </div>
  )
}
