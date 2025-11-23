<template>
  <div class="editar-categorias">
    <h2>Modificar Categoría</h2>
    
    <!-- Formulario para editar la categoría -->
    <form @submit.prevent="guardarCambios">
      <input type="text" v-model="nombreCategoria" placeholder="Nombre de la categoría" />
      <button type="submit">Guardar Cambios</button>
    </form>

    <!-- Modal de Confirmación -->
    <div v-if="mostrarModalConfirmacion" class="modal">
      <div class="modal-contenido">
        <p>¿Estás seguro de que deseas guardar los cambios en la categoría?</p>
        <div class="botones-modal">
          <button @click="confirmarCambios" class="confirmar">Aceptar</button>
          <button @click="cancelarCambios" class="cancelar">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de Éxito -->
    <div v-if="mostrarModalExito" class="modal">
      <div class="modal-contenido">
        <p>¡Categoría actualizada con éxito!</p>
        <div class="botones-modal">
          <button @click="cerrarModalExito" class="confirmar">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const nombreCategoria = ref('');
const mostrarModalConfirmacion = ref(false); 
const mostrarModalExito = ref(false);

function guardarCambios() {
  if (nombreCategoria.value.trim() === '') {
    alert('El nombre de la categoría no puede estar vacío.');
    return;
  }
  mostrarModalConfirmacion.value = true;
}

async function confirmarCambios() {
  mostrarModalConfirmacion.value = false;
  
  console.log('Guardando la categoría:', nombreCategoria.value);
  mostrarModalExito.value = true;
}

function cancelarCambios() {
  mostrarModalConfirmacion.value = false;
  console.log('Modificación cancelada.');
}

function cerrarModalExito() {
  mostrarModalExito.value = false;
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-contenido {
  background: #2c2525;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
}

.botones-modal button {
  margin: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.confirmar {
  background: #007bff;
  color: #ffffff;
}

.cancelar {
  background: #cc2a1e;
  color: #ffffff;
}

.editar-categorias {
  max-width: 480px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0,0,0,0.08);
  text-align: center;
  color: #222;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}
</style>