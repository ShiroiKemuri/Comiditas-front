import { ref } from 'vue';
import axios from 'axios';
import AuthModel from '@/models/AuthenticationModel';

const Auth = ref({ ...AuthModel });

const errorMessage = ref('');

const login = async () => {
    errorMessage.value = ''; // Limpiar errores previos

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

    // 4. Intentar el inicio de sesión
    try {
        const response = await axios.post('http://localhost:8085/auth/login', Auth.value);
        console.log('Login successful');
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        errorMessage.value = 'Usuario o contraseña incorrecta, por favor vuelva a intentar o comuníquese con el equipo de desarrollo.';
        return false;
    }
};

export { Auth, login, errorMessage };