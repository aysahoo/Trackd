import { useQuery } from "@tanstack/react-query";

interface TMDBResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type: string;
  release_date?: string;
  first_air_date?: string;
}

async function searchTMDB(query: string): Promise<TMDBResult[]> {
  if (query.length < 2) {
    return [];
  }

  const res = await fetch(`/api/tmdb?query=${encodeURIComponent(query)}`);
  const data = await res.json();

  if (data.results) {
    return data.results.filter(
      (item: TMDBResult) =>
        item.media_type === "movie" || item.media_type === "tv" || item.media_type === "person"
    );
  }

  return [];
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchTMDB(query),
    enabled: query.length >= 2, // Only run query when search term is >= 2 chars
    staleTime: 5 * 60 * 1000, // 5 minutes - search results can be cached longer
  });
}
