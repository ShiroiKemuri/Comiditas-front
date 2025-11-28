import { ref } from 'vue';
import Product, { ProductModel } from '@/models/ProductModel';
import apiClient from '@/api/axiosConfig';

// Mantener ambas representaciones para compatibilidad con el formulario (category_id) y backend (category.id)
const product = ref({ ...Product, category: { id: null }, category_id: null });
const products = ref([]); 


const createProduct = async () => {
    try {
        // Resolver ID de categoría
        const categoryId = product.value.category_id ?? (product.value.category && product.value.category.id);
        const payload = {
            name: product.value.name?.trim(),
            description: product.value.description?.trim(),
            price: Number(product.value.price),
            imageUrl: product.value.imageUrl?.trim(),
            category: categoryId ? { id: categoryId } : null
        };

        // Validaciones mínimas antes de llamar backend
        if (!payload.name || !payload.description || !payload.price || !payload.category) {
            return { success: false, message: 'Completa todos los campos obligatorios antes de guardar.' };
        }

        const response = await apiClient.post('/product/createProduct', payload);
        console.log('Producto creado:', response.data);
        await getAllProducts(); 
        resetForm();
        return { success: true, message: 'Producto guardado exitosamente.' };
    } catch (error) {
        let backendMsg = 'Error al guardar el producto. Inténtalo de nuevo.';
        if (error.response) {
            backendMsg = error.response.data?.message || backendMsg;
            console.error('Respuesta backend (crear producto):', error.response.status, error.response.data);
        } else {
            console.error('Error al crear producto (sin respuesta):', error);
        }
        return { success: false, message: backendMsg };
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
        products.value = response.data.map(p => 
            new ProductModel(p.id, p.name, p.price, p.description, p.imageUrl, p.active, p.stock, p.category)
        );
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        products.value = [];
    }
};


const updateProduct = async () => {
    if (!product.value.id) return;
    try {
        const payload = { ...product.value };
        if (payload.image) {
            delete payload.image;
        }
        payload.active = product.value.active; // Asegurarse de enviar el estado 'active'
        await apiClient.put(`/product/updateProduct/${product.value.id}`, payload);
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

const desactivateProducto = async (id) => {
  try {
    if (!id) {
      console.error("Error: Se intentó desactivar un producto sin ID.");
      return { success: false, message: 'No se proporcionó ID para desactivar.' };
    }
    await apiClient.put(`/product/desactivateProduct/${id}`);
    return { success: true, message: 'Producto desactivado exitosamente.' };
  } catch (error) {
    console.error(`Error al desactivar el Producto con id ${id}:`, error);
    return { success: false, message: 'Error al desactivar el producto.' };
  }
};





const deleteProduct = async (id) => {
    try {
        await apiClient.delete(`/product/deleteProducto/${id}`);
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

const resetForm = () => {
    product.value = { ...Product, category: { id: null }, category_id: null, price: '' };
};

const prepareEdit = (productToEdit) => {
    product.value = JSON.parse(JSON.stringify(productToEdit));
    if (!product.value.category) {
        product.value.category = { id: null };
        product.value.category_id = null;
    } else {
        product.value.category_id = product.value.category.id;
    }
};

export { 
    product, 
    products, 
    createProduct, 
    getProduct,
    getAllProducts, 
    updateProduct, 
    desactivateProducto,
    deleteProduct, 
    resetForm,
    prepareEdit
};