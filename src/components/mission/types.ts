import { ReactNode } from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

export interface ImageCardProps {
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
}

export interface ImageCardsProps {
  cards: ImageCardProps[];
}