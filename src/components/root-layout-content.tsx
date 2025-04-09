'use client'

import { usePathname } from 'next/navigation'
import NavBar from '@/components/nav-bar'
import { Footer } from '@/components/footer'

interface RootLayoutContentProps {
  children: React.ReactNode
  className: string
}

export function RootLayoutContent({ children, className }: RootLayoutContentProps) {
  const pathname = usePathname()
  
  // Check if current page is login, signup, or OTP page
  const isAuthPage = pathname === '/login' || 
                     pathname === '/signup' || 
                     pathname.startsWith('/login/OTP')

  return (
    <body className={className}>
      {!isAuthPage && <NavBar />}
      {children}
      {!isAuthPage && <Footer />}
    </body>
  )
} 