<template>
    <h1>Eliminar Producto</h1>
    <p>¿Estás seguro de que deseas eliminar este producto?</p>
    <div class="botones-eliminar">
      <button @click="confirmarEliminacion" class="eliminar">Eliminar</button>
      <button @click="cancelarEliminacion" class="cancelar">Cancelar</button>
    </div>
    <!-- Modal de Éxito -->
    <div v-if="mostrarModalExito" class="modal">
        <div class="modal-contenido">
            <p>¡Producto eliminado con éxito!</p>
            <div class="botones-modal">
            <button @click="cerrarModalExito" class="confirmar">Cerrar</button>
            </div>
        </div>
    </div>
    <!-- Modal de Error -->
    <div v-if="mostrarModalError" class="modal">
        <div class="modal-contenido">
            <p>Error al eliminar el producto. Por favor, inténtalo de nuevo.</p>
            <div class="botones-modal">
            <button @click="cerrarModalError" class="confirmar">Cerrar</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { product, deleteProduct } from '@/composables/ProductVM.js';

const router = useRouter();
const mostrarModalExito = ref(false);
const mostrarModalError = ref(false);

const confirmarEliminacion = async () => {
    try {
        await deleteProduct(product.value.id);
        mostrarModalExito.value = true;
    } catch (error) {
        mostrarModalError.value = true;
    }
};

const cancelarEliminacion = () => {
    router.push({ name: 'productManagement' });
};
</script>
<style scoped>
/* Puedes reutilizar los estilos de modal de tu archivo FinalizarCompra.vue */
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