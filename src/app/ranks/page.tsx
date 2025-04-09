"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { ChevronRight, Medal, Clock, Gift, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProtectedRoute from '@/components/protected-route'
import Countdown from 'react-countdown'
import { fetchTopPlayers } from '@/store/features/rankingsSlice'
import { UserRanking } from '@/store/features/rankingsSlice'

// Target date - May 26th, 2025 at 10am
const TARGET_DATE = new Date(2025, 4, 26, 10, 0, 0).getTime(); // Month is 0-indexed, so 4 = May

// Prize images for top 3 positions
const PRIZE_IMAGES = {
  0: { src: "/legender.png", alt: "Legender Prize", fallback: "🏆" },
  1: { src: "/gt.jpeg", alt: "GT Prize", fallback: "🏎️" },
  2: { src: "/iphone.jpeg", alt: "iPhone Prize", fallback: "📱" }
};

// Renderer for the countdown
const CountdownRenderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    // Render a completed state
    return (
      <div className="text-center p-3 bg-green-100 rounded-lg">
        <p className="text-green-800 font-bold">Competition has ended!</p>
      </div>
    );
  }

  const formatTimeUnit = (unit: number): string => {
    return unit < 10 ? `0${unit}` : `${unit}`;
  };

  return (
    <div className="flex justify-center gap-3 mt-2">
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white rounded-md px-3 py-1 text-xl font-bold min-w-[2.5rem]">
          {formatTimeUnit(days)}
        </div>
        <span className="text-xs mt-1 text-blue-700">Days</span>
      </div>
      <div className="text-xl font-bold text-blue-600">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white rounded-md px-3 py-1 text-xl font-bold min-w-[2.5rem]">
          {formatTimeUnit(hours)}
        </div>
        <span className="text-xs mt-1 text-blue-700">Hours</span>
      </div>
      <div className="text-xl font-bold text-blue-600">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white rounded-md px-3 py-1 text-xl font-bold min-w-[2.5rem]">
          {formatTimeUnit(minutes)}
        </div>
        <span className="text-xs mt-1 text-blue-700">Mins</span>
      </div>
      <div className="text-xl font-bold text-blue-600">:</div>
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white rounded-md px-3 py-1 text-xl font-bold min-w-[2.5rem] relative overflow-hidden group">
          <span className="relative z-10">{formatTimeUnit(seconds)}</span>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-blue-700 animate-pulse opacity-10"></div>
        </div>
        <span className="text-xs mt-1 text-blue-700">Secs</span>
      </div>
    </div>
  );
};

export default function RanksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isClient, setIsClient] = useState(false);
  
  // Get rankings data from Redux store
  const { topPlayers, loading, error } = useSelector((state: RootState) => state.rankings);
  
  // For debugging
  useEffect(() => {
    if (isClient) {
      console.log('[RanksPage] Redux state:', { topPlayers, loading, error });
    }
  }, [isClient, topPlayers, loading, error]);
  
  // Fetch rankings data on initial load
  useEffect(() => {
    setIsClient(true);
    
    // Fetch top 10 players
    dispatch(fetchTopPlayers(10));
  }, [dispatch]);
  
  // Medal colors based on ranking position
  const getMedalColor = (position: number): string => {
    switch (position) {
      case 0: return "text-amber-400" // Gold
      case 1: return "text-slate-400" // Silver
      case 2: return "text-amber-700" // Bronze
      default: return "text-slate-300"
    }
  }

  // Render content based on loading/error state
  const renderRankingsList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    if (error) {
      console.error('[RanksPage] Error displaying rankings:', error);
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-red-500">
          <AlertCircle className="h-8 w-8" />
          <p>Failed to load rankings: {error}</p>
        </div>
      );
    }
    
    if (!topPlayers || topPlayers.length === 0) {
      console.log('[RanksPage] No rankings available');
      return (
        <div className="text-center py-10 text-gray-500">
          <p>No rankings available at this time.</p>
          <p className="mt-2 text-sm">Check back soon for updated leaderboard.</p>
        </div>
      );
    }
    
    console.log('[RanksPage] Rendering', topPlayers.length, 'players');
    
  return (
      <div className="space-y-4">
        {topPlayers.map((user, index) => (
          <Card key={user.id} className={`overflow-hidden ${index < 3 ? 'border-2 border-' + (index === 0 ? 'amber-400' : index === 1 ? 'slate-400' : 'amber-700') : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center h-8 w-8">
                    {index < 3 ? (
                      <Medal className={`h-6 w-6 ${getMedalColor(index)}`} />
                    ) : (
                      <span className="font-semibold text-gray-500">{index + 1}</span>
                    )}
      </div>
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  {/* Prize images on left side */}
                  {index < 3 && (
            <div className="relative">
                      <div className="h-12 w-12 relative">
                        {isClient && PRIZE_IMAGES[index as keyof typeof PRIZE_IMAGES] && (
                          <div className="relative flex items-center justify-center">
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              <Gift className="h-3 w-3" />
                            </div>
                            <div className="rounded-md overflow-hidden bg-gray-50 p-1">
                              <Image 
                                src={PRIZE_IMAGES[index as keyof typeof PRIZE_IMAGES].src}
                                alt={PRIZE_IMAGES[index as keyof typeof PRIZE_IMAGES].alt}
                                width={40}
                                height={40}
                                style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
                                className="object-contain"
                                onError={(e) => {
                                  // Fallback for image load errors
                                  const target = e.target as HTMLElement;
                                  target.innerHTML = PRIZE_IMAGES[index as keyof typeof PRIZE_IMAGES].fallback;
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-center mt-1 font-medium text-blue-600">
                        {index === 0 ? 'Legender' : index === 1 ? 'GT' : 'iPhone'}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">Score: {user.score}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-green-600">+₹{user.netProfitLoss.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Net Profit/Loss</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      {!isClient ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="container mx-auto p-5 aa:p-3 xs:p-4">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6">
              <Link 
                href="/" 
                className="text-gray-500 hover:text-gray-700"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-500" />
              <span className="text-gray-900">Ranks</span>
            </div>
            
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <p className="text-gray-600">Top 10 traders ranked by net profit/loss</p>
          </div>

            {/* Countdown Timer */}
            <div className="text-center mb-8 p-4 bg-blue-50 rounded-lg shadow-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-blue-800">Till 26 May 10am</h2>
        </div>

              {/* ReactCountdown component will automatically update every second */}
              <Countdown
                date={TARGET_DATE}
                renderer={CountdownRenderer}
              />
            </div>

            {/* Rankings List */}
            <div className="mt-4">
              {renderRankingsList()}
        </div>
      </div>
    </div>
      )}
    </ProtectedRoute>
  );
}

