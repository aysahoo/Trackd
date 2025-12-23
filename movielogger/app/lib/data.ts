export type MediaType = 'Movie' | 'TV shows' | 'Anime';

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  rating: number;
  year: number;
  description: string;
  type: MediaType;
  isStaffPick?: boolean;
}

// Types only

