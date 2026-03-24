// @ts-nocheck
'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

interface Notification {
  id: number
  type: 'info' | 'success' | 'warning' | 'danger'
  title: string
  message: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Listing Approved',
    message: 'Your property listing "Luxury Villa in Jaffna" has been approved and published.',
    timestamp: '2026-03-23 14:30',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'New Inquiry Received',
    message: 'You have received a new inquiry for your property in Point Pedro. Response time: 2.5 hours.',
    timestamp: '2026-03-23 12:15',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Listing Expiring Soon',
    message: 'Your property listing "Apartment in Mullaitivu" will expire in 7 days. Renew now to keep it visible.',
    timestamp: '2026-03-23 10:00',
    read: true,
  },
  {
    id: 4,
    type: 'danger',
    title: 'Content Flagged',
    message: 'Your listing description contains inappropriate content and has been flagged for review.',
    timestamp: '2026-03-22 16:45',
    read: true,
  },
  {
    id: 5,
    type: 'success',
    title: 'Payment Received',
    message: 'Payment of Rs. 5,000 for premium listing has been processed successfully.',
    timestamp: '2026-03-22 14:20',
    read: true,
  },
  {
    id: 6,
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on 2026-03-25 from 2:00 AM to 4:00 AM UTC.',
    timestamp: '2026-03-22 09:30',
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = notifications.filter(
    (notif) => filter === 'all' || !notif.read
  )

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: !notif.read } : notif))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-teal-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'danger':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getBackgroundColor = (type: string, read: boolean) => {
    if (read) return 'bg-white hover:bg-sand-50'
    switch (type) {
      case 'success':
        return 'bg-teal-50 hover:bg-teal-100'
      case 'warning':
        return 'bg-orange-50 hover:bg-orange-100'
      case 'danger':
        return 'bg-red-50 hover:bg-red-100'
      case 'info':
      default:
        return 'bg-blue-50 hover:bg-blue-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-charcoal-900">Notifications</h1>
          <p className="text-charcoal-600 mt-1">Stay updated with your activity</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg bg-navy-600 text-white font-medium text-sm hover:bg-navy-700"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-sand-200 flex gap-8">
        {(['all', 'unread'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 font-medium transition-colors border-b-2 relative ${
              filter === tab
                ? 'text-navy-600 border-navy-600'
                : 'text-charcoal-600 border-transparent hover:text-charcoal-900'
            }`}
          >
            {tab === 'all' ? 'All Notifications' : 'Unread'}
            {tab === 'unread' && unreadCount > 0 && (
              <span className="absolute -top-2 -right-4 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`border border-sand-200 rounded-lg p-4 transition-colors cursor-pointer ${getBackgroundColor(
                notification.type,
                notification.read
              )}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1" onClick={() => toggleRead(notification.id)}>
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${
                        notification.read ? 'text-charcoal-700' : 'text-charcoal-900'
                      }`}
                    >
                      {notification.title}
                      {!notification.read && (
                        <span className="inline-block ml-2 w-2 h-2 rounded-full bg-navy-600"></span>
                      )}
                    </h3>
                    <span className="text-xs text-charcoal-500">{notification.timestamp}</span>
                  </div>
                  <p className={`text-sm mt-1 ${notification.read ? 'text-charcoal-600' : 'text-charcoal-700'}`}>
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRead(notification.id)
                  }}
                  className="flex-shrink-0 text-charcoal-400 hover:text-charcoal-600"
                >
                  {notification.read ? (
                    <span className="w-5 h-5 rounded border-2 border-charcoal-300"></span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-navy-600"></span>
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-charcoal-600">No notifications to display</p>
          </div>
        )}
      </div>
    </div>
  )
}
