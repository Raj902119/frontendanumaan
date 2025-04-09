'use client'

import { Trophy } from 'lucide-react'
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function WithdrawForm() {
  const [amount, setAmount] = useState<string>('')
  const [isTdsExpanded, setIsTdsExpanded] = useState(false)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
  }

  const incrementAmount = () => {
    setAmount(prev => (parseInt(prev) + 1).toString())
  }

  const decrementAmount = () => {
    setAmount(prev => Math.max(0, parseInt(prev) - 1).toString())
  }

  const depositAmount = Math.max(0, parseInt(amount) - 5)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <Link href="/wallet" className="text-gray-500 hover:text-gray-700">
            Wallet
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900">Withdrawal</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="space-y-6">
                <h1 className="text-3xl font-semibold">Withdraw</h1>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="amount" className="text-base font-medium">
                      Withdraw amount
                    </label>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm">₹7</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Input
                      id="amount"
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      className="pl-7 pr-8"
                      placeholder="0"
                    />
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        type="button"
                        onClick={incrementAmount}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={decrementAmount}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        -
                      </button>
                    </div>
                  </div>
                  {parseInt(amount) < 5 && (
                    <p className="text-sm text-red-500 mt-1">Please enter amount above ₹5</p>
                  )}
                  {parseInt(amount) >= 5 && (
                    <p className="text-sm text-gray-600">₹{depositAmount} will be deposited in your bank account</p>
                  )}
                  <p className="text-sm text-muted-foreground">Gateway charges are flat ₹ 5</p>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="account" className="text-base font-medium">
                    Withdraw account
                  </label>
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">xxxxx@ybl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full bg-green-500 hover:bg-green-700 hover:text-white font-bold">
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>

          {parseInt(amount) >= 5 && (
            <Card className="w-full">
              <CardContent className="p-4">
                <h2 className="text-center text-sm font-semibold text-gray-500 mb-6">★ SUMMARY ★</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Withdrawal requested</span>
                    <span>₹{amount}</span>
                  </div>
                  
                  <div className="flex justify-between text-red-600">
                    <span>Payment gateway fees</span>
                    <span>- ₹5</span>
                  </div>
                  
                  <div>
                    <button 
                      onClick={() => setIsTdsExpanded(!isTdsExpanded)}
                      className="w-full text-left"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span>TDS applicable</span>
                          <span className={`text-blue-500 transition-transform ${isTdsExpanded ? 'rotate-180' : ''}`}>
                          ↓
                          </span>
                        </div>
                        <span>- ₹0</span>
                      </div>
                    </button>

                    {isTdsExpanded && (
                      <div className="mt-4 space-y-4">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 border-b">
                            <h3 className="font-medium">FOR FY 24-25</h3>
                            <div className="space-y-2 text-sm mt-3">
                              <div className="flex justify-between">
                                <span>Current withdrawal requested</span>
                                <span>+ ₹{amount}</span>
                              </div>
                              <div className="flex justify-between text-red-600">
                                <span>Payment gateway fees</span>
                                <span>- ₹5</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total withdrawals</span>
                                <span>+ ₹0</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Opening balance</span>
                                <span>- ₹27.25</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Total deposits</span>
                                <span>- ₹400</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Net amount</span>
                                <span>₹0</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">Negative balance - ₹425.25 adjusted to zero</p>
                            </div>
                          </div>

                          <div className="bg-white p-4 border-b">
                            <h3 className="font-medium">TDS APPLICABLE</h3>
                            <div className="space-y-2 text-sm mt-3">
                              <div className="flex justify-between">
                                <span>TDS on net amount (30%)</span>
                                <span>+ ₹0</span>
                              </div>
                              <div className="flex justify-between">
                                <span>TDS paid till date</span>
                                <span>- ₹0</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-4">
                            <div className="flex justify-between text-sm">
                              <span>TDS applicable</span>
                              <span>₹0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Net Withdrawal</span>
                      <span>₹{depositAmount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}


