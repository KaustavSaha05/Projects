import { User, InsertUser, Watchlist } from "../shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getWatchlist(userId: number): Promise<Watchlist[]>;
  addToWatchlist(userId: number, movieId: string): Promise<Watchlist>;
  removeFromWatchlist(userId: number, movieId: string): Promise<void>;
  updatePreferences(userId: number, preferences: User['preferences']): Promise<User>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private watchlist: Map<string, Watchlist>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.watchlist = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      preferences: { favoriteGenres: [], watchHistory: [] } 
    };
    this.users.set(id, user);
    return user;
  }

  async getWatchlist(userId: number): Promise<Watchlist[]> {
    return Array.from(this.watchlist.values()).filter(
      (item) => item.userId === userId,
    );
  }

  async addToWatchlist(userId: number, movieId: string): Promise<Watchlist> {
    const id = this.currentId++;
    const item: Watchlist = {
      id,
      userId,
      movieId,
      addedAt: new Date().toISOString(),
    };
    this.watchlist.set(`${userId}-${movieId}`, item);
    return item;
  }

  async removeFromWatchlist(userId: number, movieId: string): Promise<void> {
    this.watchlist.delete(`${userId}-${movieId}`);
  }

  async updatePreferences(userId: number, preferences: User['preferences']): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, preferences };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();