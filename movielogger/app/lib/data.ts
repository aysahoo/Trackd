export type MediaType = 'Movie' | 'TV shows';
export type WatchStatus = 'watched' | 'watch_later';

export interface Movie {
  id: string;
  tmdbId: string;
  title: string;
  posterUrl: string;
  rating: number;
  year: number;
  description: string;
  type: MediaType;
  status: WatchStatus;
  isStaffPick?: boolean;
}

// Types only

