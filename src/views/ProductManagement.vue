<template>
  <div class="product-management"> 
    <!-- Contenedor principal -->
    <div class="layout">
      <!-- Sección izquierda: formulario -->
      <aside class="form-section">
        <h2>Agregar/Editar Producto</h2>

        <form @submit.prevent="saveProduct">
          <label>Nombre del Producto</label>
          <input v-model="product.name" type="text" placeholder="Ej: Hamburguesa Clásica" />

          <label>Descripción</label>
          <textarea v-model="product.description" placeholder="Deliciosa hamburguesa con carne, lechuga, tomate y queso."></textarea>

          <label>Precio</label>
          <input v-model="product.price" type="number" step="0.01" placeholder="9.99" />

          <label>Imagen</label>
          <input type="file" @change="handleImageUpload" />

          <label>Categoría</label>
          <select v-model="product.category">
            <option disabled value="">Seleccione una categoría</option>
            <option v-for="(cat, index) in categories" :key="index">{{ cat }}</option>
          </select>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="clearForm">Cancelar</button>
            <button type="submit" class="btn-save">Guardar Producto</button>
          </div>
        </form>
      </aside>

      <!-- Sección derecha: tabla de productos -->
      <section class="product-list">
        <header class="list-header">
          <div class="header-title">
            <h1>Gestión de Productos</h1>
            <h2 class="brand">COMIDITAS</h2>
          </div>
          <button class="btn-back" @click="goBack">← Volver al Dashboard</button>
        </header>

        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar por nombre de producto"
          class="search-input"
        />

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
            <tr v-for="(p, index) in filteredProducts" :key="index">
              <td>
                <img :src="p.image" alt="producto" class="product-img" />
              </td>
              <td>{{ p.name }}</td>
              <td>$ {{ formatPrice(p.price) }}</td>
              <td>{{ p.category }}</td>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Productos simulados
const products = ref([
  {
    name: "Hamburguesa Clásica",
    description: "Con carne, lechuga, tomate y queso.",
    price: 9.99,
    category: "Hamburguesas",
    image: "https://via.placeholder.com/50",
  },
  {
    name: "Pizza de Pepperoni",
    description: "Pizza con pepperoni y queso.",
    price: 12.5,
    category: "Pizzas",
    image: "https://via.placeholder.com/50",
  },
  {
    name: "Ensalada César",
    description: "Lechuga, pollo, queso y aderezo césar.",
    price: 8.0,
    category: "Ensaladas",
    image: "https://via.placeholder.com/50",
  },
]);

const categories = ref(["Hamburguesas", "Pizzas", "Bebidas", "Postres", "Ensaladas"]);

const searchTerm = ref("");
const product = ref({
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
});

// Estado para el modal de eliminación
const showDeleteModal = ref(false);
const productToDelete = ref(null);

// Computed
const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

// Funciones CRUD simuladas
const saveProduct = () => {
  if (!product.value.name || !product.value.category) {
    alert("Completa todos los campos obligatorios");
    return;
  }
  products.value.push({ ...product.value });
  clearForm();
};

const editProduct = (p) => {
  product.value = { ...p };
};

const confirmDelete = (p) => {
  productToDelete.value = p;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  productToDelete.value = null;
};

const deleteProduct = () => {
  if (productToDelete.value) {
    const index = products.value.findIndex(p => p.name === productToDelete.value.name); // Usando nombre como ID temporal
    if (index !== -1) {
      products.value.splice(index, 1);
    }
  }
  cancelDelete(); // Cierra el modal y resetea
};

const clearForm = () => {
  product.value = { name: "", description: "", price: "", category: "", image: "" };
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => (product.value.image = e.target.result);
    reader.readAsDataURL(file);
  }
};

const goBack = () => {
  router.push('/admin/dashboard');
};

const formatPrice = (value) => {
  const number = Number(value);
  if (isNaN(number)) {
    return '0,00';
  }
  return number.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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