"use client"
import * as React from "react"

interface SliderProps extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "value"> {
  value: number[];
  defaultValue?: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, defaultValue, step, ...props }, ref) => (
    <div ref={ref} className={`relative w-full h-5 ${className}`} {...props}>
      <div className="absolute h-2 w-full rounded-full bg-gray-100 top-1/2 transform -translate-y-1/2">
        <div className="absolute h-full bg-blue-600 rounded-full" style={{ width: `${(value[0] / max) * 100}%` }} />
        <button 
          className="absolute h-5 w-5 rounded-full bg-white border-2 border-blue-600 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${(value[0] / max) * 100}%` }}
          onMouseDown={(e) => {
            const handleMouseMove = (e: MouseEvent) => {
              const target = e.currentTarget as HTMLElement;
              const rect = target.parentElement?.getBoundingClientRect();
              if (!rect) return;
              const pos = (e.clientX - rect.left) / rect.width;
              const newValue = Math.max(min, Math.min(max, Math.round(pos * max)));
              onValueChange([newValue]);
            }
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove)
              document.removeEventListener('mouseup', handleMouseUp)
            }
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
          }}
        />
      </div>
    </div>
  )
)
Slider.displayName = "Slider"
