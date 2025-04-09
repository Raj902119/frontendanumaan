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

interface MarketData {
  symbol: string
  currentPrice: number
  priceChange24h: number
  volatility24h: number
  volume24h: number
  liquidity: {
    buyDepth: number
    sellDepth: number
    spread: number
  }
  circuitBreaker: {
    status: 'active' | 'inactive'
    reason?: string
    activatedAt?: string
    threshold: number
  }
  alerts: {
    type: 'price_spike' | 'volume_surge' | 'liquidity_drop' | 'volatility_breach'
    severity: 'low' | 'medium' | 'high'
    message: string
    timestamp: string
  }[]
}

const sampleMarketData: MarketData[] = [
  {
    symbol: 'NIFTY',
    currentPrice: 22045.75,
    priceChange24h: -1.5,
    volatility24h: 2.8,
    volume24h: 1500000,
    liquidity: {
      buyDepth: 850000,
      sellDepth: 920000,
      spread: 0.15
    },
    circuitBreaker: {
      status: 'inactive',
      threshold: 10
    },
    alerts: [
      {
        type: 'volatility_breach',
        severity: 'medium',
        message: 'Volatility exceeding 2σ from mean',
        timestamp: '2024-03-26 15:30'
      }
    ]
  }
]

const volatilityData = {
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
      label: 'Volatility',
      data: [1.2, 1.5, 2.8, 2.1, 1.8, 2.5, 2.2, 2.8],
      borderColor: 'rgb(234, 179, 8)',
      tension: 0.1,
      yAxisID: 'y1'
    }
  ]
}

export default function MarketVolatilityMonitoring() {
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null)
  const [showMarketDetails, setShowMarketDetails] = useState(false)

  const getVolatilityColor = (volatility: number) => {
    if (volatility >= 5) return 'text-red-600'
    if (volatility >= 2) return 'text-orange-600'
    return 'text-green-600'
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Market Volatility Monitoring</h1>
        <p className="text-gray-500 mt-1">Track and analyze market volatility and price movements</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">High Volatility Assets</div>
          <div className="text-2xl font-bold text-red-600 mt-1">5</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            Above threshold
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Circuit Breakers</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">2</div>
          <div className="text-xs text-gray-600 mt-1">Currently active</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Low Liquidity</div>
          <div className="text-2xl font-bold text-yellow-600 mt-1">3</div>
          <div className="text-xs text-gray-600 mt-1">Watch list</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Market Alerts</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">8</div>
          <div className="text-xs text-gray-600 mt-1">Last hour</div>
        </div>
      </div>

      {/* Volatility Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Price & Volatility Trends</h3>
          <div className="flex gap-2">
            <select className="text-sm border rounded-lg px-2 py-1.5">
              <option>NIFTY</option>
              <option>BANKNIFTY</option>
            </select>
            <select className="text-sm border rounded-lg px-2 py-1.5">
              <option>Last Hour</option>
              <option>Today</option>
              <option>5 Days</option>
            </select>
          </div>
        </div>
        <Line 
          data={volatilityData} 
          options={{
            responsive: true,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            scales: {
              y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                  display: true,
                  text: 'Price'
                }
              },
              y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                  display: true,
                  text: 'Volatility %'
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          }}
        />
      </div>

      {/* Market Data Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Market Overview</h3>
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
              <th className="text-left py-3 px-4">Symbol</th>
              <th className="text-right py-3 px-4">Price</th>
              <th className="text-right py-3 px-4">24h Change</th>
              <th className="text-right py-3 px-4">Volatility</th>
              <th className="text-right py-3 px-4">Volume</th>
              <th className="text-center py-3 px-4">Circuit Breaker</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleMarketData.map(market => (
              <tr key={market.symbol} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{market.symbol}</td>
                <td className="py-3 px-4 text-right">₹{market.currentPrice}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`${(market.priceChange24h ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {market.priceChange24h}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={getVolatilityColor(market.volatility24h)}>
                    {market.volatility24h}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {(market.volume24h / 1000).toFixed(1)}K
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    market.circuitBreaker.status === 'active' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {market.circuitBreaker.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => {
                      setSelectedMarket(market)
                      setShowMarketDetails(true)
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

      {/* Market Details Dialog */}
      <Dialog open={showMarketDetails} onOpenChange={setShowMarketDetails}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Market Details - {selectedMarket?.symbol}</DialogTitle>
            <DialogDescription>
              Detailed market analysis and controls
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Market Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Price Information</div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Price:</span>
                    <span className="font-medium">₹{selectedMarket?.currentPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">24h Change:</span>
                    <span className={`${(selectedMarket?.priceChange24h ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedMarket?.priceChange24h}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Volatility:</span>
                    <span className={getVolatilityColor(selectedMarket?.volatility24h || 0)}>
                      {selectedMarket?.volatility24h}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Liquidity Metrics</div>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Buy Depth:</span>
                    <span className="font-medium">₹{selectedMarket?.liquidity.buyDepth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sell Depth:</span>
                    <span className="font-medium">₹{selectedMarket?.liquidity.sellDepth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Spread:</span>
                    <span className="font-medium">{selectedMarket?.liquidity.spread}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circuit Breaker Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Circuit Breaker Status</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Threshold: ±{selectedMarket?.circuitBreaker.threshold}%
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedMarket?.circuitBreaker.status === 'active'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {selectedMarket?.circuitBreaker.status.toUpperCase()}
                </span>
              </div>
              {selectedMarket?.circuitBreaker.reason && (
                <div className="mt-2 text-sm text-gray-600">
                  Reason: {selectedMarket.circuitBreaker.reason}
                </div>
              )}
            </div>

            {/* Recent Alerts */}
            <div>
              <h3 className="font-medium mb-3">Recent Alerts</h3>
              <div className="space-y-2">
                {selectedMarket?.alerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{alert.type.split('_').join(' ').toUpperCase()}</div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getAlertSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
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
                <FileSearch className="w-4 h-4" />
                Analysis
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
                <Ban className="w-4 h-4" />
                Halt Trading
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
