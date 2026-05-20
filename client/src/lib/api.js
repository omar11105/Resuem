import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export function setAuthToken(getToken) {
  api.interceptors.request.use(async (config) => {
    const token = await getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export function getApiBaseUrl() {
  return baseURL.replace(/\/api$/, '');
}

export default api;
