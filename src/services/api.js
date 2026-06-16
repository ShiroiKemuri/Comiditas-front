// src/services/api.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Si no tienes uuid instalado, mira la nota de abajo

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8085/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de Peticiones: Trazabilidad y Seguridad [cite: 9]
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // [cite: 9]
  }

  // Inyección de Encabezados de Auditoría [cite: 9]
  config.headers['X-Request-ID'] = uuidv4(); // [cite: 9]
  config.headers['X-Client-Source'] = 'Comiditas-Frontend-Admin'; // [cite: 9]
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de Respuestas: Manejo Defensivo (401/403) [cite: 10]
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null; // [cite: 10]

    if (status === 401 || status === 403) { // [cite: 10]
      console.warn(`[AUDIT] Acceso denegado o sesión expirada: ${status}`); // [cite: 10]
      localStorage.removeItem('jwt_token'); // [cite: 10]
      window.location.href = '/auth?reason=unauthorized'; // [cite: 10]
    }

    // Sanitizamos el error para no exponer datos sensibles [cite: 10, 11]
    const sanitizedError = {
      message: error.message,
      status: status,
      code: error.code
    };
    return Promise.reject(sanitizedError);
  }
);

export default api; // [cite: 12]