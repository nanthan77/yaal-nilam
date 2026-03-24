'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  Mail,
  MessageSquare,
  AlertCircle,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Listing Inquiry',
    message: 'Raja Kumar inquired about Luxury Villa in Jaffna Fort',
    type: 'info',
    read: false,
    created_at: '2024-03-21T10:30:00',
  },
  {
    id: '2',
    title: 'Listing Approved',
    message: 'Your listing "Apartment - Central Jaffna" has been approved',
    type: 'success',
    read: false,
    created_at: '2024-03-21T09:15:00',
  },
  {
    id: '3',
    title: 'Payment Received',
    message: 'Payment of Rs. 5,000 received for Featured Listing promotion',
    type: 'success',
    read: true,
    created_at: '2024-03-20T14:20:00',
  },
  {
    id: '4',
    title: 'Review Pending',
    message: 'Your listing requires additional information to be approved',
    type: 'warning',
    read: true,
    created_at: '2024-03-20T11:45:00',
  },
  {
    id: '5',
    title: 'System Alert',
    message: 'Scheduled maintenance on 2024-03-25 at 02:00 AM',
    type: 'error',
    read: true,
    created_at: '2024-03-19T16:30:00',
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'info':
      return <Bell className="w-5 h-5 text-blue-600" />;
    case 'success':
      return <Check className="w-5 h-5 text-emerald-600" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-orange-600" />;
    case 'error':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <Bell className="w-5 h-5 text-slate-600" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'info':
      return 'bg-blue-50 border-blue-200';
    case 'success':
      return 'bg-emerald-50 border-emerald-200';
    case 'warning':
      return 'bg-orange-50 border-orange-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesRead = filterType === 'unread' ? !notif.read : filterType === 'read' ? notif.read : true;
    return matchesSearch && (filterType === 'all' || filterType === notif.type || filterType === 'unread' || filterType === 'read' ? matchesRead : matchesType);
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="grid grid-cols-3 gap-8">
        {/* Main Notifications Column */}
        <div className="col-span-2">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-navy-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-slate-600">Stay updated with important alerts and messages</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <p className="text-slate-600 text-sm font-medium mb-1">Total</p>
              <p className="text-3xl font-bold text-navy-900">{notifications.length}</p>
              <p className="text-xs text-slate-500 mt-2">All notifications</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <p className="text-slate-600 text-sm font-medium mb-1">Unread</p>
              <p className="text-3xl font-bold text-red-600">{unreadCount}</p>
              <p className="text-xs text-slate-500 mt-2">Awaiting attention</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <p className="text-slate-600 text-sm font-medium mb-1">Read</p>
              <p className="text-3xl font-bold text-emerald-600">
                {notifications.filter((n) => n.read).length}
              </p>
              <p className="text-xs text-slate-500 mt-2">Already reviewed</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`border rounded-lg p-4 hover:shadow transition cursor-pointer ${getNotificationColor(notif.type)} ${
                    !notif.read ? 'border-current' : 'border-slate-200'
                  }`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="pt-1">{getNotificationIcon(notif.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-900">{notif.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {formatTime(notif.created_at)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notif.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notif.id);
                              }}
                              className="text-teal-600 hover:bg-teal-100 p-2 rounded transition"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-red-600 hover:bg-red-100 p-2 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No notifications</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="col-span-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full mb-6 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 text-left hover:shadow transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Notification Settings
              </h3>
              <span className="text-slate-400">→</span>
            </div>
          </button>

          {showSettings && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
              <h3 className="font-bold text-slate-900 mb-4">Notification Channels</h3>

              <div className="space-y-3">
                {[
                  { label: 'In-App Notifications', key: 'in_app', defaultChecked: true },
                  { label: 'Email Alerts', key: 'email', defaultChecked: true },
                  { label: 'SMS Alerts', key: 'sms', defaultChecked: false },
                  { label: 'Push Notifications', key: 'push', defaultChecked: true },
                ].map((channel) => (
                  <label key={channel.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={channel.defaultChecked}
                      className="w-4 h-4 rounded border-slate-300 accent-teal-600"
                    />
                    <span className="text-sm text-slate-700">{channel.label}</span>
                  </label>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-semibold text-slate-900 mb-3">Notification Types</h4>
                <div className="space-y-2">
                  {[
                    { label: 'New Inquiries', enabled: true },
                    { label: 'Listing Approvals', enabled: true },
                    { label: 'Payment Updates', enabled: true },
                    { label: 'System Alerts', enabled: false },
                    { label: 'Marketing', enabled: false },
                  ].map((type) => (
                    <label key={type.label} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={type.enabled}
                        className="w-4 h-4 rounded border-slate-300 accent-teal-600"
                      />
                      <span className="text-sm text-slate-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition mt-4">
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
