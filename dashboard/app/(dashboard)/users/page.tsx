'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Power,
  RotateCcw,
  Eye,
  Mail,
  Phone,
  Calendar,
  LogIn,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { MOCK_USERS, type DashboardUser, type UserRole } from '@/lib/mock-data';

type FilterRole = 'all' | UserRole;
type FilterStatus = 'all' | 'active' | 'inactive';

const ROLE_CONFIG: Record<
  UserRole,
  { color: string; bgColor: string; borderColor: string }
> = {
  super_admin: {
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  admin: {
    color: 'text-blue-900',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  content_manager: {
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  listing_manager: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  lead_manager: {
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  viewer: {
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
};

const formatRoleName = (role: UserRole): string => {
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<FilterRole>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'viewer' as UserRole,
    active: true,
  });

  const stats = useMemo(() => {
    const total = MOCK_USERS.length;
    const active = MOCK_USERS.filter((u) => u.status === 'active').length;
    const inactive = total - active;
    const byRole: Record<UserRole, number> = {
      super_admin: 0,
      admin: 0,
      content_manager: 0,
      listing_manager: 0,
      lead_manager: 0,
      viewer: 0,
    };

    MOCK_USERS.forEach((u) => {
      if (u.role in byRole) {
        byRole[u.role as UserRole]++;
      }
    });

    return { total, active, inactive, byRole };
  }, []);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, roleFilter, statusFilter]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getRoleConfig = (role: UserRole) => {
    return ROLE_CONFIG[role] || ROLE_CONFIG.viewer;
  };

  const handleViewUser = (user: DashboardUser) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      setShowAddModal(false);
      setNewUser({
        name: '',
        email: '',
        phone: '',
        role: 'viewer' as UserRole,
        active: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">
          User Management
        </h1>
        <p className="text-slate-600">Manage users, roles, and permissions across your platform</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm mb-1 font-medium">Total Users</p>
          <p className="text-3xl font-bold text-navy-900">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-2">All registered users</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Active</p>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
          <p className="text-xs text-slate-500 mt-2">Currently active</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-slate-600 text-sm font-medium">Inactive</p>
            <AlertCircle className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-3xl font-bold text-gray-600">{stats.inactive}</p>
          <p className="text-xs text-slate-500 mt-2">Deactivated</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm mb-1 font-medium">Admins</p>
          <p className="text-3xl font-bold text-blue-900">{stats.byRole.admin}</p>
          <p className="text-xs text-slate-500 mt-2">Admin users</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm mb-1 font-medium">Agents</p>
          <p className="text-3xl font-bold text-emerald-600">{stats.byRole.viewer}</p>
          <p className="text-xs text-slate-500 mt-2">Agents on platform</p>
        </div>
      </div>

      {/* RBAC Permissions Matrix Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-navy-900 mb-4">Role Permissions Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-semibold text-slate-900">Role</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Listings</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Users</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Content</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Reports</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-900">Settings</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries({
                super_admin: { listings: true, users: true, content: true, reports: true, settings: true },
                admin: { listings: true, users: true, content: true, reports: true, settings: true },
                content_manager: { listings: false, users: false, content: true, reports: false, settings: false },
                listing_manager: { listings: true, users: false, content: false, reports: true, settings: false },
                lead_manager: { listings: false, users: false, content: false, reports: true, settings: false },
              }).map(([role, perms]) => (
                <tr key={role} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{formatRoleName(role as UserRole)}</td>
                  <td className="px-4 py-3 text-center">
                    {perms.listings ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perms.users ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perms.content ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perms.reports ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perms.settings ? <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" /> : <span className="text-gray-300">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as FilterRole)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="content_manager">Content Manager</option>
            <option value="listing_manager">Listing Manager</option>
            <option value="lead_manager">Lead Manager</option>
            <option value="agent">Agent</option>
            <option value="owner">Owner</option>
            <option value="customer">Customer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full admin-table">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Last Login
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleConfig = getRoleConfig(user.role as UserRole);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${roleConfig.bgColor} ${roleConfig.color} ${roleConfig.borderColor}`}
                      >
                        {formatRoleName(user.role as UserRole)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${
                          user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">
                        {new Date(user.last_login).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-teal-600 hover:bg-teal-50 p-2 rounded transition"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-slate-600 hover:bg-slate-100 p-2 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="text-orange-600 hover:bg-orange-50 p-2 rounded transition"
                          title="Reset Password"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        {user.status === 'active' && (
                          <button
                            className="text-red-600 hover:bg-red-50 p-2 rounded transition"
                            title="Deactivate"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">User Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-slate-500 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Profile Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Full Name</p>
                    <p className="font-medium text-slate-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Email</p>
                    <p className="font-medium text-slate-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Phone</p>
                    <p className="font-medium text-slate-900">{selectedUser.phone}</p>
                  </div>
                </div>
              </div>

              {/* Role and Status */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Role & Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-2">User Role</p>
                    <span
                      className={`inline-block text-sm font-semibold px-3 py-1 rounded-full border ${
                        getRoleConfig(selectedUser.role as UserRole).bgColor
                      } ${getRoleConfig(selectedUser.role as UserRole).color} ${
                        getRoleConfig(selectedUser.role as UserRole).borderColor
                      }`}
                    >
                      {formatRoleName(selectedUser.role as UserRole)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Status</p>
                    <p className="font-medium text-slate-900">
                      {selectedUser.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                          Inactive
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Account Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Created</p>
                    <p className="font-medium text-slate-900">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Last Login</p>
                    <p className="font-medium text-slate-900">
                      {new Date(selectedUser.last_login).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition">
                  Edit User
                </button>
                <button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium py-2 rounded-lg transition">
                  Reset Password
                </button>
                {selectedUser.status === 'active' && (
                  <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 rounded-lg transition">
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                  <option value="content_manager">Content Manager</option>
                  <option value="listing_manager">Listing Manager</option>
                  <option value="lead_manager">Lead Manager</option>
                  <option value="owner">Owner</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newUser.active}
                    onChange={(e) => setNewUser({ ...newUser, active: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">Active Status</span>
                </label>
              </div>
              <div className="border-t border-slate-200 pt-4 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
