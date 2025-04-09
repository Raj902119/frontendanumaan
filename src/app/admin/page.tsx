'use client'
import ClientOnly from "@/components/client-only"
import { BarChart } from "@/components/ui/bar-chart"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendLineChart } from "@/components/ui/trend-line-chart"
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell, Calendar, DollarSign, Users } from 'lucide-react'
import { useState } from "react"

type UserFilterType = 'all' | 'active' | 'inactive';
type EventFilterType = 'all' | 'previous' | 'live' | 'upcoming';

export default function AdminDashboard() {
  const [userFilter, setUserFilter] = useState<UserFilterType>('all')
  const [eventFilter, setEventFilter] = useState<EventFilterType>('all')

  const userStats: Record<UserFilterType, { count: number; change: number }> = {
    all: { count: 5432, change: 12 },
    active: { count: 4123, change: 15 },
    inactive: { count: 1309, change: -3 }
  }

  const eventStats: Record<EventFilterType, { count: number; change: number }> = {
    all: { count: 5432, change: 8 },
    previous: { count: 3210, change: 5 },
    live: { count: 842, change: 12 },
    upcoming: { count: 1380, change: 15 }
  }

  const volumeData = [
    { date: '2024-03-20', volume: 840000, height: 40 },
    { date: '2024-03-21', volume: 1470000, height: 70 },
    { date: '2024-03-22', volume: 1155000, height: 55 },
    { date: '2024-03-23', volume: 1680000, height: 80 },
    { date: '2024-03-24', volume: 945000, height: 45 },
    { date: '2024-03-25', volume: 630000, height: 30 },
    { date: '2024-03-26', volume: 1365000, height: 65 },
  ]

  const userTrendData = [0, 45, 15, 47, 83, 29, 7, 10, 95]
  const eventTrendData = [0, 45, 15, 47, 83, 94, 7, 70, 5]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatVolume = (volume: number) => {
    return `₹${(volume / 100000).toFixed(1)}L`
  }

  // Add more traders data
  const traders = [
    { name: 'Alice Johnson', profit: '+₹2,500', volume: '+₹25,000', avatar: 'A', trend: 'up' },
    { name: 'Bob Smith', profit: '+₹1,500', volume: '+₹15,000', avatar: 'B', trend: 'up' },
    { name: 'Charlie Brown', profit: '-₹1,200', volume: '+₹12,000', avatar: 'C', trend: 'down' },
    { name: 'David Wilson', profit: '+₹1,100', volume: '+₹11,000', avatar: 'D', trend: 'up' },
    { name: 'Eva Martinez', profit: '+₹1,000', volume: '+₹10,000', avatar: 'E', trend: 'up' },
  ]

  const alerts = [
    { type: 'critical', message: 'High trading volume detected in Event #123', time: '2 mins ago' },
    { type: 'warning', message: 'Multiple failed login attempts', time: '5 mins ago' },
    { type: 'info', message: 'System maintenance scheduled for tonight', time: '10 mins ago' },
    { type: 'success', message: 'New event published successfully', time: '15 mins ago' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 relative overflow-hidden">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">5,432</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5%
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500/10">
            <div className="w-3/4 h-full bg-blue-500" />
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Events</p>
              <h3 className="text-2xl font-bold mt-1">842</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2%
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500/10">
            <div className="w-1/2 h-full bg-purple-500" />
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <h3 className="text-2xl font-bold mt-1">₹1.2M</h3>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <ArrowDownRight className="w-4 h-4 mr-1" />
                -3.2%
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/10">
            <div className="w-2/3 h-full bg-green-500" />
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">System Health</p>
              <h3 className="text-2xl font-bold mt-1">98.2%</h3>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +0.5%
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500/10">
            <div className="w-[98%] h-full bg-orange-500" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Trading Volume</h3>
          <ClientOnly>
            <BarChart 
              data={volumeData}
              formatDate={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              formatVolume={(volume) => `₹${(volume / 100000).toFixed(1)}L`}
            />
          </ClientOnly>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">User Growth</h3>
          <ClientOnly>
            <TrendLineChart data={userTrendData} />
          </ClientOnly>
        </Card>
      </div>

      {/* Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Top Traders</h3>
          <div className="space-y-4">
            {traders.map((trader, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    {trader.avatar}
                  </div>
                  <div>
                    <div className="font-medium">{trader.name}</div>
                    <div className="text-sm text-gray-500">Volume: {trader.volume}</div>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  trader.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trader.profit}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">System Alerts</h3>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Last 24 hours</span>
            </div>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`p-4 rounded-lg flex items-start gap-3 ${
                alert.type === 'critical' ? 'bg-red-50' :
                alert.type === 'warning' ? 'bg-yellow-50' :
                alert.type === 'info' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'critical' ? 'text-red-500' :
                  alert.type === 'warning' ? 'text-yellow-500' :
                  alert.type === 'info' ? 'text-blue-500' : 'text-green-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
