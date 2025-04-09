'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchEvents, fetchCategories, setSearchQuery } from '@/store/features/eventsSlice'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, FlameIcon, SearchIcon, TrendingUpIcon } from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'

// Function to format date that can be reused
const formatDateStr = (dateString: string, isClient: boolean) => {
  if (!isClient) return '' // Prevent hydration errors with date formatting
  const date = new Date(dateString)
  return date.toLocaleString()
}

export default function EventsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [isClient, setIsClient] = useState(false)
  
  // Add fallback object for the events state
  const eventsState = useSelector((state: RootState) => state.events) || {
    events: [],
    featuredEvents: [],
    popularEvents: [],
    categories: [],
    searchQuery: '',
    filteredEvents: [],
    loading: false,
    error: null
  }
  
  const {
    events,
    featuredEvents,
    popularEvents,
    categories,
    searchQuery,
    filteredEvents,
    loading,
    error
  } = eventsState

  useEffect(() => {
    setIsClient(true)
    dispatch(fetchEvents())
    dispatch(fetchCategories())
  }, [dispatch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    return formatDateStr(dateString, isClient)
  }

  const displayEvents = searchQuery ? filteredEvents : events

  if (loading && !isClient) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <ProtectedRoute>
      {!isClient ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Events</h1>
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              {categories?.map(category => (
                <TabsTrigger key={category.id} value={category.slug}>{category.name}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all">
              <EventGrid events={displayEvents} formatDate={formatDate} />
            </TabsContent>

            <TabsContent value="featured">
              <EventGrid events={featuredEvents} formatDate={formatDate} />
            </TabsContent>

            <TabsContent value="popular">
              <EventGrid events={popularEvents} formatDate={formatDate} />
            </TabsContent>

            {categories?.map(category => (
              <TabsContent key={category.id} value={category.slug}>
                <EventGrid events={events?.filter(event => event.category === category.slug)} formatDate={formatDate} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </ProtectedRoute>
  )
}

interface EventGridProps {
  events: any[];
  formatDate: (dateString: string) => string;
}

function EventGrid({ events, formatDate }: EventGridProps) {
  if (!events || events.length === 0) {
    return <div className="text-center py-12">No events found</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <Card key={event.id} className="overflow-hidden">
          {event.image && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline">{event.category}</Badge>
              <div className="flex gap-1">
                {event.isHot && <FlameIcon size={16} className="text-red-500" />}
                {event.isPopular && <TrendingUpIcon size={16} className="text-blue-500" />}
              </div>
            </div>
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {event.description}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon size={14} className="mr-1" />
              <span>
                {formatDate(event.startDate)} - {formatDate(event.endDate)}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <div className="text-sm font-medium">
                Market Volume: ₹{event.marketVolume?.toLocaleString()}
              </div>
              <Button variant="outline" asChild>
                <Link href={`/events/${event.eventId}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 