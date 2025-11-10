<template>
  <div class="cart-page">
    <header class="cart-header">
      <div v-if="mostrarBotonVolver2" class =""></div>
      <button v-if="mostrarBotonVolver" class="back-btn" @click="goBack">← Volver</button>
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
            <li v-for="item in cartStore.productos" :key="item.id" class="item">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="imagen" class="thumb" />
              <div class="item-body">
                <div class="item-top">
                  <strong class="name">{{ item.nombre }}</strong>
                  <div class="price-details">
                    <div class="quantity">Cantidad: {{ item.cantidad }}</div>
                    <div class="price">Precio Unitario: $ {{ formatNumber(item.precio) }}</div>
                    <div class="subtotal">Subtotal: $ {{ formatNumber(item.subtotal) }}</div>
                  </div>
                </div>

                <div class="item-controls">
                  <div class="controls">
                    <button class="edit-qty" aria-label="editar cantidad">Editar Cantidad</button>
                    <button class="delete" aria-label="eliminar producto" @click="mostrarConfirmacionEliminar(item.id)">Eliminar</button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Modal para eliminar un producto individual -->
      <div v-if="mostrarModalEliminar" class="modal">
        <div class="modal-contenido">
          <p class="advertencia">¿Estás seguro de que deseas eliminar el producto {{ productoSeleccionadoId }}?</p>
          <p class="modal-descripcion">Esta acción no se puede deshacer.</p>
          <div class="botones-modal">
            <button @click="remove" class="remove">Eliminar producto</button>
            <button @click="cancelarEliminar" class="cancelar">Mantener producto</button>
          </div>
        </div>
      </div>

      <aside class="cart-summary">
        <h3>Resumen de la compra</h3>
        <div class="summary-row">
          <span>Subtotal de productos</span>
          <span>$ {{ formatNumber(subtotal) }}</span>
        </div>
        <div class="summary-row">
          <span>IVA (19%)</span>
          <span>$ {{ formatNumber(taxes) }}</span>
        </div>
        <div class="summary-row total">
          <strong>Total a pagar</strong>
          <strong>$ {{ formatNumber(total) }}</strong>
        </div>

        <div class="summary-actions">
          <button class="cancelPurchase" @click="mostrarConfirmacionCancelar" :disabled="cartStore.productos.length === 0">Cancelar compra</button>
          <button class="checkout" @click="finalizePurchase" :disabled="cartStore.productos.length === 0" >Finalizar compra</button>

          <!-- Modal para cancelar toda la compra -->
          <div v-if="mostrarModalCancelarCompra" class="modal">
            <div class="modal-contenido">
              <p class="advertencia">¿Estás seguro de que deseas cancelar toda la compra?</p>
              <p class="modal-descripcion">Se eliminarán todos los productos del carrito y volverás a la página anterior.</p>
              <div class="botones-modal">
                <button @click="cancelPurchase" class="remove">Sí, cancelar todo</button>
                <button @click="cancelarModal" class="cancelar">No, seguir comprando</button>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </main>

    <!-- Toast de confirmación -->
    <div v-if="mostrarToast" class="toast">
      <div class="toast-content">
        <span class="toast-icon">✓</span>
        Producto eliminado
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAddToCartStore } from "../stores/addToCart";

const TAX_RATE = 0.19; // IVA 19%

const cartStore = useAddToCartStore();
const router = useRouter();

const itemsRef = ref(null);

// Estados para los diferentes modales de confirmación
const mostrarModalEliminar = ref(false); // Modal para eliminar un producto individual
const mostrarModalCancelarCompra = ref(false); // Modal para cancelar toda la compra
const productoSeleccionadoId = ref(null); // ID del producto a eliminar
const mostrarToast = ref(false); // Estado para mostrar/ocultar el mensaje de confirmación

