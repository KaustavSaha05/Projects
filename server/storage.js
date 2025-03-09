"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.MemStorage = void 0;
const express_session_1 = __importDefault(require("express-session"));
const memorystore_1 = __importDefault(require("memorystore"));
const MemoryStore = (0, memorystore_1.default)(express_session_1.default);
class MemStorage {
    users;
    watchlist;
    currentId;
    sessionStore;
    constructor() {
        this.users = new Map();
        this.watchlist = new Map();
        this.currentId = 1;
        this.sessionStore = new MemoryStore({
            checkPeriod: 86400000,
        });
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async getUserByUsername(username) {
        return Array.from(this.users.values()).find((user) => user.username === username);
    }
    async createUser(insertUser) {
        const id = this.currentId++;
        const user = {
            ...insertUser,
            id,
            preferences: { favoriteGenres: [], watchHistory: [] }
        };
        this.users.set(id, user);
        return user;
    }
    async getWatchlist(userId) {
        return Array.from(this.watchlist.values()).filter((item) => item.userId === userId);
    }
    async addToWatchlist(userId, movieId) {
        const id = this.currentId++;
        const item = {
            id,
            userId,
            movieId,
            addedAt: new Date().toISOString(),
        };
        this.watchlist.set(`${userId}-${movieId}`, item);
        return item;
    }
    async removeFromWatchlist(userId, movieId) {
        this.watchlist.delete(`${userId}-${movieId}`);
    }
    async updatePreferences(userId, preferences) {
        const user = await this.getUser(userId);
        if (!user)
            throw new Error("User not found");
        const updatedUser = { ...user, preferences };
        this.users.set(userId, updatedUser);
        return updatedUser;
    }
}
exports.MemStorage = MemStorage;
exports.storage = new MemStorage();
