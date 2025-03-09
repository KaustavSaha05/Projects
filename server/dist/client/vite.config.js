"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupVite = exports.serveStatic = exports.log = void 0;
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
// Custom logger
const log = (message) => {
    console.log(`[VITE CONFIG]: ${message}`);
};
exports.log = log;
// Serve static files
const serveStatic = (dir) => {
    return {
        name: 'serve-static',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (req.url.startsWith('/static')) {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Serving static content');
                }
                else {
                    next();
                }
            });
        }
    };
};
exports.serveStatic = serveStatic;
// Setup Vite configuration
const setupVite = (app, server) => {
    (0, exports.log)('Setting up Vite configuration');
    return (0, vite_1.defineConfig)({
        plugins: [(0, plugin_react_1.default)(), (0, exports.serveStatic)(path_1.default.resolve(__dirname, 'public'))],
        resolve: {
            alias: {
                '@': path_1.default.resolve(__dirname, 'src')
            }
        },
        server: {
            port: 5173,
            open: true
        }
    });
};
exports.setupVite = setupVite;
const http_1 = require("http");
const app = {}; // Replace with actual app instance
const server = (0, http_1.createServer)();
exports.default = (0, exports.setupVite)(app, server);
