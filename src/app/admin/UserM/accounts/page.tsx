'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from '@/components/ui/switch'
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Clock, Search, Shield } from 'lucide-react'
import { useState } from 'react'

interface AccountActivity {
  timestamp: string
  deviceType: string
  location: string
  ipAddress: string
  action: 'Login' | 'Logout' | 'Password Change' | 'Role Change' | '2FA Enabled' | '2FA Disabled' | 'Failed Login'
  deviceInfo: {
    browser: string
    os: string
    isMobile: boolean
  }
  securityFlags?: {
    isUnusualLocation?: boolean
    isNewDevice?: boolean
    failedAttempts?: number
    riskLevel?: 'Low' | 'Medium' | 'High'
  }
  details?: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
  lastLogin: string
  status: 'Active' | 'Suspended' | 'Inactive'
  twoFactorEnabled: boolean
  loginAttempts: number
  lastActivity: string
  location: string
  device: string
  suspensionEndDate?: string
}

// Add sample users data
const sampleUsers: User[] = [
  {
    id: 'ACC001',
    name: 'John Smith',
    email: 'john.s@example.com',
    role: 'Admin',
    lastLogin: '2024-03-27 09:30',
    status: 'Active',
    twoFactorEnabled: true,
    loginAttempts: 0,
    lastActivity: '2 minutes ago',
    location: 'Mumbai, India',
    device: 'Chrome / Windows',
    suspensionEndDate: undefined
  },
  {
    id: 'ACC002',
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    role: 'User',
    lastLogin: '2024-03-26 15:45',
    status: 'Suspended',
    twoFactorEnabled: false,
    loginAttempts: 3,
    lastActivity: '1 day ago',
    location: 'Delhi, India',
    device: 'Safari / iOS',
    suspensionEndDate: undefined
  },
  {
    id: 'ACC003',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: 'User',
    lastLogin: '2024-03-27 11:20',
    status: 'Active',
    twoFactorEnabled: true,
    loginAttempts: 0,
    lastActivity: '1 hour ago',
    location: 'Bangalore, India',
    device: 'Firefox / MacOS',
    suspensionEndDate: undefined
  },
  {
    id: 'ACC004',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    role: 'User',
    lastLogin: '2024-03-25 14:15',
    status: 'Inactive',
    twoFactorEnabled: false,
    loginAttempts: 1,
    lastActivity: '2 days ago',
    location: 'Chennai, India',
    device: 'Chrome / Android',
    suspensionEndDate: undefined
  }
]

// Add suspension duration options
const SUSPENSION_DURATIONS = [
  { label: '1 Day', days: 1 },
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: 'Custom', days: 0 }
]

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [suspensionReason, setSuspensionReason] = useState('')
  const [users, setUsers] = useState(sampleUsers)
  const [selectedDuration, setSelectedDuration] = useState(SUSPENSION_DURATIONS[0])
  const [customDays, setCustomDays] = useState('')

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.id.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })

  // Add suspension handler
  const handleSuspendUser = (userId: string) => {
    if (!suspensionReason.trim()) return

    const suspensionDays = selectedDuration.label === 'Custom' 
      ? parseInt(customDays) 
      : selectedDuration.days

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + suspensionDays)

    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'Suspended' ? 'Active' : 'Suspended',
          suspensionEndDate: user.status !== 'Suspended' ? endDate.toISOString() : undefined
        }
      }
      return user
    }))

    setShowSuspendModal(false)
    setSuspensionReason('')
    setSelectedDuration(SUSPENSION_DURATIONS[0])
    setCustomDays('')
    setSelectedUser(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Account Management</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="search"
            placeholder="Search by name, email, ID..."
            className="pl-9 pr-3 py-2 border rounded-lg w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">Last Login</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">2FA</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4">{user.lastLogin}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col items-start gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-700'
                        : user.status === 'Suspended'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.status !== 'Suspended'}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Reactivate account
                            setUsers(prevUsers => prevUsers.map(u => 
                              u.id === user.id ? { ...u, status: 'Active', suspensionEndDate: undefined } : u
                            ))
                          } else {
                            // Show suspension modal
                            setSelectedUser(user)
                            setShowSuspendModal(true)
                          }
                        }}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <span className="text-xs text-gray-500">
                        {user.status !== 'Suspended' ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                    {user.suspensionEndDate && (
                      <span className="text-xs text-gray-500">
                        Until {new Date(user.suspensionEndDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.twoFactorEnabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.twoFactorEnabled ? 'On' : 'Off'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowActivityModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Activity
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No users found matching your search
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Activity Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Activity</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="mt-4">
              <div className="mb-6">
                <h3 className="font-medium text-lg">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Last Activity</p>
                  <p className="font-medium">{selectedUser.lastActivity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedUser.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Device</p>
                  <p className="font-medium">{selectedUser.device}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Login Attempts</p>
                  <p className="font-medium">{selectedUser.loginAttempts}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Logged in from Mumbai, India</span>
                    <span className="text-gray-400">2 minutes ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>Changed password</span>
                    <span className="text-gray-400">1 day ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span>Failed login attempt</span>
                    <span className="text-gray-400">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Suspension Modal */}
      <Dialog open={showSuspendModal} onOpenChange={setShowSuspendModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Suspend Account</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{selectedUser.name}</h3>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Suspension Duration
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {SUSPENSION_DURATIONS.map((duration) => (
                      <button
                        key={duration.label}
                        onClick={() => setSelectedDuration(duration)}
                        className={`px-3 py-2 text-sm border rounded-lg ${
                          selectedDuration.label === duration.label
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {duration.label}
                      </button>
                    ))}
                  </div>
                  {selectedDuration.label === 'Custom' && (
                    <div className="mt-2">
                      <input
                        type="number"
                        min="1"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        placeholder="Enter number of days"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Reason for Suspension
                  </label>
                  <Textarea
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    placeholder="Enter reason for account suspension..."
                    className="h-32"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSuspendModal(false)
                    setSuspensionReason('')
                    setSelectedDuration(SUSPENSION_DURATIONS[0])
                    setCustomDays('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleSuspendUser(selectedUser.id)}
                  disabled={!suspensionReason.trim() || 
                    (selectedDuration.label === 'Custom' && !customDays)}
                >
                  Suspend Account
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
