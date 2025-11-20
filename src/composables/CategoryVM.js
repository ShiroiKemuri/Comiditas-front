import { ref } from "vue";
import Category from "@/models/Category";
import apiClient from "@/api/axiosConfig";

const category = ref({ ...Category });
const categories = ref([]);

const createCategory = async () => {
  try {
    const response = await apiClient.post(
      "/category/createCategory",
      category.value
    );
    console.log("Categoría creada");
  } catch (error) {
    console.error("Error al crear categoría:", error);
  }
};

const getCategory = async (estadoCarga) => {
  try {
    const response = await apiClient.get(
      `/category/getCategoryById/${category.value.id}`
    );
    category.value = response.data;
    if (estadoCarga) {
      estadoCarga.value = true; // Actualiza el estado en la vista a true
    }
  } catch (error) {
    if (estadoCarga) estadoCarga.value = false; // Asegura que el form no se muestre si hay error
    console.error("Error al obtener categoría:", error);
  }
};

const desactivateCategory = async () => {
  try {
    await apiClient.put(`/category/desactivateCategory/${category.value.id}`);
    console.log("Categoría desactivada");
  } catch (error) {
    console.error("Error al desactivar categoría:", error);
  }
};

// deleteCategory ya no se podrá usar, se cambia por desactivateCategory
/*const deleteCategory = async () => {
  try {
    await apiClient.delete(`/category/deleteCategory/${category.value.id}`);
    console.log("Categoría eliminada");
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
  }
};
*/

const updateCategory = async () => {
  try {
    await apiClient.put(
      `/category/updateCategory/${category.value.id}`,
      category.value
    );
    console.log("Categoría actualizada");
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
  }
};

const getCategories = async () => {
  try {
    const response = await apiClient.get("/category/getAllCategories");
    categories.value = response.data; // Asigna la respuesta a la referencia reactiva
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    categories.value = []; // En caso de error, asegura que sea un array vacío
  }
};

export {
  category,
  categories,
  createCategory,
  getCategory,
  desactivateCategory,
  updateCategory,
  getCategories,
};
