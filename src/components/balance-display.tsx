'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchUserStats } from '@/store/features/userSlice'
import { Card, CardContent } from '@/components/ui/card'

export default function BalanceDisplay() {
  const dispatch = useDispatch<AppDispatch>()
  const { stats, loading, error } = useSelector((state: RootState) => state.user)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchUserStats())
  }, [dispatch])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Your Balance</h2>
          <p className="text-3xl font-bold text-green-600">₹{stats?.availableBalance.toFixed(2) || '0.00'}</p>
        </div>
      </CardContent>
    </Card>
  )
} 