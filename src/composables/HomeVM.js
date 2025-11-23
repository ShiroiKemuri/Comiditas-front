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

  const fetchProducts = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiClient.get('/product/getAllProductos', {
        headers: {}
      });
      const apiData = response.data;

      let realData = apiData.map(p => new ProductModel(p.id, p.name, p.price, p.description, p.image));

      let filtered = realData.filter(p => 
        p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
      
      if (selectedFilter.value) {
      }
      
      products.value = filtered;

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