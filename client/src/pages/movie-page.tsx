import { useQuery, useMutation } from "@tanstack/react-query";
import { Movie } from "@/shared/schema";
import { useRoute } from "wouter";
import { Button } from "../components/ui/button";
import { Loader2, Plus, Check } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient";
import React from "react";

export default function MoviePage() {
  const [, params] = useRoute<{ id: string }>("/movie/:id");
  const movieId = params ? params.id : null;

  const { data: movie, isLoading } = useQuery<Movie>({
    queryKey: [`/api/movies/${movieId}`],
  });

  const { data: watchlist } = useQuery<any[]>({
    queryKey: ["/api/watchlist"],
  });

  const isInWatchlist = watchlist?.some((item) => item.movieId === movieId);

  const addToWatchlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/watchlist", {
        movieId,
        added_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
    },
  });

  if (isLoading || !movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {movie.Poster && (
          <div className="absolute inset-0">
            <div
              className="w-full h-[70vh] bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.Poster})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-6 pt-[40vh]">
          <div className="flex gap-8">
            {movie.Poster && (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-64 rounded-lg shadow-xl"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
              <div className="flex gap-4 text-muted-foreground mb-6">
                <span>{movie.Year}</span>
                {movie.imdbRating && (
                  <span>IMDb: {movie.imdbRating}</span>
                )}
                {movie.Genre && <span>{movie.Genre}</span>}
              </div>
              <p className="text-lg mb-6">{movie.Plot}</p>
              <div className="space-y-2">
                {movie.Director && (
                  <p>
                    <span className="font-semibold">Director:</span>{" "}
                    {movie.Director}
                  </p>
                )}
                {movie.Actors && (
                  <p>
                    <span className="font-semibold">Cast:</span> {movie.Actors}
                  </p>
                )}
              </div>
              <Button
                className="mt-8"
                onClick={() => addToWatchlistMutation.mutate()}
                disabled={addToWatchlistMutation.isPending || isInWatchlist}
              >
                {addToWatchlistMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isInWatchlist ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {isInWatchlist ? "Added to Watchlist" : "Add to Watchlist"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}