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
import CategoryForm from "../views/CategoryForm.vue";

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
  },
  {
    path: "/admin/delete",
    name: "AdminDelete",
    component: AdminDeleteView,
  },
  {
    path: "/admin/update",
    name: "AdminUpdate",
    component: AdminUpdateView,
  },
  {
    path: "/admin/search",
    name: "AdminSearch",
    component: AdminSearch,
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
