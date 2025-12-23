"use client";

import { useState, useEffect } from "react";
import { X, FilmSlate, User, UserPlus, Plus, Check, Trash, Eyes } from "@phosphor-icons/react";

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
  name: string;
  email: string;
  avatar: string;
}

type TabType = "suggestions" | "friends";

export default function SuggestionsModal({ isOpen, onClose }: SuggestionsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("suggestions");
  const [email, setEmail] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
    }
  }, [isOpen]);

  const handleAddFriend = () => {
    if (email.trim() && email.includes("@")) {
      const newFriend = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email.trim(),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      };
      setFriends((prev) => [...prev, newFriend]);
      setEmail("");
    }
  };

  const handleRemoveFriend = (id: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddToWatchlist = (id: string) => {
    // For now, just dismiss it - will connect to backend later
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`w-full max-w-md h-[500px] bg-[#f2f2f2] dark:bg-zinc-900 squircle-mask squircle-3xl shadow-2xl transition-transform duration-300 flex flex-col ${
            isOpen ? "scale-100" : "scale-95"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-2">
              <Eyes size={18} className="text-zinc-400 dark:text-zinc-500" />
              <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">Lookup</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 squircle-mask squircle-lg text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 px-5 pb-4">
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`flex items-center gap-2 px-4 py-2 squircle-mask squircle-xl text-sm font-medium transition-all ${
                activeTab === "suggestions"
                  ? "bg-black text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <FilmSlate size={16} />
              Suggestions
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`flex items-center gap-2 px-4 py-2 squircle-mask squircle-xl text-sm font-medium transition-all ${
                activeTab === "friends"
                  ? "bg-black text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <User size={16} />
              Friends
            </button>
          </div>

          {/* Content */}
          <div className="px-3 pb-3 flex-1 overflow-hidden">
            {activeTab === "suggestions" ? (
              <div className="h-full overflow-y-auto custom-scrollbar p-2 space-y-2">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex gap-3 p-3 bg-white dark:bg-zinc-800 squircle-mask squircle-xl"
                    >
                      {/* Movie Poster */}
                      <div className="w-12 h-16 bg-zinc-200 squircle-mask squircle-lg shrink-0 overflow-hidden">
                        <img
                          src={suggestion.moviePoster}
                          alt={suggestion.movieTitle}
                          className="w-full h-full object-cover"
                        />
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
                          onClick={() => handleAddToWatchlist(suggestion.id)}
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
                  <div className="text-center py-12 text-zinc-400 dark:text-zinc-500">
                    <FilmSlate size={40} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No suggestions yet</p>
                    <p className="text-xs mt-1">Ask your friends to suggest movies!</p>
                  </div>
                )}
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
                    disabled={!email.trim() || !email.includes("@")}
                    className="px-4 squircle-mask squircle-xl bg-black text-white dark:bg-zinc-100 dark:text-zinc-900 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
                  >
                    Add
                  </button>
                </div>

                {/* Friends List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                  {friends.length > 0 ? (
                    friends.map((friend) => (
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
                        <button
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="p-2 squircle-mask squircle-lg text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    ))
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
