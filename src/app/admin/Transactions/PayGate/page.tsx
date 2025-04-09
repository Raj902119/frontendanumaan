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
  Tooltip,
} from 'chart.js'
import { CheckCircle, Clock, XCircle } from 'lucide-react'
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

interface Gateway {
  id: string
  name: string
  status: 'live' | 'delayed' | 'down'
  uptime: number
  lastChecked: string
  errorRate: number
  processingVolume: number
  currency: string
}

interface FailedTransaction {
  id: string
  userId: string
  userName: string
  amount: number
  currency: string
  errorCode: string
  errorMessage: string
  timestamp: string
  gateway: string
  retryCount: number
  status: 'failed' | 'retrying' | 'resolved'
}

interface WebhookLog {
  id: string
  endpoint: string
  status: 'success' | 'failed'
  responseCode: number
  payload: string
  timestamp: string
  duration: number
}

const sampleGateways: Gateway[] = [
  {
    id: 'GATE-001',
    name: 'RazorPay',
    status: 'live',
    uptime: 99.9,
    lastChecked: '2024-03-26 15:30',
    errorRate: 0.1,
    processingVolume: 1250000,
    currency: '₹'
  },
  {
    id: 'GATE-002',
    name: 'PayU',
    status: 'delayed',
    uptime: 98.5,
    lastChecked: '2024-03-26 15:30',
    errorRate: 2.5,
    processingVolume: 980000,
    currency: '₹'
  }
]

const sampleFailures: FailedTransaction[] = [
  {
    id: 'TXN-001',
    userId: 'USR-001',
    userName: 'John Smith',
    amount: 25000,
    currency: '₹',
    errorCode: 'GATEWAY_TIMEOUT',
    errorMessage: 'Request timed out after 30 seconds',
    timestamp: '2024-03-26 15:25',
    gateway: 'RazorPay',
    retryCount: 2,
    status: 'retrying'
  },
  {
    id: 'TXN-002',
    userId: 'USR-002',
    userName: 'Sarah Johnson',
    amount: 15000,
    currency: '₹',
    errorCode: 'INSUFFICIENT_FUNDS',
    errorMessage: 'Bank account has insufficient funds',
    timestamp: '2024-03-26 15:20',
    gateway: 'PayU',
    retryCount: 0,
    status: 'failed'
  },
  {
    id: 'TXN-003',
    userId: 'USR-003',
    userName: 'Michael Chen',
    amount: 50000,
    currency: '₹',
    errorCode: 'BANK_ERROR',
    errorMessage: 'Bank server returned error code 500',
    timestamp: '2024-03-26 15:15',
    gateway: 'RazorPay',
    retryCount: 1,
    status: 'resolved'
  },
  {
    id: 'TXN-004',
    userId: 'USR-004',
    userName: 'Emma Wilson',
    amount: 75000,
    currency: '₹',
    errorCode: 'INVALID_CARD',
    errorMessage: 'Card authentication failed',
    timestamp: '2024-03-26 15:10',
    gateway: 'PayU',
    retryCount: 0,
    status: 'failed'
  },
  {
    id: 'TXN-005',
    userId: 'USR-005',
    userName: 'Raj Patel',
    amount: 100000,
    currency: '₹',
    errorCode: 'UPI_ERROR',
    errorMessage: 'UPI service temporarily unavailable',
    timestamp: '2024-03-26 15:05',
    gateway: 'RazorPay',
    retryCount: 3,
    status: 'failed'
  }
]

const performanceData = {
  labels: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  datasets: [
    {
      label: 'Success Rate (%)',
      data: [99.8, 99.9, 99.7, 98.5, 99.8, 99.9],
      borderColor: 'rgb(34, 197, 94)',
      tension: 0.1
    },
    {
      label: 'Error Rate (%)',
      data: [0.2, 0.1, 0.3, 1.5, 0.2, 0.1],
      borderColor: 'rgb(239, 68, 68)',
      tension: 0.1
    }
  ]
}

