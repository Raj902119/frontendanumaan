'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, AlertTriangle, ArrowUpRight, Ban, Eye, Flag, Search, Shield } from 'lucide-react'
import { useState } from 'react'

interface RiskFlag {
  type: 'login' | 'trade' | 'kyc' | 'account'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: string
  details: string
  status: 'new' | 'investigating' | 'resolved'
}

interface User {
  id: string
  name: string
  email: string
  riskScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  flags: RiskFlag[]
  lastActivity: string
  status: 'active' | 'suspended' | 'investigating'
  suspiciousActivities: {
    failedLogins: number
    unusualTrades: number
    locationChanges: number
    multiAccountSignals: boolean
  }
}

const sampleUsers: User[] = [
  {
    id: '#10001',
    name: 'John Smith',
    email: 'john@example.com',
    riskScore: 85,
    riskLevel: 'high',
    lastActivity: '2024-03-26 14:30',
    status: 'investigating',
    suspiciousActivities: {
      failedLogins: 5,
      unusualTrades: 3,
      locationChanges: 4,
      multiAccountSignals: true
    },
    flags: [
      {
        type: 'login',
        severity: 'high',
        description: 'Multiple failed login attempts from different locations',
        timestamp: '2024-03-26 14:30',
        details: 'Failed login attempts detected from 5 different IP addresses within 1 hour',
        status: 'new'
      },
      {
        type: 'trade',
        severity: 'medium',
        description: 'Unusual trading pattern detected',
        timestamp: '2024-03-26 13:15',
        details: 'Multiple high-volume trades executed within short intervals',
        status: 'investigating'
      }
    ]
  },
  {
    id: '#10002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    riskScore: 95,
    riskLevel: 'critical',
    lastActivity: '2024-03-26 15:45',
    status: 'suspended',
    suspiciousActivities: {
      failedLogins: 8,
      unusualTrades: 6,
      locationChanges: 7,
      multiAccountSignals: true
    },
    flags: [
      {
        type: 'kyc',
        severity: 'critical',
        description: 'Suspicious KYC documentation',
        timestamp: '2024-03-26 15:30',
        details: 'Potential manipulation of submitted identity documents detected',
        status: 'investigating'
      },
      {
        type: 'account',
        severity: 'high',
        description: 'Multiple account creation attempts',
        timestamp: '2024-03-26 14:00',
        details: 'User attempted to create multiple accounts with similar details',
        status: 'new'
      }
    ]
  },
  {
    id: '#10003',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    riskScore: 45,
    riskLevel: 'medium',
    lastActivity: '2024-03-26 12:00',
    status: 'active',
    suspiciousActivities: {
      failedLogins: 2,
      unusualTrades: 1,
      locationChanges: 2,
      multiAccountSignals: false
    },
    flags: [
      {
        type: 'trade',
        severity: 'medium',
        description: 'Unusual trade timing',
        timestamp: '2024-03-26 11:45',
        details: 'Trading activity observed during unusual hours',
        status: 'investigating'
      }
    ]
  },
  {
    id: '#10004',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    riskScore: 15,
    riskLevel: 'low',
    lastActivity: '2024-03-26 16:00',
    status: 'active',
    suspiciousActivities: {
      failedLogins: 1,
      unusualTrades: 0,
      locationChanges: 1,
      multiAccountSignals: false
    },
    flags: [
      {
        type: 'login',
        severity: 'low',
        description: 'New device login',
        timestamp: '2024-03-26 15:55',
        details: 'First time login from new device detected',
        status: 'resolved'
      }
    ]
  },
  {
    id: '#10005',
    name: 'David Brown',
    email: 'david.b@example.com',
    riskScore: 75,
    riskLevel: 'high',
    lastActivity: '2024-03-26 13:30',
    status: 'investigating',
    suspiciousActivities: {
      failedLogins: 4,
      unusualTrades: 3,
      locationChanges: 3,
      multiAccountSignals: false
    },
    flags: [
      {
        type: 'trade',
        severity: 'high',
        description: 'Large unexpected transactions',
        timestamp: '2024-03-26 13:25',
        details: 'Multiple large transactions exceeding usual trading pattern',
        status: 'new'
      },
      {
        type: 'login',
        severity: 'medium',
        description: 'Multiple device logins',
        timestamp: '2024-03-26 12:30',
        details: 'Concurrent login attempts from multiple devices',
        status: 'investigating'
      }
    ]
  },
  {
    id: '#10006',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    riskScore: 88,
    riskLevel: 'high',
    lastActivity: '2024-03-26 17:15',
    status: 'investigating',
    suspiciousActivities: {
      failedLogins: 6,
      unusualTrades: 4,
      locationChanges: 5,
      multiAccountSignals: true
    },
    flags: [
      {
        type: 'trade',
        severity: 'high',
        description: 'Pattern day trading violations',
        timestamp: '2024-03-26 17:10',
        details: 'Multiple day trading violations detected in margin account',
        status: 'new'
      },
      {
        type: 'account',
        severity: 'high',
        description: 'Suspicious fund transfers',
        timestamp: '2024-03-26 16:45',
        details: 'Large transfers between multiple linked accounts',
        status: 'investigating'
      }
    ]
  },
  {
    id: '#10007',
    name: 'Tom Wilson',
    email: 't.wilson@example.com',
    riskScore: 92,
    riskLevel: 'critical',
    lastActivity: '2024-03-26 18:00',
    status: 'suspended',
    suspiciousActivities: {
      failedLogins: 7,
      unusualTrades: 8,
      locationChanges: 6,
      multiAccountSignals: true
    },
    flags: [
      {
        type: 'kyc',
        severity: 'critical',
        description: 'Identity verification failure',
        timestamp: '2024-03-26 17:55',
        details: 'Multiple failed attempts to verify identity with inconsistent documents',
        status: 'new'
      },
      {
        type: 'trade',
        severity: 'critical',
        description: 'Market manipulation attempt',
        timestamp: '2024-03-26 17:30',
        details: 'Coordinated trading pattern detected with other flagged accounts',
        status: 'investigating'
      }
    ]
  },
  {
    id: '#10008',
    name: 'Arun Kumar',
    email: 'arun.k@example.com',
    riskScore: 35,
    riskLevel: 'low',
    lastActivity: '2024-03-26 18:30',
    status: 'active',
    suspiciousActivities: {
      failedLogins: 1,
      unusualTrades: 0,
      locationChanges: 1,
      multiAccountSignals: false
    },
    flags: [
      {
        type: 'login',
        severity: 'low',
        description: 'New IP address detected',
        timestamp: '2024-03-26 18:25',
        details: 'First time login from new but local IP address',
        status: 'resolved'
      }
    ]
  },
  {
    id: '#10009',
    name: 'Maria Garcia',
    email: 'm.garcia@example.com',
    riskScore: 82,
    riskLevel: 'high',
    lastActivity: '2024-03-26 19:00',
    status: 'investigating',
    suspiciousActivities: {
      failedLogins: 5,
      unusualTrades: 5,
      locationChanges: 4,
      multiAccountSignals: false
    },
    flags: [
      {
        type: 'trade',
        severity: 'high',
        description: 'Unusual trading hours',
        timestamp: '2024-03-26 18:55',
        details: 'Multiple large trades executed during off-market hours',
        status: 'new'
      },
      {
        type: 'account',
        severity: 'medium',
        description: 'Frequent password changes',
        timestamp: '2024-03-26 18:30',
        details: 'Multiple password changes within short time period',
        status: 'investigating'
      }
    ]
  },
  {
    id: '#10010',
    name: 'James Anderson',
    email: 'j.anderson@example.com',
    riskScore: 55,
    riskLevel: 'medium',
    lastActivity: '2024-03-26 19:30',
    status: 'active',
    suspiciousActivities: {
      failedLogins: 3,
      unusualTrades: 2,
      locationChanges: 2,
      multiAccountSignals: false
    },
    flags: [
      {
        type: 'trade',
        severity: 'medium',
        description: 'Increased trading frequency',
        timestamp: '2024-03-26 19:25',
        details: 'Trading frequency 150% above user average',
        status: 'investigating'
      }
    ]
  }
]

