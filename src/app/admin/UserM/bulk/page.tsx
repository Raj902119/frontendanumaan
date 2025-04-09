'use client'

import { RadioGroup } from '@headlessui/react'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface User {
  email: string
  role: string
  kycStatus: string
  id: string
}

const sampleUsers: User[] = [
  {
    id: '1',
    email: 'john@gmail.com',
    role: 'Trader',
    kycStatus: 'Pending',
  },
  {
    id: '2',
    email: 'mike@gmail.com',
    role: 'Admin',
    kycStatus: 'Approved',
  },
  {
    id: '3',
    email: 'sarah@gmail.com',
    role: 'Trader',
    kycStatus: 'Suspended',
  }
]

const bulkActions = [
  { id: 'approve-kyc', label: 'Approve KYC' },
  { id: 'suspend', label: 'Suspend' },
  { id: 'activate', label: 'Activate' },
  { id: 'assign-role', label: 'Assign role' },
  { id: 'remove-role', label: 'Remove role' }
]

export default function BulkActions() {
  const [selectedAction, setSelectedAction] = useState('')
  const [emailFilter, setEmailFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [users, setUsers] = useState<User[]>(sampleUsers)

  const handleUserAction = (userId: string, action: 'approve' | 'suspend' | 'activate') => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'approve':
            return { ...user, kycStatus: 'Approved' }
          case 'suspend':
            return { ...user, kycStatus: 'Suspended' }
          case 'activate':
            return { ...user, kycStatus: 'Approved' }
          default:
            return user
        }
      }
      return user
    }))
  }

  const handleBulkAction = () => {
    if (!selectedAction) return

    const filteredUsers = users.filter(user => {
      const matchesEmail = emailFilter ? user.email.toLowerCase().includes(emailFilter.toLowerCase()) : true
      const matchesRole = roleFilter ? user.role.toLowerCase().includes(roleFilter.toLowerCase()) : true
      return matchesEmail && matchesRole
    })

    setUsers(prevUsers => prevUsers.map(user => {
      // Check if the user is in the filtered list
      const shouldUpdate = filteredUsers.some(filteredUser => filteredUser.id === user.id)
      if (!shouldUpdate) return user

      switch (selectedAction) {
        case 'approve-kyc':
          return { ...user, kycStatus: 'Approved' }
        case 'suspend':
          return { ...user, kycStatus: 'Suspended' }
        case 'activate':
          return { ...user, kycStatus: 'Approved' }
        default:
          return user
      }
    }))

    // Reset selected action after applying
    setSelectedAction('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-32px)]">
      <div className="flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500 mt-1">Manage your users and their permissions</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold">Bulk Actions</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-6">
          <RadioGroup value={selectedAction} onChange={setSelectedAction}>
            <div className="space-y-2">
              {bulkActions.map((action) => (
                <RadioGroup.Option
                  key={action.id}
                  value={action.id}
                  className={({ checked }: { checked: boolean }) => `
                    relative flex cursor-pointer rounded-lg border p-4 hover:bg-gray-50
                    ${checked ? 'bg-blue-50 border-blue-200' : 'bg-white'}
                  `}
                >
                  {({ checked }: { checked: boolean }) => (
                    <>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label className="font-medium text-gray-900">
                              {action.label}
                            </RadioGroup.Label>
                          </div>
                        </div>
                        <div className={`shrink-0 rounded-full border-2 w-4 h-4 ${
                          checked 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
                          {checked && (
                            <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Filter by email
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Enter email"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={emailFilter}
                  onChange={(e) => setEmailFilter(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Filter by role
              </label>
              <input
                type="text"
                placeholder="Enter role"
                className="w-full px-4 py-2 border rounded-lg"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleBulkAction}
              disabled={!selectedAction}
              className={`px-4 py-2 rounded-lg ${
                selectedAction
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Apply Bulk Action
            </button>
          </div>

          <div className="bg-white rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">KYC Status</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        user.kycStatus === 'Approved'
                          ? 'text-blue-700'
                          : user.kycStatus === 'Pending'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                      }`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          if (user.kycStatus === 'Pending') {
                            handleUserAction(user.id, 'approve')
                          } else if (user.kycStatus === 'Approved') {
                            handleUserAction(user.id, 'suspend')
                          } else {
                            handleUserAction(user.id, 'activate')
                          }
                        }}
                      >
                        {user.kycStatus === 'Pending' ? 'Approve KYC' :
                         user.kycStatus === 'Approved' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
