import { defineStore } from "pinia";

export const useAddToCartStore = defineStore("addToCart", {
  state: () => ({
    productos: [],
  }),

  getters: {

    subtotal: (state) =>
      state.productos.reduce(
        (acc, producto) => acc + producto.cantidad * producto.precio,
        0
      ),

    iva: (state) => {
      return state.subtotal * 0.19;
    },

    totalConIva: (state) => {
      return state.subtotal + state.iva;
    },
  },

  actions: {
    agregarAlCarrito(producto, cantidad = 1) {
      const qty =
        Number.isFinite(Number(cantidad)) && Number(cantidad) > 0
          ? Math.floor(cantidad)
          : 1;
      
      const existing = this.productos.find((p) => p.id === producto.id);
      if (existing) {
        const nuevaCantidad = existing.cantidad + qty;
        existing.cantidad = Math.min(nuevaCantidad, 20);
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

    removerDelCarrito(productoId) {
      this.productos = this.productos.filter((p) => p.id !== productoId);
    },

    limpiarCarrito() {
      this.productos = [];
    },

    incrementarCantidad(productoId) {
      const p = this.productos.find((x) => x.id === productoId);
      if (!p) return;
      if (p.cantidad < 20) { 
        p.cantidad += 1;
        p.subtotal = p.precio * p.cantidad;
      }
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

    actualizarCantidad(productoId, nuevaCantidad) {
      const p = this.productos.find((x) => x.id === productoId);
      if (!p) return;
      if (!Number.isFinite(nuevaCantidad) || nuevaCantidad <= 0) {
        this.removerDelCarrito(productoId);
        return;
      }
      p.cantidad = Math.min(Math.floor(nuevaCantidad), 20);
      p.subtotal = p.precio * p.cantidad;
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.productos));
    },

    loadCart() {
      const saved = localStorage.getItem("cart");
      if (saved) {
        this.productos = JSON.parse(saved);
      }
    }
  },
});
