"use client";

import { Movie } from "../lib/data";
import {
  X,
  Eyes,
  Clock,
  Trash,
  Spinner,
  Star,
  NotePencil,
} from "@phosphor-icons/react";
import { useUpdateStatus, useRemoveFromWatchlist } from "../hooks/useWatchlist";
import { useState, useEffect } from "react";
import { Drawer } from "vaul";

interface MovieDetailsModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

// Hook to detect mobile screen
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export default function MovieDetailsModal({
  movie,
  isOpen,
  onClose,
}: MovieDetailsModalProps) {
  const updateStatusMutation = useUpdateStatus();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();
  const [actionLoading, setActionLoading] = useState<
    "status" | "delete" | "rating" | null
  >(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const isMobile = useIsMobile();

  // Animation state - delays the visual open to allow transition
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen && movie) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      setIsVisible(false);
      // Keep rendered during exit animation
      const timeout = setTimeout(() => setShouldRender(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, movie]);

  if (!shouldRender || !movie) return null;

  const handleToggleStatus = async () => {
    setActionLoading("status");
    const newStatus = movie.status === "watched" ? "watch_later" : "watched";
    await updateStatusMutation.mutateAsync({
      tmdbId: movie.tmdbId,
      status: newStatus,
    });
    setActionLoading(null);
  };

  const handleRate = async (rating: number) => {
    setActionLoading("rating");
    await updateStatusMutation.mutateAsync({ tmdbId: movie.tmdbId, rating });
    setActionLoading(null);
  };

  const handleDelete = async () => {
    setActionLoading("delete");
    await removeFromWatchlistMutation.mutateAsync(movie.tmdbId);
    setActionLoading(null);
    onClose();
  };

  // Shared modal content
  const ModalContent = ({
    showDragHandle = false,
    showCloseButton = true,
  }: {
    showDragHandle?: boolean;
    showCloseButton?: boolean;
  }) => (
    <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] sm:squircle-mask sm:squircle-3xl overflow-hidden shadow-2xl">
      {/* Hero section with poster background */}
      <div className="relative h-24 sm:h-36">
        {/* Blurred background */}
        <div className="absolute inset-0 overflow-hidden rounded-t-[1.5rem]">
          <img
            src={movie.posterUrl}
            alt=""
            className="w-full h-full object-cover scale-125 blur-2xl opacity-50"
          />
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent" />

        {/* Drag handle - only on mobile */}
        {showDragHandle && (
          <div className="absolute top-0 left-0 right-0 flex justify-center pt-2 z-10">
            <div className="w-8 h-1 bg-white/40 rounded-full" />
          </div>
        )}

        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
          >
            <X size={18} weight="bold" />
          </button>
        )}
      </div>

      {/* Poster - positioned to overlap hero and content */}
      <div className="flex justify-center -mt-12 sm:-mt-20">
        <div className="w-20 sm:w-32 aspect-[2/3] squircle-mask squircle-2xl overflow-hidden shadow-2xl ring-[3px] sm:ring-4 ring-white dark:ring-zinc-900">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-3 pb-4 px-4 sm:pt-4 sm:pb-5 sm:px-5">
        {/* Title - centered, prominent */}
        <div className="text-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
            {movie.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1">
            {movie.year} • {movie.type}
          </p>
        </div>

        {/* Status badge */}
        <div className="flex justify-center mb-3 sm:mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
              movie.status === "watched"
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
            }`}
          >
            {movie.status === "watched" ? (
              <>
                <Eyes size={14} weight="bold" /> Watched
              </>
            ) : (
              <>
                <Clock size={14} weight="bold" /> Watch Later
              </>
            )}
          </span>
        </div>

        {/* Rating - only show for watched movies */}
        {movie.status === "watched" && (
          <>
            <div
              className="flex justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-5"
              onMouseLeave={() => setHoverRating(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive =
                  hoverRating !== null
                    ? star <= hoverRating
                    : star <= movie.rating;
                return (
                  <button
                    key={star}
                    onClick={() => {
                      // Click same rating to clear it
                      if (star === movie.rating) {
                        handleRate(0);
                      } else {
                        handleRate(star);
                      }
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    disabled={actionLoading === "rating"}
                    className="focus:outline-none transition-transform active:scale-90 disabled:opacity-50"
                  >
                    <Star
                      size={22}
                      weight={isActive ? "fill" : "regular"}
                      className={`transition-all sm:!w-7 sm:!h-7 ${
                        isActive
                          ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)] duration-75"
                          : "text-zinc-300 dark:text-zinc-600 duration-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-zinc-200 dark:bg-zinc-800 mb-3 sm:mb-4" />
          </>
        )}

        {/* Actions row */}
        <div className="flex gap-1.5 sm:gap-2">
          {/* Status toggle - main action */}
          <button
            onClick={handleToggleStatus}
            disabled={actionLoading !== null}
            className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 squircle-mask squircle-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              movie.status === "watched"
                ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {actionLoading === "status" ? (
              <Spinner className="animate-spin" size={16} />
            ) : movie.status === "watched" ? (
              <>
                <Clock size={16} weight="bold" /> Move to Watchlist
              </>
            ) : (
              <>
                <Eyes size={16} weight="bold" /> Mark as Watched
              </>
            )}
          </button>

          {/* Notes - square button */}
          <button
            disabled={actionLoading !== null}
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 squircle-mask squircle-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <NotePencil size={18} weight="bold" />
          </button>

          {/* Delete - square button */}
          <button
            onClick={handleDelete}
            disabled={actionLoading !== null}
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 squircle-mask squircle-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === "delete" ? (
              <Spinner className="animate-spin" size={18} />
            ) : (
              <Trash size={18} weight="bold" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile: Vaul bottom sheet
  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-[101] flex flex-col items-center outline-none">
            <Drawer.Title className="sr-only">{movie.title}</Drawer.Title>
            <Drawer.Description className="sr-only">
              {movie.year} • {movie.type}
            </Drawer.Description>
            <div className="mx-3 mb-3 w-[calc(100%-1.5rem)] max-w-sm">
              <ModalContent showDragHandle={true} showCloseButton={false} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // Desktop: Centered modal with smooth spring animation
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-[101] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          className={`w-full max-w-sm transition-all duration-[400ms] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${
            isVisible
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-[0.96] translate-y-4 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalContent showDragHandle={false} showCloseButton={true} />
        </div>
      </div>
    </>
  );
}
