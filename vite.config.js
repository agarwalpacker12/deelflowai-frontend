import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createErrorHandler } from './vite-error-handler.js'
import dotenv from 'dotenv'

// Load .env file
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createErrorHandler()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 5173,
    // Use 127.0.0.1 (IPv4) explicitly to avoid IPv6 binding issues on Windows
    // When using "localhost", Node.js may try IPv6 (::1) first, causing permission errors
    // Use 0.0.0.0 for production/deployment (Codespaces, Docker, etc.)
    host: process.env.VITE_USE_EXTERNAL_HOST === 'true' ? "0.0.0.0" : "127.0.0.1",
    hmr: {
      port: 5175,
      // Use 127.0.0.1 (IPv4) for HMR to avoid IPv6 binding issues
      host: '127.0.0.1',
      clientPort: 5175,
      // Protocol for HMR WebSocket
      protocol: process.env.NODE_ENV === 'development' ? 'ws' : 'wss',
    },
    // Add middleware to handle proxy detection
    middlewares: [
      (req, res, next) => {
        // Detect if request is coming from proxy
        if (req.headers['x-proxy-source'] === 'dealflow-proxy') {
          // Add headers to prevent further proxying
          res.setHeader('X-Served-By', 'frontend-vite');
        }
        next();
      }
    ]
  },
  define: {
    __SUPPRESS_MANIFEST_WARNINGS__: true,
  },
});
