'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface TradingSectionProps {
  selectedOption: 'yes' | 'no' | null
  onOptionSelect: (option: 'yes' | 'no') => void
}

export function TradingSection({ selectedOption, onOptionSelect }: TradingSectionProps) {
  const [shares, setShares] = useState(0)
  const [limitPrice, setLimitPrice] = useState(7.3)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [bookProfitEnabled, setBookProfitEnabled] = useState(false)
  const [stopLossEnabled, setStopLossEnabled] = useState(false)
  const maxShares = 230

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

  return (
    <Card>
              <CardContent className="aa:space-y-2 xs:space-y-6 aa:p-2 xs:p-6">
                <div className="flex gap-2">
                  <button 
                    onClick={() => onOptionSelect('yes')}
                    className={`flex-1 py-2 px-4 rounded-xl font-medium text-center transition-colors ${
                      selectedOption === 'yes' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    Yes 7.3
                  </button>
                  <button 
                    onClick={() => onOptionSelect('no')}
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
  )
} 