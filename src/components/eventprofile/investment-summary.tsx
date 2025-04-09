import { Button } from "@/components/ui/button"
import { Plus, ArrowRight } from 'lucide-react'

interface InvestmentSummaryProps {
  invested: number
  currentValue: number
  liveReturns: number
  exitedReturns?: string
}

export function InvestmentSummary({
  invested,
  currentValue,
  liveReturns,
  exitedReturns
}: InvestmentSummaryProps) {
  return (
    <div className="aa:space-y-4 xs:space-y-6 bg-white p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <p className="aa:text-lg xs:text-2xl font-bold">₹{invested.toFixed(2)}</p>
          <p className="aa:text-xs xs:text-sm text-muted-foreground">Invested</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="aa:text-lg xs:text-2xl font-bold">₹{currentValue.toFixed(2)}</p>
          <p className="aa:text-xs xs:text-sm text-muted-foreground">Current value</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="aa:text-lg xs:text-2xl font-bold">₹{liveReturns.toFixed(2)}</p>
          <p className="aa:text-xs xs:text-sm text-muted-foreground">Live returns</p>
        </div>
      </div>

      {exitedReturns && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </span>
          Exited returns {exitedReturns}
        </div>
      )}

      <div className="flex gap-4">
        <Button className="flex-1 bg-gray-100" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Invest
        </Button>
        <Button className="flex-1 bg-gray-100" variant="default">
          <ArrowRight className="mr-2 h-4 w-4" />
          Exit
        </Button>
      </div>
    </div>
  )
}

