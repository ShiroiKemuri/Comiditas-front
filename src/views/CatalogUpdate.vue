<template>
    <div class="catalog-update">
        <h1>Buscar categoria</h1>
        <div class="form-container">
            <div class="form-section">
                <input v-model="category.id" type="text" placeholder="ID de la categoria" />
            <button @click="buscarCategoria()">Buscar</button>
            </div>

            <div v-if="categoriaCargada" class="update-section">
                <h2>Actualizar categoria</h2>
                <input v-model="category.name" type="text" placeholder="Nombre de la categoria" />
                <input v-model="category.description" type="text" placeholder="Descripcion de la categoria" />
                <button @click="solicitarConfirmacion()">Actualizar</button>
            </div>
        </div>

        <!-- Modal de Confirmación -->
        <div v-if="mostrarModalConfirmacion" class="modal">
            <div class="modal-contenido">
                <p>¿Estás seguro de que deseas guardar los cambios en la categoría?</p>
                <div class="botones-modal">
                    <button @click="confirmarActualizacion" class="confirmar">Aceptar</button>
                    <button @click="cancelarActualizacion" class="cancelar">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>
 
<script setup>
import { ref } from 'vue';
import { category, getCategory, updateCategory } from '@/composables/CategoryVM.js'

const categoriaCargada = ref(false);
const mostrarModalConfirmacion = ref(false);

const buscarCategoria = async () => {
    // Reinicia el estado antes de cada búsqueda
    categoriaCargada.value = false;
    if (!category.value.id) {
        alert('Por favor, ingresa un ID de categoría.');
        return;
    }
    await getCategory(categoriaCargada); // Pasa la referencia para ser actualizada
};

const solicitarConfirmacion = () => {
    if (!category.value.name || !category.value.description) {
        alert('El nombre y la descripción no pueden estar vacíos.');
        return;
    }
    mostrarModalConfirmacion.value = true;
};

const confirmarActualizacion = () => {
    mostrarModalConfirmacion.value = false;
    updateCategory(); // Se llama a la función original para actualizar
};

const cancelarActualizacion = () => {
    mostrarModalConfirmacion.value = false;
};
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

/* Estilos del Modal (reutilizados de FinalizarCompra.vue) */
.modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center }
.modal-contenido { background:#2c2525; padding:20px; border-radius:8px; text-align:center; color: #fff }
.botones-modal button { margin: 6px; padding: 8px 14px; border-radius:6px; border:none; cursor:pointer }
.confirmar { background:#007bff; color:#ffffff }
.cancelar { background:#cc2a1e; color:#ffffff }

.modal-contenido p {
    font-weight: 700;
    margin-bottom: 12px;
}

</style>