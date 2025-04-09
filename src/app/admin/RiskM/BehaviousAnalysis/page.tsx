'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { AlertTriangle, Ban, Eye, FileSearch, Filter, MapPin, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface UserBehavior {
  userId: string
  userName: string
  riskScore: number
  tradingStyle: 'day_trader' | 'swing_trader' | 'long_term' | 'suspicious'
  loginLocations: {
    city: string
    country: string
    ip: string
    timestamp: string
    device: string
  }[]
  activityLevel: 'high' | 'medium' | 'low' | 'inactive'
  lastLogin: string
  tradeFrequency: number
  orderModifications: number
  avgTradeSize: number
  alerts: {
    type: string
    description: string
    timestamp: string
    severity: 'low' | 'medium' | 'high'
  }[]
}

const sampleUsers: UserBehavior[] = [
  {
    userId: 'USR-001',
    userName: 'John Smith',
    riskScore: 75,
    tradingStyle: 'day_trader',
    loginLocations: [
      {
        city: 'Mumbai',
        country: 'India',
        ip: '192.168.1.1',
        timestamp: '2024-03-26 15:30',
        device: 'Chrome / Windows'
      },
      {
        city: 'Delhi',
        country: 'India',
        ip: '192.168.1.2',
        timestamp: '2024-03-26 14:30',
        device: 'Safari / iOS'
      }
    ],
    activityLevel: 'high',
    lastLogin: '2024-03-26 15:30',
    tradeFrequency: 25,
    orderModifications: 15,
    avgTradeSize: 50000,
    alerts: [
      {
        type: 'Multiple IP Login',
        description: 'Logins from different cities within 1 hour',
        timestamp: '2024-03-26 14:30',
        severity: 'high'
      }
    ]
  }
]

const activityData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Login Frequency',
      data: [12, 15, 18, 14, 16, 8, 10],
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1
    },
    {
      label: 'Trade Count',
      data: [25, 30, 35, 28, 32, 15, 20],
      borderColor: 'rgb(34, 197, 94)',
      tension: 0.1
    }
  ]
}

