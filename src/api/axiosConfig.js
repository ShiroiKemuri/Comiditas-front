import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8085',
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      if (!config.url.endsWith('/auth/login')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      const publicPaths = ['/products', '/categories'];
      const isPublic = publicPaths.some(path => config.url.includes(path) && config.method === 'get');

      if (!config.url.endsWith('/auth/login') && !isPublic) {
        window.location.href = '/login';
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;