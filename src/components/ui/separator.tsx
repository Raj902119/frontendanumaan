"use client"
import * as React from "react"

export const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "horizontal" | "vertical"
  }
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    className={`${
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
    } bg-gray-200 ${className || ""}`}
    {...props}
  />
))
Separator.displayName = "Separator" 