import Image from 'next/image'

interface ImageCardProps {
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
}

export function ImageCard({ title, description, imageSrc, alt }: ImageCardProps) {
  return (
    <div className="flex flex-col items-center w-[300px] sm:p-6 aa:p-2 bg-white rounded-lg">
      <div className="xl:w-[300px] xl:h-[350px] sm:w-[225px] sm:h-[275px] relative mb-2">
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className="object-contain"
        />
      </div>
      <h3 className="sm:text-xl aa:text-lg font-semibold text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  )
}