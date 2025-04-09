"use client"

import { useState, useEffect, useRef } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Menu, Grid, Trophy, Activity, Award, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { fetchUserStats } from '@/store/features/userSlice'
import { motion, AnimatePresence } from "framer-motion"

export default function NavBar() {
  const { isAuthenticated, user, logout, isInitialized } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [previousAuthState, setPreviousAuthState] = useState<boolean | null>(null);
  const isPageReload = useRef(true);
  
  // Get the authentication state from Redux store for double-check
  const reduxAuthState = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Determine final authentication state
  const finalIsAuthenticated = isAuthenticated || reduxAuthState;

  const userStats = useSelector((state: RootState) => state.user.stats);
  const wallet = useSelector((state: RootState) => state.portfolio?.walletBalance);
  
  // Function to get portfolio value (current value)
  const getPortfolioValue = () => {
    console.log('Portfolio data sources:', {
      userStats,
      wallet,
      user
    });
    
    if (wallet?.currentValue !== undefined && wallet.currentValue !== null) {
      return Number(wallet.currentValue);
    }
    
    if (userStats?.currentValue !== undefined && userStats.currentValue !== null) {
      return Number(userStats.currentValue);
    }
    
    if (user?.currentValue !== undefined && user?.currentValue !== null) {
      return Number(user.currentValue);
    }
    
    return 0;
  };
  
  // Function to get available balance
  const getAvailableBalance = () => {
    if (wallet?.availableBalance !== undefined && wallet.availableBalance !== null) {
      return Number(wallet.availableBalance);
    }
    
    if (userStats?.availableBalance !== undefined && userStats.availableBalance !== null) {
      return Number(userStats.availableBalance);
    }
    
    if (user?.wallet?.availableBalance !== undefined && user.wallet.availableBalance !== null) {
      return Number(user.wallet.availableBalance);
    }
    
    if (user?.availableBalance !== undefined && user?.availableBalance !== null) {
      return Number(user.availableBalance);
    }
    
    return 0;
  };

  useEffect(() => {
    setIsClient(true);
    
    const timer = setTimeout(() => {
      isPageReload.current = false;
    }, 2000);
    
    if (isAuthenticated || reduxAuthState) {
      const fetchStats = () => dispatch(fetchUserStats())
      fetchStats()
      const interval = setInterval(fetchStats, 30000)
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      }
    }
    
    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated, reduxAuthState])

  useEffect(() => {
    if (isClient && isInitialized) {
      if (previousAuthState === null) {
        setPreviousAuthState(finalIsAuthenticated);
      } 
      else if (previousAuthState === true && !finalIsAuthenticated) {
        if (isPageReload.current) {
          console.log('Ignoring auth state change during page reload');
          return;
        }
        
        const logoutTimer = setTimeout(() => {
          if (!localStorage.getItem('token')) {
            console.log('Confirmed authentication loss, logging out user');
            handleLogout();
          } else {
            console.log('False negative detected, token still exists');
          }
        }, 500);
        
        return () => clearTimeout(logoutTimer);
      }
      
      setPreviousAuthState(finalIsAuthenticated);
    }
  }, [finalIsAuthenticated, isClient, isInitialized]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Clear localStorage first to ensure immediate UI update
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('persist:root');
      
      // Then call the redux logout action
      await logout();
      closeMobileMenu();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Ensure we're logged out even if redux action fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('persist:root');
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="relative">
        <div className="relative max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-gray-900 font-bold text-lg sm:text-2xl">Anumaan</div>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 mx-4">
            <div className="relative max-w-2xl mx-auto w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search markets"
                className="w-full pl-8 border-gray-200"
              />
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center justify-end space-x-2 lg:space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <Grid className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                <span className="text-sm sm:text-base">Dashboard</span>
              </Link>
              
              <Link href="/ranks" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <Trophy className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                <span className="text-sm sm:text-base">Rank</span>
              </Link>
              
              <Link href="/Orders" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                <Activity className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                <span className="text-sm sm:text-base">Orders</span>
              </Link>
            </div>

            {isClient && finalIsAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-4">
                    <Link href="/">
                      <div className="cursor-pointer">
                        <div className="text-xs text-gray-500">Portfolio</div>
                        <div className="font-medium text-green-500">
                          ₹{getPortfolioValue().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </Link>
                    <Link href="/wallet">
                      <div className="cursor-pointer">
                        <div className="text-xs text-gray-500">Balance</div>
                        <div className="font-medium text-green-500">
                          ₹{getAvailableBalance().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </Link>
                  </div>
                  <Button 
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => router.push('/wallet/deposit')}
                  >
                    Deposit
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center space-x-2 hover:bg-gray-100"
                    >
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.phone}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="cursor-pointer">
                        Wallet
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/Orders" className="cursor-pointer">
                        Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : isClient ? (
              <div className="hidden sm:flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-sm sm:text-base text-blue-600 hover:text-blue-700"
                  onClick={handleLoginClick}
                >
                  Log In
                </Button>
                <Button 
                  className="text-sm sm:text-base bg-blue-600 text-white hover:bg-blue-700"
                  onClick={handleSignupClick}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-4">
                <div className="h-9 w-16 opacity-0"></div>
              </div>
            )}

            <Button 
              ref={menuButtonRef}
              variant="ghost" 
              className="xs:hidden text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </nav>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              ref={mobileMenuRef}
              className="xs:hidden absolute top-14 left-0 right-0 bg-white border-b shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-4 space-y-4">
                {finalIsAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 pb-4 border-b">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.phone}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      <Link href="/portfolio" onClick={closeMobileMenu} className="text-center">
                        <div className="text-xs text-gray-500">Portfolio</div>
                        <div className="font-medium text-green-500">
                          ₹{getPortfolioValue().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </Link>
                      <Link href="/wallet" onClick={closeMobileMenu} className="text-center">
                        <div className="text-xs text-gray-500">Balance</div>
                        <div className="font-medium text-green-500">
                          ₹{getAvailableBalance().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </Link>
                    </div>

                    <div className="space-y-3">
                      <Link href="/dashboard" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-gray-50 rounded-md">
                        Dashboard
                      </Link>
                      <Link href="/profile" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-gray-50 rounded-md">
                        Profile
                      </Link>
                      <Link href="/wallet" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-gray-50 rounded-md">
                        Wallet
                      </Link>
                      <Link href="/orders" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-gray-50 rounded-md">
                        Orders
                      </Link>
                      <Link href="/ranks" onClick={closeMobileMenu} className="block px-4 py-2 hover:bg-gray-50 rounded-md">
                        Rank
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      onClick={handleSignupClick}
                    >
                      Sign Up
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleLoginClick}
                    >
                      Log In
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}