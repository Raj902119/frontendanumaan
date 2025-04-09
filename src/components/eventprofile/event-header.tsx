import Image from "next/image"

interface EventHeaderProps {
  title: string
  probability: number
}

export function EventHeader({ title, probability }: EventHeaderProps) {
  return (
    <div className="space-y-4 flex items-center gap-4">
      <div className="relative xs:h-16 xs:w-16 aa:h-8 aa:w-8 flex-shrink-0 overflow-hidden rounded-lg bg-pink-100">
        <Image
          src="/Chess.svg"
          alt="Event icon"
          layout="fill"
          className="object-cover"
        />
      </div>
      <div className="space-y-1 flex-grow">
        <h1 className="aa:text-base xs:text-2xl font-semibold">{title}</h1>
        <div className="flex items-center gap-2">
          <span className="aa:text-xs xs:text-lg text-muted-foreground">PROBABILITY OF YES</span>
          <span className="text-blue-500 font-medium">{probability.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  )
}

