'use client'

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { Activity, AlertTriangle, Clock, Power, Server } from 'lucide-react'
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
  Legend,
  Filler
)

const systemMetrics = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  datasets: [
    {
      label: 'API Response Time (ms)',
      data: [120, 125, 135, 128, 130, 142],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: function(context: { chart: any }) {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');
        return gradient;
      },
      tension: 0.4,
      fill: true
    }
  ]
}

const systemStatuses = [
  { name: 'Trading Engine', status: 'online', uptime: '99.99%', lastIssue: 'None' },
  { name: 'User Authentication', status: 'online', uptime: '99.95%', lastIssue: '2 days ago' },
  { name: 'Payment Gateway', status: 'partial', uptime: '99.90%', lastIssue: '1 hour ago' },
  { name: 'WebSocket API', status: 'online', uptime: '99.98%', lastIssue: 'None' }
]

const recentErrors = [
  { id: 1, timestamp: '2024-03-20 15:30:45', type: 'Database', message: 'Connection timeout', severity: 'high' },
  { id: 2, timestamp: '2024-03-20 15:25:12', type: 'API', message: 'Rate limit exceeded', severity: 'medium' },
  { id: 3, timestamp: '2024-03-20 15:20:30', type: 'Cache', message: 'Cache miss', severity: 'low' }
]

export default function MaintenanceMode() {
  const [maintenanceActive, setMaintenanceActive] = useState(false)
  const [scheduledMaintenance, setScheduledMaintenance] = useState({
    start: '',
    end: '',
    message: ''
  })
  const [customMessage, setCustomMessage] = useState('')
  const [countdown, setCountdown] = useState('2:30:15')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Mode Control</h1>
          <p className="text-gray-500 mt-1">Manage platform maintenance and system status</p>
        </div>
        <button 
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            maintenanceActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          onClick={() => setMaintenanceActive(!maintenanceActive)}
        >
          <Power className="w-4 h-4" />
          {maintenanceActive ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Maintenance Controls */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium">Maintenance Schedule</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={scheduledMaintenance.start}
                  onChange={(e) => setScheduledMaintenance({...scheduledMaintenance, start: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={scheduledMaintenance.end}
                  onChange={(e) => setScheduledMaintenance({...scheduledMaintenance, end: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Message</label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter message to display to users..."
                className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
              />
            </div>

            {maintenanceActive && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-medium">Maintenance in Progress</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="font-mono">{countdown}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-medium">System Status</h2>
          </div>

          <div className="space-y-4">
            {systemStatuses.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    system.status === 'online' ? 'bg-green-500' :
                    system.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-medium">{system.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">Uptime: {system.uptime}</span>
                  <span className="text-gray-500">Last Issue: {system.lastIssue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-medium">System Metrics</h2>
          </div>

          <div className="h-[300px]">
            <Line 
              data={systemMetrics}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Response Time (ms)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Error Logs */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-medium">Error Logs</h2>
          </div>

          <div className="space-y-2">
            {recentErrors.map((error) => (
              <div key={error.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      error.severity === 'high' ? 'text-red-500' :
                      error.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                    }`} />
                    <span className="font-medium">{error.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">{error.timestamp}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{error.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-medium text-red-700">Emergency Controls</h2>
          </div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2">
            <Power className="w-4 h-4" />
            Emergency Shutdown
          </button>
        </div>
        <p className="mt-2 text-sm text-red-600">
          Warning: Emergency shutdown will immediately stop all platform operations. Use only in critical situations.
        </p>
      </div>
    </div>
  )
}

