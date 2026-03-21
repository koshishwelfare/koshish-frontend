// Frontend Configuration for Student Portal
const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  },

  // App Configuration
  app: {
    name: 'Koshish Student Portal',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },

  // Feature Flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
    enableErrorTracking: import.meta.env.VITE_ENABLE_ERROR_TRACKING !== 'false',
  },

  // Storage Configuration
  storage: {
    tokenKey: 'koshish_token',
    userKey: 'koshish_user',
    cacheDuration: parseInt(import.meta.env.VITE_CACHE_DURATION) || 3600000, // 1 hour
  },
};

export default config;
