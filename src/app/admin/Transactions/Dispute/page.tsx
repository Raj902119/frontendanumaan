'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, FileText, Filter, Search } from 'lucide-react'
import { useState } from 'react'

interface Dispute {
  id: string
  userId: string
  userName: string
  transactionId: string
  amount: number
  currency: string
  category: 'incorrect_amount' | 'unauthorized' | 'service_issue' | 'double_charge' | 
           'refund_not_received' | 'wrong_account' | 'technical_error' | 'fraud' | 
           'chargeback' | 'other'
  status: 'pending' | 'under_review' | 'escalated' | 'resolved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  description: string
  evidence: {
    type: string
    url: string
    uploadedAt: string
    uploadedBy: 'user' | 'admin'
  }[]
  messages: {
    sender: 'user' | 'admin'
    message: string
    timestamp: string
    isRead: boolean
  }[]
  timeline: {
    status: string
    note?: string
    timestamp: string
    actor: string
  }[]
}

const sampleDisputes: Dispute[] = [
  {
    id: 'DSP-001',
    userId: 'USR-001',
    userName: 'John Smith',
    transactionId: 'TXN-001',
    amount: 25000,
    currency: '₹',
    category: 'incorrect_amount',
    status: 'under_review',
    priority: 'high',
    createdAt: '2024-03-26 10:30',
    updatedAt: '2024-03-26 14:30',
    description: 'Double charge on my account for single transaction',
    evidence: [
      {
        type: 'bank_statement',
        url: '/statements/march2024.pdf',
        uploadedAt: '2024-03-26 10:30',
        uploadedBy: 'user'
      }
    ],
    messages: [
      {
        sender: 'user',
        message: 'Please check my bank statement showing double charge',
        timestamp: '2024-03-26 10:30',
        isRead: true
      }
    ],
    timeline: [
      {
        status: 'Dispute Created',
        timestamp: '2024-03-26 10:30',
        actor: 'User'
      },
      {
        status: 'Under Review',
        note: 'Investigating with payment processor',
        timestamp: '2024-03-26 14:30',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'DSP-002',
    userId: 'USR-002',
    userName: 'Sarah Johnson',
    transactionId: 'TXN-002',
    amount: 15000,
    currency: '₹',
    category: 'unauthorized',
    status: 'escalated',
    priority: 'high',
    createdAt: '2024-03-26 09:15',
    updatedAt: '2024-03-26 11:30',
    description: 'Transaction not authorized by me',
    evidence: [],
    messages: [
      {
        sender: 'user',
        message: 'I did not authorize this transaction',
        timestamp: '2024-03-26 09:15',
        isRead: true
      },
      {
        sender: 'admin',
        message: 'We are investigating this as a priority case',
        timestamp: '2024-03-26 11:30',
        isRead: true
      }
    ],
    timeline: [
      {
        status: 'Dispute Created',
        timestamp: '2024-03-26 09:15',
        actor: 'User'
      },
      {
        status: 'Escalated',
        note: 'Potential fraud case',
        timestamp: '2024-03-26 11:30',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'DSP-003',
    userId: 'USR-003',
    userName: 'Michael Chen',
    transactionId: 'TXN-003',
    amount: 5000,
    currency: '₹',
    category: 'service_issue',
    status: 'resolved',
    priority: 'low',
    createdAt: '2024-03-25 15:45',
    updatedAt: '2024-03-26 10:00',
    description: 'Service not received after payment',
    evidence: [
      {
        type: 'screenshot',
        url: '/evidence/service_error.png',
        uploadedAt: '2024-03-25 15:45',
        uploadedBy: 'user'
      }
    ],
    messages: [
      {
        sender: 'user',
        message: 'Service not working after payment',
        timestamp: '2024-03-25 15:45',
        isRead: true
      },
      {
        sender: 'admin',
        message: 'Issue has been resolved, service activated',
        timestamp: '2024-03-26 10:00',
        isRead: true
      }
    ],
    timeline: [
      {
        status: 'Dispute Created',
        timestamp: '2024-03-25 15:45',
        actor: 'User'
      },
      {
        status: 'Resolved',
        note: 'Service activated and confirmed working',
        timestamp: '2024-03-26 10:00',
        actor: 'Admin'
      }
    ]
  },
  {
    id: 'DSP-004',
    userId: 'USR-004',
    userName: 'Emma Wilson',
    transactionId: 'TXN-004',
    amount: 7500,
    currency: '₹',
    category: 'refund_not_received',
    status: 'pending',
    priority: 'medium',
    createdAt: '2024-03-26 13:20',
    updatedAt: '2024-03-26 13:20',
    description: 'Refund not received after 7 days',
    evidence: [
      {
        type: 'refund_confirmation',
        url: '/refunds/conf123.pdf',
        uploadedAt: '2024-03-26 13:20',
        uploadedBy: 'user'
      }
    ],
    messages: [
      {
        sender: 'user',
        message: 'Still waiting for my refund to be processed',
        timestamp: '2024-03-26 13:20',
        isRead: false
      }
    ],
    timeline: [
      {
        status: 'Dispute Created',
        timestamp: '2024-03-26 13:20',
        actor: 'User'
      }
    ]
  },
  {
    id: 'DSP-005',
    userId: 'USR-005',
    userName: 'David Brown',
    transactionId: 'TXN-005',
    amount: 12000,
    currency: '₹',
    category: 'technical_error',
    status: 'rejected',
    priority: 'low',
    createdAt: '2024-03-25 16:30',
    updatedAt: '2024-03-26 09:15',
    description: 'Transaction failed but amount deducted',
    evidence: [],
    messages: [
      {
        sender: 'user',
        message: 'Transaction shows failed but money deducted',
        timestamp: '2024-03-25 16:30',
        isRead: true
      },
      {
        sender: 'admin',
        message: 'Amount has been automatically reversed',
        timestamp: '2024-03-26 09:15',
        isRead: true
      }
    ],
    timeline: [
      {
        status: 'Dispute Created',
        timestamp: '2024-03-25 16:30',
        actor: 'User'
      },
      {
        status: 'Rejected',
        note: 'Amount already reversed automatically',
        timestamp: '2024-03-26 09:15',
        actor: 'Admin'
      }
    ]
  }
]

const disputeTemplates = {
  responses: [
    {
      title: 'Request Bank Statement',
      message: 'Could you please provide your bank statement for the period covering this transaction?'
    },
    {
      title: 'Refund Initiated',
      message: 'We have initiated the refund for your transaction. It should reflect in your account within 3-5 business days.'
    },
    {
      title: 'Additional Information',
      message: 'To help us investigate this matter further, please provide additional details about the transaction.'
    }
  ],
  quickActions: [
    {
      title: 'Process Refund',
      status: 'resolved' as const,
      note: 'Refund processed as per customer request'
    },
    {
      title: 'Escalate to Finance',
      status: 'escalated' as const,
      note: 'Escalated to finance team for further review'
    },
    {
      title: 'Mark as Fraudulent',
      status: 'under_review' as const,
      note: 'Marked for fraud investigation'
    }
  ]
}

// Add FilterDialog component
const FilterDialog = ({ 
  open, 
  onClose,
  filters,
  setFilters 
}: { 
  open: boolean
  onClose: () => void
  filters: {
    priority: string[]
    status: string[]
    category: string[]
  }
  setFilters: (filters: any) => void
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md bg-white">
      <DialogHeader>
        <DialogTitle>Filter Disputes</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        {/* Priority Filter */}
        <div>
          <label className="text-sm font-medium">Priority</label>
          <div className="mt-2 space-y-2">
            {['high', 'medium', 'low'].map(priority => (
              <label key={priority} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(priority)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({...filters, priority: [...filters.priority, priority]})
                    } else {
                      setFilters({...filters, priority: filters.priority.filter(p => p !== priority)})
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm capitalize">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <div className="mt-2 space-y-2">
            {['pending', 'under_review', 'escalated', 'resolved', 'rejected'].map(status => (
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
                <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium">Category</label>
          <div className="mt-2 space-y-2">
            {[
              'incorrect_amount', 'unauthorized', 'service_issue', 'double_charge',
              'refund_not_received', 'wrong_account', 'technical_error', 'fraud',
              'chargeback', 'other'
            ].map(category => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.category.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFilters({...filters, category: [...filters.category, category]})
                    } else {
                      setFilters({...filters, category: filters.category.filter(c => c !== category)})
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-sm capitalize">{category.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => {
              setFilters({ priority: [], status: [], category: [] })
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

export default function DisputeManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [showDisputeDetails, setShowDisputeDetails] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [disputes, setDisputes] = useState<Dispute[]>(sampleDisputes)
  const [filters, setFilters] = useState({
    priority: [] as string[],
    status: [] as string[],
    category: [] as string[]
  })
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'needs_response' | 'escalated'>('all')

  const stats = {
    openDisputes: disputes.filter(d => d.status !== 'resolved' && d.status !== 'rejected').length,
    highPriority: disputes.filter(d => d.priority === 'high').length,
    underReview: disputes.filter(d => d.status === 'under_review').length,
    resolvedThisMonth: disputes.filter(d => 
      d.status === 'resolved' && 
      new Date(d.updatedAt).getMonth() === new Date().getMonth()
    ).length,
    averageResolutionTime: calculateAverageResolutionTime(disputes)
  }

  const handleFilterClick = (filter: typeof activeFilter) => {
    setActiveFilter(filter)
    // Reset all filters first
    setFilters({ priority: [], status: [], category: [] })
    
    // Then apply the selected filter
    switch (filter) {
      case 'high':
        setFilters({ priority: ['high'], status: [], category: [] })
        break
      case 'needs_response':
        setFilters({ priority: [], status: ['pending'], category: [] })
        break
      case 'escalated':
        setFilters({ priority: [], status: ['escalated'], category: [] })
        break
      default:
        // 'all' case - filters already reset above
        break
    }
  }

  const handleViewEvidence = (url: string) => {
    window.open(url, '_blank')
  }

  const getFilteredDisputes = () => {
    return disputes.filter(dispute => {
      const matchesSearch = searchQuery.toLowerCase() === '' ||
        dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.transactionId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesPriority = filters.priority.length === 0 || 
        filters.priority.includes(dispute.priority)
      const matchesStatus = filters.status.length === 0 || 
        filters.status.includes(dispute.status)
      const matchesCategory = filters.category.length === 0 || 
        filters.category.includes(dispute.category)

      return matchesSearch && matchesPriority && matchesStatus && matchesCategory
    })
  }

  const getStatusColor = (status: Dispute['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'under_review': return 'bg-blue-100 text-blue-700'
      case 'escalated': return 'bg-orange-100 text-orange-700'
      case 'resolved': return 'bg-green-100 text-green-700'
      case 'rejected': return 'bg-red-100 text-red-700'
    }
  }

  const handleSendMessage = (disputeId: string, message: string) => {
    setDisputes(prevDisputes => prevDisputes.map(dispute => {
      if (dispute.id === disputeId) {
        const updatedDispute = {
          ...dispute,
          messages: [...dispute.messages, {
            sender: 'admin' as const,
            message,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            isRead: true
          }],
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
        setSelectedDispute(updatedDispute)
        return updatedDispute
      }
      return dispute
    }))
    setReplyMessage('')
  }

  const handleStatusChange = (disputeId: string, newStatus: Dispute['status'], note?: string) => {
    setDisputes(prevDisputes => prevDisputes.map(dispute => {
      if (dispute.id === disputeId) {
        return {
          ...dispute,
          status: newStatus,
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          timeline: [...dispute.timeline, {
            status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            note: note,
            actor: 'Admin'
          }]
        }
      }
      return dispute
    }))
  }

  const handleQuickAction = (action: typeof disputeTemplates.quickActions[number]) => {
    if (!selectedDispute) return
    handleStatusChange(selectedDispute.id, action.status, action.note)
    setShowDisputeDetails(false)
  }

  const handleEvidenceUpload = (disputeId: string, files: FileList) => {
    setDisputes(prevDisputes => prevDisputes.map(dispute => {
      if (dispute.id === disputeId) {
        const newEvidence = Array.from(files).map(file => ({
          type: file.name.split('.').pop() || 'unknown',
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          uploadedBy: 'admin' as const
        }))
        return {
          ...dispute,
          evidence: [...dispute.evidence, ...newEvidence],
          updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      }
      return dispute
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dispute Management</h1>
        <p className="text-gray-500 mt-1">Handle and resolve transaction disputes</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Open Disputes</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.openDisputes}</div>
          <div className="text-xs text-red-600 flex items-center gap-1 mt-1">
            <AlertTriangle className="w-3 h-3" />
            {stats.highPriority} high priority
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Under Review</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">{stats.underReview}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Resolved This Month</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats.resolvedThisMonth}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Average Resolution Time</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">{stats.averageResolutionTime}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="search"
              placeholder="Search disputes..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeFilter === 'all' 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('all')}
          >
            All Disputes
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeFilter === 'high' 
                ? 'bg-red-50 text-red-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('high')}
          >
            High Priority
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeFilter === 'needs_response' 
                ? 'bg-yellow-50 text-yellow-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('needs_response')}
          >
            Needs Response
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded-lg ${
              activeFilter === 'escalated' 
                ? 'bg-orange-50 text-orange-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('escalated')}
          >
            Escalated
          </button>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Dispute ID</th>
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-right py-3 px-4">Amount</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Priority</th>
              <th className="text-left py-3 px-4">Last Updated</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredDisputes().map(dispute => (
              <tr 
                key={dispute.id} 
                className="border-b cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelectedDispute(dispute)
                  setShowDisputeDetails(true)
                }}
              >
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium">{dispute.id}</div>
                    <div className="text-sm text-gray-500">TXN: {dispute.transactionId}</div>
                  </div>
                </td>
                <td className="py-3 px-4">{dispute.userName}</td>
                <td className="py-3 px-4">
                  {dispute.category.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  {dispute.currency} {dispute.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(dispute.status)}`}>
                    {dispute.status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    dispute.priority === 'high' ? 'bg-red-100 text-red-700' :
                    dispute.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {dispute.priority.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{dispute.updatedAt}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-600 hover:text-blue-800">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dispute Details Dialog */}
      <Dialog open={showDisputeDetails} onOpenChange={setShowDisputeDetails}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 grid grid-cols-3 gap-6">
            {/* Main Info and Chat */}
            <div className="col-span-2 space-y-6">
              {/* Dispute Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Dispute Information</div>
                    <div className="mt-1 space-y-1">
                      <div className="font-medium">{selectedDispute?.id}</div>
                      <div className="text-sm">Transaction: {selectedDispute?.transactionId}</div>
                      <div className="text-sm text-gray-600">Created: {selectedDispute?.createdAt}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Amount in Dispute</div>
                    <div className="mt-1 space-y-1">
                      <div className="font-medium">{selectedDispute?.currency} {selectedDispute?.amount.toLocaleString()}</div>
                      <div className="text-sm">Category: {selectedDispute?.category.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Description</div>
                  <div className="mt-1 text-sm">{selectedDispute?.description}</div>
                </div>
              </div>

              {/* Chat Section */}
              <div className="border rounded-lg">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Communication</h3>
                </div>
                <div className="h-64 overflow-y-auto p-4 space-y-4">
                  {selectedDispute?.messages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : ''}`}
                    >
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'admin' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100'
                      }`}>
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs mt-1 opacity-70">{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2 mb-2">
                    <select 
                      className="text-sm border rounded-lg pl-2 pr-10 py-1.5"
                      onChange={(e) => setReplyMessage(disputeTemplates.responses[Number(e.target.value)].message)}
                    >
                      <option value="">Select Template</option>
                      {disputeTemplates.responses.map((template, idx) => (
                        <option key={idx} value={idx}>{template.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => {
                        if (selectedDispute && replyMessage.trim()) {
                          handleSendMessage(selectedDispute.id, replyMessage)
                        }
                      }}
                      disabled={!replyMessage.trim()}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  {disputeTemplates.quickActions.map((action, idx) => (
                    <button 
                      key={idx}
                      className="w-full px-3 py-2 bg-white border rounded-lg hover:bg-gray-50"
                      onClick={() => handleQuickAction(action)}
                    >
                      {action.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evidence */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Evidence</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Add Files
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedDispute?.evidence.map((evidence, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{evidence.type}</span>
                      </div>
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewEvidence(evidence.url)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-3">Timeline</h3>
                <div className="space-y-4">
                  {selectedDispute?.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-8 flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        {idx !== (selectedDispute.timeline.length - 1) && (
                          <div className="w-0.5 h-full bg-gray-200"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{event.status}</div>
                        <div className="text-xs text-gray-500">{event.timestamp}</div>
                        {event.note && (
                          <div className="text-sm text-gray-600 mt-1">{event.note}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">by {event.actor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Evidence Upload input */}
      <input
        type="file"
        multiple
        className="hidden"
        id="evidence-upload"
        onChange={(e) => {
          if (selectedDispute && e.target.files) {
            handleEvidenceUpload(selectedDispute.id, e.target.files)
          }
        }}
      />
      <button 
        onClick={() => document.getElementById('evidence-upload')?.click()}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Add Files
      </button>

      {/* Add FilterDialog */}
      <FilterDialog
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  )
}

function calculateAverageResolutionTime(disputes: Dispute[]): string {
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved')
  if (resolvedDisputes.length === 0) return '0d'

  const totalTime = resolvedDisputes.reduce((sum, dispute) => {
    const created = new Date(dispute.createdAt).getTime()
    const resolved = new Date(dispute.updatedAt).getTime()
    return sum + (resolved - created)
  }, 0)

  const averageHours = totalTime / (resolvedDisputes.length * 1000 * 60 * 60)
  return `${(averageHours / 24).toFixed(1)}d`
}
