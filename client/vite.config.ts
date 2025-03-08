import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { Server, IncomingMessage, ServerResponse } from 'http';

// Custom logger
export const log = (message: string) => {
  console.log(`[VITE CONFIG]: ${message}`);
};

// Serve static files
export const serveStatic = (dir: string) => {
  return {
    name: 'serve-static',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url.startsWith('/static')) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Serving static content');
        } else {
          next();
        }
      });
    }
  };
};

// Setup Vite configuration
export const setupVite = (app: unknown, server: Server) => {
  log('Setting up Vite configuration');
  return defineConfig({
    plugins: [react(), serveStatic(path.resolve(__dirname, 'public'))],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5173,
      open: true
    }
  });
};

import { createServer } from 'http';

const app = {}; // Replace with actual app instance
const server = createServer();

export default setupVite(app, server);

