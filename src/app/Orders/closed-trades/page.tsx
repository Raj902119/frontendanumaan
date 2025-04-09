'use client'

import * as React from "react"
import Image from "next/image"
import { Breadcrumb } from "../../../components/eventprofile/breadcrumb"
import { EventCard } from "../../../components/eventprofile/event-card"
import { OrdersList } from "../../../components/eventprofile/order-list"

type OrderStatus = 'settled' | 'cancelled' | 'rejected'

interface Order {
  id: string
  status: "No" | "Yes"
  investment: number
  currentValue: number
  returns: number
  orderStatus: OrderStatus
}

export default function Page() {
  const [activeFilter, setActiveFilter] = React.useState<'all' | OrderStatus>('all')

  const orders: Order[] = [
    { 
      id: "1", 
      status: "No", 
      investment: 50.0, 
      currentValue: 50.0,
      returns: 50.0,
      orderStatus: 'settled'
    },
    { 
      id: "2", 
      status: "No", 
      investment: 50.0, 
      currentValue: 50.0,
      returns: 50.0,
      orderStatus: 'cancelled'
    },
    { 
      id: "3", 
      status: "No", 
      investment: 50.0, 
      currentValue: 50.0,
      returns: 50.0,
      orderStatus: 'rejected'
    },
  ]

  const filteredOrders = React.useMemo(() => {
    if (activeFilter === 'all') return orders
    return orders.filter(order => order.orderStatus === activeFilter)
  }, [activeFilter, orders])

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center aa:py-4 xs:py-12 text-center">
      <Image
        src="/search.png"
        alt="No orders found"
        width={200}
        height={200}
        className="mb-6"
      />
      <h3 className="text-2xl font-semibold mb-2">Nothing to see here... yet</h3>
      <p className="text-gray-600">Your closed trades will appear here</p>
    </div>
  )

  return (
    <div className="aa:py-4 sm:py-8 lg:py-16 bg-gray-100">
      <div className="container mx-auto max-w-5xl space-y-8 px-6">
        <Breadcrumb />
        
        <EventCard
          title="Durban to win the match vs Eastern Cape?"
          settledValue={200.00}
          invested={100.00}
          settledReturns={100.00}
          rank={2552}
        />
        
        {/* Orders Filter Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="xs:block hidden text-xl font-semibold">Orders</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'settled', label: 'Settled' },
                  { key: 'cancelled', label: 'Cancelled' },
                  { key: 'rejected', label: 'Rejected' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeFilter === filter.key
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {filteredOrders.length > 0 ? (
            <OrdersList orders={filteredOrders} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  )
}

