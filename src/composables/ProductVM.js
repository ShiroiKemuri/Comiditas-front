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
        // Se crea un objeto 'payload' solo con los campos necesarios para el backend.
        // Esto evita enviar campos extra como 'status' o 'stock'.
        const payload = {
            name: product.value.name,
            description: product.value.description,
            price: product.value.price,
            image: product.value.image,
            category_id: product.value.category_id
        };
        const response = await apiClient.post('/product/createProduct', payload);

        console.log('Producto creado:', response.data);
        // Actualizamos la tabla localmente o recargamos
        await getAllProducts();
        resetForm();
        return { success: true, message: 'Producto guardado exitosamente.' };
    } catch (error) {
        console.error('Error al crear producto:', error);
        return { success: false, message: 'Error al guardar el producto. Inténtalo de nuevo.' };
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
        await apiClient.put(`/product/updateProduct/${product.value.id}`, product.value); // Asegúrate que el payload sea el correcto
        console.log('Producto actualizado');
        await getAllProducts();
        resetForm();
        return { success: true, message: 'Producto actualizado exitosamente.' };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            await getAllProducts(); // Refresca la lista para remover el producto que ya no existe
            return { success: false, message: `El producto '${product.value.name}' no fue encontrado. Pudo haber sido eliminado.` };
        }
        console.error('Error al actualizar:', error);
        return { success: false, message: 'Error al actualizar el producto. Inténtalo de nuevo.' };
    }
};

// 4. Eliminar Producto
const deleteProduct = async (id) => {
    try {
        await apiClient.delete(`/product/deleteProducto/${id}`);
        // Filtramos localmente para no tener que recargar todo
        products.value = products.value.filter(p => p.id !== id);
        return { success: true, message: 'Producto eliminado.' }; // Devuelve éxito para posible notificación
    } catch (error) {
        if (error.response && error.response.status === 404) {
            await getAllProducts(); // Sincroniza la lista
            return { success: false, message: `El producto no fue encontrado y no se pudo eliminar.` };
        }
        console.error('Error al eliminar:', error);
        return { success: false, message: 'Error al eliminar el producto.' };
    }
};

// --- ACCIONES AUXILIARES ---

// Limpiar formulario
const resetForm = () => {
    product.value = { ...Product, category: { id: null } };
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
