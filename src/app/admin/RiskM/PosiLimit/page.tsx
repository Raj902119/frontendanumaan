'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Search, Settings, Users } from 'lucide-react'
import { useState } from 'react'

interface PositionLimit {
  userId: string
  userName: string
  accountType: 'standard' | 'vip' | 'institutional'
  riskLevel: 'low' | 'medium' | 'high'
  maxTradeSize: number
  currentPosition: number
  utilizationRate: number
  lastUpdated: string
  autoAdjust: boolean
  violations: number
  status: 'active' | 'suspended' | 'warning'
  limits: {
    daily: number
    weekly: number
    monthly: number
  }
}

const sampleLimits: PositionLimit[] = [
  {
    userId: 'USR-001',
    userName: 'John Smith',
    accountType: 'vip',
    riskLevel: 'low',
    maxTradeSize: 1000000,
    currentPosition: 750000,
    utilizationRate: 75,
    lastUpdated: '2024-03-26 15:30',
    autoAdjust: true,
    violations: 0,
    status: 'active',
    limits: {
      daily: 1000000,
      weekly: 5000000,
      monthly: 20000000
    }
  },
  {
    userId: 'USR-002',
    userName: 'Alice Johnson',
    accountType: 'standard',
    riskLevel: 'high',
    maxTradeSize: 100000,
    currentPosition: 95000,
    utilizationRate: 95,
    lastUpdated: '2024-03-26 15:30',
    autoAdjust: false,
    violations: 2,
    status: 'warning',
    limits: {
      daily: 100000,
      weekly: 500000,
      monthly: 2000000
    }
  }
]

