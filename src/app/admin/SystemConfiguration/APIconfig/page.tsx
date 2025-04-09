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
import { AlertTriangle, Copy, Eye, EyeOff, Key, Lock, Plus, RefreshCw, Search, Shield, Trash2 } from 'lucide-react'
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

const apiKeys = [
  { 
    id: 'key1',
    name: 'Trading Bot 1',
    key: 'ak_1234567890abcdef',
    secret: '••••••••••••••••',
    permissions: ['read', 'trade'],
    status: 'active',
    created: '2024-03-15',
    lastUsed: '2024-03-20'
  },
  { 
    id: 'key2',
    name: 'Analytics Service',
    key: 'ak_abcdef1234567890',
    secret: '••••••••••••••••',
    permissions: ['read'],
    status: 'active',
    created: '2024-03-10',
    lastUsed: '2024-03-19'
  }
]

const usageData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  datasets: [
    {
      label: 'API Requests',
      data: [120, 234, 542, 887, 432, 590],
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

const securityLogs = [
  { 
    id: 1,
    timestamp: '2024-03-20 15:30:45',
    event: 'Failed Authentication',
    ip: '192.168.1.100',
    details: 'Invalid API key',
    severity: 'high'
  },
  { 
    id: 2,
    timestamp: '2024-03-20 15:25:12',
    event: 'Rate Limit Exceeded',
    ip: '192.168.1.101',
    details: 'Too many requests',
    severity: 'medium'
  },
  { 
    id: 3,
    timestamp: '2024-03-20 15:20:30',
    event: 'Unauthorized Access',
    ip: '192.168.1.102',
    details: 'Insufficient permissions',
    severity: 'high'
  }
]

export default function APIConfiguration() {
  const [showSecret, setShowSecret] = useState<string | null>(null)
  const [whitelistedIPs, setWhitelistedIPs] = useState(['192.168.1.100', '192.168.1.101'])
  const [rateLimits, setRateLimits] = useState({
    requests: 1000,
    interval: 60,
    burstLimit: 50
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Configuration</h1>
          <p className="text-gray-500 mt-1">Manage API access, security, and monitoring</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generate New API Key
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* API Keys */}
        <div className="col-span-2 bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-medium">API Keys</h2>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search keys..."
                  className="pl-9 pr-4 py-1.5 border rounded-lg text-sm"
                />
              </div>
              <select className="px-3 py-1.5 border rounded-lg text-sm">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">API Key</th>
                  <th className="py-3 px-4">Secret</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4">Last Used</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b">
                    <td className="py-3 px-4">{key.name}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{key.key}</code>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Copy className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {showSecret === key.id ? key.secret : '••••••••••••••••'}
                        </code>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => setShowSecret(showSecret === key.id ? null : key.id)}
                        >
                          {showSecret === key.id ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {key.permissions.map((perm) => (
                          <span 
                            key={perm}
                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs capitalize"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                        {key.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{key.created}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{key.lastUsed}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button className="p-1 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate Limits & Usage */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-medium">Rate Limits & Usage</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requests/Minute</label>
                <input
                  type="number"
                  value={rateLimits.requests}
                  onChange={(e) => setRateLimits({...rateLimits, requests: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interval (seconds)</label>
                <input
                  type="number"
                  value={rateLimits.interval}
                  onChange={(e) => setRateLimits({...rateLimits, interval: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Burst Limit</label>
                <input
                  type="number"
                  value={rateLimits.burstLimit}
                  onChange={(e) => setRateLimits({...rateLimits, burstLimit: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="h-[300px]">
              <Line 
                data={usageData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `Requests: ${context.raw}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Requests/Hour'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* IP Whitelist */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-medium">IP Whitelist</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter IP address"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Add IP
              </button>
            </div>

            <div className="space-y-2">
              {whitelistedIPs.map((ip) => (
                <div key={ip} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm">{ip}</code>
                  <button className="p-1 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Logs */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-medium">Security Logs</h2>
          </div>

          <div className="space-y-2">
            {securityLogs.map((log) => (
              <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      log.severity === 'high' ? 'text-red-500' : 'text-orange-500'
                    }`} />
                    <span className="font-medium">{log.event}</span>
                  </div>
                  <span className="text-sm text-gray-500">{log.timestamp}</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">IP:</span> {log.ip}
                </div>
                <div className="text-sm text-gray-600">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

