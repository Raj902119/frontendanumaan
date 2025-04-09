'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [redirectCheckDone, setRedirectCheckDone] = useState(false)
  // Track if this is initial load to prevent false negatives
  const isInitialLoad = useRef(true)
  // Track if we've confirmed token presence directly
  const tokenConfirmed = useRef(false)

  // Check for token in localStorage directly
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasToken = !!localStorage.getItem('token')
      tokenConfirmed.current = hasToken
      
      // After 3 seconds, we're no longer in initial load
      const timer = setTimeout(() => {
        isInitialLoad.current = false
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    // Only perform the check once initialization is complete
    if (!isLoading && isInitialized) {
      // Skip redirect during initial load if token exists
      if (isInitialLoad.current && tokenConfirmed.current) {
        console.log('Token exists, skipping redirect check during initial load')
        setRedirectCheckDone(true)
        return
      }
      
      // Give a small delay for auth state to stabilize during navigation
      const authCheckTimeout = setTimeout(() => {
        // Double check if token exists directly from localStorage
        const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token')
        
        // If we're certain user is not authenticated and not already redirecting
        if (!hasToken && !isAuthenticated && !isRedirecting) {
          console.log('No token found, redirecting to login')
          setIsRedirecting(true)
          // Add small timeout to prevent immediate redirection flashes
          setTimeout(() => {
            router.push('/login')
          }, 100)
        }
        
        setRedirectCheckDone(true)
      }, 100) // Short delay to let auth state stabilize
      
      return () => clearTimeout(authCheckTimeout)
    }
  }, [isAuthenticated, isLoading, router, isRedirecting, isInitialized])

  // Reset redirecting state if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(false)
    }
  }, [isAuthenticated])

  // Early return for initial load with token
  if (isInitialLoad.current && tokenConfirmed.current) {
    return <>{children}</>
  }

  // Show loading state when any of these conditions are true
  if (isLoading || !isInitialized || (isRedirecting && !redirectCheckDone)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If we've completed all checks and the user is not authenticated, return null
  if (redirectCheckDone && !isAuthenticated) {
    return null
  }

  // If either authenticated or still checking, render children
  return <>{children}</>
} 