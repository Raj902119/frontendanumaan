'use client'

import {
  CategoryScale,
  Chart,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Title,
  Tooltip
} from 'chart.js'
import { Activity, AlertTriangle, Bell, CheckCircle, RefreshCw, Search, Server } from 'lucide-react'
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

const responseTimeData = {
  labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  datasets: [
    {
      label: 'API Response Time',
      data: [120, 135, 125, 130, 155, 145, 160, 150, 140, 130, 125, 120],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: function(context: ScriptableContext<'line'>) {
        const chart: Chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)');
        return gradient;
      },
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgb(59, 130, 246)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  ]
}

const errorLogs = [
  { id: 'ERR-001', timestamp: '2024-03-20 14:23:45', type: 'API Error', message: 'Gateway Timeout', severity: 'high', status: 'unresolved' },
  { id: 'ERR-002', timestamp: '2024-03-20 14:20:12', type: 'Database', message: 'Connection Pool Exhausted', severity: 'medium', status: 'investigating' },
  { id: 'ERR-003', timestamp: '2024-03-20 14:15:30', type: 'Authentication', message: 'Token Validation Failed', severity: 'low', status: 'resolved' },
  { id: 'ERR-004', timestamp: '2024-03-20 14:10:05', type: 'Transaction', message: 'Order Processing Delayed', severity: 'medium', status: 'resolved' },
  { id: 'ERR-005', timestamp: '2024-03-20 14:05:22', type: 'System', message: 'Memory Usage High', severity: 'high', status: 'investigating' }
]

const latencyData = [
  { endpoint: '/api/trade/execute', avg: 145, p95: 180, p99: 220, errors: '0.02%' },
  { endpoint: '/api/market/price', avg: 85, p95: 120, p99: 150, errors: '0.01%' },
  { endpoint: '/api/user/auth', avg: 120, p95: 160, p99: 200, errors: '0.03%' },
  { endpoint: '/api/portfolio/update', avg: 165, p95: 200, p99: 250, errors: '0.02%' },
  { endpoint: '/api/order/status', avg: 95, p95: 130, p99: 160, errors: '0.01%' }
]

const alerts = [
  { id: 1, type: 'critical', message: 'High Memory Usage Detected', time: '2 minutes ago' },
  { id: 2, type: 'warning', message: 'API Response Time Degradation', time: '5 minutes ago' },
  { id: 3, type: 'info', message: 'System Backup Completed', time: '10 minutes ago' },
  { id: 4, type: 'success', message: 'Server Auto-scaling Successful', time: '15 minutes ago' }
]

export default function PlatformHealthMonitoring() {
  const [timeframe, setTimeframe] = useState('24h')
  const [errorFilter, setErrorFilter] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Health Monitoring</h1>
          <p className="text-gray-500 mt-1">Real-time system performance and health metrics</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border rounded-lg"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Server Status</div>
            <Server className="w-5 h-5 text-green-500" />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <div className="text-2xl font-bold">Online</div>
          </div>
          <div className="text-sm text-gray-500 mt-1">Uptime: 99.99%</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">API Health</div>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">135ms</div>
          <div className="text-sm text-gray-500 mt-1">Avg. Response Time</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Error Rate</div>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mt-2">0.02%</div>
          <div className="text-sm text-gray-500 mt-1">Last 24 hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Active Alerts</div>
            <Bell className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-2">3</div>
          <div className="text-sm text-gray-500 mt-1">2 Critical, 1 Warning</div>
        </div>
      </div>

      {/* Response Time Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-4">API Response Time</h3>
        <Line 
          data={responseTimeData}
          options={{
            responsive: true,
            interaction: {
              mode: 'index' as const,
              intersect: false,
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    return `Response Time: ${value}ms`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6',
                },
                ticks: {
                  callback: (value) => `${value}ms`
                }
              },
              x: {
                grid: { display: false }
              }
            }
          }}
        />
      </div>

      {/* Error Logs and Alerts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Error Logs</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search errors..."
                  className="pl-9 pr-4 py-1.5 border rounded-lg text-sm"
                />
              </div>
              <select 
                className="px-3 py-1.5 border rounded-lg text-sm"
                value={errorFilter}
                onChange={(e) => setErrorFilter(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            {errorLogs.map((error) => (
              <div key={error.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      error.severity === 'high' ? 'bg-red-500' :
                      error.severity === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <span className="font-medium">{error.type}</span>
                  </div>
                  <span className={`text-sm ${
                    error.status === 'unresolved' ? 'text-red-600' :
                    error.status === 'investigating' ? 'text-orange-600' : 'text-green-600'
                  }`}>{error.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{error.message}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{error.id}</span>
                  <span>{error.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Latency Analysis */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-4">API Latency Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-3 px-4">Endpoint</th>
                    <th className="py-3 px-4 text-right">Avg (ms)</th>
                    <th className="py-3 px-4 text-right">P95 (ms)</th>
                    <th className="py-3 px-4 text-right">P99 (ms)</th>
                    <th className="py-3 px-4 text-right">Error Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {latencyData.map((endpoint) => (
                    <tr key={endpoint.endpoint} className="border-b">
                      <td className="py-3 px-4 font-medium">{endpoint.endpoint}</td>
                      <td className="py-3 px-4 text-right">{endpoint.avg}</td>
                      <td className="py-3 px-4 text-right">{endpoint.p95}</td>
                      <td className="py-3 px-4 text-right">{endpoint.p99}</td>
                      <td className="py-3 px-4 text-right">{endpoint.errors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alert Notifications */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-4">Recent Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
                  {alert.type === 'info' && <Bell className="w-5 h-5 text-blue-500" />}
                  {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
