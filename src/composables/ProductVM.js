import { ref } from 'vue';
import Product from '@/models/Product';
import apiClient from '@/api/axiosConfig';

const product = ref({ ...Product, category: { id: null } });
const products = ref([]); 


const createProduct = async () => {
    try {
        const response = await apiClient.post('/product/createProduct', product.value);
        console.log('Producto creado:', response.data);
        await getAllProducts(); 
        resetForm();
    } catch (error) {
        console.error('Error al crear producto:', error);
        alert('Error al guardar el producto');
    }
};

const getProduct = async (estadoCarga) => {
    try {
        const response = await apiClient.get(`/product/getProductById/${product.value.id}`);
        product.value = response.data;
        if (estadoCarga) {
            estadoCarga.value = true; 
        }
    } catch (error) {
        if (estadoCarga) estadoCarga.value = false;
        console.error('Error al obtener producto:', error);
    }
};

const getAllProducts = async () => {
    try {
        const token = localStorage.getItem('jwt_token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const response = await apiClient.get('/product/getAllProductos', config);
        products.value = response.data;
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        products.value = [];
    }
};


const updateProduct = async () => {
    if (!product.value.id) return;
    try {
        await apiClient.put(`/product/updateProduct/${product.value.id}`, product.value);
        console.log('Producto actualizado');
        await getAllProducts();
        resetForm();
    } catch (error) {
        console.error('Error al actualizar:', error);
    }
};

const deleteProduct = async (id) => {
    try {
        await apiClient.delete(`/product/deleteProducto/${id}`);
        products.value = products.value.filter(p => p.id !== id);
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
};

// --- ACCIONES AUXILIARES ---

const resetForm = () => {
    product.value = { ...Product, category: { id: null } };
};

const prepareEdit = (productToEdit) => {
    product.value = JSON.parse(JSON.stringify(productToEdit));
    if (!product.value.category) {
        product.value.category = { id: null };
    }
};

export { 
    product, 
    products, 
    createProduct, 
    getProduct,
    getAllProducts, 
    updateProduct, 
    deleteProduct, 
    resetForm,
    prepareEdit
};
