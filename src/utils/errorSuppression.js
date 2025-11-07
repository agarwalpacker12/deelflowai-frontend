// Client-side error suppression for development environment
export function initializeErrorSuppression() {
  if (import.meta.env.DEV) {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      if (
        message.includes('manifest.json') ||
        message.includes('github.dev/pf-signin') ||
        message.includes('WebSocket closed without opened') ||
        message.includes('failed to connect to websocket') ||
        message.includes('Access to manifest at') ||
        message.includes('CORS policy') ||
        message.includes('localhost:5175') ||
        message.includes('localhost:5174') ||
        message.includes('0.0.0.0:5175') ||
        message.includes('WebSocket connection to') ||
        message.includes('Error: WebSocket') ||
        message.includes('net::ERR_FAILED') ||
        message.includes('net::ERR_CONNECTION_REFUSED') ||
        message.includes('net::ERR_ADDRESS_INVALID') ||
        message.includes('Failed to fetch CSRF cookie') ||
        message.includes('net::ERR_BLOCKED_BY_CLIENT') ||
        message.includes('sanctum/csrf-cookie') ||
        message.includes('AxiosError') ||
        message.includes('Network Error') ||
        message.includes('ERR_CONNECTION_REFUSED') ||
        message.includes('SecurityError') ||
        message.includes('Failed to read a named property') ||
        message.includes('Blocked a frame with origin') ||
        message.includes('js.stripe.com') ||
        message.includes('three-ds-2-challenge') ||
        message.includes('hcaptcha') ||
        message.includes('stripecdn.com')
      ) {
        console.warn('🔇 Suppressed development error:', message);
        return;
      }
      
      originalConsoleError.apply(console, args);
    };

    // Override console.warn to also suppress WebSocket warnings
    const originalConsoleWarn = console.warn;
    console.warn = (...args) => {
      const message = args.join(' ');
      
      if (
        message.includes('WebSocket') ||
        message.includes('localhost:5175') ||
        message.includes('localhost:5174') ||
        message.includes('0.0.0.0:5175') ||
        message.includes('ERR_ADDRESS_INVALID') ||
        message.includes('failed to connect') ||
        message.includes('React Router Future Flag Warning') ||
        message.includes('v7_startTransition') ||
        message.includes('v7_relativeSplatPath') ||
        message.includes('SecurityError') ||
        message.includes('Stripe') ||
        message.includes('3D Secure') ||
        message.includes('hCaptcha') ||
        message.includes('WebGL') ||
        message.includes('swiftshader')
      ) {
        console.info('🔇 Suppressed warning:', message);
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };

    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason?.message || event.reason?.toString() || '';
      
      if (
        message.includes('WebSocket') || 
        message.includes('manifest') ||
        message.includes('localhost:5175') ||
        message.includes('localhost:5174') ||
        message.includes('CORS') ||
        message.includes('SecurityError') ||
        message.includes('Failed to read a named property') ||
        message.includes('Blocked a frame') ||
        message.includes('js.stripe.com') ||
        message.includes('three-ds-2-challenge') ||
        message.includes('hcaptcha') ||
        message.includes('Cannot find module')
      ) {
        console.info('🔇 Suppressed unhandled rejection:', message);
        event.preventDefault();
      }
    });

    // Suppress network errors in the global error handler
    window.addEventListener('error', (event) => {
      const message = event.message || event.error?.message || '';
      
      if (
        message.includes('WebSocket') ||
        message.includes('localhost:5175') ||
        message.includes('localhost:5174') ||
        message.includes('manifest') ||
        message.includes('SecurityError') ||
        message.includes('Failed to read a named property') ||
        message.includes('Blocked a frame') ||
        message.includes('js.stripe.com') ||
        message.includes('three-ds-2-challenge') ||
        message.includes('hcaptcha') ||
        message.includes('Cannot find module') ||
        message.includes('stripecdn.com')
      ) {
        console.info('🔇 Suppressed global error:', message);
        event.preventDefault();
      }
    });

    console.log('🔇 Enhanced error suppression initialized for development');
  }
}
