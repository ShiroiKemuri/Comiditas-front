import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAddToCartStore = defineStore('addToCart', () => {
  // State
  const productos = ref([]);

  // Getters (Computed)
  const total = computed(() => {
    return productos.value.reduce((acc, item) => acc + item.subtotal, 0);
  });

  // Actions
  function agregarAlCarrito(producto, cantidad) {
    const existingProduct = productos.value.find(p => p.id === producto.id);

    if (existingProduct) {
      existingProduct.cantidad += cantidad;
      existingProduct.subtotal = existingProduct.cantidad * existingProduct.precio;
    } else {
      productos.value.push({
        ...producto,
        nombre: producto.name, // Aseguramos que el nombre se mapee correctamente
        precio: producto.price, // y el precio
        cantidad: cantidad,
        subtotal: producto.price * cantidad,
      });
    }
  }

  function limpiarCarrito() {
    productos.value = [];
  }

  return { productos, total, agregarAlCarrito, limpiarCarrito };
});