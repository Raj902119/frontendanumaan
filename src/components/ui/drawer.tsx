'use client'

import * as React from "react"
import { X } from "lucide-react"
import { useEffect } from "react"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Drawer({ isOpen, onClose, children }: DrawerProps) {
  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed bg-white transform transition-all duration-300 ease-out z-50
          aa:inset-x-0 aa:bottom-0 aa:h-[90vh] aa:rounded-t-3xl
          xs:inset-x-0 xs:left-0 xs:top-[60px] xs:bottom-0 xs:w-[50%] md:w-[40%] xs:max-w-3xl xs:rounded-none xs:h-[calc(100vh-60px)]
          ${isOpen 
            ? 'translate-y-0 opacity-100 xs:translate-y-0 xs:translate-x-0' 
            : 'aa:translate-y-full opacity-0 xs:translate-y-0 xs:-translate-x-full'
          }`}
      >
        <div className="h-full overflow-y-auto">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
          {children}
        </div>
      </div>
    </>
  )
} 