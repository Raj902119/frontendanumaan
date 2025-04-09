import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { OTPInput } from '@/components/otp-input'
import toast from 'react-hot-toast'

interface OTPVerificationProps {
  phone: string
  name?: string
  referralCode?: string
  onBack: () => void
  onSuccess: () => void
  verifyOTP: (phone: string, otp: string, name?: string, referralCode?: string) => Promise<boolean>
  resendOTP: (phone: string) => Promise<boolean>
}

export function OTPVerification({ 
  phone,
  name,
  referralCode, 
  onBack, 
  onSuccess, 
  verifyOTP, 
  resendOTP 
}: OTPVerificationProps) {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendDisabled, setResendDisabled] = useState(true)
  const [resendCountdown, setResendCountdown] = useState(30)
  const router = useRouter()

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (resendDisabled && resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (resendCountdown === 0) {
      setResendDisabled(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendDisabled, resendCountdown]);

  async function handleResendOTP() {
    setIsLoading(true)
    setError("")

    try {
      const success = await resendOTP(phone)
      
      if (!success) {
        throw new Error("Failed to resend OTP. Please try again.")
      }
      
      // Reset the countdown timer
      setResendDisabled(true)
      setResendCountdown(30)
      toast.success('OTP resent successfully')
    } catch (err: any) {
      console.error("OTP resend error:", err);
      setError(err.message || "Failed to resend OTP")
      toast.error(err.message || "Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      toast.error("Please enter a valid 6-digit OTP")
      setIsLoading(false)
      return
    }

    try {
      console.log("Starting OTP verification with:", { 
        phone, 
        otp, 
        name: name ? 'Provided' : 'Not provided', 
        referralCode: referralCode ? 'Provided' : 'Not provided' 
      });
      
      const success = await verifyOTP(phone, otp, name, referralCode)
      
      if (!success) {
        console.error("OTP verification returned false");
        toast.error("Verification failed. Please try again.")
        setError("Verification failed. Please try again.")
        return
      }
      
      toast.success('Login successful')
      onSuccess()
    } catch (err: any) {
      console.error("OTP verification error:", err)
      const errorMessage = err.message || "Failed to verify OTP. Please try again.";
      toast.error(errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <OTPInput
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            className="aa:px-2 ab:px-0"
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-[#4461F2] hover:bg-[#4461F2]/90" 
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
        
        <div className="flex justify-between mt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-[#4461F2] hover:underline"
          >
            Change Phone Number
          </button>
          
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendDisabled || isLoading}
            className={`text-sm ${resendDisabled ? 'text-gray-400' : 'text-[#4461F2] hover:underline'}`}
          >
            {resendDisabled 
              ? `Resend OTP in ${resendCountdown}s` 
              : 'Resend OTP'
            }
          </button>
        </div>
      </form>
    </>
  )
} 