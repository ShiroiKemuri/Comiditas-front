<template>
    <div class="catalog-update">
        <h1>Buscar categoria</h1>
        <div v-if="category" class="form-container">
            <div class="form-section">
                <input v-model="category.id" type="text" placeholder="ID de la categoria" />
            <button @click="getCategory()">Buscar</button>
            </div>

            <div v-if="category.name" class="update-section">
                <h2>Actualizar categoria</h2>
                <input v-model="category.name" type="text" placeholder="Nombre de la categoria" />
                <input v-model="category.description" type="text" placeholder="Descripcion de la categoria" />
                <button @click="updateCategory()">Actualizar</button>
            </div>
        </div>
    </div>
</template>
 
<script setup>
import { category, getCategory, updateCategory } from '@/composables/CategoryVM.js'
</script> 

<style scoped>
.catalog-update {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
}

.form-section, .update-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
}

.update-section h2 {
    margin-top: 0;
}

input[type="text"] {
  padding: 0.8em 1em;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1em;
}
</style>