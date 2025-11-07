import { ref, computed } from "vue";

const cart = ref([]);

export function useCartVM() {
  // Agregar producto al carrito
  const addToCart = (product) => {
    const existing = cart.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  };

  // Eliminar producto
  const removeFromCart = (productId) => {
    cart.value = cart.value.filter((item) => item.id !== productId);
  };

  // Vaciar carrito
  const clearCart = () => {
    cart.value = [];
  };

  // Total del carrito
  const total = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    total,
  };
}
