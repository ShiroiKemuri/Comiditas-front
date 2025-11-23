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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;