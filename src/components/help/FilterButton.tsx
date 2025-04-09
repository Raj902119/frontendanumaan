import { FilterButtonProps } from "./types";

export const FilterButton = ({ label, isActive, onClick }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`
      sm:py-3.5 sm:px-7 aa:py-2 aa:px-4 rounded-3xl aa:text-sm sm:text-xl font-medium transition-colors duration-200
      ${isActive 
        ? 'bg-black text-white border-black' 
        : 'bg-white text-neutral-700 border-zinc-300/50 hover:bg-gray-50'
      } border
    `}
  >
    {label}
  </button>
);