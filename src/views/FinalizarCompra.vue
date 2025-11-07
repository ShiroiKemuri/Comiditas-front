<template>
  <div class="finalizar-compra">
    <h2 class="titulo">Finalizar Compra</h2>

    <p class="info">Selecciona el método de pago. Al elegir una opción se mostrará una advertencia para que confirmes tu orden.</p>

    <div class="metodos">
      <button class="metodo efectivo" @click="seleccionarMetodo('Efectivo')">Efectivo</button>
      <button class="metodo whatsapp" @click="seleccionarMetodo('WhatsApp')">WhatsApp</button>
    </div>

    <!-- Modal de confirmación (solo muestra el mensaje requerido) -->
    <div v-if="mostrarConfirmacion" class="modal">
      <div class="modal-contenido">
        <p class="advertencia">Continuar con tu orden</p>
        <div class="botones-modal">
          <button @click="confirmar" class="confirmar">Continuar</button>
          <button @click="cancelar" class="cancelar">Cancelar</button>
        </div>
      </div>
    </div>
    <!-- Modal de orden generada (solo para Efectivo después de confirmar) -->
    <div v-if="mostrarOrden" class="modal">
      <div class="modal-contenido orden">
        <h3>Orden generada</h3>
        <ul class="orden-items">
          <li v-for="p in productos" :key="p.id">
            <span class="o-nombre">{{ p.nombre }}</span>
            <span class="o-cantidad">x{{ p.cantidad }}</span>
            <span class="o-subtotal">$ {{ formatNumber(p.subtotal) }}</span>
          </li>
        </ul>
        <div class="orden-total">Total a pagar: <strong>$ {{ formatNumber(total) }}</strong></div>
        <div class="botones-modal">
          <button @click="cerrarOrden" class="confirmar">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAddToCartStore } from '../stores/addToCart';

const store = useAddToCartStore();
const productos = computed(() => store.productos);
const total = computed(() => store.total || 0);

const mostrarConfirmacion = ref(false);
const mostrarOrden = ref(false);
const metodoSeleccionado = ref('');

function seleccionarMetodo(metodo) {
  metodoSeleccionado.value = metodo;
  mostrarConfirmacion.value = true;
  console.log('Método seleccionado (simulado):', metodo);
}

function confirmar() {
  console.log('Cliente confirmó la orden con método:', metodoSeleccionado.value);
  mostrarConfirmacion.value = false;

  // Sólo para 'Efectivo' abrimos el resumen de la orden
  if (metodoSeleccionado.value === 'Efectivo') {
    mostrarOrden.value = true;
  } else {
    // Para otros métodos por ahora no mostramos la orden
  }
}

function cancelar() {
  mostrarConfirmacion.value = false;
}

function cerrarOrden() {
  mostrarOrden.value = false;
}
</script>

<style scoped>
.finalizar-compra {
  max-width: 480px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0,0,0,0.08);
  text-align: center;
}

.titulo { margin-bottom: 12px; color: #222 }
.info { margin-bottom: 18px; color: #444 }
.metodos { display: flex; gap: 12px; justify-content: center; margin-bottom: 12px }
.metodo { padding: 12px 18px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600 }
.metodo.efectivo { background: #f0ad4e; color: #fff }
.metodo.whatsapp { background: #25d366; color: #fff }

.modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center }
.modal-contenido { background:#2c2525; padding:20px; border-radius:8px; text-align:center; color: #fff }
.advertencia { font-weight:700; margin-bottom:12px }
.botones-modal button { margin: 6px; padding: 8px 14px; border-radius:6px; border:none; cursor:pointer }
.confirmar { background:#007bff; color:#ffffff }
.cancelar { background:#cc2a1e; color:#ffffff }

.orden-items { list-style: none; padding: 0; margin: 12px 0; text-align: left }
.orden-items li { display:flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted rgba(255,255,255,0.1) }
.orden-items .o-nombre { flex: 1 }
.orden-items .o-cantidad { width: 60px; text-align: center }
.orden-items .o-subtotal { width: 100px; text-align: right }
.orden-total { margin-top: 10px; font-weight: 700 }
</style>
