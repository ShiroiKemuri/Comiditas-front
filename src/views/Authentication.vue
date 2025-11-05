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
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 70px; /* Espacio para el botón */
  width: 100%;
}

.toggle-button {
  position: absolute;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8em;
  color: #ffffff;
}

.error-message {
  color: red;
  margin-top: 10px;
}

</style>