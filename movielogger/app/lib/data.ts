export type MediaType = 'Movie' | 'Web Series' | 'Anime';

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

