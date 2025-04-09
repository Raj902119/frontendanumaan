'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertOctagon,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Ban,
  Bell,
  Eye,
  Search,
  Shield
} from 'lucide-react'
import { useState } from 'react'
import { DateRange } from "react-day-picker"

interface Trade {
  id: string
  date: string
  event: string
  eventType: 'sports' | 'politics' | 'entertainment' | 'finance'
  prediction: string
  type: 'buy' | 'sell'
  amount: number
  profitLoss: number
  fees: number 
  riskScore: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'closed' | 'suspended'
  trader: string
  patterns: string[]
  symbol: string
  price: number
  quantity: number
  side: 'buy' | 'sell'
  executionTime: string
  orderType: 'market' | 'limit'
}

interface UserProfile {
  id: string
  name: string
  email: string
  joinDate: string
  tradingVolume: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'suspended' | 'under_review'
  lastLogin: string
}

interface UserTrade {
  id: string
  time: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'market' | 'limit'
  price: number
  quantity: number
  total: number
  status: 'completed' | 'pending' | 'failed'
}

interface DetailedUserProfile extends UserProfile {
  trades: UserTrade[]
  totalTrades: number
  successRate: number
  averageTradeSize: number
  profitLoss: number
  mostTradedPair: string
  riskPatterns: string[]
  dailyStats: {
    volume: number
    tradeCount: number
    winRate: number
  }
  activeTrades: Trade[]
  closedTrades: Trade[]
}

