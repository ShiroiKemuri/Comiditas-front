import { createRouter, createWebHistory } from "vue-router";
import AdminView from "@/views/adminCreate.vue";
import AdminDeleteView from "@/views/adminDelete.vue";
import AdminUpdateView from "@/views/adminUpdate.vue";
import AdminSearch from "@/views/adminSearch.vue";
import Auth from "@/views/Authentication.vue";
import HomeScreen from "@/views/HomeScreen.vue";
import CartView from "@/views/CartView.vue";
import FinalizarCompra from "@/views/FinalizarCompra.vue";

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
  {},
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
    path: "/Login",
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

export default router;
