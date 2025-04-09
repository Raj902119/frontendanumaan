"use client"

import { ResponsiveContainer, Tooltip, TooltipProps } from "recharts"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps {
  children: React.ReactElement
  config: ChartConfig
  className?: string
}

export function ChartContainer({
  children,
  config,
  className,
}: ChartContainerProps) {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      {children}
    </ResponsiveContainer>
  )
}

export function ChartTooltip({
  active,
  payload,
  label,
  content,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload) return null
  if (typeof content === 'function') return content({ active, payload, label })
  return content
} 