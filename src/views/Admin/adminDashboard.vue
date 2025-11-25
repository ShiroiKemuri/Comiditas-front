<template>
  <div class="admin-dashboard">
    <h1 class="restaurant-name">COMIDITAS</h1>
    <header class="dashboard-header">
      <div class="header-left">
        <h1>Panel de Administrador</h1>
        <p class="welcome-text">Bienvenido al panel de administración</p>
      </div>
      <div class="header-actions">
        <button class="icon-button store-button" @click="goToHomeScreen">
          Ver tienda
        </button>
        <button @click="logout" class="logout-button">Cerrar Sesión</button>
      </div>
    </header>

    <!-- Módulo para Gestionar Productos -->
    <main class="modules-container">
      <section class="module-card">
        <h2>Gestión de Productos</h2>
        <p class="module-description">
          Aquí puedes añadir, modificar, consultar y eliminar los productos del
          menú.
        </p>
        <button @click="goToProductManagement" class="module-button">
          Ir a Productos
        </button>
      </section>

      <!-- Módulo para Gestionar Categorías -->
      <section class="module-card">
        <h2>Gestión de Categorías</h2>
        <p class="module-description">
          Define tu menú paso a paso, creando una historia para cada categoría.
        </p>
        <button @click="goToCategoryManagement" class="module-button">
          Iniciar configuración
        </button>
      </section>

      <!-- Módulo para Gestionar Órdenes -->
      <section class="module-card">
        <h2>Visualización de Órdenes</h2>
        <p class="module-description">¡Hazle seguimiento a tus pedidos!</p>
        <button @click="goToOrderManagement" class="module-button">
          Ver Órdenes
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const logout = () => {
  localStorage.removeItem("jwt_token");
  console.log("Cerrando sesión...");
  router.push({ name: "login" });
};

const goToProductManagement = () => {
  router.push("/admin/product/management");
};

const goToCategoryManagement = () => {
  router.push("/admin/category/management");
};

const goToOrderManagement = () => {
  router.push("/api/orders/today");
};

const goToHomeScreen = () => {
  router.push("/");
};
</script>

<style scoped>
.admin-dashboard {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
}

.restaurant-name {
  text-align: center;
  color: #ffffff;
  margin-bottom: 2rem;
  border-bottom: 2px solid #ffffff;
  padding-bottom: 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  /* apila título y subtítulo verticalmente */
  display: flex;
  flex-direction: column;
}

.welcome-text {
  margin-top: 0.3rem;
  font-size: 1rem;
  color: #ccc;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px; /* Espacio de 10px entre los botones */
}

.store-button {
  background-color: #17a2b8; /* Un color cian para diferenciarlo */
}

.logout-button {
  background-color: #dc3545;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.modules-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.module-card {
  background-color: #2c2c2c;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #444;
}

.module-description {
  color: #ccc;
  min-height: 60px;
}

.module-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
}
</style>
