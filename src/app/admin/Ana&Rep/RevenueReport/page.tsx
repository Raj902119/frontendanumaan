'use client'

import { useState } from 'react'
import { Wallet, TrendingUp, Receipt, Download, FileText, ArrowUpRight, Users } from 'lucide-react'
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
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

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
  Legend
)

const revenueSourceData = {
  labels: ['Trading Fees', 'Deposit Fees', 'Premium Subscriptions', 'API Access', 'Other Services'],
  datasets: [{
    data: [45, 25, 15, 10, 5],
    backgroundColor: [
      'rgb(59, 130, 246)',
      'rgb(34, 197, 94)',
      'rgb(234, 179, 8)',
      'rgb(168, 85, 247)',
      'rgb(239, 68, 68)'
    ]
  }]
}

const subscriptionTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Recurring Revenue',
      data: [280000, 320000, 350000, 420000, 480000, 520000],
      backgroundColor: 'rgb(59, 130, 246)',
    },
    {
      label: 'One-Time Fees',
      data: [120000, 150000, 180000, 160000, 190000, 210000],
      backgroundColor: 'rgb(234, 179, 8)',
    }
  ]
}

export default function RevenueReportAnalytics() {
  const [dateRange, setDateRange] = useState('monthly')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Revenue Reports</h1>
          <p className="text-gray-500 mt-1">Track and analyze platform revenue and financial metrics</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border rounded-lg"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <Wallet className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold mt-2">₹7.32M</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            15.2% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Net Profit</div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mt-2">₹3.45M</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            8.7% vs last month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">GST Payable</div>
            <Receipt className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mt-2">₹1.32M</div>
          <div className="text-sm text-gray-500 mt-1">Due in 15 days</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Active Subscriptions</div>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mt-2">2,845</div>
          <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
            <ArrowUpRight className="w-4 h-4" />
            125 new this month
          </div>
        </div>
      </div>

      {/* Revenue Source and Subscription Trends */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-4">Revenue by Source</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie 
              data={revenueSourceData}
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
          <h3 className="font-medium mb-4">Subscription Revenue Trends</h3>
          <Bar 
            data={subscriptionTrendData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const value = context.raw as number;
                      return `Revenue: ₹${value.toLocaleString()}`;
                    }
                  }
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
        </div>
      </div>

      {/* P&L Statement */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Profit & Loss Statement</h3>
          <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Download PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">YoY Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Revenue</td>
                <td className="py-3 px-4 text-right">₹7,320,000</td>
                <td className="py-3 px-4 text-right text-green-600">+15.2%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Operating Expenses</td>
                <td className="py-3 px-4 text-right">₹2,450,000</td>
                <td className="py-3 px-4 text-right text-red-600">+8.4%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Gross Profit</td>
                <td className="py-3 px-4 text-right">₹4,870,000</td>
                <td className="py-3 px-4 text-right text-green-600">+18.7%</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Tax</td>
                <td className="py-3 px-4 text-right">₹1,420,000</td>
                <td className="py-3 px-4 text-right text-red-600">+12.3%</td>
              </tr>
              <tr className="border-b font-medium">
                <td className="py-3 px-4">Net Profit</td>
                <td className="py-3 px-4 text-right">₹3,450,000</td>
                <td className="py-3 px-4 text-right text-green-600">+21.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* GST Summary */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">GST Summary</h3>
          <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Tax Category</th>
                <th className="py-3 px-4 text-right">Taxable Amount</th>
                <th className="py-3 px-4 text-right">CGST</th>
                <th className="py-3 px-4 text-right">SGST</th>
                <th className="py-3 px-4 text-right">IGST</th>
                <th className="py-3 px-4 text-right">Total Tax</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 px-4">Trading Services</td>
                <td className="py-3 px-4 text-right">₹4,500,000</td>
                <td className="py-3 px-4 text-right">₹405,000</td>
                <td className="py-3 px-4 text-right">₹405,000</td>
                <td className="py-3 px-4 text-right">-</td>
                <td className="py-3 px-4 text-right">₹810,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4">Premium Services</td>
                <td className="py-3 px-4 text-right">₹2,820,000</td>
                <td className="py-3 px-4 text-right">₹253,800</td>
                <td className="py-3 px-4 text-right">₹253,800</td>
                <td className="py-3 px-4 text-right">-</td>
                <td className="py-3 px-4 text-right">₹507,600</td>
              </tr>
              <tr className="border-b font-medium">
                <td className="py-3 px-4">Total</td>
                <td className="py-3 px-4 text-right">₹7,320,000</td>
                <td className="py-3 px-4 text-right">₹658,800</td>
                <td className="py-3 px-4 text-right">₹658,800</td>
                <td className="py-3 px-4 text-right">-</td>
                <td className="py-3 px-4 text-right">₹1,317,600</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

