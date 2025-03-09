"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertWatchlistSchema = exports.insertUserSchema = exports.watchlist = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    preferences: (0, pg_core_1.jsonb)("preferences").$type(),
});
exports.watchlist = (0, pg_core_1.pgTable)("watchlist", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").notNull(),
    movieId: (0, pg_core_1.text)("movie_id").notNull(),
    addedAt: (0, pg_core_1.text)("added_at").notNull(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
});
exports.insertWatchlistSchema = (0, drizzle_zod_1.createInsertSchema)(exports.watchlist);
