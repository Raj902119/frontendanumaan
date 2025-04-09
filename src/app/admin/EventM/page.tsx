'use client'

import ClientOnly from "@/components/client-only"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EventFormDialog } from "@/components/ui/event-form-dialog"
import { Switch } from "@/components/ui/switch"
import { Tooltip } from "@/components/ui/tooltip"
import { AlertTriangle, Calendar, Clock, Edit, Eye, MoreVertical, Pause, Play, Search, StopCircle, ThumbsDown, ThumbsUp, Timer, Trash2, TrendingUp, Users } from 'lucide-react'
import Image from "next/image"
import { useState } from 'react'

// Add these type definitions
type EventStatus = 'scheduled' | 'live' | 'paused' | 'ended' | 'completed';
type EventResult = 'yes' | 'no' | null;
type EventCategory = 'sports' | 'politics' | 'entertainment' | 'finance' | 'other';

interface EventData {
  id: string
  name: string
  category: EventCategory
  startTime: string
  endTime: string
  description: string
  thumbnail: string | null
  rules: string
  yesOdds: number
  noOdds: number
  status: EventStatus
  tradingEnabled: boolean
  result?: EventResult
  participants: number
  tradingVolume: number
  engagement: number
}

// Add this component for the status badge
function StatusBadge({ status }: { status: EventStatus }) {
  const statusStyles = {
    scheduled: 'bg-blue-100 text-blue-700',
    live: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    ended: 'bg-gray-100 text-gray-700',
    completed: 'bg-purple-100 text-purple-700'
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Add this component for event details view with better styling
function EventDetailsDialog({ 
  event, 
  isOpen, 
  onClose,
  onEdit 
}: { 
  event: EventData
  isOpen: boolean
  onClose: () => void
  onEdit: (id: string) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            Event Details
          </DialogTitle>
        </DialogHeader>

        {/* Event Header */}
        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-gray-500 mt-1">{event.category}</p>
          </div>
          <StatusBadge status={event.status} />
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Event Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-medium">{event.participants.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trading Volume</span>
                  <span className="font-medium text-green-600">₹{event.tradingVolume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trading Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.tradingEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {event.tradingEnabled ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Odds Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Yes Odds</div>
                  <div className="text-lg font-semibold text-green-600">{event.yesOdds}</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <div className="text-sm text-gray-600">No Odds</div>
                  <div className="text-lg font-semibold text-red-600">{event.noOdds}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Timing & Description */}
          <div className="col-span-2 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Event Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Start Time</div>
                    <div className="text-gray-600">{new Date(event.startTime).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                    <Timer className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">End Time</div>
                    <div className="text-gray-600">{new Date(event.endTime).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Rules & Guidelines</h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {event.rules}
              </div>
            </div>

            {event.result && (
              <div className={`p-4 rounded-lg ${
                event.result === 'yes' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <h3 className="font-medium text-gray-700 mb-3">Final Result</h3>
                <div className="flex items-center gap-2">
                  {event.result === 'yes' ? (
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    event.result === 'yes' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {event.result.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              onEdit(event.id)
              onClose()
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Edit Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function EventManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all')
  const [events, setEvents] = useState<EventData[]>([
    {
      id: 'EVT1',
      name: 'IPL Final Match Prediction',
      category: 'sports',
      startTime: '2024-03-25T14:00:00',
      endTime: '2024-03-25T18:00:00',
      description: 'Predict the winner of IPL 2024 final match',
      thumbnail: '/brain.svg',
      rules: 'Standard prediction rules apply',
      yesOdds: 1.95,
      noOdds: 1.85,
      status: 'live',
      tradingEnabled: true,
      participants: 1250,
      tradingVolume: 250000,
      engagement: 85
    },
    // Add more sample events...
  ])
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null)

  const eventStats = {
    total: events.length,
    live: events.filter(e => e.status === 'live').length,
    scheduled: events.filter(e => e.status === 'scheduled').length,
    completed: events.filter(e => e.status === 'completed').length
  }

  const handleCreateEvent = (eventData: Omit<EventData, 'id' | 'status' | 'tradingEnabled'>) => {
    const newEvent: EventData = {
      ...eventData,
      id: `EVT${Date.now()}`,
      status: 'scheduled',
      tradingEnabled: false,
      participants: 0,
      tradingVolume: 0,
      engagement: 0
    }
    setEvents(prev => [newEvent, ...prev])
  }

  const handleTradingToggle = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, tradingEnabled: !event.tradingEnabled } : event
    ))
  }

  // These functions are indirectly used through the action buttons
  const handleEditEvent = (eventId: string) => {
    // Implement edit functionality
    console.log('Edit event:', eventId)
  }

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== eventId))
    }
  }

  const handleStartEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, status: 'live', tradingEnabled: true } : e
    ))
  }

  const handlePauseEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, status: 'paused', tradingEnabled: false } : e
    ))
  }

  const handleEndEvent = (eventId: string) => {
    if (confirm('Are you sure you want to end this event?')) {
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, status: 'ended', tradingEnabled: false } : e
      ))
    }
  }

  const handleDeclareResult = (eventId: string, result: EventResult) => {
    if (confirm(`Are you sure you want to declare the result as ${result?.toUpperCase()}?`)) {
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { 
          ...e, 
          status: 'completed',
          tradingEnabled: false,
          result 
        } : e
      ))
    }
  }

  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    // First check if event matches the search term
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Then check if event matches the selected category
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory

    // Return true only if both conditions are met
    return matchesSearch && matchesCategory
  })

  // Update the ActionButton component to include View Details
  function ActionButton({ event }: { event: EventData }) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-gray-100"
          onClick={() => setSelectedEvent(event)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Edit Option - Always Available */}
            <DropdownMenuItem onClick={() => handleEditEvent(event.id)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Event
            </DropdownMenuItem>

            {/* Status-based Actions */}
            {event.status === 'scheduled' && (
              <DropdownMenuItem onClick={() => handleStartEvent(event.id)}>
                <Play className="w-4 h-4 mr-2 text-green-500" />
                Start Event
              </DropdownMenuItem>
            )}

            {event.status === 'live' && (
              <>
                <DropdownMenuItem onClick={() => handlePauseEvent(event.id)}>
                  <Pause className="w-4 h-4 mr-2 text-yellow-500" />
                  Pause Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEndEvent(event.id)}>
                  <StopCircle className="w-4 h-4 mr-2 text-red-500" />
                  End Event
                </DropdownMenuItem>
              </>
            )}

            {event.status === 'paused' && (
              <DropdownMenuItem onClick={() => handleStartEvent(event.id)}>
                <Play className="w-4 h-4 mr-2 text-green-500" />
                Resume Event
              </DropdownMenuItem>
            )}

            {event.status === 'ended' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-gray-500">Declare Result</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleDeclareResult(event.id, 'yes')}>
                  <ThumbsUp className="w-4 h-4 mr-2 text-green-500" />
                  Declare YES
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeclareResult(event.id, 'no')}>
                  <ThumbsDown className="w-4 h-4 mr-2 text-red-500" />
                  Declare NO
                </DropdownMenuItem>
              </>
            )}

            {/* Delete Option - Only for scheduled or completed events */}
            {(event.status === 'scheduled' || event.status === 'completed') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <ClientOnly>
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <h3 className="text-xl font-bold">{eventStats.total}</h3>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Live Events</p>
                <h3 className="text-xl font-bold">{eventStats.live}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <h3 className="text-xl font-bold">{eventStats.scheduled}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-xl font-bold">{eventStats.completed}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border rounded-lg text-sm w-[300px]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as EventCategory | 'all')}
              className="pl-3 pr-10 py-2 border rounded-lg text-sm bg-white"
            >
              <option value="all">All Categories</option>
              <option value="sports">Sports</option>
              <option value="politics">Politics</option>
              <option value="entertainment">Entertainment</option>
              <option value="finance">Finance</option>
            </select>
          </div>
          <EventFormDialog onCreateEvent={handleCreateEvent} />
        </div>

        {/* Events Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Event Details</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Trading</th>
                  <th className="text-left p-4">Participants</th>
                  <th className="text-left p-4">Volume</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {event.thumbnail && (
                          <Image 
                            src={event.thumbnail || 'https://placehold.co/100x60'} 
                            alt={event.name} 
                            width={100}
                            height={60}
                            className="w-full h-auto rounded-md object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{event.name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(event.startTime).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {event.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={event.status} />
                    </td>
                    <td className="p-4">
                      {event.status === 'live' && (
                        <Tooltip content="Trading Status">
                          <Switch
                            checked={event.tradingEnabled}
                            onCheckedChange={() => handleTradingToggle(event.id)}
                          />
                        </Tooltip>
                      )}
                      {event.status !== 'live' && (
                        <span className="text-gray-500 text-sm">
                          {event.status === 'scheduled' ? 'Not started' : 'Ended'}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {event.participants.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium">
                        ₹{(event.tradingVolume / 1000).toFixed(1)}K
                      </div>
                    </td>
                    <td className="p-4">
                      <ActionButton event={event} />
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No events found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add this before the closing div */}
        {selectedEvent && (
          <EventDetailsDialog
            event={selectedEvent}
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={handleEditEvent}
          />
        )}
      </div>
    </ClientOnly>
  )
}

