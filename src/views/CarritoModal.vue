<template>
  <div class="overlay" @click.self="cerrarModal">
    <div class="modalCarrito">
        <img :src="product ? product.imageUrl : ''" alt="Foto del producto" />
        <div class="infoProducto">
          <h4>Producto en el carrito</h4>
          <p class="prod-name">{{ product ? product.name : "No hay producto seleccionado" }}</p>
          <p class="prod-desc">{{ product ? product.description : "" }}</p>

          <div class="modal-price">
            <div>Precio: ${{ formatPrice(unitPrice) }}</div>
          </div>

          <div class="modal-actions">
            <button @click="cerrarModal">Seguir comprando</button>
            <button @click="irAlCarrito">Ir al carrito</button>
          </div>
        </div>
      </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { defineProps, defineEmits, computed } from "vue";
import { useAddToCartStore } from "../stores/addToCart";

//Recibe la informacion del producto de la pagina principal
const props = defineProps({
  product: {
    type: Object,
  },
});

const router = useRouter();

//Trae las funciones de la pagina principal
const emit = defineEmits(["cerrar"]);

const store = useAddToCartStore();

// obtener precio unitario desde props
const unitPrice = computed(() => (props.product ? props.product.price : 0));

function cerrarModal() {
  emit("cerrar");
}

function irAlCarrito() {
  if (props.product) {
    const existing = store.productos.find((p) => p.id === props.product.id);
    if (!existing) {
      store.agregarAlCarrito(props.product, 1);
    }
  }
  router.push("/cart");
  emit("cerrar");
}

function formatPrice(n) {
  return Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>

<style scoped>
/* Fondo difuminado */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal */
.modalCarrito {
  background-color: #000000;
  border-radius: 12px;
  overflow: hidden;
  width: 90%;
  max-width: 400px; /* Tamaño máximo en pantallas grandes */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

/* Imagen del producto */
.modalCarrito img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Información del producto */
.infoProducto {
  padding: 15px;
  text-align: center;
}

.infoProducto h4 {
  margin-bottom: 10px;
  font-size: 1.2rem;
  color: #ffffff;
}

.infoProducto p {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #ffffff;
}

.modal-price {
  margin-top: 10px;
  font-weight: 600;
  color: #ffffff;
}
.modal-actions {
  margin-top: 12px;
}

/* Botones */
.infoProducto button {
  margin: 8px 5px 0 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #f37a17;
  color: rgb(255, 255, 255);
  transition: background-color 0.2s;
}

.infoProducto button:hover {
  background-color: #0067bb;
}

/* Animación al abrir modal */
@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Ajustes responsive */
@media (max-width: 500px) {
  .modalCarrito {
    width: 95%;
  }

  .infoProducto h4 {
    font-size: 1rem;
  }

  .infoProducto p {
    font-size: 0.85rem;
  }

  .infoProducto button {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}
</style>
