import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axiosConfig';
import AuthModel from '@/models/AuthenticationModel';

const Auth = ref({ ...AuthModel });

const errorMessage = ref('');

const login = async (router) => {
    errorMessage.value = '';

    const { user, password } = Auth.value;

    const validations = [
        { check: !user || !password, message: 'Por favor, ingresa usuario y contraseña.' },
        { check: user.length > 15, message: 'El usuario no puede exceder los 15 caracteres.' },
        { check: password.length > 15, message: 'La contraseña no puede exceder los 15 caracteres.' },
        { check: /\s/.test(user), message: 'El nombre de usuario no puede contener espacios en blanco.' },
        { check: /\s/.test(password), message: 'La contraseña no puede contener espacios en blanco.' },
        { check: !/^[a-zA-Z0-9]+$/.test(user), message: 'El nombre de usuario solo puede contener letras y números.' },
        { check: !/^[a-zA-Z0-9]+$/.test(password), message: 'La contraseña solo puede contener letras y números.' }
    ];

    for (const rule of validations) {
        if (rule.check) {
            errorMessage.value = rule.message;
            return false;
        }
    }

    try {
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
        errorMessage.value = 'Respuesta inesperada del servidor.';
        return false;
    } catch (error) {
        console.error('Error during login:', error);
        if (error.response && error.response.data) {
            errorMessage.value = error.response.data;
        } else {
            errorMessage.value = 'Error de conexión. Por favor, intente más tarde.';
        }        
        return false;
    };
}


export { Auth, login, errorMessage };