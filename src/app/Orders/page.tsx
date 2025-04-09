'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ProtectedRoute from '@/components/protected-route'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks'
import { 
  fetchActiveTrades, 
  fetchClosedTrades, 
  exitTrade,
  Trade
} from '@/store/features/orderSlice'
import { fetchUserStats } from '@/store/features/userSlice'

// Function to format date
const formatDate = (dateString: string, isClient: boolean) => {
  if (!isClient) return ''
  return dateString
}

const TradeCard = ({ trade, onExit }: { trade: Trade, onExit: (id: string) => void }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center gap-3 mb-3">
      <Image
        src={trade.image || "/yono.svg"}
        alt="Event thumbnail"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <h3 className="font-medium aa:text-sm xs:text-base">{trade.event}</h3>
        <p className="text-gray-500 aa:text-xs xs:text-sm">{trade.date}</p>
      </div>
    </div>
    
    <div className="flex justify-between items-center border-t pt-3">
      <div className="flex flex-col items-center">
        <span className="text-gray-500 aa:text-xs xs:text-sm">Investment</span>
        <span className="font-medium aa:text-sm xs:text-base">₹{trade.investment}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-500 aa:text-xs xs:text-sm">Returns</span>
        <span className="font-medium aa:text-sm xs:text-base">₹{trade.gains}</span>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="aa:text-xs xs:text-sm"
        onClick={() => onExit(trade.id)}
      >
        Exit <span className="ml-1">→</span>
      </Button>
    </div>
  </div>
);

const ClosedTradeCard = ({ trade }: { trade: Trade }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center gap-3 mb-3">
      <Image
        src={trade.image || "/yono.svg"}
        alt="Event thumbnail"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <h3 className="font-medium aa:text-sm xs:text-base">{trade.event}</h3>
        <p className="text-gray-500 aa:text-xs xs:text-sm">{trade.date}</p>
      </div>
    </div>
    
    <div className="flex justify-between items-center border-t pt-3">
      <div className="flex flex-col items-center">
        <span className="text-gray-500 aa:text-xs xs:text-sm">Investment</span>
        <span className="font-medium aa:text-sm xs:text-base">₹{trade.investment}</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-gray-500 aa:text-xs xs:text-sm">Returns</span>
        <span className="font-medium aa:text-sm xs:text-base">₹{trade.gains}</span>
      </div>
      <div className="w-[60px]"></div>
    </div>
  </div>
);

export default function TradesPage() {
  const [isClient, setIsClient] = useState(false)
  const dispatch = useAppDispatch()
  
  // Get data from Redux store
  const { 
    activeTrades = [], 
    closedTrades = [], 
    activeTradesLoading,
    closedTradesLoading,
    error
  } = useAppSelector(state => state.orders)

  const {
    stats,
    loading: userStatsLoading
  } = useAppSelector(state => ({
    stats: state.user.stats || {
      totalTrades: 0,
      activeTrades: 0,
      totalPnL: 0,
      netProfitLoss: 0,
      todayReturns: 0,
      withdrawableAmount: 0,
      currentValue: 0,
      totalInvested: 0,
      totalReturned: 0
    },
    loading: state.user.loading
  }))
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Fetch data when component mounts
  useEffect(() => {
    if (isClient) {
      console.log('📊 Fetching orders data...');
      
      const fetchData = async () => {
        try {
          await Promise.all([
            dispatch(fetchActiveTrades()),
            dispatch(fetchClosedTrades()),
            dispatch(fetchUserStats())
          ]);
          console.log('✅ Orders data fetched successfully');
        } catch (error) {
          console.error('❌ Error fetching orders data:', error);
        }
      };
      
      fetchData();
      
      // Set up interval to refresh data every 30 seconds
      const interval = setInterval(() => {
        console.log('🔄 Refreshing orders data...');
        fetchData();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [dispatch, isClient])
  
  // Handle trade exit
  const handleExitTrade = (tradeId: string) => {
    dispatch(exitTrade(tradeId))
  }
  
  // Loading state for the entire page
  const isLoading = !isClient || (activeTradesLoading && closedTradesLoading && userStatsLoading)

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="aa:py-4 sm:py-8 lg:py-16 bg-gray-100">
          <div className="container mx-auto max-w-5xl space-y-8 px-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900">Orders</span>
            </div>
            
            {/* Error display */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                {typeof error === 'object' ? JSON.stringify(error) : error}
              </div>
            )}

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="bg-gray-200 inline-flex h-10 items-center justify-center rounded-md p-1">
                <TabsTrigger value="active">
                  Active trades
                </TabsTrigger>
                <TabsTrigger value="closed">
                  Closed trades
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                <Card className="mt-6">
                  <CardContent className="aa:p-4 xs:p-6">
                    <div className="aa:text-xs xs:text-sm text-muted-foreground mb-2">
                      CURRENT VALUE
                    </div>
                    <div className="aa:text-lg xs:text-2xl font-semibold mb-4">
                      ₹{stats.currentValue || 0}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="aa:text-lg xs:text-2xl font-semibold text-right">
                          ₹{stats.totalInvested || 0}
                        </div>
                        <div className="aa:text-xs xs:text-sm text-muted-foreground text-right">
                          Investment
                        </div>
                      </div>
                      <div>
                        <div className={`aa:text-lg xs:text-2xl font-semibold text-right ${
                          (stats.netProfitLoss || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          ₹{stats.netProfitLoss || 0}
                        </div>
                        <div className="aa:text-xs xs:text-sm text-muted-foreground text-right">
                          Net P&L
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid aa:grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeTrades.map((trade: Trade) => (
                    <TradeCard 
                      key={trade.id} 
                      trade={trade} 
                      onExit={handleExitTrade}
                    />
                  ))}
                  
                  {activeTrades.length === 0 && (
                    <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
                      <p className="text-gray-500">No active trades found</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="closed" className="space-y-6">
                <Card className="mt-6">
                  <CardContent className="aa:p-4 xs:p-6">
                    <div className="aa:text-xs xs:text-sm text-muted-foreground mb-2">
                      RETURNS
                    </div>
                    <div className="aa:text-lg xs:text-2xl font-semibold mb-4">
                      ₹{stats.totalReturned || 0}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="aa:text-lg xs:text-2xl font-semibold text-right">
                          ₹{stats.totalInvested || 0}
                        </div>
                        <div className="aa:text-xs xs:text-sm text-muted-foreground text-right">
                          Investment
                        </div>
                      </div>
                      <div>
                        <div className="aa:text-lg xs:text-2xl font-semibold text-right">
                          ₹{stats.todayReturns || 0}
                        </div>
                        <div className="aa:text-xs xs:text-sm text-muted-foreground text-right">
                          Today's Returns
                        </div>
                      </div>
                      <div>
                        <div className="aa:text-lg xs:text-2xl font-semibold text-right">
                          {stats.totalTrades || 0}
                        </div>
                        <div className="aa:text-xs xs:text-sm text-muted-foreground text-right">
                          Total Trades
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid aa:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {closedTrades.map((trade: Trade) => (
                    <ClosedTradeCard key={trade.id} trade={trade} />
                  ))}
                  
                  {closedTrades.length === 0 && (
                    <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
                      <p className="text-gray-500">No closed trades found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}
