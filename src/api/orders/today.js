import { ref } from "vue";
import Order from "@/models/Order";
import apiClient from "@/api/axiosConfig";

const order = ref({ ...Order });
const orders = ref([]);

const getOrders = async () => {
  try {
    const response = await apiClient.get("/orders/today");
    orders.value = response.data;
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
  }
};

export { order, orders, getOrders };
