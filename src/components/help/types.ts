export interface CardProps {
    title: string;
    subtitle: string;
    highlight: string;
    additionalText?: string;
    bgColor: string;
    highlightBgColor: string;
    textColor?: string;
  }
  
  export interface FAQItemProps {
    question: string;
    answer: string;
  }
  
  export interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
  }