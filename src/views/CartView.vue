<template>
  <div class="cart">
    <h1>🛒 Carrito de Compras</h1>

    <div v-if="cart.length === 0">
      <p>Tu carrito está vacío.</p>
    </div>

    <div v-else>
      <ul>
        <li v-for="item in cart" :key="item.id" class="cart-item">
          <strong>{{ item.name }}</strong> - {{ item.price }} x {{ item.quantity }}
          <button @click="removeFromCart(item.id)">❌ Quitar</button>
        </li>
      </ul>

      <h3>Total: {{ total }}</h3>

      <button @click="clearCart">Vaciar carrito</button>
    </div>
  </div>
</template>

<script setup>
import { useCartVM } from '../composables/useCartVM'

const { cart, removeFromCart, clearCart, total } = useCartVM()
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
