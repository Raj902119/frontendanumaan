'use client'

import { useState } from 'react'
import { TrendingUp, Clock, Users, BarChart2, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const volumeData = {
  labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'],
  datasets: [
    {
      label: 'Trading Volume',
      data: [2500, 3200, 4100, 3800, 3600, 3900, 4500, 4200, 4800, 5100, 4900, 5300],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}

const categoryVolumeData = {
  labels: ['Politics', 'Crypto', 'Sports', 'Forex', 'Commodities'],
  datasets: [{
    label: 'Volume by Category',
    data: [45000, 32000, 28000, 18000, 12000],
    backgroundColor: [
      'rgb(59, 130, 246)',
      'rgb(34, 197, 94)',
      'rgb(234, 179, 8)',
      'rgb(168, 85, 247)',
      'rgb(239, 68, 68)'
    ],
    borderRadius: 4,
  }]
}

const buyVsSellData = {
  labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'],
  datasets: [
    {
      label: 'Buy Orders',
      data: [1500, 1800, 2200, 2000, 1900, 2100, 2400, 2300, 2600, 2800, 2700, 2900],
      backgroundColor: 'rgb(34, 197, 94)',
      stack: 'stack0',
    },
    {
      label: 'Sell Orders',
      data: [1000, 1400, 1900, 1800, 1700, 1800, 2100, 1900, 2200, 2300, 2200, 2400],
      backgroundColor: 'rgb(239, 68, 68)',
      stack: 'stack0',
    }
  ]
}

const topTraders = [
  { rank: 1, userId: 'TR-001', userName: 'John Smith', volume: 1250000, trades: 85, avgSize: 14705 },
  { rank: 2, userId: 'TR-002', userName: 'Alice Johnson', volume: 980000, trades: 62, avgSize: 15806 },
  { rank: 3, userId: 'TR-003', userName: 'Bob Wilson', volume: 875000, trades: 73, avgSize: 11986 },
  { rank: 4, userId: 'TR-004', userName: 'Emma Davis', volume: 720000, trades: 45, avgSize: 16000 },
  { rank: 5, userId: 'TR-005', userName: 'Michael Brown', volume: 650000, trades: 55, avgSize: 11818 }
]

export default function TradingVolumeAnalytics() {
  const [timeframe, setTimeframe] = useState('1D')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trading Volume Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor and analyze trading activity across the platform</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border rounded-lg"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="1D">1 Day</option>
            <option value="1W">1 Week</option>
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
          </select>
          <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Volume</div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">₹135.2M</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            8.5% vs yesterday
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Active Traders</div>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mt-2">1,235</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            12.3% vs yesterday
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Buy/Sell Ratio</div>
            <BarChart2 className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mt-2">1.25</div>
          <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
            <ArrowDownRight className="w-4 h-4" />
            0.05 vs yesterday
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Peak Hour Volume</div>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-2">₹12.5M</div>
          <div className="text-sm text-gray-500 mt-1">14:00 - 15:00</div>
        </div>
      </div>

      {/* Real-Time Volume Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-4">Real-Time Trading Volume</h3>
        <Line 
          data={volumeData}
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
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    return `Volume: ₹${value.toLocaleString()}`
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
                  callback: (value) => `₹${value.toLocaleString()}`
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }}
        />
      </div>

      {/* Volume by Category and Buy/Sell Ratio */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Volume by Category</h3>
          <Bar 
            data={categoryVolumeData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  titleColor: '#1f2937',
                  bodyColor: '#1f2937',
                  borderColor: '#e5e7eb',
                  borderWidth: 1,
                  padding: 12,
                  callbacks: {
                    label: function(context) {
                      const value = context.raw as number;
                      return `Volume: ₹${value.toLocaleString()}`
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
                    callback: (value) => `₹${value.toLocaleString()}`
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Buy vs Sell Orders</h3>
          <Bar 
            data={buyVsSellData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  titleColor: '#1f2937',
                  bodyColor: '#1f2937',
                  borderColor: '#e5e7eb',
                  borderWidth: 1,
                  padding: 12,
                }
              },
              scales: {
                y: {
                  stacked: true,
                  grid: {
                    color: '#f3f4f6',
                  }
                },
                x: {
                  stacked: true,
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Top Traders */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-4">Top Traders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Trader</th>
                <th className="py-3 px-4 text-right">Volume</th>
                <th className="py-3 px-4 text-right">Trades</th>
                <th className="py-3 px-4 text-right">Avg. Trade Size</th>
              </tr>
            </thead>
            <tbody>
              {topTraders.map((trader) => (
                <tr key={trader.userId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{trader.rank}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium">{trader.userName}</div>
                    <div className="text-sm text-gray-500">{trader.userId}</div>
                  </td>
                  <td className="py-3 px-4 text-right">₹{trader.volume.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{trader.trades}</td>
                  <td className="py-3 px-4 text-right">₹{trader.avgSize.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

