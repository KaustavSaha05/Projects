import { Movie } from "../../../shared/schema";
import { Card, CardContent } from "../components/ui/card";
import { Link } from "wouter";
import React from "react";
import { Skeleton } from "../components/ui/skeleton";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.imdbID}`}>
      <Card className="overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer shadow-md hover:shadow-xl">
        <CardContent className="p-0 relative">
          <HoverCard>
            <HoverCardTrigger asChild>
              {movie.Poster && movie.Poster !== "N/A" ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  loading="lazy"
                  className="w-full aspect-[2/3] object-cover transition-opacity hover:opacity-90"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Poster</span>
                </div>
              )}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{movie.Title}</h4>
                {movie.Plot && (
                  <p className="text-xs text-muted-foreground line-clamp-3">{movie.Plot}</p>
                )}
                {movie.imdbRating && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">IMDb Rating:</span>
                    <span className="text-xs">{movie.imdbRating}/10</span>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="p-4">
            <h3 className="font-medium truncate">{movie.Title}</h3>
            <p className="text-sm text-muted-foreground">{movie.Year}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-md">
      <CardContent className="p-0">
        <Skeleton className="w-full aspect-[2/3]" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
