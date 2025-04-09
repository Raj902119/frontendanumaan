'use client'

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Eye, Filter, RotateCw, Search, XCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface KYCDocument {
  type: 'id' | 'address' | 'selfie'
  url: string
  uploadedAt: string
  expiryDate?: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  kycStatus: 'pending' | 'approved' | 'rejected' | 'expired'
  documents: KYCDocument[]
  submittedAt: string
  lastUpdated: string
}

// Add more sample users
const sampleUsers: User[] = [
  {
    id: '1001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    kycStatus: 'pending',
    documents: [{
      type: 'id',
      url: '/docs/id1.jpg',
      uploadedAt: '2024-03-26',
      status: 'pending'
    }],
    submittedAt: '2024-03-26',
    lastUpdated: '2024-03-26'
  },
  {
    id: '1002',
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '+1987654321',
    kycStatus: 'approved',
    documents: [{
      type: 'id',
      url: '/docs/id2.jpg',
      uploadedAt: '2024-03-20',
      status: 'approved'
    }],
    submittedAt: '2024-03-20',
    lastUpdated: '2024-03-21'
  },
  {
    id: '1003',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1122334455',
    kycStatus: 'rejected',
    documents: [{
      type: 'id',
      url: '/docs/id3.jpg',
      uploadedAt: '2024-03-15',
      status: 'rejected',
      rejectionReason: 'Document unclear'
    }],
    submittedAt: '2024-03-15',
    lastUpdated: '2024-03-16'
  },
  {
    id: '1004',
    name: 'Emma Davis',
    email: 'emma@example.com',
    phone: '+1567890123',
    kycStatus: 'expired',
    documents: [{
      type: 'id',
      url: '/docs/id4.jpg',
      uploadedAt: '2024-01-01',
      status: 'approved',
      expiryDate: '2024-03-01'
    }],
    submittedAt: '2024-01-01',
    lastUpdated: '2024-03-01'
  }
]

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState(sampleUsers)

  // Filter users based on active tab and search term
  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === user.kycStatus
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const handleReject = (userId: string) => {
    if (!rejectionReason.trim()) return
    
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          kycStatus: 'rejected',
          lastUpdated: new Date().toISOString().split('T')[0],
          documents: user.documents.map(doc => ({
            ...doc,
            status: 'rejected',
            rejectionReason
          }))
        }
      }
      return user
    }))

    // Close modal and reset state
    setShowRejectionModal(false)
    setRejectionReason('')
    setSelectedUser(null)
  }

  const handleApprove = (userId: string) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          kycStatus: 'approved',
          lastUpdated: new Date().toISOString().split('T')[0],
          documents: user.documents.map(doc => ({
            ...doc,
            status: 'approved'
          }))
        }
      }
      return user
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User KYC Management</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="search"
              placeholder="Search users..."
              className="pl-9 pr-3 py-2 border rounded-lg w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="pending">
            Pending
            <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 rounded-full text-xs">
              {sampleUsers.filter(u => u.kycStatus === 'pending').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            <span className="ml-2 bg-green-100 text-green-700 px-2 rounded-full text-xs">
              {sampleUsers.filter(u => u.kycStatus === 'approved').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            <span className="ml-2 bg-red-100 text-red-700 px-2 rounded-full text-xs">
              {sampleUsers.filter(u => u.kycStatus === 'rejected').length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired
            <span className="ml-2 bg-gray-100 text-gray-700 px-2 rounded-full text-xs">
              {sampleUsers.filter(u => u.kycStatus === 'expired').length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm">
                    <th className="pb-3 text-left font-medium">User</th>
                    <th className="pb-3 text-left font-medium">Documents</th>
                    <th className="pb-3 text-left font-medium">Submitted</th>
                    <th className="pb-3 text-left font-medium">Status</th>
                    <th className="pb-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-gray-500 text-xs">UserID: #{user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded" 
                            title="View ID"
                            onClick={() => {
                              setSelectedDocument(user.documents[0])
                              setShowDocumentModal(true)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <div className="text-xs text-gray-500">1 documents</div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-500">
                        2024-03-26
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.kycStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : user.kycStatus === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : user.kycStatus === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.kycStatus === 'pending' ? 'Pending Review' :
                           user.kycStatus === 'approved' ? 'Approved' :
                           user.kycStatus === 'rejected' ? 'Rejected' : 'Expired'}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button 
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            onClick={() => handleApprove(user.id)}
                            disabled={user.kycStatus !== 'pending'}
                          >
                            <CheckCircle className={`w-5 h-5 ${
                              user.kycStatus !== 'pending' ? 'opacity-50' : ''
                            }`} />
                          </button>
                          <button 
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowRejectionModal(true)
                            }}
                            disabled={user.kycStatus !== 'pending'}
                          >
                            <XCircle className={`w-5 h-5 ${
                              user.kycStatus !== 'pending' ? 'opacity-50' : ''
                            }`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        No users found in this category
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Preview Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Document Preview</h3>
              <button onClick={() => setShowDocumentModal(false)}>×</button>
            </div>
            <div className="relative h-96">
              <Image
                src={selectedDocument.url}
                alt="Document preview"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="p-2 hover:bg-gray-100 rounded">
                <RotateCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Reject KYC Verification</h3>
              <button 
                onClick={() => setShowRejectionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md h-32 resize-none"
                  placeholder="Please provide a reason for rejection..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedUser?.id || '')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  disabled={!rejectionReason.trim()}
                >
                  Reject KYC
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
