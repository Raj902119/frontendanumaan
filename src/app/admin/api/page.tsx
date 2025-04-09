'use client'

import AdminRoute from '@/components/admin-routes'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Key,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

// Placeholder API keys
const apiKeys = [
  {
    id: 'key_1',
    name: 'Production API Key',
    key: 'sk_prod_abcdefghijklmnopqrstuvwxyz123456',
    created: '2023-12-10T10:30:00',
    lastUsed: '2024-03-21T14:15:00',
    status: 'active',
    permissions: ['read', 'write'],
  },
  {
    id: 'key_2',
    name: 'Test API Key',
    key: 'sk_test_abcdefghijklmnopqrstuvwxyz123456',
    created: '2024-01-15T08:45:00',
    lastUsed: '2024-03-20T11:30:00',
    status: 'active',
    permissions: ['read'],
  },
  {
    id: 'key_3',
    name: 'Staging API Key',
    key: 'sk_staging_abcdefghijklmnopqrstuvwxyz123456',
    created: '2024-02-05T16:20:00',
    lastUsed: '2024-03-10T09:45:00',
    status: 'revoked',
    permissions: ['read', 'write'],
  },
]

// Placeholder webhooks
const webhooks = [
  {
    id: 'webhook_1',
    name: 'Event Notification Webhook',
    url: 'https://example.com/api/anumaan-webhooks/events',
    secret: 'whsec_abcdefghijklmnopqrstuvwxyz123456',
    created: '2023-12-15T10:30:00',
    lastTriggered: '2024-03-21T08:45:00',
    status: 'active',
    events: ['event.created', 'event.updated', 'event.completed'],
  },
  {
    id: 'webhook_2',
    name: 'Transaction Webhook',
    url: 'https://example.com/api/anumaan-webhooks/transactions',
    secret: 'whsec_123456abcdefghijklmnopqrstuvwxyz',
    created: '2024-01-20T14:15:00',
    lastTriggered: '2024-03-20T15:30:00',
    status: 'active',
    events: ['transaction.created', 'transaction.updated', 'transaction.completed'],
  },
  {
    id: 'webhook_3',
    name: 'User Webhook',
    url: 'https://example.com/api/anumaan-webhooks/users',
    secret: 'whsec_zyxwvutsrqponmlkjihgfedcba654321',
    created: '2024-02-10T09:45:00',
    lastTriggered: '2024-03-15T11:30:00',
    status: 'inactive',
    events: ['user.created', 'user.updated', 'user.deleted'],
  },
]

// Webhook event types
const webhookEventTypes = [
  { id: 'event.created', name: 'Event Created', category: 'Events' },
  { id: 'event.updated', name: 'Event Updated', category: 'Events' },
  { id: 'event.completed', name: 'Event Completed', category: 'Events' },
  { id: 'transaction.created', name: 'Transaction Created', category: 'Transactions' },
  { id: 'transaction.updated', name: 'Transaction Updated', category: 'Transactions' },
  { id: 'transaction.completed', name: 'Transaction Completed', category: 'Transactions' },
  { id: 'user.created', name: 'User Created', category: 'Users' },
  { id: 'user.updated', name: 'User Updated', category: 'Users' },
  { id: 'user.deleted', name: 'User Deleted', category: 'Users' },
  { id: 'kyc.submitted', name: 'KYC Submitted', category: 'KYC' },
  { id: 'kyc.approved', name: 'KYC Approved', category: 'KYC' },
  { id: 'kyc.rejected', name: 'KYC Rejected', category: 'KYC' },
]

