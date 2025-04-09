'use client'

import { Line } from "rc-progress"

interface LineChartProps {
  data: number[]
  height?: number
  className?: string
}

export function LineChart({ data, height = 32, className = '' }: LineChartProps) {
  // Find min and max for scaling
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  // Create points for the polyline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - (((value - min) / range) * 70 + 15) // Scale to 15-85% of height
    return `${x},${y}`
  }).join(' ')

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-500"
        />
      </svg>
    </div>
  )
} 