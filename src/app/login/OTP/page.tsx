'use client'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { useAuth } from "@/hooks/useAuth"
import { Toaster } from 'react-hot-toast'
import { OTPVerification } from "@/components/otp-verification"

function OTPPageContent() {
  const [phone, setPhone] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOTP, resendOTP } = useAuth()

  useEffect(() => {
    // Get phone from URL params
    const phoneParam = searchParams.get('phone')
    if (!phoneParam) {
      // No phone provided, redirect back to login
      router.push('/login')
      return
    }
    
    setPhone(phoneParam)
  }, [searchParams, router])

  const handleSuccess = () => {
    // Redirect to home page after successful verification
    router.push('/')
  }

  const handleBack = () => {
    // Go back to login page
    router.push('/login')
  }

  // If phone is not yet set, don't render the component
  if (!phone) return null

  return (
    <AuthLayout 
      title="Verification"
      subtitle={`Enter the OTP sent to ${phone}`}
    >
      <Toaster position="top-center" />
      <OTPVerification 
        phone={phone}
        onBack={handleBack}
        onSuccess={handleSuccess}
        verifyOTP={verifyOTP}
        resendOTP={resendOTP}
      />
    </AuthLayout>
  )
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <OTPPageContent />
    </Suspense>
  )
}
