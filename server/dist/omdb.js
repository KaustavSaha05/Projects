"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMovies = searchMovies;
exports.getMovieById = getMovieById;
if (!process.env.OMDB_API_KEY) {
    throw new Error("OMDB_API_KEY environment variable is required");
}
const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_API_URL = "http://www.omdbapi.com";
async function searchMovies(query) {
    const res = await fetch(`${OMDB_API_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    if (!res.ok) {
        throw new Error(`OMDB API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (data.Error) {
        throw new Error(data.Error);
    }
    return data.Search || [];
}
async function getMovieById(id) {
    const res = await fetch(`${OMDB_API_URL}/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`);
    if (!res.ok) {
        throw new Error(`OMDB API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (data.Error) {
        throw new Error(data.Error);
    }
    return data;
}
