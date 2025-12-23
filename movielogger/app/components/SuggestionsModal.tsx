"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, FilmSlate, User, UserPlus, Plus, Check, Trash, Eyes, PaperPlaneTilt, CaretLeft, MagnifyingGlass, Spinner } from "@phosphor-icons/react";
import { useSearch } from "../hooks/useSearch";
import { useDebounce } from "../hooks/useDebounce";

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Types for suggestions and friends
interface Suggestion {
  id: string;
  friendName: string;
  friendAvatar: string;
  movieTitle: string;
  moviePoster: string;
  timestamp: string;
}

interface Friend {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
}

type TabType = "suggestions" | "friends";

export default function SuggestionsModal({ isOpen, onClose }: SuggestionsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("suggestions");
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<Friend[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [addingFriend, setAddingFriend] = useState(false);

  // Suggest from watchlist state
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [suggestingToFriend, setSuggestingToFriend] = useState<Friend | null>(null);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);
  const [sendingSuggestion, setSendingSuggestion] = useState<string | null>(null); // Track which item is being sent
  const [suggestionSuccess, setSuggestionSuccess] = useState<string | null>(null); // Track successful suggestion

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: searchResults = [], isLoading: isSearching } = useSearch(debouncedSearchQuery);

  const fetchWatchlist = async () => {
    setLoadingWatchlist(true);
    try {
      const res = await fetch('/api/watchlist');
      const data = await res.json();
      if (data.success) {
        setWatchlist(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const handleStartSuggest = (friend: Friend) => {
    setSuggestingToFriend(friend);
    setSearchQuery("");
    fetchWatchlist();
  };

  const handleBackToFriends = () => {
    setSuggestingToFriend(null);
    setSearchQuery("");
  };

  const handleSendSuggestion = async (movie: any) => {
    if (!suggestingToFriend) return;

    const movieId = movie.tmdbId || movie.id;
    setSendingSuggestion(movieId);
    setSuggestionSuccess(null);

    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friendId: suggestingToFriend.userId,
          tmdbId: movieId,
          mediaType: movie.mediaType || movie.media_type,
          title: movie.title || movie.name,
          year: movie.year || (movie.release_date || movie.first_air_date)?.split('-')[0],
          poster: movie.poster || movie.poster_path
        }),
      });

      if (res.ok) {
        setSuggestionSuccess(movieId);
        // Auto-clear success after 2 seconds (stay on view to allow more suggestions)
        setTimeout(() => {
          setSuggestionSuccess(null);
        }, 1500);
      } else {
        console.error("Failed to send suggestion");
      }
    } catch (error) {
      console.error("Failed to send suggestion:", error);
    } finally {
      setSendingSuggestion(null);
    }
  };

  // Fetch friends when tab is active
  useEffect(() => {
    if (isOpen && activeTab === 'friends') {
      fetchFriends();
    }
  }, [isOpen, activeTab]);

  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const res = await fetch('/api/friends');
      const data = await res.json();
      if (data.success) {
        setFriends(data.data.friends.map((f: any) => ({
          id: f.id,
          userId: f.friendId,
          name: f.name || 'Unknown',
          email: f.email,
          avatar: f.image || `https://i.pravatar.cc/150?u=${f.email}`,
        })));
        setRequests(data.data.requests.map((f: any) => ({
          id: f.id,
          userId: f.friendId,
          name: f.name || 'Unknown',
          email: f.email,
          avatar: f.image || `https://i.pravatar.cc/150?u=${f.email}`,
        })));
        setSentRequests(data.data.sentRequests.map((f: any) => ({
          id: f.id,
          userId: f.friendId,
          name: f.name || 'Unknown',
          email: f.email,
          avatar: f.image || `https://i.pravatar.cc/150?u=${f.email}`,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setSearchQuery("");
      setSuggestingToFriend(null);
    }
  }, [isOpen]);

  const handleAddFriend = async () => {
    if (email.trim() && email.includes("@")) {
      setAddingFriend(true);
      try {
        const res = await fetch('/api/friends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json();

        if (data.success) {
          // If request sent successfully, we might not get the full object back or we just want to update the sent requests list
          // Re-fetching is easier to ensure consistent state
          fetchFriends();
          setEmail("");
          alert("Request sent!");
        } else {
          alert(data.error || "Failed to add friend");
        }
      } catch (error) {
        console.error("Failed to add friend:", error);
        alert("Failed to add friend");
      } finally {
        setAddingFriend(false);
      }
    }
  };

  const handleRemoveFriend = async (id: string) => {
    try {
      const res = await fetch(`/api/friends?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFriends((prev) => prev.filter((f) => f.id !== id));
        setRequests((prev) => prev.filter((f) => f.id !== id));
        setSentRequests((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      const res = await fetch('/api/friends', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'accept' }),
      });
      const data = await res.json();
      if (data.success) {
        // Move from requests to friends
        fetchFriends(); // Refresh to get correct statuses
      }
    } catch (error) {
      console.error("Failed to accept friend:", error);
    }
  };

  // Fetch suggestions when tab is active
  useEffect(() => {
    if (isOpen && activeTab === 'suggestions') {
      fetchSuggestions();
    }
  }, [isOpen, activeTab]);

  const fetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch('/api/suggestions');
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.data.map((s: any) => ({
          id: s.id,
          friendName: s.friendName || 'Unknown',
          friendAvatar: s.friendAvatar || `https://i.pravatar.cc/150?u=${s.friendId}`, // Fallback if no avatar
          movieTitle: s.movieTitle,
          moviePoster: s.moviePoster ? `https://image.tmdb.org/t/p/w92${s.moviePoster}` : '', // Ensure full URL if not stored
          timestamp: new Date(s.timestamp).toLocaleDateString(),
          tmdbId: s.tmdbId,
          mediaType: s.mediaType,
          year: s.year,
          posterPath: s.moviePoster, // Raw path for API
        })));
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleDismissSuggestion = async (id: string) => {
    try {
      const res = await fetch('/api/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'dismissed' }),
      });
      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to dismiss suggestion:", error);
    }
  };

  const queryClient = useQueryClient();

  const handleAddToWatchlist = async (suggestion: any) => {
    try {
      // 1. Add to watchlist
      const watchlistRes = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: suggestion.tmdbId,
          media_type: suggestion.mediaType,
          title: suggestion.movieTitle,
          release_date: suggestion.year ? `${suggestion.year}-01-01` : null, // Approx
          poster_path: suggestion.posterPath
        }),
      });

      if (watchlistRes.ok) {
        // 2. Mark suggestion as accepted
        await fetch('/api/suggestions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: suggestion.id, status: 'accepted' }),
        });
        setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
        queryClient.invalidateQueries({ queryKey: ["watchlist"] }); // Refresh watchlist
        alert("Added to watchlist!");
      } else {
        alert("Failed to add to watchlist");
      }
    } catch (error) {
      console.error("Failed to accept suggestion:", error);
    }
  };


  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <div
          className={`w-full max-w-md h-[500px] bg-[#f2f2f2] dark:bg-zinc-900 squircle-mask squircle-3xl shadow-2xl transition-transform duration-300 flex flex-col ${isOpen ? "scale-100" : "scale-95"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-2">
              {suggestingToFriend ? (
                <>
                  <button
                    onClick={handleBackToFriends}
                    className="p-1 -ml-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                  >
                    <CaretLeft size={20} weight="bold" />
                  </button>
                  <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500 truncate max-w-[200px]">
                    Suggesting to <span className="text-zinc-900 dark:text-zinc-200">{suggestingToFriend.name}</span>
                  </span>
                </>
              ) : (
                <>
                  <Eyes size={18} className="text-zinc-400 dark:text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">Lookup</span>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 squircle-mask squircle-lg text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Tab Navigation */}
          {!suggestingToFriend && (
            <div className="flex gap-2 px-5 pb-4">
              <button
                onClick={() => setActiveTab("suggestions")}
                className={`flex items-center gap-2 px-4 py-2 squircle-mask squircle-xl text-sm font-medium transition-all ${activeTab === "suggestions"
                  ? "bg-black text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
              >
                <FilmSlate size={16} />
                Suggestions
              </button>
              <button
                onClick={() => setActiveTab("friends")}
                className={`flex items-center gap-2 px-4 py-2 squircle-mask squircle-xl text-sm font-medium transition-all ${activeTab === "friends"
                  ? "bg-black text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
              >
                <User size={16} />
                Friends
              </button>
            </div>
          )}

          {/* Content */}
          <div className="px-3 pb-3 flex-1 overflow-hidden">
            {activeTab === "suggestions" && !suggestingToFriend ? (
              <div className={`h-full overflow-y-auto custom-scrollbar p-2 ${loadingSuggestions || suggestions.length === 0 ? 'flex items-center justify-center' : 'space-y-2'}`}>
                {loadingSuggestions ? (
                  <Spinner className="animate-spin text-zinc-400" size={24} />
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl"
                    >
                      {/* Movie Poster */}
                      <div className="w-12 h-16 bg-zinc-200 squircle-mask squircle-lg shrink-0 overflow-hidden">
                        {suggestion.moviePoster ? (
                          <img
                            src={suggestion.moviePoster}
                            alt={suggestion.movieTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-700 text-zinc-500">
                            <FilmSlate size={20} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                          {suggestion.movieTitle}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src={suggestion.friendAvatar}
                            alt={suggestion.friendName}
                            className="w-4 h-4 rounded-full"
                          />
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            {suggestion.friendName}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                          {suggestion.timestamp}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleAddToWatchlist(suggestion)}
                          className="p-2 squircle-mask squircle-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                        >
                          <Plus size={14} weight="bold" />
                        </button>
                        <button
                          onClick={() => handleDismissSuggestion(suggestion.id)}
                          className="p-2 squircle-mask squircle-lg bg-zinc-100 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-all"
                        >
                          <X size={14} weight="bold" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center text-zinc-400 dark:text-zinc-500">
                    <FilmSlate size={40} className="mb-3 opacity-50" />
                    <p className="text-sm">No suggestions yet</p>
                    <p className="text-xs mt-1">Ask your friends to suggest movies!</p>
                  </div>
                )}
              </div>
            ) : suggestingToFriend ? (
              // Suggestion Selection View
              <div className="flex flex-col h-full">
                {/* Search Bar */}
                <div className="px-2 pb-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-800 squircle-mask squircle-xl">
                    <MagnifyingGlass size={18} className="text-zinc-400 dark:text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search for a movie or show..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="h-full overflow-y-auto custom-scrollbar p-2 space-y-2">
                  {/* Search Results State */}
                  {searchQuery.length > 2 ? (
                    isSearching ? (
                      <div className="flex justify-center py-12">
                        <Spinner className="animate-spin text-zinc-400" size={24} />
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((item: any) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl group"
                        >
                          <div className="w-10 h-14 bg-zinc-200 squircle-mask squircle-lg shrink-0 overflow-hidden">
                            {item.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                alt={item.title || item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-700 text-zinc-500">
                                <FilmSlate size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                              {item.title || item.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                                {item.media_type}
                              </span>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                • {(item.release_date || item.first_air_date)?.split('-')[0]}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSendSuggestion(item)}
                            disabled={sendingSuggestion === item.id || suggestionSuccess === item.id}
                            className={`self-center px-3 py-1.5 squircle-mask squircle-lg text-xs font-medium transition-all min-w-[70px] flex items-center justify-center gap-1 ${
                              suggestionSuccess === item.id
                                ? 'bg-emerald-500 text-white'
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                            }`}
                          >
                            {sendingSuggestion === item.id ? (
                              <Spinner className="animate-spin" size={14} />
                            ) : suggestionSuccess === item.id ? (
                              <><Check size={14} weight="bold" /> Sent!</>
                            ) : (
                              'Suggest'
                            )}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                        <p className="text-sm">No results found for "{searchQuery}"</p>
                      </div>
                    )
                  ) : (
                    // Default to Watchlist
                    <>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">From Your Watchlist</h3>
                      {loadingWatchlist ? (
                        <div className="flex justify-center py-12">
                          <Spinner className="animate-spin text-zinc-400" size={24} />
                        </div>
                      ) : watchlist.length > 0 ? (
                        watchlist.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl group"
                          >
                            <div className="w-10 h-14 bg-zinc-200 squircle-mask squircle-lg shrink-0 overflow-hidden">
                              {item.poster ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${item.poster}`}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                  <FilmSlate size={20} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h4 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                                {item.title}
                              </h4>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {item.year}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSendSuggestion(item)}
                              disabled={sendingSuggestion === (item.tmdbId || item.id) || suggestionSuccess === (item.tmdbId || item.id)}
                              className={`self-center px-3 py-1.5 squircle-mask squircle-lg text-xs font-medium transition-all min-w-[70px] flex items-center justify-center gap-1 ${
                                suggestionSuccess === (item.tmdbId || item.id)
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                              }`}
                            >
                              {sendingSuggestion === (item.tmdbId || item.id) ? (
                                <Spinner className="animate-spin" size={14} />
                              ) : suggestionSuccess === (item.tmdbId || item.id) ? (
                                <><Check size={14} weight="bold" /> Sent!</>
                              ) : (
                                'Suggest'
                              )}
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                          <p className="text-sm">Your watchlist is empty</p>
                          <p className="text-xs mt-1">Search above to find movies to suggest</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col space-y-3">
                {/* Add Friend Input */}
                <div className="flex gap-2 p-2">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl">
                    <UserPlus size={18} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
                    <input
                      type="email"
                      placeholder="Enter email to add friend"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-900 dark:text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddFriend()}
                    />
                  </div>
                  <button
                    onClick={handleAddFriend}
                    disabled={!email.trim() || !email.includes("@") || addingFriend}
                    className="px-4 squircle-mask squircle-xl bg-black text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
                  >
                    {addingFriend ? '...' : 'Add'}
                  </button>
                </div>

                {/* Friends List */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar p-2 ${loadingFriends ? 'flex items-center justify-center' : 'space-y-2'}`}>
                  {loadingFriends ? (
                    <Spinner className="animate-spin text-zinc-400" size={24} />
                  ) : friends.length + requests.length + sentRequests.length > 0 ? (
                    <>
                      {/* Received Requests */}
                      {requests.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">Requests</h3>
                          <div className="space-y-2">
                            {requests.map((request) => (
                              <div
                                key={request.id}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl"
                              >
                                <img
                                  src={request.avatar}
                                  alt={request.name}
                                  className="w-10 h-10 rounded-full shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                                    {request.name}
                                  </h4>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                    {request.email}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleAcceptRequest(request.id)}
                                    className="p-2 squircle-mask squircle-lg text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                                  >
                                    <Check size={16} weight="bold" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveFriend(request.id)}
                                    className="p-2 squircle-mask squircle-lg text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                                  >
                                    <X size={16} weight="bold" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Friends */}
                      {friends.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">Friends</h3>
                          <div className="space-y-2">
                            {friends.map((friend) => (
                              <div
                                key={friend.id}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl"
                              >
                                <img
                                  src={friend.avatar}
                                  alt={friend.name}
                                  className="w-10 h-10 rounded-full shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                                    {friend.name}
                                  </h4>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                    {friend.email}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleStartSuggest(friend)}
                                    className="p-2 squircle-mask squircle-lg text-zinc-400 hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                                    title="Suggest a movie"
                                  >
                                    <PaperPlaneTilt size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveFriend(friend.id)}
                                    className="p-2 squircle-mask squircle-lg text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sent Requests */}
                      {sentRequests.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">Sent</h3>
                          <div className="space-y-2">
                            {sentRequests.map((request) => (
                              <div
                                key={request.id}
                                className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl opacity-75"
                              >
                                <img
                                  src={request.avatar}
                                  alt={request.name}
                                  className="w-10 h-10 rounded-full shrink-0 grayscale"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                                    {request.name}
                                  </h4>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                    {request.email}
                                  </p>
                                </div>
                                <span className="text-xs text-zinc-400 italic px-2">Pending</span>
                                <button
                                  onClick={() => handleRemoveFriend(request.id)}
                                  className="p-2 squircle-mask squircle-lg text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                      <User size={40} className="mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No friends added yet</p>
                      <p className="text-xs mt-1">Add friends using their email above</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
