"use client"
import { useState } from "react";
import { Card } from '../../components/help/Card';
import { FAQItem } from '../../components/help/FAQItems';
import { FilterButton } from '../../components/help/FilterButton';
import { helpCards, secondRowCards, faqItems, filterButtons } from "../../components/help/data";

export default function HelpPage() {
  const [activeButton, setActiveButton] = useState("Top Question");
  
  return (
    <main className="w-full aa:py-2">
      <div className="container mx-auto flex flex-col items-center px-4">
        <h1 className="lg:mt-10 lg:text-4xl aa:text-sm sm:text-2xl sm:mt-4 aa:mt-4 font-extrabold text-neutral-700">
          How can we help you?
        </h1>
        <p className="aa:mt-2 sm:text-2xl lg:mt-5 lg:text-4xl aa:text-xs font-medium text-center text-neutral-700">
          Have questions about our product or features? <br />
          We're here to help and answer any questions you might have.
        </p>
        
        <div className="lg:mt-14 sm:mt-4 w-full max-w-screen-xl">
          {/* First row of cards */}
          <div className="mb-6 w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4 min-w-min">
              {helpCards.map((card, index) => (
                <Card key={index} {...card} />
              ))}
            </div>
          </div>
          
          {/* Second row of cards */}
          <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4 min-w-min">
              {secondRowCards.map((card, index) => (
                <Card key={index} {...card} />
              ))}
            </div>
          </div>
        </div>

        <h2 className="aa:text-xl aa:mt-4 sm:mt-16 sm:text-4xl font-extrabold text-neutral-700">
          Frequently asked questions
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-4 mt-5">
          {filterButtons.map((button) => (
            <FilterButton
              key={button.label}
              {...button}
              isActive={activeButton === button.label}
              onClick={() => setActiveButton(button.label)}
            />
          ))}
        </div>

        <div className="aa:w-[300px] sm:w-[633px] aa:mt-0 sm:mt-12 mb-12">
          {faqItems.map((item, index) => (
            <FAQItem key={index} {...item} />
          ))}
        </div>
      </div>
    </main>
  );
}