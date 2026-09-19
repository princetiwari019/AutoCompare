import axios from 'axios';

const rawUrl = import.meta.env.VITE_API_BASE_URL || '';
const cleanUrl = rawUrl.replace(/\/$/, '');

const apiBaseUrl = cleanUrl
  ? (cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`)
  : '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
