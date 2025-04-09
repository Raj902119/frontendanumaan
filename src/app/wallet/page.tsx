'use client'

import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import {
  fetchWalletBalance,
  fetchTransactions,
  clearWalletError,
  clearSuccessMessage
} from '@/store/features/walletSlice'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wallet, Trophy, History, FileCheck, Gift, ChevronRight } from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'

export default function WalletPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  
  // Use a default empty state object to prevent destructuring errors
  const walletState = useSelector((state: RootState) => state.wallet) || {
    balance: null,
    loading: false,
    error: null,
    successMessage: null
  }

  // Also get auth state and user state for data
  const authState = useSelector((state: RootState) => state.auth)
  const userState = useSelector((state: RootState) => state.user)
  const authUser = authState?.user

  const {
    balance,
    loading,
    error,
    successMessage
  } = walletState

  const [isClient, setIsClient] = useState(false)

  // Helper functions to get balance values with fallbacks
  const getTotalBalance = useCallback(() => {
    const walletValue = balance?.totalBalance;
    const authValue = authUser?.totalBalance;
    return walletValue ?? authValue ?? 0;
  }, [balance, authUser]);

  const getDepositAmount = useCallback(() => {
    const walletValue = balance?.depositedAmount;
    return walletValue ?? 0;
  }, [balance]);

  const getWithdrawableAmount = useCallback(() => {
    const walletValue = balance?.withdrawableAmount;
    const userValue = userState.stats?.withdrawableAmount;
    return walletValue ?? userValue ?? 0;
  }, [balance, userState.stats]);

  const getPromotionalAmount = useCallback(() => {
    const walletValue = balance?.bonusAmount;
    return walletValue ?? 0;
  }, [balance]);

  useEffect(() => {
    setIsClient(true)
    
    // Initial data fetch
    const initialLoad = async () => {
      try {
        await dispatch(fetchWalletBalance()).unwrap();
        await dispatch(fetchTransactions()).unwrap();
      } catch (err) {
        console.error('❌ Error during initial wallet data load:', err);
      }
    };
    
    initialLoad();
    
    // Set up polling for wallet data every 30 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchWalletBalance());
    }, 30000);
    
    // Clear messages and interval when unmounting
    return () => {
      dispatch(clearWalletError());
      dispatch(clearSuccessMessage());
      clearInterval(intervalId);
    }
  }, [dispatch]);

  if (loading && !balance && !authUser) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  // Wrap content with isClient check to prevent hydration errors
  return (
    <ProtectedRoute>
      {!isClient ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="text-gray-900">Wallet</span>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
              {successMessage}
            </div>
          )}

          {/* Total Balance */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total balance</p>
            <h1 className="text-3xl font-semibold">₹{getTotalBalance().toFixed(2)}</h1>
          </div>

          {/* Balance Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Deposit Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Deposit</p>
                  <p className="text-xl font-semibold">₹{getDepositAmount().toFixed(2)}</p>
                </div>
                <Button 
                  className="w-full bg-blue-500 hover:bg-white text-white font-semibold hover:text-black"
                  onClick={() => router.push('/wallet/deposit')}
                >
                  Recharge
                </Button>
              </CardContent>
            </Card>

            {/* Winnings Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Winnings</p>
                  <p className="text-xl font-semibold">₹{getWithdrawableAmount().toFixed(2)}</p>
                </div>
                <Button 
                  className="w-full bg-blue-500 hover:bg-white hover:text-black font-semibold text-white"
                  onClick={() => router.push('/wallet/withdrawal')}
                >
                  Withdraw
                </Button>
                {authUser?.kycStatus !== 'VERIFIED' && (
                  <p className="text-xs text-red-500">Complete kyc to withdraw funds</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Transaction History Card */}
              <Card 
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => router.push('/wallet/transactions')}
              >
                <CardContent className="p-4 space-y-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <History className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Transaction History</p>
                    <p className="text-sm text-muted-foreground">For all balance debits & credits</p>
                  </div>
                  <div className="flex justify-end text-muted-foreground">→</div>
                </CardContent>
              </Card>

              {/* KYC Verification Card */}
              <Card 
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => router.push('/wallet/kyc')}
              >
                <CardContent className="p-4 space-y-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">KYC verification</p>
                    <p className="text-sm text-amber-500">
                      {authUser?.kycStatus === 'VERIFIED' ? 'Verified' : 'Tap to verify'}
                    </p>
                  </div>
                  <div className="flex justify-end text-muted-foreground">→</div>
                </CardContent>
              </Card>

              {/* Promotional Card */}
              <Card 
                className="hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => router.push('/wallet/refer')}
              >
                <CardContent className="p-4 space-y-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Gift className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-medium">Promotional (Earn up to ₹5000)</p>
                    <p className="text-sm font-medium">₹{getPromotionalAmount().toFixed(2)}</p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Invite and Earn
                  </Button>
                </CardContent>
              </Card>

              {/* Control Centre Card */}
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 space-y-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">⚡</span>
                  </div>
                  <div>
                    <p className="font-medium">Control Centre</p>
                    <p className="text-sm text-muted-foreground">Limits for responsible trading</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Coming soon...</div>
                </CardContent>
              </Card>

              {/* Statements & Certificate Card */}
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-4 space-y-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600">📧</span>
                  </div>
                  <div>
                    <p className="font-medium">Statements & Certificate</p>
                    <p className="text-sm text-muted-foreground">For ledger and TDS certificates</p>
                  </div>
                  <div className="text-sm text-muted-foreground">Coming soon...</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}

