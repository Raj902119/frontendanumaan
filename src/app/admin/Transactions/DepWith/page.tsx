'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Calendar, Clock, CreditCard, Filter, Search } from 'lucide-react'
import { useState } from 'react'

interface Transaction {
  id: string
  userId: string
  userName: string
  type: 'deposit' | 'withdrawal'
  amount: number
  currency: string
  method: string
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  riskLevel: 'low' | 'medium' | 'high'
  createdAt: string
  lastUpdated: string
  flags?: {
    type: string
    severity: 'high' | 'critical'
    reason: string
  }[]
  timeline: {
    status: string
    timestamp: string
    note?: string
    actor?: string
  }[]
}

interface Filters {
  type: string[]
  status: string[]
  method: string[]
  amount: {
    min: number | null
    max: number | null
  }
  dateRange: {
    from: string | null
    to: string | null
  }
}

const sampleTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    userId: 'USR-001',
    userName: 'John Smith',
    type: 'deposit',
    amount: 10000,
    currency: '₹',
    method: 'UPI',
    status: 'pending',
    riskLevel: 'low',
    createdAt: '2024-03-26 10:30',
    lastUpdated: '2024-03-26 10:30',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 10:30',
        note: 'Transaction initiated by user'
      }
    ]
  },
  {
    id: 'TXN-002',
    userId: 'USR-002',
    userName: 'Sarah Johnson',
    type: 'withdrawal',
    amount: 25000,
    currency: '₹',
    method: 'NEFT',
    status: 'flagged',
    riskLevel: 'high',
    createdAt: '2024-03-26 11:15',
    lastUpdated: '2024-03-26 11:45',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 11:15',
        note: 'Withdrawal request submitted'
      },
      {
        status: 'Flagged',
        timestamp: '2024-03-26 11:45',
        note: 'Large amount withdrawal detected',
        actor: 'System'
      }
    ],
    flags: [
      {
        type: 'Large Transaction',
        severity: 'high',
        reason: 'Amount exceeds usual withdrawal pattern'
      }
    ]
  },
  {
    id: 'TXN-003',
    userId: 'USR-003',
    userName: 'Michael Chen',
    type: 'deposit',
    amount: 5000,
    currency: '₹',
    method: 'UPI',
    status: 'approved',
    riskLevel: 'low',
    createdAt: '2024-03-26 09:45',
    lastUpdated: '2024-03-26 10:00',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 09:45',
        note: 'Deposit initiated'
      },
      {
        status: 'Approved',
        timestamp: '2024-03-26 10:00',
        note: 'Transaction verified and approved',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'TXN-004',
    userId: 'USR-004',
    userName: 'Emma Wilson',
    type: 'withdrawal',
    amount: 15000,
    currency: '₹',
    method: 'IMPS',
    status: 'pending',
    riskLevel: 'medium',
    createdAt: '2024-03-26 12:30',
    lastUpdated: '2024-03-26 12:30',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 12:30',
        note: 'Withdrawal request initiated'
      }
    ],
    flags: [
      {
        type: 'Frequency Check',
        severity: 'high',
        reason: 'Multiple withdrawals within 24 hours'
      }
    ]
  },
  {
    id: 'TXN-005',
    userId: 'USR-005',
    userName: 'David Brown',
    type: 'deposit',
    amount: 50000,
    currency: '₹',
    method: 'Bank Transfer',
    status: 'flagged',
    riskLevel: 'high',
    createdAt: '2024-03-26 13:15',
    lastUpdated: '2024-03-26 13:30',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 13:15',
        note: 'Large deposit initiated'
      },
      {
        status: 'Flagged',
        timestamp: '2024-03-26 13:30',
        note: 'Unusual deposit pattern detected',
        actor: 'System'
      }
    ],
    flags: [
      {
        type: 'Unusual Pattern',
        severity: 'critical',
        reason: 'Large deposit after multiple small withdrawals'
      }
    ]
  },
  {
    id: 'TXN-006',
    userId: 'USR-006',
    userName: 'Lisa Chen',
    type: 'withdrawal',
    amount: 7500,
    currency: '₹',
    method: 'UPI',
    status: 'rejected',
    riskLevel: 'medium',
    createdAt: '2024-03-26 14:00',
    lastUpdated: '2024-03-26 14:15',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 14:00',
        note: 'Withdrawal request submitted'
      },
      {
        status: 'Rejected',
        timestamp: '2024-03-26 14:15',
        note: 'Insufficient balance',
        actor: 'System'
      }
    ]
  },
  {
    id: 'TXN-007',
    userId: 'USR-007',
    userName: 'Tom Wilson',
    type: 'deposit',
    amount: 20000,
    currency: '₹',
    method: 'UPI',
    status: 'approved',
    riskLevel: 'low',
    createdAt: '2024-03-26 15:00',
    lastUpdated: '2024-03-26 15:10',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 15:00',
        note: 'Deposit initiated'
      },
      {
        status: 'Approved',
        timestamp: '2024-03-26 15:10',
        note: 'Transaction verified',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'TXN-008',
    userId: 'USR-008',
    userName: 'James Brown',
    type: 'withdrawal',
    amount: 35000,
    currency: '₹',
    method: 'NEFT',
    status: 'pending',
    riskLevel: 'high',
    createdAt: '2024-03-26 15:30',
    lastUpdated: '2024-03-26 15:30',
    timeline: [
      {
        status: 'Initiated',
        timestamp: '2024-03-26 15:30',
        note: 'Large withdrawal request'
      }
    ],
    flags: [
      {
        type: 'Amount Verification',
        severity: 'high',
        reason: 'Large withdrawal requires additional verification'
      }
    ]
  }
]

