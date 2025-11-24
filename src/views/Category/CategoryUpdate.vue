<template>
    <div class="catalog-update">
        <h1>Actualizar Categoría</h1>
        <div class="form-container">
            <div v-if="categoriaCargada" class="form-section">
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { category, getCategory, updateCategory } from '@/composables/CategoryVM.js'

const categoriaCargada = ref(false);
const mostrarModalConfirmacion = ref(false);
const route = useRoute();
const router = useRouter();

onMounted(() => {
    const categoryId = route.params.id;
    if (categoryId) {
        category.value.id = categoryId;
        buscarCategoria();
    }
    document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504754524776-8f4f37790774?q=80&w=2070&auto=format&fit=crop')";
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
});

onUnmounted(() => {
    document.body.style.backgroundImage = '';
});

const buscarCategoria = async () => {
    categoriaCargada.value = false; 
    await getCategory(categoriaCargada)
};

const solicitarConfirmacion = () => {
    if (!category.value.name || !category.value.description) {
        alert('El nombre y la descripción no pueden estar vacíos.');
        return;
    }
    mostrarModalConfirmacion.value = true;
};

const confirmarActualizacion = async () => {
    mostrarModalConfirmacion.value = false;
    const success = await updateCategory();
    router.push('/admin/category/management');
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
  min-height: 100vh; 
  box-sizing: border-box;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  max-width: 400px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2.5rem 2rem;
  border-radius: 12px;
  background-color: rgba(44, 44, 44, 0.75); 
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.form-section h2 {
    margin-top: 0;
}

input[type="text"] {
  padding: 0.8em 1em;
  border-radius: 8px;
  border: 1px solid #555;
  background-color: var(--color-background);
  color: var(--color-text);
  font-size: 1em;
}

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