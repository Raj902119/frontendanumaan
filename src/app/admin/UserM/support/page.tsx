'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Clock, Filter, Mail, MessageSquare, Search } from 'lucide-react'
import { useState } from 'react'

interface Ticket {
  id: string
  userId: string
  userName: string
  userEmail: string
  category: 'KYC' | 'Trading' | 'Withdrawal' | 'Technical' | 'Account'
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated'
  subject: string
  description: string
  createdAt: string
  lastUpdated: string
  messages: {
    sender: 'user' | 'admin'
    message: string
    timestamp: string
    attachments?: string[]
  }[]
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
  isRead: boolean
}

interface LiveChat {
  id: string
  userId: string
  userName: string
  status: 'active' | 'waiting' | 'closed'
  messages: ChatMessage[]
  startedAt: string
}

const sampleTickets: Ticket[] = [
  {
    id: 'TKT-001',
    userId: 'USR-001',
    userName: 'John Smith',
    userEmail: 'john@example.com',
    category: 'KYC',
    priority: 'High',
    status: 'Open',
    subject: 'KYC Verification Delay',
    description: 'My KYC verification has been pending for over 48 hours.',
    createdAt: '2024-03-26 10:30',
    lastUpdated: '2024-03-26 10:30',
    messages: [
      {
        sender: 'user',
        message: 'My KYC verification has been pending for over 48 hours. Please help.',
        timestamp: '2024-03-26 10:30'
      }
    ]
  },
  {
    id: 'TKT-002',
    userId: 'USR-002',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@example.com',
    category: 'Trading',
    priority: 'Urgent',
    status: 'In Progress',
    subject: 'Unable to Close Position',
    description: 'System error preventing position closure',
    createdAt: '2024-03-26 11:15',
    lastUpdated: '2024-03-26 11:45',
    messages: [
      {
        sender: 'user',
        message: 'I cannot close my trading position due to a system error. This is urgent!',
        timestamp: '2024-03-26 11:15'
      },
      {
        sender: 'admin',
        message: 'We are looking into this issue. Can you provide your position ID?',
        timestamp: '2024-03-26 11:45'
      }
    ]
  },
  {
    id: 'TKT-003',
    userId: 'USR-003',
    userName: 'Michael Chen',
    userEmail: 'michael.c@example.com',
    category: 'Withdrawal',
    priority: 'Medium',
    status: 'Open',
    subject: 'Withdrawal Pending',
    description: 'Withdrawal stuck in pending state',
    createdAt: '2024-03-26 09:00',
    lastUpdated: '2024-03-26 09:00',
    messages: [
      {
        sender: 'user',
        message: 'My withdrawal has been pending for 24 hours. Transaction ID: WD123456',
        timestamp: '2024-03-26 09:00'
      }
    ]
  },
  {
    id: 'TKT-004',
    userId: 'USR-004',
    userName: 'Emma Wilson',
    userEmail: 'emma.w@example.com',
    category: 'Technical',
    priority: 'Low',
    status: 'Resolved',
    subject: 'Chart Loading Issue',
    description: 'Trading charts not loading properly',
    createdAt: '2024-03-25 14:20',
    lastUpdated: '2024-03-25 15:30',
    messages: [
      {
        sender: 'user',
        message: 'The trading charts are not loading on my browser.',
        timestamp: '2024-03-25 14:20'
      },
      {
        sender: 'admin',
        message: 'Please try clearing your browser cache and reload the page.',
        timestamp: '2024-03-25 14:45'
      },
      {
        sender: 'user',
        message: 'That worked! Thank you for the help.',
        timestamp: '2024-03-25 15:30'
      }
    ]
  },
  {
    id: 'TKT-005',
    userId: 'USR-005',
    userName: 'David Brown',
    userEmail: 'david.b@example.com',
    category: 'Account',
    priority: 'Urgent',
    status: 'Escalated',
    subject: 'Account Access Issues',
    description: 'Unable to access account after password reset',
    createdAt: '2024-03-26 12:00',
    lastUpdated: '2024-03-26 12:30',
    messages: [
      {
        sender: 'user',
        message: 'I cannot access my account after resetting my password. I have important open positions!',
        timestamp: '2024-03-26 12:00'
      },
      {
        sender: 'admin',
        message: 'This has been escalated to our security team. We will contact you shortly.',
        timestamp: '2024-03-26 12:30'
      }
    ]
  }
]

