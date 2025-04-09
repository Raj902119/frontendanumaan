'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Search, Star, TrendingUp, Trophy } from 'lucide-react'
import { useState } from 'react'

interface ReferralBonus {
  referredUserId: string
  referredUserName: string
  depositAmount: number
  bonusAmount: number
  timestamp: string
  isUsed: boolean
}

interface ReferredUser {
  id: string
  name: string
  email: string
  joinDate: string
  depositAmount: number
  bonusGenerated: number
  status: 'active' | 'inactive'
  kycStatus: 'completed' | 'pending' | 'failed'
}

interface ReferralUser {
  id: string
  name: string
  email: string
  referralCode: string
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  loyaltyPoints: number
  status: 'active' | 'suspended'
  joinedDate: string
  recentActivity: {
    type: 'referral' | 'redemption' | 'points_earned'
    description: string
    timestamp: string
    amount?: number
  }[]
  fraudFlags?: {
    type: string
    severity: 'low' | 'medium' | 'high'
    description: string
  }[]
  bonusHistory: ReferralBonus[]
  availableBonus: number
  totalBonusEarned: number
  bonusUsageHistory: {
    amount: number
    eventId: string
    eventName: string
    timestamp: string
  }[]
  referredUsers: ReferredUser[]
}

const sampleUsers: ReferralUser[] = [
  {
    id: 'USR-001',
    name: 'John Smith',
    email: 'john@example.com',
    referralCode: 'JOHN2024',
    totalReferrals: 25,
    activeReferrals: 20,
    totalEarnings: 2500,
    loyaltyPoints: 5000,
    status: 'active',
    joinedDate: '2024-01-15',
    availableBonus: 750,
    totalBonusEarned: 2500,
    bonusHistory: [
      {
        referredUserId: 'USR-101',
        referredUserName: 'Alice Brown',
        depositAmount: 1000,
        bonusAmount: 500,
        timestamp: '2024-03-26 14:30',
        isUsed: false
      },
      {
        referredUserId: 'USR-102',
        referredUserName: 'Bob Wilson',
        depositAmount: 200,
        bonusAmount: 100,
        timestamp: '2024-03-25 11:20',
        isUsed: true
      }
    ],
    bonusUsageHistory: [
      {
        amount: 100,
        eventId: 'EVT-001',
        eventName: 'Crypto Trading Competition',
        timestamp: '2024-03-25 15:30'
      }
    ],
    fraudFlags: [
      {
        type: 'multiple_accounts',
        severity: 'high',
        description: 'Multiple accounts detected with same IP'
      }
    ],
    recentActivity: [
      {
        type: 'referral',
        description: 'New user signup through referral',
        timestamp: '2024-03-26 14:30',
        amount: 100
      },
      {
        type: 'points_earned',
        description: 'Loyalty points earned from referral activity',
        timestamp: '2024-03-26 14:30',
        amount: 500
      }
    ],
    referredUsers: [
      {
        id: 'USR-101',
        name: 'Alice Brown',
        email: 'alice@example.com',
        joinDate: '2024-03-26',
        depositAmount: 1000,
        bonusGenerated: 500,
        status: 'active',
        kycStatus: 'completed'
      },
      {
        id: 'USR-102',
        name: 'Bob Wilson',
        email: 'bob@example.com',
        joinDate: '2024-03-25',
        depositAmount: 200,
        bonusGenerated: 100,
        status: 'active',
        kycStatus: 'completed'
      },
    ]
  },
  {
    id: 'USR-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    referralCode: 'SARAH50',
    totalReferrals: 42,
    activeReferrals: 35,
    totalEarnings: 4200,
    loyaltyPoints: 8500,
    status: 'active',
    joinedDate: '2024-02-01',
    availableBonus: 1200,
    totalBonusEarned: 3800,
    bonusHistory: [
      {
        referredUserId: 'USR-201',
        referredUserName: 'Mike Chen',
        depositAmount: 800,
        bonusAmount: 400,
        timestamp: '2024-03-25 09:15',
        isUsed: false
      }
    ],
    bonusUsageHistory: [],
    recentActivity: [
      {
        type: 'referral',
        description: 'New referral signup completed KYC',
        timestamp: '2024-03-25 09:15',
        amount: 150
      }
    ],
    referredUsers: [
      {
        id: 'USR-201',
        name: 'Mike Chen',
        email: 'mike.c@example.com',
        joinDate: '2024-03-25',
        depositAmount: 800,
        bonusGenerated: 400,
        status: 'active',
        kycStatus: 'completed'
      }
    ]
  },
  {
    id: 'USR-003',
    name: 'David Brown',
    email: 'david.b@example.com',
    referralCode: 'DAVID75',
    totalReferrals: 15,
    activeReferrals: 12,
    totalEarnings: 1500,
    loyaltyPoints: 3000,
    status: 'suspended',
    joinedDate: '2024-02-15',
    availableBonus: 0,
    totalBonusEarned: 1200,
    bonusHistory: [
      {
        referredUserId: 'USR-301',
        referredUserName: 'Emma Wilson',
        depositAmount: 500,
        bonusAmount: 250,
        timestamp: '2024-03-20 16:45',
        isUsed: true
      }
    ],
    bonusUsageHistory: [
      {
        amount: 250,
        eventId: 'EVT-002',
        eventName: 'Forex Trading Contest',
        timestamp: '2024-03-22 14:20'
      }
    ],
    fraudFlags: [
      {
        type: 'suspicious_activity',
        severity: 'high',
        description: 'Unusual pattern of referral signups'
      }
    ],
    recentActivity: [
      {
        type: 'redemption',
        description: 'Bonus used in trading event',
        timestamp: '2024-03-22 14:20',
        amount: 250
      }
    ],
    referredUsers: [
      {
        id: 'USR-301',
        name: 'Emma Wilson',
        email: 'emma.w@example.com',
        joinDate: '2024-03-20',
        depositAmount: 500,
        bonusGenerated: 250,
        status: 'active',
        kycStatus: 'completed'
      }
    ]
  },
  {
    id: 'USR-004',
    name: 'Lisa Chen',
    email: 'lisa.c@example.com',
    referralCode: 'LISA100',
    totalReferrals: 38,
    activeReferrals: 30,
    totalEarnings: 3800,
    loyaltyPoints: 7600,
    status: 'active',
    joinedDate: '2024-01-20',
    availableBonus: 900,
    totalBonusEarned: 3200,
    bonusHistory: [
      {
        referredUserId: 'USR-401',
        referredUserName: 'Tom Wilson',
        depositAmount: 1000,
        bonusAmount: 500,
        timestamp: '2024-03-24 11:30',
        isUsed: false
      }
    ],
    bonusUsageHistory: [
      {
        amount: 300,
        eventId: 'EVT-003',
        eventName: 'Options Trading Workshop',
        timestamp: '2024-03-23 15:40'
      }
    ],
    recentActivity: [
      {
        type: 'referral',
        description: 'New referral made first deposit',
        timestamp: '2024-03-24 11:30',
        amount: 200
      }
    ],
    referredUsers: [
      {
        id: 'USR-401',
        name: 'Tom Wilson',
        email: 'tom.w@example.com',
        joinDate: '2024-03-24',
        depositAmount: 1000,
        bonusGenerated: 500,
        status: 'active',
        kycStatus: 'completed'
      }
    ]
  },
  {
    id: 'USR-005',
    name: 'Michael Wilson',
    email: 'michael.w@example.com',
    referralCode: 'MIKE200',
    totalReferrals: 28,
    activeReferrals: 22,
    totalEarnings: 2800,
    loyaltyPoints: 5600,
    status: 'active',
    joinedDate: '2024-02-10',
    availableBonus: 600,
    totalBonusEarned: 2400,
    bonusHistory: [
      {
        referredUserId: 'USR-501',
        referredUserName: 'James Brown',
        depositAmount: 600,
        bonusAmount: 300,
        timestamp: '2024-03-25 13:20',
        isUsed: false
      }
    ],
    bonusUsageHistory: [
      {
        amount: 200,
        eventId: 'EVT-004',
        eventName: 'Crypto Market Analysis',
        timestamp: '2024-03-24 16:15'
      }
    ],
    recentActivity: [
      {
        type: 'points_earned',
        description: 'Monthly loyalty bonus credited',
        timestamp: '2024-03-25 13:20',
        amount: 300
      }
    ],
    referredUsers: [
      {
        id: 'USR-501',
        name: 'James Brown',
        email: 'james.b@example.com',
        joinDate: '2024-03-25',
        depositAmount: 600,
        bonusGenerated: 300,
        status: 'active',
        kycStatus: 'pending'
      }
    ]
  }
]

