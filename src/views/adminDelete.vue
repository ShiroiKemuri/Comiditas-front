<template>
    <div>
        <h2>Eliminar Administrador</h2>
        <form @submit.prevent="deleteAdmin">
            <input v-model="admin.id" type="number" placeholder="ID del Admin" required/>
            <button type="submit">Eliminar Admin</button>
        </form>
    </div>
</template>

<script setup>
import { admin, deleteAdmin }  from '@/composables/AdminVM'
</script>