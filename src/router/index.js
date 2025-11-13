import { createRouter, createWebHistory } from "vue-router";
import AdminView from "../views/adminCreate.vue";
import AdminDeleteView from "../views/adminDelete.vue";
import AdminUpdateView from "../views/adminUpdate.vue";
import AdminSearch from "../views/adminSearch.vue";
import Auth from "../views/Authentication.vue";
import HomeScreen from "../views/HomeScreen.vue";
import CartView from "../views/CartView.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import ProductManagement from "../views/ProductManagement.vue";
import CategoryManagement from "../views/CategoryManagement.vue";
import FinalizarCompra from "../views/FinalizarCompra.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeScreen,
  },
  {
    path: "/admin/create",
    name: "AdminCreate",
    component: AdminView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/delete",
    name: "AdminDelete",
    component: AdminDeleteView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/update",
    name: "AdminUpdate",
    component: AdminUpdateView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/search",
    name: "AdminSearch",
    component: AdminSearch,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
  },
  {
    path: "/admin/products",
    name: "ProductManagement",
    component: ProductManagement,
  },
  {
    path: "/admin/categories",
    name: "CategoryManagement",
    component: CategoryManagement,
  },
  {
    path: "/login",
    name: "Authentication",
    component: Auth,
  },
  {
    path: "/cart",
    name: "Cart",
    component: CartView,
    
  },
  {
    path: "/finalizar/compra",
    name: "FinalizarCompra",
    component: FinalizarCompra,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global para proteger rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token');
  // Si la ruta requiere auth y no hay token, redirigir al login
  if (to.meta && to.meta.requiresAuth && !token) {
    return next({ name: 'Authentication' });
  }
  // Si el usuario ya está autenticado y accede al login, redirigir al dashboard
  if (to.name === 'Authentication' && token) {
    return next({ name: 'AdminCreate' });
  }
  return next();
});

export default router;
