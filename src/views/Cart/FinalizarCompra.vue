<template>
  <div class="finalizar-compra-container">
    <!-- Vista de agradecimiento (se muestra después de enviar el formulario) -->
    <div v-if="pedidoConfirmado" class="card">
      <div class="icon-container">
        <span class="success-icon">✓</span>
      </div>
      <h1>¡Gracias por tu compra!</h1>
      <p>
        Tu pedido ha sido recibido y se está procesando. Nos pondremos en
        contacto contigo.
      </p>
      <button @click="goHome" class="home-button">Volver al Inicio</button>
    </div>

    <!-- Formulario de checkout (se muestra inicialmente) -->
    <div v-else class="card">
      <h1>Finalizar Compra</h1>
      <p>Completa tus datos para confirmar el pedido.</p>

      <form @submit.prevent="confirmarPedido" class="checkout-form">
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input id="nombre" v-model="datosPedido.nombre" type="text" required />
        </div>
        <div class="form-group">
          <label for="apellido">Apellido</label>
          <input id="apellido" v-model="datosPedido.apellido" type="text" required />
        </div>
        <div class="form-group">
          <label for="telefono">Número de Teléfono</label>
          <input id="telefono" v-model="datosPedido.telefono" type="tel" required />
        </div>
        <div class="form-group">
          <label for="metodo-pago">Método de Pago</label>
          <select id="metodo-pago" v-model="datosPedido.metodoPago" required>
            <option value="" disabled>Selecciona una opción</option>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <button type="submit" class="home-button">Confirmar Pedido</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, reactive } from "vue";
import { useAddToCartStore } from "@/stores/addToCart";

const router = useRouter();
const cartStore = useAddToCartStore();
const pedidoConfirmado = ref(false);

const datosPedido = reactive({
  nombre: "",
  apellido: "",
  telefono: "",
  metodoPago: "",
});

const confirmarPedido = () => {
  // Aquí podrías enviar los datos del pedido a un backend
  console.log("Pedido confirmado con los siguientes datos:", datosPedido);

  // Cambia a la vista de agradecimiento
  pedidoConfirmado.value = true;

  // Limpia el carrito
  cartStore.limpiarCarrito();
  cartStore.saveCart();
};

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.finalizar-compra-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
}

.card {
  background: #ffffff;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.icon-container {
  margin-bottom: 1.5rem;
}

.success-icon {
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #22c55e;
  color: white;
  font-size: 2.5rem;
  line-height: 60px;
}

.card h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.card p {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.home-button {
  background-color: #ea580c;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  font-size: 1rem;
}

.checkout-form {
  margin-top: 2rem;
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
  outline-color: #ea580c;
}
</style>