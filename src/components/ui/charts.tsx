"use client"

import { Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface ChartProps {
  data: ChartData<any, any>
  xAxis?: string
  yAxis?: string
  valueKey?: string
  categoryKey?: string
}

export function LineChart({ data }: ChartProps) {
  return <Line data={data} options={{ responsive: true }} />
}

export function PieChart({ data }: ChartProps) {
  return <Pie data={data} options={{ responsive: true }} />
} 