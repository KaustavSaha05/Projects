"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const auth_1 = require("./auth");
const storage_1 = require("./storage");
const omdb_1 = require("./omdb");
const schema_1 = require("../shared/schema");
async function registerRoutes(app) {
    (0, auth_1.setupAuth)(app);
    app.get("/api/movies/search", async (req, res) => {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "Query parameter 'q' is required" });
        }
        try {
            console.log(`Searching for movies with query: ${query}`);
            const movies = await (0, omdb_1.searchMovies)(query);
            console.log(`Found ${movies.length} movies`);
            res.json(movies);
        }
        catch (error) {
            console.error('Error searching movies:', error);
            res.status(500).json({ message: error.message });
        }
    });
    app.get("/api/movies/:id", async (req, res) => {
        try {
            const movie = await (0, omdb_1.getMovieById)(req.params.id);
            res.json(movie);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    app.get("/api/watchlist", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        const items = await storage_1.storage.getWatchlist(req.user.id);
        res.json(items);
    });
    app.post("/api/watchlist", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        const parsed = schema_1.insertWatchlistSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid request body" });
        }
        const item = await storage_1.storage.addToWatchlist(req.user.id, req.body.movieId);
        res.status(201).json(item);
    });
    app.delete("/api/watchlist/:movieId", async (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        await storage_1.storage.removeFromWatchlist(req.user.id, req.params.movieId);
        res.sendStatus(200);
    });
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
