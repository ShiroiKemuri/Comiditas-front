import { ref } from 'vue'
import apiClient from '@/api/axiosConfig' 
import adminModel from '@/models/admin'

const admin = ref({ ...adminModel })

const createAdmin = async () => {
  try {
    const response = await apiClient.post('/admin/createAdmin', admin.value);
    console.log('Admin creado')
  } catch (error) {
    console.error('Error al crear admin:', error)
  }
}

const getAdmin = async () => {
  try {
    const response = await apiClient.get(`/admin/getAdminById/${admin.value.id}`);
    admin.value = response.data;
    
  } catch (error) {
    console.error('Error al obtener admin:', error)
  }
}

const deleteAdmin = async () => {
  try {
    await apiClient.delete(`/admin/deleteAdmin/${admin.value.id}`);
    console.log('Admin eliminado')
  } catch (error) {
    console.error('Error al eliminar admin:', error)
  }
} 

const updateAdmin = async () => {
  try {
    await apiClient.put(`/admin/updateAdmin/${admin.value.id}`, admin.value);
    console.log('Admin actualizado')
  } catch (error) {
    console.error('Error al actualizar admin:', error)
  }
}

export { admin, createAdmin, getAdmin, deleteAdmin, updateAdmin }