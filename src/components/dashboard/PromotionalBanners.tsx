'use client'

import { useState, useEffect } from 'react';
import { PromotionalBanner } from './PromotionalBanner';

const bannerData = [
  {
    title: "New Year's Predictions",
    description: "Wait is over IPL 2025 is coming soon....",
    buttonText: "Predict",
    imageUrl: "/2025.svg",
    backgroundColor: "bg-gradient-to-r from-red-500 to-pink-400"
  },
  {
    title: "My Wallet",
    description: "Add funds to start trading today.",
    buttonText: "Deposit",
    imageUrl: "/add-money-to-wallet-2523246-2117422 1.svg",
    backgroundColor: "bg-gradient-to-r from-sky-500 to-sky-300"
  },
  {
    title: "Refer and Earn",
    description: "Earn Cash With Each Referral.",
    buttonText: "Reffer",
    imageUrl: "/refer.svg",
    backgroundColor: "bg-gradient-to-r from-teal-500 to-teal-300"
  },
  {
    title: "German election",
    description: "The fight for the future of Germany has begun",
    buttonText: "Predict",
    imageUrl: "/german-elections.svg",
    backgroundColor: "bg-gradient-to-r from-amber-500 to-amber-300"
  }
];

export const PromotionalBanners = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-2 bg-slate-50">
      <div className="md:px-5 aa:px-0">
        {/* Desktop view - scrolling banners */}
        <div className="aa:hidden xs:block relative overflow-hidden">
          <div className="flex md:gap-6 aa:gap-3 animate-scroll">
            {[...bannerData, ...bannerData].map((banner, index) => (
              <PromotionalBanner 
                key={index} 
                {...banner} 
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Mobile view - sliding banners */}
        <div className="xs:hidden relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {bannerData.map((banner, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <PromotionalBanner {...banner} />
              </div>
            ))}
          </div>
          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-2">
            {bannerData.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  currentBannerIndex === index ? 'w-4 bg-blue-500' : 'w-1.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 