import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

export function useAuthenticationVM() {
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref(null);

  const login = async (credentials) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('jwt_token', response.data.token);
      await router.push({ name: 'AdminDashboard' });
    } catch (err) {
      // Seguridad: No loggeamos 'credentials'. Solo metadatos del error.
      console.error(`[AUTH_FAILURE] Intento de login fallido. Status: ${err.status}`);
      error.value = 'Credenciales inválidas. Por favor, intente de nuevo.';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    router.push({ name: 'Auth' });
  };

  return {
    login,
    logout,
    isLoading,
    error
  };
}