// Sample live chats
const initialActiveChats: LiveChat[] = [
  {
    id: 'CHAT-001',
    userId: 'USR-002',
    userName: 'Alice Brown',
    status: 'active',
    startedAt: '2024-03-26 15:45',
    messages: [
      {
        id: 'MSG-001',
        userId: 'USR-002',
        userName: 'Alice Brown',
        message: 'Hi, I need urgent help with my withdrawal',
        timestamp: '2024-03-26 15:45',
        isRead: true
      }
    ]
  },
  {
    id: 'CHAT-002',
    userId: 'USR-006',
    userName: 'Tom Wilson',
    status: 'active',
    startedAt: '2024-03-26 15:30',
    messages: [
      {
        id: 'MSG-002',
        userId: 'USR-006',
        userName: 'Tom Wilson',
        message: 'Hello, I have a question about margin requirements',
        timestamp: '2024-03-26 15:30',
        isRead: false
      }
    ]
  },
  {
    id: 'CHAT-003',
    userId: 'USR-007',
    userName: 'Lisa Chen',
    status: 'waiting',
    startedAt: '2024-03-26 15:50',
    messages: [
      {
        id: 'MSG-003',
        userId: 'USR-007',
        userName: 'Lisa Chen',
        message: 'Need help with KYC document upload',
        timestamp: '2024-03-26 15:50',
        isRead: false
      }
    ]
  }
]

