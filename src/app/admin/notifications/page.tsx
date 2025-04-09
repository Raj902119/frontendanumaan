'use client'

import AdminRoute from '@/components/admin-routes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Bell,
  Eye,
  Filter,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

// Placeholder notification templates
const notificationTemplates = [
  {
    id: 'TEMPLATE-1',
    name: 'Welcome Message',
    subject: 'Welcome to Anumaan Predictions!',
    content: 'Thank you for joining Anumaan Predictions. Start exploring events and making predictions today!',
  },
  {
    id: 'TEMPLATE-2',
    name: 'New Event Alert',
    subject: 'New Event: {eventName} is now live!',
    content: 'A new event {eventName} is now available for predictions. Check it out before it ends on {eventEndDate}.',
  },
  {
    id: 'TEMPLATE-3',
    name: 'KYC Approval',
    subject: 'Your KYC verification has been approved',
    content: 'Congratulations! Your KYC verification has been successfully approved. You now have full access to all platform features.',
  },
  {
    id: 'TEMPLATE-4',
    name: 'KYC Rejection',
    subject: 'Your KYC verification needs attention',
    content: 'Your KYC verification could not be approved due to: {rejectionReason}. Please update your submission.',
  },
  {
    id: 'TEMPLATE-5',
    name: 'Deposit Confirmation',
    subject: 'Deposit Confirmation #{transactionId}',
    content: 'Your deposit of {amount} has been successfully processed and added to your account balance.',
  },
]

// Placeholder notification history
const notificationHistory = [
  {
    id: 'NOTIF-1001',
    title: 'Welcome Message',
    content: 'Thank you for joining Anumaan Predictions. Start exploring events and making predictions today!',
    sentAt: '2024-03-20T10:30:00',
    sentTo: 'All Users',
    recipients: 5432,
    openRate: 68,
    status: 'sent',
  },
  {
    id: 'NOTIF-1002',
    title: 'New IPL 2024 Events',
    content: 'IPL 2024 events are now live! Place your predictions for all 74 matches of the tournament.',
    sentAt: '2024-03-18T14:15:00',
    sentTo: 'Active Users',
    recipients: 3210,
    openRate: 72,
    status: 'sent',
  },
  {
    id: 'NOTIF-1003',
    title: 'KYC Reminder',
    content: 'Complete your KYC verification to unlock all platform features and withdraw your winnings.',
    sentAt: '2024-03-15T09:45:00',
    sentTo: 'Unverified Users',
    recipients: 845,
    openRate: 53,
    status: 'sent',
  },
  {
    id: 'NOTIF-1004',
    title: 'System Maintenance',
    content: 'The platform will be undergoing scheduled maintenance on March 25th from 2 AM to 4 AM IST.',
    sentAt: '2024-03-22T18:30:00',
    sentTo: 'All Users',
    recipients: 5432,
    openRate: 0,
    status: 'scheduled',
  },
]

interface NotificationFilter {
  status: 'all' | 'sent' | 'scheduled'
  audience: string
  search: string
  dateRange: string
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('history')
  const [filters, setFilters] = useState<NotificationFilter>({
    status: 'all',
    audience: 'all',
    search: '',
    dateRange: 'all',
  })
  const [filteredHistory, setFilteredHistory] = useState(notificationHistory)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<typeof notificationTemplates[0] | null>(null)
  
