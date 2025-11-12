<template>
  <div class="modal-overlay" @click.self="cerrarModal">
    <div class="modal-content">
      <h3>Agregar Categoría</h3>
      <form class="categoria-form" @submit.prevent="enviarFormulario">
        <input
          v-model="category.name"
          type="text"
          placeholder="nombre de la categoría"
          required
        />
        <input
          v-model="category.description"
          type="text"
          placeholder="Descripción de la categoría"
          required
        />
        <div class="modal-actions">
          <button type="submit" class="btn-guardar">Guardar</button>
          <button type="button" class="btn-cancelar" @click="cerrarModal">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { category, createCategory } from '@/composables/CategoryVM'


const emit = defineEmits(['cerrar'])

const enviarFormulario = async () => {
  try {
    await createCategory()
    cerrarModal()
  } catch (error) {
    console.error('Error al crear categoría:', error)
  }
}

const cerrarModal = () => {
  emit('cerrar')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #222;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #444;
  padding-bottom: 0.5rem;
}

.categoria-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categoria-form input {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #555;
  background-color: #333;
  color: white;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.btn-guardar {
  flex: 1;
  background-color: #1d1aee;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-guardar:hover {
  background-color: #0f3e74;
}

.btn-cancelar {
  flex: 1;
  background-color: #666;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
}

.btn-cancelar:hover {
  background-color: #555;
}
</style>


