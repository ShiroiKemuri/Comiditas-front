import { createRouter, createWebHistory } from "vue-router";

// Admin Imports
import AdminView from "@/views/Admin/adminCreate.vue";
import AdminDeleteView from "@/views/Admin/adminDelete.vue";
import AdminUpdateView from "@/views/Admin/adminUpdate.vue";
import AdminSearch from "@/views/Admin/adminSearch.vue";
import adminDashboard from "@/views/Admin/adminDashboard.vue";

// category imports
import CategoryManagement from "@/views/Category/CategoryManagement.vue";
import CategoryForm from "@/views/Category/CategoryForm.vue";
import CatalogUpdate from "@/views/Category/CategoryUpdate.vue";

// product imports
import ProductManagement from "@/views/Product/ProductManagement.vue";

//Cart import
import CartView from "@/views/Cart/CartView.vue";
import FinalizarCompra from "@/views/Cart/FinalizarCompra.vue";

// Sell import
import SellsManagement from "@/views/Sells/SellsManagement.vue";

// HomeScreen y Login Imports
import Auth from "@/views/Authentication.vue";
import HomeScreen from "@/views/HomeScreen.vue";

// Order imports
import OrderManagement from "@/views/Sells/OrderManagement.vue";

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
    component: adminDashboard,
  },
  {
    path: "/admin/category/management",
    name: "categoryManagement",
    component: CategoryManagement,
  },
  {
    path: "/admin/categories/form",
    name: "categoryForm",
    component: CategoryForm,
  },
  {
    path: "/finalizar-compra",
    name: "FinalizarCompra",
    component: FinalizarCompra,
  },
  {
    path: "/api/orders/today",
    name: "orderManagement",
    component: OrderManagement,
  },
  {
    path: "/admin/product/management",
    name: "productManagement",
    component: ProductManagement,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => next());

export default router;