export default function BehaviorAnalysis() {
  const [selectedUser, setSelectedUser] = useState<UserBehavior | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [users, setUsers] = useState<UserBehavior[]>(sampleUsers)
  const [timeRange, setTimeRange] = useState('7d')
  const [chartData, setChartData] = useState(activityData)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    tradingStyle: [] as UserBehavior['tradingStyle'][],
    activityLevel: [] as UserBehavior['activityLevel'][],
    riskScore: {
      min: 0,
      max: 100
    }
  })
  const [searchQuery, setSearchQuery] = useState('')

  const getRiskScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-green-600'
  }

  const getActivityLevelColor = (level: UserBehavior['activityLevel']) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-orange-100 text-orange-700'
      case 'inactive': return 'bg-red-100 text-red-700'
    }
  }

  const handleRestrictAccount = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.map(user => 
        user.userId === userId ? {
          ...user,
          activityLevel: 'inactive',
          alerts: [
            ...user.alerts,
            {
              type: 'Account Restricted',
              description: 'Account restricted due to suspicious behavior',
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              severity: 'high'
            }
          ]
        } : user
      ))
    } catch (error) {
      console.error('Failed to restrict account:', error)
    }
  }

  const handleMonitor = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.userId === userId ? {
        ...user,
        alerts: [
          ...user.alerts,
          {
            type: 'Enhanced Monitoring',
            description: 'Account placed under enhanced monitoring',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            severity: 'medium'
          }
        ]
      } : user
    ))
  }

  const handleReviewTrades = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.userId === userId ? {
        ...user,
        alerts: [
          ...user.alerts,
          {
            type: 'Trade Review',
            description: 'Manual trade review initiated',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            severity: 'low'
          }
        ]
      } : user
    ))
  }

  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = 
        user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTradingStyle = filters.tradingStyle.length === 0 || 
        filters.tradingStyle.includes(user.tradingStyle)

      const matchesActivityLevel = filters.activityLevel.length === 0 || 
        filters.activityLevel.includes(user.activityLevel)

      const matchesRiskScore = 
        user.riskScore >= filters.riskScore.min && 
        user.riskScore <= filters.riskScore.max

      return matchesSearch && matchesTradingStyle && matchesActivityLevel && matchesRiskScore
    })
  }

  const updateActivityData = (range: string) => {
    setTimeRange(range)
    const newData = {
      labels: range === '30d' ? 
        Array.from({length: 30}, (_, i) => `Day ${i + 1}`) :
        range === '90d' ?
        Array.from({length: 12}, (_, i) => `Week ${i + 1}`) :
        activityData.labels,
      datasets: [
        {
          ...activityData.datasets[0],
          data: Array.from({length: range === '30d' ? 30 : range === '90d' ? 12 : 7}, 
            () => Math.floor(Math.random() * 20) + 5)
        },
        {
          ...activityData.datasets[1],
          data: Array.from({length: range === '30d' ? 30 : range === '90d' ? 12 : 7}, 
            () => Math.floor(Math.random() * 40) + 10)
        }
      ]
    }
    setChartData(newData)
  }

  const FilterDialog = () => (
    <Dialog open={showFilters} onOpenChange={setShowFilters}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Filter Users</DialogTitle>
          <DialogDescription>
            Filter users based on behavior patterns
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Trading Style</label>
            <div className="space-y-2 mt-2">
              {['day_trader', 'swing_trader', 'long_term', 'suspicious'].map((style) => (
                <label key={style} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.tradingStyle.includes(style as any)}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      tradingStyle: e.target.checked 
                        ? [...prev.tradingStyle, style as any]
                        : prev.tradingStyle.filter(s => s !== style)
                    }))}
                  />
                  <span className="capitalize">{style.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Activity Level</label>
            <div className="space-y-2 mt-2">
              {['high', 'medium', 'low', 'inactive'].map((level) => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.activityLevel.includes(level as any)}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      activityLevel: e.target.checked 
                        ? [...prev.activityLevel, level as any]
                        : prev.activityLevel.filter(l => l !== level)
                    }))}
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Risk Score Range</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.riskScore.min}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    riskScore: { ...prev.riskScore, min: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-1 border rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.riskScore.max}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    riskScore: { ...prev.riskScore, max: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-1 border rounded-lg mt-1"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              onClick={() => setFilters({ 
                tradingStyle: [], 
                activityLevel: [], 
                riskScore: { min: 0, max: 100 } 
              })}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button 
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Behavior Analysis</h1>
        <p className="text-gray-500 mt-1">Monitor and analyze user trading patterns and activities</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">High Risk Users</div>
          <div className="text-2xl font-bold text-red-600 mt-1">15</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            3 new alerts
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Suspicious Logins</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">8</div>
          <div className="text-xs text-gray-600 mt-1">Last 24 hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Active Users</div>
          <div className="text-2xl font-bold text-green-600 mt-1">1,245</div>
          <div className="text-xs text-gray-600 mt-1">Today</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Avg. Risk Score</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">42.5</div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">User Activity Trends</h3>
          <select 
            value={timeRange}
            onChange={(e) => updateActivityData(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1.5"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      {/* Trading Style Distribution */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Day Traders</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">425</div>
          <div className="text-xs text-gray-600 mt-1">34% of users</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Swing Traders</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">312</div>
          <div className="text-xs text-gray-600 mt-1">25% of users</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Long Term Investors</div>
          <div className="text-2xl font-bold text-green-600 mt-1">458</div>
          <div className="text-xs text-gray-600 mt-1">37% of users</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Suspicious Activity</div>
          <div className="text-2xl font-bold text-red-600 mt-1">50</div>
          <div className="text-xs text-gray-600 mt-1">4% of users</div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">User Behavior Analysis</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(true)}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Trading Style</th>
              <th className="text-left py-3 px-4">Activity Level</th>
              <th className="text-right py-3 px-4">Trade Frequency</th>
              <th className="text-right py-3 px-4">Avg Trade Size</th>
              <th className="text-left py-3 px-4">Risk Score</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredUsers().map(user => (
              <tr key={user.userId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{user.userName}</div>
                    <div className="text-sm text-gray-500">{user.userId}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="capitalize">
                    {user.tradingStyle.split('_').join(' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getActivityLevelColor(user.activityLevel)}`}>
                    {user.activityLevel.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {user.tradeFrequency}/day
                </td>
                <td className="py-3 px-4 text-right">
                  ₹{user.avgTradeSize.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <div className={`font-medium ${getRiskScoreColor(user.riskScore)}`}>
                    {user.riskScore}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => {
                      setSelectedUser(user)
                      setShowUserDetails(true)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Dialog */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>User Behavior Details</DialogTitle>
            <DialogDescription>
              Analyze user activity patterns and risk factors.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">User Information</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedUser?.userName}</div>
                  <div className="text-sm">{selectedUser?.userId}</div>
                  <div className="text-sm text-gray-600">Last Active: {selectedUser?.lastLogin}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Trading Profile</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">Style: {selectedUser?.tradingStyle.split('_').join(' ')}</div>
                  <div className="text-sm">Frequency: {selectedUser?.tradeFrequency} trades/day</div>
                  <div className="text-sm">Modifications: {selectedUser?.orderModifications} orders/day</div>
                </div>
              </div>
            </div>

            {/* Login Locations */}
            <div>
              <h3 className="font-medium mb-3">Recent Login Locations</h3>
              <div className="space-y-2">
                {selectedUser?.loginLocations.map((location, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{location.city}, {location.country}</div>
                        <div className="text-xs text-gray-500">{location.ip} • {location.device}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{location.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div>
              <h3 className="font-medium mb-3">Behavioral Alerts</h3>
              <div className="space-y-2">
                {selectedUser?.alerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{alert.type}</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{alert.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => {
                  if (selectedUser) {
                    handleMonitor(selectedUser.userId)
                    setShowUserDetails(false)
                  }
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Monitor
              </button>
              <button 
                onClick={() => {
                  if (selectedUser) {
                    handleReviewTrades(selectedUser.userId)
                    setShowUserDetails(false)
                  }
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <FileSearch className="w-4 h-4" />
                Review Trades
              </button>
              <button 
                onClick={() => {
                  if (selectedUser) {
                    handleRestrictAccount(selectedUser.userId)
                    setShowUserDetails(false)
                  }
                }}
                disabled={selectedUser?.activityLevel === 'inactive'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-4 h-4" />
                {selectedUser?.activityLevel === 'inactive' ? 'Account Restricted' : 'Restrict Account'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Filter Dialog */}
      <FilterDialog />
    </div>
  )
}

