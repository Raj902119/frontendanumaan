import { ImageCard } from './ImageCard'

interface ImageCardsProps {
  cards: Array<{
    title: string;
    description: string;
    imageSrc: string;
    alt: string;
  }>;
}

export function ImageCards({ cards }: ImageCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-8 aa:gap-2 justify-items-center">
      {cards.map((card, index) => (
        <ImageCard key={index} {...card} />
      ))}
    </div>
  )
}