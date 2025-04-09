'use client'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { useAuth } from "@/hooks/useAuth"
import { OTPInput } from '@/components/otp-input'

function SignUpContent() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    referralCode: ''
  })
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { verifyOTP, sendOTP } = useAuth()

  // Pre-fill phone number from URL if available
  useEffect(() => {
    const phoneFromUrl = searchParams.get('phone')
    if (phoneFromUrl) {
      setFormData(prev => ({
        ...prev,
        phone: phoneFromUrl
      }))
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await sendOTP(
        formData.phone, 
        `${formData.firstName} ${formData.lastName}`.trim(),
        formData.referralCode
      )
      setStep('otp')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await verifyOTP(
        formData.phone, 
        otp, 
        `${formData.firstName} ${formData.lastName}`.trim(),
        formData.referralCode
      )
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Create an account"
      subtitle={step === 'details' ? 
        "Enter your details to create your account" : 
        `Enter the OTP sent to ${formData.phone}`
      }
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {step === 'details' ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Rohit"
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Kolhi"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter 10 digit mobile number"
              type="tel"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referralCode">Referral Code (Optional)</Label>
            <Input
              id="referralCode"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={handleChange}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500">
              Get ₹500 bonus when you sign up with a referral code!
            </p>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#4461F2] hover:bg-[#4461F2]/90" 
            disabled={isLoading || formData.phone.length !== 10}
          >
            {isLoading ? "Sending OTP..." : "Continue"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <OTPInput
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
              className="aa:scale-[0.85] ab:scale-100"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#4461F2] hover:bg-[#4461F2]/90" 
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Create Account"}
          </Button>
          <button
            type="button"
            onClick={() => setStep('details')}
            className="text-sm text-[#4461F2] hover:underline w-full text-center"
          >
            Change Phone Number
          </button>
        </form>
      )}

      <div className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="text-[#4461F2] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  )
}

