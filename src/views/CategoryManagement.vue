<template>
  <div class="category-management">
    <!-- Encabezado superior -->
    <header class="top-bar">
      <h2 class="brand">COMIDITAS</h2>
      <button class="btn-back" @click="goBack">← Volver al Dashboard</button>
    </header>

    <!-- Título principal -->
    <section class="header-section">
      <h1>Gestionar Categorías</h1>
      <p>Crea, modifica o elimina las categorías de productos para tu menú.</p>
    </section>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input
        type="text"
        placeholder="Buscar categorías..."
        v-model="searchTerm"
        maxlength="30"
      />
    </div>

    <!-- Contenedor para mensajes de estado con altura fija para evitar saltos de layout -->
    <div class="status-message-container">
      <!-- Mensaje de error para caracteres no permitidos -->
      <div v-if="searchError" class="search-error-message">
        <p>{{ searchError }}</p>
      </div>

      <!-- Mensaje si no hay resultados (se muestra solo si no hay error de caracteres) -->
      <div
        v-else-if="filteredCategories.length === 0 && searchTerm"
        class="no-results-message"
      >
        <p>No se encontró la categoría "{{ searchTerm }}".</p>
      </div>
    </div>

    <!-- Grid de categorías -->
    <main class="categories-grid">
      <!-- Tarjeta para añadir nueva categoría -->
      <div class="category-card add-card" @click="addCategory">
        <span class="add-icon">+</span>
        <p>Añadir nueva categoría</p>
      </div>

      <!-- Tarjetas dinámicas -->
      <div
        v-for="(category, index) in filteredCategories"
        :key="index"
        class="category-card"
      >
        <h3>{{ category.name }}</h3>
        <div class="actions">
          <button class="edit-btn" @click="editCategory(category)">✏️</button>
          <button class="delete-btn" @click="deleteCategory(category)">🗑️</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Datos simulados (reemplazar con fetch al backend)
const categories = ref([
  { name: "Bebidas" },
  { name: "Entradas" },
  { name: "Platos Fuertes" },
  { name: "Postres" },
  { name: "Especiales" },
]);

const searchTerm = ref("");
const searchError = ref("");

// Observador para validar la entrada de búsqueda
watch(searchTerm, (newValue) => {
  // Permite letras, números y espacios.
  const allowedCharsRegex = /^[a-zA-Z0-9\s]*$/;
  if (!allowedCharsRegex.test(newValue)) {
    searchError.value = "Solo se permiten caracteres alfanuméricos, sin signos especiales.";
  } else {
    searchError.value = "";
  }
});

// Filtra las categorías por búsqueda
const filteredCategories = computed(() => !searchTerm.value ? categories.value :
  categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

// Funciones simuladas
const addCategory = () => alert("Funcionalidad para añadir categoría");
const editCategory = (cat) =>
  alert(`Editar categoría: ${cat.name}`);
const deleteCategory = (cat) =>
  alert(`Eliminar categoría: ${cat.name}`);
const goBack = () => router.push("/admin/dashboard");
</script>

<style scoped>
.category-management {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
}

/* Barra superior */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.brand {
  font-weight: bold;
  font-size: 1.3rem;
  color: #ffffff;
}

.btn-back {
  background: #333;
  color: #fff;
}

/* Encabezado */
.header-section h1 {
  font-size: 1.8rem;
  margin-bottom: 0.3rem;
}
.header-section p {
  color: #ccc;
  font-size: 0.95rem;
}

/* Buscador */
.search-bar {
  margin: 1.5rem 0;
  display: flex;
  justify-content: flex-end;
}
.search-bar input {
  padding: 0.6rem 1rem;
  width: 250px;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #2c2c2c;
  color: #fff;
}

/* Contenedor de mensajes para estabilizar el layout */
.status-message-container {
  min-height: 2.5rem; /* Altura suficiente para un mensaje, reserva el espacio */
  margin-bottom: 1.5rem;
}

/* Mensaje de error del buscador */
.search-error-message {
  color: #ffc107; /* Un color de advertencia */
  font-size: 0.85rem;
  text-align: right; /* Alineado con el input */
}

/* Mensaje de no resultados */
.no-results-message {
  text-align: center;
  padding: 1rem;
  color: #888;
  font-style: italic;
}

/* Rejilla de categorías */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* Tarjetas */
.category-card {
  border: 1px solid #444;
  border-radius: 10px;
  padding: 1.2rem;
  text-align: center;
  position: relative;
  background: #2c2c2c;
  transition: all 0.2s ease-in-out;
}
.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Tarjeta "Agregar" */
.add-card {
  border: 2px dashed #555;
  cursor: pointer;
}
.add-icon {
  font-size: 2rem;
  display: block;
}

/* Botones de acción */
.actions {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 0.8rem;
}

.edit-btn,
.delete-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #fff;
}
</style>