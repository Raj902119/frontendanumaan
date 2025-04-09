'use client'

import * as React from "react"
import Image from "next/image"
import { Breadcrumb } from "../../../components/eventprofile/breadcrumb"
import { EventHeader } from "../../../components/eventprofile/event-header"
import { InvestmentSummary } from "../../../components/eventprofile/investment-summary"
import { OrdersList } from "../../../components/eventprofile/order-list"

type OrderStatus = 'pending' | 'matched' | 'exited' | 'cancelled' | 'rejected'

interface Order {
  id: string
  status: "Yes" | "No"
  investment: number
  currentValue: number
  advancedOptions: string
  orderStatus: OrderStatus
}

export default function Page() {
  const [activeFilter, setActiveFilter] = React.useState<'all' | OrderStatus>('all')

  const orders: Order[] = [
    {
      id: "1",
      status: "Yes",
      investment: 40.0,
      currentValue: 40.0,
      advancedOptions: "---",
      orderStatus: 'pending'
    },
    {
      id: "2",
      status: "Yes",
      investment: 40.0,
      currentValue: 40.0,
      advancedOptions: "---",
      orderStatus: 'matched'
    },
    {
      id: "3",
      status: "Yes",
      investment: 40.0,
      currentValue: 40.0,
      advancedOptions: "---",
      orderStatus: 'exited'
    }
  ]

  const filteredOrders = React.useMemo(() => {
    if (activeFilter === 'all') return orders
    return orders.filter(order => order.orderStatus === activeFilter)
  }, [activeFilter, orders])

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Image
        src="/search.png"
        alt="No orders found"
        width={200}
        height={200}
        className="mb-6"
      />
      <h3 className="text-2xl font-semibold mb-2">Nothing to see here... yet</h3>
      <p className="text-gray-600">Your active trades will appear here</p>
    </div>
  )

  return (
    <div className="aa:py-4 xs:py-16 bg-gray-100">
      <div className="container mx-auto max-w-5xl aa:space-y-4 xs:space-y-8 px-6">
        <Breadcrumb />
        
        <div className="aa:space-y-4 xs:space-y-8">
          <EventHeader
            title="Melbourne Renegades to win the match vs Brisbane Heat?"
            probability={40.00}
          />
          
          <InvestmentSummary
            invested={40.00}
            currentValue={40.00}
            liveReturns={0.00}
            exitedReturns="---"
          />
        </div>
        
        {/* Orders Filter Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="xs:block hidden text-xl font-semibold">Orders</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-2 min-w-max">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending', label: 'Pending' },
                  { key: 'matched', label: 'Matched' },
                  { key: 'exited', label: 'Exited' },
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