  // New notification form state
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    audience: 'all-users',
    schedule: 'now',
    scheduledDate: '',
    scheduledTime: '',
  })
  
  // Apply filters
  const refreshData = () => {
    setRefreshing(true)
    // In a real app, this would fetch fresh data from the API
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  const getStatusBadge = (status: string) => {
    if (status === 'sent') {
      return <Badge variant="outline" className="border-green-400 text-green-600 bg-green-50">Sent</Badge>
    } else if (status === 'scheduled') {
      return <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50">Scheduled</Badge>
    } else if (status === 'failed') {
      return <Badge variant="outline" className="border-red-400 text-red-600 bg-red-50">Failed</Badge>
    }
    return null
  }
  
  const handleTemplateSelect = (template: typeof notificationTemplates[0]) => {
    setNewNotification({
      ...newNotification,
      title: template.subject,
      content: template.content
    })
    setSelectedTemplate(template)
  }
  
  const handleSendNotification = () => {
    // In a real app, this would call an API to send or schedule the notification
    console.log('Sending notification:', newNotification)
    
    // Reset form after sending
    setNewNotification({
      title: '',
      content: '',
      audience: 'all-users',
      schedule: 'now',
      scheduledDate: '',
      scheduledTime: '',
    })
    
    setActiveTab('history')
    
    // Show success message or toast notification
    alert('Notification has been sent/scheduled successfully!')
  }
  
  return (
    <AdminRoute>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Manage system notifications and announcements</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={refreshData} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setActiveTab('create')} 
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              New Notification
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="history">
              Notification History
            </TabsTrigger>
            <TabsTrigger value="create">
              Create Notification
            </TabsTrigger>
            <TabsTrigger value="templates">
              Notification Templates
            </TabsTrigger>
          </TabsList>
          
          {/* Notification History Tab */}
          <TabsContent value="history">
            <Card className="mb-6">
              <CardHeader className="py-4">
                <CardTitle className="text-base font-medium flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Select 
                      value={filters.status}
                      onValueChange={(value: any) => setFilters({...filters, status: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select 
                      value={filters.audience}
                      onValueChange={(value) => setFilters({...filters, audience: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Audiences</SelectItem>
                        <SelectItem value="all-users">All Users</SelectItem>
                        <SelectItem value="active-users">Active Users</SelectItem>
                        <SelectItem value="inactive-users">Inactive Users</SelectItem>
                        <SelectItem value="unverified-users">Unverified Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select 
                      value={filters.dateRange}
                      onValueChange={(value) => setFilters({...filters, dateRange: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="this-week">This Week</SelectItem>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="this-month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search notifications..."
                        className="pl-8"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Sent To</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Open Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notificationHistory.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.id}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={notification.title}>
                            {notification.title}
                          </div>
                        </TableCell>
                        <TableCell>{notification.sentTo}</TableCell>
                        <TableCell>{notification.recipients.toLocaleString()}</TableCell>
                        <TableCell>
                          {notification.status === 'scheduled' 
                            ? <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50">Scheduled</Badge>
                            : formatDate(notification.sentAt)
                          }
                        </TableCell>
                        <TableCell>
                          {notification.status === 'scheduled' 
                            ? '-'
                            : `${notification.openRate}%`
                          }
                        </TableCell>
                        <TableCell>{getStatusBadge(notification.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>{notification.title}</DialogTitle>
                                  <DialogDescription>
                                    Sent to {notification.sentTo} on {formatDate(notification.sentAt)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 border rounded-md p-4 bg-gray-50">
                                  <p>{notification.content}</p>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Recipients</p>
                                    <p className="text-sm text-gray-500">{notification.recipients.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Open Rate</p>
                                    <p className="text-sm text-gray-500">
                                      {notification.status === 'scheduled' ? 'Not sent yet' : `${notification.openRate}%`}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            {notification.status === 'scheduled' && (
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Create Notification Tab */}
          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-blue-500" />
                      Create New Notification
                    </CardTitle>
                    <CardDescription>
                      Send announcements and important updates to your users
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="notification-title" className="text-sm font-medium">
                        Notification Title
                      </label>
                      <Input
                        id="notification-title"
                        placeholder="e.g., New Feature Announcement"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="notification-content" className="text-sm font-medium">
                        Notification Content
                      </label>
                      <Textarea
                        id="notification-content"
                        placeholder="Enter the message you want to send to your users..."
                        rows={6}
                        value={newNotification.content}
                        onChange={(e) => setNewNotification({...newNotification, content: e.target.value})}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <label htmlFor="audience" className="text-sm font-medium">
                        Target Audience
                      </label>
                      <Select 
                        value={newNotification.audience}
                        onValueChange={(value) => setNewNotification({...newNotification, audience: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-users">All Users</SelectItem>
                          <SelectItem value="active-users">Active Users</SelectItem>
                          <SelectItem value="inactive-users">Users Inactive for 30+ Days</SelectItem>
                          <SelectItem value="unverified-users">Unverified Users</SelectItem>
                          <SelectItem value="high-value-users">High Value Users</SelectItem>
                          <SelectItem value="new-users">New Users (Last 7 Days)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        {newNotification.audience === 'all-users' && 'Will be sent to all 5,432 users'}
                        {newNotification.audience === 'active-users' && 'Will be sent to 3,210 active users'}
                        {newNotification.audience === 'inactive-users' && 'Will be sent to 1,309 inactive users'}
                        {newNotification.audience === 'unverified-users' && 'Will be sent to 845 unverified users'}
                        {newNotification.audience === 'high-value-users' && 'Will be sent to 278 high value users'}
                        {newNotification.audience === 'new-users' && 'Will be sent to 124 new users (registered in last 7 days)'}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <label className="text-sm font-medium">
                        Delivery Schedule
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="send-now" 
                            checked={newNotification.schedule === 'now'} 
                            onCheckedChange={() => setNewNotification({...newNotification, schedule: 'now'})}
                          />
                          <label
                            htmlFor="send-now"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Send immediately
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="schedule" 
                            checked={newNotification.schedule === 'scheduled'} 
                            onCheckedChange={() => setNewNotification({...newNotification, schedule: 'scheduled'})}
                          />
                          <label
                            htmlFor="schedule"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Schedule for later
                          </label>
                        </div>
                      </div>
                      
                      {newNotification.schedule === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <label htmlFor="scheduled-date" className="text-sm font-medium">
                              Date
                            </label>
                            <Input
                              id="scheduled-date"
                              type="date"
                              value={newNotification.scheduledDate}
                              onChange={(e) => setNewNotification({...newNotification, scheduledDate: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="scheduled-time" className="text-sm font-medium">
                              Time
                            </label>
                            <Input
                              id="scheduled-time"
                              type="time"
                              value={newNotification.scheduledTime}
                              onChange={(e) => setNewNotification({...newNotification, scheduledTime: e.target.value})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('history')}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSendNotification}
                      disabled={!newNotification.title || !newNotification.content}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {newNotification.schedule === 'now' ? 'Send Notification' : 'Schedule Notification'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notification Templates</CardTitle>
                    <CardDescription>Use a pre-defined template to save time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[500px] overflow-y-auto">
                      {notificationTemplates.map((template) => (
                        <div 
                          key={template.id}
                          className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <div className="font-medium">{template.name}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {template.subject}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">Preview</CardTitle>
                    <CardDescription>How your notification will appear</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {newNotification.title ? (
                      <div className="border rounded-md p-4 bg-gray-50">
                        <div className="font-medium mb-2">{newNotification.title}</div>
                        <div className="text-sm">{newNotification.content}</div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        Enter notification content to see a preview
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Templates Tab */}
          <TabsContent value="templates">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Notification Templates</CardTitle>
                    <CardDescription>
                      Manage reusable templates for common notifications
                    </CardDescription>
                  </div>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    New Template
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Content Preview</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notificationTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>{template.subject}</TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">
                              {template.content}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setNewNotification({
                                    ...newNotification,
                                    title: template.subject,
                                    content: template.content
                                  })
                                  setActiveTab('create')
                                }}
                              >
                                Use
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminRoute>
  )
} 