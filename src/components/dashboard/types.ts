export interface CardProps {
    traders: number;
    title: string;
    imageUrl: string;
    yesPrice: string;
    noPrice: string;
    chance?: number;
  }
  
  export interface BannerProps {
    title: string;
    description: string;
    buttonText: string;
    imageUrl: string;
    backgroundColor: string;
  }