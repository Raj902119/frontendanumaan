import { CardProps } from "./types";

export const Card = ({ 
  title, 
  subtitle, 
  highlight, 
  additionalText, 
  bgColor, 
  highlightBgColor, 
  textColor = "text-neutral-700" 
}: CardProps) => (
  <div className="flex-shrink-0 aa:w-[230px] sm:w-[450px] aa:pt-2 sm:pt-6 relative">
    <div className={`${bgColor} rounded-3xl aa:h-[125px] sm:h-[215px] relative overflow-hidden`}>
      <div className="flex flex-row aa:p-2 sm:p-6 sm:pl-0 aa:pl-0">
        <div className="w-1/2">
          <div className={`flex flex-col ${textColor}`}>
            <div className="aa:text-xs sm:text-lg font-bold mb-1 pl-6">{title}</div>
            <div className="aa:text-[10px] sm:text-lg font-light pl-6">{subtitle}</div>
            <div className={`${highlightBgColor} aa:pl-3 sm:pl-8 aa:py-1 xs:py-2 aa:text-xs sm:text-2xl font-bold inline-block rounded-sm`}>
              {highlight}
            </div>
            {additionalText && (
              <div className="aa:text-xs sm:text-xl font-bold pl-6">{additionalText}</div>
            )}
            <button className="flex items-center gap-2 bg-white text-black rounded-full aa:px-2 aa:py-1 xs:px-4 xs:py-1.5 aa:mt-2 w-fit aa:text-[8px] xs:text-sm ml-6">
              Play Now
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path 
                  d="M2 6h8M6 2l4 4-4 4" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute right-6 top-4 sm:w-[200px] sm:h-[223px] aa:w-[101px] aa:h-[118px]">
      <img src="/thinkingman.svg" alt="Thinking man" className="w-full h-full object-contain" />
    </div>
  </div>
);