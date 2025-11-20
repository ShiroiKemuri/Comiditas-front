import { ref } from 'vue';
<<<<<<< HEAD
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
=======
import Product from '@/models/Product';
import apiClient from '@/api/axiosConfig'; // Tu configuración de axios

// Estado reactivo
const product = ref({ ...Product });
const products = ref([]); // Lista para la tabla
const categories = ref([]); // Lista para el select

// --- ACCIONES DE PRODUCTO ---

// 1. Crear Producto
const createProduct = async () => {
    try {
        // El backend espera { ..., category: { id: X } }
        // Nos aseguramos de que product.value tenga esa estructura antes de enviar
        const response = await apiClient.post('/producto/createProducto', product.value);
        
        console.log('Producto creado:', response.data);
        // Actualizamos la tabla localmente o recargamos
        await getAllProductos(); 
        resetForm();
    } catch (error) {
        console.error('Error al crear producto:', error);
        alert('Error al guardar el producto');
>>>>>>> bacf1df59a1a77a194c48c80c9853b24eab89cab
    }
};

const getProduct = async (estadoCarga) => {
    try {
<<<<<<< HEAD
        const response = await apiClient.get(`/product/getProductById/${product.value.id}`);
=======
        const response = await apiClient.get(`/producto/getProductoById/${product.value.id}`);
>>>>>>> bacf1df59a1a77a194c48c80c9853b24eab89cab
        product.value = response.data;
        if (estadoCarga) {
            estadoCarga.value = true; // Actualiza el estado en la vista a true
        }
    } catch (error) {
        if (estadoCarga) estadoCarga.value = false; // Asegura que el form no se muestre si hay error
        console.error('Error al obtener producto:', error);
    }
};

<<<<<<< HEAD
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
=======

// 2. Obtener todos los productos (para la tabla)
const getAllProductos = async () => {
    try {
        const response = await apiClient.get('/producto/getAllProductos');
        products.value = response.data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        products.value = [];
    }
};

// 3. Actualizar Producto
const updateProduct = async () => {
    if (!product.value.id) return;
    try {
        await apiClient.put(`/producto/updateProducto/${product.value.id}`, product.value);
        console.log('Producto actualizado');
        await getAllProductos();
        resetForm();
    } catch (error) {
        console.error('Error al actualizar:', error);
    }
};

// 4. Eliminar Producto
const deleteProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
        await apiClient.delete(`/producto/deleteProducto/${id}`);
        // Filtramos localmente para no tener que recargar todo
        products.value = products.value.filter(p => p.id !== id);
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
};

// --- ACCIONES AUXILIARES ---

// Importante: Traer las categorías para llenar el <select>
const getCategoriesForSelect = async () => {
    try {
        // Reutilizamos el endpoint de categorías
        const response = await apiClient.get('/category/getAllCategories');
        categories.value = response.data; 
    } catch (error) {
        console.error('No se pudieron cargar las categorías:', error);
    }
};

// Limpiar formulario
const resetForm = () => {
    product.value = { ...Product };
};

// Cargar datos en el formulario para editar
const prepareEdit = (productToEdit) => {
    // Clona el objeto para romper la referencia reactiva directa con la tabla
    product.value = JSON.parse(JSON.stringify(productToEdit));
    
    // IMPORTANTE: Tu backend devuelve la categoría completa en el GET.
    // Si el <select> espera un objeto completo, esto funcionará bien.
    // Si el backend devuelve null en category, lo inicializamos.
    if (!product.value.category) {
        product.value.category = { id: null };
    }
};

export { 
    product, 
    products, 
    categories, 
    createProduct, 
    getProduct,
    getAllProductos, 
    updateProduct, 
    deleteProduct, 
    getCategoriesForSelect, 
    resetForm,
    prepareEdit
};

>>>>>>> bacf1df59a1a77a194c48c80c9853b24eab89cab
