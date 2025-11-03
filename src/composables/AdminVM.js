import { ref } from 'vue'
import axios from 'axios'
import adminModel from '@/models/admin'

const admin = ref({ ...adminModel })

const createAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:8085/admin/createAdmin', admin.value)
    console.log('Admin creado')
  } catch (error) {
    console.error('Error al crear admin:', error)
  }
}

const getAdmin = async () => {
  try {
    const response = await axios.get(`http://localhost:8085/admin/getAdminById/${admin.value.id}`)
    admin.value = await response.json()
    
  } catch (error) {
    console.error('Error al obtener admin:', error)
  }
}

const deleteAdmin = async () => {
  try {
    await axios.delete(`http://localhost:8085/admin/deleteAdmin/${admin.value.id}`)
    console.log('Admin eliminado')
  } catch (error) {
    console.error('Error al eliminar admin:', error)
  }
} 

const updateAdmin = async () => {
  try {
    await axios.put(`http://localhost:8085/admin/updateAdmin/${admin.value.id}`, admin.value)
    console.log('Admin actualizado')
  } catch (error) {
    console.error('Error al actualizar admin:', error)
  }
}

export { admin, createAdmin, getAdmin, deleteAdmin, updateAdmin }