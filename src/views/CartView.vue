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
                    <button class="delete" aria-label="eliminar">Eliminar</button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

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
          <button class="cancel" @click="cancelPurchase">Cancelar compra</button>
          <button class="checkout" @click="finalizePurchase">Finalizar compra</button>
        </div>
      </aside>
    </main>
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

const subtotal = computed(() => {
  return cartStore.total || 0;
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

// Función para eliminar producto (a implementar)
function remove(id) {
  // TODO: Implementar la eliminación de productos
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
</style>
