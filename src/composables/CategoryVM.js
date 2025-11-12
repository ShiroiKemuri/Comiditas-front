import { ref } from 'vue'
import apiClient from '@/api/axiosConfig' 
import CategoryModel from '@/models/CategoryModel'

export const category= ref({...CategoryModel})
export const categories= ref([])

export const createCategory = async () => {
  try {
    const response = await apiClient.post('/category/createCategory', {
        name:category.value.name ,
        description:category.value.description
    })
    category.value.name='';
    category.value.description='';

  } catch (error) {
    console.error('error al crear categoria')
  }
}

export const getCategories = async () => {
    try{
    const response = await apiClient.get('/category/getAllCategories')
      categories.value = response.data
    }
    catch (error) {
      console.error('error al obtener categorias')

    }

  }
