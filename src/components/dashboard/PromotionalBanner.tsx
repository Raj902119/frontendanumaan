interface BannerProps {
  title: string
  description: string
  buttonText: string
  imageUrl: string
  backgroundColor: string
  className?: string
}

export const PromotionalBanner = ({
  title,
  description,
  buttonText,
  imageUrl,
  backgroundColor
}: BannerProps) => (
  <div className="flex-shrink-0 md:w-[449px] md:h-[149px] aa:w-[287px] ab:w-[342px] ac:w-[390px] aa:h-[100px]">
    <div className={`h-full ${backgroundColor} rounded-[5px] flex items-center`}>
      <div className="flex flex-col justify-between h-full md:p-4 aa:py-2 aa:px-4 flex-1">
        <div>
          <h3 className="md:text-xl aa:text-[15px] font-medium text-white md:mb-2 aa:mb-[2px]">
            {title}
          </h3>
          <p className="text-white md:text-base aa:text-[12px] font-normal opacity-90">
            {description}
          </p>
        </div>
        <button className="mt-auto w-fit md:h-[32px] md:w-[120px] aa:h-[20px] aa:w-[56px] text-white bg-black/30 rounded-md font-medium">
          <span className="md:text-base aa:text-[8px] flex align-middle justify-center">{buttonText}</span>
        </button>
      </div>
      <div className="h-full flex items-center">
        <img
          src={imageUrl}
          alt={title}
          className="md:w-[125px] md:h-[125px] aa:h-[80px] aa:w-[80px] object-contain"
        />
      </div>
    </div>
  </div>
);