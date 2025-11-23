<template>
  <div class="cart-container">
    <h1>Tu Carrito</h1>

    <!-- Lista de productos -->
    <div v-if="cart.length > 0">
      <ul>
        <li v-for="(item, index) in cart" :key="index">
          {{ item.nombre }} - {{ item.cantidad }} x ${{ item.precio }}
        </li>
      </ul>
      <p><strong>Total:</strong> ${{ total }}</p>

      <!-- Botón para finalizar compra -->
      <button @click="openForm = true">Finalizar compra</button>
    </div>
    <p v-else>Tu carrito está vacío.</p>

    <!-- Formulario para los datos del cliente -->
    <div v-if="openForm" class="form-container">
      <h2>Datos del cliente</h2>
      <form @submit.prevent="confirmarPedido">
        <label>Nombre:</label>
        <input v-model="cliente.nombre" required pattern="[A-Za-z\s]{1,20}" />

        <label>Dirección:</label>
        <input v-model="cliente.direccion" required maxlength="50" />

        <label>Teléfono:</label>
        <input v-model="cliente.telefono" required pattern="[0-9]{1,15}" />

        <label>Medio de pago:</label>
        <select v-model="cliente.medioPago" required>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
        </select>

        <button type="submit">Enviar</button>
        <button type="button" @click="openForm = false">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 🛒 Carrito de ejemplo (más adelante se conectará al backend)
const cart = ref([
  { nombre: "Hamburguesa", cantidad: 2, precio: 12000 },
  { nombre: "Gaseosa", cantidad: 1, precio: 4000 },
]);

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.cantidad * item.precio, 0)
);

const openForm = ref(false);
const cliente = ref({
  nombre: "",
  direccion: "",
  telefono: "",
  medioPago: "",
});

const confirmarPedido = () => {
  if (confirm("¿Continuar con tu orden?")) {
    const mensaje = `
🍔 *Nuevo pedido:*
${cart.value.map((i) => `${i.nombre} x${i.cantidad}`).join("\n")}
💰 Total: $${total.value}

👤 Cliente: ${cliente.value.nombre}
🏠 Dirección: ${cliente.value.direccion}
📞 Tel: ${cliente.value.telefono}
💳 Pago: ${cliente.value.medioPago}
`;

    // 👉 Aquí iría la lógica para enviar al backend o abrir WhatsApp
    const url = `https://wa.me/573001112233?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(url, "_blank");
  }
};
</script>

<style scoped>
.cart-container {
  max-width: 500px;
  margin: auto;
}
.form-container {
  margin-top: 20px;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 10px;
}
button {
  margin: 5px;
}
</style>
