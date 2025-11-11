<template>
    <div class="authentication">
        <h1>Inicio de Sesion</h1>
        <div>
            <form @submit.prevent="login">
                <input v-model="AuthModel.user" type="text" placeholder="Usuario"/>
                <div class="password-wrapper">
                    <input 
                        v-model="AuthModel.password" 
                        :type="isPasswordVisible ? 'text' : 'password'" 
                        placeholder="Password"/>
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
import { ref } from 'vue';
import { Auth as AuthModel, login, errorMessage } from '@/composables/AuthenticationVM'

const isPasswordVisible = ref(false);

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};
</script>

<style scoped>
.authentication {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.authentication form {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espacio entre elementos del formulario */
  width: 100%;
  max-width: 350px; /* Ancho máximo para el formulario */
}

/* Estilo general para los inputs de texto y contraseña */
.authentication input[type="text"],
.authentication input[type="password"] {
  width: 100%; /* Ocupan todo el ancho del contenedor del formulario */
  padding: 0.8em 1em;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-card-bg);
  color: var(--color-text);
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}

.password-wrapper {
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
}

.error-message {
  color: #f1a1a1; /* Un rojo más suave para el tema oscuro */
  background-color: rgba(230, 126, 34, 0.15); /* Fondo sutil usando el color de acento */
  border: 1px solid var(--color-accent-hover);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 10px;
}

</style>