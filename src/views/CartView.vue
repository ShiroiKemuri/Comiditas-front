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
                  Precio Unitario: $ {{ formatNumber(producto.precio) }}
                </div>
              </div>
              <div class="item-controls">
                <button @click="decreaseQuantity(producto)">-</button>
                <input
                  type="number"
                  v-model.number="producto.cantidad"
                  min="1"
                  max="20"
                  @change="updateQuantity(producto)"
                />
                <button @click="increaseQuantity(producto)">+</button>
              </div>
              <div class="item-subtotal">
                $ {{ formatNumber(producto.subtotal) }}
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
import { useRouter } from "vue-router";
import { useAddToCartStore } from "../stores/addToCart";
import { onMounted } from "vue";

const cartStore = useAddToCartStore();
const router = useRouter();

// Guarda los productos en el carrito aunque se refresque la página
onMounted(() => {
  cartStore.loadCart();
});

// Calcula el subtotal de cada producto
function actualizarSubtotal(product) {
  product.subtotal = product.cantidad * product.precio;
}

//Aumenta la cantidad del producto cuando se da clic "+"
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

function cancelPurchase() {
  cartStore.limpiarCarrito();
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

.cart-page {
  padding: 16px;
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
  gap: 16px;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}
.thumb {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}
.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 0;
}
.controls button {
  padding: 0;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
}
.controls .edit-qty {
  width: 32px;
  height: 32px;
  font-size: 1.2em;
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
.price {
  color: #a0a0a0;
  font-size: 0.9em;
}
.item-actions {
  display: flex;
  align-items: center;
}
.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.item-subtotal {
  min-width: 100px;
  text-align: right;
  font-size: 1.1em;
  color: #ffffff;
  font-weight: bold;
}
.delete {
  background: #bb3d3d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
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
</style>
