'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CardProps } from './types';
import { Speedometer } from './Speedometer';
import { Drawer } from '@/components/ui/drawer';
import Image from "next/image";
import { OrderBook } from '@/components/prediction/OrderBook'
import { TradingSection } from '@/components/prediction/TradingSection'

export const PredictionCard = ({
  traders,
  title,
  imageUrl,
  yesPrice,
  noPrice,
  chance = 45
}: CardProps) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);

  const handleTradeClick = (type: 'yes' | 'no') => {
    setSelectedOption(type);
    setIsDrawerOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking Yes/No buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push('/predictionview');
  };

  return (
    <>
      <div className="w-full" onClick={handleCardClick}>
        <div className="sm:px-6 sm:py-4 aa:px-4 aa:py-2 ab:px-4 bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer">
          <div className="flex gap-1 text-neutral-700 font-normal">
            <Image
              src="/profile.svg"
              alt="Profile"
              width={15}
              height={15}
              className="sm:w-[15px] sm:h-[15px] aa:w-[12px] aa:h-[12px] aspect-[0.29]"
            />
            <div className="flex items-center aa:text-[10px] sm:text-[12px]">{traders} traders</div>
          </div>
          <div className="w-full mx-auto flex gap-5 justify-between text-neutral-700">
            <Image
              src={imageUrl}
              alt={title}
              width={60}
              height={60}
              className="sm:w-[60px] aspect-[0.97] sm:h-[60px] aa:w-[50px] aa:h-[50px] aa:mt-2 sm:mt-4 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="aa:text-xs sm:text-sm font-medium">{title}</div>
              <Speedometer percentage={chance} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="mt-4 flex gap-4 justify-center align-middle">
              <button 
                onClick={(e) => { e.stopPropagation(); handleTradeClick('yes'); }}
                className="w-[50%] sm:h-9 aa:h-8 text-blue-600 bg-blue-100 hover:bg-blue-500 hover:text-white rounded-md aa:font-medium"
              >
                <span className='aa:text-[12px] sm:text-[16px]'>Yes</span>
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleTradeClick('no'); }}
                className="w-[50%] sm:h-9 aa:h-8 text-red-600 bg-red-100 hover:bg-red-500 hover:text-white rounded-md aa:font-medium"
              >
                <span className='aa:text-[12px] sm:text-[16px]'>No</span>
              </button>
            </div>
            
            <div className="flex justify-center gap-4">
              <div className="w-[45%] flex justify-center gap-2 font-medium aa:text-[10px] sm:text-[12px]">
                <span className="text-neutral-400">{yesPrice}</span>
                <Image src="/arrow.svg" alt="Arrow" width={22} height={7} className="w-[22px] aspect-[3.14]" />
                <span className="text-emerald-600">₹281</span>
              </div>
              <div className="w-[45%] flex justify-center gap-2 font-medium aa:text-[10px] sm:text-[12px]">
                <span className="text-neutral-400">{noPrice}</span>
                <Image src="/arrow.svg" alt="Arrow" width={22} height={7} className="w-[22px] aspect-[3.14] text-neutral-100" />
                <span className="text-emerald-600">₹281</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="px-6 py-12 space-y-6">
          <div className="flex items-start gap-4">
            <Image
              src={imageUrl}
              alt="Event thumbnail"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h1 className="aa:text-base xs:text-xl font-semibold">{title}</h1>
              <div className="flex items-center gap-2 aa:text-xs xs:text-sm text-muted-foreground">
                <span>Wed 2:45 AM</span>
                <span>·</span>
                <span>Jan 31 2026</span>
              </div>
            </div>
          </div>
          <div className="sm:w-[335px] md:w-[350px] lg:w-[400px] space-y-4 mx-auto">
            <TradingSection 
              selectedOption={selectedOption}
              onOptionSelect={setSelectedOption}
            />
          </div>

          <OrderBook />
        </div>
      </Drawer>
    </>
  );
};