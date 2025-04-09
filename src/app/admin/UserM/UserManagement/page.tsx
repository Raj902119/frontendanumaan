'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'

interface User {
  id: string
  username: string
  email: string
  phone: string
  registrationDate: string
  accountBalance: number
  totalTrades: number
  kycStatus: 'Verified' | 'Pending'
  riskLevel: 'Low' | 'Medium' | 'High'
}

const sampleUsers: User[] = [
  {
    id: '#10001',
    username: 'John Doe',
    email: 'john.doe@gmail.com',
    phone: '+1 (123) 456-7890',
    registrationDate: '2024-03-01',
    accountBalance: 5000,
    totalTrades: 50,
    kycStatus: 'Verified',
    riskLevel: 'Low'
  },
  {
    id: '#10002',
    username: 'Alice Smith',
    email: 'alice.smith@gmail.com',
    phone: '+1 (234) 567-8901',
    registrationDate: '2024-02-15',
    accountBalance: 12000,
    totalTrades: 120,
    kycStatus: 'Verified',
    riskLevel: 'Medium'
  },
  {
    id: '#10003',
    username: 'Bob Johnson',
    email: 'bob.j@gmail.com',
    phone: '+1 (345) 678-9012',
    registrationDate: '2024-03-10',
    accountBalance: 3000,
    totalTrades: 25,
    kycStatus: 'Pending',
    riskLevel: 'High'
  },
  {
    id: '#10004',
    username: 'Emma Wilson',
    email: 'emma.w@gmail.com',
    phone: '+1 (456) 789-0123',
    registrationDate: '2024-01-20',
    accountBalance: 8000,
    totalTrades: 75,
    kycStatus: 'Verified',
    riskLevel: 'Low'
  },
  {
    id: '#10005',
    username: 'Michael Brown',
    email: 'michael.b@gmail.com',
    phone: '+1 (567) 890-1234',
    registrationDate: '2024-02-28',
    accountBalance: 15000,
    totalTrades: 200,
    kycStatus: 'Verified',
    riskLevel: 'Medium'
  }
]

export default function UserListing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState(sampleUsers)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User | null,
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  // Sorting function
  const handleSort = (key: keyof User) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))

    setUsers(prevUsers => {
      const sortedUsers = [...prevUsers].sort((a, b) => {
        if (key === 'registrationDate') {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime()
        }
        if (typeof a[key] === 'number' && typeof b[key] === 'number') {
          return (a[key] as number) - (b[key] as number)
        }
        return String(a[key]).localeCompare(String(b[key]))
      })

      return sortConfig.direction === 'desc' ? sortedUsers.reverse() : sortedUsers
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500 mt-1">Manage users in your organization</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="search"
            placeholder="Search by username, email, phone number, user ID, KYC status, risk level"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          className={`px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 ${
            sortConfig.key === 'registrationDate' ? 'bg-blue-50 border-blue-200' : ''
          }`}
          onClick={() => handleSort('registrationDate')}
        >
          Sort by registration date
          {sortConfig.key === 'registrationDate' && (
            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
        <button 
          className={`px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 ${
            sortConfig.key === 'totalTrades' ? 'bg-blue-50 border-blue-200' : ''
          }`}
          onClick={() => handleSort('totalTrades')}
        >
          Sort by total trades
          {sortConfig.key === 'totalTrades' && (
            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
        <button 
          className={`px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 ${
            sortConfig.key === 'accountBalance' ? 'bg-blue-50 border-blue-200' : ''
          }`}
          onClick={() => handleSort('accountBalance')}
        >
          Sort by account balance
          {sortConfig.key === 'accountBalance' && (
            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">User ID</th>
                <th className="text-left py-3 px-4 font-medium">Username</th>
                <th className="text-left py-3 px-4 font-medium">Registration Date</th>
                <th className="text-left py-3 px-4 font-medium">Phone</th>
                <th className="text-left py-3 px-4 font-medium">KYC Status</th>
                <th className="text-left py-3 px-4 font-medium">Risk Level</th>
                <th className="text-right py-3 px-4 font-medium">Total Trades</th>
                <th className="text-right py-3 px-4 font-medium">Account Balance</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="text-blue-600">{user.id}</span>
                  </td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.registrationDate}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.kycStatus === 'Verified' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.riskLevel === 'Low' 
                        ? 'bg-green-100 text-green-700'
                        : user.riskLevel === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">{user.totalTrades}</td>
                  <td className="py-3 px-4 text-right">₹{user.accountBalance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
