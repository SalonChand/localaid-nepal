import axios from 'axios';

// Auto-detects the host the app was loaded from, so it works on both
// laptop (localhost) and phone (your laptop's LAN IP) with zero config.
// VITE_API_URL still wins if set (use it for production deployment).
const API_URL =
  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the JWT token to every request if the user is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401 (expired/invalid token), clear the session and bounce to login.
// Skip auth endpoints so a bad-login error isn't swallowed, and avoid
// a redirect loop when already on /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/');
    const onLoginPage = window.location.pathname === '/login';

    if (status === 401 && !isAuthEndpoint && !onLoginPage) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
