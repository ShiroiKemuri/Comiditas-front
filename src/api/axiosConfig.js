import axios from 'axios';

// 1. Crea una instancia dedicada en lugar de usar la global
const apiClient = axios.create({
  baseURL: 'http://localhost:8085', // Configura la URL base de tu API
});

// Interceptor de peticiones
apiClient.interceptors.request.use(
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

// 3. Exporta la instancia que creaste
export default apiClient;