'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, ArrowUpRight, CheckCircle, Eye, Filter, RefreshCw } from 'lucide-react'
import { useState } from 'react'

interface RiskAlert {
  id: string
  type: 'transaction' | 'user_activity' | 'price_movement' | 'system' | 'security'
  severity: 'critical' | 'moderate' | 'low'
  status: 'new' | 'investigating' | 'escalated' | 'resolved'
  title: string
  description: string
  timestamp: string
  assignedTo?: string
  category: string
  source: string
  affectedUsers?: number
  suggestedActions: string[]
  resolution?: {
    action: string
    note: string
    timestamp: string
    by: string
  }
  timeline: {
    action: string
    note?: string
    timestamp: string
    actor: string
  }[]
}

const sampleAlerts: RiskAlert[] = [
  {
    id: 'ALERT-001',
    type: 'transaction',
    severity: 'critical',
    status: 'new',
    title: 'Large Transaction Volume Spike',
    description: 'Unusual spike in transaction volume exceeding 3σ from mean',
    timestamp: '2024-03-26 15:30',
    assignedTo: 'Risk Team Lead',
    category: 'Volume Anomaly',
    source: 'Transaction Monitoring System',
    affectedUsers: 15,
    suggestedActions: [
      'Review transaction patterns',
      'Check for market manipulation',
      'Monitor affected accounts'
    ],
    timeline: [
      {
        action: 'Alert Generated',
        timestamp: '2024-03-26 15:30',
        actor: 'System'
      },
      {
        action: 'Assigned to Risk Team',
        note: 'High priority investigation required',
        timestamp: '2024-03-26 15:35',
        actor: 'Alert Router'
      }
    ]
  }
]

export default function RiskAlertCenter() {
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null)
  const [showAlertDetails, setShowAlertDetails] = useState(false)

  const getSeverityIcon = (severity: RiskAlert['severity']) => {
    switch (severity) {
      case 'critical': return '🚨'
      case 'moderate': return '⚠️'
      case 'low': return '🟢'
    }
  }

  const getSeverityColor = (severity: RiskAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700'
      case 'moderate': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
    }
  }

  const getStatusColor = (status: RiskAlert['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700'
      case 'investigating': return 'bg-yellow-100 text-yellow-700'
      case 'escalated': return 'bg-red-100 text-red-700'
      case 'resolved': return 'bg-green-100 text-green-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Risk Alert Center</h1>
        <p className="text-gray-500 mt-1">Monitor and manage risk alerts across the platform</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Critical Alerts</div>
          <div className="text-2xl font-bold text-red-600 mt-1">5</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            Requires immediate action
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Moderate Alerts</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">12</div>
          <div className="text-xs text-gray-600 mt-1">Under investigation</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Low Risk Alerts</div>
          <div className="text-2xl font-bold text-green-600 mt-1">8</div>
          <div className="text-xs text-gray-600 mt-1">Being monitored</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Resolved Today</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">15</div>
          <div className="text-xs text-gray-600 mt-1">Last 24 hours</div>
        </div>
      </div>

      {/* Alert Categories */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium">Transaction Alerts</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">8</div>
          <div className="text-xs text-gray-500 mt-1">Volume & Pattern</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium">User Activity</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">5</div>
          <div className="text-xs text-gray-500 mt-1">Behavior Analysis</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium">Price Movement</div>
          <div className="text-2xl font-bold text-green-600 mt-1">3</div>
          <div className="text-xs text-gray-500 mt-1">Market Analysis</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium">System Alerts</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">2</div>
          <div className="text-xs text-gray-500 mt-1">Performance & Health</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm font-medium">Security Alerts</div>
          <div className="text-2xl font-bold text-red-600 mt-1">7</div>
          <div className="text-xs text-gray-500 mt-1">Access & Auth</div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Active Alerts</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Alert ID</th>
              <th className="text-left py-3 px-4">Severity</th>
              <th className="text-left py-3 px-4">Title</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Assigned To</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleAlerts.map(alert => (
              <tr key={alert.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{alert.id}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)} {alert.severity.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">{alert.title}</td>
                <td className="py-3 px-4">{alert.category}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(alert.status)}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">{alert.assignedTo || '-'}</td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => {
                      setSelectedAlert(alert)
                      setShowAlertDetails(true)
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

      {/* Alert Details Dialog */}
      <Dialog open={showAlertDetails} onOpenChange={setShowAlertDetails}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Risk Alert Details</DialogTitle>
            <DialogDescription>
              Review and take action on risk alert.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Alert Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Alert Information</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedAlert?.title}</div>
                  <div className="text-sm">{selectedAlert?.description}</div>
                  <div className="text-sm text-gray-600">Source: {selectedAlert?.source}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Impact Assessment</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">Affected Users: {selectedAlert?.affectedUsers}</div>
                  <div className="text-sm">Category: {selectedAlert?.category}</div>
                  <div className="text-sm">Type: {selectedAlert?.type}</div>
                </div>
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <h3 className="font-medium mb-3">Suggested Actions</h3>
              <div className="space-y-2">
                {selectedAlert?.suggestedActions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {action}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="font-medium mb-3">Alert Timeline</h3>
              <div className="space-y-4">
                {selectedAlert?.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      {idx !== (selectedAlert.timeline.length - 1) && (
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Monitor
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                Escalate
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Mark Resolved
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
