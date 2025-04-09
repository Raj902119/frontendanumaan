'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendLineChartProps {
  data: number[]
  strokeColor?: string
  showXAxis?: boolean
  showYAxis?: boolean
  showTooltip?: boolean
  yAxisMin?: number
  yAxisMax?: number
}

export function TrendLineChart({
  data,
  strokeColor = "#3B82F6",
  showXAxis = true,
  showYAxis = true,
  showTooltip = true,
  yAxisMin,
  yAxisMax
}: TrendLineChartProps) {
  // Generate dates for last n days
  const dates = data.map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (data.length - 1 - index))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  const chartData = data.map((value, index) => ({
    date: dates[index],
    value: value
  }))

  return (
    <div style={{ width: '100%', height: 150 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: '#6B7280' }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                    <div>{payload[0].payload.date}</div>
                    <div className="font-medium">{payload[0].value}</div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={strokeColor} 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 