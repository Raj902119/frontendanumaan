'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart } from '@/components/ui/bar-chart'
import { TrendLineChart } from '@/components/ui/trend-line-chart'
import ClientOnly from '@/components/client-only'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Download,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Clock,
  RefreshCw,
  Filter
} from 'lucide-react'
import AdminRoute from '@/components/admin-routes'

// Placeholder data for analytics dashboard
const userAcquisitionData = [
  { date: '2023-12-01', volume: 120, height: 20 },
  { date: '2023-12-15', volume: 240, height: 40 },
  { date: '2024-01-01', volume: 350, height: 58 },
  { date: '2024-01-15', volume: 290, height: 48 },
  { date: '2024-02-01', volume: 410, height: 68 },
  { date: '2024-02-15', volume: 380, height: 63 },
  { date: '2024-03-01', volume: 520, height: 87 },
  { date: '2024-03-15', volume: 600, height: 100 },
]

const tradingVolumeData = [
  { date: '2023-12-01', volume: 1500000, height: 30 },
  { date: '2023-12-15', volume: 2200000, height: 44 },
  { date: '2024-01-01', volume: 1800000, height: 36 },
  { date: '2024-01-15', volume: 2800000, height: 56 },
  { date: '2024-02-01', volume: 3500000, height: 70 },
  { date: '2024-02-15', volume: 3200000, height: 64 },
  { date: '2024-03-01', volume: 4100000, height: 82 },
  { date: '2024-03-15', volume: 5000000, height: 100 },
]

const revenueData = [
  { date: '2023-12-01', volume: 120000, height: 24 },
  { date: '2023-12-15', volume: 180000, height: 36 },
  { date: '2024-01-01', volume: 150000, height: 30 },
  { date: '2024-01-15', volume: 230000, height: 46 },
  { date: '2024-02-01', volume: 290000, height: 58 },
  { date: '2024-02-15', volume: 260000, height: 52 },
  { date: '2024-03-01', volume: 320000, height: 64 },
  { date: '2024-03-15', volume: 400000, height: 80 },
]

const userRetentionData = [0, 45, 75, 62, 58, 52, 48, 45, 43]
const platformHealthData = [99.8, 99.9, 99.7, 99.8, 100, 99.9, 99.8, 99.9, 100]

// Overall metrics data
const overallMetrics = {
  userGrowth: {
    current: 5432,
    previous: 4321,
    percentChange: 25.7
  },
  tradingVolume: {
    current: 5000000,
    previous: 3200000,
    percentChange: 56.3
  },
  revenue: {
    current: 400000,
    previous: 260000,
    percentChange: 53.8
  },
  activeEvents: {
    current: 842,
    previous: 645,
    percentChange: 30.5
  },
  conversionRate: {
    current: 8.2,
    previous: 6.5,
    percentChange: 26.2
  },
  averageOrderValue: {
    current: 1250,
    previous: 980,
    percentChange: 27.6
  }
}

// Event performance data
const eventPerformance = [
  { 
    id: 'EVT-1001',
    name: 'IPL 2024 Final',
    participants: 2345,
    markets: 12,
    volume: 1250000,
    revenue: 75000
  },
  { 
    id: 'EVT-1002',
    name: 'Lok Sabha Elections 2024',
    participants: 1890,
    markets: 35,
    volume: 950000,
    revenue: 62000
  },
  { 
    id: 'EVT-1003',
    name: 'India vs Australia Test Series',
    participants: 1650,
    markets: 18,
    volume: 780000,
    revenue: 48000
  },
  { 
    id: 'EVT-1004',
    name: 'Oscars 2024',
    participants: 1230,
    markets: 22,
    volume: 620000,
    revenue: 36000
  },
  { 
    id: 'EVT-1005',
    name: 'FIFA World Cup Qualifiers',
    participants: 980,
    markets: 15,
    volume: 450000,
    revenue: 28000
  },
]

// User segment data
const userSegments = [
  { segment: 'High Volume Traders', count: 856, percentage: 15.8, growth: 12.5 },
  { segment: 'Regular Users', count: 2893, percentage: 53.3, growth: 8.2 },
  { segment: 'Occasional Users', count: 1198, percentage: 22.1, growth: -3.5 },
  { segment: 'New Users (< 30 days)', count: 485, percentage: 8.9, growth: 45.2 }
]

