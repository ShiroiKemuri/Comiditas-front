import { createRouter, createWebHistory } from 'vue-router'

// Vistas de cliente
import HomeScreen from '@/views/HomeScreen.vue'
import CartView from '@/views/CartView.vue'

// Vistas de administrador
import AdminView from '@/views/adminCreate.vue'
import AdminDeleteView from '@/views/adminDelete.vue'
import AdminUpdateView from '@/views/adminUpdate.vue'
import AdminSearch from '@/views/adminSearch.vue'

const routes = [
  // 👇 Ruta principal (cliente)
  {
    path: '/',
    name: 'Home',
    component: HomeScreen
  },

  // 👇 Carrito de compras
  {
    path: '/cart',
    name: 'Cart',
    component: CartView
  },

  // 👇 Módulo de administración
  {
    path: '/admin/create',
    name: 'AdminCreate',
    component: AdminView
  },
  {
    path: '/admin/delete',
    name: 'AdminDelete',
    component: AdminDeleteView
  },
  {
    path: '/admin/update',
    name: 'AdminUpdate',
    component: AdminUpdateView
  },
  {
    path: '/admin/search',
    name: 'AdminSearch',
    component: AdminSearch
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
