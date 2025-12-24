import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export interface Suggestion {
  id: string;
  friendName: string;
  friendAvatar: string;
  movieTitle: string;
  moviePoster: string;
  timestamp: string;
  tmdbId: string;
  mediaType: string;
  year: string;
  posterPath: string;
}

export interface Friend {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
}

export interface FriendsData {
  friends: Friend[];
  requests: Friend[];
  sentRequests: Friend[];
}

// Query Keys
export const SUGGESTIONS_KEY = ["suggestions"];
export const FRIENDS_KEY = ["friends"];

// Fetch Functions
async function fetchSuggestions(): Promise<Suggestion[]> {
  const res = await fetch("/api/suggestions");
  const data = await res.json();

  if (!data.success) {
    throw new Error("Failed to fetch suggestions");
  }

  return data.data.map((s: any) => ({
    id: s.id,
    friendName: s.friendName || "Unknown",
    friendAvatar: s.friendAvatar || `https://i.pravatar.cc/150?u=${s.friendId}`,
    movieTitle: s.movieTitle,
    moviePoster: s.moviePoster
      ? `https://image.tmdb.org/t/p/w92${s.moviePoster}`
      : "",
    timestamp: new Date(s.timestamp).toLocaleDateString(),
    tmdbId: s.tmdbId,
    mediaType: s.mediaType,
    year: s.year,
    posterPath: s.moviePoster,
  }));
}

async function fetchFriends(): Promise<FriendsData> {
  const res = await fetch("/api/friends");
  const data = await res.json();

  if (!data.success) {
    throw new Error("Failed to fetch friends");
  }

  const mapFriend = (f: any): Friend => ({
    id: f.id,
    userId: f.friendId,
    name: f.name || "Unknown",
    email: f.email,
    avatar: f.image || `https://i.pravatar.cc/150?u=${f.email}`,
  });

  return {
    friends: data.data.friends.map(mapFriend),
    requests: data.data.requests.map(mapFriend),
    sentRequests: data.data.sentRequests.map(mapFriend),
  };
}

// Hooks
export function useSuggestions(enabled: boolean = true) {
  return useQuery({
    queryKey: SUGGESTIONS_KEY,
    queryFn: fetchSuggestions,
    enabled,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
  });
}

export function useFriends(enabled: boolean = true) {
  return useQuery({
    queryKey: FRIENDS_KEY,
    queryFn: fetchFriends,
    enabled,
  });
}

// Mutations
export function useAddFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to add friend");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
    },
  });
}

export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/friends?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error("Failed to remove friend");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
    },
  });
}

export function useAcceptFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/friends", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "accept" }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error("Failed to accept friend request");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FRIENDS_KEY });
    },
  });
}

export function useSendSuggestion() {
  return useMutation({
    mutationFn: async (payload: {
      friendId: string;
      tmdbId: string;
      mediaType: string;
      title: string;
      year: string;
      poster: string;
    }) => {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error("Failed to send suggestion");
      }
      return res.json();
    },
  });
}

export function useDismissSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "dismissed" }),
      });
      if (!res.ok) {
        throw new Error("Failed to dismiss suggestion");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUGGESTIONS_KEY });
    },
  });
}

export function useAcceptSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      suggestion: Suggestion;
      watched: boolean;
    }) => {
      // 1. Add to watchlist
      const watchlistRes = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: payload.suggestion.tmdbId,
          media_type: payload.suggestion.mediaType,
          title: payload.suggestion.movieTitle,
          release_date: payload.suggestion.year
            ? `${payload.suggestion.year}-01-01`
            : null,
          poster_path: payload.suggestion.posterPath,
          watched: payload.watched,
        }),
      });

      if (!watchlistRes.ok) {
        throw new Error("Failed to add to watchlist");
      }

      // 2. Mark suggestion as accepted
      await fetch("/api/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: payload.suggestion.id,
          status: "accepted",
        }),
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUGGESTIONS_KEY });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
