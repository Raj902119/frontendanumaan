'use client'

import { useState } from "react"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function DepositPage() {
  const [amount, setAmount] = useState("100")

  const handleQuickAmount = (value: string) => {
    setAmount(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 py-8 md:p-6 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <Link href="/wallet" className="text-gray-500 hover:text-gray-700">
            Wallet
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900">Deposit</span>
        </div>

        {/* Header */}
        <div className="flex items-center aa:gap-0 sm:gap-4 mb-8">
          <h1 className="aa:text-xl sm:text-3xl font-semibold">Deposit</h1>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Section - Deposit Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Deposit amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount("100")}
                >
                  +100
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount("150")}
                >
                  +150
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAmount("250")}
                >
                  +250
                </Button>
              </div>

              <Button type="submit" className="w-full text-lg py-6 text-white bg-blue-500 hover:bg-blue-600">
                Recharge
              </Button>
            </form>
          </div>

          {/* Right Section - Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-center uppercase tracking-wider text-gray-500">
                  ★ SUMMARY ★
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recharge amount</span>
                    <span className="font-medium">₹100.00</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST applicable</span>
                    <span className="font-medium text-red-600">- ₹21.88</span>
                  </div>
                  
                  <div className="h-px bg-gray-200 my-2"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit bal. credit</span>
                    <span className="font-medium">₹78.13</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-600 flex items-center gap-1">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-green-500">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      Recharge Cashback
                    </span>
                    <span className="font-medium text-green-600">+ ₹21.88</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Net Balance</span>
                      <span className="font-bold">₹100.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

