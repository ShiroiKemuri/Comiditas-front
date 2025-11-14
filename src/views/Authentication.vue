<template>
    <div class="authentication">
        <div class="login-card">
            <button @click="goToHome" class="back-button">← Volver</button>
            <div class="card-header">
                <img src="https://cdn.discordapp.com/attachments/1212093127435755551/1438364149167034399/logo.png?ex=69169c80&is=69154b00&hm=98bbd0eaacf578d6c884a2c25d570483fbb876109b0c47907426907aa44e0b2a&" alt="Logo Comiditas" class="login-logo">
            </div>
            <h1>Inicio de Sesión</h1>
            <form @submit.prevent="handleLogin">
                <input v-model="AuthModel.user" type="text" placeholder="Usuario"/>
                <div class="input-wrapper password-wrapper">
                    <input 
                        v-model="AuthModel.password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="Password"/>
                    <button type="button" @click="togglePasswordVisibility" class="toggle-button">
                        {{ isPasswordVisible ? 'Ocultar' : 'Mostrar' }}
                    </button>
                </div>
                <button type="submit">Login</button>
                <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Auth as AuthModel, login, errorMessage } from '@/composables/AuthenticationVM'
import backgroundImage from '@/assets/top-view-desk-concept-with-laptop.jpg';
const isPasswordVisible = ref(false);
const router = useRouter(); // Importante para que el composable pueda usarlo
 
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const goToHome = () => {
  AuthModel.value.user = '';
  AuthModel.value.password = '';
  errorMessage.value = '';
  router.push('/');
};

const handleLogin = () => {
  login(router); // Pasamos la instancia del router a la función de login
};

onMounted(() => {

  document.body.style.backgroundImage = `url(${backgroundImage})`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';
});

onUnmounted(() => {
  document.body.style.backgroundImage = '';
});
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem; /* Espacio entre el logo y el título */
  margin-bottom: 1rem;
}

.app-title {
  margin: 0;
  font-size: 2.5rem; /* Tamaño del nombre de la app */
  color: var(--color-heading);
}

.login-logo {
  width: 80px; /* Ancho del logo ajustado */
  margin-bottom: 0; /* Se quita el margen inferior */
}

.authentication {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 100vh; /* Ocupa toda la altura de la pantalla */
  box-sizing: border-box; /* Asegura que el padding no afecte la altura total */
}

.login-card {
  position: relative; /* Necesario para posicionar el botón de volver */
  /* Fondo semitransparente con efecto de desenfoque */
  background-color: rgba(221, 221, 221, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  padding: 2.5rem 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
}

.authentication form {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espacio entre elementos del formulario */
  margin-top: 1.5rem;
}

/* Estilo general para los inputs de texto y contraseña */
.authentication input[type="text"],
.authentication input[type="password"] {
  width: 100%; /* Ocupan todo el ancho del contenedor del formulario */
  padding: 0.8em 1em;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: rgba(0, 0, 0, 0.2); /* Fondo sutil para los inputs */
  color: var(--color-text);
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 80px; /* Espacio para el botón 'Mostrar' */
}

.toggle-button {
  position: absolute;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
  color: var(--color-text);
  padding: 0.5em;
}

.error-message {
  color: #eb4444; /* Un rojo más suave para el tema oscuro */
  background-color: rgba(230, 47, 34, 0.15); /* Fondo sutil usando el color de acento */
  border: 1px solid var(--color-accent-hover);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 10px;
}

.back-button {
  position: absolute;
  top: 15px;
  left: 15px;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
}

</style>