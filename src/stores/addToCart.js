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
    agregarAlCarrito(producto, cantidad = 1) {
      // cantidad por defecto 1
      const qty = Number.isFinite(Number(cantidad)) && Number(cantidad) > 0 ? Math.floor(cantidad) : 1;
      // revisa si el producto ya existe en el carrito
      const existing = this.productos.find((p) => p.id === producto.id);
      if (existing) {
        existing.cantidad += qty;
        existing.subtotal = existing.precio * existing.cantidad;
      } else {
        this.productos.push({
          id: producto.id,
          nombre: producto.name,
          precio: producto.price,
          cantidad: qty,
          subtotal: producto.price * qty,
          imageUrl: producto.imageUrl,
          description: producto.description,
        });
      }
    },

    actualizarCantidad(productoId, nuevaCantidad) {
      const p = this.productos.find((x) => x.id === productoId);
      if (!p) return;
      // Si la cantidad es 0 o menor, removemos el producto
      if (!Number.isFinite(nuevaCantidad) || nuevaCantidad <= 0) {
        this.removerDelCarrito(productoId);
        return;
      }
      p.cantidad = Math.floor(nuevaCantidad);
      p.subtotal = p.precio * p.cantidad;
    },

    incrementarCantidad(productoId) {
      const p = this.productos.find((x) => x.id === productoId);
      if (!p) return;
      p.cantidad += 1;
      p.subtotal = p.precio * p.cantidad;
    },

    decrementarCantidad(productoId) {
      const p = this.productos.find((x) => x.id === productoId);
      if (!p) return;
      p.cantidad -= 1;
      if (p.cantidad <= 0) {
        this.removerDelCarrito(productoId);
        return;
      }
      p.subtotal = p.precio * p.cantidad;
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
