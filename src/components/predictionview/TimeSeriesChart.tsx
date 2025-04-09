'use client'

import { useState, useEffect, useMemo } from "react"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface TimeSeriesChartProps {
  currentChance: number
}

type TimeRange = "1h" | "6h" | "12h" | "All"

export function TimeSeriesChart({ currentChance }: TimeSeriesChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1h")

  // Generate mock data based on currentChance
  const generateData = useMemo(() => {
    const data = []
    const now = new Date()
    const points = 60 // 60 points for 1-hour view
    
    // Start with a base value close to currentChance
    let baseValue = currentChance
    
    for (let i = points; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000) // Subtract minutes
      
      // Small random fluctuation around the currentChance
      const randomVariation = (Math.random() - 0.5) * 2 // ±1% variation
      const value = Math.min(100, Math.max(0, baseValue + randomVariation))
      
      data.push({
        time: time.getTime(),
        value: Number(value.toFixed(1))
      })

      // Slightly adjust base value for next point (mean reversion to currentChance)
      baseValue = baseValue * 0.99 + currentChance * 0.01
    }
    return data
  }, [currentChance]) // Only regenerate when currentChance changes

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-6 aa:px-2 xs:px-6 aa:pt-2 xs:pt-4">
        {(["1h", "6h", "12h", "All"] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`aa:text-xs xs:text-sm font-medium pb-2 border-b-2 transition-colors ${
              selectedRange === range 
                ? 'text-black border-black' 
                : 'text-gray-400 border-transparent hover:text-gray-600'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={generateData}
            margin={{ 
              top: 10,
              right: 25,
              left: 0,
              bottom: 10
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(time) => format(time, 'hh:mm a')}
              stroke="#9CA3AF"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickCount={4}
            />
            <YAxis
              type="number"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              orientation="right"
              stroke="#9CA3AF"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              width={35}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#colorValue)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 