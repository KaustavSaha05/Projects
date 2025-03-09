import dotenv from "dotenv";
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Log the API key to check if it's loading correctly
console.log("OMDB_API_KEY:", process.env.OMDB_API_KEY);

const OMDB_API_KEY = process.env.OMDB_API_KEY;
if (!OMDB_API_KEY) {
  throw new Error("OMDB_API_KEY environment variable is required");
}

const OMDB_API_URL = "http://www.omdbapi.com";

type Movie = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
};

export async function searchMovies(query: string): Promise<Movie[]> {
  const res = await fetch(
    `${OMDB_API_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`
  );

  if (!res.ok) {
    throw new Error(`OMDB API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.Error) {
    throw new Error(data.Error);
  }

  return data.Search || [];
}

export async function getMovieById(id: string): Promise<Movie> {
  const res = await fetch(
    `${OMDB_API_URL}/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
  );

  if (!res.ok) {
    throw new Error(`OMDB API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.Error) {
    throw new Error(data.Error);
  }

  return data;
}

