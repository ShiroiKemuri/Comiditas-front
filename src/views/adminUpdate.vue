<template>
    <div>
        <h2>Crear Administador</h2>
        <form @submit.prevent="updateAdmin">
            <input v-model="admin.nombre" type= text placeholder="Nombre" required/>
            <input v-model="admin.usuario" type= text placeholder="Usuario" required/>
            <input v-model="admin.password" type= text placeholder="Password" required/>
            <input v-model="admin.id" type="number" placeholder="ID del Admin" required/>
            <button type="submit">Actualizar Admin</button>
        </form>
    </div>
</template>

<script setup>
import {admin, updateAdmin }  from '@/composables/AdminVM'
</script>
