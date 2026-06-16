<template>
  <div class="home-container">
    
    <header class="navbar">
      <div class="nav-container">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Comiditas Logo" class="logo-img" />
          <span>Comiditas</span>
        </div>
        <nav class="nav-links">
          <a @click="goHome">Inicio</a>
          
          <a @click="goToCart" class="nav-button-like">🛒 Carrito</a>
          <a @click="goToAdminLogin" class="nav-button-like">Admin</a>
        </nav>
      </div>
    </header>

    <main class="main-content">
      
      <section class="hero">
      <div class="hero-content">
        <h1>Descubre Comiditas Deliciosas</h1>
        <p>Explora frutas frescas, verduras, snacks y bebidas entregados directamente a la puerta de tu casa</p>

        <div class="search-container">
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchTerm" 
              placeholder="Busca tus Comiditas favoritas..." 
              @keyup.enter="executeSearch"
            />
            <button @click="executeSearch">Buscar</button>
          </div>
          <select v-model="selectedFilter" @change="executeSearch" class="filter-select">
            <option value="">Filtro</option>
            <option value="entradas">Precio Mayor</option>
            <option value="platos-fuertes">Precio Menor</option>
            <option value="bebidas">Orden Alfabético</option>
          </select>
        </div>
        </div>
    </section>
      <section class="category-section">
        <h2>Categorías Populares</h2>
        <p>Explora nuestras categorías más populares y encuentra tus Comiditas favoritas</p>
        </section>

      <section class="featured-products">
        <h2>Comiditas Destacadas</h2>
        <p>Consulta nuestras selecciones principales y los favoritos de los clientes</p>
        
        <p v-if="isLoading">Cargando productos...</p>
        <p v-else-if="error" class="error-message">{{ error }}</p>
        <p v-else-if="products.length === 0">No se encontraron productos. 🥺</p>
        
        <div v-else class="product-grid">
          <div v-for="product in products" :key="product.id" class="product-card">
            <img :src="product.imageUrl" :alt="product.name" class="product-image">
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description || 'Descripción no disponible.' }}</p>
              <div class="product-footer">
                <span class="product-price">$ {{ formatPrice(product.price * 1) }}</span>
                <button class="add-to-cart-button" @click="handleAddToCartWithQty(product)">
                  + Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>

    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-about">
          <h3 class="footer-logo">Comiditas</h3>
          <p>Tus deliciosas Comiditas entregadas directamente a la puerta de tu casa</p>
        </div>
        <div class="footer-links">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li><a @click="goHome">Inicio</a></li>
            
            <li><a @click="goToCart">Mi Carrito</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Para Vendedores</h4>
          <ul>
            <li><a @click="goToAdminLogin">Admin Dashboard</a></li>
          </ul>
        </div>
        <div class="footer-links">
          <h4>Categorías</h4>
          <ul>
            <li><a href="#">Frutas</a></li>
            <li><a href="#">Verduras</a></li>
            <li><a href="#">Snacks</a></li>
            <li><a href="#">Bebidas</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Comiditas. All rights reserved.</p>
        <div class="social-icons">
          <a href="#">F</a>
          <a href="#">T</a>
          <a href="#">I</a>
        </div>
      </div>
    </footer>

    <CarritoModal
      v-if="mostrarModal"
      :product="productoSeleccionado"
      @cerrar="cerrarModal"
      />
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useHomeViewModel } from '../composables/HomeVM';
import CarritoModal from '@/views/Cart/CarritoModal.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useAddToCartStore } from "../stores/addToCart";

const { products, searchTerm, selectedFilter, isLoading, error, executeSearch, addToCart } = useHomeViewModel();

const mostrarModal = ref(false);
const productoSeleccionado = ref(null);
const cartStore = useAddToCartStore();

const router = useRouter();

const handleAddToCartWithQty = (product) => {
  const qty = 1;
  addToCart(product, qty);
  cartStore.saveCart();
  productoSeleccionado.value = product;
  mostrarModal.value = true;
};

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

const goToCart = () => {
  router.push("/cart");
};

const goToAdminLogin = () => {
    router.push({name: 'login'}); 
};

const goHome = () => {
  router.push('/');
};

</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9; 
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.nav-container,
.main-content,
.footer-container,
.footer-bottom {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar .nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #d97706; 
}
.logo-img {
  height: 90px;
  width: auto;
  object-fit: contain;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-links a {
  text-decoration: none;
  color: #374151; 
  font-weight: 500;
  cursor: pointer;
}

.nav-links a:hover {
  color: #d97706;
}

.nav-links a.nav-button-like {
  padding: 8px 16px;
  border-radius: 6px;
  background-color: #f3f4f6;
}
.nav-links a.nav-button-like:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  display: flex;
  flex-grow: 1;
  max-width: 500px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-select {
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 1rem;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  padding: 15px 20px;
  font-size: 1rem;
}

.search-bar input:focus {
  outline: none;
}

.search-bar button {
  border: none;
  background-color: #ea580c; 
  color: white;
  padding: 0 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #d97706;
}

.main-content {
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: #ffffff;
}

.category-section,
.featured-products {
  text-align: center;
  margin-bottom: 60px;
}

.category-section {
  gap: 1rem;
}

.category-section h2,
.featured-products h2 {
  font-size: 2.2rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}

.category-section p,
.featured-products p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 40px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  text-align: left;
}

.product-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 5px 0;
}

.product-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 15px 0;
  flex-grow: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.product-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #111827;
}

.add-to-cart-button {
  background-color: #ea580c;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.add-to-cart-button:hover {
  background-color: #d97706;
}

.site-footer {
  background-color: #ffffff;
  padding-top: 60px;
  border-top: 1px solid #eee;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  padding-bottom: 40px;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #d97706;
  margin: 0 0 10px 0;
}

.footer-about p {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-links h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 15px;
}

.footer-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  text-decoration: none;
  color: #6b7280;
  cursor: pointer;
}

.footer-links a:hover {
  color: #d97706;
}

.footer-bottom {
  border-top: 1px solid #e5e7eb;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #6b7280;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icons a {
  color: #6b7280;
  text-decoration: none;
}

.hero {
  background: linear-gradient(100deg, #f9b17a, #f7941d);
  color: white;
  text-align: center;
  padding: 80px 20px;
}

.hero-content h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.hero-content p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 30px auto;
  opacity: 0.9;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  padding: 15px 20px;
  font-size: 1rem;
}

.search-bar input:focus {
  outline: none;
}

.search-bar button {
  border: none;
  background-color: #ea580c;
  color: white;
  padding: 0 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #d97706;
}

</style>