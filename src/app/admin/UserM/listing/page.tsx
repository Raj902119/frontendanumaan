'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Eye, Search } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface User {
  id: string
  name: string
  avatar: string
  role: 'Admin' | 'Member'
  kyc: 'Approved' | 'Pending' | 'Rejected'
  risk: 'Low' | 'Medium' | 'High'
  status: 'Active' | 'Inactive'
  registered: string
  email: string
  phone: string
  totalTrades: number
  accountBalance: number
}

const sampleUsers: User[] = [
  {
    id: '#10001',
    name: 'John Smith',
    avatar: '/avatars/1.jpg',
    role: 'Admin',
    kyc: 'Approved',
    risk: 'Low',
    status: 'Active',
    registered: '2024-03-01',
    email: 'john.smith@example.com',
    phone: '+1 234-567-8901',
    totalTrades: 150,
    accountBalance: 25000
  },
  {
    id: '#10002',
    name: 'Alice Brown',
    avatar: '/avatars/2.jpg',
    role: 'Member',
    kyc: 'Pending',
    risk: 'High',
    status: 'Active',
    registered: '2024-02-15',
    email: 'alice.b@example.com',
    phone: '+1 345-678-9012',
    totalTrades: 45,
    accountBalance: 8000
  },
  {
    id: '#10003',
    name: 'David Wilson',
    avatar: '/avatars/3.jpg',
    role: 'Member',
    kyc: 'Rejected',
    risk: 'Medium',
    status: 'Inactive',
    registered: '2024-01-20',
    email: 'david.w@example.com',
    phone: '+1 456-789-0123',
    totalTrades: 0,
    accountBalance: 0
  },
  {
    id: '#10004',
    name: 'Sarah Johnson',
    avatar: '/avatars/4.jpg',
    role: 'Member',
    kyc: 'Approved',
    risk: 'Low',
    status: 'Active',
    registered: '2024-02-28',
    email: 'sarah.j@example.com',
    phone: '+1 567-890-1234',
    totalTrades: 89,
    accountBalance: 15000
  }
]

export default function UserListing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState(sampleUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Filter function
  const handleFilterClick = (filter: string) => {
    setActiveFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter)
      }
      return [...prev, filter]
    })
  }

  // Apply filters and search
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Active filters
    const matchesFilters = activeFilters.length === 0 || activeFilters.every(filter => {
      if (filter.startsWith('KYC: ')) {
        return user.kyc === filter.replace('KYC: ', '')
      }
      if (filter.startsWith('Risk: ')) {
        return user.risk === filter.replace('Risk: ', '')
      }
      if (filter.startsWith('Status: ')) {
        return user.status === filter.replace('Status: ', '')
      }
      if (filter.startsWith('Role: ')) {
        return user.role === filter.replace('Role: ', '')
      }
      return true
    })

    return matchesSearch && matchesFilters
  })

  const FilterButton = ({ label, value }: { label: string, value: string }) => (
    <button
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        activeFilters.includes(value)
          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      onClick={() => handleFilterClick(value)}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="search"
            placeholder="Search users"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton label="KYC: Approved" value="KYC: Approved" />
        <FilterButton label="KYC: Pending" value="KYC: Pending" />
        <FilterButton label="KYC: Rejected" value="KYC: Rejected" />
        <FilterButton label="Risk: High" value="Risk: High" />
        <FilterButton label="Status: Active" value="Status: Active" />
        <FilterButton label="Status: Inactive" value="Status: Inactive" />
        <FilterButton label="Role: Admin" value="Role: Admin" />
        <FilterButton label="Role: Member" value="Role: Member" />
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b text-sm">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Role</th>
              <th className="text-left py-3 px-4">KYC</th>
              <th className="text-left py-3 px-4">Risk</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Registered</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={40} 
                        height={40}
                      />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">{user.role}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.kyc === 'Approved' 
                      ? 'bg-green-100 text-green-700'
                      : user.kyc === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.kyc}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.risk === 'Low'
                      ? 'bg-green-100 text-green-700'
                      : user.risk === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {user.risk}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-500">{user.registered}</td>
                <td className="py-4 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <Image 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name} 
                    width={64} 
                    height={64}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{selectedUser.phone}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Role</p>
                  <p>{selectedUser.role}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Registered</p>
                  <p>{selectedUser.registered}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Trades</p>
                  <p>{selectedUser.totalTrades}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Account Balance</p>
                  <p>₹{selectedUser.accountBalance.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">KYC Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedUser.kyc === 'Approved' 
                      ? 'bg-green-100 text-green-700'
                      : selectedUser.kyc === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedUser.kyc}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Risk Level</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedUser.risk === 'Low'
                      ? 'bg-green-100 text-green-700'
                      : selectedUser.risk === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedUser.risk}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedUser.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
