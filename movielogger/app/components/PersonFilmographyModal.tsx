"use client";

import { X, FilmSlate, Spinner, Eyes, Clock, CaretLeft, User } from "@phosphor-icons/react";
import { usePersonCredits, PersonCredit } from "../hooks/usePersonCredits";
import { useMemo, useState } from "react";
import { Movie } from "../lib/data";

interface PersonFilmographyModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: number | null;
  personName: string;
  personImage: string | null;
  personRole: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAdd: (movie: any) => Promise<void>;
  existingMovies?: Movie[];
}

export default function PersonFilmographyModal({
  isOpen,
  onClose,
  personId,
  personName,
  personImage,
  personRole,
  onAdd,
  existingMovies = [],
}: PersonFilmographyModalProps) {
  const { data, isLoading } = usePersonCredits(isOpen ? personId : null);
  const [addingId, setAddingId] = useState<{ id: number; type: 'watched' | 'watch_later' } | null>(null);

  const watchedIds = useMemo(() => 
    new Set(existingMovies.filter(m => m.status === 'watched').map(m => m.tmdbId)), 
    [existingMovies]
  );
  const watchLaterIds = useMemo(() => 
    new Set(existingMovies.filter(m => m.status === 'watch_later').map(m => m.tmdbId)), 
    [existingMovies]
  );

  const handleAdd = async (credit: PersonCredit, status: 'watched' | 'watch_later') => {
    setAddingId({ id: credit.id, type: status });
    await onAdd({
      id: credit.id,
      title: credit.title || credit.name,
      poster_path: credit.poster_path,
      media_type: credit.media_type,
      release_date: credit.release_date,
      first_air_date: credit.first_air_date,
      status,
    });
    setAddingId(null);
  };
  const credits = data?.credits?.filter(
    (c: PersonCredit) => c.media_type === 'movie' || c.media_type === 'tv'
  ) || [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[102] bg-black/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal - Slide from right */}
      <div
        className={`fixed inset-y-0 right-0 z-[103] w-full max-w-sm transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full bg-[#f2f2f2] dark:bg-zinc-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={onClose}
              className="p-2 -ml-1 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            
            {/* Person Info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                {personImage ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${personImage}`}
                    alt={personName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                  {personName}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {personRole}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              <X size={18} weight="bold" />
            </button>
          </div>

          {/* Credits List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner className="animate-spin text-zinc-400" size={24} />
              </div>
            ) : credits.length > 0 ? (
              credits.map((credit: PersonCredit) => {
                const creditId = credit.id.toString();
                const isWatched = watchedIds.has(creditId);
                const isWatchLater = watchLaterIds.has(creditId);
                const isInLibrary = isWatched || isWatchLater;

                return (
                  <div
                    key={credit.id}
                    className="flex gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl"
                  >
                    {/* Poster */}
                    <div className="w-10 h-14 bg-zinc-200 dark:bg-zinc-700 rounded-lg shrink-0 overflow-hidden">
                      {credit.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${credit.poster_path}`}
                          alt={credit.title || credit.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <FilmSlate size={16} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-medium text-sm text-zinc-900 dark:text-white truncate">
                        {credit.title || credit.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="capitalize">
                          {credit.media_type === 'tv' ? 'TV' : 'Movie'}
                        </span>
                        <span>•</span>
                        <span>
                          {(credit.release_date || credit.first_air_date)?.split('-')[0] || 'N/A'}
                        </span>
                        {credit.character && (
                          <>
                            <span>•</span>
                            <span className="truncate">{credit.character}</span>
                          </>
                        )}
                        {credit.job && !credit.character && (
                          <>
                            <span>•</span>
                            <span className="truncate">{credit.job}</span>
                          </>
                        )}
                      </div>
                      {isInLibrary && (
                        <div className="mt-1">
                          {isWatched && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <Eyes size={10} weight="fill" /> Watched
                            </span>
                          )}
                          {isWatchLater && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                              <Clock size={10} weight="fill" /> Watch Later
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!isInLibrary && (
                      <div className="flex items-center gap-1 self-center">
                        <button
                          onClick={() => handleAdd(credit, 'watched')}
                          disabled={addingId?.id === credit.id}
                          className="p-2 rounded-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all disabled:opacity-50"
                          title="Mark as Watched"
                        >
                          {addingId?.id === credit.id && addingId?.type === 'watched' ? (
                            <Spinner className="animate-spin" size={16} />
                          ) : (
                            <Eyes size={16} weight="bold" />
                          )}
                        </button>
                        <button
                          onClick={() => handleAdd(credit, 'watch_later')}
                          disabled={addingId?.id === credit.id}
                          className="p-2 rounded-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all disabled:opacity-50"
                          title="Watch Later"
                        >
                          {addingId?.id === credit.id && addingId?.type === 'watch_later' ? (
                            <Spinner className="animate-spin" size={16} />
                          ) : (
                            <Clock size={16} weight="bold" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-500">
                <FilmSlate size={40} className="mb-3 opacity-50" />
                <p className="text-sm">No filmography found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
