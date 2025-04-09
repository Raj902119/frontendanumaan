"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Bitcoin, DollarSign, Trophy, Newspaper, Landmark, Coins } from 'lucide-react'

export function LiveMarkets() {
  const markets = [
    {
      id: 1,
      title: "CSK vs MI",
      icon: <Trophy className="h-4 w-4" />,
      category: "Cricket",
      isLive: true,
    },
    {
      id: 2,
      title: "Devendra Fadnavis",
      icon: <Landmark className="h-4 w-4" />,
      category: "Devendra Fadnavis",
      isLive: true,
    },
    {
      id: 3,
      title: "Stocks",
      icon: <DollarSign className="h-4 w-4" />,
      category: "Finance",
      isLive: false,
    },
    {
      id: 4,
      title: "Currency",
      icon: <Coins className="h-4 w-4" />,
      category: "Currency",
      isLive: true,
    }
  ]

  return (
    <div className="sm:py-4 aa:py-2">
      <div className="sm:hidden pb-[2px]">
        <h2 className="aa:text-[10px] ab:text-[12px] font-semibold text-gray-900">Trending</h2>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-full justify-center">
          <div className="flex md:space-x-4 aa:space-x-2">
            {markets.map((market) => (
              <Card key={market.id} className="inline-flex items-center rounded space-x-2 sm:p-3 cursor-pointer hover:bg-gray-50 md:w-36 md:h-14 aa:p-0 aa:w-24 aa:h-10 ac:w-30 ac:h-10 sm:w-32 sm:h-12 relative">
                {market.isLive && (
                  <span className="absolute top-0 left-0 bg-red-600 text-white sm:text-[8px] aa:text-[4px] px-1 py-0.5 rounded-br rounded-tl font-semibold">
                    LIVE
                  </span>
                )}
                <div className="flex-shrink-0 md:ml-3 aa:ml-2">
                  {market.icon}
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="md:text-sm sm:text-[12px] aa:text-[10px] font-medium truncate block">{market.title}</h3>
                  <p className="md:text-xs sm:text-[10px] aa:text-[8px] text-gray-500 truncate block">{market.category}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

