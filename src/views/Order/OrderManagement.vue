<template>
  <div class="orders-container">
    <header class="orders-header">
      <h1>Órdenes del Día</h1>
      <!-- 2. Botón para regresar a la página principal o al dashboard -->
      <button @click="goBack" class="btn-back">Regresar</button>
    </header>

    <div v-if="loading" class="loading">Cargando órdenes...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div class="bg-page">
      <div v-if="!loading && !error" class="orders-table-wrapper">
        <!-- 4 y 5. Mostrar todas las órdenes con sus detalles -->
        <table class="orders-table">
          <thead>
            <tr>
              <th>Id_Orden</th>
              <th>Id_Cliente</th>
              <th>Platos Solicitados</th>
              <th>Total a Pagar</th>
              <th>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="orders.length === 0">
              <td colspan="5">
                No hay órdenes registradas para el día de hoy.
              </td>
            </tr>
            <!-- 6. Las órdenes ya vienen ordenadas desde el backend -->
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.customerId }}</td>
              <td>
                <ul>
                  <li v-for="item in order.items" :key="item.id">
                    {{ item.dishName }} (x{{ item.quantity }})
                  </li>
                </ul>
              </td>
              <td>{{ formatCurrency(order.total) }}</td>
              <td>{{ formatDateTime(order.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"; // Asegúrate de tener axios instalado
import apiClient from "@/api/axiosConfig.js"; // Importa el cliente API configurado

export default {
  name: "VerOrdenes",
  data() {
    return {
      orders: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchTodaysOrders() {
      this.loading = true;
      this.error = null;
      try {
        // Llama al endpoint del backend
        const response = await axios.get("/api/orders/today");
        this.orders = response.data;
      } catch (err) {
        console.error("Error al obtener las órdenes:", err);
        this.error =
          "No se pudieron cargar las órdenes. Por favor, intente de nuevo más tarde.";
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      // Navega a la ruta del dashboard del administrador o a la página principal
      this.$router.push("/admin/dashboard");
    },
    formatCurrency(value) {
      // Formatea el valor a un string de moneda (ej. $1,234.56)
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(value);
    },
    formatDateTime(dateTimeString) {
      // Si el valor de la fecha no es válido, retorna un texto alternativo.
      if (!dateTimeString) {
        return "Fecha no disponible";
      }
      // Formatea la fecha y hora
      const date = new Date(dateTimeString);
      // Comprueba si el objeto de fecha es válido.
      if (isNaN(date.getTime())) {
        console.error("Valor de fecha y hora inválido:", dateTimeString);
        return "Fecha inválida";
      }
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      return new Intl.DateTimeFormat("es-ES", options).format(date);
    },
  },
  created() {
    // Llama al método para obtener los datos cuando el componente es creado
    this.fetchTodaysOrders();
  },
};
</script>

<style scoped>
.orders-container {
  padding: 2rem;
  font-family: sans-serif;
}
.orders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.btn-back {
  padding: 0.5rem 1rem;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  color: black;
}
.orders-table th {
  border: 1px solid black;
  padding: 12px;
  background-color: white;
  color: black;
}
.orders-table td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
.orders-table th {
  background-color: yellow;
}
.orders-table ul {
  padding-left: 20px;
  margin: 0;
}
.bg-page {
  background: linear-gradient(to bottom right, #fafafa, #f0f0f0);
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh; /* Alto completo */
}
.loading,
.error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}
.error {
  color: red;
}
</style>
