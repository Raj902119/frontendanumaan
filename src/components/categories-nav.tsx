"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

export function CategoriesNav() {
  const [showAll, setShowAll] = useState(false)

  const categories = [
    // First Row
    { name: "Cricket", href: "/cricket", icon: "/Cricket.svg" },
    { name: "Finance", href: "/finance", icon: "/finance.svg" },
    { name: "Politics", href: "/politics", icon: "/politician.svg" },    // Second Row
    { name: "Kabaddi", href: "/kabaddi", icon: "/kabbadi.svg" },
    { name: "Football", href: "/football", icon: "/football.svg" },
    { name: "Basketball", href: "/basketball", icon: "/basketball.svg" },
    { name: "Tennis", href: "/tennis", icon: "/tennis.svg" },
    { name: "Gaming", href: "/esports", icon: "/esports.svg" },
    // Third Row
    { name: "News", href: "/news", icon: "/news.svg" },
    { name: "Chess", href: "/Chess", icon: "/Chess.svg" },
    { name: "Youtube", href: "/Youtube", icon: "/Youtube.svg" },
    { name: "Economy", href: "/growth", icon: "/growth.svg" },
  ]

  // Show only first 4 items initially
  const visibleCategories = showAll ? categories : categories.slice(0, 4)

  return (
    <>
      {/* Desktop/Tablet View */}
      <div className="hidden sm:block border-b">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-full justify-center py-4">
            <div className="flex space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden bg-gray-50 pb-2">
        <div className="pt-2 pb-[2px]">
          <h2 className="aa:text-[10px] ab:text-[12px] font-semibold text-gray-900">Categories</h2>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {visibleCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center gap-1"
            >
              <div className="bg-white p-3 rounded-lg shadow-sm aa:w-12 aa:h-12 ab:w-14 ab:h-14 ac:w-16 ac:h-16  flex items-center justify-center">
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={30}
                  height={30}
                />
              </div>
              <span className="aa:text-[9px] ac:text-[11px] text-gray-600 text-center">{category.name}</span>
            </Link>
          ))}
          {/* Show More button as the 5th item in first row */}
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex flex-col items-center gap-1"
          >
            <div className="bg-white p-3 rounded-lg shadow-sm aa:w-12 aa:h-12 ab:w-14 ab:h-14 ac:w-16 ac:h-16 flex items-center justify-center">
              <Image
                src="/more.svg"
                alt={showAll ? "Show Less" : "Show More"}
                width={30}
                height={30}
                className={cn(
                  "transition-transform duration-200",
                  showAll ? "rotate-180" : ""
                )}
              />
            </div>
            <span className="aa:text-[9px] ac:text-[11px] text-gray-600">
              {showAll ? "Show Less" : "Show More"}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}

