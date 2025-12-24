"use client";


import { useState, useEffect } from "react";
import MovieCard from "./components/MovieCard";
import { MediaType, Movie } from "./lib/data";
import SearchModal from "./components/SearchModal";
import SuggestionsModal from "./components/SuggestionsModal";
import MovieDetailsModal from "./components/MovieDetailsModal";
import { authClient } from "@/lib/auth-client";
import { GoogleLogo, MagnifyingGlass, Plus, Moon, Sun, SignOut, Bell } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useWatchlist, useAddToWatchlist } from "./hooks/useWatchlist";
import { useSuggestions, useFriends } from "./hooks/useSocial";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();
  const { theme, setTheme } = useTheme();
  const [activeFilter, setActiveFilter] = useState<MediaType | "All">("All");

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [initialSearchKey, setInitialSearchKey] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // All data fetches in parallel on page load
  const { data: movies = [], isLoading: loading } = useWatchlist();
  const { data: suggestions = [], isLoading: loadingSuggestions } = useSuggestions();
  const { data: friendsData, isLoading: loadingFriends } = useFriends();

  const addToWatchlistMutation = useAddToWatchlist();

  const handleAddMovie = async (movie: any) => {
    await addToWatchlistMutation.mutateAsync(movie);
  };

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  const filteredMovies = activeFilter === "All" 
    ? movies 
    : movies.filter(m => m.type === activeFilter);

  const filters: (MediaType | "All")[] = ["All", "Movie", "TV shows", "Anime"];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSearchOpen || isSuggestionsOpen || isProfileOpen) return;
      
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      if (
        e.key.length === 1 && 
        !e.ctrlKey && 
        !e.metaKey && 
        !e.altKey &&
        /[a-zA-Z0-9]/.test(e.key)
      ) {
        e.preventDefault();
        setInitialSearchKey(e.key);
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isSuggestionsOpen, isProfileOpen]);
  


  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 pb-32">
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => {
          setIsSearchOpen(false);
          setInitialSearchKey("");
        }} 
        onAdd={handleAddMovie}
        initialQuery={initialSearchKey}
        existingMovies={movies}
      />
      <SuggestionsModal
        isOpen={isSuggestionsOpen}
        onClose={() => setIsSuggestionsOpen(false)}
        suggestions={suggestions}
        loadingSuggestions={loadingSuggestions}
        friendsData={friendsData}
        loadingFriends={loadingFriends}
      />
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={selectedMovie !== null}
        onClose={() => setSelectedMovie(null)}
      />

      <header className="max-w-[1400px] mx-auto mb-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-hide min-w-0 pr-4">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 squircle-mask squircle-2xl text-[13px] font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                  activeFilter === filter
                    ? "bg-black text-white dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-[#f2f2f2] text-zinc-600 hover:bg-gray-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {filter === "Movie" ? "Movies" : filter}
              </button>
            ))}
          </div>
          
          {isPending ? (
            <div className="w-9 h-9 squircle-mask squircle-2xl bg-[#f2f2f2] dark:bg-zinc-900 animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 squircle-mask squircle-2xl overflow-hidden relative block hover:opacity-80 transition-opacity"
              >
                <img
                  src={session.user.image || ""}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover"
                />
              </button>
              
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  <div className="absolute top-full right-0 mt-2 w-48 squircle-mask squircle-2xl bg-[#f2f2f2] dark:bg-zinc-900 drop-shadow-xl p-2 z-50 flex flex-col gap-1">
                    <button 
                      onClick={() => {
                        setTheme(theme === 'dark' ? 'light' : 'dark');
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium squircle-mask squircle-lg transition-all w-full text-left text-zinc-600 hover:bg-gray-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium squircle-mask squircle-lg transition-all w-full text-left text-red-600 hover:bg-gray-200 dark:text-red-400 dark:hover:bg-zinc-800"
                    >
                      <SignOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-4 py-2 squircle-mask squircle-2xl text-[13px] font-medium bg-[#f2f2f2] text-zinc-600 hover:bg-gray-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all duration-200 whitespace-nowrap flex items-center gap-2"
            >
              <GoogleLogo size={16} weight="bold" />
              Sign in
            </button>
          )}
        </div>
      </header>
      
      <main className="max-w-[1400px] mx-auto">
        {loading ? (
             <div className="text-center py-20 text-zinc-500">Loading your watchlist...</div>
        ) : filteredMovies.length === 0 ? (
             <div className="text-center py-20 text-zinc-500">Your watchlist is empty. Add some movies!</div>
         ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onOpenDetails={setSelectedMovie} />
          ))}
        </div>
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 flex flex-col-reverse sm:flex-row items-end sm:items-center gap-2">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className={`w-full sm:flex-1 squircle-mask squircle-3xl bg-[#f2f2f2]/80 dark:bg-zinc-900/80 backdrop-blur-md drop-shadow-md p-4 flex items-center gap-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-[#e5e5e5] dark:hover:bg-zinc-900 transition-all duration-300 group ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <MagnifyingGlass size={20} weight="bold" className="text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
          <span className="text-[15px] font-medium grow text-left">Search</span>
          <div className="flex items-center justify-center w-6 h-6 squircle-mask squircle-md bg-white dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500">
            <Plus size={12} weight="bold" />
          </div>
        </button>
        <button 
          onClick={() => setIsSuggestionsOpen(true)}
          className="h-[56px] w-[56px] flex-none flex items-center justify-center squircle-mask squircle-3xl bg-[#f2f2f2]/80 dark:bg-zinc-900/80 backdrop-blur-md drop-shadow-md text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-[#e5e5e5] dark:hover:bg-zinc-900 transition-all duration-300"
        >
           <Bell size={22} />
        </button>
      </div>
    </div>
  );
}