export default function PaymentGatewayMonitoring() {
  const [selectedFailure, setSelectedFailure] = useState<FailedTransaction | null>(null)
  const [showFailureDetails, setShowFailureDetails] = useState(false)
  const [gateways, setGateways] = useState<Gateway[]>(sampleGateways)
  const [failures, setFailures] = useState<FailedTransaction[]>(sampleFailures)
  const [timeRange, setTimeRange] = useState('6h')
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: 'WH-001',
      endpoint: '/razorpay/webhook',
      status: 'success',
      responseCode: 200,
      payload: '{"event":"payment.success","data":{...}}',
      timestamp: '2024-03-26 15:30:25',
      duration: 45
    },
    {
      id: 'WH-002',
      endpoint: '/payu/webhook',
      status: 'failed',
      responseCode: 504,
      payload: '{"event":"payment.initiated","data":{...}}',
      timestamp: '2024-03-26 15:29:15',
      duration: 30000
    }
  ])

  // Add chartData state
  const [chartData, setChartData] = useState(performanceData)

  const getStatusColor = (status: Gateway['status']) => {
    switch (status) {
      case 'live': return 'text-green-600'
      case 'delayed': return 'text-yellow-600'
      case 'down': return 'text-red-600'
    }
  }

  const getStatusIcon = (status: Gateway['status']) => {
    switch (status) {
      case 'live': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'delayed': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'down': return <XCircle className="w-5 h-5 text-red-600" />
    }
  }

  const handleRetry = async (failureId: string) => {
    const failure = failures.find(f => f.id === failureId)
    if (!failure) return

    setFailures(prev => prev.map(f => 
      f.id === failureId ? { ...f, status: 'retrying', retryCount: f.retryCount + 1 } : f
    ))

    await new Promise(resolve => setTimeout(resolve, 1500))

    setFailures(prev => prev.map(f => 
      f.id === failureId ? { ...f, status: 'resolved' } : f
    ))
  }

  const handleDownloadLog = (failure: FailedTransaction) => {
    const log = {
      transaction: failure,
      timestamp: new Date().toISOString(),
      systemInfo: {
        gateway: failure.gateway,
        environment: 'production'
      }
    }
    
    const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `failure-log-${failure.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updatePerformanceData = (range: string) => {
    setTimeRange(range)
    const newData = {
      labels: range === '24h' ? 
        Array.from({length: 24}, (_, i) => `${i}:00`) :
        range === '7d' ?
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
        performanceData.labels,
      datasets: [
        {
          ...performanceData.datasets[0],
          data: Array.from({length: range === '24h' ? 24 : range === '7d' ? 7 : 6}, 
            () => 98 + Math.random() * 2)
        },
        {
          ...performanceData.datasets[1],
          data: Array.from({length: range === '24h' ? 24 : range === '7d' ? 7 : 6}, 
            () => Math.random() * 2)
        }
      ]
    }
    setChartData(newData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment Gateway Monitoring</h1>
        <p className="text-gray-500 mt-1">Monitor gateway status and transaction processing</p>
      </div>

      {/* Gateway Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        {gateways.map(gateway => (
          <div key={gateway.id} className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={getStatusColor(gateway.status)}>
                  {getStatusIcon(gateway.status)}
                </div>
                <div>
                  <div className="font-medium">{gateway.name}</div>
                  <div className="text-sm text-gray-500">Last checked: {gateway.lastChecked}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Processing Volume</div>
                <div className="font-medium">{gateway.currency} {gateway.processingVolume.toLocaleString()}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500">Uptime</div>
                <div className="font-medium text-green-600">{gateway.uptime}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Error Rate</div>
                <div className="font-medium text-red-600">{gateway.errorRate}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className={`font-medium ${getStatusColor(gateway.status)}`}>
                  {gateway.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Gateway Performance</h3>
          <select 
            value={timeRange}
            onChange={(e) => updatePerformanceData(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1.5"
          >
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      {/* Failed Transactions */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-medium">Failed Transactions</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Transaction ID</th>
              <th className="text-left py-3 px-4">User</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Error</th>
              <th className="text-left py-3 px-4">Gateway</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {failures.map(failure => (
              <tr 
                key={failure.id} 
                className="border-b hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium">{failure.id}</td>
                <td className="py-3 px-4">{failure.userName}</td>
                <td className="py-3 px-4 text-right">
                  {failure.currency} {failure.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-red-600">{failure.errorCode}</div>
                  <div className="text-xs text-gray-500">{failure.errorMessage}</div>
                </td>
                <td className="py-3 px-4">{failure.gateway}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    failure.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    failure.status === 'retrying' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {failure.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    className="text-blue-600 hover:text-blue-800 mr-3"
                    onClick={() => {
                      setSelectedFailure(failure)
                      setShowFailureDetails(true)
                    }}
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => handleRetry(failure.id)}
                    disabled={failure.status === 'resolved' || failure.status === 'retrying'}
                    className={`text-green-600 hover:text-green-800 ${
                      failure.status === 'resolved' || failure.status === 'retrying' 
                        ? 'opacity-50 cursor-not-allowed' 
                        : ''
                    }`}
                  >
                    {failure.status === 'retrying' ? 'Retrying...' : 'Retry'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Webhook Logs */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-medium">Webhook Logs</h3>
        </div>
        <div className="p-4">
          <div className="font-mono text-sm bg-gray-50 p-4 rounded-lg h-48 overflow-y-auto">
            <div className="text-green-600">
              [2024-03-26 15:30:25] POST /razorpay/webhook - 200 OK (45ms)
            </div>
            <div className="text-red-600">
              [2024-03-26 15:29:15] POST /payu/webhook - 504 Gateway Timeout (30000ms)
            </div>
            <div className="text-green-600">
              [2024-03-26 15:28:10] POST /razorpay/webhook - 200 OK (52ms)
            </div>
          </div>
        </div>
      </div>

      {/* Failure Details Dialog */}
      <Dialog open={showFailureDetails} onOpenChange={setShowFailureDetails}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Transaction Failure Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Transaction Information</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedFailure?.id}</div>
                  <div className="text-sm">{selectedFailure?.userName}</div>
                  <div className="text-sm text-gray-600">Time: {selectedFailure?.timestamp}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Error Details</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium text-red-600">{selectedFailure?.errorCode}</div>
                  <div className="text-sm">{selectedFailure?.errorMessage}</div>
                  <div className="text-sm">Retry Count: {selectedFailure?.retryCount}</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-2">Response Log</div>
              <div className="font-mono text-sm bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                {`{
  "error": {
    "code": "${selectedFailure?.errorCode}",
    "message": "${selectedFailure?.errorMessage}",
    "transaction_id": "${selectedFailure?.id}",
    "timestamp": "${selectedFailure?.timestamp}"
  }
}`}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => selectedFailure && handleDownloadLog(selectedFailure)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Download Log
              </button>
              <button 
                onClick={() => selectedFailure && handleRetry(selectedFailure.id)}
                disabled={selectedFailure?.status === 'resolved' || selectedFailure?.status === 'retrying'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {selectedFailure?.status === 'retrying' ? 'Retrying...' : 'Retry Transaction'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

