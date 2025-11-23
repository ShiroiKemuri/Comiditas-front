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
          <button
            class="desactivate-btn"
            @click="desactivateCategory(category)"
          >
            🚫
          </button>
        </div>
      </div>
    </main>
    <CategoryForm v-if="mostrarForm" @cerrar="cerrarForm" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import CategoryForm from "./CategoryForm.vue";
import {
  categories,
  getCategories,
  category as categoryModel,
  desactivateCategory as desactivateCategoryAPI,
} from "@/composables/CategoryVM";
import { onMounted } from "vue";

const router = useRouter();
const mostrarForm = ref(false);

onMounted(() => {
  getCategories();
});

const searchTerm = ref("");
const searchError = ref("");

// Observador para validar la entrada de búsqueda
watch(searchTerm, (newValue) => {
  // Permite letras, números y espacios.
  const allowedCharsRegex = /^[a-zA-Z0-9\s]*$/;
  if (!allowedCharsRegex.test(newValue)) {
    searchError.value =
      "Solo se permiten caracteres alfanuméricos, sin signos especiales.";
  } else {
    searchError.value = "";
  }
});

// Filtra las categorías por búsqueda
const filteredCategories = computed(() => {
  if (!searchTerm.value) {
    return categories.value;
  }
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Funciones simuladas
const addCategory = () => {
  // Limpiamos el estado de la categoría antes de mostrar el formulario de creación
  categoryModel.value.id = null;
  categoryModel.value.name = "";
  categoryModel.value.description = "";

  mostrarForm.value = true;
};
const cerrarForm = () => {
  mostrarForm.value = false;
  getCategories(); // Recargar categorías cuando se cierra el modal
};
const editCategory = (category) => {
  router.push({ name: "catalogUpdate", params: { id: category.id } });
};

// deleteCategory ya no se podrá usar, se cambia por desactivateCategory
/*const deleteCategory = async (cat) => {
  if (
    confirm(`¿Estás seguro de que deseas eliminar la categoría "${cat.name}"?`)
  ) {
    // Asigna el ID de la categoría a eliminar al modelo compartido
    categoryModel.value.id = cat.id;
    await deleteCategoryAPI(); // Llama a la función de la API
    alert(`Categoría "${cat.name}" eliminada.`);
    await getCategories(); // Recarga la lista de categorías
  }
};
*/

const desactivateCategory = async (cat) => {
  if (
    confirm(
      `¿Estás seguro de que deseas desactivar la categoría "${cat.name}"?`
    )
  ) {
    // Asigna el ID de la categoría a eliminar al modelo compartido
    categoryModel.value.id = cat.id;
    await desactivateCategoryAPI(); // Llama a la función de la API
    alert(`Categoría "${cat.name}" desactivada.`);
    await getCategories(); // Recarga la lista de categorías
  }
};

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
.desactivate-btn {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #fff;
}
</style>
