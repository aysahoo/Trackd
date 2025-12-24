import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Movie } from "../lib/data";

const WATCHLIST_KEY = ["watchlist"];

async function fetchWatchlist(): Promise<Movie[]> {
  const res = await fetch("/api/watchlist");
  const data = await res.json();

  if (!data.success) {
    throw new Error("Failed to fetch watchlist");
  }

  return data.data.map((item: any) => ({
    id: item.id,
    tmdbId: item.tmdbId,
    title: item.title,
    posterUrl: `https://image.tmdb.org/t/p/w500${item.poster}`,
    rating: 0,
    year: parseInt(item.year) || new Date().getFullYear(),
    description: "",
    type: item.mediaType === "tv" ? "TV shows" : "Movie",
    status: item.status === "watch_later" ? "watch_later" : "watched",
    isStaffPick: false,
  }));
}

async function addToWatchlist(movie: any): Promise<void> {
  const res = await fetch("/api/watchlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });

  if (!res.ok) {
    throw new Error("Failed to add movie to watchlist");
  }
}

export function useWatchlist() {
  return useQuery({
    queryKey: WATCHLIST_KEY,
    queryFn: fetchWatchlist,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      // Invalidate and refetch the watchlist after adding
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });
}

async function updateWatchlistStatus({ tmdbId, status }: { tmdbId: string; status: string }): Promise<void> {
  const res = await fetch("/api/watchlist", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tmdbId, status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update status");
  }
}

async function removeFromWatchlist(tmdbId: string): Promise<void> {
  const res = await fetch("/api/watchlist", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tmdbId }),
  });

  if (!res.ok) {
    throw new Error("Failed to remove from watchlist");
  }
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWatchlistStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WATCHLIST_KEY });
    },
  });
}
