'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchUserStats, fetchWinRateStats } from '@/store/features/userSlice'
import { fetchWalletBalance, fetchTransactions } from '@/store/features/walletSlice'
import { fetchActiveOrders } from '@/store/features/orderSlice'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import ProtectedRoute from '@/components/protected-route'

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const [isClient, setIsClient] = useState(false)
  
  // Add fallback objects for each selector to handle undefined state
  const userState = useSelector((state: RootState) => state.user) || {
    stats: null,
    winRateStats: null,
    loading: false,
    error: null
  }
  
  const walletState = useSelector((state: RootState) => state.wallet) || {
    balance: null,
    recentTransactions: [],
    loading: false,
    error: null
  }
  
  const orderState = useSelector((state: RootState) => state.order) || {
    activeOrders: [],
    completedOrders: [],
    loading: false,
    error: null
  }
  
  // Also get auth state which contains user balance like in the navbar
  const authState = useSelector((state: RootState) => state.auth) || {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  }
  
  const { stats, winRateStats, loading: userLoading } = userState
  const { balance, recentTransactions, loading: walletLoading } = walletState
  const { activeOrders, loading: orderLoading } = orderState
  const { user } = authState

  useEffect(() => {
    setIsClient(true)
    
    console.log('Fetching dashboard data...');
    
    // Fetch all user data from backend
    dispatch(fetchUserStats())
    dispatch(fetchWinRateStats())
    dispatch(fetchWalletBalance())
    dispatch(fetchTransactions())
    dispatch(fetchActiveOrders())
    
    // Setup refresh interval to keep data updated
    const refreshInterval = setInterval(() => {
      console.log('Refreshing dashboard data...');
      dispatch(fetchUserStats())
      dispatch(fetchWinRateStats())
      dispatch(fetchWalletBalance())
    }, 60000) // Refresh every minute
    
    // Clean up interval on component unmount
    return () => clearInterval(refreshInterval)
  }, [dispatch])

  const loading = userLoading || walletLoading || orderLoading

  // Function to format date
  const formatDate = (dateString: string) => {
    if (!isClient) return '' // Prevent hydration errors with date formatting
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Mock data for demo charts
  const chartData = [
    { name: 'Mon', value: 2400 },
    { name: 'Tue', value: 1398 },
    { name: 'Wed', value: 9800 },
    { name: 'Thu', value: 3908 },
    { name: 'Fri', value: 4800 },
    { name: 'Sat', value: 3800 },
    { name: 'Sun', value: 4300 },
  ]

  // Get the balance from either wallet state or auth state
  const getTotalBalance = () => {
    console.log('Getting total balance:', {
      walletBalance: balance,
      userWallet: user?.wallet,
      user: user
    });
    
    // First try from wallet balance
    if (balance?.totalBalance !== undefined && balance?.totalBalance !== null) {
      return Number(balance.totalBalance);
    }
    
    // Then try from user's wallet
    if (user?.wallet?.totalBalance !== undefined && user?.wallet?.totalBalance !== null) {
      return Number(user.wallet.totalBalance);
    }
    
    // Then try from user's direct balance
    if (user?.totalBalance !== undefined && user?.totalBalance !== null) {
      return Number(user.totalBalance);
    }
    
    // Return zero as fallback
    return 0;
  }

  // Get the available balance from either wallet state or auth state
  const getAvailableBalance = () => {
    console.log('Getting available balance:', {
      walletBalance: balance,
      userWallet: user?.wallet,
      user: user
    });
    
    // First try from wallet balance
    if (balance?.availableBalance !== undefined && balance?.availableBalance !== null) {
      return Number(balance.availableBalance);
    }
    
    // Then try from user's wallet
    if (user?.wallet?.availableBalance !== undefined && user?.wallet?.availableBalance !== null) {
      return Number(user.wallet.availableBalance);
    }
    
    // Then try from user's direct balance
    if (user?.availableBalance !== undefined && user?.availableBalance !== null) {
      return Number(user.availableBalance);
    }
    
    // Return zero as fallback
    return 0;
  }

  if (loading && !isClient) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <ProtectedRoute>
      {!isClient ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-2xl font-bold">
                    ₹{getTotalBalance().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available: ₹{getAvailableBalance().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium">Active Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-2xl font-bold">{stats?.activeTrades || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Total Trades: {stats?.totalTrades || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm font-medium">P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`mb-4 text-2xl font-bold ${stats?.netProfitLoss && stats.netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{stats?.netProfitLoss?.toFixed(2) || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Today: ₹{stats?.todayReturns?.toFixed(2) || '0.00'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-1+">
                  <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-2xl font-bold">
                    {winRateStats?.overallWinRate !== undefined
                      ? `${(winRateStats.overallWinRate * 100).toFixed(1)}%` 
                      : '0%'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {winRateStats?.weeklyWinRate !== undefined
                      ? `Weekly: ${(winRateStats.weeklyWinRate * 100).toFixed(1)}%`
                      : `Based on ${stats?.totalTrades || 0} trades`}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="portfolio" className="mb-6">
              <TabsList>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="portfolio" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Active Positions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeOrders && activeOrders.length > 0 ? (
                      <div className="space-y-4">
                        {activeOrders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">{order.eventName}</h3>
                              <p className="text-sm text-muted-foreground">
                                Position: {order.position}, Qty: {order.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{order.price?.toFixed(2) || '0.00'}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground">No active positions</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentTransactions && recentTransactions.length > 0 ? (
                      <div className="space-y-4">
                        {recentTransactions.map((transaction) => (
                          <div key={transaction.transactionId} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h3 className="font-semibold">
                                {transaction.type?.charAt(0) + transaction.type?.slice(1).toLowerCase()}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(transaction.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' ? 'text-green-600' : 'text-red-600'}`}>
                                {transaction.type === 'DEPOSIT' || transaction.type === 'BONUS' 
                                  ? `+₹${transaction.amount?.toFixed(2) || '0.00'}` 
                                  : `-₹${transaction.amount?.toFixed(2) || '0.00'}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {transaction.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground">No recent transactions</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#4461F2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
} 