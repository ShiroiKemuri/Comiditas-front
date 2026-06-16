import { ref, computed } from "vue";

const cart = ref([]);

export function useCartVM() {
  const addToCart = (product) => {
    const existing = cart.value.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (productId) => {
    cart.value = cart.value.filter((item) => item.id !== productId);
  };

  const clearCart = () => {
    cart.value = [];
  };

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
