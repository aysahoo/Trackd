"use client";

import { useState, useEffect, useRef } from "react";
import { MagnifyingGlass, Spinner, Plus, Check } from "@phosphor-icons/react";
import { useSearch } from "../hooks/useSearch";
import { useDebounce } from "../hooks/useDebounce";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (movie: any) => Promise<void>;
}

export default function SearchModal({ isOpen, onClose, onAdd }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [addingId, setAddingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // TanStack Query hook for searching
  const { data: results = [], isLoading: loading } = useSearch(debouncedQuery);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    } else {
      // Focus input when opened
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleAdd = async (movie: any) => {
    setAddingId(movie.id);
    await onAdd(movie);
    setAddingId(null);
  };


  return (
    <>
      <div 
        className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[101] w-full max-w-md px-4 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
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
          <div className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${query.length > 0 || results.length > 0 || loading ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
               <div className="overflow-y-auto max-h-[60vh] p-2 space-y-2 border-b border-zinc-200/50 dark:border-zinc-800/50 custom-scrollbar">
              {loading ? (
                  <div className="flex justify-center py-8">
                  <Spinner className="animate-spin text-zinc-400" size={24} />
                  </div>
              ) : results.length > 0 ? (
                  results.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 squircle-mask squircle-xl transition-colors group">
                      <div className="w-10 h-14 bg-zinc-200 squircle-mask squircle-lg shrink-0 overflow-hidden">
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
                      </div>
                      </div>

                      <div className="flex items-center self-center">
                      <button 
                          onClick={() => handleAdd(item)}
                          disabled={addingId === item.id}
                          className="p-2 squircle-mask squircle-lg bg-transparent text-zinc-400 dark:text-zinc-500 hover:bg-[#e5e5e5] dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {addingId === item.id ? <Spinner className="animate-spin" size={16} /> : <Plus size={16} weight="bold" />}
                      </button>
                      </div>
                  </div>
                  ))
              ) : query.length > 2 ? (
                  <div className="text-center py-8 text-zinc-400 text-sm">No results found</div>
              ) : null}
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
