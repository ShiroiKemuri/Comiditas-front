import { ref } from 'vue';
import apiClient from '@/api/axiosConfig';
import productModel from '@/models/product';

const product = ref({ ...productModel });
const products = ref([]);

const createProduct = async () => {
    try {
        const response = await apiClient.post('/product/createProduct', product.value);
        console.log('Producto creado');
    } catch (error) {
        console.error('Error al crear producto:', error);
    }
};

const getProduct = async (estadoCarga) => {
    try {
        const response = await apiClient.get(`/product/getProductById/${product.value.id}`);
        product.value = response.data;
        if (estadoCarga) {
            estadoCarga.value = true; // Actualiza el estado en la vista a true
        }
    } catch (error) {
        if (estadoCarga) estadoCarga.value = false; // Asegura que el form no se muestre si hay error
        console.error('Error al obtener producto:', error);
    }
};

const deleteProduct = async () => {
    try {
        await apiClient.delete(`/product/deleteProduct/${product.value.id}`);
        console.log('Producto eliminado');
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
};

const updateProduct = async () => {
    try {
        await apiClient.put(`/product/updateProduct/${product.value.id}`, product.value);
        console.log('Producto actualizado');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
    }
};

const getProducts = async () => {
    try {
        const response = await apiClient.get('/product/getAllProducts');
        products.value = response.data; // Asigna la respuesta a la referencia reactiva
    } catch (error) {
        console.error('Error al obtener productos:', error);
        products.value = []; // En caso de error, asegura que sea un array vacío
    }
};

export { product, products, createProduct, getProduct, deleteProduct, updateProduct, getProducts };