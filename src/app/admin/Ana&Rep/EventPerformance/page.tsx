'use client'

import {
  BarElement,
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
import { ArrowDownRight, ArrowUpRight, Calendar, RefreshCw, Search, TrendingUp, Trophy, Users } from 'lucide-react'
import { useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const topEventsData = {
  labels: ['IPL Final 2024', 'FIFA World Cup', 'Bitcoin Halving', 'US Elections', 'Olympics 2024'],
  datasets: [{
    label: 'Trading Volume',
    data: [850000, 720000, 680000, 540000, 420000],
    backgroundColor: function(context: ScriptableContext<"bar">) {
      const chart: Chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
      return gradient;
    },
    borderRadius: 8,
    hoverBackgroundColor: 'rgb(37, 99, 235)',
  }]
}

const profitabilityData = {
  labels: ['Sports', 'Crypto', 'Politics', 'Entertainment', 'Others'],
  datasets: [
    {
      label: 'Revenue',
      data: [450000, 380000, 280000, 220000, 150000],
      backgroundColor: 'rgb(34, 197, 94)',
    },
    {
      label: 'Payouts',
      data: [320000, 290000, 180000, 160000, 100000],
      backgroundColor: 'rgb(239, 68, 68)',
    }
  ]
}

const engagementTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'User Engagement',
      data: [75, 82, 78, 85, 88, 92],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Market Trend',
      data: [70, 75, 80, 82, 85, 88],
      borderColor: 'rgb(234, 179, 8)',
      backgroundColor: 'rgba(234, 179, 8, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}

const recentEvents = [
  { id: 'EV-001', name: 'IPL Final 2024', category: 'Sports', participants: 25800, volume: 850000, successRate: 92, roi: 18.5 },
  { id: 'EV-002', name: 'Bitcoin Halving', category: 'Crypto', participants: 18500, volume: 680000, successRate: 88, roi: 15.2 },
  { id: 'EV-003', name: 'US Elections', category: 'Politics', participants: 15200, volume: 540000, successRate: 85, roi: 12.8 },
  { id: 'EV-004', name: 'Eurovision 2024', category: 'Entertainment', participants: 12400, volume: 420000, successRate: 82, roi: 10.5 },
  { id: 'EV-005', name: 'Olympics 2024', category: 'Sports', participants: 22000, volume: 720000, successRate: 90, roi: 16.8 }
]

export default function EventPerformanceAnalytics() {
  const [timeframe, setTimeframe] = useState('monthly')
  const [category, setCategory] = useState('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Event Performance Analytics</h1>
          <p className="text-gray-500 mt-1">Track and analyze event success and engagement metrics</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border rounded-lg"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="sports">Sports</option>
            <option value="crypto">Crypto</option>
            <option value="politics">Politics</option>
            <option value="entertainment">Entertainment</option>
          </select>
          <select 
            className="px-3 py-2 border rounded-lg"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
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
            <div className="text-sm text-gray-500">Success Rate</div>
            <Trophy className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">87.5%</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            5.2% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Participants</div>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mt-2">93.9K</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            12.8% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Average ROI</div>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mt-2">14.8%</div>
          <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
            <ArrowDownRight className="w-4 h-4" />
            2.1% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Active Events</div>
            <Calendar className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-2">185</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            15 new this month
          </div>
        </div>
      </div>

      {/* Most Traded Events */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-4">Top Performing Events</h3>
        <Bar 
          data={topEventsData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    return `Volume: ₹${value.toLocaleString()}`;
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
                  padding: 8,
                  callback: (value) => `₹${(value as number).toLocaleString()}`
                }
              },
              x: {
                grid: { display: false },
                ticks: { padding: 8 }
              }
            },
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            }
          }}
        />
      </div>

      {/* Category Profitability and Engagement Trends */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Category Profitability</h3>
          <Bar 
            data={profitabilityData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'rect',
                  }
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
                      return `${context.dataset.label}: ₹${value.toLocaleString()}`;
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
                    padding: 8,
                    callback: (value) => `₹${(value as number).toLocaleString()}`
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: { padding: 8 }
                }
              },
              animation: {
                duration: 2000,
                easing: 'easeOutQuart'
              }
            }}
          />
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Engagement vs Market Trends</h3>
          <Line 
            data={engagementTrendData}
            options={{
              responsive: true,
              interaction: {
                mode: 'index' as const,
                intersect: false,
              },
              plugins: {
                legend: {
                  position: 'top' as const,
                  labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  titleColor: '#1f2937',
                  bodyColor: '#1f2937',
                  borderColor: '#e5e7eb',
                  borderWidth: 1,
                  padding: 12,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: {
                    color: '#f3f4f6',
                  },
                  ticks: {
                    stepSize: 20,
                    padding: 8,
                    callback: (value) => `${value}%`
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: { padding: 8 }
                }
              },
              elements: {
                line: {
                  tension: 0.4
                },
                point: {
                  radius: 4,
                  hoverRadius: 6,
                  borderWidth: 2,
                  backgroundColor: 'white'
                }
              }
            }}
          />
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Recent Events Performance</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-9 pr-4 py-1.5 border rounded-lg text-sm"
              />
            </div>
            <select className="px-3 py-1.5 border rounded-lg text-sm">
              <option>Sort by Volume</option>
              <option>Sort by ROI</option>
              <option>Sort by Success Rate</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Event Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Participants</th>
                <th className="py-3 px-4 text-right">Volume</th>
                <th className="py-3 px-4 text-right">Success Rate</th>
                <th className="py-3 px-4 text-right">ROI</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{event.name}</div>
                    <div className="text-sm text-gray-500">{event.id}</div>
                  </td>
                  <td className="py-3 px-4">{event.category}</td>
                  <td className="py-3 px-4 text-right">{event.participants.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">₹{event.volume.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{event.successRate}%</td>
                  <td className="py-3 px-4 text-right text-green-600">+{event.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

