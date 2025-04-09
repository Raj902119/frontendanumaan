"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface ActivityItem {
  id: string
  question: string
  thumbnail: string
  user: {
    name: string
    avatarGradient: string
  }
  action: {
    type: "Yes" | "No" | "Lightning"
    price: number
    total: number
  }
  timestamp: string
}

const activityData: ActivityItem[] = [
  {
    id: "1",
    question: "Will Trump declare a national emergency on his first day?",
    thumbnail: "/yono.svg?height=48&width=48",
    user: {
      name: "Ric...",
      avatarGradient: "from-purple-500 to-yellow-400",
    },
    action: {
      type: "No",
      price: 0.14,
      total: 1.14,
    },
    timestamp: "9s ago",
  },
  {
    id: "2",
    question: "Will Trump declare a national emergency on his first day?",
    thumbnail: "/yono.svg?height=48&width=48",
    user: {
      name: "Iam..",
      avatarGradient: "from-purple-600 to-purple-400",
    },
    action: {
      type: "No",
      price: 0.14,
      total: 1.29,
    },
    timestamp: "9s ago",
  },
  {
    id: "3",
    question: "Will Trae Young lead the NBA in Assists?",
    thumbnail: "/yono.svg?height=48&width=48",
    user: {
      name: "vds..",
      avatarGradient: "from-blue-500 to-purple-500",
    },
    action: {
      type: "Yes",
      price: 0.82,
      total: 1000.86,
    },
    timestamp: "9s ago",
  },
  {
    id: "4",
    question: "Will Superman be the top grossing movie of 2025?",
    thumbnail: "/yono.svg?height=48&width=48",
    user: {
      name: "0xs...",
      avatarGradient: "from-red-500 to-yellow-500",
    },
    action: {
      type: "Yes",
      price: 0.08,
      total: 20000.02,
    },
    timestamp: "9s ago",
  },
  {
    id: "5",
    question: "Lightning vs. Maple Leafs",
    thumbnail: "/yono.svg?height=48&width=48",
    user: {
      name: "gre..",
      avatarGradient: "from-green-400 to-emerald-500",
    },
    action: {
      type: "Lightning",
      price: 0.44,
      total: 300.85,
    },
    timestamp: "9s ago",
  },
  {
    id: "6",
    question: "Will Caitlyn Jenner attend presidential inauguration?",
    thumbnail: "/yono.svg?height=48&width=48",
    user: {
      name: "JAN..",
      avatarGradient: "from-green-400 to-teal-500",
    },
    action: {
      type: "Yes",
      price: 0.87,
      total: 5.0,
    },
    timestamp: "9s ago",
  },
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}


function ActivityItem({ item }: { item: ActivityItem }) {
  return (
    <div>
          <div className="flex items-center gap-3 py-4 aa:pt-4 aa:pb-0 sm:pb-4">
      <Image src={item.thumbnail || "/placeholder.svg"} alt="" width={48} height={48} className="rounded-md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-gray-600 aa:text-xs sm:text-lg">{item.question}</p>
        <div className="aa:hidden sm:block">
        <div className="flex items-center gap-2">
          <div className={`h-6 w-6 rounded-full bg-gradient-to-r ${item.user.avatarGradient}`} />
          <span className="font-medium">{item.user.name}</span>
          <span className="text-gray-600">bought</span>
          <span
            className={`font-medium ${
              item.action.type === "Yes"
                ? "text-green-600"
                : item.action.type === "No"
                  ? "text-red-600"
                  : "text-blue-600"
            }`}
          >
            {item.action.type}
          </span>
          <span className="text-gray-600">at {(item.action.price * 100).toFixed(0)}¢</span>
          <span className="text-gray-400">({formatCurrency(item.action.total)})</span>
        </div>
        </div>
      </div>
      <span className="shrink-0 aa:text-xs sm:text-sm text-gray-400">{item.timestamp}</span>
    </div>
    <div className="sm:hidden flex items-center justify-center gap-2 py-2">
          <div className={`h-3 w-3 rounded-full bg-gradient-to-r ${item.user.avatarGradient}`} />
          <span className="text-xs font-medium">{item.user.name}</span>
          <span className="text-xs text-gray-600">bought</span>
          <span
            className={`text-xs font-medium ${
              item.action.type === "Yes"
                ? "text-green-600"
                : item.action.type === "No"
                  ? "text-red-600"
                  : "text-blue-600"
            }`}
          >
            {item.action.type}
          </span>
          <span className="text-xs text-gray-600">at {(item.action.price * 100).toFixed(0)}¢</span>
          <span className="text-xs text-gray-400">({formatCurrency(item.action.total)})</span>
        </div>
    </div>
  )
}

export default function ActivityFeed() {
  const [minAmount, setMinAmount] = useState<number>(0);
  
  const filteredActivities = activityData.filter(item => 
    item.action.total >= minAmount
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-5xl mx-auto px-8 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="sm:text-2xl aa:text-lg font-semibold">Activity</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="gap-1">
              <Button variant="outline" className="bg-gray-50 hover:bg-gray-100 aa:px-2 aa:py-1">
                <span className="aa:text-xs sm:mr-2 aa:mr-0">Min amount</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMinAmount(0)}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMinAmount(10)}>₹10</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMinAmount(100)}>₹100</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMinAmount(1000)}>₹1,000</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMinAmount(10000)}>₹10,000</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="divide-y">
          {filteredActivities.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

