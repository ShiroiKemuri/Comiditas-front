import { ref, onMounted } from 'vue';
import { ProductModel } from '../models/ProductModel';
import { useAddToCartStore } from '../stores/addToCart';
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
      // Simulación de llamada a RestController (Backend)
      
      const mockData = [
        new ProductModel(
          'Hamburguesa Clásica', 
          'Hamburguesa Clásica', 
          15000, 
          'Carne, queso, lechuga, tomate.', 
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500'
        ),
        new ProductModel(
          'Papas Fritas', 
          'Papas Fritas', 
          6000, 
          'Porción de papas grandes.', 
          'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&q=80&w=500'
        ),
        new ProductModel(
          'Pizza Margherita', 
          'Pizza Margherita', 
          18000, 
          'Pizza con salsa de tomate, mozzarella y albahaca.', 
          'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500'
        ),
        new ProductModel(
          'Ensalada César',
          'Ensalada César',
          12000,
          'Lechuga romana, crutones, pollo y aderezo césar.',
          'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=500'
        ),
        new ProductModel(
          'Pasta Alfredo',
          'Pasta Alfredo',
          16000,
          'Fettuccine en salsa cremosa con parmesano.',
          'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=500'
        )
      ];

      // Aplicar búsqueda y filtro aquí (Lógica de negocio del Service)
      let filtered = mockData.filter(p => 
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