import Image from "next/image"

interface EventCardProps {
  title: string
  settledValue: number
  invested: number
  settledReturns: number
  rank: number
}

export function EventCard({
  title,
  settledValue,
  invested,
  settledReturns,
  rank,
}: EventCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="aa:h-8 aa:w-8 sm:h-16 sm:w-16 overflow-hidden rounded-lg">
          <Image
            src="/yono.svg"
            alt="Event icon"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <h1 className="aa:text-base xs:text-2xl font-semibold">{title}</h1>
      </div>
      
      <div className="rounded-lg border bg-white aa:p-2 sm:p-6 text-card-foreground">
        <div className="space-y-4">
          <div>
            <p className="aa:text-sm sm:text-3xl font-bold text-green-600">₹{settledValue.toFixed(2)}</p>
            <p className="aa:text-xs sm:text-sm text-muted-foreground">Settled value</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="aa:text-sm sm:text-xl font-semibold">₹{invested.toFixed(2)}</p>
              <p className="aa:text-xs sm:text-sm  text-muted-foreground">Invested</p>
            </div>
            <div className="aa:text-center">
              <p className="aa:text-sm sm:text-xl font-semibold text-green-600">₹{settledReturns.toFixed(2)}</p>
              <p className="aa:text-xs sm:text-sm  text-muted-foreground">Settled returns</p>
            </div>
            <div className="aa:text-right">
              <p className="aa:text-sm sm:text-xl font-semibold text-blue-600">{rank}</p>
              <p className="aa:text-xs sm:text-sm  text-muted-foreground">Rank</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

