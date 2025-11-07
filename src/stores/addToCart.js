import { defineStore } from "pinia";

export const useAddToCartStore = defineStore("addToCart", {
  state: () => ({
    productos: [], // guardar los productos agregados al carrito
  }),

  getters: {
    total: (state) => {
      // Calcula el subtotal de todos los productos en el carrito
      return state.productos.reduce((acc, item) => acc + item.subtotal, 0);
    },
  },

  actions: {
    agregarAlCarrito(producto) {
      // revisa si el producto ya existe en el carrito
      const existing = this.productos.find((p) => p.id === producto.id);
      if (existing) {
        existing.cantidad += 1;
        existing.subtotal = existing.precio * existing.cantidad;
      } else {
        this.productos.push({
          id: producto.id,
          nombre: producto.name,
          precio: producto.price,
          cantidad: 1,
          subtotal: producto.price,
          imageUrl: producto.imageUrl,
          description: producto.description,
        });
      }
    },

    removerDelCarrito(productoId) {
      // Filtra el array de productos, excluyendo el que coincida con el ID
      this.productos = this.productos.filter((p) => p.id !== productoId);
    },

    limpiarCarrito() {
      this.productos = [];
    },
  },
});