export default function PositionLimitsManagement() {
  const [selectedLimit, setSelectedLimit] = useState<PositionLimit | null>(null)
  const [showLimitDetails, setShowLimitDetails] = useState(false)
  const [showBulkUpdate, setShowBulkUpdate] = useState(false)
  const [formValues, setFormValues] = useState<Partial<PositionLimit>>({
    limits: {
      daily: 0,
      weekly: 0,
      monthly: 0
    },
    maxTradeSize: 0,
    riskLevel: 'low',
    autoAdjust: false
  })
  const [limits, setLimits] = useState<PositionLimit[]>(sampleLimits)
  const [searchQuery, setSearchQuery] = useState('')
  const [bulkUpdateForm, setBulkUpdateForm] = useState({
    userGroup: 'all',
    adjustmentType: 'percentage',
    value: 0
  })
  const [autoAdjustSettings, setAutoAdjustSettings] = useState({
    enabled: true,
    threshold: 90,
    adjustmentFactor: 0.8
  })
  const [showAutoAdjustSettings, setShowAutoAdjustSettings] = useState(false)

  const getRiskLevelColor = (level: PositionLimit['riskLevel']) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-red-100 text-red-700'
    }
  }

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return 'text-red-600'
    if (rate >= 75) return 'text-orange-600'
    return 'text-green-600'
  }

  const handleUpdateLimit = async (userId: string, updates: Partial<PositionLimit>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setLimits(prev => prev.map(limit => 
        limit.userId === userId ? {
          ...limit,
          ...updates,
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
        } : limit
      ))

      setShowLimitDetails(false)
      setSelectedLimit(null)
    } catch (error) {
      console.error('Failed to update limits:', error)
    }
  }

  const handleBulkUpdate = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      setLimits(prev => prev.map(limit => {
        if (
          bulkUpdateForm.userGroup === 'all' ||
          bulkUpdateForm.userGroup === limit.accountType ||
          (bulkUpdateForm.userGroup === 'high_risk' && limit.riskLevel === 'high')
        ) {
          const multiplier = bulkUpdateForm.adjustmentType === 'percentage' 
            ? (1 + bulkUpdateForm.value / 100)
            : 1

          const adjustment = bulkUpdateForm.adjustmentType === 'fixed' 
            ? bulkUpdateForm.value 
            : 0

          return {
            ...limit,
            maxTradeSize: bulkUpdateForm.adjustmentType === 'reset' 
              ? getDefaultTradeSize(limit.accountType)
              : Math.round(limit.maxTradeSize * multiplier + adjustment),
            limits: {
              daily: bulkUpdateForm.adjustmentType === 'reset'
                ? getDefaultDailyLimit(limit.accountType)
                : Math.round(limit.limits.daily * multiplier + adjustment),
              weekly: bulkUpdateForm.adjustmentType === 'reset'
                ? getDefaultWeeklyLimit(limit.accountType)
                : Math.round(limit.limits.weekly * multiplier + adjustment),
              monthly: bulkUpdateForm.adjustmentType === 'reset'
                ? getDefaultMonthlyLimit(limit.accountType)
                : Math.round(limit.limits.monthly * multiplier + adjustment)
            },
            lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
          }
        }
        return limit
      }))

      setShowBulkUpdate(false)
    } catch (error) {
      console.error('Failed to perform bulk update:', error)
    }
  }

  const getDefaultTradeSize = (accountType: PositionLimit['accountType']) => {
    switch (accountType) {
      case 'standard': return 100000
      case 'vip': return 1000000
      case 'institutional': return 5000000
      default: return 100000
    }
  }

  const getDefaultDailyLimit = (accountType: PositionLimit['accountType']) => {
    switch (accountType) {
      case 'standard': return 100000
      case 'vip': return 1000000
      case 'institutional': return 5000000
      default: return 100000
    }
  }

  const getDefaultWeeklyLimit = (accountType: PositionLimit['accountType']) => {
    return getDefaultDailyLimit(accountType) * 5
  }

  const getDefaultMonthlyLimit = (accountType: PositionLimit['accountType']) => {
    return getDefaultDailyLimit(accountType) * 20
  }

  const getFilteredLimits = () => {
    return limits.filter(limit => 
      limit.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      limit.userId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const handleAutoAdjustSettingsUpdate = async (settings: typeof autoAdjustSettings) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAutoAdjustSettings(settings)
      setLimits(prev => prev.map(limit => ({
        ...limit,
        autoAdjust: settings.enabled,
        lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
      })))
      
      setShowAutoAdjustSettings(false)
    } catch (error) {
      console.error('Failed to update auto-adjust settings:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Position Limits Management</h1>
        <p className="text-gray-500 mt-1">Manage trading limits and monitor positions</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">High Utilization</div>
          <div className="text-2xl font-bold text-red-600 mt-1">8</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            3 near limit
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Limit Violations</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">5</div>
          <div className="text-xs text-gray-600 mt-1">Last 24 hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Auto-Adjusted</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">12</div>
          <div className="text-xs text-gray-600 mt-1">This week</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Average Utilization</div>
          <div className="text-2xl font-bold text-green-600 mt-1">65%</div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button 
            onClick={() => setShowBulkUpdate(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Bulk Update
          </button>
          <button 
            onClick={() => setShowAutoAdjustSettings(true)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Auto-Adjust Settings
          </button>
        </div>
      </div>

      {/* Limits Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Account Type</th>
              <th className="text-left py-3 px-4">Risk Level</th>
              <th className="text-right py-3 px-4">Max Trade Size</th>
              <th className="text-right py-3 px-4">Current Position</th>
              <th className="text-right py-3 px-4">Utilization</th>
              <th className="text-center py-3 px-4">Auto-Adjust</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredLimits().map(limit => (
              <tr key={limit.userId} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{limit.userName}</div>
                    <div className="text-sm text-gray-500">{limit.userId}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="capitalize">{limit.accountType}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(limit.riskLevel)}`}>
                    {limit.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  ₹{limit.maxTradeSize.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  ₹{limit.currentPosition.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className={`font-medium ${getUtilizationColor(limit.utilizationRate)}`}>
                    {limit.utilizationRate}%
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className={`text-sm ${limit.autoAdjust ? 'text-green-600' : 'text-gray-500'}`}>
                    {limit.autoAdjust ? 'Enabled' : 'Disabled'}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => {
                      setSelectedLimit(limit)
                      setShowLimitDetails(true)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit Limits
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Limit Details Dialog */}
      <Dialog open={showLimitDetails} onOpenChange={setShowLimitDetails}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit Position Limits</DialogTitle>
            <DialogDescription>
              Update trading limits and risk settings for {selectedLimit?.userName}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Trading Limits */}
            <div>
              <h3 className="font-medium mb-3">Trading Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Daily Limit</label>
                  <input 
                    name="daily"
                    type="number"
                    defaultValue={selectedLimit?.limits.daily}
                    onChange={(e) => setFormValues({
                      ...formValues,
                      limits: {
                        daily: formValues.limits?.daily ?? 0,
                        weekly: formValues.limits?.weekly ?? 0,
                        monthly: formValues.limits?.monthly ?? 0,
                        [e.target.name]: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Weekly Limit</label>
                  <input 
                    name="weekly"
                    type="number"
                    defaultValue={selectedLimit?.limits.weekly}
                    onChange={(e) => setFormValues({
                      ...formValues,
                      limits: {
                        daily: formValues.limits?.daily ?? 0,
                        weekly: formValues.limits?.weekly ?? 0,
                        monthly: formValues.limits?.monthly ?? 0,
                        [e.target.name]: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Monthly Limit</label>
                  <input 
                    name="monthly"
                    type="number"
                    defaultValue={selectedLimit?.limits.monthly}
                    onChange={(e) => setFormValues({
                      ...formValues,
                      limits: {
                        daily: formValues.limits?.daily ?? 0,
                        weekly: formValues.limits?.weekly ?? 0,
                        monthly: formValues.limits?.monthly ?? 0,
                        [e.target.name]: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Max Trade Size</label>
                  <input 
                    name="maxTradeSize"
                    type="number"
                    defaultValue={selectedLimit?.maxTradeSize}
                    onChange={(e) => setFormValues({...formValues, [e.target.name]: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Risk Settings */}
            <div>
              <h3 className="font-medium mb-3">Risk Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Risk Level</label>
                  <select 
                    name="riskLevel"
                    className="w-full px-3 py-2 border rounded-lg"
                    defaultValue={selectedLimit?.riskLevel}
                    onChange={(e) => setFormValues({
                      ...formValues, 
                      riskLevel: e.target.value as 'low' | 'medium' | 'high'
                    })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Auto-Adjust</label>
                  <select 
                    name="autoAdjust"
                    className="w-full px-3 py-2 border rounded-lg"
                    defaultValue={selectedLimit?.autoAdjust ? 'enabled' : 'disabled'}
                    onChange={(e) => setFormValues({
                      ...formValues, 
                      autoAdjust: e.target.value === 'enabled'
                    })}
                  >
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => {
                  setShowLimitDetails(false)
                  setSelectedLimit(null)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => selectedLimit && handleUpdateLimit(selectedLimit.userId, formValues)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Dialog */}
      <Dialog open={showBulkUpdate} onOpenChange={setShowBulkUpdate}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>Bulk Update Position Limits</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Select User Group</label>
                <select 
                  value={bulkUpdateForm.userGroup}
                  onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, userGroup: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="all">All Users</option>
                  <option value="standard">Standard Accounts</option>
                  <option value="vip">VIP Accounts</option>
                  <option value="high_risk">High Risk Users</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Adjustment Type</label>
                <select 
                  value={bulkUpdateForm.adjustmentType}
                  onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, adjustmentType: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="percentage">Percentage Change</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="reset">Reset to Default</option>
                </select>
              </div>
              {bulkUpdateForm.adjustmentType !== 'reset' && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Value</label>
                  <input 
                    type="number"
                    value={bulkUpdateForm.value}
                    onChange={(e) => setBulkUpdateForm(prev => ({ ...prev, value: Number(e.target.value) }))}
                    placeholder="Enter adjustment value"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => setShowBulkUpdate(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auto-Adjust Settings Dialog */}
      <Dialog open={showAutoAdjustSettings} onOpenChange={setShowAutoAdjustSettings}>
        <DialogContent className="max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>Auto-Adjust Settings</DialogTitle>
            <DialogDescription>
              Configure automatic position limit adjustments
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Auto-Adjust</div>
                  <div className="text-sm text-gray-500">
                    Automatically adjust limits based on utilization
                  </div>
                </div>
                <select 
                  value={autoAdjustSettings.enabled ? 'enabled' : 'disabled'}
                  onChange={(e) => setAutoAdjustSettings(prev => ({
                    ...prev,
                    enabled: e.target.value === 'enabled'
                  }))}
                  className="px-3 py-2 border rounded-lg"
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Utilization Threshold (%)</label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  value={autoAdjustSettings.threshold}
                  onChange={(e) => setAutoAdjustSettings(prev => ({
                    ...prev,
                    threshold: Number(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="text-xs text-gray-500">
                  Trigger auto-adjust when utilization exceeds this threshold
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600">Adjustment Factor</label>
                <input 
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={autoAdjustSettings.adjustmentFactor}
                  onChange={(e) => setAutoAdjustSettings(prev => ({
                    ...prev,
                    adjustmentFactor: Number(e.target.value)
                  }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="text-xs text-gray-500">
                  Factor to multiply limits by when adjusting (e.g., 0.8 reduces limits by 20%)
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => setShowAutoAdjustSettings(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleAutoAdjustSettingsUpdate(autoAdjustSettings)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
