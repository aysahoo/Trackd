"use client";

import { Movie } from "../lib/data";
import { X, Eyes, Clock, Trash, Spinner, Star, NotePencil } from "@phosphor-icons/react";
import { useUpdateStatus, useRemoveFromWatchlist } from "../hooks/useWatchlist";
import { useState } from "react";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
  const updateStatusMutation = useUpdateStatus();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();
  const [actionLoading, setActionLoading] = useState<'status' | 'delete' | 'rating' | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  if (!movie) return null;

  const handleToggleStatus = async () => {
    setActionLoading('status');
    const newStatus = movie.status === 'watched' ? 'watch_later' : 'watched';
    await updateStatusMutation.mutateAsync({ tmdbId: movie.tmdbId, status: newStatus });
    setActionLoading(null);
    onClose();
  };

  const handleRate = async (rating: number) => {
    setActionLoading('rating');
    await updateStatusMutation.mutateAsync({ tmdbId: movie.tmdbId, rating });
    setActionLoading(null);
  };

  const handleDelete = async () => {
    setActionLoading('delete');
    await removeFromWatchlistMutation.mutateAsync(movie.tmdbId);
    setActionLoading(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Modal - Bottom sheet on mobile, centered on desktop */}
      <div 
        className={`fixed inset-0 z-[101] flex items-end sm:items-center justify-center sm:p-4 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      >
        <div
          className={`w-full sm:max-w-sm bg-white dark:bg-zinc-900 rounded-t-[2rem] sm:squircle-mask sm:squircle-3xl overflow-hidden shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:translate-y-0 sm:scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero section with poster background */}
          <div className="relative h-36">
            {/* Blurred background */}
            <div className="absolute inset-0 overflow-hidden rounded-t-[2rem] sm:rounded-none">
              <img
                src={movie.posterUrl}
                alt=""
                className="w-full h-full object-cover scale-125 blur-2xl opacity-50"
              />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />
            
            {/* Drag handle - only visible on mobile, overlaid on hero */}
            <div className="absolute top-0 left-0 right-0 flex justify-center pt-3 sm:hidden z-10">
              <div className="w-10 h-1 bg-white/40 rounded-full" />
            </div>

            {/* Close button - only visible on desktop */}
            <button
              onClick={onClose}
              className="hidden sm:flex absolute top-3 right-3 w-8 h-8 items-center justify-center text-white/70 hover:text-white transition-colors z-10"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Poster - positioned to overlap hero and content */}
          <div className="flex justify-center -mt-20">
            <div className="w-32 aspect-[2/3] squircle-mask squircle-2xl overflow-hidden shadow-2xl ring-4 ring-white dark:ring-zinc-900">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="pt-4 pb-5 px-5">
            {/* Title - centered, prominent */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {movie.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {movie.year} • {movie.type}
              </p>
            </div>

            {/* Rating - centered, prominent */}
            <div 
              className="flex justify-center gap-2 mb-5"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = hoverRating !== null ? star <= hoverRating : star <= movie.rating;
                return (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    disabled={actionLoading === 'rating'}
                    className="focus:outline-none transition-transform active:scale-90 hover:scale-125 disabled:opacity-50"
                  >
                    <Star
                      size={28}
                      weight={isActive ? "fill" : "regular"}
                      className={`transition-all ${isActive 
                          ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] duration-75"
                          : "text-zinc-300 dark:text-zinc-600 duration-300"
                        }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-4" />

            {/* Actions row */}
            <div className="flex gap-2">
              {/* Status toggle - main action */}
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading !== null}
                className={`flex-1 py-3 px-4 squircle-mask squircle-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  movie.status === 'watched'
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
              >
                {actionLoading === 'status' ? (
                  <Spinner className="animate-spin" size={18} />
                ) : movie.status === 'watched' ? (
                  <><Clock size={18} weight="bold" /> Watch Later</>
                ) : (
                  <><Eyes size={18} weight="bold" /> Mark Watched</>
                )}
              </button>

              {/* Notes - square button */}
              <button
                disabled={actionLoading !== null}
                className="w-12 h-12 shrink-0 squircle-mask squircle-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <NotePencil size={20} weight="bold" />
              </button>

              {/* Delete - square button */}
              <button
                onClick={handleDelete}
                disabled={actionLoading !== null}
                className="w-12 h-12 shrink-0 squircle-mask squircle-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'delete' ? (
                  <Spinner className="animate-spin" size={20} />
                ) : (
                  <Trash size={20} weight="bold" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
