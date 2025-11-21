<template>
  <div class="product-management"> 

    <!-- Contenedor principal -->
    <div class="layout">
      
      <aside class="form-section">
        <h2>{{ product.id ? 'Editar Producto' : 'Agregar Producto' }}</h2>

        <!-- Contenedor de Notificaciones -->
        <div v-if="notification.message" :class="['notification', notification.type]">
          {{ notification.message }}
        </div>

        <form @submit.prevent="handleSubmit">
          <label>Nombre del Producto</label>
          <input v-model="product.name" type="text" placeholder="Ej: Hamburguesa Clásica" required maxlength="20" />

          <label>Descripción</label>
          <textarea v-model="product.description" placeholder="Ingredientes..." required maxlength="100"></textarea>

          <label>Precio</label>
          <input v-model="product.price" type="number" step="0.01" placeholder="0.00" required @input="validatePrice" />

          <label>URL de la Imagen</label>
          <input v-model="product.image" type="text" placeholder="https://example.com/image.jpg" />
          <img v-if="product.image" :src="product.image" style="width:50px; margin-top:5px;"/>

          <label>Categoría</label>
          <select v-model="product.category_id" required>
            <option :value="null" disabled>Seleccione una categoría</option>
            <option 
                v-for="cat in categories" 
                :key="cat.id" 
                :value="cat.id" 
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

        <!-- Nuevo encabezado sección derecha -->
        <div class="header-products">
          <button class="btn-back" @click="goBack">← Volver al Dashboard</button>
        </div>

        <!-- Encabezado Gestión de Productos -->
        <h2 style="margin-bottom: 1rem; color: #fff;">Gestión de Productos</h2>

        <!-- Buscador -->
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por nombre de producto"
          maxlength="30"
          class="search-input"
        />
        <div v-if="searchError" class="search-error-message">
          {{ searchError }}
        </div>

        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredProducts" :key="p.id">
              <td>
                <img :src="p.image || 'https://via.placeholder.com/50'" class="product-img" />
              </td>
              <td>{{ p.name }}</td>
              <td>$ {{ formatPrice(p.price) }}</td>
              <td>{{ p.category ? p.category.name : 'Sin categoría' }}</td>
              <td>{{ p.status || 'Disponible' }}</td>
              <td class="actions">
                <button class="edit-btn" @click="editProduct(p)">✏️</button>
                <button class="delete-btn" @click="confirmDelete(p)">🗑️</button>
              </td>
            </tr>
            <!-- Mensaje para cuando no hay productos -->
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="no-results">No se encontraron productos.</td>
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
import { ref, onMounted, computed, watch, nextTick } from "vue";
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
const searchQuery = ref('');
const router = useRouter();
const searchError = ref('');
const notification = ref({ message: '', type: '' });

const showNotification = (message, type = 'error') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = { message: '', type: '' };
  }, 4000);
};

// Observador para validar el campo de búsqueda en tiempo real.
watch(searchQuery, (newValue) => {
  if (/\d/.test(newValue)) {
    searchError.value = 'La búsqueda no debe contener números.';
    nextTick(() => {
      searchQuery.value = newValue.replace(/\d/g, '');
    });
  } else {
    searchError.value = '';
  }
});

// Lógica de UI (manejador de submit)
const handleSubmit = async () => {
    // --- VALIDACIONES DEL LADO DEL CLIENTE ---
    if (!product.value.name || !product.value.description || !product.value.price || product.value.category_id === null) {
        return showNotification('Todos los campos obligatorios deben ser llenados.');
    }
    if (/\d/.test(product.value.name)) {
        return showNotification('El nombre del producto no debe contener números.');
    }
    if (product.value.price.toString().length > 7) {
        return showNotification('El precio no puede tener más de 7 dígitos.');
    }

    let result;
    if (product.value.id) {
        result = await updateProduct();
    } else {
        result = await createProduct();
    }

    if (result.success) {
        showNotification(result.message, 'success');
    } else {
        showNotification(result.message, 'error');
    }
};

// Validación en tiempo real para el precio
const validatePrice = (event) => {
    let value = event.target.value;
    if (value.length > 7) {
        event.target.value = value.slice(0, 7);
        product.value.price = Number(event.target.value);
    }
};

// Filtrar productos por nombre
const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  const lowerCaseQuery = searchQuery.value.toLowerCase();
  return products.value.filter(p => p.name.toLowerCase().includes(lowerCaseQuery));
});

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
        const result = await deleteProductFromVM(productToDelete.value.id);
        cancelDelete(); // Cierra el modal y limpia la selección.
        // Muestra una notificación si la eliminación falló (ej: producto no encontrado)
        if (!result.success) {
            showNotification(result.message, 'error');
        }
    }
};

// Formatea el precio para mostrarlo correctamente.
const formatPrice = (value) => {
    if (value === null || value === undefined) return '0,00';
    const number = Number(value);
    return isNaN(number) ? '0,00' : number.toLocaleString('es-CO', { minimumFractionDigits: 2 });
};

// Navegación
const goBack = () => {
  router.push('/admin/dashboard');
};
</script>



<style scoped>
.product-management {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
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

.notification {
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  color: #fff;
  text-align: center;
}
.notification.success {
  background-color: #28a745;
}
.notification.error {
  background-color: #dc3545;
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

/* Nueva sección alineada */
.header-products {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

/* Botón volver */
.btn-back {
  background: #333;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
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

.search-error-message {
  color: #dc3545; /* Rojo para errores */
  font-size: 0.85rem;
  margin-top: -1rem; /* Sube el mensaje para que quede más cerca del input */
  margin-bottom: 1rem;
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
  vertical-align: middle;
}

/* Centrar la columna de acciones */
th:last-child, td.actions {
  text-align: center;
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
  justify-content: center;
}

.no-results {
  text-align: center;
  color: #999;
  padding: 1.5rem;
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
