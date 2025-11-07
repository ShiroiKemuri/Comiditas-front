import axios from 'axios';

// Configura la URL base de tu API
axios.defaults.baseURL = 'http://localhost:8085';

// Interceptor de peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // No añadir el token para la ruta de login
      if (config.url !== '/auth/login') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;