<template>
  <div class="cart-container">

    <header class="navbar">
      <div class="nav-container">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Comiditas Logo" class="logo-img" />
          <span>Comiditas</span>
        </div>
        <nav class="nav-links">
          <a @click="goHome">Inicio</a>
         
          <a href="#" class="nav-button-like">🛒 Carrito</a>
          <a @click="goToAdminLogin" class="nav-button-like">Admin</a>
        </nav>
      </div>
    </header>
    
    <div class="cart-title">
      <h1>Tu Carrito</h1>
      <p>Revisa tus Comiditas y procede al pago cuando estés listo</p>
    </div>

    <div class="cart-layout">
      
      <section class="cart-items-section">
        <h2 class="section-title">Comiditas en el Carrito</h2>

        <div v-if="cartStore.productos.length === 0" class="empty-cart">
          <div class="empty-illustration">
            <img src="@/assets/triste.png" alt="Logo triste" class="triste-img" />
          </div>
          <h2 class="empty-cart-title">Tu carrito está vacío</h2>
          <p class="empty-cart-description">Empieza a agregar Comiditas.</p>          
        </div>

        <div v-else class="items-wrapper">
          <ul class="items" ref="itemsRef">
            <li
              v-for="producto in cartStore.productos"
              :key="producto.id"
              class="item"
            >
              <img
                v-if="producto.imageUrl"
                :src="producto.imageUrl"
                alt="imagen"
                class="thumb"
              />
              <div class="item-details">
                <strong class="name">{{ producto.nombre }}</strong>
                <div class="price">
                  Precio Unitario: $ {{ formatPrice(producto.precio) }}
                </div>
              </div>
              <div class="item-controls">
                <button @click="cartStore.decrementarCantidad(producto.id)">-</button>
                <input
                  type="number"
                  :value="producto.cantidad"
                  min="1"
                  max="20"
                  @change="updateQuantity(producto)"
                />
                <button @click="increaseQuantity(producto)">+</button>
              </div>
              <div class="item-subtotal">
                $ {{ formatPrice(producto.subtotal) }}
              </div>
              <div class="item-actions">
                <button class="delete" @click="mostrarConfirmacionEliminar(producto.id)">
                  Eliminar
                </button>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <aside class="order-summary-wrapper">
        <div class="order-summary">
          <h2 class="section-title">Resumen de la orden</h2>
          
          <div class="summary-row">
            <span>Subtotal de productos</span>
            <span>$ {{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div class="summary-row">
            <span>IVA (19%)</span>
            <span>$ {{ formatPrice(cartStore.iva) }}</span>
          </div>
          <div class="summary-row total">
            <strong>Total a pagar</strong>
            <strong>$ {{ formatPrice(cartStore.totalConIva) }}</strong>
          </div>

          <button 
            class="btn-checkout" 
            @click="finalizePurchase" 
            :disabled="cartStore.productos.length === 0">
            Proceder al Pago
          </button>
          
          <button 
            class="btn-cancel"
            @click="mostrarConfirmacionCancelar" 
            :disabled="cartStore.productos.length === 0">
            Cancelar Compra
          </button>
          
          <a class="continue-shopping" @click="goHome">Continuar Comprando</a>
        </div>
      </aside>
    </div>

    <div v-if="mostrarModalEliminar" class="modal">
      <div class="modal-contenido">
        <p class="advertencia">¿Estás seguro de que deseas eliminar la Comidita 🥺?</p>
        <p class="modal-descripcion">Esta acción no se puede deshacer.</p>
        <div class="botones-modal">
          <button @click="remove" class="remove">Eliminar Comidita</button>
          <button @click="cancelarEliminar" class="cancelar">Mantener Comidita</button>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalCancelarCompra" class="modal">
      <div class="modal-contenido">
        <p class="advertencia">¿Estás seguro de que deseas cancelar toda la compra?</p>
        <p class="modal-descripcion">Se eliminarán todas las Comiditas del carrito.</p>
        <div class="botones-modal">
          <button @click="cancelPurchase" class="remove">Eliminar Comiditas</button>
          <button @click="cancelarModal" class="cancelar">No, Volver al pago</button>
        </div>
      </div>
    </div>

    <div v-if="mostrarToast" class="toast">
      <div class="toast-content">
        <span class="toast-icon">✓</span>
        Comidita eliminada
      </div>
    </div>

  </div>
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
            
            <li><a href="#">Mi Carrito</a></li>
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
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAddToCartStore } from "../stores/addToCart";
import { onMounted } from "vue";

const cartStore = useAddToCartStore();
const router = useRouter();
const itemsRef = ref(null);

// Estados para los diferentes modales de confirmación
const mostrarModalEliminar = ref(false); // Modal para eliminar un producto individual
const mostrarModalCancelarCompra = ref(false); // Modal para cancelar toda la compra
const productoSeleccionadoId = ref(null); // ID del producto a eliminar
const mostrarToast = ref(false); // Estado para mostrar/ocultar el mensaje de confirmación

// Guarda los productos en el carrito aunque se refresque la página
onMounted(() => {
  cartStore.loadCart();
});

// Funciones para manejar el modal de eliminar producto
function mostrarConfirmacionEliminar(id) {
  productoSeleccionadoId.value = id;
  mostrarModalEliminar.value = true;
}

function cancelarEliminar() {
  mostrarModalEliminar.value = false;
  productoSeleccionadoId.value = null;
}

// Funciones para manejar el modal de cancelar compra
function mostrarConfirmacionCancelar() {
  mostrarModalCancelarCompra.value = true;
}

function cancelarModal() {
  mostrarModalEliminar.value = false;
  mostrarModalCancelarCompra.value = false;
  productoSeleccionadoId.value = null;
}

const increaseQuantity = (product) => {
  cartStore.incrementarCantidad(product.id);
  cartStore.saveCart();
};

function formatPrice(n) {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Función para editar la cantidad (a implementar)
function editQuantity(id) {
  // TODO: Implementar la edición de cantidad
  // (Esta función ya existía como TODO en tu script original)
  alert("Función 'Editar Cantidad' aún no implementada.");
}

const updateQuantity = (product) => {
  const newQty = parseInt(event.target.value, 10);
  cartStore.actualizarCantidad(product.id, newQty);
  cartStore.saveCart();
};

// Función para eliminar un producto individual del carrito
function remove() {
  if (!productoSeleccionadoId.value) return;
  cartStore.removeItem(productoSeleccionadoId.value);
  // Cerrar modal y limpiar selección
  mostrarModalEliminar.value = false;
  productoSeleccionadoId.value = null;
  // Mostrar toast de confirmación breve
  mostrarToast.value = true;
  setTimeout(() => {
    mostrarToast.value = false;
  }, 2000);
  cartStore.saveCart();
}

// Función para cancelar toda la compra
function cancelPurchase() {
  cartStore.limpiarCarrito();
  cartStore.saveCart(); // Guardar el estado del carrito vacío en localStorage
  router.back();
}

function finalizePurchase() {
  // Redirigir a la vista de finalizar compra si existe
  router.push({ name: "FinalizarCompra" });
}

function goHome() {
  router.push('/');
}

const goToAdminLogin = () => {
    router.push('/login'); 
};
</script>

<style scoped>
  
/* Estilos Globales del Componente */
.cart-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Contenedor principal para centrar contenido */
.nav-container,
.main-content,
.footer-container,
.footer-bottom {
  max-width: 1800px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

/* --- 1. BARRA DE NAVEGACIÓN --- */
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
  position: sticky;
  top: 0px;
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
  color: #d97706; /* Naranja oscuro */
}

.logo-img {
  display: block;
  align-items: left;
  height: 90px;
  width: auto;
  object-fit: contain;
}

.triste-img {
  width: 150px;
  height: auto;
  margin: 0 auto 20px auto;
  display: block;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 25px;
}

.nav-links a {
  text-decoration: none;
  color: #374151; /* Gris oscuro */
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



/* Título de la Página */
.cart-title {
  text-align: left;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.cart-title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #d97706;
  margin: 0;
}

.cart-title p {
  font-size: 1.1rem;
  color: #111827;
  margin-top: 5px;
}

.items-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


/* Layout Principal */
.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  align-items: flex-start; /* Alinea las columnas arriba */
}

/* Título de sección (Cart Items / Order Summary) */
.section-title {
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #111827;
}

/* Columna Izquierda: Lista de Items */
.items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.thumb {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #111827;
}

.price {
  color: #706969;
}

.item-quantity {
  color: #000000;
  font-size: 0.95rem;
  margin-bottom: 8px;
}

.item-subtotal {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
}

.item-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* Botones de Item */
.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-controls input {
  width: 50px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}

.item-controls button {
  width: 30px;
  height: 30px;
  border: none;
  background-color: #f0f0f0; /* Fondo gris claro para contraste */
  color: #000000; /* Color del ícono (texto) a negro */
  cursor: pointer;
  display: flex; /* Activa flexbox */
  align-items: center; /* Centra verticalmente */
  justify-content: center; /* Centra horizontalmente */
}

.delete {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: #b91c1c;
  color: white;
  transition: background-color 0.2s;
}

.delete:hover {
  background-color: #991b1b;
}

/* Caso: Carrito Vacío */
.empty-cart {
  text-align: center;
  padding: 40px;
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  background-color: #ffffff;
}
.empty-illustration {
  font-size: 3rem;
  margin-bottom: 15px;
}
.empty-cart-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 10px;
}
.empty-cart-description {
  font-size: 1rem;
  color: #6b7280;
}
.btn-secondary {
  background-color: var(--color-orange);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}
.btn-secondary:hover {
  background-color: var(--color-orange-dark);
}


/* Columna Derecha: Resumen */
.order-summary-wrapper {
  position: sticky; /* Hace que el resumen se quede fijo al hacer scroll */
  top: 150px; 
}

.order-summary {
  background: var(--color-bg);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  font-size: 1rem;
  color: #111827;
}

.summary-row.total {
  border-top: 2px solid var(--color-border);
  padding-top: 18px;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

/* Botones del Resumen */
.btn-checkout, .btn-cancel {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 6px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-checkout {
  background-color: #ea580c;
  color: white;
}
.btn-checkout:hover {
  background-color: #c2410c;
}
.btn-checkout:disabled {
  background-color: #82898f;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #b91c1c;
  color: white;
  margin-top: 12px;
}
.btn-cancel:hover {
  background-color: #991b1b;
}
.btn-cancel:disabled {
  background-color: #82898f;
  cursor: not-allowed;
}


.continue-shopping {
  display: block;
  text-align: center;
  margin-top: 18px;
  color: #ea580c;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
}
.continue-shopping:hover {
  text-decoration: underline;
}


/* --- Estilos para los Modales (Tema Claro) --- */
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
  background: #ffffff;
  padding: 30px; 
  border-radius: 12px; 
  text-align: center; 
  color: #111827;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.advertencia { 
  font-size: 1.25rem;
  font-weight: 700; 
  margin-bottom: 12px;
  color: var(--color-text); /*  advertencia */
}

.modal-descripcion {
  color: var(--color-text); /* texto claro */
  margin-bottom: 25px;
  font-size: 0.95rem;
}

.botones-modal {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.botones-modal button { 
  padding: 12px 24px; 
  border-radius: 8px; 
  border: none; 
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

/* Botón "Cancelar" / "Mantener" (Gris) */
.cancelar { 
  background: #ea580c;
  color: #ffffff;
}
.cancelar:hover {
  background: #d1d5db;
}

/* Botón "Eliminar" / "Sí, cancelar" (Rojo) */
.remove { 
  background: #b91c1c; 
  color: #ffffff;
}
.remove:hover {
  background: #991b1b;
}

/* --- Estilos para el Toast (Tema Claro) --- */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  animation: slideUp 0.3s ease-out;
}

.toast-content {
  background: #22c55e; /* Verde éxito */
  color: white;
  padding: 14px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-size: 1rem;
}

.toast-icon {
  font-size: 1.2rem;
}



/* --- 6. FOOTER --- */
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
}}
</style>