export default function DepositWithdrawalManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null)
  const [showTxnDetails, setShowTxnDetails] = useState(false)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])
  const [filters, setFilters] = useState<Filters>({
    type: [],
    status: [],
    method: [],
    amount: { min: null, max: null },
    dateRange: { from: null, to: null }
  })
  const [showFilters, setShowFilters] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState({
    from: filters.dateRange.from,
    to: filters.dateRange.to
  })

  const getRiskColor = (level: Transaction['riskLevel']) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-red-100 text-red-700'
    }
  }

  const handleStatusChange = (txnId: string, newStatus: Transaction['status']) => {
    setTransactions(prevTxns => prevTxns.map(txn => {
      if (txn.id === txnId) {
        return {
          ...txn,
          status: newStatus,
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
          timeline: [
            ...txn.timeline,
            {
              status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              actor: 'Admin'
            }
          ]
        }
      }
      return txn
    }))
  }

  const handleBulkAction = (action: 'approve' | 'reject') => {
    setTransactions(prevTxns => prevTxns.map(txn => {
      if (selectedTransactions.includes(txn.id)) {
        return {
          ...txn,
          status: action === 'approve' ? 'approved' : 'rejected',
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' '),
          timeline: [
            ...txn.timeline,
            {
              status: action === 'approve' ? 'Approved' : 'Rejected',
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              actor: 'Admin',
              note: `Bulk ${action} action`
            }
          ]
        }
      }
      return txn
    }))
    setSelectedTransactions([])
  }

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.amount.toString().includes(searchQuery)

    const matchesType = filters.type.length === 0 || filters.type.includes(txn.type)
    const matchesStatus = filters.status.length === 0 || filters.status.includes(txn.status)
    const matchesMethod = filters.method.length === 0 || filters.method.includes(txn.method)
    
    const matchesAmount = (!filters.amount.min || txn.amount >= filters.amount.min) &&
      (!filters.amount.max || txn.amount <= filters.amount.max)

    const matchesDate = (!filters.dateRange.from || txn.createdAt >= filters.dateRange.from) &&
      (!filters.dateRange.to || txn.createdAt <= filters.dateRange.to)

    return matchesSearch && matchesType && matchesStatus && matchesMethod && 
      matchesAmount && matchesDate
  })

  const stats = {
    pendingRequests: transactions.filter(t => t.status === 'pending').length,
    todayDeposits: transactions
      .filter(t => t.type === 'deposit' && t.createdAt.startsWith('2024-03-26'))
      .reduce((sum, t) => sum + t.amount, 0),
    todayWithdrawals: transactions
      .filter(t => t.type === 'withdrawal' && t.createdAt.startsWith('2024-03-26'))
      .reduce((sum, t) => sum + t.amount, 0),
    flaggedTxns: transactions.filter(t => t.status === 'flagged').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Deposit & Withdrawal Management</h1>
        <p className="text-gray-500 mt-1">Review and process transaction requests</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Pending Requests</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.pendingRequests}</div>
          <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            8 require immediate attention
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Today's Deposits</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            <div className="flex items-center">
              <ArrowUpRight className="w-5 h-5" />
              ₹{stats.todayDeposits.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Today's Withdrawals</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            <div className="flex items-center">
              <ArrowDownRight className="w-5 h-5" />
              ${(stats.todayWithdrawals / 74.5).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Flagged Transactions</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{stats.flaggedTxns}</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            High risk detected
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="search"
              placeholder="Search by transaction ID, user, or amount"
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
              <span className="text-sm">
                {filters.dateRange.from?.split('-').reverse().join('/') || 'Any'} - {filters.dateRange.to?.split('-').reverse().join('/') || 'Any'}
              </span>
            ) : (
              'Date Range'
            )}
          </button>
          <button 
            onClick={() => setShowFilters(true)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {Object.values(filters).flat().filter(Boolean).length > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            )}
          </button>
        </div>
        {selectedTransactions.length > 0 && (
          <div className="flex items-center justify-between py-2">
            <div className="text-sm text-gray-600">
              {selectedTransactions.length} transactions selected
            </div>
            <div className="flex gap-2">
              <button 
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 text-green-600"
                onClick={() => handleBulkAction('approve')}
              >
                Approve Selected
              </button>
              <button 
                className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 text-red-600"
                onClick={() => handleBulkAction('reject')}
              >
                Reject Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4">
                <input 
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTransactions(transactions.map(t => t.id))
                    } else {
                      setSelectedTransactions([])
                    }
                  }}
                />
              </th>
              <th className="text-left py-3 px-4">Transaction Details</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Method</th>
              <th className="text-left py-3 px-4">Risk Level</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(txn => (
              <tr key={txn.id} className="border-b">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(txn.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions([...selectedTransactions, txn.id])
                      } else {
                        setSelectedTransactions(selectedTransactions.filter(id => id !== txn.id))
                      }
                    }}
                  />
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{txn.id}</div>
                    <div className="text-sm text-gray-500">{txn.userName}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`flex items-center gap-1 ${
                    txn.type === 'deposit' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {txn.type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
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
                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(txn.riskLevel)}`}>
                    {txn.riskLevel.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    txn.status === 'approved' ? 'bg-green-100 text-green-700' :
                    txn.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    txn.status === 'flagged' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {txn.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        setSelectedTxn(txn)
                        setShowTxnDetails(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Review
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <div className="text-sm text-gray-500">Amount Details</div>
                <div className="mt-1 space-y-1">
                  <div className="font-medium">{selectedTxn?.currency} {selectedTxn?.amount.toLocaleString()}</div>
                  <div className="text-sm">via {selectedTxn?.method}</div>
                </div>
              </div>
            </div>

            {/* Risk Flags */}
            {selectedTxn?.flags && (
              <div>
                <h3 className="font-medium mb-2 text-red-600">Risk Flags</h3>
                <div className="space-y-2">
                  {selectedTxn.flags.map((flag, idx) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-red-700">{flag.type}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          flag.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {flag.severity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-red-600 mt-1">{flag.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h3 className="font-medium mb-2">Transaction Timeline</h3>
              <div className="space-y-4">
                {selectedTxn?.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-8 flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      {idx !== (selectedTxn.timeline.length - 1) && (
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{event.status}</div>
                      <div className="text-xs text-gray-500">{event.timestamp}</div>
                      {event.note && (
                        <div className="text-sm text-gray-600 mt-1">{event.note}</div>
                      )}
                      {event.actor && (
                        <div className="text-xs text-gray-500 mt-1">by {event.actor}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                onClick={() => setShowTxnDetails(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                onClick={() => {
                  handleStatusChange(selectedTxn!.id, 'rejected')
                  setShowTxnDetails(false)
                }}
              >
                Reject
              </button>
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                onClick={() => {
                  handleStatusChange(selectedTxn!.id, 'approved')
                  setShowTxnDetails(false)
                }}
              >
                Approve
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <FilterDialog 
        open={showFilters} 
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
      />

      {/* DateRangePicker Dialog */}
      <DateRangePicker 
        open={showDatePicker} 
        onClose={() => setShowDatePicker(false)}
        dateRange={dateRange}
        setDateRange={setDateRange}
        setFilters={setFilters}
        filters={filters}
      />
    </div>
  )
}

const FilterDialog = ({ 
  open, 
  onClose,
  filters,
  setFilters 
}: { 
  open: boolean
  onClose: () => void
  filters: Filters
  setFilters: (filters: Filters) => void
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md bg-white">
      <DialogHeader>
        <DialogTitle>Filter Transactions</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="text-sm font-medium text-gray-700">Transaction Type</label>
          <div className="mt-2 space-y-2">
            {['All', 'Deposit', 'Withdrawal'].map(type => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type.toLowerCase())}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({...filters, type: [...filters.type, type.toLowerCase()]})
                    } else {
                      setFilters({...filters, type: filters.type.filter(t => t !== type.toLowerCase())})
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="text-sm font-medium text-gray-700">Payment Method</label>
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
                <span className="text-sm text-gray-600">{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Amount Range */}
        <div>
          <label className="text-sm font-medium text-gray-700">Amount Range (₹)</label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="Min"
                value={filters.amount.min || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  amount: { ...filters.amount, min: Number(e.target.value) || null }
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                value={filters.amount.max || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  amount: { ...filters.amount, max: Number(e.target.value) || null }
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm font-medium text-gray-700">Date Range</label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                value={filters.dateRange.from || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, from: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <input
                type="date"
                value={filters.dateRange.to || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, to: e.target.value }
                })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => {
              setFilters({
                type: [],
                status: [],
                method: [],
                amount: { min: null, max: null },
                dateRange: { from: null, to: null }
              })
            }}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

const DateRangePicker = ({ 
  open, 
  onClose,
  dateRange,
  setDateRange,
  setFilters,
  filters
}: { 
  open: boolean
  onClose: () => void
  dateRange: { from: string | null; to: string | null }
  setDateRange: (range: { from: string | null; to: string | null }) => void
  setFilters: (filters: Filters) => void
  filters: Filters
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md bg-white">
      <DialogHeader>
        <DialogTitle>Select Date Range</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">From</label>
          <input
            type="date"
            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
            value={dateRange.from || ''}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">To</label>
          <input
            type="date"
            className="mt-1 w-full px-3 py-2 border rounded-lg text-sm"
            value={dateRange.to || ''}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => {
              setDateRange({ from: null, to: null })
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
            onClick={() => {
              setFilters({
                ...filters,
                dateRange: dateRange
              })
              onClose()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

