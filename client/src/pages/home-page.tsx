import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/use-auth";
import { Movie, Watchlist } from "../../../shared/schema";
import { MovieGrid } from "../components/movie-grid";
import { SearchBar } from "../components/search-bar";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import React from "react";

export default function HomePage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: movies, isLoading, error } = useQuery<Movie[]>({
    queryKey: ["/api/movies/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      return res.json();
    },
    enabled: searchQuery.length > 0
  });

  const { data: watchlist, isLoading: watchlistLoading } = useQuery<Watchlist[]>({
    queryKey: ["/api/watchlist"]
  });

  const { data: watchlistMovies } = useQuery<Movie[]>({
    queryKey: ["/api/watchlist/movies", watchlist],
    queryFn: async () => {
      if (!watchlist?.length) return [];
      const moviePromises = watchlist.map(item =>
        fetch(`/api/movies/${item.movieId}`).then(res => res.json())
      );
      return Promise.all(moviePromises);
    },
    enabled: !!watchlist?.length
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MovieFlix</h1>
          <SearchBar onSearch={setSearchQuery} />
          <div className="flex items-center gap-4">
            <span className="text-foreground">Welcome, {user?.username}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Error: {error.message}
          </div>
        ) : searchQuery ? (
          <>
            <h2 className="text-xl font-semibold mb-6">Search Results</h2>
            <MovieGrid movies={movies || []} />
          </>
        ) : watchlistLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-6">Your Watchlist</h2>
            <MovieGrid movies={watchlistMovies || []} />
          </>
        )}
      </main>
    </div>
  );
}