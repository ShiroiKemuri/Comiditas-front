import { ref, onMounted } from 'vue';
import { ProductModel } from '../models/ProductModel';
import { useAddToCartStore } from '../stores/addToCart';
import apiClient from '../api/axiosConfig';

// Simulación de una API de backend


// const MOCK_API_URL = '/api/products'; 



export function useHomeViewModel() {
  const products = ref([]);
  const searchTerm = ref('');
  const selectedFilter = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  // Función para obtener productos del Backend (Simulación de RestController)
  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Llamada real a la API, pero sin enviar el token de autenticación.
      // Se pasa un objeto de configuración vacío para evitar que axios intercepte
      // y añada la cabecera 'Authorization' de forma automática.
      const response = await apiClient.get('/product/getAllProductos', {
        headers: {}
      });
      const apiData = response.data;

      // Mapear los datos de la API a instancias de ProductModel
      let realData = apiData.map(p => new ProductModel(p.id, p.name, p.price, p.description, p.image));

      // Aplicar búsqueda y filtro aquí (Lógica de negocio del Service)
      let filtered = realData.filter(p => 
        p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
      
      if (selectedFilter.value) {
          // Lógica de filtrado por categoría o precio (a expandir)
          // filtered = filtered.filter(p => p.category === selectedFilter.value); 
      }
      
      products.value = filtered;

    } catch (err) {
      error.value = 'Error al cargar los productos: ' + err.message;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Función de la acción "Agregar al carrito"
  const carritoStore = useAddToCartStore();

  const addToCart = (product, cantidad = 1) => {
    carritoStore.agregarAlCarrito(product, cantidad);
  };
  
  // Llama a cargar los productos al inicio
  onMounted(fetchProducts);

  // Permite ejecutar la búsqueda al presionar el botón
  const executeSearch = () => {
      fetchProducts(); // Refresca la lista con el término de búsqueda y el filtro
  }

  return {
    products,
    searchTerm,
    selectedFilter,
    isLoading,
    error,
    executeSearch,
    addToCart
  };
}