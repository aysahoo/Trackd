"use client";

import { Movie } from "../lib/data";
import { X, Eyes, Clock, Trash, Spinner } from "@phosphor-icons/react";
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
  const [actionLoading, setActionLoading] = useState<'status' | 'delete' | null>(null);

  if (!movie) return null;

  const handleToggleStatus = async () => {
    setActionLoading('status');
    const newStatus = movie.status === 'watched' ? 'watch_later' : 'watched';
    await updateStatusMutation.mutateAsync({ tmdbId: movie.tmdbId, status: newStatus });
    setActionLoading(null);
    onClose();
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
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div 
          className={`w-full max-w-xs sm:max-w-sm bg-[#f2f2f2]/95 dark:bg-zinc-900/95 backdrop-blur-md squircle-mask squircle-3xl overflow-hidden transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Poster */}
          <div className="relative aspect-[2/3] w-full">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center squircle-mask squircle-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X size={16} weight="bold" />
            </button>
            {/* Status badge */}
            <div className="absolute bottom-3 left-3">
              <div className={`px-3 py-1.5 squircle-mask squircle-lg text-xs font-medium flex items-center gap-1.5 ${
                movie.status === 'watched' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-amber-500 text-white'
              }`}>
                {movie.status === 'watched' ? (
                  <><Eyes size={12} weight="fill" /> Watched</>
                ) : (
                  <><Clock size={12} weight="fill" /> Watch Later</>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title & Year */}
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">{movie.title}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {movie.year} • {movie.type}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleToggleStatus}
                disabled={actionLoading !== null}
                className={`flex-1 py-2.5 px-3 squircle-mask squircle-xl text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  movie.status === 'watched'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                }`}
              >
                {actionLoading === 'status' ? (
                  <Spinner className="animate-spin" size={16} />
                ) : movie.status === 'watched' ? (
                  <><Clock size={16} weight="bold" /> Watch Later</>
                ) : (
                  <><Eyes size={16} weight="bold" /> Watched</>
                )}
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading !== null}
                className="py-2.5 px-3 squircle-mask squircle-xl text-sm font-medium flex items-center justify-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === 'delete' ? (
                  <Spinner className="animate-spin" size={16} />
                ) : (
                  <Trash size={16} weight="bold" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
