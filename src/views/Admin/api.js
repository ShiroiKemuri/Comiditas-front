import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8085/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de Peticiones: Trazabilidad y Seguridad
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Inyección de Encabezados de Auditoría
  // Generamos un Request-ID único por petición para correlación en logs de backend
  config.headers['X-Request-ID'] = uuidv4();
  config.headers['X-Client-Source'] = 'Comiditas-Frontend-Admin';
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de Respuestas: Manejo Defensivo (401/403)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401 || status === 403) {
      console.warn(`[AUDIT] Acceso denegado o sesión expirada: ${status}`);
      localStorage.removeItem('jwt_token');
      // Redirigir usando window.location para asegurar limpieza de estado global si es necesario
      window.location.href = '/auth?reason=unauthorized';
    }

    // Estructuramos el error para no exponer el 'request' completo con headers sensibles
    const sanitizedError = {
      message: error.message,
      status: status,
      code: error.code
    };
    return Promise.reject(sanitizedError);
  }
);

export default api;