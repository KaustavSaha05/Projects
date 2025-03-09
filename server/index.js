"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
// Force load .env with absolute path
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, ".env") });
// Confirm environment variables are loaded
console.log("OMDB_API_KEY:", process.env.OMDB_API_KEY);
// Create Express application
const app = (0, express_1.default)();
// Middleware for parsing JSON and URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// CORS setup
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;
    // Capture JSON responses for logging
    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };
    // Log API requests on completion
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }
            // Truncate long log lines
            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }
            console.log(logLine);
        }
    });
    next();
});
// Test route to verify server and frontend connection
app.get("/api/test", (_req, res) => {
    res.json({ message: "API is working correctly!" });
});
(async () => {
    // Setup routes and get HTTP server instance
    const server = await (0, routes_1.registerRoutes)(app);
    // Global error handling middleware
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        res.status(status).json({ message });
        console.error(err);
    });
    // Start the server
    const port = process.env.PORT || 5000;
    server.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
    }, () => {
        console.log(`Serving on port ${port}`);
    });
})();