export default function APIPage() {
  const [activeTab, setActiveTab] = useState('api-keys')
  const [showNewApiKeyDialog, setShowNewApiKeyDialog] = useState(false)
  const [showNewWebhookDialog, setShowNewWebhookDialog] = useState(false)
  const [showKeySecret, setShowKeySecret] = useState(false)
  const [newKeyGenerated, setNewKeyGenerated] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  
  // New API key form state
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    permissions: ['read'],
  })
  
  // New webhook form state
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
  })
  
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
    if (status === 'active') {
      return <Badge variant="outline" className="border-green-400 text-green-600 bg-green-50">Active</Badge>
    } else if (status === 'inactive') {
      return <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50">Inactive</Badge>
    } else if (status === 'revoked') {
      return <Badge variant="outline" className="border-red-400 text-red-600 bg-red-50">Revoked</Badge>
    }
    return null
  }
  
  const maskApiKey = (key: string) => {
    const prefix = key.substring(0, 7)
    const suffix = key.substring(key.length - 6)
    return `${prefix}...${suffix}`
  }
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }
  
  const handleCreateApiKey = () => {
    // In a real app, this would call an API to create a new API key
    console.log('Creating new API key:', newApiKey)
    
    // Generate a fake API key for demonstration
    const generatedKey = `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`
    setNewKeyGenerated(generatedKey)
    
    // Reset form
    setNewApiKey({
      name: '',
      permissions: ['read'],
    })
  }
  
  const handleCreateWebhook = () => {
    // In a real app, this would call an API to create a new webhook
    console.log('Creating new webhook:', newWebhook)
    
    // Generate a fake webhook secret for demonstration
    // const generatedSecret = `whsec_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`
    
    // Reset form and close dialog
    setNewWebhook({
      name: '',
      url: '',
      events: [],
    })
    
    setShowNewWebhookDialog(false)
    
    // Show success message
    alert('Webhook created successfully!')
  }
  
  return (
    <AdminRoute>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">API & Webhooks</h1>
            <p className="text-muted-foreground">Manage API keys and webhook integrations</p>
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
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="settings">API Settings</TabsTrigger>
          </TabsList>
          
          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Your API Keys</h2>
              <Button onClick={() => setShowNewApiKeyDialog(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New API Key
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((apiKey) => (
                      <TableRow key={apiKey.id}>
                        <TableCell className="font-medium">{apiKey.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{maskApiKey(apiKey.key)}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {apiKey.permissions.includes('read') && (
                              <Badge variant="secondary" className="text-xs">Read</Badge>
                            )}
                            {apiKey.permissions.includes('write') && (
                              <Badge variant="secondary" className="text-xs">Write</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(apiKey.created)}</TableCell>
                        <TableCell>{formatDate(apiKey.lastUsed)}</TableCell>
                        <TableCell>{getStatusBadge(apiKey.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={apiKey.status === 'revoked'}
                              onClick={() => {
                                // In a real app, this would call an API to revoke the key
                                if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
                                  console.log('Revoking API key:', apiKey.id)
                                }
                              }}
                            >
                              Revoke
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">API Documentation</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Using API Keys</CardTitle>
                  <CardDescription>
                    Learn how to authenticate your API requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Authentication to the API is performed via HTTP Bearer Authentication. 
                    Provide your API key as the bearer token value in the Authorization header.
                  </p>
                  
                  <div className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                    <code>
                      curl https://api.anumaan.com/v1/events \<br />
                      &nbsp;&nbsp;-H "Authorization: Bearer sk_prod_abcdefghijklmnopqrstuvwxyz123456"
                    </code>
                  </div>
                  
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Security Warning</AlertTitle>
                    <AlertDescription>
                      Your API keys carry many privileges, so be sure to keep them secure! Do not share your API keys in publicly accessible areas such as GitHub, client-side code, or social media.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Your Webhooks</h2>
              <Button onClick={() => setShowNewWebhookDialog(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create New Webhook
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Triggered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-medium">{webhook.name}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {webhook.url}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">
                              {webhook.events.length} {webhook.events.length === 1 ? 'event' : 'events'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(webhook.created)}</TableCell>
                        <TableCell>{formatDate(webhook.lastTriggered)}</TableCell>
                        <TableCell>{getStatusBadge(webhook.status)}</TableCell>
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
                                  <DialogTitle>{webhook.name}</DialogTitle>
                                  <DialogDescription>
                                    Created on {formatDate(webhook.created)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Webhook URL</Label>
                                    <div className="flex items-center gap-2">
                                      <Input value={webhook.url} readOnly />
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="shrink-0"
                                        onClick={() => copyToClipboard(webhook.url)}
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm font-medium">Webhook Secret</Label>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => setShowKeySecret(!showKeySecret)}
                                      >
                                        {showKeySecret ? (
                                          <EyeOff className="h-4 w-4" />
                                        ) : (
                                          <Eye className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input 
                                        value={showKeySecret ? webhook.secret : '••••••••••••••••••••••••••••••••'} 
                                        readOnly 
                                        type={showKeySecret ? 'text' : 'password'}
                                      />
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="shrink-0"
                                        onClick={() => copyToClipboard(webhook.secret)}
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Events</Label>
                                    <div className="border rounded-md p-3 space-y-1 max-h-40 overflow-y-auto">
                                      {webhook.events.map((event) => (
                                        <div key={event} className="text-sm flex items-center gap-2">
                                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                          {event}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant={webhook.status === 'active' ? 'outline' : 'default'} 
                              size="sm"
                            >
                              {webhook.status === 'active' ? 'Disable' : 'Enable'}
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                            >
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
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Webhook Documentation</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Using Webhooks</CardTitle>
                  <CardDescription>
                    Learn how to handle webhook events from Anumaan Predictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Webhooks allow your application to receive real-time updates about events in the Anumaan platform. 
                    When an event occurs, we&apos;ll send an HTTP POST request to the endpoint you&apos;ve configured.
                  </p>
                  
                  <div className="bg-gray-100 p-3 rounded-md text-sm">
                    <h4 className="font-medium mb-2">Event Payload Example</h4>
                    <pre className="overflow-x-auto">
                      {JSON.stringify({
                        id: 'evt_123456789',
                        type: 'event.created',
                        created: 1616982376,
                        data: {
                          id: 'evt_123456789',
                          name: 'IPL 2024 Final',
                          startDate: '2024-05-26T19:30:00Z',
                          status: 'active'
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                  
                  <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Webhook Security</AlertTitle>
                    <AlertDescription>
                      To verify that webhook requests are coming from Anumaan Predictions, you should validate the signature included in the request headers.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* API Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-purple-500" />
                    API Access Controls
                  </CardTitle>
                  <CardDescription>
                    Configure security settings for your API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable API Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow external applications to access your data through the API
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">IP Restrictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Limit API access to specific IP addresses
                      </p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">
                        Maximum requests per minute: 100
                      </p>
                    </div>
                    <Select defaultValue="100">
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="100" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="500">500</SelectItem>
                        <SelectItem value="1000">1000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-500" />
                    Webhook Settings
                  </CardTitle>
                  <CardDescription>
                    Configure global webhook behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Webhooks</Label>
                      <p className="text-sm text-muted-foreground">
                        Send event notifications to configured endpoints
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Retry Failed Webhooks</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically retry webhook delivery on failure
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label className="text-base">Retry Schedule</Label>
                    <p className="text-sm text-muted-foreground">
                      Attempts: 5 (after 1min, 5min, 15min, 30min, 60min)
                    </p>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue placeholder="Select retry schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal (3 attempts)</SelectItem>
                        <SelectItem value="default">Default (5 attempts)</SelectItem>
                        <SelectItem value="aggressive">Aggressive (10 attempts)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="ml-auto flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* New API Key Dialog */}
        <Dialog open={showNewApiKeyDialog} onOpenChange={setShowNewApiKeyDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                API keys provide access to your platform&apos;s resources. Choose permissions carefully.
              </DialogDescription>
            </DialogHeader>
            {!newKeyGenerated ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="key-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="key-name"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                    className="col-span-3"
                    placeholder="e.g., My Production Key"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Permissions</Label>
                  <div className="col-span-3 space-y-2">
                    <Label className="flex items-center gap-2 font-normal">
                      <input
                        type="checkbox"
                        checked={newApiKey.permissions.includes('read')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewApiKey({ ...newApiKey, permissions: [...newApiKey.permissions, 'read'] })
                          } else {
                            setNewApiKey({ ...newApiKey, permissions: newApiKey.permissions.filter(p => p !== 'read') })
                          }
                        }}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      Read Access (Required)
                    </Label>
                    <Label className="flex items-center gap-2 font-normal">
                      <input
                        type="checkbox"
                        checked={newApiKey.permissions.includes('write')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewApiKey({ ...newApiKey, permissions: [...newApiKey.permissions, 'write'] })
                          } else {
                            setNewApiKey({ ...newApiKey, permissions: newApiKey.permissions.filter(p => p !== 'write') })
                          }
                        }}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      Write Access (Trades, deposits, etc.)
                    </Label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertTitle>API Key Created Successfully!</AlertTitle>
                  <AlertDescription>
                    Make sure to copy your API key now. You won&apos;t be able to see it again!
                  </AlertDescription>
                </Alert>
                <div className="relative">
                  <Input
                    readOnly
                    value={newKeyGenerated ? (showKeySecret ? newKeyGenerated : maskApiKey(newKeyGenerated)) : ''}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                    onClick={() => {
                      if (newKeyGenerated) {
                        copyToClipboard(newKeyGenerated)
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            <DialogFooter>
              {!newKeyGenerated ? (
                <>
                  <Button variant="outline" onClick={() => setShowNewApiKeyDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateApiKey}>Generate Key</Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    setNewKeyGenerated(null)
                    setShowNewApiKeyDialog(false)
                  }}
                >
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* New Webhook Dialog */}
        <Dialog open={showNewWebhookDialog} onOpenChange={setShowNewWebhookDialog}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Webhook</DialogTitle>
              <DialogDescription>
                Configure a new endpoint to receive notifications.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="webhook-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="webhook-name"
                  value={newWebhook.name}
                  onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Production Notifications"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="webhook-url" className="text-right">
                  URL
                </Label>
                <Input
                  id="webhook-url"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="col-span-3"
                  placeholder="https://your-server.com/webhook-handler"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Events</Label>
                <div className="col-span-3 space-y-3">
                  {Object.entries(
                    webhookEventTypes.reduce((acc, event) => {
                      if (!acc[event.category]) {
                        acc[event.category] = []
                      }
                      acc[event.category].push(event)
                      return acc
                    }, {} as Record<string, typeof webhookEventTypes>)
                  ).map(([category, events]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {events.map((event) => (
                          <Label key={event.id} className="flex items-center gap-2 font-normal">
                            <input
                              type="checkbox"
                              checked={newWebhook.events.includes(event.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewWebhook({
                                    ...newWebhook,
                                    events: [...newWebhook.events, event.id],
                                  })
                                } else {
                                  setNewWebhook({
                                    ...newWebhook,
                                    events: newWebhook.events.filter((id) => id !== event.id),
                                  })
                                }
                              }}
                              className="rounded text-blue-500 focus:ring-blue-500"
                            />
                            {event.name}
                          </Label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewWebhookDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebhook}>Create Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminRoute>
  )
} 