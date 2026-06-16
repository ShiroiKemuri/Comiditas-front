<template>
  <div>
    <input v-model="admin.id" type="number" placeholder="ID del admin" />
    <button @click="getAdmin">Buscar</button>

    <div v-if="admin">
      <h3>Administrador encontrado:</h3>
      <p><strong>ID:</strong> {{ admin.id }}</p>
      <p><strong>Nombre:</strong> {{ admin.nombre }}</p>
      <p><strong>Password:</strong> {{ admin.password }}</p>
      <p><strong>Usuario:</strong> {{ admin.usuario }}</p>
    </div>

    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>


<script setup>
import { admin, getAdmin } from '@/composables/AdminVM'
</script>
