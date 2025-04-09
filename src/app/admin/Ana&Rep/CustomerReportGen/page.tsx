'use client'

import { useState } from 'react'
import { Download, Calendar, Clock, Trash2, Plus } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const sampleData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [450000, 380000, 520000, 480000, 600000, 580000],
      backgroundColor: 'rgb(59, 130, 246)',
      borderRadius: 4,
    }
  ]
}

const reportTemplates = [
  { id: 1, name: 'Monthly Performance Summary', type: 'Performance', schedule: 'Monthly', lastRun: '2024-03-15' },
  { id: 2, name: 'User Activity Analysis', type: 'User Analytics', schedule: 'Weekly', lastRun: '2024-03-18' },
  { id: 3, name: 'Revenue Breakdown Report', type: 'Financial', schedule: 'Daily', lastRun: '2024-03-20' },
  { id: 4, name: 'Platform Health Status', type: 'System', schedule: 'Weekly', lastRun: '2024-03-17' }
]

const scheduledReports = [
  { id: 1, name: 'Monthly KPI Report', recipients: 'team@example.com', frequency: 'Monthly', nextRun: '2024-04-01' },
  { id: 2, name: 'Weekly User Metrics', recipients: 'analytics@example.com', frequency: 'Weekly', nextRun: '2024-03-25' },
  { id: 3, name: 'Daily Transaction Summary', recipients: 'finance@example.com', frequency: 'Daily', nextRun: '2024-03-21' }
]

export default function CustomerReportGenerator() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [viewMode, setViewMode] = useState<'table' | 'graph'>('table')

  const metrics = [
    'Revenue', 'User Count', 'Transaction Volume', 'Active Users',
    'Average Order Value', 'Conversion Rate', 'Churn Rate', 'Customer Satisfaction'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Custom Report Generator</h1>
          <p className="text-gray-500 mt-1">Create, schedule, and export custom reports</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Report Configuration */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-4">Report Configuration</h3>
            
            {/* Template Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select a template</option>
                <option value="blank">Blank Report</option>
                {reportTemplates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  className="px-3 py-2 border rounded-lg"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
                <input
                  type="date"
                  className="px-3 py-2 border rounded-lg"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>

            {/* Metrics Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Metrics</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {metrics.map((metric) => (
                  <label key={metric} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(metric)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMetrics([...selectedMetrics, metric])
                        } else {
                          setSelectedMetrics(selectedMetrics.filter(m => m !== metric))
                        }
                      }}
                      className="rounded text-blue-500"
                    />
                    {metric}
                  </label>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-2">
              <button className="w-full px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
              <button className="w-full px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export as Excel
              </button>
              <button className="w-full px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Report Preview</h3>
              <div className="flex gap-2">
                <button 
                  className={`px-3 py-1.5 rounded-lg ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  onClick={() => setViewMode('table')}
                >
                  Table View
                </button>
                <button 
                  className={`px-3 py-1.5 rounded-lg ${viewMode === 'graph' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                  onClick={() => setViewMode('graph')}
                >
                  Graph View
                </button>
              </div>
            </div>

            {viewMode === 'graph' ? (
              <Bar 
                data={sampleData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${(value as number).toLocaleString()}`
                      }
                    }
                  }
                }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-3 px-4">Month</th>
                      <th className="py-3 px-4 text-right">Revenue</th>
                      <th className="py-3 px-4 text-right">Users</th>
                      <th className="py-3 px-4 text-right">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
                      <tr key={month} className="border-b">
                        <td className="py-3 px-4">{month}</td>
                        <td className="py-3 px-4 text-right">₹450,000</td>
                        <td className="py-3 px-4 text-right">1,250</td>
                        <td className="py-3 px-4 text-right">3,850</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Scheduled Reports */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Scheduled Reports</h3>
              <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Schedule New
              </button>
            </div>
            <div className="space-y-2">
              {scheduledReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-500">To: {report.recipients}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {report.frequency}
                    </div>
                    <div className="text-sm text-gray-600">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {report.nextRun}
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <Trash2 className="w-4 h-4 text-gray-500" />
                    </button>
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

