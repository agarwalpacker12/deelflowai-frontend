// Environment variables test utility
export const testEnvVars = () => {
  console.log('=== Environment Variables Test ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VITE_API_URL:', `${import.meta.env.VITE_API_HOST}/api`);
  console.log('VITE_API_PORT:', import.meta.env.VITE_API_PORT);
  console.log('All VITE_ variables:', import.meta.env);
  console.log('================================');
  
  return {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: `${import.meta.env.VITE_API_HOST}/api`,
    apiPort: import.meta.env.VITE_API_PORT,
    allViteVars: import.meta.env
  };
};

// Export environment variables for use in components
export const env = {
  API_URL: `${import.meta.env.VITE_API_HOST}/api`,
  API_PORT: import.meta.env.VITE_API_PORT,
  NODE_ENV: process.env.NODE_ENV
};
