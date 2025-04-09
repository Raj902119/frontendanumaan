'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { AlertTriangle, Ban, Eye, FileSearch, Filter, RefreshCw } from 'lucide-react'
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

interface SuspiciousActivity {
  id: string
  userId: string
  userName: string
  activityType: 'login_attempt' | 'large_withdrawal' | 'unusual_trading' | 'multiple_accounts' | 'wash_trading'
  severity: 'low' | 'medium' | 'high'
  riskScore: number
  timestamp: string
  description: string
  status: 'pending' | 'under_review' | 'resolved' | 'blocked'
  ipAddress: string
  location: string
  deviceInfo: string
  relatedActivities?: string[]
  timeline: {
    action: string
    note?: string
    timestamp: string
    actor: string
  }[]
}

const sampleActivities: SuspiciousActivity[] = [
  {
    id: 'SUSP-001',
    userId: 'USR-001',
    userName: 'John Smith',
    activityType: 'unusual_trading',
    severity: 'high',
    riskScore: 85,
    timestamp: '2024-03-26 15:30',
    description: 'Multiple high-volume trades within short intervals',
    status: 'under_review',
    ipAddress: '192.168.1.1',
    location: 'Mumbai, India',
    deviceInfo: 'Chrome / Windows',
    relatedActivities: ['SUSP-002', 'SUSP-003'],
    timeline: [
      {
        action: 'Activity Detected',
        timestamp: '2024-03-26 15:30',
        actor: 'System'
      },
      {
        action: 'Under Review',
        note: 'Investigating trading pattern',
        timestamp: '2024-03-26 15:35',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'SUSP-002',
    userId: 'USR-045',
    userName: 'Sarah Johnson',
    activityType: 'login_attempt',
    severity: 'medium',
    riskScore: 65,
    timestamp: '2024-03-26 14:15',
    description: 'Multiple failed login attempts from different IP addresses',
    status: 'resolved',
    ipAddress: '203.45.67.89',
    location: 'Singapore',
    deviceInfo: 'Safari / macOS',
    timeline: [
      {
        action: 'Activity Detected',
        timestamp: '2024-03-26 14:15',
        actor: 'System'
      },
      {
        action: 'Investigation Started',
        timestamp: '2024-03-26 14:20',
        actor: 'Admin'
      },
      {
        action: 'Resolved',
        note: 'User confirmed traveling abroad',
        timestamp: '2024-03-26 14:45',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'SUSP-003',
    userId: 'USR-078',
    userName: 'Michael Chen',
    activityType: 'large_withdrawal',
    severity: 'high',
    riskScore: 90,
    timestamp: '2024-03-26 13:45',
    description: 'Attempted withdrawal of $50,000 to unverified account',
    status: 'blocked',
    ipAddress: '45.67.89.123',
    location: 'Hong Kong',
    deviceInfo: 'Firefox / Linux',
    timeline: [
      {
        action: 'Activity Detected',
        timestamp: '2024-03-26 13:45',
        actor: 'System'
      },
      {
        action: 'Account Blocked',
        note: 'Automatic block due to high-risk withdrawal',
        timestamp: '2024-03-26 13:46',
        actor: 'System'
      }
    ]
  },
  {
    id: 'SUSP-004',
    userId: 'USR-092',
    userName: 'Emma Davis',
    activityType: 'multiple_accounts',
    severity: 'low',
    riskScore: 45,
    timestamp: '2024-03-26 12:30',
    description: 'Similar KYC documents used across two accounts',
    status: 'pending',
    ipAddress: '78.90.123.45',
    location: 'London, UK',
    deviceInfo: 'Edge / Windows',
    timeline: [
      {
        action: 'Activity Detected',
        timestamp: '2024-03-26 12:30',
        actor: 'System'
      }
    ]
  }
]

const riskTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'High Risk Activities',
      data: [5, 8, 12, 7, 9, 4, 6],
      borderColor: 'rgb(239, 68, 68)',
      tension: 0.1
    },
    {
      label: 'Medium Risk Activities',
      data: [15, 12, 18, 14, 16, 11, 13],
      borderColor: 'rgb(234, 179, 8)',
      tension: 0.1
    }
  ]
}

export default function SuspiciousActivityMonitoring() {
  const [selectedActivity, setSelectedActivity] = useState<SuspiciousActivity | null>(null)
  const [showActivityDetails, setShowActivityDetails] = useState(false)
  const [activities, setActivities] = useState<SuspiciousActivity[]>(sampleActivities)
  const [timeRange, setTimeRange] = useState('7d')
  const [chartData, setChartData] = useState(riskTrendData)
  const [filters, setFilters] = useState({
    severity: [] as SuspiciousActivity['severity'][],
    status: [] as SuspiciousActivity['status'][],
    activityType: [] as SuspiciousActivity['activityType'][]
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const getSeverityColor = (severity: SuspiciousActivity['severity']) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-700'
      case 'medium': return 'bg-orange-100 text-orange-700'
      case 'high': return 'bg-red-100 text-red-700'
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-green-600'
  }

  const handleBlockAccount = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setActivities(prev => prev.map(activity => 
        activity.userId === userId ? {
          ...activity,
          status: 'blocked',
          timeline: [
            ...activity.timeline,
            {
              action: 'Account Blocked',
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              actor: 'Admin',
              note: 'Account blocked due to suspicious activity'
            }
          ]
        } : activity
      ))
    } catch (error) {
      console.error('Failed to block account:', error)
    }
  }

  const handleInvestigate = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId ? {
        ...activity,
        status: 'under_review',
        timeline: [
          ...activity.timeline,
          {
            action: 'Investigation Started',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            actor: 'Admin',
            note: 'Manual investigation initiated'
          }
        ]
      } : activity
    ))
  }

  const handleMonitor = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId ? {
        ...activity,
        timeline: [
          ...activity.timeline,
          {
            action: 'Added to Monitoring',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            actor: 'Admin',
            note: 'Account placed under enhanced monitoring'
          }
        ]
      } : activity
    ))
  }

  const getFilteredActivities = () => {
    return activities.filter(activity => {
      const matchesSearch = 
        activity.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.userId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSeverity = filters.severity.length === 0 || 
        filters.severity.includes(activity.severity)

      const matchesStatus = filters.status.length === 0 || 
        filters.status.includes(activity.status)

      const matchesType = filters.activityType.length === 0 || 
        filters.activityType.includes(activity.activityType)

      return matchesSearch && matchesSeverity && matchesStatus && matchesType
    })
  }

  const updateTrendData = (range: string) => {
    setTimeRange(range)
    const newData = {
      labels: range === '30d' ? 
        Array.from({length: 30}, (_, i) => `Day ${i + 1}`) :
        range === '90d' ?
        Array.from({length: 12}, (_, i) => `Week ${i + 1}`) :
        riskTrendData.labels,
      datasets: [
        {
          ...riskTrendData.datasets[0],
          data: Array.from({length: range === '30d' ? 30 : range === '90d' ? 12 : 7}, 
            () => Math.floor(Math.random() * 15) + 5)
        },
        {
          ...riskTrendData.datasets[1],
          data: Array.from({length: range === '30d' ? 30 : range === '90d' ? 12 : 7}, 
            () => Math.floor(Math.random() * 20) + 10)
        }
      ]
    }
    setChartData(newData)
  }

  const FilterDialog = () => (
    <Dialog open={showFilters} onOpenChange={setShowFilters}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Filter Activities</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Severity</label>
            <div className="space-y-2 mt-2">
              {['low', 'medium', 'high'].map((severity) => (
                <label key={severity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.severity.includes(severity as any)}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      severity: e.target.checked 
                        ? [...prev.severity, severity as any]
                        : prev.severity.filter(s => s !== severity)
                    }))}
                  />
                  <span className="capitalize">{severity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <div className="space-y-2 mt-2">
              {['pending', 'under_review', 'resolved', 'blocked'].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status as any)}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      status: e.target.checked 
                        ? [...prev.status, status as any]
                        : prev.status.filter(s => s !== status)
                    }))}
                  />
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button 
              onClick={() => setFilters({ severity: [], status: [], activityType: [] })}
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
        <h1 className="text-2xl font-bold">Suspicious Activity Monitoring</h1>
        <p className="text-gray-500 mt-1">Monitor and manage suspicious user activities</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">High Risk Users</div>
          <div className="text-2xl font-bold text-red-600 mt-1">24</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            5 new alerts
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Pending Reviews</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">12</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Blocked Accounts</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">8</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Average Risk Score</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">42.5</div>
        </div>
      </div>

      {/* Risk Trend Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Risk Activity Trend</h3>
          <select 
            value={timeRange}
            onChange={(e) => updateTrendData(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1.5"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Suspicious Activities</h3>
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
              <th className="text-left py-3 px-4">Activity Type</th>
              <th className="text-left py-3 px-4">Risk Score</th>
              <th className="text-left py-3 px-4">Location</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Time</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredActivities().map(activity => (
              <tr key={activity.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{activity.userName}</div>
                    <div className="text-sm text-gray-500">{activity.userId}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(activity.severity)}`}>
                    {activity.activityType.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className={`font-medium ${getRiskScoreColor(activity.riskScore)}`}>
                    {activity.riskScore}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div>{activity.location}</div>
                  <div className="text-xs text-gray-500">{activity.ipAddress}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activity.status === 'blocked' ? 'bg-red-100 text-red-700' :
                    activity.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                    activity.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {activity.status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{activity.timestamp}</td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => {
                      setSelectedActivity(activity)
                      setShowActivityDetails(true)
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleBlockAccount(activity.userId)}
                    className="text-red-600 hover:text-red-800"
                    disabled={activity.status === 'blocked'}
                  >
                    {activity.status === 'blocked' ? 'Blocked' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Activity Details Dialog */}
      <Dialog open={showActivityDetails} onOpenChange={setShowActivityDetails}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Suspicious Activity Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Activity Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">User Information</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedActivity?.userName}</div>
                  <div className="text-sm">{selectedActivity?.userId}</div>
                  <div className="text-sm text-gray-600">Device: {selectedActivity?.deviceInfo}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Activity Details</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium text-red-600">Risk Score: {selectedActivity?.riskScore}</div>
                  <div className="text-sm">{selectedActivity?.description}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-medium mb-3">Activity Timeline</h3>
              <div className="space-y-4">
                {selectedActivity?.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      {idx !== (selectedActivity.timeline.length - 1) && (
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{event.action}</div>
                      <div className="text-xs text-gray-500">{event.timestamp}</div>
                      {event.note && (
                        <div className="text-sm text-gray-600 mt-1">{event.note}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">by {event.actor}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => {
                  if (selectedActivity) {
                    handleInvestigate(selectedActivity.id)
                    setShowActivityDetails(false)
                  }
                }}
                disabled={selectedActivity?.status === 'under_review'}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileSearch className="w-4 h-4" />
                {selectedActivity?.status === 'under_review' ? 'Under Investigation' : 'Investigate'}
              </button>
              <button 
                onClick={() => {
                  if (selectedActivity) {
                    handleMonitor(selectedActivity.id)
                    setShowActivityDetails(false)
                  }
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Monitor
              </button>
              <button 
                onClick={() => {
                  if (selectedActivity) {
                    handleBlockAccount(selectedActivity.userId)
                    setShowActivityDetails(false)
                  }
                }}
                disabled={selectedActivity?.status === 'blocked'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Ban className="w-4 h-4" />
                {selectedActivity?.status === 'blocked' ? 'Account Blocked' : 'Block Account'}
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
