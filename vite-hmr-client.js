// Custom HMR client configuration for Codespaces
// This overrides Vite's default HMR client to use the backend proxy

if (import.meta.env.DEV) {
  // Check if we're in Codespaces
  const isCodespaces = window.location.hostname.includes('.app.github.dev');
  
  if (isCodespaces) {
    console.log('🔧 Initializing Codespaces WebSocket proxy...');
    
    // Override the HMR WebSocket connection
    const originalWebSocket = window.WebSocket;
    
    window.WebSocket = function(url, protocols) {
      console.log('🔌 WebSocket connection attempt:', url);
      
      // If this is a Vite HMR WebSocket connection, redirect it through our proxy
      if (url.includes('localhost:5175') || url.includes('localhost:5174') || url.includes('?token=')) {
        // Extract the token from the original URL
        const tokenMatch = url.match(/token=([^&]+)/);
        const token = tokenMatch ? tokenMatch[1] : '';
        
        // Create new URL that goes through the backend proxy
        const backendHost = window.location.hostname.replace('-5173.', '-3000.');
        const proxyUrl = `wss://${backendHost}/frontend-ws/?token=${token}`;
        
        console.log('🔀 Redirecting HMR WebSocket through backend proxy:', proxyUrl);
        return new originalWebSocket(proxyUrl, protocols);
      }
      
      // For all other WebSocket connections, use the original
      console.log('✅ Using original WebSocket connection');
      return new originalWebSocket(url, protocols);
    };
    
    // Copy static properties and prototype
    Object.setPrototypeOf(window.WebSocket, originalWebSocket);
    Object.defineProperty(window.WebSocket, 'prototype', {
      value: originalWebSocket.prototype,
      writable: false
    });
    
    // Copy static properties
    for (const prop in originalWebSocket) {
      if (originalWebSocket.hasOwnProperty(prop)) {
        window.WebSocket[prop] = originalWebSocket[prop];
      }
    }
    
    console.log('✅ Codespaces WebSocket proxy initialized');
  } else {
    console.log('🏠 Local development detected, using default WebSocket connections');
  }
}
