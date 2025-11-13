<template>
  <div class="home-screen">
    <header class="header">
      <h1 class="restaurant-name">COMIDITAS</h1>

      <div class="header-actions">
        <button class="icon-button cart-button" @click="goToCart">
          🛒 Carrito
        </button>

        <button class="icon-button admin-button" @click="goToAdminLogin">
          👤 Admin Login
        </button>
      </div>
    </header>

    <section class="search-filter-section">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Buscar por nombre..."
        />
        <button @click="executeSearch">Buscar</button>
      </div>

      <select
        v-model="selectedFilter"
        @change="executeSearch"
        class="filter-dropdown"
      >
        <option value="">Filtro</option>
        <option value="entradas">Precio Mayor</option>
        <option value="platos-fuertes">Precio Menor</option>
        <option value="bebidas">Orden Alfabético</option>
      </select>
    </section>

    <hr />

    <section class="menu-list">
      <h2>Menú del Restaurante</h2>

      <p v-if="isLoading">Cargando productos...</p>
      <p v-else-if="error" class="error-message">{{ error }}</p>
      <p v-else-if="products.length === 0">No se encontraron productos.</p>

      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="product-image"
          />

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
          </div>

          <div class="product-qty">
            <div class="qty-controls">
              <span class="qty-value"></span>
            </div>
            <div class="product-subtotal">
              Precio: $ {{ formatPrice(product.price * 1) }}
            </div>
          </div>

          <button
            class="add-to-cart-button"
            @click="handleAddToCartWithQty(product)"
          >
            + Agregar al carrito
          </button>
        </div>
      </div>
      <CarritoModal
        v-if="mostrarModal"
        :product="productoSeleccionado"
        @cerrar="cerrarModal"
      />
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
// Importa el ViewModel (Composable) que contiene la lógica
import { useHomeViewModel } from '../composables/HomeVM';
// Importar el modal del carrito
import CarritoModal from './CarritoModal.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useAddToCartStore } from "../stores/addToCart";

//ViewModel para acceder a todos los estados y funciones
const { products, searchTerm, selectedFilter, isLoading, error, executeSearch, addToCart } = useHomeViewModel();

const mostrarModal = ref(false);
const productoSeleccionado = ref(null);
const cartStore = useAddToCartStore();

const router = useRouter();

const handleAddToCartWithQty = (product) => {
  const qty = 1; // cantidad fija desde la vista principal
  addToCart(product, qty); // Lógica de tu carrito con cantidad
  cartStore.saveCart(); // guarda el carrito actualizado en localStorage
  productoSeleccionado.value = product;
  mostrarModal.value = true;
};

// increment/decrement removed as requested

function formatPrice(n) {
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const cerrarModal = () => {
  mostrarModal.value = false;
  productoSeleccionado.value = null;
};

// Funciones para la navegación (Usando el router)
const goToCart = () => {
  // Esto debería abrir el sidebar o modal del carrito
  router.push("/cart");
};

const goToAdminLogin = () => {
  // Redirecciona al formulario de login de administrador
  router.push("/login");
};

onMounted(() => {
  document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop')";
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';
});

onUnmounted(() => {
  // Restaura el fondo por defecto al salir de la pantalla
  document.body.style.backgroundImage = '';
});
</script>

<style scoped>
/* Estilos básicos para la View */
.home-screen {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.restaurant-name {
  color: #740065;
}

.header-actions .icon-button {
  padding: 10px 15px;
  margin-left: 10px;
  background-color: #1d2841; /*color de los botones en la pagina de inicio*/
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

/* Estilos de Búsqueda y Filtros */
.search-filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
  align-items: center;
}

.search-bar {
  display: flex;
  flex-grow: 1;
  max-width: 600px;
}

.search-bar input {
  padding: 10px;
  flex-grow: 1;
  border: 1px solid var(--color-border);
  background-color: var(--color-card-bg);
  color: var(--color-text);
  border-radius: 8px 0 0 8px;
}

.search-bar button {
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
}

.filter-dropdown {
    padding: 10px;
    border: 1px solid var(--color-border);
    background-color: var(--color-card-bg);
    color: var(--color-text);
    border-radius: 8px;
}

/* Estilos de la Lista de Productos */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  background-color: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(87, 168, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 10px;
}

.product-info {
  flex-grow: 1;
}

.product-name {
  margin-top: 0;
  color: var(--color-text);
  font-size: 1.2em;
}

.add-to-cart-button {
  background-color: var(--color-accent);
  border: none;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
}

.product-qty {
  margin-top: 10px;
}
.product-qty label {
  font-size: 0.9rem;
  color: #444;
}
.qty-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.qty-value {
  min-width: 28px;
  text-align: center;
}
.product-subtotal {
  margin-top: 8px;
  font-weight: 600;
}
</style>
