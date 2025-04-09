'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { useAuth } from "@/hooks/useAuth"
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { sendOTP } = useAuth()

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Send OTP using the auth hook, passing isLogin=true to check if user exists
      const result = await sendOTP(phone, undefined, undefined, true)
      
      if (!result.success) {
        // Check if user doesn't exist
        if (!result.exists) {
          // User doesn't exist - redirect to signup
          toast.error('No account found with this phone number. Redirecting to signup...')
          setTimeout(() => {
            router.push(`/signup?phone=${encodeURIComponent(phone)}`)
          }, 2000)
          return
        }
        
        // Some other error occurred
        toast.error(result.message || 'Failed to send OTP. Please try again.')
        setError(result.message || 'Failed to send OTP. Please try again.')
        return
      }
      
      // OTP sent successfully, redirect to OTP page
      console.log("OTP sent successfully, redirecting to OTP page")
      toast.success('OTP sent successfully!')
      
      // Clear any error messages before redirecting
      setError("")
      router.push(`/login/OTP?phone=${encodeURIComponent(phone)}`)
    } catch (err: any) {
      console.error("Error in handleSendOTP:", err)
      // Show error in toast instead of setting error state
      toast.error(err.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Welcome back"
      subtitle="Enter your phone number to sign in"
    >
      <Toaster position="top-center" />
      
      <>
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter 10 digit mobile number"
              type="tel"
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#4461F2] hover:bg-[#4461F2]/90" 
            disabled={isLoading || phone.length !== 10}
          >
            {isLoading ? "Processing..." : "Send OTP"}
          </Button>
          
          <div className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link 
              href="/signup" 
              className="text-[#4461F2] hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </>
    </AuthLayout>
  )
}