export default function AnalyticsDashboard() {
  const [timeFrame, setTimeFrame] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshing, setRefreshing] = useState(false)
  
  const refreshData = () => {
    setRefreshing(true)
    // In a real app, this would fetch fresh data from the API
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    })
  }
  
  return (
    <AdminRoute>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Insights and metrics about platform performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={timeFrame}
              onValueChange={setTimeFrame}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="quarter">Last 90 Days</SelectItem>
                <SelectItem value="year">Last 12 Months</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={refreshData} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="userAnalytics">User Analytics</TabsTrigger>
            <TabsTrigger value="eventPerformance">Event Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue & Transactions</TabsTrigger>
            <TabsTrigger value="platformHealth">Platform Health</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    User Growth
                  </CardTitle>
                  <CardDescription>Total registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatNumber(overallMetrics.userGrowth.current)}</div>
                      <div className={`text-sm flex items-center ${
                        overallMetrics.userGrowth.percentChange >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {overallMetrics.userGrowth.percentChange >= 0 
                          ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                          : <ArrowDownRight className="h-3 w-3 mr-1" />
                        }
                        {Math.abs(overallMetrics.userGrowth.percentChange)}% from last period
                      </div>
                    </div>
                    <ClientOnly>
                      <div className="h-10 w-20">
                        <TrendLineChart 
                          data={userRetentionData} 
                          strokeColor="#3B82F6"
                          showXAxis={false}
                          showYAxis={false}
                          showTooltip={false}
                        />
                      </div>
                    </ClientOnly>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Trading Volume
                  </CardTitle>
                  <CardDescription>Total prediction volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(overallMetrics.tradingVolume.current)}</div>
                      <div className={`text-sm flex items-center ${
                        overallMetrics.tradingVolume.percentChange >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {overallMetrics.tradingVolume.percentChange >= 0 
                          ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                          : <ArrowDownRight className="h-3 w-3 mr-1" />
                        }
                        {Math.abs(overallMetrics.tradingVolume.percentChange)}% from last period
                      </div>
                    </div>
                    <ClientOnly>
                      <div className="h-10 w-20">
                        <TrendLineChart 
                          data={[30, 44, 36, 56, 70, 64, 82, 100]} 
                          strokeColor="#22C55E"
                          showXAxis={false}
                          showYAxis={false}
                          showTooltip={false}
                        />
                      </div>
                    </ClientOnly>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                    Revenue
                  </CardTitle>
                  <CardDescription>Total platform earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(overallMetrics.revenue.current)}</div>
                      <div className={`text-sm flex items-center ${
                        overallMetrics.revenue.percentChange >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {overallMetrics.revenue.percentChange >= 0 
                          ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                          : <ArrowDownRight className="h-3 w-3 mr-1" />
                        }
                        {Math.abs(overallMetrics.revenue.percentChange)}% from last period
                      </div>
                    </div>
                    <ClientOnly>
                      <div className="h-10 w-20">
                        <TrendLineChart 
                          data={[24, 36, 30, 46, 58, 52, 64, 80]} 
                          strokeColor="#8B5CF6"
                          showXAxis={false}
                          showYAxis={false}
                          showTooltip={false}
                        />
                      </div>
                    </ClientOnly>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                    Active Events
                  </CardTitle>
                  <CardDescription>Currently live events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatNumber(overallMetrics.activeEvents.current)}</div>
                      <div className={`text-sm flex items-center ${
                        overallMetrics.activeEvents.percentChange >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {overallMetrics.activeEvents.percentChange >= 0 
                          ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                          : <ArrowDownRight className="h-3 w-3 mr-1" />
                        }
                        {Math.abs(overallMetrics.activeEvents.percentChange)}% from last period
                      </div>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Live Now
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Layers className="h-4 w-4 mr-2 text-cyan-500" />
                    Conversion Rate
                  </CardTitle>
                  <CardDescription>Visitors to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{overallMetrics.conversionRate.current}%</div>
                      <div className={`text-sm flex items-center ${
                        overallMetrics.conversionRate.percentChange >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {overallMetrics.conversionRate.percentChange >= 0 
                          ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                          : <ArrowDownRight className="h-3 w-3 mr-1" />
                        }
                        {Math.abs(overallMetrics.conversionRate.percentChange)}% from last period
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Target: 10%
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                    Avg. Order Value
                  </CardTitle>
                  <CardDescription>Per user transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(overallMetrics.averageOrderValue.current)}</div>
                      <div className={`text-sm flex items-center ${
                        overallMetrics.averageOrderValue.percentChange >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {overallMetrics.averageOrderValue.percentChange >= 0 
                          ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                          : <ArrowDownRight className="h-3 w-3 mr-1" />
                        }
                        {Math.abs(overallMetrics.averageOrderValue.percentChange)}% from last period
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Lifetime: {formatCurrency(1150)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-medium">User Acquisition</CardTitle>
                  <CardDescription>New users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientOnly>
                    <BarChart 
                      data={userAcquisitionData}
                      formatDate={formatDate}
                      formatVolume={(count) => formatNumber(count)}
                    />
                  </ClientOnly>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Trading Volume</CardTitle>
                  <CardDescription>Total transaction volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientOnly>
                    <BarChart 
                      data={tradingVolumeData}
                      formatDate={formatDate}
                      formatVolume={(volume) => formatCurrency(volume)}
                    />
                  </ClientOnly>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* User Analytics Tab */}
          <TabsContent value="userAnalytics" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-base font-medium">User Segments</CardTitle>
                <CardDescription>Breakdown of user types and activity levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Segment</th>
                        <th className="text-right py-3 px-4 font-medium">Users</th>
                        <th className="text-right py-3 px-4 font-medium">% of Total</th>
                        <th className="text-right py-3 px-4 font-medium">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userSegments.map((segment, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{segment.segment}</td>
                          <td className="text-right py-3 px-4">{formatNumber(segment.count)}</td>
                          <td className="text-right py-3 px-4">{segment.percentage}%</td>
                          <td className="text-right py-3 px-4">
                            <span className={`flex items-center justify-end ${
                              segment.growth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {segment.growth >= 0 
                                ? <ArrowUpRight className="h-3 w-3 mr-1" /> 
                                : <ArrowDownRight className="h-3 w-3 mr-1" />
                              }
                              {Math.abs(segment.growth)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-medium">User Retention</CardTitle>
                  <CardDescription>Weekly retention rate of new users</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientOnly>
                    <TrendLineChart data={userRetentionData} />
                  </ClientOnly>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">Week 1</div>
                    <div className="text-sm text-gray-500">Week 9</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-medium">User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientOnly>
                    <BarChart 
                      data={userAcquisitionData}
                      formatDate={formatDate}
                      formatVolume={(count) => formatNumber(count)}
                    />
                  </ClientOnly>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">User Demographics</CardTitle>
                  <CardDescription>Age and location distribution</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  Demographic visualization would appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Event Performance Tab */}
          <TabsContent value="eventPerformance" className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Top Performing Events</h3>
              <Button variant="outline" size="sm">View All Events</Button>
            </div>
            
            <Card className="bg-white">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Event</th>
                        <th className="text-right py-3 px-4 font-medium">Participants</th>
                        <th className="text-right py-3 px-4 font-medium">Markets</th>
                        <th className="text-right py-3 px-4 font-medium">Volume</th>
                        <th className="text-right py-3 px-4 font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eventPerformance.map((event, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{event.name}</div>
                              <div className="text-sm text-muted-foreground">{event.id}</div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">{formatNumber(event.participants)}</td>
                          <td className="text-right py-3 px-4">{event.markets}</td>
                          <td className="text-right py-3 px-4">{formatCurrency(event.volume)}</td>
                          <td className="text-right py-3 px-4">{formatCurrency(event.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Event Categories Performance</CardTitle>
                  <CardDescription>Trading volume by event category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    Category breakdown chart would appear here
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base font-medium">User Engagement by Event Type</CardTitle>
                  <CardDescription>Participation metrics by event type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    Engagement metrics chart would appear here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-base font-medium">Revenue Overview</CardTitle>
                <CardDescription>Platform revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientOnly>
                  <BarChart 
                    data={revenueData}
                    formatDate={formatDate}
                    formatVolume={(revenue) => formatCurrency(revenue)}
                  />
                </ClientOnly>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Commission Revenue</CardTitle>
                  <CardDescription>Platform fees from transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(320000)}</div>
                  <div className="text-sm flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    48.2% from last period
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Deposit Fees</CardTitle>
                  <CardDescription>Revenue from deposit fees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(52000)}</div>
                  <div className="text-sm flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    32.5% from last period
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Withdrawal Fees</CardTitle>
                  <CardDescription>Revenue from withdrawal fees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(28000)}</div>
                  <div className="text-sm flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    18.9% from last period
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">Transaction Breakdown</CardTitle>
                  <CardDescription>Deposits vs. Withdrawals vs. Orders</CardDescription>
                </div>
                <Button variant="outline" size="sm">Export CSV</Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6 text-muted-foreground">
                  Transaction breakdown chart would appear here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Platform Health Tab */}
          <TabsContent value="platformHealth" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="text-base font-medium">System Uptime</CardTitle>
                <CardDescription>Platform availability percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientOnly>
                  <TrendLineChart 
                    data={platformHealthData} 
                    strokeColor="#22C55E"
                    yAxisMin={99}
                    yAxisMax={100}
                  />
                </ClientOnly>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">9 days ago</div>
                  <div className="text-sm text-gray-500">Today</div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">API Response Time</CardTitle>
                  <CardDescription>Average response time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">128ms</div>
                  <div className="text-sm flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    12% faster than target
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Error Rate</CardTitle>
                  <CardDescription>Percentage of failed requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.12%</div>
                  <div className="text-sm flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Below 0.5% target
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Server Load</CardTitle>
                  <CardDescription>Average CPU usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42%</div>
                  <div className="text-sm flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Within normal range
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-medium">Critical Alerts</CardTitle>
                  <CardDescription>System warnings and errors</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-50">
                  All Systems Normal
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  No critical alerts in the past 7 days
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminRoute>
  )
} 