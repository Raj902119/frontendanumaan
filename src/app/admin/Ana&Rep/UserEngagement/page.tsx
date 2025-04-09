'use client'

import {
  ArcElement,
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
import { Activity, ArrowDownRight, ArrowUpRight, Clock, Layers, MousePointer, RefreshCw, Users } from 'lucide-react'
import { useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'

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

const sessionData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Average Session Duration',
      data: [12.5, 14.2, 13.8, 15.1, 14.5, 11.8, 10.5],
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
    },
    {
      label: 'Bounce Rate',
      data: [35, 32, 28, 30, 31, 38, 40],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: function(context: ScriptableContext<'line'>) {
        const chart: Chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.1)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.4)');
        return gradient;
      },
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'white',
      pointBorderColor: 'rgb(239, 68, 68)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  ]
}

const userStatusData = {
  labels: ['Highly Active', 'Moderately Active', 'At Risk', 'Inactive'],
  datasets: [{
    data: [45, 30, 15, 10],
    backgroundColor: [
      'rgb(34, 197, 94)',
      'rgb(59, 130, 246)',
      'rgb(234, 179, 8)',
      'rgb(239, 68, 68)'
    ]
  }]
}

const featureUsageData = {
  labels: ['Trading', 'Portfolio', 'Analytics', 'News Feed', 'Social', 'Settings'],
  datasets: [{
    label: 'Usage Count',
    data: [85000, 65000, 45000, 38000, 25000, 15000],
    backgroundColor: function(context: ScriptableContext<'bar'>) {
      const chart: Chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.8)');
      return gradient;
    },
    borderRadius: 8,
    hoverBackgroundColor: 'rgb(37, 99, 235)',
  }]
}

const heatmapData = [
  { x: 120, y: 80, value: 85 },
  { x: 250, y: 150, value: 92 },
  { x: 180, y: 220, value: 78 },
  { x: 350, y: 180, value: 65 },
  { x: 280, y: 120, value: 88 }
]

export default function UserEngagementAnalytics() {
  const [timeframe, setTimeframe] = useState('weekly')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Engagement Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor user activity and platform usage patterns</p>
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
            <div className="text-sm text-gray-500">Avg. Session Duration</div>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">13.2m</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            2.5m vs last week
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Bounce Rate</div>
            <MousePointer className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold mt-2">32.8%</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowDownRight className="w-4 h-4" />
            2.1% vs last week
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Active Users</div>
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mt-2">75%</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            5% vs last week
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Feature Engagement</div>
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-2">8.4</div>
          <div className="text-sm text-gray-500 mt-1">Avg features/user</div>
        </div>
      </div>

      {/* Session Duration Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-medium mb-4">Session Duration & Bounce Rate</h3>
        <Line 
          data={sessionData}
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
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#1f2937',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                  label: function(context) {
                    const value = context.raw as number;
                    return context.dataset.label === 'Bounce Rate' 
                      ? `${value}%`
                      : `${value} minutes`;
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
                  padding: 10,
                  font: {
                    size: 11
                  },
                  callback: (value) => `${value}m`
                }
              },
              x: {
                grid: { display: false },
                ticks: {
                  padding: 10,
                  font: {
                    size: 11
                  }
                }
              }
            },
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            }
          }}
        />
      </div>

      {/* User Status and Feature Usage */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">User Activity Status</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie 
              data={userStatusData}
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
                    callbacks: {
                      label: function(context) {
                        const value = context.raw as number;
                        return `${context.label}: ${value}%`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Feature Usage Distribution</h3>
          <Bar 
            data={featureUsageData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw as number;
                      return `Usage Count: ${value.toLocaleString()}`;
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
                    callback: (value) => value.toLocaleString()
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Heatmap and User Flow */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Click Heatmap</h3>
          <div className="relative h-[300px] bg-gray-100 rounded-lg overflow-hidden">
            {heatmapData.map((point, idx) => (
              <div
                key={idx}
                className="absolute w-16 h-16 rounded-full transition-all duration-300 hover:w-20 hover:h-20"
                style={{
                  left: point.x,
                  top: point.y,
                  background: `radial-gradient(circle, rgba(59, 130, 246, ${point.value/100}) 0%, rgba(59, 130, 246, ${point.value/200}) 50%, transparent 70%)`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                }}
              >
                <div className="opacity-0 hover:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded text-xs shadow">
                  {point.value}% clicks
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg text-sm shadow-sm">
              Click intensity: Low → High
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Common User Paths</h3>
          <div className="space-y-4">
            {[
              { path: 'Home → Trading → Portfolio', count: '45%' },
              { path: 'Home → News → Trading', count: '28%' },
              { path: 'Portfolio → Analytics → Trading', count: '18%' },
              { path: 'Home → Social → News', count: '9%' }
            ].map((path, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>{path.path}</span>
                </div>
                <span className="text-sm font-medium">{path.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
