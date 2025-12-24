"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { MagnifyingGlass, Spinner, Plus, Eyes, Clock, Trash, CaretRight, User } from "@phosphor-icons/react";
import { useSearch } from "../hooks/useSearch";
import { useDebounce } from "../hooks/useDebounce";
import { useUpdateStatus, useRemoveFromWatchlist } from "../hooks/useWatchlist";
import { Movie } from "../lib/data";
import PersonFilmographyModal from "./PersonFilmographyModal";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAdd: (movie: any) => Promise<void>;
  initialQuery?: string;
  existingMovies?: Movie[];
}

interface SelectedPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

export default function SearchModal({ isOpen, onClose, onAdd, initialQuery = "", existingMovies = [] }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [addingId, setAddingId] = useState<{ id: number; type: 'watched' | 'watch_later' } | null>(null);
  const [actionId, setActionId] = useState<{ id: number; action: 'update' | 'delete' } | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<SelectedPerson | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateStatusMutation = useUpdateStatus();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();

  const { data: results = [], isLoading: loading } = useSearch(debouncedQuery);
  const watchedIds = useMemo(() => 
    new Set(existingMovies.filter(m => m.status === 'watched').map(m => m.tmdbId)), 
    [existingMovies]
  );
  const watchLaterIds = useMemo(() => 
    new Set(existingMovies.filter(m => m.status === 'watch_later').map(m => m.tmdbId)), 
    [existingMovies]
  );

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      if (!window.visualViewport || !containerRef.current) return;
      
      const viewportHeight = window.visualViewport.height;
      const windowHeight = window.innerHeight;
      const keyboardHeight = Math.max(0, windowHeight - viewportHeight);
      
      // Direct DOM update for performance and to avoid transition lag
      containerRef.current.style.bottom = `${Math.max(32, keyboardHeight + 8)}px`;
    };

    updatePosition();
    
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);

    return () => {
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      if (containerRef.current) containerRef.current.style.bottom = '32px';
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAdd = async (movie: any, status: 'watched' | 'watch_later') => {
    setAddingId({ id: movie.id, type: status });
    await onAdd({ ...movie, status });
    setAddingId(null);
  };

  const handleUpdateStatus = async (tmdbId: string, newStatus: 'watched' | 'watch_later', itemId: number) => {
    setActionId({ id: itemId, action: 'update' });
    await updateStatusMutation.mutateAsync({ tmdbId, status: newStatus });
    setActionId(null);
  };

  const handleDelete = async (tmdbId: string, itemId: number) => {
    setActionId({ id: itemId, action: 'delete' });
    await removeFromWatchlistMutation.mutateAsync(tmdbId);
    setActionId(null);
  };


  return (
    <>
      <div 
        className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div 
        ref={containerRef}
        className={`fixed left-1/2 -translate-x-1/2 z-[101] w-full max-w-md px-4 transition-[opacity,visibility] duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        style={{ bottom: '32px' }}
      >
        <div className="relative w-full bg-[#f2f2f2]/80 dark:bg-zinc-900/80 backdrop-blur-md squircle-mask squircle-3xl flex flex-col-reverse">
          
          {/* Input Section (at bottom) */}
          <div className="flex items-center gap-3 p-4 shrink-0">
            <MagnifyingGlass size={20} weight="bold" className="text-zinc-400 dark:text-zinc-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              className="w-full text-[15px] font-medium bg-transparent outline-none placeholder:text-zinc-500 dark:placeholder:text-zinc-400 text-zinc-900 dark:text-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              onClick={onClose} 
              className="flex items-center justify-center w-6 h-6 squircle-mask squircle-md bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors shrink-0"
            >
              <Plus 
                size={12} 
                weight="bold" 
                className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
              />
            </button>
          </div>

          {/* Results Section (stacks upwards from input) */}
          <div className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${query.length > 0 || results.length > 0 || loading ? 'max-h-[300px] sm:max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
               <div className="overflow-y-auto max-h-[300px] sm:max-h-[60vh] p-2 space-y-2 border-b border-zinc-200/50 dark:border-zinc-800/50 scrollbar-hide">
              {loading ? (
                  <div className="flex justify-center py-8">
                  <Spinner className="animate-spin text-zinc-400" size={24} />
                  </div>
              ) : results.length > 0 ? (
                  results.map((item) => {
                    if (item.media_type === 'person') {
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedPerson({
                            id: item.id,
                            name: item.name || '',
                            profile_path: (item as { profile_path?: string | null }).profile_path ?? null,
                            known_for_department: (item as { known_for_department?: string }).known_for_department || 'Acting',
                          })}
                          className="w-full flex gap-4 p-3 squircle-mask squircle-xl transition-colors group hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-left"
                        >
                          <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-full shrink-0 overflow-hidden">
                            {(item as { profile_path?: string | null }).profile_path ? (
                              <img 
                                src={`https://image.tmdb.org/t/p/w92${(item as { profile_path?: string | null }).profile_path}`} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <User size={20} />
                              </div>
                            )}
                          </div>
                          
                          <div className="grow min-w-0 flex flex-col justify-center">
                            <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.name}</h3>
                            <span className="text-xs text-zinc-500">
                              {(item as { known_for_department?: string }).known_for_department || 'Person'}
                            </span>
                          </div>

                          <div className="flex items-center self-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                            <CaretRight size={16} weight="bold" />
                          </div>
                        </button>
                      );
                    }
                    const itemId = item.id.toString();
                    const isWatched = watchedIds.has(itemId);
                    const isWatchLater = watchLaterIds.has(itemId);

                    return (
                  <div key={item.id} className="flex gap-4 p-3 squircle-mask squircle-xl transition-colors group">
                      <div className="w-10 h-14 bg-zinc-200 squircle-mask squircle-lg shrink-0 overflow-hidden relative">
                      {item.poster_path ? (
                          <img 
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} 
                          alt={item.title || item.name}
                          className="w-full h-full object-cover"
                          />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300">
                          <MagnifyingGlass size={20} />
                          </div>
                      )}
                      </div>
                      
                      <div className="grow min-w-0 flex flex-col justify-center">
                      <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.title || item.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <span className="capitalize">{item.media_type === 'tv' ? 'TV shows' : 'Movie'}</span>
                          <span>•</span>
                          <span>{(item.release_date || item.first_air_date)?.split('-')[0] || 'N/A'}</span>
                          {isWatched && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                <Eyes size={12} weight="fill" />
                                Watched
                              </span>
                            </>
                          )}
                          {isWatchLater && (
                            <>
                              <span>•</span>
                              <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                                <Clock size={12} weight="fill" />
                                Watch Later
                              </span>
                            </>
                          )}
                      </div>
                      </div>

                      <div className="flex items-center gap-1 self-center">
                        {isWatched ? (
                          // Watched: show Clock (move to watch later) and Trash (delete)
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(itemId, 'watch_later', item.id)}
                              disabled={actionId?.id === item.id}
                              className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move to Watch Later"
                            >
                              {actionId?.id === item.id && actionId?.action === 'update' ? <Spinner className="animate-spin" size={16} /> : <Clock size={16} weight="bold" />}
                            </button>
                            <button 
                              onClick={() => handleDelete(itemId, item.id)}
                              disabled={actionId?.id === item.id}
                              className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove from Watchlist"
                            >
                              {actionId?.id === item.id && actionId?.action === 'delete' ? <Spinner className="animate-spin" size={16} /> : <Trash size={16} weight="bold" />}
                            </button>
                          </>
                        ) : isWatchLater ? (
                          // Watch Later: show Eye (mark as watched) and Trash (delete)
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(itemId, 'watched', item.id)}
                              disabled={actionId?.id === item.id}
                              className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark as Watched"
                            >
                              {actionId?.id === item.id && actionId?.action === 'update' ? <Spinner className="animate-spin" size={16} /> : <Eyes size={16} weight="bold" />}
                            </button>
                            <button 
                              onClick={() => handleDelete(itemId, item.id)}
                              disabled={actionId?.id === item.id}
                              className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Remove from Watchlist"
                            >
                              {actionId?.id === item.id && actionId?.action === 'delete' ? <Spinner className="animate-spin" size={16} /> : <Trash size={16} weight="bold" />}
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleAdd(item, 'watched')}
                              disabled={addingId?.id === item.id}
                              className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Mark as Watched"
                            >
                              {addingId?.id === item.id && addingId?.type === 'watched' ? <Spinner className="animate-spin" size={16} /> : <Eyes size={16} weight="bold" />}
                            </button>
                            <button 
                              onClick={() => handleAdd(item, 'watch_later')}
                              disabled={addingId?.id === item.id}
                              className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Watch Later"
                            >
                              {addingId?.id === item.id && addingId?.type === 'watch_later' ? <Spinner className="animate-spin" size={16} /> : <Clock size={16} weight="bold" />}
                            </button>
                          </>
                        )}
                      </div>
                  </div>
                    );
                  })
              ) : query.length > 2 ? (
                  <div className="text-center py-8 text-zinc-400 text-sm">No results found</div>
              ) : null}
              </div>
          </div>
        </div>
      </div>
      <PersonFilmographyModal
        isOpen={selectedPerson !== null}
        onClose={() => setSelectedPerson(null)}
        personId={selectedPerson?.id ?? null}
        personName={selectedPerson?.name ?? ''}
        personImage={selectedPerson?.profile_path ?? null}
        personRole={selectedPerson?.known_for_department ?? ''}
        onAdd={onAdd}
        existingMovies={existingMovies}
      />
    </>
  );
}
