import { defineStore } from "pinia";

export const useAddToCartStore = defineStore("addToCart", {
  state: () => ({
    productos: [], // guardar los productos agregados al carrito
  }),

  getters: {
    // 🧮 Calcular el subtotal
    subtotal: (state) =>
      state.productos.reduce(
        (acc, producto) => acc + producto.cantidad * producto.precio,
        0
      ),

    // 💰 Calcular IVA (19%)
    iva: (state) => {
      return state.subtotal * 0.19;
    },

    // 💸 Total final (subtotal + IVA)
    totalConIva: (state) => {
      return state.subtotal + state.iva;
    },
  },

  actions: {
    agregarAlCarrito(producto, cantidad = 1) {
      // cantidad por defecto 1
      const qty =
        Number.isFinite(Number(cantidad)) && Number(cantidad) > 0
          ? Math.floor(cantidad)
          : 1;
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

    removerDelCarrito(productoId) {
      // Filtra el array de productos, excluyendo el que coincida con el ID
      this.productos = this.productos.filter((p) => p.id !== productoId);
    },

    limpiarCarrito() {
      this.productos = [];
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

    // 3️⃣ 🔹 Persistencia (guardar/cargar del localStorage)
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.productos));
    },

    loadCart() {
      const saved = localStorage.getItem("cart");
      if (saved) {
        this.productos = JSON.parse(saved);
      }
    },
    removeItem(id) {
    productos.value = productos.value.filter(p => p.id !== id);
  }
  },
});
