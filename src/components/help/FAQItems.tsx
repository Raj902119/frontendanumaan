import { useState } from "react";
import { FAQItemProps } from "./types";

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 w-full rounded-lg">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 aa:py-2 sm:py-3.5 bg-white rounded-lg border border-black/10"
      >
        <div className="text-base font-medium text-left">{question}</div>
        <img
          src={isOpen ? "/uparrow.svg" : "/downarrow.svg"}
          className="w-[18px] h-[18px] transition-transform duration-200"
          alt={isOpen ? "Collapse" : "Expand"}
        />
      </button>
      
      {isOpen && (
        <div className="px-4 py-3 mt-1 bg-white rounded-lg border border-black/10">
          <p className="aa:text-xs sm:text-sm text-neutral-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};