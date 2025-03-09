import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import cors from "cors";

// Force load .env with absolute path
const result = dotenv.config({ path: __dirname + '/../.env' });

if (result.error) {
  console.error('Dotenv failed to load:', result.error);
} else {
  console.log('Dotenv loaded:', result.parsed);
}

// Confirm environment variables are loaded
console.log("OMDB_API_KEY:", process.env.OMDB_API_KEY);

// Create Express application
const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: undefined = undefined;

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
  const server = await registerRoutes(app);

  // Global error handling middleware
  app.use((err: { status: any; statusCode: any; message: string; }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(err);
  });

  // Start the server
  const port = process.env.PORT || 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      console.log(`Serving on port ${port}`);
    }
  );
})();