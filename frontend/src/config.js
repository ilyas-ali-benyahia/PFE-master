// src/config.js
const isDevelopment = process.env.NODE_ENV === 'development';

// Use environment variable with fallback
export const API_URL = process.env.REACT_APP_API_URL;