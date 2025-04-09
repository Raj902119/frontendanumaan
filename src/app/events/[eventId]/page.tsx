'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchEventById, clearEventById } from '@/store/features/eventsSlice'
import { placeOrder, clearOrderError, clearSuccessMessage } from '@/store/features/orderSlice'
import { fetchWalletBalance } from '@/store/features/walletSlice'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, Clock, Info, Users, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ProtectedRoute from '@/components/protected-route'

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  
  const { eventById: event, loading: eventLoading, error: eventError } = useSelector(
    (state: RootState) => state.events
  )
  const { balance } = useSelector((state: RootState) => state.wallet)
  const { loading: orderLoading, error: orderError, successMessage } = useSelector(
    (state: RootState) => state.order
  )
  
  const [position, setPosition] = useState<'YES' | 'NO'>('YES')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(100)
  const [useBonusAmount, setUseBonusAmount] = useState(false)
  
  useEffect(() => {
    if (params.eventId) {
      dispatch(fetchEventById(params.eventId as string))
      dispatch(fetchWalletBalance())
    }
    
    // Cleanup
    return () => {
      dispatch(clearEventById())
      dispatch(clearOrderError())
      dispatch(clearSuccessMessage())
    }
  }, [dispatch, params.eventId])
  
  const handlePositionChange = (value: string) => {
    setPosition(value as 'YES' | 'NO')
  }
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }
  
  const handlePriceChange = (value: number[]) => {
    setPrice(value[0])
  }
  
  const handlePlaceOrder = async () => {
    if (!event) return
    
    await dispatch(
      placeOrder({
        eventId: event.eventId,
        position,
        quantity,
        price,
        useBonusAmount
      })
    )
    
    // Refresh wallet balance after order placement
    dispatch(fetchWalletBalance())
  }
  
  const totalInvestment = quantity * price
  const availableBalance = balance?.availableBalance || 0
  const availableBonus = balance?.bonusAmount || 0
  
  const isOrderValid = 
    quantity > 0 && 
    price > 0 && 
    totalInvestment <= (useBonusAmount ? availableBonus : availableBalance)
  
  if (eventLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  if (eventError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{eventError}</AlertDescription>
        </Alert>
      </div>
    )
  }
  
  if (!event) {
    return <div className="p-6">Event not found</div>
  }
  
  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Back to Events
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{event.category}</Badge>
                    <Badge variant={event.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{event.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm mt-1">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Ends: {new Date(event.endDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Participants: {event.participants?.length || 0}
                      </span>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="details">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="market">Market Info</TabsTrigger>
                    </TabsList>
                    <TabsContent value="details" className="space-y-4 mt-4">
                      <div>
                        <h3 className="font-medium mb-2">Event Details</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      {event.participants && event.participants.length > 0 && (
                        <div>
                          <h3 className="font-medium mb-2">Participants</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {event.participants.map((participant, index) => (
                              <Badge key={index} variant="outline">{participant}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="market" className="space-y-4 mt-4">
                      <div>
                        <h3 className="font-medium mb-2">Market Volume</h3>
                        <p className="text-lg font-semibold">₹{event.marketVolume.toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Current Odds</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 border rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">YES</div>
                            <div className="text-lg font-semibold">
                              {event.odds?.YES ? `${(event.odds.YES * 100).toFixed(1)}%` : 'N/A'}
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">NO</div>
                            <div className="text-lg font-semibold">
                              {event.odds?.NO ? `${(event.odds.NO * 100).toFixed(1)}%` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Place Order</CardTitle>
                  <CardDescription>Buy shares in this event</CardDescription>
                </CardHeader>
                <CardContent>
                  {orderError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{orderError}</AlertDescription>
                    </Alert>
                  )}
                  
                  {successMessage && (
                    <Alert className="mb-4 bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm mb-1">Choose Position</Label>
                      <Tabs
                        defaultValue="YES"
                        value={position}
                        onValueChange={handlePositionChange}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-2">
                          <TabsTrigger value="YES">YES</TabsTrigger>
                          <TabsTrigger value="NO">NO</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    
                    <div>
                      <Label htmlFor="quantity" className="text-sm">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <Label className="text-sm">Price per Share</Label>
                        <span className="text-sm font-medium">₹{price}</span>
                      </div>
                      <Slider
                        defaultValue={[price]}
                        min={10}
                        max={1000}
                        step={10}
                        value={[price]}
                        onValueChange={handlePriceChange}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        id="useBonusAmount"
                        checked={useBonusAmount}
                        onCheckedChange={(checked) => setUseBonusAmount(checked === true)}
                      />
                      <label
                        htmlFor="useBonusAmount"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Use bonus amount (₹{availableBonus.toFixed(2)})
                      </label>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span>{quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price per Share:</span>
                        <span>₹{price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total Investment:</span>
                        <span>₹{totalInvestment.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available:</span>
                        <span>₹{(useBonusAmount ? availableBonus : availableBalance).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      disabled={!isOrderValid || orderLoading}
                      onClick={handlePlaceOrder}
                    >
                      {orderLoading ? 'Processing...' : 'Place Order'}
                    </Button>
                    
                    {totalInvestment > (useBonusAmount ? availableBonus : availableBalance) && (
                      <div className="text-sm text-red-500 flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Insufficient funds available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 