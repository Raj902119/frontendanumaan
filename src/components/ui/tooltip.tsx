"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute z-50 px-2 py-1 text-sm text-white bg-gray-800 rounded-md -translate-x-1/2 left-1/2 -top-2 -translate-y-full"
        >
          {content}
          <div className="absolute w-2 h-2 bg-gray-800 rotate-45 left-1/2 -translate-x-1/2 -bottom-1" />
        </div>
      )}
    </div>
  )
} 