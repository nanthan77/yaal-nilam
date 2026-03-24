'use client';

import { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Shield,
  CheckCircle,
  Circle,
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  user_count: number;
  color: string;
}

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  report: boolean;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Super Admin',
    description: 'Full platform access',
    user_count: 1,
    color: 'purple',
  },
  {
    id: '2',
    name: 'Admin',
    description: 'Platform management and moderation',
    user_count: 2,
    color: 'blue',
  },
  {
    id: '3',
    name: 'Content Manager',
    description: 'Manage website content and SEO',
    user_count: 1,
    color: 'teal',
  },
  {
    id: '4',
    name: 'Listing Manager',
    description: 'Review and approve listings',
    user_count: 3,
    color: 'emerald',
  },
  {
    id: '5',
    name: 'Lead Manager',
    description: 'Manage inquiries and leads',
    user_count: 2,
    color: 'orange',
  },
];

const permissionModules = ['Listings', 'Users', 'Content', 'Reports', 'Settings', 'Analytics', 'Payments', 'Agents', 'Inquiries', 'Areas', 'Promotions', 'Media'];

const getRoleColor = (color: string) => {
  const colors: Record<string, string> = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    teal: 'from-teal-500 to-teal-600',
    emerald: 'from-emerald-500 to-emerald-600',
    orange: 'from-orange-500 to-orange-600',
  };
  return colors[color] || 'from-slate-500 to-slate-600';
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    color: 'teal',
  });

  const handleAddRole = () => {
    if (newRole.name) {
      setShowAddModal(false);
      setNewRole({
        name: '',
        description: '',
        color: 'teal',
      });
    }
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setShowPermissions(true);
    initializePermissions(role);
  };

  const initializePermissions = (role: Role) => {
    const rolePermissions: Record<string, Record<string, boolean>> = {};
    permissionModules.forEach((module) => {
      rolePermissions[module] = {
        view: role.id === '1' || role.id === '2',
        create: role.id === '1' || role.id === '2',
        edit: role.id === '1' || role.id === '2',
        delete: role.id === '1' || role.id === '2',
        approve: role.id === '1' || role.id === '2',
        report: true,
      };
    });
    setPermissions(rolePermissions);
  };

  const togglePermission = (module: string, permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: !prev[module][permission],
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Roles & Permissions</h1>
        <p className="text-slate-600">Manage user roles and their permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Roles</p>
          <p className="text-3xl font-bold text-navy-900">{roles.length}</p>
          <p className="text-xs text-slate-500 mt-2">Active roles</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Users</p>
          <p className="text-3xl font-bold text-teal-600">
            {roles.reduce((sum, r) => sum + r.user_count, 0)}
          </p>
          <p className="text-xs text-slate-500 mt-2">Assigned to roles</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-slate-600 text-sm font-medium mb-1">Permissions</p>
          <p className="text-3xl font-bold text-emerald-600">{permissionModules.length}</p>
          <p className="text-xs text-slate-500 mt-2">Module permissions</p>
        </div>
      </div>

      {/* Add Role Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition cursor-pointer group"
            onClick={() => handleSelectRole(role)}
          >
            {/* Header */}
            <div className={`h-20 bg-gradient-to-r ${getRoleColor(role.color)}`} />

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900">{role.name}</h3>
              <p className="text-sm text-slate-600 mt-2">{role.description}</p>

              {/* Stats */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{role.user_count} users</span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(role);
                  }}
                  className="flex-1 bg-teal-50 text-teal-700 hover:bg-teal-100 py-2 rounded transition font-medium text-sm"
                >
                  Manage
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex-1 bg-slate-100 text-slate-700 hover:bg-slate-200 py-2 rounded transition font-medium text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      {!showPermissions && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">Role Permission Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold text-slate-900">Module</th>
                  {roles.map((role) => (
                    <th key={role.id} className="px-4 py-3 text-center font-semibold text-slate-900 text-sm">
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionModules.map((module) => (
                  <tr key={module} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{module}</td>
                    {roles.map((role) => (
                      <td key={role.id} className="px-4 py-3 text-center">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Permissions Sidebar */}
      {showPermissions && selectedRole && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">{selectedRole.name} Permissions</h2>
            <button
              onClick={() => setShowPermissions(false)}
              className="text-slate-500 hover:text-slate-700 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            {permissionModules.map((module) => (
              <div key={module} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900 mb-3">{module}</h4>
                <div className="space-y-2">
                  {['View', 'Create', 'Edit', 'Delete', 'Approve'].map((perm) => (
                    <label key={perm} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permissions[module]?.[perm.toLowerCase()] || false}
                        onChange={() => togglePermission(module, perm.toLowerCase())}
                        className="w-4 h-4 rounded border-slate-300 accent-teal-600"
                      />
                      <span className="text-sm text-slate-700">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition mt-6">
              Save Permissions
            </button>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add New Role</h2>
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
                  Role Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Editor"
                  value={newRole.name}
                  onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Describe the role and its responsibilities"
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Color
                </label>
                <div className="flex gap-2">
                  {['purple', 'blue', 'teal', 'emerald', 'orange'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewRole({ ...newRole, color })}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRoleColor(color)} ${
                        newRole.color === color ? 'ring-2 ring-offset-2 ring-slate-900' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRole}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 rounded-lg transition"
                >
                  Add Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
