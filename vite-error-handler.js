// Vite error handler for development
export function createErrorHandler() {
  return {
    name: 'error-handler',
    configureServer(server) {
      // Handle WebSocket connection errors gracefully
      server.ws.on('error', (error) => {
        // Suppress common WebSocket errors in development
        if (
          error.message.includes('WebSocket') || 
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('Invalid frame header') ||
          error.message.includes('Connection closed')
        ) {
          // Silently ignore these errors to prevent console spam
          return;
        } else {
          console.error('Server error:', error);
        }
      });

      // Override console.error to filter out known issues
      const originalConsoleError = console.error;
      console.error = (...args) => {
        const message = args.join(' ');
        
        // Suppress known problematic errors that cause infinite loops
        if (
          message.includes('manifest.json') ||
          message.includes('github.dev/pf-signin') ||
          message.includes('WebSocket closed without opened') ||
          message.includes('failed to connect to websocket') ||
          message.includes('Invalid frame header') ||
          message.includes('CORS policy') ||
          message.includes('Access to manifest at') ||
          message.includes('blocked by CORS policy') ||
          message.includes('ERR_FAILED 302') ||
          message.includes('automatic-disco') ||
          message.includes('githubpreview.dev') ||
          message.includes('app.github.dev')
        ) {
          // Completely suppress these to prevent infinite loops
          return;
        }
        
        originalConsoleError.apply(console, args);
      };

      // Add error handling for HMR and requests
      server.middlewares.use((req, res, next) => {
        // Add CORS headers for all requests
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          res.end();
          return;
        }
        
        // Handle manifest.json requests locally to prevent CORS issues
        if (req.url === '/manifest.json') {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({
            short_name: "DealFlow",
            name: "DealFlow - AI Real Estate Wholesaling Platform",
            start_url: "/",
            display: "standalone",
            theme_color: "#000000",
            background_color: "#ffffff",
            icons: []
          }));
          return;
        }
        
        // Prevent proxy loops
        if (req.headers['x-proxy-source'] && req.url !== '/') {
          res.setHeader('X-Loop-Prevention', 'true');
        }
        
        next();
      });
    }
  };
}
