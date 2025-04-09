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

interface ManipulationAlert {
  id: string
  userId: string
  userName: string
  activityType: 'spoofing' | 'layering' | 'pump_and_dump' | 'wash_trading' | 'flash_crash'
  severity: 'low' | 'medium' | 'high'
  symbol: string
  price: number
  volume: number
  timestamp: string
  description: string
  status: 'pending' | 'investigating' | 'resolved' | 'flagged'
  confidence: number
  relatedOrders: string[]
  priceDeviation: number
  volumeDeviation: number
}

const sampleAlerts: ManipulationAlert[] = [
  {
    id: 'MAN-001',
    userId: 'USR-001',
    userName: 'John Smith',
    activityType: 'spoofing',
    severity: 'high',
    symbol: 'NIFTY',
    price: 22045.75,
    volume: 1500,
    timestamp: '2024-03-26 15:30',
    description: 'Large order placement followed by rapid cancellation',
    status: 'investigating',
    confidence: 85,
    relatedOrders: ['ORD-001', 'ORD-002'],
    priceDeviation: 2.5,
    volumeDeviation: 180
  }
]

const priceVolumeData = {
  labels: ['9:15', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '15:30'],
  datasets: [
    {
      label: 'Price',
      data: [22000, 22100, 22300, 22150, 22045, 22200, 22150, 22045.75],
      borderColor: 'rgb(59, 130, 246)',
      tension: 0.1,
      yAxisID: 'y'
    },
    {
      label: 'Volume',
      data: [800, 900, 1200, 850, 750, 1500, 900, 1500],
      borderColor: 'rgb(234, 179, 8)',
      tension: 0.1,
      yAxisID: 'y1'
    }
  ]
}

export default function PriceManipulationMonitoring() {
  const [selectedAlert, setSelectedAlert] = useState<ManipulationAlert | null>(null)
  const [showAlertDetails, setShowAlertDetails] = useState(false)

  const getSeverityColor = (severity: ManipulationAlert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-700'
      case 'medium': return 'bg-orange-100 text-orange-700'
      case 'high': return 'bg-red-100 text-red-700'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-red-600'
    if (confidence >= 50) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Price Manipulation Analysis</h1>
        <p className="text-gray-500 mt-1">Monitor and detect market manipulation activities</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Active Alerts</div>
          <div className="text-2xl font-bold text-red-600 mt-1">12</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            4 high severity
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Price Anomalies</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">8</div>
          <div className="text-xs text-gray-600 mt-1">Last hour</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Volume Spikes</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">15</div>
          <div className="text-xs text-gray-600 mt-1">Above 2σ</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Order Cancellations</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">25</div>
          <div className="text-xs text-gray-600 mt-1">Suspicious patterns</div>
        </div>
      </div>

      {/* Price & Volume Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Price & Volume Analysis</h3>
          <div className="flex gap-2">
            <select className="text-sm border rounded-lg px-2 py-1.5">
              <option>NIFTY</option>
              <option>BANKNIFTY</option>
            </select>
            <select className="text-sm border rounded-lg px-2 py-1.5">
              <option>Last Hour</option>
              <option>Last 4 Hours</option>
              <option>Today</option>
            </select>
          </div>
        </div>
        <Line 
          data={priceVolumeData} 
          options={{ 
            responsive: true,
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                  drawOnChartArea: false,
                },
              },
            }
          }} 
        />
      </div>

      {/* Order Book Heatmap */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Order Book Heatmap</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View Full Depth
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-green-600">Bids</div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>22{(45 - i).toString().padStart(2, '0')}.75</span>
                <span className={`px-20 bg-green-${100 + i*100}`}></span>
                <span>{1500 - i*100}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-red-600">Asks</div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>22{(46 + i).toString().padStart(2, '0')}.75</span>
                <span className={`px-20 bg-red-${100 + i*100}`}></span>
                <span>{1200 + i*100}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Manipulation Alerts</h3>
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
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-left py-3 px-4">Symbol</th>
              <th className="text-right py-3 px-4">Price</th>
              <th className="text-right py-3 px-4">Volume</th>
              <th className="text-left py-3 px-4">Confidence</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleAlerts.map(alert => (
              <tr key={alert.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{alert.id}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(alert.severity)}`}>
                    {alert.activityType.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </td>
                <td className="py-3 px-4">{alert.symbol}</td>
                <td className="py-3 px-4 text-right">₹{alert.price}</td>
                <td className="py-3 px-4 text-right">{alert.volume}</td>
                <td className="py-3 px-4">
                  <div className={`font-medium ${getConfidenceColor(alert.confidence)}`}>
                    {alert.confidence}%
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                    alert.status === 'resolved' ? 'bg-green-100 text-green-700' :
                    alert.status === 'flagged' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => {
                      setSelectedAlert(alert)
                      setShowAlertDetails(true)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Investigate
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
            <DialogTitle>Manipulation Alert Details</DialogTitle>
            <DialogDescription>
              Investigate potential market manipulation activity.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Alert Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Alert Information</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedAlert?.id}</div>
                  <div className="text-sm">Type: {selectedAlert?.activityType}</div>
                  <div className="text-sm text-gray-600">Time: {selectedAlert?.timestamp}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Trading Details</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">Symbol: {selectedAlert?.symbol}</div>
                  <div className="text-sm">Price: ₹{selectedAlert?.price}</div>
                  <div className="text-sm">Volume: {selectedAlert?.volume}</div>
                </div>
              </div>
            </div>

            {/* Deviations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Price Deviation</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {selectedAlert?.priceDeviation}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  From 5-minute VWAP
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Volume Deviation</div>
                <div className="text-2xl font-bold text-orange-600 mt-1">
                  {selectedAlert?.volumeDeviation}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  From 1-hour average
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Monitor
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <FileSearch className="w-4 h-4" />
                Review Orders
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                <Ban className="w-4 h-4" />
                Suspend Trading
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
