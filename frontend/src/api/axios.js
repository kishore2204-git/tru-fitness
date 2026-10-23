import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  // Portal routes use MemberBearer — don't overwrite with staff token
  const isPortalRoute = config.url?.includes('/portal/');
  if (!isPortalRoute) {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config;
    const isPortalRoute = orig.url?.includes('/portal/');
    // Skip token refresh for portal routes — they handle their own auth
    if (error.response?.status === 401 && !orig._retry && !isPortalRoute) {
      orig._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) throw new Error('No refresh');
        const { data } = await axios.post(`${api.defaults.baseURL}/token/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        orig.headers.Authorization = `Bearer ${data.access}`;
        return api(orig);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