export default function RiskManagement() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showFlagDetails, setShowFlagDetails] = useState(false)
  const [riskLevelFilter, setRiskLevelFilter] = useState<User['riskLevel'] | 'all'>('all')
  const [showCriticalOnly, setShowCriticalOnly] = useState(false)
  const [currentRiskLevel, setCurrentRiskLevel] = useState<User['riskLevel'] | 'all'>('all')
  const riskLevels: User['riskLevel'][] = ['low', 'medium', 'high', 'critical']

  // Enhanced filtering system
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.riskLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRiskLevel = riskLevelFilter === 'all' || user.riskLevel === riskLevelFilter
    const matchesCritical = !showCriticalOnly || user.riskLevel === 'critical'

    return matchesSearch && matchesRiskLevel && matchesCritical
  })

  // Calculate risk level counts
  const riskCounts = users.reduce((acc, user) => {
    acc[user.riskLevel] = (acc[user.riskLevel] || 0) + 1
    return acc
  }, {} as Record<User['riskLevel'], number>)

  // Enhanced status change handler
  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        // Update risk level based on new status
        const newRiskLevel = newStatus === 'suspended' ? 'critical' : 
                           newStatus === 'investigating' ? 'high' : 'medium'
        
        return { 
          ...user, 
          status: newStatus,
          riskLevel: newRiskLevel,
          lastActivity: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      }
      return user
    }))
  }

  // Cycle through risk levels for filter
  const handleRiskLevelFilter = () => {
    const currentIndex = riskLevels.indexOf(riskLevelFilter as User['riskLevel'])
    if (riskLevelFilter === 'all') {
      setRiskLevelFilter('low')
    } else if (currentIndex === riskLevels.length - 1) {
      setRiskLevelFilter('all')
    } else {
      setRiskLevelFilter(riskLevels[currentIndex + 1])
    }
  }

  // Enhanced flag escalation with notification
  const handleFlagEscalation = (userId: string, flagIndex: number) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        const updatedFlags = [...user.flags]
        updatedFlags[flagIndex] = { 
          ...updatedFlags[flagIndex], 
          severity: 'critical',
          status: 'investigating',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }

        // Update user risk metrics
        return { 
          ...user, 
          flags: updatedFlags,
          riskLevel: 'critical',
          status: 'investigating',
          riskScore: Math.min(user.riskScore + 20, 100),
          lastActivity: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      }
      return user
    }))

    // Close the dialog after escalation
    setShowFlagDetails(false)
  }

  // Add bulk actions for risk management
  const handleBulkAction = (action: 'suspend' | 'investigate' | 'clear') => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (filteredUsers.find(u => u.id === user.id)) {
        switch (action) {
          case 'suspend':
            return {
              ...user,
              status: 'suspended',
              riskLevel: 'critical',
              lastActivity: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          case 'investigate':
            return {
              ...user,
              status: 'investigating',
              riskLevel: 'high',
              lastActivity: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          case 'clear':
            return {
              ...user,
              status: 'active',
              riskLevel: 'low',
              riskScore: Math.max(user.riskScore - 30, 0),
              lastActivity: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          default:
            return user
        }
      }
      return user
    }))
  }

  // Helper for severity comparison
  const severityOrder = {
    'low': 0,
    'medium': 1,
    'high': 2,
    'critical': 3
  } as const

  // Get status color for flags
  const getFlagStatusColor = (status: RiskFlag['status']) => {
    switch (status) {
      case 'new': return 'text-red-600'
      case 'investigating': return 'text-yellow-600'
      case 'resolved': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getRiskColor = (level: User['riskLevel']) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-red-100 text-red-700'
      case 'critical': return 'bg-red-600 text-white'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Risk Management</h1>
        <p className="text-gray-500 mt-1">Monitor and manage user risk levels</p>
      </div>

      {/* Enhanced Risk Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Critical Risk Users</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {riskCounts.critical || 0}
          </div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            Requires immediate attention
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">High Risk Users</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            {riskCounts.high || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Medium Risk Users</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">
            {riskCounts.medium || 0}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Low Risk Users</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {riskCounts.low || 0}
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="search"
            placeholder="Search by name, email, ID, or risk level..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1.5 text-sm border rounded-lg flex items-center gap-2 ${
              riskLevelFilter !== 'all' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={handleRiskLevelFilter}
          >
            <Flag className="w-4 h-4" /> 
            {riskLevelFilter === 'all' ? 'Filter by Risk Level' : `Showing ${riskLevelFilter} risk`}
          </button>
          <button 
            className={`px-3 py-1.5 text-sm border rounded-lg flex items-center gap-2 ${
              showCriticalOnly ? 'bg-red-50 border-red-200 text-red-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => setShowCriticalOnly(!showCriticalOnly)}
          >
            <AlertCircle className="w-4 h-4" /> 
            {showCriticalOnly ? 'Showing Critical Only' : 'Show Critical Only'}
          </button>
        </div>

        {/* Add Bulk Actions */}
        {filteredUsers.length > 0 && (
          <div className="flex gap-2 pt-2 border-t">
            <button
              onClick={() => handleBulkAction('suspend')}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Suspend Selected
            </button>
            <button
              onClick={() => handleBulkAction('investigate')}
              className="px-3 py-1.5 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Investigate Selected
            </button>
            <button
              onClick={() => handleBulkAction('clear')}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Clear Flags
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Risk Score</th>
              <th className="text-left py-3 px-4">Risk Level</th>
              <th className="text-left py-3 px-4">Suspicious Activities</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-lg"
                      style={{
                        borderColor: user.riskScore > 80 ? '#ef4444' : 
                                   user.riskScore > 60 ? '#f97316' : 
                                   user.riskScore > 40 ? '#eab308' : '#22c55e'
                      }}
                    >
                      {user.riskScore}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(user.riskLevel)}`}>
                    {user.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      {user.suspiciousActivities.failedLogins} Failed Logins
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-orange-500" />
                      {user.suspiciousActivities.unusualTrades} Unusual Trades
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                    user.status === 'suspended' ? 'bg-red-100 text-red-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <button 
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowFlagDetails(true)
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleStatusChange(user.id, user.status === 'suspended' ? 'active' : 'suspended')}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Risk Details Dialog */}
      <Dialog open={showFlagDetails} onOpenChange={setShowFlagDetails}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Risk Details - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
              {selectedUser?.flags.map((flag, index) => (
                <div key={index} className={`border rounded-lg p-4 space-y-3 ${
                  flag.status === 'resolved' ? 'bg-gray-50' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getRiskColor(flag.severity)}`} />
                      <span className="font-medium">{flag.description}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${getFlagStatusColor(flag.status)}`}>
                        {flag.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">{flag.timestamp}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{flag.details}</div>
                  <div className="flex justify-end gap-2">
                    {flag.status !== 'resolved' ? (
                      <>
                        <button 
                          className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                          onClick={() => {
                            handleFlagEscalation(selectedUser.id, index)
                          }}
                        >
                          Escalate
                        </button>
                      </>
                    ) : (
                      <span className="text-sm text-green-600">✓ Resolved</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
