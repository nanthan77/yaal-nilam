// @ts-nocheck
'use client'

import { useState } from 'react'

interface Permission {
  [role: string]: boolean
}

interface PermissionRow {
  name: string
  permissions: Permission
}

const ROLES = [
  'super_admin',
  'admin',
  'content_manager',
  'listing_manager',
  'lead_manager',
  'viewer',
]

const PERMISSIONS = ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Export']

const initialPermissions: PermissionRow[] = [
  {
    name: 'View',
    permissions: {
      super_admin: true,
      admin: true,
      content_manager: true,
      listing_manager: true,
      lead_manager: true,
      viewer: true,
    },
  },
  {
    name: 'Create',
    permissions: {
      super_admin: true,
      admin: true,
      content_manager: true,
      listing_manager: true,
      lead_manager: false,
      viewer: false,
    },
  },
  {
    name: 'Edit',
    permissions: {
      super_admin: true,
      admin: true,
      content_manager: true,
      listing_manager: true,
      lead_manager: false,
      viewer: false,
    },
  },
  {
    name: 'Delete',
    permissions: {
      super_admin: true,
      admin: true,
      content_manager: false,
      listing_manager: false,
      lead_manager: false,
      viewer: false,
    },
  },
  {
    name: 'Approve',
    permissions: {
      super_admin: true,
      admin: true,
      content_manager: false,
      listing_manager: false,
      lead_manager: false,
      viewer: false,
    },
  },
  {
    name: 'Export',
    permissions: {
      super_admin: true,
      admin: true,
      content_manager: false,
      listing_manager: true,
      lead_manager: true,
      viewer: false,
    },
  },
]

export default function RolesPage() {
  const [permissions, setPermissions] = useState<PermissionRow[]>(initialPermissions)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const togglePermission = (permissionIndex: number, role: string) => {
    setPermissions((prev) =>
      prev.map((perm, idx) =>
        idx === permissionIndex
          ? {
              ...perm,
              permissions: {
                ...perm.permissions,
                [role]: !perm.permissions[role],
              },
            }
          : perm
      )
    )
  }

  const getRoleLabel = (role: string) => {
    return role
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-charcoal-900">Roles & Permissions</h1>
        <p className="text-charcoal-600 mt-1">Manage user roles and access control</p>
      </div>

      {/* Role Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLES.map((role) => (
          <div
            key={role}
            onClick={() => setSelectedRole(selectedRole === role ? null : role)}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedRole === role
                ? 'bg-navy-50 border-navy-400'
                : 'bg-white border-sand-200 hover:border-sand-300'
            }`}
          >
            <h3 className="font-semibold text-charcoal-900">{getRoleLabel(role)}</h3>
            <p className="text-sm text-charcoal-600 mt-2">
              {role === 'super_admin' && 'Full platform access and configuration'}
              {role === 'admin' && 'Admin functions and content moderation'}
              {role === 'content_manager' && 'Manage listings and property content'}
              {role === 'listing_manager' && 'Create and edit property listings'}
              {role === 'lead_manager' && 'Manage inquiries and leads'}
              {role === 'viewer' && 'View-only access to dashboard'}
            </p>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white border border-sand-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand-50 border-b border-sand-200">
                <th className="text-left py-4 px-6 font-semibold text-charcoal-700 w-32">Permission</th>
                {ROLES.map((role) => (
                  <th
                    key={role}
                    className={`text-center py-4 px-3 font-semibold text-charcoal-700 min-w-[120px] ${
                      selectedRole === role ? 'bg-navy-50' : ''
                    }`}
                  >
                    <span className="text-xs">{getRoleLabel(role)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission, permIdx) => (
                <tr key={permission.name} className="border-b border-sand-100 hover:bg-sand-50">
                  <td className="py-4 px-6 font-medium text-charcoal-700">{permission.name}</td>
                  {ROLES.map((role) => (
                    <td
                      key={`${permission.name}-${role}`}
                      className={`text-center py-4 px-3 ${selectedRole === role ? 'bg-navy-50' : ''}`}
                    >
                      <label className="flex items-center justify-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={permission.permissions[role]}
                          onChange={() => togglePermission(permIdx, role)}
                          className="w-5 h-5 rounded border-sand-300 text-navy-600 cursor-pointer"
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend and Save */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-charcoal-600">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border-2 border-navy-600 bg-navy-600"></div>
            <span>Permitted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded border-2 border-sand-300"></div>
            <span>Not Permitted</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-lg bg-navy-600 text-white font-medium hover:bg-navy-700 transition-colors">
            Save Permissions
          </button>
          <button className="px-6 py-2 rounded-lg border border-sand-300 text-charcoal-700 font-medium hover:bg-sand-50">
            Reset to Default
          </button>
        </div>
      </div>

      {/* Role Details Section */}
      {selectedRole && (
        <div className="bg-white border border-sand-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-charcoal-900 mb-4">{getRoleLabel(selectedRole)} Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-charcoal-700 mb-2">Enabled Permissions</p>
              <div className="flex flex-wrap gap-2">
                {permissions
                  .filter((p) => p.permissions[selectedRole])
                  .map((p) => (
                    <span
                      key={p.name}
                      className="inline-block px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                    >
                      {p.name}
                    </span>
                  ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-charcoal-700 mb-2">Restricted Permissions</p>
              <div className="flex flex-wrap gap-2">
                {permissions
                  .filter((p) => !p.permissions[selectedRole])
                  .map((p) => (
                    <span
                      key={p.name}
                      className="inline-block px-3 py-1 bg-sand-100 text-charcoal-700 rounded-full text-sm font-medium"
                    >
                      {p.name}
                    </span>
                  ))}
              </div>
            </div>
            <div className="pt-4 border-t border-sand-200">
              <p className="text-sm text-charcoal-600">
                {selectedRole === 'super_admin' && 'Super Admin has unrestricted access to all platform functions and settings.'}
                {selectedRole === 'admin' && 'Admin can manage content, moderate users, and configure most settings.'}
                {selectedRole === 'content_manager' && 'Content Manager can create, edit, and manage all property listings.'}
                {selectedRole === 'listing_manager' && 'Listing Manager can create and edit property listings they own.'}
                {selectedRole === 'lead_manager' && 'Lead Manager can view and export inquiries and manage leads.'}
                {selectedRole === 'viewer' && 'Viewer has read-only access to the dashboard and reports.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