const subtotal = computed(() => {
  return cartStore.total || 0;
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

// Mostrar botón "Volver" solo si hay productos en el carrito
const mostrarBotonVolver = computed(() => {
  return cartStore.productos.length > 0;
});

// espaciador cuando no hay productos
const mostrarBotonVolver2 = computed(() => {
  return cartStore.productos.length === 0;
});

const taxes = computed(() => {
  return +(subtotal.value * TAX_RATE).toFixed(2);
});

const total = computed(() => {
  return +(subtotal.value + taxes.value).toFixed(2);
});

function formatNumber(n) {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Función para editar la cantidad (a implementar)
function editQuantity(id) {
  // TODO: Implementar la edición de cantidad
}

// Función para eliminar un producto individual del carrito
function remove() {
  const id = productoSeleccionadoId.value;
  if (!id) return;
  cartStore.removerDelCarrito(id);
  // Limpiar selección y cerrar modal
  productoSeleccionadoId.value = null;
  mostrarModalEliminar.value = false;
  // Mostrar mensaje de confirmación
  mostrarToast.value = true;
  // Ocultar el toast después de 2 segundos
  setTimeout(() => {
    mostrarToast.value = false;
  }, 2000);
}

// Función para cancelar toda la compra
function cancelPurchase() {
  cartStore.limpiarCarrito(); // Elimina todos los productos
  mostrarModalCancelarCompra.value = false;
  router.back(); // Vuelve a la página anterior
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
.cart-page {
  padding: 16px;

  /* --- Sticker/Marca de Agua en el Fondo --- */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><text x="10" y="50" style="font-size:20px;opacity:0.08;fill:%23ffc107;">🍔</text><text x="60" y="80" style="font-size:18px;opacity:0.08;fill:%23ffc107;">🍟</text></svg>');
  background-repeat: repeat; /* Repite el patrón de stickers */
  background-size: 80px; /* Tamaño del sticker */
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.back-btn {
  background: none;
  border: none;
  cursor: pointer;
}
.cart-main {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  margin-top: 16px;
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
.empty-illustration {
  font-size: 48px;
}
.items-wrapper {
  max-height: 60vh;
  overflow-y: auto;
}
.items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.item {
  display: flex;
  gap: 20px;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}
.thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}
.item-body {
  flex: 1;
}
.item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}
.controls button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
}
.controls .edit-qty {
  background: #2b8aef;
  color: #ffffff;
}
.controls .edit-qty:hover {
  background: #2377d1;
}
.controls .delete {
  background: #242222;
  color: #ffffff;
}
.controls .delete:hover {
  background: #3a3a3a;
}
.quantity {
  margin-top: 8px;
  color: #ffffff;
  font-weight: 500;
}
.price {
  margin-top: 4px;
  color: #ffffff;
}
.subtotal {
  margin-top: 4px;
  color: #2b8aef;
  font-weight: bold;
}
.cart-summary {
  background: #0c0b0b;
  border-radius: 8px;
  padding: 16px;
  height: fit-content;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
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
.cancel {
  background: #bb3d3d;
}
.checkout {
  background: #2b8aef;
  color: rgb(255, 255, 255);
}

/* Estilos para los modales de confirmación */
.modal { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  background: rgba(0,0,0,0.75); 
  display: flex; 
  align-items: center; 
  justify-content: center;
  z-index: 1000;
}

.modal-contenido { 
  background: #0c0b0b; 
  padding: 24px; 
  border-radius: 12px; 
  text-align: center; 
  color: #fff;
  max-width: 400px;
  width: 90%;
}

.advertencia { 
  font-size: 1.1em;
  font-weight: 700; 
  margin-bottom: 12px;
  color: #ff4444;
}

.modal-descripcion {
  color: #999;
  margin-bottom: 16px;
  font-size: 0.9em;
}

.botones-modal {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.botones-modal button { 
  padding: 10px 20px; 
  border-radius: 6px; 
  border: none; 
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.1s;
}

.botones-modal button:hover {
  transform: translateY(-1px);
}

.botones-modal button:active {
  transform: translateY(1px);
}

.cancelar { 
  background: #2b8aef; 
  color: #ffffff;
}

.cancelar:hover {
  background: #2377d1;
}

.remove { 
  background: #cc2a1e; 
  color: #ffffff;
}

.remove:hover {
  background: #b52219;
}

/* Estilos para el toast de confirmación */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1100;
  animation: slideUp 0.3s ease-out;
}

.toast-content {
  background: #2b8aef;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.toast-icon {
  background: rgba(255,255,255,0.2);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

</style>