export default function SupportManagement() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showTicketDetails, setShowTicketDetails] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [showLiveChat, setShowLiveChat] = useState(false)
  const [activeChats, setActiveChats] = useState<LiveChat[]>(initialActiveChats)
  const [selectedChat, setSelectedChat] = useState<LiveChat | null>(null)
  const [chatMessage, setChatMessage] = useState('')

  // Add new state for filters and management
  const [categoryFilter, setCategoryFilter] = useState<Ticket['category'] | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Ticket['priority'] | 'all'>('all')
  const [showUrgentOnly, setShowUrgentOnly] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets)

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery.toLowerCase() === '' || 
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    const matchesUrgent = !showUrgentOnly || ticket.priority === 'Urgent'

    return matchesSearch && matchesCategory && matchesPriority && matchesUrgent
  })

  // Calculate ticket statistics
  const ticketStats = tickets.reduce((acc, ticket) => {
    acc.total++
    if (ticket.status === 'Open') acc.open++
    if (ticket.priority === 'Urgent') acc.urgent++
    if (ticket.status === 'Resolved') acc.resolved++
    return acc
  }, { total: 0, open: 0, urgent: 0, resolved: 0 })

  // Handle ticket status changes
  const handleStatusChange = (ticketId: string, newStatus: Ticket['status']) => {
    setTickets(prevTickets => prevTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus,
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      }
      return ticket
    }))
  }

  // Handle ticket reply
  const handleTicketReply = (ticketId: string, message: string) => {
    if (!message.trim()) return

    setTickets(prevTickets => prevTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          messages: [
            ...ticket.messages,
            {
              sender: 'admin',
              message: message.trim(),
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
            }
          ],
          status: 'In Progress',
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      }
      return ticket
    }))

    setReplyMessage('')
  }

  // Handle live chat message
  const handleChatMessage = (chatId: string, message: string) => {
    if (!message.trim()) return

    setActiveChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: `MSG-${Date.now()}`,
              userId: 'ADMIN',
              userName: 'Support Agent',
              message: message.trim(),
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
              isRead: true
            }
          ]
        }
      }
      return chat
    }))

    setChatMessage('')
  }

  // Handle ticket escalation
  const handleEscalation = (ticketId: string) => {
    setTickets(prevTickets => prevTickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: 'Escalated',
          priority: 'Urgent',
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      }
      return ticket
    }))
    setShowTicketDetails(false)
  }

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-700'
      case 'High': return 'bg-orange-100 text-orange-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
    }
  }

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700'
      case 'In Progress': return 'bg-yellow-100 text-yellow-700'
      case 'Resolved': return 'bg-green-100 text-green-700'
      case 'Escalated': return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support Management</h1>
        <p className="text-gray-500 mt-1">Handle user support tickets and inquiries</p>
      </div>

      {/* Support Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Open Tickets</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{ticketStats.open}</div>
          <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {ticketStats.urgent} require attention
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Urgent Tickets</div>
          <div className="text-2xl font-bold text-red-600 mt-1">3</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Average Response Time</div>
          <div className="text-2xl font-bold text-green-600 mt-1">2.5h</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Resolution Rate</div>
          <div className="text-2xl font-bold text-green-600 mt-1">95%</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="search"
            placeholder="Search tickets by ID, user, or subject"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
              categoryFilter !== 'all' ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
            }`}
            onClick={() => setCategoryFilter(categoryFilter === 'all' ? 'KYC' : 'all')}
          >
            <Filter className="w-4 h-4" /> 
            {categoryFilter === 'all' ? 'Filter by Category' : `Category: ${categoryFilter}`}
          </button>
          <button 
            className={`px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
              showUrgentOnly ? 'bg-red-50 border-red-200 text-red-600' : ''
            }`}
            onClick={() => setShowUrgentOnly(!showUrgentOnly)}
          >
            <AlertTriangle className="w-4 h-4" /> 
            {showUrgentOnly ? 'Showing Urgent Only' : 'Show Urgent Only'}
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Ticket Details</th>
              <th className="text-left py-3 px-4">Category</th>
              <th className="text-left py-3 px-4">Priority</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Last Updated</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} className="border-b">
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium">{ticket.subject}</div>
                    <div className="text-sm text-gray-500">
                      {ticket.userName} - {ticket.id}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                    {ticket.category}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">
                  {ticket.lastUpdated}
                </td>
                <td className="py-4 px-4">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setShowTicketDetails(true)
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDetails} onOpenChange={setShowTicketDetails}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {/* Ticket Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="font-medium">{selectedTicket?.subject}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  Ticket ID: {selectedTicket?.id}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
                  onClick={() => {
                    if (selectedTicket) {
                      handleStatusChange(selectedTicket.id, 'Resolved')
                      setShowTicketDetails(false)
                    }
                  }}
                >
                  Mark as Resolved
                </button>
                <button 
                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => {
                    if (selectedTicket) {
                      handleEscalation(selectedTicket.id)
                    }
                  }}
                >
                  Escalate
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">User Details</div>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedTicket?.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedTicket?.userEmail}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Ticket Info</div>
                  <div className="mt-1 space-y-1">
                    <div>Category: {selectedTicket?.category}</div>
                    <div>Created: {selectedTicket?.createdAt}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              <div className="text-sm font-medium">Conversation</div>
              <div className="max-h-[300px] overflow-y-auto space-y-4">
                {selectedTicket?.messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-lg ${
                      msg.sender === 'user' ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">
                        {msg.sender === 'user' ? selectedTicket.userName : 'Support Agent'}
                      </span>
                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm mt-2">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Box */}
            <div className="border-t pt-4">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply..."
                className="w-full px-3 py-2 border rounded-lg h-32 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <button className="text-gray-500 text-sm hover:text-gray-700">
                  Attach Files
                </button>
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    if (selectedTicket && replyMessage) {
                      handleTicketReply(selectedTicket.id, replyMessage)
                    }
                  }}
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Live Chat Panel */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end">
        <button
          onClick={() => setShowLiveChat(!showLiveChat)}
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 mb-2"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {showLiveChat && (
          <div className="bg-white rounded-lg shadow-xl border w-80 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Live Support</h3>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-sm text-gray-500">Online</span>
              </div>
            </div>

            <div className="h-96 flex">
              {/* Chat List */}
              <div className="w-1/2 border-r overflow-y-auto">
                {activeChats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="font-medium text-sm">{chat.userName}</div>
                    <div className="text-xs text-gray-500">
                      {chat.messages[chat.messages.length - 1]?.message.slice(0, 20)}...
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{chat.startedAt}</div>
                  </div>
                ))}
              </div>

              {/* Chat Window */}
              <div className="w-1/2 flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="p-3 border-b">
                      <div className="font-medium text-sm">{selectedChat.userName}</div>
                      <div className="text-xs text-gray-500">Active now</div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {selectedChat.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`text-sm p-2 rounded-lg max-w-[80%] ${
                            msg.userId === 'ADMIN' 
                              ? 'bg-blue-500 text-white ml-auto' 
                              : 'bg-gray-100'
                          }`}
                        >
                          {msg.message}
                          <div className="text-xs mt-1 opacity-70">
                            {msg.timestamp.split(' ')[1]}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 border-t">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 text-sm border rounded-full px-3 py-1.5"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && chatMessage) {
                              handleChatMessage(selectedChat.id, chatMessage)
                            }
                          }}
                        />
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            if (chatMessage && selectedChat) {
                              handleChatMessage(selectedChat.id, chatMessage)
                            }
                          }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    Select a chat to start messaging
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