export default function ReferralManagement() {
  const [users, setUsers] = useState<ReferralUser[]>(sampleUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<ReferralUser | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [sortBy, setSortBy] = useState<'referrals' | 'earnings' | 'points'>('referrals')
  const [showFraudOnly, setShowFraudOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'top' | 'fraud'>('all')
  const [showAllTopReferrers, setShowAllTopReferrers] = useState(false)
  const [showAllFraudAlerts, setShowAllFraudAlerts] = useState(false)

  const stats = {
    totalReferrals: users.reduce((sum, user) => sum + user.totalReferrals, 0),
    activeReferrers: users.filter(user => user.activeReferrals > 0).length,
    totalPoints: users.reduce((sum, user) => sum + user.loyaltyPoints, 0),
    fraudAlerts: users.filter(user => user.fraudFlags && user.fraudFlags.length > 0).length,
    totalBonusIssued: users.reduce((sum, user) => sum + user.totalBonusEarned, 0),
    availableBonusTotal: users.reduce((sum, user) => sum + user.availableBonus, 0),
    averageBonusPerReferral: users.reduce((sum, user) => sum + user.totalBonusEarned, 0) / 
      users.reduce((sum, user) => sum + user.totalReferrals, 0) || 0
  }

  const getFilteredUsers = () => {
    let filtered = [...users]

    if (searchQuery) {
      filtered = filtered.filter(user => {
        return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.referralCode.toLowerCase().includes(searchQuery.toLowerCase())
      })
    }

    switch (viewMode) {
      case 'top':
        filtered = filtered.sort((a, b) => b.totalReferrals - a.totalReferrals)
        break
      case 'fraud':
        filtered = filtered.filter(user => user.fraudFlags && user.fraudFlags.length > 0)
          .sort((a, b) => {
            const aHighest = Math.max(...(a.fraudFlags?.map(f => 
              f.severity === 'high' ? 3 : f.severity === 'medium' ? 2 : 1) || [0]))
            const bHighest = Math.max(...(b.fraudFlags?.map(f => 
              f.severity === 'high' ? 3 : f.severity === 'medium' ? 2 : 1) || [0]))
            return bHighest - aHighest
          })
        break
    }

    return filtered
  }

  const filteredUsers = getFilteredUsers()

  const topReferrers = [...users]
    .sort((a, b) => b.totalReferrals - a.totalReferrals)
    .slice(0, 3)

  const fraudAlerts = users
    .filter(user => user.fraudFlags && user.fraudFlags.length > 0)
    .slice(0, 3)

  const handleStatusChange = (userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'active' ? 'suspended' : 'active'
        }
      }
      return user
    }))
  }

  const handleExportData = () => {
    const exportData = filteredUsers.map(user => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      'Referral Code': user.referralCode,
      'Total Referrals': user.totalReferrals,
      'Active Referrals': user.activeReferrals,
      'Total Earnings': user.totalEarnings,
      'Loyalty Points': user.loyaltyPoints,
      Status: user.status
    }))

    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(exportData[0]).join(",") + "\n" +
      exportData.map(row => Object.values(row).join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "referral_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const calculateBonus = (depositAmount: number): number => {
    if (depositAmount < 100) return 0
    const bonus = depositAmount * 0.5
    return Math.min(bonus, 500)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Quick Stats */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold">Referral & Loyalty Program</h1>
        <p className="text-gray-500 mt-1">Manage referrals, loyalty points, and rewards</p>
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div>
            <span className="text-gray-500">Program Growth:</span>
            <span className="ml-2 text-green-600 font-medium">+25% this month</span>
          </div>
          <div>
            <span className="text-gray-500">Average Bonus Per Referral:</span>
            <span className="ml-2 font-medium">₹{Math.round(stats.averageBonusPerReferral)}</span>
          </div>
          <div>
            <span className="text-gray-500">Active Conversion Rate:</span>
            <span className="ml-2 text-blue-600 font-medium">
              {Math.round((stats.activeReferrers / stats.totalReferrals) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow duration-200">
          <div className="text-sm text-gray-500">Total Referrals</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.totalReferrals}</div>
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +12% this month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Active Referrers</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.activeReferrers}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Total Points Issued</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{stats.totalPoints}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Fraud Alerts</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{stats.fraudAlerts}</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            Requires attention
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Available Bonus Pool</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            ₹{stats.availableBonusTotal}
          </div>
          <div className="text-xs text-purple-600 mt-1">
            Non-withdrawable
          </div>
        </div>
      </div>

      {/* Enhanced Top Referrers & Fraud Alerts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Top Referrers */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Referrers
            </h2>
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                setViewMode(viewMode === 'top' ? 'all' : 'top')
                setShowAllTopReferrers(true)
                setSearchQuery('')
              }}
            >
              {viewMode === 'top' ? 'Show All Users' : 'View All Top Referrers'}
            </button>
          </div>
          <div className="space-y-3">
            {(viewMode === 'top' ? filteredUsers : filteredUsers.slice(0, 3))
              .map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.totalReferrals} referrals</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{user.totalEarnings}</div>
                    <div className="text-sm text-gray-500">earned</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Fraud Alerts */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Fraud Alerts
            </h2>
            <button 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => {
                setViewMode(viewMode === 'fraud' ? 'all' : 'fraud')
                setShowAllFraudAlerts(true)
                setSearchQuery('')
              }}
            >
              {viewMode === 'fraud' ? 'Show All Users' : 'View All Fraud Alerts'}
            </button>
          </div>
          <div className="space-y-3">
            {(viewMode === 'fraud' ? filteredUsers : 
              filteredUsers.filter(user => user.fraudFlags && user.fraudFlags.length > 0)
                .slice(0, 3))
              .map((user) => (
                <div key={user.id} className="p-3 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowUserDetails(true)
                      }}
                    >
                      View Details
                    </button>
                  </div>
                  {user.fraudFlags && user.fraudFlags.map((flag, idx) => (
                    <div key={idx} className="mt-2 text-sm">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs mr-2 ${
                        flag.severity === 'high' ? 'bg-red-100 text-red-700' :
                        flag.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {flag.severity.toUpperCase()}
                      </span>
                      {flag.description}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Enhanced Referral List */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">All Referrers</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredUsers.length} of {users.length} referrers
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="search"
                  placeholder="Search referrers..."
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
                onClick={handleExportData}
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Referral Code</th>
              <th className="text-right py-3 px-4">Total Referrals</th>
              <th className="text-right py-3 px-4">Active Referrals</th>
              <th className="text-right py-3 px-4">Total Earnings</th>
              <th className="text-right py-3 px-4">Loyalty Points</th>
              <th className="text-center py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
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
                <td className="py-3 px-4">
                  <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                    {user.referralCode}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">{user.totalReferrals}</td>
                <td className="py-3 px-4 text-right">{user.activeReferrals}</td>
                <td className="py-3 px-4 text-right">₹{user.totalEarnings}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {user.loyaltyPoints}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setSelectedUser(user)
                      setShowUserDetails(true)
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>Referral Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">User Information</div>
                <div className="mt-1">
                  <div className="font-medium">{selectedUser?.name}</div>
                  <div className="text-sm text-gray-600">{selectedUser?.email}</div>
                  <div className="text-sm text-gray-600 mt-1">Joined: {selectedUser?.joinedDate}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Referral Statistics</div>
                <div className="mt-1 space-y-1 text-sm">
                  <div>Total Referrals: {selectedUser?.totalReferrals}</div>
                  <div>Active Referrals: {selectedUser?.activeReferrals}</div>
                  <div>Total Earnings: ₹{selectedUser?.totalEarnings}</div>
                  <div>Available Bonus: ₹{selectedUser?.availableBonus}</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="font-medium mb-2">Recent Activity</h3>
              <div className="space-y-2">
                {selectedUser?.recentActivity?.map((activity, idx) => (
                  <div key={idx} className={`p-3 rounded-lg ${
                    activity.type === 'referral' ? 'bg-blue-50' :
                    activity.type === 'redemption' ? 'bg-purple-50' :
                    'bg-green-50'
                  }`}>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{activity.description}</span>
                      <span className="text-sm text-gray-500">{activity.timestamp}</span>
                    </div>
                    {activity.amount && (
                      <div className={`text-sm mt-1 ${
                        activity.type === 'referral' ? 'text-blue-600' :
                        activity.type === 'redemption' ? 'text-purple-600' :
                        'text-green-600'
                      }`}>
                        {activity.type === 'redemption' ? '-' : '+'}₹{activity.amount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus History */}
            <div>
              <h3 className="font-medium mb-2">Bonus History</h3>
              <div className="space-y-2">
                {selectedUser?.bonusHistory.map((bonus, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        Referred {bonus.referredUserName}
                      </span>
                      <span className="text-sm text-gray-500">{bonus.timestamp}</span>
                    </div>
                    <div className="mt-1 text-sm">
                      <span className="text-gray-600">
                        Deposit: ₹{bonus.depositAmount}
                      </span>
                      <span className="mx-2">•</span>
                      <span className={`font-medium ${
                        bonus.isUsed ? 'text-gray-500' : 'text-green-600'
                      }`}>
                        Bonus: ₹{bonus.bonusAmount} {bonus.isUsed ? '(Used)' : '(Available)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus Usage History */}
            <div>
              <h3 className="font-medium mb-2">Bonus Usage</h3>
              <div className="space-y-2">
                {selectedUser?.bonusUsageHistory.map((usage, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{usage.eventName}</span>
                      <span className="text-sm text-gray-500">{usage.timestamp}</span>
                    </div>
                    <div className="mt-1 text-sm text-blue-600">
                      Used ₹{usage.amount} bonus for event participation
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fraud Flags */}
            {selectedUser?.fraudFlags && (
              <div>
                <h3 className="font-medium mb-2 text-red-600">Fraud Flags</h3>
                <div className="space-y-2">
                  {selectedUser.fraudFlags.map((flag, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-red-700">{flag.type}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          flag.severity === 'high' ? 'bg-red-100 text-red-700' :
                          flag.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {flag.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-red-600 mt-1">{flag.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Referred Users List Section */}
            {selectedUser?.referredUsers && selectedUser.referredUsers.length > 0 ? (
              <div>
                <h3 className="font-medium mb-2 flex items-center justify-between">
                  <span>Referred Users ({selectedUser.referredUsers.length})</span>
                  <span className="text-sm text-gray-500">
                    Total Bonus Generated: ₹{selectedUser.referredUsers.reduce((sum, user) => sum + user.bonusGenerated, 0)}
                  </span>
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">User</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Join Date</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Deposit</th>
                        <th className="text-right py-2 px-3 text-sm font-medium text-gray-600">Bonus Generated</th>
                        <th className="text-center py-2 px-3 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-center py-2 px-3 text-sm font-medium text-gray-600">KYC</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedUser.referredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-2 px-3">
                            <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-600">
                            {user.joinDate}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="text-sm font-medium">₹{user.depositAmount}</span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <span className="text-sm font-medium text-green-600">
                              ₹{user.bonusGenerated}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {user.status.toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex justify-center">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                user.kycStatus === 'completed' ? 'bg-green-100 text-green-700' :
                                user.kycStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {user.kycStatus.toUpperCase()}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="py-2 px-3 text-sm font-medium">
                          Total
                        </td>
                        <td className="py-2 px-3 text-right text-sm font-medium">
                          ₹{selectedUser.referredUsers.reduce((sum, user) => sum + user.depositAmount, 0)}
                        </td>
                        <td className="py-2 px-3 text-right text-sm font-medium text-green-600">
                          ₹{selectedUser.referredUsers.reduce((sum, user) => sum + user.bonusGenerated, 0)}
                        </td>
                        <td colSpan={2}></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No referred users found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
