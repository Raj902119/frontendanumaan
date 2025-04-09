'use client'

import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface BarChartProps {
  data: Array<{
    date: string
    volume: number
    height: number
  }>
  formatDate: (date: string) => string
  formatVolume: (volume: number) => string
}

export function BarChart({ data, formatDate, formatVolume }: BarChartProps) {
  const chartData = data.map(item => ({
    name: formatDate(item.date),
    volume: item.volume,
  }))

  return (
    <RechartsBarChart width={300} height={125} data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis 
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#6B7280' }}
      />
      <YAxis 
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 12, fill: '#6B7280' }}
        tickFormatter={(value) => `₹${value/100000}L`}
      />
      <Tooltip
        cursor={{ fill: '#f3f4f6' }}
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            const value = payload[0].value as number;
            return (
              <div className="bg-gray-800 text-white text-xs rounded py-1 px-2">
                <div>{payload[0].payload.name}</div>
                <div className="font-medium">{formatVolume(value)}</div>
              </div>
            )
          }
          return null
        }}
      />
      <Bar 
        dataKey="volume"
        fill="#93C5FD"
        radius={[4, 4, 0, 0]}
        maxBarSize={50}
      />
    </RechartsBarChart>
  )
} 