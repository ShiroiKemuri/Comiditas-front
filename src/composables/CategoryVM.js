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
      estadoCarga.value = true;
    }
  } catch (error) {
    if (estadoCarga) estadoCarga.value = false;
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
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const response = await apiClient.get("/category/getAllCategories", config);
    categories.value = response.data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    categories.value = [];
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
