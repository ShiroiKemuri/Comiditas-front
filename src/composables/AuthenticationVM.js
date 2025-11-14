import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axiosConfig';
import AuthModel from '@/models/AuthenticationModel';

const Auth = ref({ ...AuthModel });

const errorMessage = ref('');

const login = async (router) => {
    errorMessage.value = '';

    // Validar que no haya espacios en blanco
    const whitespaceRegex = /\s/;
    if (whitespaceRegex.test(Auth.value.user)) {
        errorMessage.value = 'El nombre de usuario no puede contener espacios en blanco.';
        return false;
    }
    if (whitespaceRegex.test(Auth.value.password)) {
        errorMessage.value = 'La contraseña no puede contener espacios en blanco.';
        return false;
    }

    // 1. Validar que los campos no estén vacíos
    if (!Auth.value.user || !Auth.value.password) {
        errorMessage.value = 'Por favor, ingresa usuario y contraseña.';
        return false;
    }

    // 2. Validar la longitud de los campos
    if (Auth.value.user.length > 15) {
        errorMessage.value = 'El usuario no puede exceder los 15 caracteres.';
        return false;
    }
    if (Auth.value.password.length > 15) {
        errorMessage.value = 'La contraseña no puede exceder los 15 caracteres.';
        return false;
    }

    // 3. Validar que no haya caracteres especiales (solo letras y números)
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(Auth.value.user)) {
        errorMessage.value = 'El nombre de usuario solo puede contener letras y números.';
        return false;
    }
    if (!alphanumericRegex.test(Auth.value.password)) {
        errorMessage.value = 'La contraseña solo puede contener letras y números.';
        return false;
    }


    try {
        // Usamos la URL completa aquí para asegurar la conexión, asumiendo que el backend corre en el puerto 8080
        const response = await apiClient.post('/auth/login', Auth.value);

        if (response.data && response.data.token) {
            localStorage.setItem('jwt_token', response.data.token);
            console.log('Login successful, token stored.');        
            Auth.value.user = '';
            Auth.value.password = '';
            errorMessage.value = '';
            router.push({ name: 'adminDashboard' });
            return true;
        }
        // Si no hay token, es un error inesperado
        errorMessage.value = 'Respuesta inesperada del servidor.';
        return false; // Retornar false si no hay token
    } catch (error) {
        console.error('Error during login:', error);
        if (error.response && error.response.data) {
            // Muestra el mensaje de error específico del backend (ej: "Cuenta bloqueada...")
            errorMessage.value = error.response.data;
        } else {
            errorMessage.value = 'Error de conexión. Por favor, intente más tarde.';
        }        
        return false;
    };
}


export { Auth, login, errorMessage };