<template>
  <div class="cart">
    <h1>🛒 Carrito de Compras</h1>
    <!-- Usamos el getter 'productos' del store, que es reactivo -->
    <div v-if="cartStore.productos.length === 0">
      <p>Tu carrito está vacío.</p>
    </div>

    <div v-else>
      <ul>
        <!-- Iteramos sobre los productos del store -->
        <li
          v-for="item in cartStore.productos"
          :key="item.id"
          class="cart-item"
        >
          <strong>{{ item.nombre }}</strong> - ${{ item.precio }} x
          {{ item.cantidad }}
          <!-- Llamamos a la acción para remover el producto -->
          <button @click="cartStore.removerDelCarrito(item.id)">
            ❌ Quitar
          </button>
        </li>
      </ul>

      <!-- Usamos el getter 'total' para mostrar la suma total -->
      <h3>Total: ${{ cartStore.total }}</h3>

      <!-- Llamamos a la acción para limpiar el carrito -->
      <button @click="cartStore.limpiarCarrito()">Vaciar carrito</button>
    </div>
  </div>
</template>

<script setup>
import { useAddToCartStore } from "../stores/addToCart";

// Obtenemos la instancia de nuestro store del carrito
const cartStore = useAddToCartStore();
</script>

<style scoped>
.cart {
  padding: 20px;
}
.cart-item {
  margin-bottom: 10px;
}
button {
  margin-left: 10px;
}
</style>
