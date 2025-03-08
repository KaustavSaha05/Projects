import type { Express, Request, Response } from "express";

interface User {
  id: string;
  // Add other properties if needed
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { searchMovies, getMovieById } from "./omdb";
import { insertWatchlistSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/movies/search", async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }

    try {
      console.log(`Searching for movies with query: ${query}`);
      const movies = await searchMovies(query);
      console.log(`Found ${movies.length} movies`);
      res.json(movies);
    } catch (error) {
      console.error('Error searching movies:', error);
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get("/api/movies/:id", async (req: Request, res: Response) => {
    try {
      const movie = await getMovieById(req.params.id);
      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get("/api/watchlist", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getWatchlist(req.user.id);
    res.json(items);
  });

  app.post("/api/watchlist", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const parsed = insertWatchlistSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const item = await storage.addToWatchlist(req.user.id, req.body.movieId);
    res.status(201).json(item);
  });

  app.delete("/api/watchlist/:movieId", async (req: Request, res: Response) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    await storage.removeFromWatchlist(req.user.id, req.params.movieId);
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}