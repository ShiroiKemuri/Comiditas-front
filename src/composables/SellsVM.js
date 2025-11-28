import { ref } from 'vue';
import SellsModel from '@/models/SellsModel';
import apiClient from '@/api/axiosConfig';
import SaleResponseModel from '@/models/SaleResponseModel';

const sells = ref({ ...SellsModel });
const sellsList = ref([]);

const createSell = async (sellsToCreate) => {
    try {
        const response = await apiClient.post('/sells/createSell', sellsToCreate);
        console.log('Venta(s) creada(s):', response.data);
    } catch (error) {
        console.error('Error al crear la(s) venta(s):', error);
    }
};

const getSellById = async (id) => {
    try {
        const response = await apiClient.get(`/sells/getSellById/${id}`);
        sells.value = response.data;
    } catch (error) {
        console.error('Error al obtener la venta por ID:', error);
    }
};

const getAllSells = async () => {
    try {
        const response = await apiClient.get('/sells/getAllSales');
        // Mapeamos la respuesta para asegurar que cada objeto se alinee con el SaleResponseModel.
        sellsList.value = response.data.map(sell => ({
            ...SaleResponseModel, ...sell
        }));
    } catch (error) {
        console.error('Error al obtener todas las ventas:', error);
    }
};

export { sells, sellsList, createSell, getSellById, getAllSells };