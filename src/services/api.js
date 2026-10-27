import axios from 'axios';

const defaultApiUrl = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://review-ai-backend-1.onrender.com/api';

const configuredApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const normalizedApiUrl = !configuredApiUrl || configuredApiUrl.endsWith('/api')
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

const api = axios.create({
  baseURL: normalizedApiUrl || defaultApiUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
