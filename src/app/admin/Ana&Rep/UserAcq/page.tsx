'use client'

import { useState } from 'react'
import { Users, Map, TrendingUp, RefreshCw, ArrowUpRight, ArrowDownRight, UserPlus } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const userGrowthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'New Users',
      data: [1200, 1900, 2400, 2800, 3500, 4200],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Active Users',
      data: [1000, 1600, 2000, 2300, 2900, 3500],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}

const referralSourceData = {
  labels: ['Organic Search', 'Social Media', 'Paid Ads', 'Direct', 'Referrals'],
  datasets: [{
    data: [35, 25, 20, 15, 5],
    backgroundColor: [
      'rgb(59, 130, 246)',
      'rgb(34, 197, 94)',
      'rgb(234, 179, 8)',
      'rgb(168, 85, 247)',
      'rgb(239, 68, 68)'
    ]
  }]
}

const funnelData = [
  { stage: 'Visits', count: 10000, color: 'bg-blue-500' },
  { stage: 'Sign-ups', count: 5000, color: 'bg-green-500' },
  { stage: 'KYC Started', count: 3000, color: 'bg-yellow-500' },
  { stage: 'KYC Completed', count: 2000, color: 'bg-purple-500' },
  { stage: 'First Trade', count: 1000, color: 'bg-red-500' }
]

export default function UserAcquisitionAnalytics() {
  const [timeframe, setTimeframe] = useState('monthly')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Acquisition Analytics</h1>
          <p className="text-gray-500 mt-1">Track and analyze user growth and acquisition channels</p>
        </div>
        <div className="flex gap-2">
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
            <div className="text-sm text-gray-500">New Users</div>
            <UserPlus className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">4,235</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            12.5% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mt-2">23.8%</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            2.1% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Churn Rate</div>
            <Users className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold mt-2">5.2%</div>
          <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
            <ArrowDownRight className="w-4 h-4" />
            0.8% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Avg. Acquisition Cost</div>
            <Map className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mt-2">$42.50</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            $3.20 vs last month
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* User Growth Chart */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">User Growth Trends</h3>
          <Line 
            data={userGrowthData}
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
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  titleColor: '#1f2937',
                  bodyColor: '#1f2937',
                  borderColor: '#e5e7eb',
                  borderWidth: 1,
                  padding: 12,
                  boxPadding: 6,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#f3f4f6',
                  },
                  ticks: {
                    callback: (value) => value.toLocaleString()
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

        {/* Referral Sources */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Acquisition Channels</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie 
              data={referralSourceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                      pointStyle: 'circle',
                    }
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
                        const value = context.raw as number
                        return `${context.label}: ${value}%`
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Funnel Analysis */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-4">User Onboarding Funnel</h3>
        <div className="flex items-end justify-around h-64 gap-2">
          {funnelData.map((stage) => {
            const percentage = (stage.count / funnelData[0].count) * 100
            return (
              <div key={stage.stage} className="flex flex-col items-center w-1/6 group">
                <div className="text-sm font-medium mb-2 transition-all group-hover:scale-110">
                  {stage.count.toLocaleString()}
                </div>
                <div 
                  className={`w-full ${stage.color} rounded-t-lg transition-all duration-300 group-hover:opacity-90 group-hover:shadow-lg`} 
                  style={{ 
                    height: `${percentage}%`,
                    transform: 'translateZ(0)',
                  }}
                >
                  <div className="invisible group-hover:visible absolute w-full text-center -mt-8 text-sm font-medium text-gray-700">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2 transition-all group-hover:text-gray-900">
                  {stage.stage}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Retention Cohort */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">User Retention Cohorts</h3>
          <select className="px-3 py-1.5 border rounded-lg text-sm">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Cohort</th>
                <th className="py-3 px-4">Week 1</th>
                <th className="py-3 px-4">Week 2</th>
                <th className="py-3 px-4">Week 3</th>
                <th className="py-3 px-4">Week 4</th>
                <th className="py-3 px-4">Week 8</th>
                <th className="py-3 px-4">Week 12</th>
              </tr>
            </thead>
            <tbody>
              {['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'].map((month) => (
                <tr key={month} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{month}</td>
                  {[100, 85, 76, 68, 55, 42].map((value, idx) => (
                    <td 
                      key={idx} 
                      className="py-3 px-4 relative group"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${value/100 * 0.2})`,
                      }}
                    >
                      <span className="relative z-10">{value}%</span>
                      <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

