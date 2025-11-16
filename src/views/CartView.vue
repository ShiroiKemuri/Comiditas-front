<template>
  <div class="cart-page">
    <header class="cart-header">
      <button class="back-btn" @click="goBack">← Volver</button>
      <h1>🛒 Carrito</h1>
      <div class="cart-icon"></div>
    </header>

    <main class="cart-main">
      <section class="cart-list">
        <div v-if="cartStore.productos.length === 0" class="empty-cart">
          <div class="empty-illustration">😞</div>
          <h2>Tu carrito está vacío</h2>
          <p>Empieza a agregar productos.</p>
          <button @click="goBack">Volver a la tienda</button>
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
                <button @click="decreaseQuantity(producto)">-</button>
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
                <button class="delete" @click="remove(producto.id)">
                  Eliminar
                </button>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <aside class="cart-summary">
        <h3>Resumen de la compra</h3>
        <div class="summary-row">
          <span>Subtotal de productos</span>
          <span>$ {{ formatNumber(cartStore.subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>IVA (19%)</span>
          <span>$ {{ formatNumber(cartStore.iva) }}</span>
        </div>
        <div class="summary-row total">
          <strong>Total a pagar</strong>
          <strong>$ {{ formatNumber(cartStore.totalConIva) }}</strong>
        </div>

        <div class="summary-actions">
          <button class="cancel" @click="cancelPurchase">
            Cancelar compra
          </button>
          <button class="checkout" @click="finalizePurchase">
            Finalizar compra
          </button>
        </div>
      </aside>
    </main>
  </div>
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
  if (product.cantidad < 20) {
    product.cantidad++;
    actualizarSubtotal(product);
    cartStore.saveCart();
  }
};

//Decrese la cantidad del producto cuando se da clic "-"
const decreaseQuantity = (product) => {
  if (product.cantidad > 1) {
    product.cantidad--;
    actualizarSubtotal(product);
    cartStore.saveCart();
  }
};

//Actualiza la cantidad del producto para que cumpla con las normas
const updateQuantity = (product) => {
  if (product.cantidad < 1) product.cantidad = 1;
  if (product.cantidad > 20) product.cantidad = 20;
  actualizarSubtotal(product);
  cartStore.saveCart();
};

function formatNumber(n) {
  return Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Función para eliminar producto (a implementar)
function remove(productId) {
  cartStore.removerDelCarrito(productId);
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

function goBack() {
  router.back();
}
</script>

<style scoped>
/* 🔽 Ocultar flechas en Chrome, Edge y Safari */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
.cart-list {
  background: #0c0b0b;
  border-radius: 8px;
  padding: 35px;
}
.empty-cart {
  text-align: center;
  padding: 40px 10px;
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
  max-height: 60vh;
  overflow-y: auto;
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
  padding: 16px;
  height: fit-content;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  font-size: 1rem;
  color: #111827;
}

.summary-row.total {
  border-top: 1px solid #ffffff;
  padding-top: 8px;
}
.summary-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
.btn-cancel:hover {
  background-color: #991b1b;
}
.btn-cancel:disabled {
  background-color: #82898f;
  cursor: not-allowed;
}
.checkout {
  background: #2b8aef;
  color: rgb(255, 255, 255);
}
</style>
