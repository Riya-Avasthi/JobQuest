// Configuration file for environment-based settings

// Get API URL from environment or use a default
const getApiUrl = () => {
  // First try to use the environment variable (set in .env)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Fallback to the proxy server
  return 'http://localhost:3001';
};

const config = {
  API_URL: getApiUrl(),
  APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
};

console.log('API URL configured as:', config.API_URL);

export default config; 