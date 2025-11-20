import { ref } from 'vue';
import Product from '@/models/Product';
import apiClient from '@/api/axiosConfig'; // Tu configuración de axios

// Estado reactivo
// Se inicializa con la estructura anidada para evitar errores de "cannot read 'id' of null" en el v-model.
const product = ref({ ...Product, category: { id: null } });
const products = ref([]); 

//Crear Producto
const createProduct = async () => {
    try {
        // El backend espera { ..., category: { id: X } }
        // Nos aseguramos de que product.value tenga esa estructura antes de enviar
        const response = await apiClient.post('/product/createProduct', product.value);

        console.log('Producto creado:', response.data);
        // Actualizamos la tabla localmente o recargamos
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
            estadoCarga.value = true; // Actualiza el estado en la vista a true
        }
    } catch (error) {
        if (estadoCarga) estadoCarga.value = false; // Asegura que el form no se muestre si hay error
        console.error('Error al obtener producto:', error);
    }
};

// 2. Obtener todos los productos (para la tabla)
const getAllProducts = async () => {
    try {
        // --- SOLUCIÓN DEFINITIVA ---
        // Leemos el token directamente desde localStorage justo antes de la petición.
        // Esto garantiza que se use el token más reciente, incluso después de un login inmediato.
        const token = localStorage.getItem('jwt_token');
        const config = {
            headers: {
                // Añadimos la cabecera de autorización manualmente.
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


// 3. Actualizar Producto
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

// 4. Eliminar Producto
const deleteProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
        await apiClient.delete(`/product/deleteProduct/${id}`);
        // Filtramos localmente para no tener que recargar todo
        products.value = products.value.filter(p => p.id !== id);
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
};

// --- ACCIONES AUXILIARES ---

// Limpiar formulario
const resetForm = () => {
    product.value = { ...Product };
};

// Cargar datos en el formulario para editar
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
