<template>
  <div class="sells-management-container">
    <header class="top-bar">
      <h2 class="brand">COMIDITAS</h2>
      <button class="btn-back" @click="goBack">← Volver al Dashboard</button>
    </header>

    <section class="header-section">
      <h1>Información de Ventas</h1>
      <p>Aquí puedes consultar el historial completo de ventas registradas.</p>
    </section>

    <section class="filters-section">
      <div class="filter-group">
        <label for="start-date">Fecha de inicio</label>
        <input id="start-date" v-model="startDate" type="date" />
      </div>
      <div class="filter-group">
        <label for="end-date">Fecha de fin</label>
        <input id="end-date" v-model="endDate" type="date" />
      </div>
      <button @click="clearFilters" class="btn-clear-filters">Limpiar Filtros</button>
    </section>

    <main class="sells-table-container">
      <table class="sells-table">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Productos (Cantidad)</th>
            <th>Cantidad Total</th>
            <th>Monto Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredSells.length === 0">
            <td colspan="5" class="no-sales">No hay ventas para mostrar con los filtros seleccionados.</td>
          </tr>
          <tr v-for="sell in filteredSells" :key="sell.saleId">
            <td>{{ sell.saleId }}</td>
            <td>{{ formatDate(sell.saleDate) }}</td>
            <td>
              <ul>
                <li v-for="(item, index) in sell.items" :key="index">
                  {{ item.productName }} ({{ item.quantity }})
                </li>
              </ul>
            </td>
            <td>{{ getTotalQuantity(sell.items) }}</td>
            <td>${{ sell.totalAmount.toLocaleString() }}</td>
          </tr>
        </tbody>
        <tfoot v-if="filteredSells.length > 0">
          <tr class="summary-row">
            <td><strong>Total Ventas: {{ filteredSells.length }}</strong></td>
            <td colspan="2"></td>
            <td><strong>Total Productos: {{ totalProductsSold }}</strong></td>
            <td><strong>Total: ${{ totalAmountOfFilteredSells.toLocaleString() }}</strong></td>
          </tr>
        </tfoot>
      </table>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRouter } from "vue-router";
import { sellsList, getAllSells } from "@/composables/SellsVM";

const router = useRouter();
const startDate = ref('');
const endDate = ref('');



onMounted(() => {
  getAllSells();
});

const goBack = () => {
  router.push("/admin/dashboard");
};

const filteredSells = computed(() => {
  if (!startDate.value && !endDate.value) {
    return sellsList.value;
  }
  return sellsList.value.filter(sell => {
    const sellDate = new Date(sell.saleDate);
    sellDate.setHours(0, 0, 0, 0); // Ignorar la hora para la comparación

    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;

    if (start && sellDate < start) return false;
    if (end && sellDate > end) return false;
    return true;
  });
});

const totalAmountOfFilteredSells = computed(() => {
  return filteredSells.value.reduce((sum, sell) => sum + sell.totalAmount, 0);
});

const totalProductsSold = computed(() => {
  return filteredSells.value.reduce((sum, sell) => sum + getTotalQuantity(sell.items), 0);
});

const clearFilters = () => {
  startDate.value = '';
  endDate.value = '';
};

const getTotalQuantity = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

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
.sells-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.brand {
  font-weight: bold;
  font-size: 1.3rem;
}

.btn-back {
  background: #333;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}

.header-section {
  margin-bottom: 2rem;
}

.filters-section {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #2c2c2c;
  padding: 1rem;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.btn-clear-filters {
  align-self: flex-end;
}
.sells-table-container {
  background-color: #2c2c2c;
  border-radius: 8px;
  padding: 1.5rem;
  overflow-x: auto;
}

.sells-table {
  width: 100%;
  border-collapse: collapse;
}

.sells-table th,
.sells-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #444;
}

.sells-table th {
  background-color: #333;
}

.sells-table ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.no-sales {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.summary-row {
  background-color: #1a1a1a;
  font-weight: bold;
}

.summary-row td {
  border-top: 2px solid #555;
}
</style>