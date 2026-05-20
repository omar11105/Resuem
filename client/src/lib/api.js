import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

let tokenGetter = null;

api.interceptors.request.use(async (config) => {
  const token = await tokenGetter?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Register Clerk getToken — call once from a component using useAuth() */
export function registerAuthTokenGetter(getToken) {
  tokenGetter = getToken;
}

export async function getAuthHeaders() {
  const token = await tokenGetter?.();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getApiBaseUrl() {
  return baseURL.replace(/\/api$/, '');
}

export default api;
