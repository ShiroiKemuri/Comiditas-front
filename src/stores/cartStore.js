// src/stores/cartStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartVMStore = defineStore('cart', () => {
  const items = ref([])

  const addToCart = (product) => {
    items.value.push(product)
  }

  const removeFromCart = (id) => {
    items.value = items.value.filter(p => p.id !== id)
  }

  const clearCart = () => {
    items.value = []
  }

  return { items, addToCart, removeFromCart, clearCart }
})
