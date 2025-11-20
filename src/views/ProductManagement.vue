<template>
  <div class="product-management"> 
    <!-- Contenedor principal -->
    <div class="layout">
      
      <aside class="form-section">
        <h2>{{ product.id ? 'Editar Producto' : 'Agregar Producto' }}</h2>

        <form @submit.prevent="handleSubmit">
          <label>Nombre del Producto</label>
          <input v-model="product.name" type="text" placeholder="Ej: Hamburguesa Clásica" required />

          <label>Descripción</label>
          <textarea v-model="product.description" placeholder="Ingredientes..." required></textarea>

          <label>Precio</label>
          <input v-model="product.price" type="number" step="0.01" placeholder="0.00" required />

          <label>URL de la Imagen</label>
          <input v-model="product.image" type="text" placeholder="https://example.com/image.jpg" />
          <img v-if="product.image" :src="product.image" style="width:50px; margin-top:5px;"/>

          <label>Categoría</label>
          <select v-model="product.category" required>
            <option :value="null" disabled>Seleccione una categoría</option>
            <option 
                v-for="cat in categories" 
                :key="cat.id" 
                :value="{ id: cat.id }" 
            >
              {{ cat.name }}
            </option>
          </select>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="resetForm">Cancelar</button>
            <button type="submit" class="btn-save">
               {{ product.id ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </aside>

      <section class="product-list">
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>
                <img :src="p.image || 'https://via.placeholder.com/50'" class="product-img" />
              </td>
              <td>{{ p.name }}</td>
              <td>$ {{ formatPrice(p.price) }}</td>
              <td>{{ p.category ? p.category.name : 'Sin categoría' }}</td>
              <td class="actions">
                <button class="edit-btn" @click="editProduct(p)">✏️</button>
                <button class="delete-btn" @click="confirmDelete(p)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- Modal de Confirmación para Eliminar -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-contenido">
        <p>¿Estás seguro de que deseas eliminar este producto?</p>
        <p v-if="productToDelete" class="product-name-modal">
          <strong>{{ productToDelete.name }}</strong>
        </p>
        <div class="botones-modal">
          <button @click="deleteProduct" class="eliminar">Eliminar</button>
          <button @click="cancelDelete" class="cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';

// --- IMPORTS ---
// Se importan todas las funciones y estados reactivos necesarios desde el composable.
import { 
    product, 
    products, 
    createProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct as deleteProductFromVM, // Renombramos para evitar conflictos
    resetForm,
    prepareEdit
} from '@/composables/ProductVM.js';

// Se importa la lógica de categorías desde su propio composable.
import { categories, getCategories } from '@/composables/CategoryVM.js';

// --- CICLO DE VIDA ---
onMounted(async () => {
    await Promise.all([
        getAllProducts(),      // Cargar tabla productos
        getCategories()         // Cargar combo categorías desde su VM correcto
    ]);
});

// --- ESTADO LOCAL DEL COMPONENTE ---
const showDeleteModal = ref(false);
const productToDelete = ref(null);
const router = useRouter();

// Lógica de UI (manejador de submit)
const handleSubmit = async () => {
    if (product.value.id) {
        await updateProduct();
    } else {
        await createProduct();
    }
};

// --- FUNCIONES DE LA VISTA ---

// Prepara el formulario para editar un producto existente.
const editProduct = (p) => {
    prepareEdit(p); // Usa la función del composable para una copia profunda.
};

// Abre el modal de confirmación para eliminar.
const confirmDelete = (p) => {
  productToDelete.value = p;
  showDeleteModal.value = true;
};

// Cierra el modal de confirmación.
const cancelDelete = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

// Ejecuta la eliminación del producto.
const deleteProduct = async () => {
    if (productToDelete.value) {
        await deleteProductFromVM(productToDelete.value.id);
        cancelDelete(); // Cierra el modal y limpia la selección.
    }
};

// Formatea el precio para mostrarlo correctamente.
const formatPrice = (value) => {
    const number = Number(value);
    return isNaN(number) ? '0,00' : number.toLocaleString('es-CO', { minimumFractionDigits: 2 });
};
</script>



<style scoped>
.product-management {
  padding: 1.5rem;
}

.layout {
  display: flex;
  gap: 2rem;
}

/* Formulario */
.form-section {
  width: 30%;
  min-width: 300px;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1.5rem;
  background: #2c2c2c;
  height: fit-content;
}

.form-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

label {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #ccc;
}

input,
textarea,
select {
  border: 1px solid #555;
  border-radius: 6px;
  padding: 0.6rem;
  background-color: #1a1a1a;
  color: #e0e0e0;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.btn-cancel,
.btn-save {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-save {
  background: #007bff;
  color: white;
}
.btn-cancel {
  background: #555;
  color: white;
}

/* Lista de productos */
.product-list {
  flex-grow: 1;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 2px solid #444;
  padding-bottom: 1rem;
}

.list-header h1 {
  margin: 0;
}

.brand {
  font-size: 1rem;
  color: #ccc;
  font-weight: normal;
}

.btn-back {
  background: #333;
  color: #fff;
}

/* Buscador */
.search-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #444;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  background-color: #2c2c2c;
  color: #fff;
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  text-align: left;
  padding: 0.8rem;
  border-bottom: 1px solid #444;
}

th {
  color: #ccc;
}

.product-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #fff;
}

/* Estilos del Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-contenido {
  background: #2c2525;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  width: 90%;
  max-width: 400px;
}

.product-name-modal {
  margin: 10px 0;
  font-size: 1.1rem;
  color: #ffc107;
}

.botones-modal {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.eliminar { background: #cc2a1e; color: #ffffff; }
.cancelar { background: #555; color: #ffffff; }
</style>
