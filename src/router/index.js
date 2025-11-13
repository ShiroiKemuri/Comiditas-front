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
  },
  {
    path: "/admin/delete",
    name: "adminDelete",
    component: AdminDeleteView,
  },
  {
    path: "/admin/update",
    name: "adminUpdate",
    component: AdminUpdateView,
  },
  {
    path: "/admin/search",
    name: "adminSearch",
    component: AdminSearch,
  },
  {
    path: "/login",
    name: "authentication",
    component: Auth,
  },
  {
    path: "/cart",
    name: "cart",
    component: CartView,
  },
  {
    path: "/finalizar/compra",
    name: "finalizarCompra",
    component: FinalizarCompra,
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
