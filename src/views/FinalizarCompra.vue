<template>
  <div class="finalizar-compra">
    <h2 class="titulo">Completa el siguiente formulario ✏️</h2>

    <form @submit.prevent="confirmarEnvio" class="formulario">
      <div class="campo">
        <label for="nombre">Nombre:</label>
        <input
          id="nombre"
          v-model="form.nombre"
          type="text"
          maxlength="20"
          placeholder="Ingresa tu nombre"
          required
        />
        <span v-if="!validarNombre && form.nombre">Solo letras (máx. 20)</span>
      </div>

      <div class="campo">
        <label for="direccion">Dirección:</label>
        <input
          id="direccion"
          v-model="form.direccion"
          type="text"
          maxlength="50"
          placeholder="Ej: Calle 123 #45-67"
          required
        />
        <span v-if="!validarDireccion && form.direccion"
          >Solo letras y espacios (máx. 50)</span
        >
      </div>

      <div class="campo">
        <label for="telefono">Teléfono (WhatsApp):</label>
        <input
          id="telefono"
          v-model="form.telefono"
          type="text"
          maxlength="15"
          placeholder="Ej: 3001234567"
          required
        />
        <span v-if="!validarTelefono && form.telefono"
          >Solo números (máx. 15)</span
        >
      </div>

      <div class="campo">
        <label for="medioPago">Medio de pago:</label>
        <select id="medioPago" v-model="form.medioPago" required>
          <option disabled value="">Selecciona una opción</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
        </select>
      </div>

      <button type="submit" class="boton-enviar">Enviar</button>
    </form>

    <!-- Modal de confirmación -->
    <div v-if="mostrarConfirmacion" class="modal">
      <div class="modal-contenido">
        <p>¿Continuar con tu orden?</p>
        <div class="botones-modal">
          <button @click="enviarPedido" class="confirmar">Sí</button>
          <button @click="cancelarEnvio" class="cancelar">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="pedidoEnviado" class="mensaje-exito">
      <p>
        ✅ Tu pedido fue enviado correctamente al restaurante vía WhatsApp
        (simulado).
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinalizarCompra",
  data() {
    return {
      form: {
        nombre: "",
        direccion: "",
        telefono: "",
        medioPago: "",
      },
      mostrarConfirmacion: false,
      pedidoEnviado: false,
    };
  },
  computed: {
    validarNombre() {
      return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{1,20}$/.test(this.form.nombre);
    },
    validarDireccion() {
      return /^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s#-]{1,50}$/.test(this.form.direccion);
    },
    validarTelefono() {
      return /^[0-9]{1,15}$/.test(this.form.telefono);
    },
  },
  methods: {
    confirmarEnvio() {
      if (
        !this.validarNombre ||
        !this.validarDireccion ||
        !this.validarTelefono
      ) {
        alert("Por favor completa correctamente todos los campos.");
        return;
      }

      // Simula verificación de cuenta WhatsApp
      if (!this.form.telefono.startsWith("3")) {
        alert(
          "Debes tener un número válido de WhatsApp (inicia con 3 en Colombia)."
        );
        return;
      }

      this.mostrarConfirmacion = true;
    },
    enviarPedido() {
      this.mostrarConfirmacion = false;
      this.pedidoEnviado = true;
      console.log("Pedido enviado (simulado):", this.form);
      this.form = { nombre: "", direccion: "", telefono: "", medioPago: "" };
    },
    cancelarEnvio() {
      this.mostrarConfirmacion = false;
    },
  },
};
</script>

<style scoped>
.finalizar-compra {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.titulo {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.formulario .campo {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.campo label {
  font-weight: bold;
  margin-bottom: 5px;
}

.campo input,
.campo select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.campo span {
  color: red;
  font-size: 12px;
}

.boton-enviar {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
}

.boton-enviar:hover {
  background-color: #218838;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-contenido {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: black;
}

.botones-modal button {
  margin: 10px;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.confirmar {
  background-color: #007bff;
  color: white;
}

.cancelar {
  background-color: #dc3545;
  color: white;
}

.mensaje-exito {
  text-align: center;
  margin-top: 20px;
  color: green;
  font-weight: bold;
}
</style>
