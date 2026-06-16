import axios from 'axios';

const apiClient = axios.create({
  // 1. SOLUCIÓN CRÍTICA: Añadimos el context path '/api' que exige tu Spring Boot
  baseURL: 'http://localhost:8085/api', 
});

// Interceptor para inyectar de forma automática el Token JWT en las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    
    if (token) {
      // 2. MEJORA DE SEGURIDAD: Evitamos enviar el token si la ruta actual es la de login
      // Al usar .endsWith(), funciona perfectamente tanto si config.url es '/auth/login' o '/api/auth/login'
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