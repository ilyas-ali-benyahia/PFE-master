// src/config.js
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment 
  ? 'http://127.0.0.1:8000' 
  : '/api';