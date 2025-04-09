"use client"
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PredictionCard } from "@/components/dashboard/PredictionCard"

type FilterType = "all" | "match" | "over" | "team"

export default function CricketDashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    // Here you would typically fetch or filter data based on the selected filter
    console.log(`Filter changed to: ${filter}`)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 aa:mb-4 xs:mb-6">
        <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">SA20</span>
        </div>
        <h1 className="aa:text-base sm:text-xl font-bold">PRVJSK</h1>
      </div>

      {/* Scoreboard */}
      <Card className="bg-[#2A2A2A] text-white rounded-xl overflow-hidden mb-6">
        <div className="aa:p-2 aa:pb-0 sm:p-4">
          <div className="text-center mb-4">
            <h2 className="text-white text-4xl font-bold">2</h2>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
              <span>JSK 146/6</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏏</span>
              <span>PR 6/0</span>
            </div>
          </div>

          <div className="text-gray-400 text-xs mt-2">
            CRR 18.00 · L Pretorius: 6(2) · J Root: 0(0) · PR needs 141 runs in 118 balls
          </div>
        </div>

        <div className="bg-[#1F1F1F] p-2 mt-2 flex items-center gap-2 text-sm">
          <span className="text-gray-400">OV 0.2</span>
          <span className="w-6 h-6 rounded bg-[#4299E1] flex items-center justify-center">4</span>
          <span className="w-6 h-6 rounded flex items-center justify-center">2</span>
        </div>
      </Card>

      {/* Navigation */}
      <Tabs defaultValue="trade" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trade" className="aa:text-xs">Trade</TabsTrigger>
          <TabsTrigger value="portfolio" className="aa:text-xs">My Portfolio</TabsTrigger>
          <TabsTrigger value="scorecard" className="aa:text-xs">Full Scorecard</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mb-4 overflow-x-auto">
        <Button
          variant={activeFilter === "all" ? "secondary" : "ghost"}
          className={activeFilter === "all" ? "bg-zinc-900 text-white" : ""}
          onClick={() => handleFilterChange("all")}
        >
          All
        </Button>
        <Button
          variant={activeFilter === "match" ? "secondary" : "ghost"}
          className={activeFilter === "match" ? "bg-zinc-900 text-white" : ""}
          onClick={() => handleFilterChange("match")}
        >
          Match
        </Button>
        <Button
          variant={activeFilter === "over" ? "secondary" : "ghost"}
          className={activeFilter === "over" ? "bg-zinc-900 text-white" : ""}
          onClick={() => handleFilterChange("over")}
        >
          Over
        </Button>
        <Button
          variant={activeFilter === "team" ? "secondary" : "ghost"}
          className={activeFilter === "team" ? "bg-zinc-900 text-white" : ""}
          onClick={() => handleFilterChange("team")}
        >
          Team
        </Button>
      </div>

      {/* Trading Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PredictionCard
          traders={20415}
          title="Paarl to win the match vs Johannesburg?"
          imageUrl="/ipl.svg"
          yesPrice="₹6.5"
          noPrice="₹3.5"
        />

        <PredictionCard
          traders={195}
          title="Paarl to score 12 runs or more at the end of 2 overs vs Johannesburg?"
          imageUrl="/ipl.svg"
          yesPrice="₹6.5"
          noPrice="₹3.5"
        />

<PredictionCard
          traders={195}
          title="Paarl to score 12 runs or more at the end of 2 overs vs Johannesburg?"
          imageUrl="/ipl.svg"
          yesPrice="₹6.5"
          noPrice="₹3.5"
        />
      </div>
    </div>
  )
}

