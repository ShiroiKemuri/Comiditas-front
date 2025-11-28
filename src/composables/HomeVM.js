import { ref, onMounted, onActivated } from 'vue';
import { ProductModel } from '@/models/ProductModel';
import { useAddToCartStore } from '@/stores/addToCart';
import apiClient from '@/api/axiosConfig';

export function useHomeViewModel() {
  const products = ref([]);
  const searchTerm = ref('');
  const selectedFilter = ref('');
  const isLoading = ref(false);
  const error = ref(null);

  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const token = localStorage.getItem('jwt_token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await apiClient.get('/product/getAllProductos', config);
      const apiData = response.data;

      // Asigna todos los productos. El filtrado se hará en el componente.
      products.value = apiData.map(p => new ProductModel(p.id, p.name, p.price, p.description, p.imageUrl, p.stock, p.category));

    } catch (err) {
      error.value = 'Error al cargar los productos: ' + err.message;
    } finally {
      isLoading.value = false;
    }
  };
  
  const carritoStore = useAddToCartStore();

  const addToCart = (product, cantidad = 1) => {
    carritoStore.agregarAlCarrito(product, cantidad);
  };
  
  onMounted(fetchProducts);

  // Se ejecuta cada vez que el componente es activado (ej. al navegar de vuelta)
  onActivated(fetchProducts);

  const executeSearch = () => {
      fetchProducts();
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