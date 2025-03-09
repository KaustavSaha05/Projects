"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuth = setupAuth;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const express_session_1 = __importDefault(require("express-session"));
const crypto_1 = require("crypto");
const util_1 = require("util");
const storage_1 = require("./storage");
const scryptAsync = (0, util_1.promisify)(crypto_1.scrypt);
async function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64));
    return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64));
    return (0, crypto_1.timingSafeEqual)(hashedBuf, suppliedBuf);
}
function setupAuth(app) {
    const sessionSettings = {
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: storage_1.storage.sessionStore,
    };
    app.set("trust proxy", 1);
    app.use((0, express_session_1.default)(sessionSettings));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(new passport_local_1.Strategy(async (username, password, done) => {
        const user = await storage_1.storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false);
        }
        else {
            return done(null, user);
        }
    }));
    passport_1.default.serializeUser((user, done) => done(null, user.id));
    passport_1.default.deserializeUser(async (id, done) => {
        const user = await storage_1.storage.getUser(id);
        done(null, user);
    });
    app.post("/api/register", async (req, res, next) => {
        const existingUser = await storage_1.storage.getUserByUsername(req.body.username);
        if (existingUser) {
            return res.status(400).send("Username already exists");
        }
        const user = await storage_1.storage.createUser({
            ...req.body,
            password: await hashPassword(req.body.password),
        });
        req.login(user, (err) => {
            if (err)
                return next(err);
            res.status(201).json(user);
        });
    });
    app.post("/api/login", passport_1.default.authenticate("local"), (req, res) => {
        res.status(200).json(req.user);
    });
    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err)
                return next(err);
            res.sendStatus(200);
        });
    });
    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated())
            return res.sendStatus(401);
        res.json(req.user);
    });
}
