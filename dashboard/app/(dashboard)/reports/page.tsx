// @ts-nocheck
'use client'

import { useState } from 'react'
import { AlertCircle, Flag, Zap } from 'lucide-react'

type TabType = 'reported' | 'flagged' | 'quality'

const reportedListings = [
  {
    id: 1,
    title: 'Luxury Villa in Jaffna',
    reporter: 'user@example.com',
    reason: 'Misleading photos',
    date: '2026-03-23',
    status: 'Pending Review',
  },
  {
    id: 2,
    title: 'Apartment in Point Pedro',
    reporter: 'another@example.com',
    reason: 'Incorrect price',
    date: '2026-03-22',
    status: 'Under Investigation',
  },
  {
    id: 3,
    title: 'Land Plot in Mullaitivu',
    reporter: 'user123@example.com',
    reason: 'Spam listing',
    date: '2026-03-21',
    status: 'Resolved',
  },
]

const flaggedContent = [
  {
    id: 1,
    content: 'User comment on listing #456',
    type: 'Comment',
    flag: 'Inappropriate language',
    date: '2026-03-23',
    severity: 'High',
  },
  {
    id: 2,
    content: 'Profile description',
    type: 'Profile',
    flag: 'Contact info violation',
    date: '2026-03-22',
    severity: 'Medium',
  },
  {
    id: 3,
    content: 'Listing description',
    type: 'Listing',
    flag: 'Misleading description',
    date: '2026-03-21',
    severity: 'Medium',
  },
  {
    id: 4,
    content: 'Review on listing #789',
    type: 'Review',
    flag: 'Suspicious activity',
    date: '2026-03-20',
    severity: 'Low',
  },
]

const qualityIssues = [
  {
    id: 1,
    listing: 'Property #1024',
    issue: 'Missing required fields',
    details: 'Description field is empty',
    date: '2026-03-23',
    priority: 'High',
  },
  {
    id: 2,
    listing: 'Property #1025',
    issue: 'Low quality images',
    details: '3 images below 800x600 resolution',
    date: '2026-03-22',
    priority: 'Medium',
  },
  {
    id: 3,
    listing: 'Property #1026',
    issue: 'Outdated information',
    details: 'Last updated 90 days ago',
    date: '2026-03-21',
    priority: 'Low',
  },
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('reported')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Reports & Moderation</h1>
        <p className="text-charcoal-600 mt-1">Manage user reports and content flags</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-sand-200 flex gap-8">
        {(['reported', 'flagged', 'quality'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? 'text-navy-600 border-navy-600'
                : 'text-charcoal-600 border-transparent hover:text-charcoal-900'
            }`}
          >
            {tab === 'reported' && 'Reported Listings'}
            {tab === 'flagged' && 'Flagged Content'}
            {tab === 'quality' && 'Quality Issues'}
          </button>
        ))}
      </div>

      {/* Reported Listings Tab */}
      {activeTab === 'reported' && (
        <div className="space-y-4">
          {reportedListings.map((report) => (
            <div key={report.id} className="bg-white border border-sand-200 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1">
                  <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal-900">{report.title}</h3>
                    <p className="text-sm text-charcoal-600 mt-1">
                      Reported by: <span className="font-medium">{report.reporter}</span>
                    </p>
                    <p className="text-sm text-charcoal-600 mt-1">
                      Reason: <span className="font-medium">{report.reason}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-charcoal-600">{report.date}</p>
                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Resolved'
                        ? 'bg-teal-100 text-teal-700'
                        : report.status === 'Under Investigation'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-sand-100 text-charcoal-700'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>
              {report.status !== 'Resolved' && (
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-navy-600 text-white hover:bg-navy-700">
                    Review
                  </button>
                  <button className="px-4 py-2 text-sm font-medium rounded-lg border border-sand-300 text-charcoal-700 hover:bg-sand-50">
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Flagged Content Tab */}
      {activeTab === 'flagged' && (
        <div className="bg-white border border-sand-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200">
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Content</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Flag Reason</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-charcoal-700">Severity</th>
                <th className="text-right py-3 px-4 font-semibold text-charcoal-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {flaggedContent.map((flag) => (
                <tr key={flag.id} className="border-b border-sand-100 hover:bg-sand-50">
                  <td className="py-3 px-4 text-charcoal-700">{flag.content}</td>
                  <td className="py-3 px-4 text-charcoal-600">{flag.type}</td>
                  <td className="py-3 px-4 text-charcoal-600">{flag.flag}</td>
                  <td className="py-3 px-4 text-charcoal-600 text-xs">{flag.date}</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        flag.severity === 'High'
                          ? 'bg-red-100 text-red-700'
                          : flag.severity === 'Medium'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <button className="text-navy-600 hover:text-navy-700 font-medium text-xs">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quality Issues Tab */}
      {activeTab === 'quality' && (
        <div className="bg-white border border-sand-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200">
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Listing</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Issue</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Details</th>
                <th className="text-left py-3 px-4 font-semibold text-charcoal-700">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-charcoal-700">Priority</th>
                <th className="text-right py-3 px-4 font-semibold text-charcoal-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {qualityIssues.map((issue) => (
                <tr key={issue.id} className="border-b border-sand-100 hover:bg-sand-50">
                  <td className="py-3 px-4 text-charcoal-700 font-medium">{issue.listing}</td>
                  <td className="py-3 px-4 text-charcoal-600">{issue.issue}</td>
                  <td className="py-3 px-4 text-charcoal-600 text-xs">{issue.details}</td>
                  <td className="py-3 px-4 text-charcoal-600 text-xs">{issue.date}</td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        issue.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : issue.priority === 'Medium'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">
                    <button className="text-navy-600 hover:text-navy-700 font-medium text-xs">
                      Fix
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
