<template>
  <div class="product-management"> 
    <header class="top-bar">
      <h2 class="brand">COMIDITAS</h2>
      <button class="btn-back" @click="goBack">← Volver al Dashboard</button>
    </header>

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
          <input v-model="product.imageUrl" type="text" placeholder="https://example.com/image.jpg" />
          <img v-if="product.imageUrl" :src="product.imageUrl" style="width:50px; margin-top:5px;"/>

          <label>Categoría</label>
          <select v-model="product.category_id" required>
            <option :value="null" disabled>Seleccione una categoría</option>
            <option 
                v-for="cat in activeCategories" 
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
                <img :src="p.imageUrl || 'https://via.placeholder.com/50'" class="product-img" />
              </td>
              <td>{{ p.name }}</td>
              <td>$ {{ formatPrice(p.price) }}</td>
              <td>{{ p.category ? p.category.name : "Sin categoría" }}</td>
              <td>{{ p.active ? "Disponible" : "No Disponible" }}</td>
              <td class="actions">
                <button class="edit-btn" @click="editProduct(p)">✏️</button>
                <button class="delete-btn" @click="confirmDeactivate(p)">🚫</button>
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

    <!-- Modal de Confirmación para Desactivar -->
    <div v-if="showDeactivateModal" class="modal">
      <div class="modal-contenido">
        <p>¿Estás seguro de que deseas desactivar este producto?</p>
        <p v-if="productToDeactivate" class="product-name-modal">
          <strong>{{ productToDeactivate.name }}</strong>
        </p>
        <div class="botones-modal">
          <button @click="desactivateProduct" class="eliminar">Desactivar</button>
          <button @click="cancelDeactivate" class="cancelar">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRouter } from 'vue-router';

import { 
    product, 
    products, 
    createProduct, 
    getAllProducts, 
    updateProduct, 
    desactivateProducto as deactivateProductFromVM,
    resetForm,
    prepareEdit
} from '@/composables/ProductVM.js';

import { categories, getCategories } from '@/composables/CategoryVM.js';

onMounted(async () => {
    await Promise.all([
        getAllProducts(),      
        getCategories()         
    ]);
});

const activeCategories = computed(() => {
    return categories.value.filter(cat => cat.active);
});

// Lista filtrada de productos por nombre
const filteredProducts = computed(() => {
  const activeProducts = products.value.filter(p => p.active);
  const query = (searchQuery.value || '').toLowerCase().trim();
  if (!query) return activeProducts;
  return activeProducts.filter(p => (p.name || '').toLowerCase().includes(query));
});

const showDeactivateModal = ref(false);
const productToDeactivate = ref(null);
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

// Limitar y sanear el precio en tiempo real
const validatePrice = () => {
  let v = product.value.price;
  if (v === null || v === undefined) { product.value.price = ''; return; }
  // Convertir a string y eliminar caracteres no numéricos excepto punto
  v = String(v).replace(/[^0-9.]/g, '');
  // Evitar múltiples puntos
  const parts = v.split('.')
  if (parts.length > 2) {
    v = parts[0] + '.' + parts.slice(1).join('');
  }
  // Limitar a dos decimales
  const [intPart, decPart = ''] = v.split('.');
  const cleanInt = intPart.replace(/^0+(?=\d)/, '');
  const limitedDec = decPart.slice(0, 2);
  v = limitedDec ? `${cleanInt}.${limitedDec}` : cleanInt;
  // Evitar números muy largos
  if (cleanInt.length > 7) {
    v = cleanInt.slice(0, 7) + (limitedDec ? `.${limitedDec}` : '');
  }
  product.value.price = v;
};

const editProduct = (p) => {
    prepareEdit(p);
};
const confirmDeactivate = (p) => {
  productToDeactivate.value = p;
  showDeactivateModal.value = true;
};
const cancelDeactivate = () => {
  showDeactivateModal.value = false;
  productToDeactivate.value = null;
};

const desactivateProduct = async () => {
    if (productToDeactivate.value) {
        await deactivateProductFromVM(productToDeactivate.value.id);
        await getAllProducts(); // Recargamos los productos
        cancelDeactivate();
    }
};

const formatPrice = (value) => {
    if (value === null || value === undefined) return '0,00';
    const number = Number(value);
    return isNaN(number) ? '0,00' : number.toLocaleString('es-CO', { minimumFractionDigits: 2 });
};

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

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.brand {
  font-weight: bold;
  font-size: 1.3rem;
  color: #ffffff;
}

.layout {
  display: flex;
  gap: 2rem;
}

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

.search-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #444;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  background-color: #2c2c2c;
  color: #fff;
}

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

.edit-btn,
.delete-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #fff;
}

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