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
    host: "0.0.0.0", // Allow external connections (needed for Codespaces)
    hmr: {
      port: 5175,
      host: "0.0.0.0", // Allow external connections
      // Disable WebSocket in proxy environments to prevent loops
      clientPort: process.env.NODE_ENV === 'development' ? 5175 : undefined,
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
