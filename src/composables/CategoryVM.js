import {ref} from 'vue';
import Category from '@/models/Category';
import apiClient from '@/api/axiosConfig';

const category = ref({ ...Category });

const createCategory = async () => {
    try {
        const response = await apiClient.post('/category/createCategory', category.value);
        console.log('Categoría creada');
    } catch (error) {
        console.error('Error al crear categoría:', error);
    }
};

const getCategory = async () => {
    try {
        const response = await apiClient.get(`/category/getCategoryById/${category.value.id}`);
        category.value = response.data;
    } catch (error) {
        console.error('Error al obtener categoría:', error);
    }
};

const deleteCategory = async () => {
    try {
        await apiClient.delete(`/category/deleteCategory/${category.value.id}`);
        console.log('Categoría eliminada');
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
    }
};

const updateCategory = async () => {
    try {
        await apiClient.put(`/category/updateCategory/${category.value.id}`, category.value);
        console.log('Categoría actualizada');
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
    }
};

export { category, createCategory, getCategory, deleteCategory, updateCategory };