const sampleUsers: DetailedUserProfile[] = [
  {
    id: 'USR001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    joinDate: '2024-01-15',
    tradingVolume: 1234567,
    riskLevel: 'high',
    status: 'under_review',
    lastLogin: '2024-03-20 14:30:00',
    trades: [
      {
        id: 'TRD001',
        time: '2024-03-20 14:30:00',
        symbol: 'IND vs AUS',
        side: 'buy',
        type: 'market',
        price: 65000,
        quantity: 0.5,
        total: 32500,
        status: 'completed'
      },
      {
        id: 'TRD002',
        time: '2024-03-20 14:15:00',
        symbol: 'CSK vs MI',
        side: 'sell',
        type: 'limit',
        price: 3500,
        quantity: 5,
        total: 17500,
        status: 'completed'
      }
    ],
    totalTrades: 156,
    successRate: 68,
    averageTradeSize: 15000,
    profitLoss: 25000,
    mostTradedPair: 'Cricket Matches',
    riskPatterns: ['Unusual volume', 'Rapid trading'],
    dailyStats: {
      volume: 250000,
      tradeCount: 25,
      winRate: 72
    },
    activeTrades: [
      {
        id: 'AT001',
        date: '2024-03-20',
        event: 'IND vs AUS - Final Match',
        eventType: 'sports',
        prediction: 'India Win',
        type: 'buy',
        amount: 50000,
        profitLoss: 5000,
        fees: 500,
        riskScore: 'high',
        status: 'active',
        trader: 'John Smith',
        patterns: ['High Stakes'],
        symbol: 'IND-AUS-FINAL',
        price: 2.5,
        quantity: 20000,
        side: 'buy',
        executionTime: '2024-03-20 15:30:00',
        orderType: 'market'
      }
    ],
    closedTrades: []
  },
  {
    id: 'USR002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    joinDate: '2024-02-01',
    tradingVolume: 789000,
    riskLevel: 'critical',
    status: 'suspended',
    lastLogin: '2024-03-20 15:45:00',
    trades: [
      {
        id: 'TRD003',
        time: '2024-03-20 15:30:00',
        symbol: 'IPL Winner 2024',
        side: 'sell',
        type: 'market',
        price: 66000,
        quantity: 1.2,
        total: 79200,
        status: 'completed'
      }
    ],
    totalTrades: 89,
    successRate: 45,
    averageTradeSize: 25000,
    profitLoss: -15000,
    mostTradedPair: 'IPL Matches',
    riskPatterns: ['Price manipulation', 'Multiple account trading'],
    dailyStats: {
      volume: 450000,
      tradeCount: 35,
      winRate: 40
    },
    activeTrades: [],
    closedTrades: [
      {
        id: 'CT001',
        date: '2024-03-19',
        event: 'RCB vs CSK',
        eventType: 'sports',
        prediction: 'CSK Win',
        type: 'sell',
        amount: 30000,
        profitLoss: -8000,
        fees: 300,
        riskScore: 'critical',
        status: 'closed',
        trader: 'Sarah Johnson',
        patterns: ['Large Loss'],
        symbol: 'RCB-CSK',
        price: 1.8,
        quantity: 16666,
        side: 'sell',
        executionTime: '2024-03-19 20:00:00',
        orderType: 'market'
      }
    ]
  },
  {
    id: 'USR003',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    joinDate: '2023-12-10',
    tradingVolume: 456000,
    riskLevel: 'low',
    status: 'active',
    lastLogin: '2024-03-20 16:00:00',
    trades: [
      {
        id: 'TRD004',
        time: '2024-03-20 15:45:00',
        symbol: 'World Cup Semi-Final',
        side: 'buy',
        type: 'limit',
        price: 125,
        quantity: 100,
        total: 12500,
        status: 'completed'
      }
    ],
    totalTrades: 234,
    successRate: 82,
    averageTradeSize: 8000,
    profitLoss: 45000,
    mostTradedPair: 'International Cricket',
    riskPatterns: [],
    dailyStats: {
      volume: 150000,
      tradeCount: 15,
      winRate: 85
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR004',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    joinDate: '2024-01-20',
    tradingVolume: 567000,
    riskLevel: 'medium',
    status: 'active',
    lastLogin: '2024-03-20 16:15:00',
    trades: [
      {
        id: 'TRD005',
        time: '2024-03-20 16:00:00',
        symbol: 'FIFA World Cup Final',
        side: 'buy',
        type: 'market',
        price: 3600,
        quantity: 3,
        total: 10800,
        status: 'completed'
      }
    ],
    totalTrades: 167,
    successRate: 65,
    averageTradeSize: 12000,
    profitLoss: 18000,
    mostTradedPair: 'Football Events',
    riskPatterns: ['Frequent small trades'],
    dailyStats: {
      volume: 200000,
      tradeCount: 20,
      winRate: 60
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR005',
    name: 'Alex Thompson',
    email: 'alex.t@example.com',
    joinDate: '2024-02-15',
    tradingVolume: 345000,
    riskLevel: 'high',
    status: 'under_review',
    lastLogin: '2024-03-20 16:30:00',
    trades: [
      {
        id: 'TRD006',
        time: '2024-03-20 16:15:00',
        symbol: 'Premier League Winner',
        side: 'sell',
        type: 'market',
        price: 65500,
        quantity: 0.8,
        total: 52400,
        status: 'pending'
      }
    ],
    totalTrades: 78,
    successRate: 55,
    averageTradeSize: 18000,
    profitLoss: -8000,
    mostTradedPair: 'Football Events',
    riskPatterns: ['Unusual trading hours', 'Large position sizes'],
    dailyStats: {
      volume: 300000,
      tradeCount: 28,
      winRate: 48
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR006',
    name: 'Raj Patel',
    email: 'raj.p@example.com',
    joinDate: '2024-01-05',
    tradingVolume: 890000,
    riskLevel: 'medium',
    status: 'active',
    lastLogin: '2024-03-20 17:00:00',
    trades: [
      {
        id: 'TRD007',
        time: '2024-03-20 16:45:00',
        symbol: 'IPL Opening Match',
        side: 'buy',
        type: 'market',
        price: 2500,
        quantity: 10,
        total: 25000,
        status: 'completed'
      }
    ],
    totalTrades: 145,
    successRate: 70,
    averageTradeSize: 20000,
    profitLoss: 35000,
    mostTradedPair: 'Cricket Events',
    riskPatterns: ['Moderate volume'],
    dailyStats: {
      volume: 180000,
      tradeCount: 18,
      winRate: 75
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR007',
    name: 'Lisa Wong',
    email: 'lisa.w@example.com',
    joinDate: '2024-02-20',
    tradingVolume: 678000,
    riskLevel: 'low',
    status: 'active',
    lastLogin: '2024-03-20 17:15:00',
    trades: [
      {
        id: 'TRD008',
        time: '2024-03-20 17:00:00',
        symbol: 'Tennis Grand Slam',
        side: 'buy',
        type: 'limit',
        price: 1800,
        quantity: 5,
        total: 9000,
        status: 'completed'
      }
    ],
    totalTrades: 92,
    successRate: 78,
    averageTradeSize: 10000,
    profitLoss: 28000,
    mostTradedPair: 'Tennis Events',
    riskPatterns: ['Conservative trading'],
    dailyStats: {
      volume: 120000,
      tradeCount: 12,
      winRate: 80
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR008',
    name: 'David Miller',
    email: 'd.miller@example.com',
    joinDate: '2024-01-10',
    tradingVolume: 432000,
    riskLevel: 'critical',
    status: 'suspended',
    lastLogin: '2024-03-20 17:30:00',
    trades: [
      {
        id: 'TRD009',
        time: '2024-03-20 17:15:00',
        symbol: 'NBA Finals',
        side: 'sell',
        type: 'market',
        price: 4500,
        quantity: 8,
        total: 36000,
        status: 'failed'
      }
    ],
    totalTrades: 67,
    successRate: 35,
    averageTradeSize: 30000,
    profitLoss: -45000,
    mostTradedPair: 'Basketball Events',
    riskPatterns: ['Excessive losses', 'Pattern day trading'],
    dailyStats: {
      volume: 350000,
      tradeCount: 40,
      winRate: 30
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR009',
    name: 'Priya Sharma',
    email: 'p.sharma@example.com',
    joinDate: '2024-02-25',
    tradingVolume: 567000,
    riskLevel: 'medium',
    status: 'active',
    lastLogin: '2024-03-20 18:00:00',
    trades: [
      {
        id: 'TRD010',
        time: '2024-03-20 17:45:00',
        symbol: 'IPL 2024 - MI vs RCB',
        side: 'buy',
        type: 'market',
        price: 2800,
        quantity: 15,
        total: 42000,
        status: 'completed'
      }
    ],
    totalTrades: 112,
    successRate: 72,
    averageTradeSize: 15000,
    profitLoss: 32000,
    mostTradedPair: 'IPL Events',
    riskPatterns: ['Moderate stakes'],
    dailyStats: {
      volume: 160000,
      tradeCount: 16,
      winRate: 70
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR010',
    name: 'Tom Wilson',
    email: 't.wilson@example.com',
    joinDate: '2024-01-30',
    tradingVolume: 923000,
    riskLevel: 'high',
    status: 'under_review',
    lastLogin: '2024-03-20 18:15:00',
    trades: [
      {
        id: 'TRD011',
        time: '2024-03-20 18:00:00',
        symbol: 'FIFA World Cup - Brazil vs Argentina',
        side: 'sell',
        type: 'limit',
        price: 5500,
        quantity: 12,
        total: 66000,
        status: 'pending'
      }
    ],
    totalTrades: 178,
    successRate: 48,
    averageTradeSize: 35000,
    profitLoss: -28000,
    mostTradedPair: 'Football Events',
    riskPatterns: ['High stakes', 'Frequent losses'],
    dailyStats: {
      volume: 280000,
      tradeCount: 32,
      winRate: 45
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR011',
    name: 'Arun Kumar',
    email: 'a.kumar@example.com',
    joinDate: '2024-03-01',
    tradingVolume: 345000,
    riskLevel: 'low',
    status: 'active',
    lastLogin: '2024-03-20 18:30:00',
    trades: [
      {
        id: 'TRD012',
        time: '2024-03-20 18:15:00',
        symbol: 'Asian Games - Badminton Finals',
        side: 'buy',
        type: 'market',
        price: 1200,
        quantity: 20,
        total: 24000,
        status: 'completed'
      }
    ],
    totalTrades: 45,
    successRate: 80,
    averageTradeSize: 8000,
    profitLoss: 15000,
    mostTradedPair: 'Olympic Events',
    riskPatterns: ['Conservative approach'],
    dailyStats: {
      volume: 90000,
      tradeCount: 10,
      winRate: 82
    },
    activeTrades: [],
    closedTrades: []
  },
  {
    id: 'USR012',
    name: 'Maria Garcia',
    email: 'm.garcia@example.com',
    joinDate: '2024-02-10',
    tradingVolume: 678000,
    riskLevel: 'critical',
    status: 'suspended',
    lastLogin: '2024-03-20 18:45:00',
    trades: [
      {
        id: 'TRD013',
        time: '2024-03-20 18:30:00',
        symbol: 'Tennis Grand Slam - Finals',
        side: 'sell',
        type: 'market',
        price: 4200,
        quantity: 25,
        total: 105000,
        status: 'failed'
      }
    ],
    totalTrades: 89,
    successRate: 32,
    averageTradeSize: 40000,
    profitLoss: -52000,
    mostTradedPair: 'Tennis Events',
    riskPatterns: ['Excessive leverage', 'Pattern day trading'],
    dailyStats: {
      volume: 420000,
      tradeCount: 45,
      winRate: 28
    },
    activeTrades: [],
    closedTrades: []
  }
]

export default function TradingHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedRisk, setSelectedRisk] = useState<string>('')
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<DetailedUserProfile | null>(null)
  const [showUserHistory, setShowUserHistory] = useState(false)

  const getRiskBadge = (risk: string) => {
    const styles = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
      critical: "bg-red-600 text-white animate-pulse"
    }
    const icons = {
      low: null,
      medium: <AlertTriangle className="w-4 h-4" />,
      high: <AlertOctagon className="w-4 h-4" />,
      critical: <Ban className="w-4 h-4" />
    }
    return (
      <Badge variant="outline" className={`flex items-center gap-1 ${styles[risk as keyof typeof styles]}`}>
        {icons[risk as keyof typeof icons]}
        {risk.charAt(0).toUpperCase() + risk.slice(1)}
      </Badge>
    )
  }

  const getRiskCounts = () => {
    const counts = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0
    };

    sampleUsers.forEach(user => {
      counts[user.riskLevel as keyof typeof counts]++;
    });

    return counts;
  };

  const riskCounts = getRiskCounts();

  return (
    <div className="p-6 space-y-6">
      {/* Header with Alerts */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Trading History & Risk Management</h1>
          <p className="text-gray-500">Monitor trading activities and risk patterns</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className='bg-red-500 text-white' onClick={() => {
            // Export all users data with trading history
            const exportData = sampleUsers.map(user => ({
              userId: user.id,
              name: user.name,
              email: user.email,
              joinDate: user.joinDate,
              tradingVolume: user.tradingVolume,
              riskLevel: user.riskLevel,
              status: user.status,
              profitLoss: user.profitLoss,
              successRate: user.successRate,
              dailyStats: user.dailyStats,
              trades: user.trades.map(trade => ({
                time: trade.time,
                symbol: trade.symbol,
                side: trade.side,
                type: trade.type,
                price: trade.price,
                quantity: trade.quantity,
                total: trade.total,
                status: trade.status
              }))
            }));

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `all_users_trading_history_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
          }}>
            Export All Data
          </Button>
          <Button variant="outline" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              3
            </span>
          </Button>
          <Button variant="destructive" onClick={() => setShowAlertDialog(true)}>
            <AlertOctagon className="w-4 h-4 mr-2" />
            Critical Alerts
          </Button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Low Risk Trades</p>
              <p className="text-2xl font-bold">{riskCounts.low}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Medium Risk</p>
              <p className="text-2xl font-bold">{riskCounts.medium}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">High Risk</p>
              <p className="text-2xl font-bold">{riskCounts.high}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-2xl font-bold">{riskCounts.critical}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search trades..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Trade Type" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRisk} onValueChange={setSelectedRisk}>
            <SelectTrigger>
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </Card>


      {/* Trades Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Active Events</TableHead>
            <TableHead>Today's Volume</TableHead>
            <TableHead>P/L</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.activeTrades.length}</TableCell>
              <TableCell>₹{user.dailyStats.volume.toLocaleString()}</TableCell>
              <TableCell className={user.profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                ₹{user.profitLoss.toLocaleString()}
              </TableCell>
              <TableCell>{getRiskBadge(user.riskLevel)}</TableCell>
              <TableCell>
                <Badge variant="outline" className={
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {user.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedUser(user);
                  setShowDetails(user.id);
                }}>
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Trade Details Dialog */}
      <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Trading History - {selectedUser?.name}</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => {
                if (selectedUser) {
                  const trades = selectedUser.trades;
                  const csv = trades.map(trade => 
                    `${trade.time},${trade.symbol},${trade.side},${trade.type},${trade.price},${trade.quantity},${trade.total},${trade.status}`
                  ).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedUser.name}_trades_${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                }
              }}>
                Export CSV
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6">
            {/* User Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <h5 className="text-sm text-gray-500">Total Volume</h5>
                <p className="text-2xl font-bold">₹{selectedUser?.tradingVolume.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <h5 className="text-sm text-gray-500">Net P/L</h5>
                <p className={`text-2xl font-bold ${selectedUser?.profitLoss && selectedUser.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{selectedUser?.profitLoss?.toLocaleString() ?? '0'}
                </p>
              </Card>
              <Card className="p-4">
                <h5 className="text-sm text-gray-500">Success Rate</h5>
                <p className="text-2xl font-bold">{selectedUser?.successRate}%</p>
              </Card>
            </div>

            {/* Trading History Table */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold">Trading History</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export History
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Buy Quantity</TableHead>
                    <TableHead>Buy Price (₹)</TableHead>
                    <TableHead>Sell Quantity</TableHead>
                    <TableHead>Sell Price (₹)</TableHead>
                    <TableHead>P/L (₹)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedUser?.trades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">
                        {trade.symbol}
                        <span className="block text-sm text-gray-500">{trade.time}</span>
                      </TableCell>
                      <TableCell>
                        {trade.side === 'buy' ? trade.quantity : '-'}
                      </TableCell>
                      <TableCell>
                        {trade.side === 'buy' ? `₹${trade.price.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        {trade.side === 'sell' ? trade.quantity : '-'}
                      </TableCell>
                      <TableCell>
                        {trade.side === 'sell' ? `₹${trade.price.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className={trade.total >= 0 ? "text-green-500" : "text-red-500"}>
                        ₹{(trade.total * (trade.side === 'sell' ? 1 : -1)).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          trade.status === 'completed' ? 'bg-green-100 text-green-800' :
                          trade.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {trade.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Active Events Section */}
            <div>
              <h4 className="font-semibold mb-4">Active Events</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Entry Price (₹)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Current Value (₹)</TableHead>
                    <TableHead>Unrealized P/L</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedUser?.activeTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">
                        {trade.event}
                        <span className="block text-sm text-gray-500">{trade.date}</span>
                      </TableCell>
                      <TableCell>₹{trade.price.toLocaleString()}</TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell>₹{(trade.price * trade.quantity).toLocaleString()}</TableCell>
                      <TableCell className={trade.profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                        ₹{trade.profitLoss.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(trade.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Closed Events Section */}
            <div>
              <h4 className="font-semibold mb-4">Closed Events</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Entry Price (₹)</TableHead>
                    <TableHead>Exit Price (₹)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Realized P/L</TableHead>
                    <TableHead>Close Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedUser?.closedTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">
                        {trade.event}
                        <span className="block text-sm text-gray-500">{trade.date}</span>
                      </TableCell>
                      <TableCell>₹{trade.price.toLocaleString()}</TableCell>
                      <TableCell>₹{((trade.price * trade.quantity) + trade.profitLoss).toLocaleString()}</TableCell>
                      <TableCell>{trade.quantity}</TableCell>
                      <TableCell className={trade.profitLoss >= 0 ? "text-green-500" : "text-red-500"}>
                        ₹{trade.profitLoss.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(trade.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetails(null)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* User History Analysis Dialog */}
      <Dialog open={showUserHistory} onOpenChange={setShowUserHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              User Trading Analysis - {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* User Profile Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="font-semibold">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Age</p>
                    <p className="font-semibold">Member since</p>
                    <p className="text-sm text-gray-500">{selectedUser.joinDate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Risk Level</span>
                    <div className="mt-1">
                      {getRiskBadge(selectedUser.riskLevel)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block">Status</span>
                    <div className="mt-1">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${selectedUser.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          ${selectedUser.status === 'suspended' ? 'bg-red-100 text-red-800' : ''}
                          ${selectedUser.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}
                      >
                        {selectedUser.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Today's Trading Summary */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Today's Trading Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Volume</p>
                    <p className="text-2xl font-bold">₹{selectedUser.dailyStats.volume.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Win Rate</p>
                    <p className="text-2xl font-bold text-green-500">{selectedUser.dailyStats.winRate}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Trades</p>
                    <p className="text-2xl font-bold">{selectedUser.dailyStats.tradeCount}</p>
                  </div>
                </div>
              </Card>

              {/* Today's Trades Table */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Today's Trades</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      // Implement CSV export
                      const trades = selectedUser.trades;
                      const csv = trades.map(trade => 
                        `${trade.time},${trade.symbol},${trade.side},${trade.type},${trade.price},${trade.quantity},${trade.total},${trade.status}`
                      ).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${selectedUser.name}_trades_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                    }}>
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      Export PDF
                    </Button>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Side</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedUser.trades.map((trade) => (
                      <TableRow key={trade.id} className="hover:bg-gray-50">
                        <TableCell>{trade.time}</TableCell>
                        <TableCell className="font-semibold">{trade.symbol}</TableCell>
                        <TableCell>
                          <span className={`flex items-center gap-1 ${trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                            {trade.side === 'buy' ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                            {trade.side.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="uppercase text-sm">{trade.type}</TableCell>
                        <TableCell>${trade.price.toLocaleString()}</TableCell>
                        <TableCell>{trade.quantity}</TableCell>
                        <TableCell>${trade.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            trade.status === 'completed' ? 'bg-green-100 text-green-800' :
                            trade.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {trade.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>

              {/* Trading Patterns */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Trading Pattern Analysis</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium">Rapid Transactions</p>
                      <p className="text-sm text-gray-500">Multiple trades within short intervals</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Medium Risk
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium">Unusual Volume</p>
                      <p className="text-sm text-gray-500">Trading volume 300% above average</p>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      High Risk
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Regular Trading Hours</p>
                      <p className="text-sm text-gray-500">Consistent trading schedule</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Low Risk
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Risk Indicators */}
              <Card className="p-4">
                <h4 className="font-semibold mb-4">Risk Indicators</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Volume Anomaly</span>
                      <span className="text-sm text-red-500">High Risk</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Trade Frequency</span>
                      <span className="text-sm text-yellow-500">Medium Risk</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Price Manipulation</span>
                      <span className="text-sm text-green-500">Low Risk</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Add User Profile Export */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Export Options</h4>
                  <Button variant="outline" size="sm" onClick={() => {
                    // Implement full profile export
                    const profile = {
                      ...selectedUser,
                      exportDate: new Date().toISOString(),
                      summary: {
                        totalVolume: selectedUser.dailyStats.volume,
                        tradeCount: selectedUser.dailyStats.tradeCount,
                        winRate: selectedUser.dailyStats.winRate,
                        riskLevel: selectedUser.riskLevel,
                        status: selectedUser.status
                      }
                    };
                    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedUser.name}_profile_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}>
                    Export Full Profile
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Export options include trading history, risk analysis, and user profile details.
                </p>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Critical Alerts Dialog */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertOctagon className="w-5 h-5" />
              Critical Risk Alerts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              {[1, 2, 3].map((alert) => (
                <Card key={alert} className="p-3 border-l-4 border-red-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Suspicious Trading Pattern Detected</h4>
                      <p className="text-sm text-gray-500">Multiple high-volume trades in short succession</p>
                      <div className="mt-2 flex gap-2 text-sm">
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          High Risk
                        </Badge>
                        <span className="text-gray-500">2 minutes ago</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
