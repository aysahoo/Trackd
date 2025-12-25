"use client";

import { Movie } from "../lib/data";
import { Clock, Eyes, Spinner, Star } from "@phosphor-icons/react";
import { useUpdateStatus } from "../hooks/useWatchlist";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  view?: "grid" | "list";
  onOpenDetails: (movie: Movie) => void;
}

export default function MovieCard({ movie, view = "grid", onOpenDetails }: MovieCardProps) {
  const updateStatusMutation = useUpdateStatus();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMarkAsWatched = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUpdating(true);
    await updateStatusMutation.mutateAsync({ tmdbId: movie.tmdbId, status: 'watched' });
    setIsUpdating(false);
  };

  if (view === "list") {
    return (
      <div
        onClick={() => onOpenDetails(movie)}
        className="squircle-mask squircle-2xl bg-[#f2f2f2] dark:bg-zinc-900 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all duration-200 overflow-hidden"
      >
        <div className="relative overflow-hidden aspect-[2/3]">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {movie.rating > 0 && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 squircle-mask squircle-md bg-black/60 backdrop-blur-sm flex items-center gap-1">
              <Star size={12} weight="fill" className="text-yellow-400" />
              <span className="text-[10px] font-bold text-white">{movie.rating}</span>
            </div>
          )}
          {movie.status === "watch_later" && (
            <button
              onClick={handleMarkAsWatched}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={isUpdating}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 p-1.5 squircle-mask squircle-lg bg-black/50 hover:bg-emerald-600 transition-all"
              title="Mark as Watched"
            >
              {isUpdating ? (
                <Spinner className="animate-spin text-white" size={14} />
              ) : isHovered ? (
                <Eyes size={14} weight="fill" className="text-white" />
              ) : (
                <Clock size={14} weight="fill" className="text-amber-400" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenDetails(movie)}
      className="relative overflow-hidden aspect-[2/3] squircle-mask squircle-2xl cursor-pointer"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      {movie.rating > 0 && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 squircle-mask squircle-md bg-black/60 backdrop-blur-sm flex items-center gap-1">
          <Star size={12} weight="fill" className="text-yellow-400" />
          <span className="text-[10px] font-bold text-white">{movie.rating}</span>
        </div>
      )}
      {movie.status === "watch_later" && (
        <button
          onClick={handleMarkAsWatched}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={isUpdating}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 p-1.5 squircle-mask squircle-lg bg-black/50 hover:bg-emerald-600 transition-all"
          title="Mark as Watched"
        >
          {isUpdating ? (
            <Spinner className="animate-spin text-white" size={14} />
          ) : isHovered ? (
            <Eyes size={14} weight="fill" className="text-white" />
          ) : (
            <Clock size={14} weight="fill" className="text-amber-400" />
          )}
        </button>
      )}
    </div>
  );
}
