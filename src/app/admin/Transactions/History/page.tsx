'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'
import { ArrowDownRight, ArrowUpRight, Calendar, ChevronDown, Clock, CreditCard, Download, Filter, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Line, Pie } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface Transaction {
  id: string
  userId: string
  userName: string
  type: 'deposit' | 'withdrawal' | 'fee' | 'payout' | 'adjustment'
  amount: number
  currency: string
  method: string
  status: 'completed' | 'pending' | 'failed' | 'disputed'
  createdAt: string
  notes?: string[]
  paymentDetails: {
    method: string
    reference: string
    processor: string
  }
}

const sampleTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    userId: 'USR-001',
    userName: 'John Smith',
    type: 'deposit',
    amount: 25000,
    currency: '₹',
    method: 'UPI',
    status: 'completed',
    createdAt: '2024-03-26 10:30',
    paymentDetails: {
      method: 'UPI',
      reference: 'UPI123456',
      processor: 'RazorPay'
    },
    notes: ['First deposit', 'KYC verified']
  },
  {
    id: 'TXN-002',
    userId: 'USR-002',
    userName: 'Sarah Johnson',
    type: 'withdrawal',
    amount: 15000,
    currency: '₹',
    method: 'NEFT',
    status: 'pending',
    createdAt: '2024-03-26 11:15',
    paymentDetails: {
      method: 'NEFT',
      reference: 'NEFT789012',
      processor: 'HDFC'
    },
    notes: ['Withdrawal request under review']
  },
  {
    id: 'TXN-003',
    userId: 'USR-003',
    userName: 'Michael Chen',
    type: 'deposit',
    amount: 50000,
    currency: '₹',
    method: 'Bank Transfer',
    status: 'completed',
    createdAt: '2024-03-26 09:45',
    paymentDetails: {
      method: 'Bank Transfer',
      reference: 'BANK345678',
      processor: 'ICICI'
    }
  },
  {
    id: 'TXN-004',
    userId: 'USR-004',
    userName: 'Emma Wilson',
    type: 'withdrawal',
    amount: 7500,
    currency: '₹',
    method: 'IMPS',
    status: 'failed',
    createdAt: '2024-03-26 12:30',
    paymentDetails: {
      method: 'IMPS',
      reference: 'IMPS901234',
      processor: 'SBI'
    },
    notes: ['Failed due to insufficient balance']
  },
  {
    id: 'TXN-005',
    userId: 'USR-005',
    userName: 'David Brown',
    type: 'fee',
    amount: 500,
    currency: '₹',
    method: 'Auto Debit',
    status: 'completed',
    createdAt: '2024-03-26 13:15',
    paymentDetails: {
      method: 'Auto Debit',
      reference: 'FEE567890',
      processor: 'System'
    }
  },
  {
    id: 'TXN-006',
    userId: 'USR-006',
    userName: 'Lisa Chen',
    type: 'deposit',
    amount: 100000,
    currency: '₹',
    method: 'Bank Transfer',
    status: 'disputed',
    createdAt: '2024-03-26 14:00',
    paymentDetails: {
      method: 'Bank Transfer',
      reference: 'BANK123789',
      processor: 'AXIS'
    },
    notes: ['Amount mismatch reported', 'Under investigation']
  },
  {
    id: 'TXN-007',
    userId: 'USR-007',
    userName: 'Tom Wilson',
    type: 'payout',
    amount: 35000,
    currency: '₹',
    method: 'NEFT',
    status: 'completed',
    createdAt: '2024-03-26 15:00',
    paymentDetails: {
      method: 'NEFT',
      reference: 'PAY456123',
      processor: 'YES'
    }
  },
  {
    id: 'TXN-008',
    userId: 'USR-008',
    userName: 'James Brown',
    type: 'adjustment',
    amount: 2500,
    currency: '₹',
    method: 'System',
    status: 'completed',
    createdAt: '2024-03-26 15:30',
    paymentDetails: {
      method: 'System',
      reference: 'ADJ789456',
      processor: 'System'
    },
    notes: ['Bonus adjustment', 'Approved by admin']
  },
  {
    id: 'TXN-009',
    userId: 'USR-009',
    userName: 'Priya Patel',
    type: 'deposit',
    amount: 75000,
    currency: '₹',
    method: 'UPI',
    status: 'completed',
    createdAt: '2024-03-26 16:15',
    paymentDetails: {
      method: 'UPI',
      reference: 'UPI789123',
      processor: 'PhonePe'
    },
    notes: ['Large deposit', 'KYC verified']
  },
  {
    id: 'TXN-010',
    userId: 'USR-010',
    userName: 'Alex Thompson',
    type: 'withdrawal',
    amount: 45000,
    currency: '₹',
    method: 'IMPS',
    status: 'failed',
    createdAt: '2024-03-26 16:45',
    paymentDetails: {
      method: 'IMPS',
      reference: 'IMPS456789',
      processor: 'HDFC'
    },
    notes: ['Bank server error', 'Retry recommended']
  },
  {
    id: 'TXN-011',
    userId: 'USR-011',
    userName: 'Raj Kumar',
    type: 'payout',
    amount: 120000,
    currency: '₹',
    method: 'NEFT',
    status: 'pending',
    createdAt: '2024-03-26 17:00',
    paymentDetails: {
      method: 'NEFT',
      reference: 'NEFT234567',
      processor: 'SBI'
    },
    notes: ['High value transaction', 'Additional verification needed']
  },
  {
    id: 'TXN-012',
    userId: 'USR-012',
    userName: 'Sophie Wilson',
    type: 'fee',
    amount: 1500,
    currency: '₹',
    method: 'Auto Debit',
    status: 'disputed',
    createdAt: '2024-03-26 17:30',
    paymentDetails: {
      method: 'Auto Debit',
      reference: 'FEE123456',
      processor: 'System'
    },
    notes: ['Fee dispute raised', 'Customer service contacted']
  }
]

