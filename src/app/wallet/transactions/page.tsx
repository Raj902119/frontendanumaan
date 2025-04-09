'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

type TransactionType = 'all' | 'success' | 'pending' | 'failed'
type BalanceType = 'all' | 'credit' | 'debit'

interface Transaction {
  id: string
  type: string
  description: string
  date: string
  status: 'Success' | 'Failed' | 'Pending'
  amount: number
}

export default function TransactionHistory() {
  const [transactionFilter, setTransactionFilter] = useState<TransactionType>('all')
  const [balanceFilter, setBalanceFilter] = useState<BalanceType>('all')
  const [activeTab, setActiveTab] = useState('balance')

  const transactions: Transaction[] = [
    {
      id: '12302145',
      type: 'Withdraw',
      description: 'Via Cashfree-popup on January 16, 2025 at 2:15 PM',
      date: '2025-01-16',
      status: 'Failed',
      amount: -100.00
    },
    {
      id: '12302146',
      type: 'Recharge',
      description: 'Via UPI on January 15, 2025 at 1:30 PM',
      date: '2025-01-15',
      status: 'Success',
      amount: 500.00
    },
    {
      id: '12302147',
      type: 'Withdraw',
      description: 'Via Bank Transfer on January 14, 2025 at 11:20 AM',
      date: '2025-01-14',
      status: 'Pending',
      amount: -250.00
    },
    {
      id: '12302148',
      type: 'Recharge',
      description: 'Via Credit Card on January 13, 2025 at 3:45 PM',
      date: '2025-01-13',
      status: 'Success',
      amount: 1000.00
    },
    {
      id: '12302149',
      type: 'Withdraw',
      description: 'Via Cashfree-popup on January 12, 2025 at 5:30 PM',
      date: '2025-01-12',
      status: 'Success',
      amount: -750.00
    }
  ]

  const filteredTransactions = transactions.filter(transaction => {
    // Handle Balance tab filters
    if (activeTab === 'balance') {
      if (balanceFilter === 'all') return true;
      if (balanceFilter === 'credit') return transaction.amount > 0;
      if (balanceFilter === 'debit') return transaction.amount < 0;
    }

    // Handle Recharge tab
    if (activeTab === 'recharge') {
      const isRecharge = transaction.type.toLowerCase() === 'recharge';
      if (!isRecharge) return false;
      
      if (transactionFilter === 'all') return true;
      return transaction.status.toLowerCase() === transactionFilter;
    }

    // Handle Withdraw tab
    if (activeTab === 'withdraw') {
      const isWithdraw = transaction.type.toLowerCase() === 'withdraw';
      if (!isWithdraw) return false;
      
      if (transactionFilter === 'all') return true;
      return transaction.status.toLowerCase() === transactionFilter;
    }

    return false;
  });

  return (
    <div className="max-w-5xl mx-auto aa:px-3 xs:px-6 aa:py-4 xs:py-8">
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
        <span className="text-gray-900">Transactions</span>
      </div>

      <div className="flex items-center gap-3 aa:mb-4 xs:mb-8">
        <h1 className="aa:text-lg xs:text-3xl font-medium">Transaction History</h1>
      </div>

      <Tabs 
        defaultValue="balance" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-200 p-1.5 rounded-lg aa:h-14 aa:mb-4 xs:mb-6">
          <TabsTrigger value="balance" className="text-sm rounded-2xl">Balance</TabsTrigger>
          <TabsTrigger value="recharge" className="text-sm rounded-2xl">Recharge</TabsTrigger>
          <TabsTrigger value="withdraw" className="text-sm rounded-2xl">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="aa:mt-4 xs:mt-6">
          <div className="overflow-x-auto">
            <div className="flex gap-3 aa:mb-4 xs:mb-6 min-w-max">
              {(['all', 'credit', 'debit'] as BalanceType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setBalanceFilter(filter)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    balanceFilter === filter
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {['recharge', 'withdraw'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="overflow-x-auto">
              <div className="flex gap-3 mb-6 min-w-max">
                {(['all', 'success', 'pending', 'failed'] as TransactionType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTransactionFilter(filter)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      transactionFilter === filter
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}

        <div className="mt-6">
          <div className="grid grid-cols-4 py-4 border-b text-sm font-medium text-gray-600">
            <div className="aa:pl-0 xs:pl-4">Transaction</div>
            <div className="text-right">Order ID</div>
            <div className="text-right">Status</div>
            <div className="text-right pr-4">Amount</div>
          </div>

          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="grid grid-cols-4 aa:py-2 xs:py-5 border-b hover:bg-gray-50">
              <div className="aa:pl-0 xs:pl-4">
                <p className="aa:text-xs xs:text-sm font-medium text-gray-900">{transaction.type}</p>
                <p className="aa:text-xs xs:text-sm text-gray-500 mt-1">{transaction.description}</p>
              </div>
              <div className="self-center aa:text-xs xs:text-sm  font-medium text-right">{transaction.id}</div>
              <div className="self-center flex justify-end">
                <span
                  className={`inline-block px-3 py-1 rounded-full aa:text-xs xs:text-sm font-medium ${
                    transaction.status === 'Success'
                      ? 'bg-green-100 text-green-600'
                      : transaction.status === 'Failed'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className={`text-right self-center aa:text-xs xs:text-sm pr-4 font-medium ${
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ₹{Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </Tabs>
    </div>
  )
} 