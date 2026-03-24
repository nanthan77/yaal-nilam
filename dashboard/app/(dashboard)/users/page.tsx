// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { MOCK_USERS } from '@/lib/mock-data';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
} from 'lucide-react';

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const roles = ['All', ...new Set(MOCK_USERS.map(u => u.role))];
  const statuses = ['All', ...new Set(MOCK_USERS.map(u => u.status))];

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'admin':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'content_manager':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'listing_manager':
        return 'bg-teal-100 text-teal-800 border border-teal-300';
      case 'lead_manager':
        return 'bg-green-100 text-green-800 border border-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'content_manager':
        return 'Content Manager';
      case 'listing_manager':
        return 'Listing Manager';
      case 'lead_manager':
        return 'Lead Manager';
      default:
        return role;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900">Users</h1>
            <p className="text-charcoal-600 mt-1">Manage platform users and permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-charcoal-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === 'All' ? 'All Roles' : getRoleLabel(role)}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Status' : getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-charcoal-200">
          <table className="w-full">
            <thead>
              <tr className="bg-charcoal-50 border-b border-charcoal-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Last Login</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-charcoal-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-charcoal-100 hover:bg-charcoal-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-charcoal-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-charcoal-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeStyle(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeStyle(user.status)}`}>
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-charcoal-600">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-charcoal-100 rounded-lg transition">
                      <Eye className="w-4 h-4 text-charcoal-600" />
                    </button>
                    <button className="p-2 hover:bg-charcoal-100 rounded-lg transition">
                      <MoreVertical className="w-4 h-4 text-charcoal-600" />
                    </button>
                    <button className="p-2 hover:bg-red-100 rounded-lg transition">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-charcoal-600">No users found matching your criteria.</p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 text-sm text-charcoal-600">
          <p>Showing {filteredUsers.length} of {MOCK_USERS.length} users</p>
        </div>
      </div>

      {/* Add User Modal (placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-4">Add New User</h2>
            <p className="text-charcoal-600 mb-6">Modal form for adding a new user would be displayed here</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full px-4 py-2 bg-charcoal-200 text-charcoal-900 rounded-lg hover:bg-charcoal-300 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}