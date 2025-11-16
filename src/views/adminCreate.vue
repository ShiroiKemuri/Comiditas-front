<template>
  <div>
    <h2>Crear Administador</h2>
    <form @submit.prevent="createAdmin">
      <input v-model="admin.nombre" type="text" placeholder="Nombre" required />
      <input
        v-model="admin.usuario"
        type="text"
        placeholder="Usuario"
        required
      />
      <input
        v-model="admin.password"
        type="text"
        placeholder="Password"
        required
      />
      <button type="submit">Crear Admin</button>
    </form>
  </div>
</template>

<script setup>
import { admin, createAdmin } from "@/composables/AdminVM";
</script>
