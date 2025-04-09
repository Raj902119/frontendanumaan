'use client'

import { TimeSeriesChart } from '@/components/predictionview/TimeSeriesChart'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Drawer } from '@/components/ui/drawer'
import { TradingSection } from '@/components/prediction/TradingSection'
import { OrderBook } from '@/components/prediction/OrderBook'

function PredictionMarketContent() {
  const searchParams = useSearchParams()
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null)
  const [price, setPrice] = useState(5)
  const [quantity, setQuantity] = useState(10)
  const currentChance = 50
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [bookProfitEnabled, setBookProfitEnabled] = useState(false)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const [bookProfitPrice, setBookProfitPrice] = useState(0)
  const [stopLossPrice, setStopLossPrice] = useState(0)
  const [limitPrice, setLimitPrice] = useState(7.3)
  const [shares, setShares] = useState(0)
  const maxShares = 230
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const option = searchParams.get('option') as 'yes' | 'no'
    if (option) {
      setSelectedOption(option)
    }
  }, [searchParams])

  const handlePriceChange = (increment: boolean) => {
    setPrice(prev => increment ? prev + 1 : Math.max(1, prev - 1))
  }

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prev => increment ? prev + 1 : Math.max(1, prev - 1))
  }

  const handleLimitPriceChange = (increment: boolean) => {
    setLimitPrice(prev => {
      const newPrice = increment ? prev + 0.1 : prev - 0.1
      return Number(Math.max(0, Number(newPrice.toFixed(1))))
    })
  }

  const handleSharesChange = (increment: boolean) => {
    setShares(prev => {
      const newShares = increment ? prev + 1 : prev - 1
      return Math.max(0, Math.min(maxShares, newShares))
    })
  }

  const handleTradeClick = (type: 'yes' | 'no') => {
    setSelectedOption(type)
    setIsDrawerOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container max-w-6xl mx-auto px-4 lg:py-4 sm:py-4 grid gap-6">
        {/* Breadcrumb */}
        <div className="container max-w-6xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="text-gray-400">›</span>
            <span>Event Details</span>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex aa:flex-col xs:flex-row xs:gap-4 md:gap-6">
          {/* Left Side Content */}
          <div className="aa:w-full xs:w-[60%] md:w-[65%] lg:w-[70%] space-y-6">
            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-md aa:p-2 md:p-6 space-y-6">
              <div className="flex items-start gap-4">
                <Image
                  src="/yono.svg"
                  alt="Event thumbnail"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h1 className="text-xl font-semibold">Yoon arrested by January 31?</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Wed 2:45 AM</span>
                    <span>·</span>
                    <span>Jan 31 2026</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>50% chance</span>
                  <span>Anumaan</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full w-1/4 bg-blue-500 rounded-full" />
                </div>
              </div>

              <div className="aa:h-[300px] xs:h-[400px] bg-gray-100 rounded-lg overflow-hidden">
                <TimeSeriesChart currentChance={currentChance} />
              </div>
            </div>

            {/* Order Book Section */}
            <div className="bg-white rounded-lg shadow-md">
              <Tabs defaultValue="orderbook" className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger 
                    value="orderbook" 
                    className="data-[state=active]:bg-white data-[state=inactive]:bg-gray-100"
                  >
                    Order Book
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="orderbook" className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Yes Orders */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>PRICE</span>
                        <span>QTY AT <span className="text-blue-500">YES</span></span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                      </div>
                    </div>

                    {/* No Orders */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>PRICE</span>
                        <span>QTY AT <span className="text-red-500">NO</span></span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>0.5</span>
                          <span>5</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>2.5</span>
                          <span>7</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>3.5</span>
                          <span>22</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>8</span>
                          <span>9</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>8.5</span>
                          <span>1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Stats and Overview Section */}
            <div className="bg-white rounded-lg shadow-md">
              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger 
                    value="stats" 
                    className="data-[state=active]:bg-white data-[state=inactive]:bg-gray-100"
                  >
                    Stats
                  </TabsTrigger>
                  <TabsTrigger 
                    value="about" 
                    className="data-[state=active]:bg-white data-[state=inactive]:bg-gray-100"
                  >
                    About the event
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="stats" className="space-y-4 p-4">
                  <h3 className="font-semibold">Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer network.
                    Bitcoin transactions are verified by network nodes through cryptography and recorded in a public
                    distributed ledger called a blockchain. The cryptocurrency was invented in 2008 by an unknown
                    person or group of people using the name Satoshi Nakamoto. The source of truth will be considered.
                  </p>
                </TabsContent>
                <TabsContent value="about" className="space-y-4 p-4">
                  <div className="grid gap-6">
                    <div>
                      <h4 className="font-medium mb-1">Source of Truth</h4>
                      <p className="text-sm text-muted-foreground">
                        $FRAUD Revenue in Instagram
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Trading started on</h4>
                        <p className="text-sm text-muted-foreground">15 Jan, 2025</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Trading expire on</h4>
                        <p className="text-sm text-muted-foreground">31 Jan, 2025</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Event Overview & Statistics</h4>
                      <p className="text-sm text-muted-foreground">
                        Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer network.
                        Bitcoin transactions are verified by network nodes through cryptography and recorded in a public
                        distributed ledger called a blockchain.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Rules</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>• TIPS - You must set expire in the time mentioned in the event.</li>
                        <li>• RULE 1 - The event will be verified after 24 hours of expiry.</li>
                        <li>• RULE 2 - The outcome key will be updated after verification.</li>
                        <li>• We do consider key digits after the decimal.</li>
                        <li>• Open price at expiry time will be taken into consideration.</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right Side Content - Hidden on mobile */}
          <div className="aa:hidden xs:block xs:w-[40%] md:w-[35%] lg:w-[30%]">
            <Card className="sticky top-32">
              <CardContent className="space-y-6 p-6">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedOption('yes')}
                    className={`flex-1 py-2 px-4 rounded-xl font-medium text-center transition-colors ${
                      selectedOption === 'yes' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Yes 7.3
                  </button>
                  <button 
                    onClick={() => setSelectedOption('no')}
                    className={`flex-1 py-2 px-4 rounded-xl font-medium text-center transition-colors ${
                      selectedOption === 'no' ? 'bg-red-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    No 2.9
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Limit Price</span>
                    <span className="text-sm text-gray-500">Balance ₹0.00</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg">
                    <button 
                      className="py-2 px-3 hover:bg-gray-500 bg-slate-200 rounded-lg"
                      onClick={() => handleLimitPriceChange(false)}
                    >
                      −
                    </button>
                    <div className="flex-1 text-center">₹{limitPrice.toFixed(1)}</div>
                    <button 
                      className="py-2 px-3 hover:bg-gray-500 bg-slate-200 rounded-lg"
                      onClick={() => handleLimitPriceChange(true)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Shares</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 rounded-md bg-slate-200 text-xs px-3"
                    >
                      available qty {maxShares}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg">
                    <button 
                      className="py-2 px-3 hover:bg-gray-500 bg-slate-200 rounded-lg"
                      onClick={() => handleSharesChange(false)}
                      disabled={shares <= 0}
                    >
                      −
                    </button>
                    <div className="flex-1 text-center">{shares}</div>
                    <button 
                      className="py-2 px-3 hover:bg-gray-500 bg-slate-200 rounded-lg"
                      onClick={() => handleSharesChange(true)}
                      disabled={shares >= maxShares}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Total</span>
                    <span className="text-blue-600">₹0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Potential return</span>
                    <span className="text-green-500">₹0.00 (0.00%)</span>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                  Place Order
                </Button>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="w-full text-sm text-gray-600 hover:text-gray-800"
                  >
                    Advanced Options {showAdvancedOptions ? '▼' : '▶'}
                  </button>

                  {showAdvancedOptions && (
                    <div className="space-y-4">
                      <div>
                        <div 
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
                          onClick={() => setBookProfitEnabled(!bookProfitEnabled)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-green-600 font-medium">BP</span>
                            <span className="font-medium">Book Profit</span>
                          </div>
                          <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                            bookProfitEnabled ? 'bg-blue-500' : 'bg-gray-200'
                          }`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              bookProfitEnabled ? 'right-1' : 'left-1'
                            }`}></div>
                          </div>
                        </div>

                        {bookProfitEnabled && (
                          <div className="mt-3 space-y-3">
                            <div>
                              <div className="text-sm mb-1">Price</div>
                              <div className="flex items-center border rounded-lg">
                                <button className="p-2 hover:bg-gray-100">−</button>
                                <div className="flex-1 text-center border-x">₹8.0</div>
                                <button className="p-2 hover:bg-gray-100">+</button>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm mb-1">Quantity</div>
                              <div className="flex items-center border rounded-lg">
                                <button className="p-2 hover:bg-gray-100">−</button>
                                <div className="flex-1 text-center border-x">1</div>
                                <button className="p-2 hover:bg-gray-100">+</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div 
                          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer"
                          onClick={() => setStopLossEnabled(!stopLossEnabled)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-red-600 font-medium">SL</span>
                            <span className="font-medium">Stop Loss</span>
                          </div>
                          <div className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                            stopLossEnabled ? 'bg-blue-500' : 'bg-gray-200'
                          }`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              stopLossEnabled ? 'right-1' : 'left-1'
                            }`}></div>
                          </div>
                        </div>

                        {stopLossEnabled && (
                          <div className="mt-3 space-y-3">
                            <div>
                              <div className="text-sm mb-1">Price</div>
                              <div className="flex items-center border rounded-lg">
                                <button className="p-2 hover:bg-gray-100">−</button>
                                <div className="flex-1 text-center border-x">₹6.5</div>
                                <button className="p-2 hover:bg-gray-100">+</button>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm mb-1">Quantity</div>
                              <div className="flex items-center border rounded-lg">
                                <button className="p-2 hover:bg-gray-100">−</button>
                                <div className="flex-1 text-center border-x">1</div>
                                <button className="p-2 hover:bg-gray-100">+</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center text-xs text-gray-500">
                  By trading, you agree to the <a href="#" className="underline">Terms of Use</a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Trading Bar */}
        <div className="xs:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40">
          <div className="flex gap-4 max-w-md mx-auto">
            <button 
              onClick={() => handleTradeClick('yes')}
              className="flex-1 py-2 px-4 rounded-xl font-medium text-center bg-blue-50 text-blue-600 active:bg-blue-100"
            >
              Yes ₹4
            </button>
            <button 
              onClick={() => handleTradeClick('no')}
              className="flex-1 py-2 px-4 rounded-xl font-medium text-center bg-red-50 text-red-600 active:bg-red-100"
            >
              No ₹6
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <div className="px-6 py-12 space-y-6">
            <div className="flex items-start gap-4">
              <Image
                src="/yono.svg"
                alt="Event thumbnail"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h1 className="aa:text-base xs:text-xl font-semibold">Yoon arrested by January 31?</h1>
                <div className="flex items-center gap-2 aa:text-xs xs:text-sm text-muted-foreground">
                  <span>Wed 2:45 AM</span>
                  <span>·</span>
                  <span>Jan 31 2026</span>
                </div>
              </div>
            </div>
            <div className="sm:w-[335px] md:w-[350px] lg:w-[400px] space-y-4 mx-auto">
              <TradingSection 
                selectedOption={selectedOption}
                onOptionSelect={setSelectedOption}
              />
            </div>

            <OrderBook />
          </div>
        </Drawer>

        {/* Add bottom padding to prevent content from being hidden behind the trading bar */}
        <div className="xs:hidden h-20"></div>
      </div>
    </div>
  )
}

export default function PredictionMarket() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PredictionMarketContent />
    </Suspense>
  )
}