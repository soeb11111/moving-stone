export type Format = 'reel' | 'post' | 'carousel' | 'poster' | 'film';

export type Category =
  | 'Commercial'
  | 'Music Video'
  | 'Documentary'
  | 'Branded'
  | 'Personal';

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: Category;
  format: Format;
  duration: string;
  imageUrl: string;
  videoUrl: string;
  gradient: string;
  year: string;
}
