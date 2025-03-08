import { Movie } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import React from "react";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.imdbID}`}>
      <Card className="overflow-hidden hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="p-0">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full aspect-[2/3] object-cover"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
              No Poster
            </div>
          )}
          <div className="p-4">
            <h3 className="font-medium truncate">{movie.Title}</h3>
            <p className="text-sm text-muted-foreground">{movie.Year}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}