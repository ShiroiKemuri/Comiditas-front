import { createRouter, createWebHistory } from "vue-router";
import AdminView from "@/views/adminCreate.vue";
import AdminDeleteView from "@/views/adminDelete.vue";
import AdminUpdateView from "@/views/adminUpdate.vue";
import AdminSearch from "@/views/adminSearch.vue";
import Auth from "@/views/Authentication.vue";
import HomeScreen from "@/views/HomeScreen.vue";
import CartView from "@/views/CartView.vue";
import FinalizarCompra from "@/views/FinalizarCompra.vue";
import CatalogUpdate from "@/views/CatalogUpdate.vue";
import AdminDashboard from "@/views/AdminDashboard.vue";
import ProductManagement from "@/views/ProductManagement.vue";
import CategoryManagement from "@/views/CategoryManagement.vue";
import CategoryForm from "../views/CategoryForm.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeScreen,
  },
  {
    path: "/admin/create",
    name: "adminCreate",
    component: AdminView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/delete",
    name: "adminDelete",
    component: AdminDeleteView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/update",
    name: "adminUpdate",
    component: AdminUpdateView,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/search",
    name: "adminSearch",
    component: AdminSearch,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login", 
    component: Auth,
  },
  {
    path: "/cart",
    name: "cart",
    component: CartView,
    
  },
  {
    path: "/admin/category/update/:id",
    name: "catalogUpdate",
    component: CatalogUpdate,
  },
  {
    path: "/admin/dashboard",
    name: "adminDashboard",
    component: AdminDashboard,
  },
  {
    path: "/admin/category/management",
    name: "categoryManagement",
    component: CategoryManagement,
  },
  {
    path: '/admin/categories/form',
    name: 'categoryForm',
    component: CategoryForm,
  },
  {
    path: '/finalizar-compra',
    name: 'FinalizarCompra',
    component: FinalizarCompra
  },
  {
    path: '/admin/product/management',
    name: 'productManagement',
    component: ProductManagement
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('jwt_token');
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' });
  }

  if (to.name === 'login' && token) {
    return next({ name: 'adminDashboard' });
  }
  return next();
});

export default router;