// Sample chart data
const transactionTrends = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Deposits',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: 'rgb(34, 197, 94)',
      tension: 0.1
    },
    {
      label: 'Withdrawals',
      data: [28, 48, 40, 19, 86, 27],
      borderColor: 'rgb(239, 68, 68)',
      tension: 0.1
    }
  ]
}

const paymentMethodDistribution = {
  labels: ['UPI', 'NEFT', 'IMPS', 'Bank Transfer'],
  datasets: [{
    data: [40, 20, 25, 15],
    backgroundColor: [
      'rgb(59, 130, 246)',
      'rgb(34, 197, 94)',
      'rgb(249, 115, 22)',
      'rgb(168, 85, 247)'
    ]
  }]
}

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null)
  const [showTxnDetails, setShowTxnDetails] = useState(false)
  const [showCharts, setShowCharts] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [filters, setFilters] = useState({
    type: [] as string[],
    status: [] as string[],
    method: [] as string[],
    dateRange: {
      from: null as string | null,
      to: null as string | null
    }
  })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [activeFilter, setActiveFilter] = useState<'all' | 'deposits' | 'withdrawals' | 'fees' | 'adjustments'>('all')

  // Add stats calculation
  const stats = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, txn) => sum + txn.amount, 0),
    successRate: (transactions.filter(txn => txn.status === 'completed').length / transactions.length * 100).toFixed(1),
    disputeRate: (transactions.filter(txn => txn.status === 'disputed').length / transactions.length * 100).toFixed(1),
    monthlyGrowth: calculateMonthlyGrowth(transactions)
  }

  // Add chart data calculation
  const calculateChartData = () => {
    const monthlyData = transactions.reduce((acc, txn) => {
      const month = new Date(txn.createdAt).getMonth()
      if (!acc[month]) {
        acc[month] = { deposits: 0, withdrawals: 0 }
      }
      if (txn.type === 'deposit') {
        acc[month].deposits += txn.amount
      } else if (txn.type === 'withdrawal') {
        acc[month].withdrawals += txn.amount
      }
      return acc
    }, {} as Record<number, { deposits: number; withdrawals: number }>)

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Deposits',
          data: Object.values(monthlyData).map(d => d.deposits),
          borderColor: 'rgb(34, 197, 94)',
          tension: 0.1
        },
        {
          label: 'Withdrawals',
          data: Object.values(monthlyData).map(d => d.withdrawals),
          borderColor: 'rgb(239, 68, 68)',
          tension: 0.1
        }
      ]
    }
  }

  // Add type filter handling
  const handleTypeFilter = (type: typeof activeFilter) => {
    setActiveFilter(type)
    if (type === 'all') {
      setFilters({ ...filters, type: [] })
    } else {
      setFilters({ ...filters, type: [type.slice(0, -1)] }) // Remove 's' from plural
    }
  }

  // Add note functionality
  const [newNote, setNewNote] = useState('')
  const handleAddNote = (txnId: string) => {
    if (!newNote.trim()) return
    setTransactions(prevTxns => prevTxns.map(txn => {
      if (txn.id === txnId) {
        return {
          ...txn,
          notes: [...(txn.notes || []), newNote]
        }
      }
      return txn
    }))
    setNewNote('')
  }

  // Add export functionality
  const handleExportDetails = (txn: Transaction) => {
    const data = {
      ...txn,
      paymentDetails: {
        ...txn.paymentDetails,
        processor: txn.paymentDetails.processor
      }
    }
    const json = JSON.stringify(data, null, 2)
    downloadFile(json, `transaction-${txn.id}.json`, 'application/json')
  }

  // Add filter dialog component
  const FilterDialog = ({ 
    open, 
    onClose 
  }: { 
    open: boolean
    onClose: () => void 
  }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Filter Transactions</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Transaction Type */}
          <div>
            <label className="text-sm font-medium">Transaction Type</label>
            <div className="mt-2 space-y-2">
              {['deposit', 'withdrawal', 'fee', 'payout', 'adjustment'].map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.type.includes(type)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({...filters, type: [...filters.type, type]})
                      } else {
                        setFilters({...filters, type: filters.type.filter(t => t !== type)})
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <div className="mt-2 space-y-2">
              {['completed', 'pending', 'failed', 'disputed'].map(status => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({...filters, status: [...filters.status, status]})
                      } else {
                        setFilters({...filters, status: filters.status.filter(s => s !== status)})
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <div className="mt-2 space-y-2">
              {['UPI', 'NEFT', 'IMPS', 'Bank Transfer'].map(method => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.method.includes(method)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilters({...filters, method: [...filters.method, method]})
                      } else {
                        setFilters({...filters, method: filters.method.filter(m => m !== method)})
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                setFilters({ type: [], status: [], method: [], dateRange: { from: null, to: null } })
                onClose()
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Add date picker dialog
  const DateRangePicker = ({ 
    open, 
    onClose 
  }: { 
    open: boolean
    onClose: () => void 
  }) => (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Select Date Range</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">From</label>
            <input
              type="date"
              value={filters.dateRange.from || ''}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, from: e.target.value }
              })}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="text-sm font-medium">To</label>
            <input
              type="date"
              value={filters.dateRange.to || ''}
              onChange={(e) => setFilters({
                ...filters,
                dateRange: { ...filters.dateRange, to: e.target.value }
              })}
              className="mt-1 w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                setFilters({
                  ...filters,
                  dateRange: { from: null, to: null }
                })
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Helper functions
  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    return [headers, ...rows].join('\n')
  }

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  // Filter transactions
  const getFilteredTransactions = () => {
    return transactions.filter(txn => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.userName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = filters.type.length === 0 || filters.type.includes(txn.type)
      const matchesStatus = filters.status.length === 0 || filters.status.includes(txn.status)
      const matchesMethod = filters.method.length === 0 || filters.method.includes(txn.method)
      
      const matchesDate = (!filters.dateRange.from || txn.createdAt >= filters.dateRange.from) &&
        (!filters.dateRange.to || txn.createdAt <= filters.dateRange.to)

      return matchesSearch && matchesType && matchesStatus && matchesMethod && matchesDate
    })
  }

  // Pagination
  const paginatedTransactions = getFilteredTransactions().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(getFilteredTransactions().length / itemsPerPage)

  // Helper function for monthly growth calculation
  function calculateMonthlyGrowth(transactions: Transaction[]): number {
    const currentMonth = new Date().getMonth()
    const lastMonth = currentMonth - 1

    const currentMonthTotal = transactions
      .filter(txn => new Date(txn.createdAt).getMonth() === currentMonth)
      .reduce((sum, txn) => sum + txn.amount, 0)

    const lastMonthTotal = transactions
      .filter(txn => new Date(txn.createdAt).getMonth() === lastMonth)
      .reduce((sum, txn) => sum + txn.amount, 0)

    return lastMonthTotal === 0 ? 0 : 
      Number(((currentMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1))
  }

  // Update pagination buttons with styling
  const PaginationButton = ({ 
    onClick, 
    disabled, 
    children 
  }: { 
    onClick: () => void
    disabled: boolean
    children: React.ReactNode 
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded ${
        disabled 
          ? 'bg-gray-100 text-gray-400' 
          : 'border hover:bg-gray-50 text-gray-700'
      }`}
    >
      {children}
    </button>
  )

  // Add export dropdown
  const [showExportMenu, setShowExportMenu] = useState(false)
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    const data = getFilteredTransactions().map(txn => ({
      id: txn.id,
      user: txn.userName,
      type: txn.type,
      amount: `${txn.currency} ${txn.amount}`,
      method: txn.method,
      status: txn.status,
      date: txn.createdAt
    }))

    switch (format) {
      case 'csv':
        const csv = convertToCSV(data)
        downloadFile(csv, 'transactions.csv', 'text/csv')
        break
      case 'excel':
        // Implement Excel export
        console.log('Excel export')
        break
      case 'pdf':
        // Implement PDF export
        console.log('PDF export')
        break
    }
    setShowExportMenu(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-gray-500 mt-1">View and analyze all transactions</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Total Transactions</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.totalTransactions}</div>
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            {stats.monthlyGrowth}% this month
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Total Volume</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            ₹{(stats.totalVolume / 1000000).toFixed(1)}M
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Success Rate</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{stats.successRate}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Disputed Transactions</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{stats.disputeRate}%</div>
        </div>
      </div>

      {/* Charts */}
      {showCharts && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Transaction Trends</h3>
              <button 
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setShowCharts(false)}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <Line data={calculateChartData()} options={{ responsive: true }} />
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Payment Methods</h3>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <Pie data={paymentMethodDistribution} options={{ responsive: true }} />
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="search"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowDatePicker(true)}
            className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
              (filters.dateRange.from || filters.dateRange.to) ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
            }`}
          >
            <Calendar className="w-4 h-4" />
            {filters.dateRange.from || filters.dateRange.to ? (
              <span>
                {filters.dateRange.from?.split('-').reverse().join('/') || 'Any'} - 
                {filters.dateRange.to?.split('-').reverse().join('/') || 'Any'}
              </span>
            ) : (
              'Date Range'
            )}
          </button>
          <button 
            onClick={() => setShowFilters(true)}
            className={`px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
              (filters.type.length || filters.status.length || filters.method.length) 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters {(filters.type.length + filters.status.length + filters.method.length) > 0 && 
              `(${filters.type.length + filters.status.length + filters.method.length})`}
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                <button 
                  onClick={() => handleExport('csv')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  Export as CSV
                </button>
                <button 
                  onClick={() => handleExport('excel')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  Export as Excel
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'deposits', 'withdrawals', 'fees', 'adjustments'].map(type => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type as typeof activeFilter)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                activeFilter === type 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Transaction ID</th>
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Method</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Date</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map(txn => (
              <tr 
                key={txn.id} 
                className="border-b cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedTxn(txn)
                  setShowTxnDetails(true)
                }}
              >
                <td className="py-3 px-4 font-medium">{txn.id}</td>
                <td className="py-3 px-4">{txn.userName}</td>
                <td className="py-3 px-4">
                  <span className={`flex items-center gap-1 ${
                    txn.type === 'deposit' ? 'text-green-600' : 
                    txn.type === 'withdrawal' ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {txn.type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : 
                     txn.type === 'withdrawal' ? <ArrowDownRight className="w-4 h-4" /> :
                     <Clock className="w-4 h-4" />}
                    {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  {txn.currency} {txn.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    {txn.method}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    txn.status === 'completed' ? 'bg-green-100 text-green-700' :
                    txn.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    txn.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {txn.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{txn.createdAt}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {
              Math.min(currentPage * itemsPerPage, getFilteredTransactions().length)
            } of {getFilteredTransactions().length} entries
          </div>
          <div className="flex gap-2">
            <PaginationButton
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, i, arr) => (
                <React.Fragment key={page}>
                  {i > 0 && arr[i - 1] !== page - 1 && (
                    <span className="px-2 py-1">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-50 text-blue-600'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <PaginationButton
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationButton>
          </div>
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={showTxnDetails} onOpenChange={setShowTxnDetails}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {/* Transaction Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Transaction Information</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedTxn?.id}</div>
                  <div className="text-sm">{selectedTxn?.userName}</div>
                  <div className="text-sm text-gray-600">Created: {selectedTxn?.createdAt}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Payment Details</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedTxn?.currency} {selectedTxn?.amount.toLocaleString()}</div>
                  <div className="text-sm">Method: {selectedTxn?.paymentDetails.method}</div>
                  <div className="text-sm">Reference: {selectedTxn?.paymentDetails.reference}</div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Transaction Notes</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Add Note
                </button>
              </div>
              <div className="space-y-2">
                {selectedTxn?.notes?.map((note, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm">{note}</div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button 
                    onClick={() => selectedTxn && handleAddNote(selectedTxn.id)}
                    disabled={!newNote.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => selectedTxn && handleExportDetails(selectedTxn)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Export Details
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add dialogs */}
      <FilterDialog open={showFilters} onClose={() => setShowFilters(false)} />
      <DateRangePicker open={showDatePicker} onClose={() => setShowDatePicker(false)} />
    </div>
  )
}

