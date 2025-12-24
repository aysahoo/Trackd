"use client";

import { useState, useEffect } from "react";
import { X, FilmSlate, User, UserPlus, Check, Trash, Eyes, PaperPlaneTilt, CaretLeft, MagnifyingGlass, Spinner, Clock, Bell } from "@phosphor-icons/react";
import { useSearch } from "../hooks/useSearch";
import { useDebounce } from "../hooks/useDebounce";
import { useWatchlist } from "../hooks/useWatchlist";
import {
  useAddFriend,
  useRemoveFriend,
  useAcceptFriend,
  useSendSuggestion,
  useDismissSuggestion,
  useAcceptSuggestion,
  Friend,
  Suggestion,
  FriendsData,
} from "../hooks/useSocial";

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: Suggestion[];
  loadingSuggestions: boolean;
  friendsData: FriendsData | undefined;
  loadingFriends: boolean;
}

type TabType = "suggestions" | "friends";

export default function SuggestionsModal({ 
  isOpen, 
  onClose,
  suggestions,
  loadingSuggestions,
  friendsData,
  loadingFriends,
}: SuggestionsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("suggestions");
  const [email, setEmail] = useState("");

  const { data: watchlist = [], isLoading: loadingWatchlist } = useWatchlist();
  const [suggestingToFriend, setSuggestingToFriend] = useState<Friend | null>(null);
  const [sendingSuggestion, setSendingSuggestion] = useState<string | null>(null);
  const [suggestionSuccess, setSuggestionSuccess] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<{ id: string; action: 'watchLater' | 'watched' | 'dismiss' } | null>(null);

  const [friendFeedback, setFriendFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [suggestionFeedback, setSuggestionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: searchResults = [], isLoading: isSearching } = useSearch(debouncedSearchQuery);

  const addFriendMutation = useAddFriend();
  const removeFriendMutation = useRemoveFriend();
  const acceptFriendMutation = useAcceptFriend();
  const sendSuggestionMutation = useSendSuggestion();
  const dismissSuggestionMutation = useDismissSuggestion();
  const acceptSuggestionMutation = useAcceptSuggestion();

  const friends = friendsData?.friends ?? [];
  const requests = friendsData?.requests ?? [];
  const sentRequests = friendsData?.sentRequests ?? [];

  const handleStartSuggest = (friend: Friend) => {
    setSuggestingToFriend(friend);
    setSearchQuery("");
  };

  const handleBackToFriends = () => {
    setSuggestingToFriend(null);
    setSearchQuery("");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSendSuggestion = async (movie: any) => {
    if (!suggestingToFriend) return;

    const movieId = movie.tmdbId || movie.id;
    setSendingSuggestion(movieId);
    setSuggestionSuccess(null);


    let posterPath = movie.poster || movie.poster_path;
    if (!posterPath && movie.posterUrl) {

      const match = movie.posterUrl.match(/\/w\d+(\/.+)$/);
      posterPath = match ? match[1] : null;
    }

    let mediaType = movie.mediaType || movie.media_type;
    if (!mediaType && movie.type) {
      mediaType = movie.type === "TV shows" ? "tv" : "movie";
    }

    try {
      await sendSuggestionMutation.mutateAsync({
        friendId: suggestingToFriend.userId,
        tmdbId: movieId,
        mediaType: mediaType,
        title: movie.title || movie.name,
        year: movie.year || (movie.release_date || movie.first_air_date)?.split('-')[0],
        poster: posterPath,
      });

      setSuggestionSuccess(movieId);
      setTimeout(() => {
        setSuggestionSuccess(null);
      }, 1500);
    } catch (error) {
      console.error("Failed to send suggestion:", error);
    } finally {
      setSendingSuggestion(null);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setSearchQuery("");
      setSuggestingToFriend(null);
    }
  }, [isOpen]);

  const handleAddFriend = async () => {
    if (email.trim() && email.includes("@")) {
      setFriendFeedback(null);
      try {
        await addFriendMutation.mutateAsync(email.trim());
        setEmail("");
        setFriendFeedback({ type: 'success', message: 'Request sent!' });
        setTimeout(() => setFriendFeedback(null), 1500);
      } catch (error: unknown) {
        setFriendFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Failed to add friend' });
        setTimeout(() => setFriendFeedback(null), 1500);
      }
    }
  };

  const handleRemoveFriend = async (id: string) => {
    try {
      await removeFriendMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  const handleAcceptRequest = async (id: string) => {
    try {
      await acceptFriendMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to accept friend:", error);
    }
  };

  const handleDismissSuggestion = async (id: string) => {
    setProcessingAction({ id, action: 'dismiss' });
    try {
      await dismissSuggestionMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to dismiss suggestion:", error);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleAddToWatchlist = async (suggestion: Suggestion, watched: boolean = true) => {
    setProcessingAction({ id: suggestion.id, action: watched ? 'watched' : 'watchLater' });
    setSuggestionFeedback(null);
    try {
      await acceptSuggestionMutation.mutateAsync({ suggestion, watched });
    } catch (error) {
      console.error("Failed to accept suggestion:", error);
      setSuggestionFeedback({ type: 'error', message: 'Failed to add to watchlist' });
      setTimeout(() => setSuggestionFeedback(null), 4000);
    } finally {
      setProcessingAction(null);
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
                  <Bell size={18} className="text-zinc-400 dark:text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">Social</span>
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
              <div className={`h-full overflow-y-auto scrollbar-hide px-2 pt-2 ${loadingSuggestions || suggestions.length === 0 ? 'pb-2 flex items-center justify-center' : 'pb-12 space-y-2 [mask-image:linear-gradient(to_bottom,black_calc(100%-48px),transparent_100%)]'}`}>
                {/* Suggestion Error Feedback */}
                {suggestionFeedback && (
                  <div className={`mx-2 mb-2 px-3 py-2 squircle-mask squircle-lg text-xs font-medium ${
                    suggestionFeedback.type === 'success' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {suggestionFeedback.message}
                  </div>
                )}
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
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleAddToWatchlist(suggestion, false)}
                          disabled={processingAction?.id === suggestion.id}
                          className={`p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 transition-all ${
                            processingAction?.id === suggestion.id
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400'
                          }`}
                          title="Watch Later"
                        >
                          {processingAction?.id === suggestion.id && processingAction?.action === 'watchLater' ? (
                            <Spinner className="animate-spin" size={16} />
                          ) : (
                            <Clock size={16} weight="bold" />
                          )}
                        </button>
                        <button
                          onClick={() => handleAddToWatchlist(suggestion, true)}
                          disabled={processingAction?.id === suggestion.id}
                          className={`p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 transition-all ${
                            processingAction?.id === suggestion.id
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400'
                          }`}
                          title="Watched"
                        >
                          {processingAction?.id === suggestion.id && processingAction?.action === 'watched' ? (
                            <Spinner className="animate-spin" size={16} />
                          ) : (
                            <Eyes size={16} weight="bold" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDismissSuggestion(suggestion.id)}
                          disabled={processingAction?.id === suggestion.id}
                          className={`p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 transition-all ${
                            processingAction?.id === suggestion.id
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400'
                          }`}
                          title="Dismiss"
                        >
                          {processingAction?.id === suggestion.id && processingAction?.action === 'dismiss' ? (
                            <Spinner className="animate-spin" size={16} />
                          ) : (
                            <X size={16} weight="bold" />
                          )}
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

                <div className={`h-full overflow-y-auto scrollbar-hide px-2 pt-2 ${loadingWatchlist && searchQuery.length <= 2 ? 'pb-2 flex items-center justify-center' : 'pb-12 space-y-2 [mask-image:linear-gradient(to_bottom,black_calc(100%-48px),transparent_100%)]'}`}>
                  {/* Search Results State */}
                  {searchQuery.length > 2 ? (
                    isSearching ? (
                      <div className="flex justify-center py-12">
                        <Spinner className="animate-spin text-zinc-400" size={24} />
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((item) => (
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
                            disabled={sendingSuggestion === item.id.toString() || suggestionSuccess === item.id.toString()}
                            className={`self-center px-3 py-1.5 squircle-mask squircle-lg text-xs font-medium transition-all min-w-[70px] flex items-center justify-center gap-1 ${
                              suggestionSuccess === item.id.toString()
                                ? 'bg-emerald-500 text-white'
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                            }`}
                          >
                            {sendingSuggestion === item.id.toString() ? (
                              <Spinner className="animate-spin" size={14} />
                            ) : suggestionSuccess === item.id.toString() ? (
                              <><Check size={14} weight="bold" /> Sent!</>
                            ) : (
                              'Suggest'
                            )}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                        <p className="text-sm">No results found for &quot;{searchQuery}&quot;</p>
                      </div>
                    )
                  ) : loadingWatchlist ? (
                    <Spinner className="animate-spin text-zinc-400" size={24} />
                  ) : (
                    <>
                      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1">From Your Watchlist</h3>
                      {watchlist.length > 0 ? (
                        watchlist.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl group"
                          >
                            <div className="w-10 h-14 bg-zinc-200 squircle-mask squircle-lg shrink-0 overflow-hidden">
                              {item.posterUrl ? (
                                <img
                                  src={item.posterUrl.replace('/w500/', '/w92/')}
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
                <div className="px-2">
                  <div className="flex gap-2">
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
                      disabled={!email.trim() || !email.includes("@") || addFriendMutation.isPending}
                      className="squircle-mask squircle-xl bg-black text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-all flex items-center justify-center w-[52px] h-[44px]"
                    >
                      {addFriendMutation.isPending ? (
                        <Spinner className="animate-spin" size={16} />
                      ) : friendFeedback?.type === 'success' ? (
                        <Check size={16} weight="bold" className="text-emerald-400" />
                      ) : friendFeedback?.type === 'error' ? (
                        <X size={16} weight="bold" className="text-red-400" />
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                </div>

                {/* Friends List */}
                <div className={`flex-1 overflow-y-auto scrollbar-hide px-2 pt-2 ${loadingFriends ? 'pb-2 flex items-center justify-center' : 'pb-12 space-y-2 [mask-image:linear-gradient(to_bottom,black_calc(100%-48px),transparent_100%)]'}`}>
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
                                    className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                                  >
                                    <Check size={16} weight="bold" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveFriend(request.id)}
                                    className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
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
                                    className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                                    title="Suggest a movie"
                                  >
                                    <PaperPlaneTilt size={16} weight="bold" />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveFriend(friend.id)}
                                    className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                                    title="Remove friend"
                                  >
                                    <Trash size={16} weight="bold" />
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
                                  className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all"
                                  title="Cancel request"
                                >
                                  <X size={16} weight="bold" />
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
