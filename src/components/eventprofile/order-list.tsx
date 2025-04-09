'use client'

import * as React from "react"
import { useState } from "react"
import { ChevronRight } from "lucide-react"

interface Order {
  id: string
  status: "Yes" | "No"
  investment: number
  currentValue: number
  advancedOptions?: string
  returns?: number
}

interface OrdersListProps {
  orders: Order[]
}

export function OrdersList({ orders }: OrdersListProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="space-y-2">
          <div className="bg-white rounded-lg aa:py-4 aa:px-2 sm:p-4 shadow-sm">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 text-blue-600 aa:px-0 sm:px-3 py-1 aa:rounded-md xs:rounded-full aa:w-12 sm:w-20 flex justify-center items-center">
                {order.status}
              </div>
              <div className="flex flex-col items-center">
                <div className="aa:hidden sm:block text-sm text-gray-500">Investment</div>
                <div className="aa:block sm:hidden text-xs text-gray-500">Investment</div>
                <div className="aa:text-xs sm:text-sm font-medium">₹{order.investment}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="aa:hidden sm:block text-sm text-gray-500">Current Value</div>
                <div className="aa:block sm:hidden text-xs text-gray-500">Current</div>
                <div className="aa:text-xs sm:text-sm font-medium">₹{order.currentValue}</div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => toggleOrderDetails(order.id)}
                  className="text-blue-600 hover:text-blue-700 aa:text-xs sm:text-sm font-medium flex items-center gap-1"
                >
                  View details
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${
                      expandedOrderId === order.id ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Details Section */}
          {expandedOrderId === order.id && (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 w-1/2 ml-auto space-y-4">
              <h3 className="font-medium text-lg">Order Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-medium">#{order.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Order Type</div>
                  <div className="font-medium">Limit</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Quantity</div>
                  <div className="font-medium">10</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-medium">₹4</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Exit Quantity</div>
                  <div className="font-medium">10</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Exit Price</div>
                  <div className="font-medium">10</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Profit</div>
                  <div className="font-medium text-green-600">₹60</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Commission</div>
                  <div className="font-medium">₹12</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Platform Fee</div>
                  <div className="font-medium">₹3.0</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Order ID</div>
                  <div className="font-medium text-gray-600">PRB1261127494</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

