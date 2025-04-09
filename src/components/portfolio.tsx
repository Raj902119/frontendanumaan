'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchOrders, fetchWalletBalance } from '@/store/features/portfolioSlice'

export default function Portfolio() {
  const dispatch = useDispatch<AppDispatch>()
  const { walletBalance, orders, loading, error } = useSelector(
    (state: RootState) => state.portfolio
  )

  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchWalletBalance())
  }, [dispatch])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Your Balance</h2>
        <p className="text-xl">₹{walletBalance?.availableBalance.toFixed(2) || '0.00'}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Portfolio</h2>
        {orders.length === 0 ? (
          <p>No stocks in your portfolio</p>
        ) : (
          <div className="grid gap-4">
            {orders.map((item) => (
              <div
                key={item.orderId}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h3 className="font-bold">{item.eventId}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Average Price: ₹{item.price.toFixed(2)}</p>
                <p>Current Value: ₹{item.currentValue.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 