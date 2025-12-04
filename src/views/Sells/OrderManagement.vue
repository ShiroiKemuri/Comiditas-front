<template>
  <div class="order-management-container">
    <header class="top-bar">
      <h2 class="brand">COMIDITAS</h2>
      <button class="btn-back" @click="goBack">← Volver al Dashboard</button>
    </header>

    <section class="header-section">
      <h1>Gestión de Ordenes</h1>
      <p>Aquí puedes consultar el historial completo de pedidos registrados hoy.</p>
    </section>

    <main class="orders-table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Número de Venta</th>
            <th>Número de Cliente</th>
            <th>Productos Solicitados (Cantidad)</th>
            <th>Total a Pagar</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="todaysSells.length === 0">
            <td colspan="5" class="no-orders">No hay pedidos para mostrar para el día de hoy.</td>
          </tr>
          <tr v-for="sell in todaysSells" :key="sell.saleId">
            <td>{{ sell.saleId }}</td>
            <td>{{ sell.saleId }}</td>
            <td>
              <ul>
                <li v-for="(item, index) in sell.items" :key="index">
                  {{ item.productName }} ({{ item.quantity }})
                </li>
              </ul>
            </td>
            <td>${{ sell.totalAmount.toLocaleString() }}</td>
            <td>{{ formatDate(sell.saleDate) }}</td>
          </tr>
        </tbody>
      </table>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from "vue-router";
import { sellsList, getAllSells } from "@/composables/SellsVM";

const router = useRouter();

onMounted(() => {
  getAllSells();
});

const goBack = () => {
  router.push("/admin/dashboard");
};

const todaysSells = computed(() => {
  const today = new Date();

  const filtered = sellsList.value.filter(sell => {
    if (!sell.saleDate) return false;
    const sellDate = new Date(sell.saleDate);

    return sellDate.getFullYear() === today.getFullYear() &&
           sellDate.getMonth() === today.getMonth() &&
           sellDate.getDate() === today.getDate();
  });
  return filtered.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>

<style scoped>
.order-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}
.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.brand { font-weight: bold; font-size: 1.3rem; }
.btn-back { background: #333; color: #fff; padding: 0.5rem 1rem; border-radius: 6px; }
.header-section { margin-bottom: 2rem; }
.filter-group { display: flex; flex-direction: column; }
.filter-group label { font-size: 0.9rem; margin-bottom: 0.3rem; }
.btn-clear-filters { align-self: flex-end; }
.orders-table-container { background-color: #2c2c2c; border-radius: 8px; padding: 1.5rem; overflow-x: auto; }
.orders-table { width: 100%; border-collapse: collapse; }
.orders-table th, .orders-table td { padding: 1rem; text-align: left; border-bottom: 1px solid #444; }
.orders-table th { background-color: #333; }
.orders-table ul { list-style-type: none; padding: 0; margin: 0; }
.no-orders { text-align: center; padding: 2rem; color: #888; }
</style>