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
      
      <select v-model="selectedFilter" @change="executeSearch" class="filter-dropdown">
        
        <option value="">Filtro</option>
        <option value="entradas">Precio Mayor</option>
        <option value="platos-fuertes">Precio Menor</option>
        <option value="bebidas">Orden Alfabético</option>

      </select>
    </section>

    <hr>
    
    <section class="menu-list">
      <h2>Menú del Restaurante</h2>
      
      <p v-if="isLoading">Cargando productos...</p>
      <p v-else-if="error" class="error-message">{{ error }}</p>
      <p v-else-if="products.length === 0">No se encontraron productos.</p>
      
      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="product.imageUrl" :alt="product.name" class="product-image">
          
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-price">${{ product.price.toLocaleString() }}</p>
          </div>
          
          <button class="add-to-cart-button" @click="addToCart(product)">
            + Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
// Importa el ViewModel (Composable) que contiene la lógica
import { useHomeViewModel } from '../composables/HomeVM';

// Usa el ViewModel para acceder a todos los estados y funciones
const { products, searchTerm, selectedFilter, isLoading, error, executeSearch, addToCart } = useHomeViewModel();

const router = useRouter();

// Funciones para la navegación (Usando el router)
const goToCart = () => {
    // Esto debería abrir el sidebar o modal del carrito
    router.push('/cart');    
};

const goToAdminLogin = () => {
    // Redirecciona al formulario de login de administrador
    router.push('/admin-login'); 
};
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
  border-bottom: 2px solid #ffffff;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.restaurant-name {
  color: #ffffff;
}

.header-actions .icon-button {
  padding: 10px 15px;
  margin-left: 10px;
  cursor: pointer;
  border: 1px solid #ffffff;
  background-color: #700b0b;
  border-radius: 5px;
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
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
}

.search-bar button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
}

.filter-dropdown {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

/* Estilos de la Lista de Productos */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
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
  font-size: 1.2em;
}

.product-price {
  font-weight: bold;
  color: #28a745;
}

.add-to-cart-button {
  background-color: #ffc107;
  color: #333;
  border: none;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  cursor: pointer;
}
</style>