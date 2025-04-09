'use client'

import { AlertTriangle, Clock, Plus, Search, Settings, Shield } from 'lucide-react'
import { useState } from 'react'

interface Role {
  id: string
  name: string
  description: string
  users: number
  permissions: string[]
  createdAt: string
  status: 'active' | 'inactive'
}

interface AdminActivity {
  id: number
  admin: string
  action: string
  details: string
  timestamp: string
  role: string
}

const roles: Role[] = [
  {
    id: 'role1',
    name: 'Super Admin',
    description: 'Full system access with all permissions',
    users: 3,
    permissions: ['all'],
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: 'role2',
    name: 'Moderator',
    description: 'Manage user content and basic operations',
    users: 8,
    permissions: ['read', 'write', 'moderate'],
    createdAt: '2024-02-01',
    status: 'active'
  },
  {
    id: 'role3',
    name: 'Support Agent',
    description: 'Handle customer support tickets',
    users: 12,
    permissions: ['read', 'support'],
    createdAt: '2024-02-15',
    status: 'active'
  }
]

const adminActivities: AdminActivity[] = [
  {
    id: 1,
    admin: 'john.admin@example.com',
    action: 'Modified Role',
    details: 'Updated permissions for Moderator role',
    timestamp: '2024-03-20 15:30:45',
    role: 'Super Admin'
  },
  {
    id: 2,
    admin: 'sarah.admin@example.com',
    action: 'Created Role',
    details: 'Created new Support Agent role',
    timestamp: '2024-03-20 14:25:12',
    role: 'Super Admin'
  },
  {
    id: 3,
    admin: 'mike.mod@example.com',
    action: 'Assigned Role',
    details: 'Assigned Support Agent role to user',
    timestamp: '2024-03-20 13:15:30',
    role: 'Moderator'
  }
]

const permissionCategories = [
  {
    name: 'User Management',
    permissions: ['View Users', 'Create Users', 'Edit Users', 'Delete Users', 'Block Users']
  },
  {
    name: 'Trading Operations',
    permissions: ['View Trades', 'Cancel Trades', 'Modify Orders', 'Set Trading Limits']
  },
  {
    name: 'Financial Operations',
    permissions: ['View Transactions', 'Approve Withdrawals', 'Process Refunds', 'Adjust Balances']
  },
  {
    name: 'Support System',
    permissions: ['View Tickets', 'Respond to Tickets', 'Close Tickets', 'Escalate Issues']
  },
  {
    name: 'System Settings',
    permissions: ['View Settings', 'Modify Settings', 'System Maintenance', 'Security Controls']
  }
]

export default function UserRolesPermissions() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [tempRoleExpiry, setTempRoleExpiry] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Roles & Permissions</h1>
          <p className="text-gray-500 mt-1">Manage admin access control and role assignments</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Roles List */}
        <div className="col-span-4 bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-medium">Roles</h2>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm">Show Inactive</span>
            </div>
          </div>

          <div className="space-y-2">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedRole === role.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedRole(role.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{role.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    role.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {role.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{role.users} users</span>
                  <span>Created {role.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="col-span-8 bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-medium">Permissions</h2>
            </div>
            <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
              Save Changes
            </button>
          </div>

          <div className="space-y-6">
            {permissionCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h3 className="font-medium text-gray-700">{category.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.permissions.map((permission) => (
                    <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm">{permission}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Temporary Role Assignment */}
        <div className="col-span-4 bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-medium">Temporary Access</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input
                type="datetime-local"
                value={tempRoleExpiry}
                onChange={(e) => setTempRoleExpiry(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Grant Temporary Access
            </button>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="col-span-8 bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-medium">Activity Logs</h2>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border rounded-lg text-sm"
                />
              </div>
              <select className="px-3 py-1.5 border rounded-lg text-sm">
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="modify">Modify</option>
                <option value="delete">Delete</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {adminActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">{activity.admin}</div>
                    <div className="text-sm text-gray-500">{activity.details}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{activity.timestamp}</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
                    {activity.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

