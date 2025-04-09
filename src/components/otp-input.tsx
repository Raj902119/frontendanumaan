'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OTPInput({ length = 6, value, onChange, disabled = false, className }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(value.split('').slice(0, length))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  useEffect(() => {
    // Update OTP array when value prop changes
    setOtp(value.split('').slice(0, length))
  }, [value, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    
    // Create a new OTP array
    const newOtp = [...otp]
    
    // Update or clear the value at current index
    newOtp[index] = newValue.slice(-1) // Take last character if multiple

    setOtp(newOtp)
    onChange(newOtp.join(''))

    // Move to next input if we entered a digit and not at the end
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index]) {
        // If current input has a value, clear it
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange(newOtp.join(''))
      } else if (index > 0) {
        // If current is empty, move to previous and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        onChange(newOtp.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length)
    const newOtp = [...otp]
    
    pastedData.split('').forEach((char, index) => {
      newOtp[index] = char
    })
    
    setOtp(newOtp)
    onChange(newOtp.join(''))
    
    // Focus last filled input or first empty one
    const focusIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <div className="flex aa:gap-1 ab:gap-2 justify-center">
      {Array(length).fill(0).map((_, index) => (
        <Input
          key={index}
          ref={(el: HTMLInputElement | null) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-lg p-0"
        />
      ))}
    </div>
  )
} 