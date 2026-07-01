// @ts-nocheck
'use client';

import { useEffect, useMemo, useState } from 'react';
import { createAdminUser, deleteAdminUser, getAdminUsers, updateAdminUser } from '@/lib/firestore';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Trash2,
  X,
} from 'lucide-react';

const EMPTY_USER = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'listing_manager',
  status: 'active',
  last_login: '',
  created_at: '',
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const fsUsers = await getAdminUsers();
        setUsers(fsUsers);
      } catch (err: any) {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')) {
          setUsersError('Permission denied — your account lacks an admin role');
        } else {
          setUsersError('Failed to load users.');
        }
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  const roles = ['All', ...new Set(users.map(u => u.role))];
  const statuses = ['All', ...new Set(users.map(u => u.status))];

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const openUserModal = (user = EMPTY_USER) => {
    setEditingUser(user);
    setShowAddModal(true);
  };

  const closeUserModal = () => {
    setEditingUser(null);
    setShowAddModal(false);
  };

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3500);
  };

  const handleSaveUser = async () => {
    if (!editingUser?.name || !editingUser?.email) {
      showMessage('Name and email are required.');
      return;
    }

    setSaving(true);
    try {
      if (editingUser.id) {
        const ok = await updateAdminUser(editingUser.id, editingUser);
        if (ok) {
          setUsers((current) => current.map((user) => (user.id === editingUser.id ? editingUser : user)));
          showMessage('User updated.');
          closeUserModal();
        } else {
          showMessage('Could not update user. Check admin access.');
        }
      } else {
        const newId = await createAdminUser(editingUser);
        if (newId) {
          setUsers((current) => [{ ...editingUser, id: newId, created_at: new Date().toISOString() }, ...current]);
          showMessage('User added to admin access list.');
          closeUserModal();
        } else {
          showMessage('Could not add user. Check admin access.');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: any) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    setUsers((current) => current.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)));
    const ok = await updateAdminUser(user.id, { status: nextStatus });
    showMessage(ok ? `User marked ${nextStatus}.` : 'Could not update user status.');
  };

  const handleDeleteUser = async (user: any) => {
    if (!confirm(`Delete access record for ${user.name}?`)) return;
    setUsers((current) => current.filter((item) => item.id !== user.id));
    const ok = await deleteAdminUser(user.id);
    showMessage(ok ? 'User deleted from admin access list.' : 'Could not delete user.');
  };

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
            onClick={() => openUserModal()}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
        {usersError && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
            {usersError}
          </div>
        )}
        {message && (
          <div className="mb-5 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800" role="status">
            {message}
          </div>
        )}

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
        {loadingUsers ? (
          <div className="py-16 text-center text-charcoal-500 text-sm">Loading users…</div>
        ) : users.length === 0 && !usersError ? (
          <div className="py-16 text-center">
            <Eye className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
            <p className="text-charcoal-600 font-medium text-lg">No users yet</p>
            <p className="text-charcoal-400 text-sm mt-2">Add the first admin user to get started.</p>
          </div>
        ) : null}
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
                    <button onClick={() => openUserModal(user)} className="p-2 hover:bg-charcoal-100 rounded-lg transition" aria-label={`Edit ${user.name}`}>
                      <Eye className="w-4 h-4 text-charcoal-600" />
                    </button>
                    <button onClick={() => handleToggleStatus(user)} className="p-2 hover:bg-charcoal-100 rounded-lg transition" aria-label={`Toggle ${user.name} status`}>
                      <MoreVertical className="w-4 h-4 text-charcoal-600" />
                    </button>
                    <button onClick={() => handleDeleteUser(user)} className="p-2 hover:bg-red-100 rounded-lg transition" aria-label={`Delete ${user.name}`}>
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
          <p>Showing {filteredUsers.length} of {users.length} users</p>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-charcoal-900">{editingUser?.id ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={closeUserModal} className="p-2 hover:bg-charcoal-100 rounded-lg" aria-label="Close user form">
                <X className="w-5 h-5 text-charcoal-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="user-name" className="block text-sm font-semibold text-charcoal-700 mb-2">Name</label>
                <input
                  id="user-name"
                  value={editingUser?.name || ''}
                  onChange={(e) => setEditingUser((current: any) => ({ ...current, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="user-email" className="block text-sm font-semibold text-charcoal-700 mb-2">Email</label>
                <input
                  id="user-email"
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={(e) => setEditingUser((current: any) => ({ ...current, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="user-phone" className="block text-sm font-semibold text-charcoal-700 mb-2">Phone</label>
                <input
                  id="user-phone"
                  value={editingUser?.phone || ''}
                  onChange={(e) => setEditingUser((current: any) => ({ ...current, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-role" className="block text-sm font-semibold text-charcoal-700 mb-2">Role</label>
                  <select
                    id="user-role"
                    value={editingUser?.role || 'listing_manager'}
                    onChange={(e) => setEditingUser((current: any) => ({ ...current, role: e.target.value }))}
                    className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="listing_manager">Listing Manager</option>
                    <option value="lead_manager">Lead Manager</option>
                    <option value="content_manager">Content Manager</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="user-status" className="block text-sm font-semibold text-charcoal-700 mb-2">Status</label>
                  <select
                    id="user-status"
                    value={editingUser?.status || 'active'}
                    onChange={(e) => setEditingUser((current: any) => ({ ...current, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <p className="text-xs text-charcoal-500 mt-5">
              Active users can sign in when their Firebase Auth email matches this access-list record. Use roles carefully because these roles can manage live marketplace data.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-60 transition font-medium"
              >
                {saving ? 'Saving...' : 'Save User'}
              </button>
            <button
                onClick={closeUserModal}
                className="px-4 py-2 bg-charcoal-200 text-charcoal-900 rounded-lg hover:bg-charcoal-300 transition font-medium"
            >
                Cancel
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
